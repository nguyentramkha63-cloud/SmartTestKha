import JSZip from 'jszip';
import * as pdfjsLib from 'pdfjs-dist';
import type { ExamData, Question, MCQOption, TFSubQuestion, SASubQuestion } from '../types';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

// Initialize PDF.js worker if available
try {
  if (typeof window !== 'undefined' && pdfjsLib) {
    // @ts-ignore
    if (!pdfjsLib.GlobalWorkerOptions?.workerSrc) {
      // @ts-ignore
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.0.379'}/build/pdf.worker.min.mjs`;
    }
  }
} catch (_) {}

/**
 * Extract raw text from Word (.docx) file using JSZip
 */
export async function extractTextFromDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  
  // Read document.xml
  const docXmlFile = zip.file('word/document.xml');
  if (!docXmlFile) {
    throw new Error('File Word không hợp lệ hoặc không chứa nội dung văn bản (word/document.xml).');
  }

  const xmlText = await docXmlFile.async('string');
  
  // Parse paragraphs and text nodes
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
  
  // Collect all w:p (paragraphs)
  const paragraphs = xmlDoc.getElementsByTagName('w:p');
  const lines: string[] = [];

  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    const textNodes = p.getElementsByTagName('w:t');
    let lineText = '';
    for (let j = 0; j < textNodes.length; j++) {
      lineText += textNodes[j].textContent || '';
    }
    if (lineText.trim()) {
      lines.push(lineText.trim());
    }
  }

  if (lines.length === 0) {
    // Fallback: regex match <w:t> tags
    const matches = xmlText.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
    if (matches) {
      return matches.map(m => m.replace(/<[^>]+>/g, '')).join(' ');
    }
  }

  return lines.join('\n');
}

/**
 * Extract text from PDF file using PDF.js
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  // @ts-ignore
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const pageTexts: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    // Join items with appropriate line breaks
    let lastY: number | null = null;
    let pageText = '';
    
    for (const item of content.items as any[]) {
      if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
        pageText += '\n';
      } else if (pageText.length > 0 && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
        pageText += ' ';
      }
      pageText += item.str;
      lastY = item.transform[5];
    }
    pageTexts.push(pageText.trim());
  }

  return pageTexts.join('\n\n--- Trang tiếp ---\n\n');
}

/**
 * Extract raw text based on file extension
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith('.docx')) {
    return await extractTextFromDocx(file);
  } else if (name.endsWith('.pdf')) {
    return await extractTextFromPdf(file);
  } else if (name.endsWith('.txt') || name.endsWith('.json') || name.endsWith('.md')) {
    return await file.text();
  } else {
    // Attempt standard text read
    return await file.text();
  }
}

/**
 * Offline rule-based parser for Vietnamese GDPT 2018 exams
 */
export function parseExamOffline(rawText: string, fallbackSubject = 'Toán', fallbackGrade = 'Khối 12'): ExamData {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  
  // Extract Title, Subject, Grade, Duration
  let title = 'ĐỀ KIỂM TRA TẢI LÊN TỪ NGUỒN KHÁC';
  let subject = fallbackSubject;
  let grade = fallbackGrade;
  let duration = 45;

  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i];
    const upper = line.toUpperCase();
    if (upper.includes('ĐỀ KIỂM TRA') || upper.includes('BÀI KIỂM TRA') || upper.includes('ĐỀ THI')) {
      title = line;
    }
    if (upper.includes('MÔN:') || upper.includes('MÔN ')) {
      const match = line.match(/môn:?\s*([a-zA-ZÀ-ỹ\s]+)/i);
      if (match && match[1]) subject = match[1].trim();
    }
    if (upper.includes('LỚP') || upper.includes('KHỐI')) {
      const gMatch = line.match(/(lớp|khối)\s*(\d{1,2})/i);
      if (gMatch && gMatch[2]) grade = `Khối ${gMatch[2]}`;
    }
    if (upper.includes('THỜI GIAN') || upper.includes('PHÚT')) {
      const tMatch = line.match(/(\d{2,3})\s*phút/i);
      if (tMatch && tMatch[1]) duration = parseInt(tMatch[1], 10);
    }
  }

  // Answer Key detection at the bottom (e.g. 1.A 2.B or 1-A, 2-B)
  const answersMap: Record<number, string> = {};
  const ansKeyRegex = /(?:câu\s*)?(\d+)[\.\s:\-_]+([A-D]|[a-d]|Đ|S|đ|s)/gi;
  let match;
  while ((match = ansKeyRegex.exec(rawText)) !== null) {
    const qNum = parseInt(match[1], 10);
    answersMap[qNum] = match[2].toUpperCase();
  }

  // Parse questions by "Câu X"
  const questions: Question[] = [];
  const questionBlocks: { num: number; section: 'MCQ' | 'TF' | 'SA' | 'TL'; text: string }[] = [];
  
  let currentSection: 'MCQ' | 'TF' | 'SA' | 'TL' = 'MCQ';
  let currentNum = 1;
  let currentBuffer: string[] = [];

  const flushBuffer = () => {
    if (currentBuffer.length > 0) {
      questionBlocks.push({
        num: currentNum,
        section: currentSection,
        text: currentBuffer.join('\n')
      });
      currentBuffer = [];
    }
  };

  for (const line of lines) {
    const upper = line.toUpperCase();
    // Detect section changes
    if (upper.includes('PHẦN I') || upper.includes('PHẦN 1') || upper.includes('TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN')) {
      flushBuffer();
      currentSection = 'MCQ';
      continue;
    }
    if (upper.includes('PHẦN II') || upper.includes('PHẦN 2') || upper.includes('ĐÚNG SAI') || upper.includes('ĐÚNG/SAI')) {
      flushBuffer();
      currentSection = 'TF';
      continue;
    }
    if (upper.includes('PHẦN III') || upper.includes('PHẦN 3') || upper.includes('TRẢ LỜI NGẮN')) {
      flushBuffer();
      currentSection = 'SA';
      continue;
    }
    if (upper.includes('PHẦN IV') || upper.includes('PHẦN 4') || upper.includes('TỰ LUẬN')) {
      flushBuffer();
      currentSection = 'TL';
      continue;
    }

    // Detect question start: "Câu 1.", "Câu 1:", "Bài 1:"
    const qStartMatch = line.match(/^(?:Câu|Bài)\s*(\d+)[\.:\s\-]/i);
    if (qStartMatch) {
      flushBuffer();
      currentNum = parseInt(qStartMatch[1], 10);
      currentBuffer.push(line);
    } else {
      currentBuffer.push(line);
    }
  }
  flushBuffer();

  // Convert blocks to Questions
  questionBlocks.forEach((block, idx) => {
    const blockText = block.text;
    const qId = `q_up_${Date.now()}_${idx + 1}`;

    if (block.section === 'MCQ') {
      // Find options A, B, C, D
      const optA = blockText.match(/(?:^|\n|\s)A[\.\)]\s*([^\n]+?)(?=(?:\s[B-D][\.\)]|\n[B-D][\.\)]|$))/);
      const optB = blockText.match(/(?:^|\n|\s)B[\.\)]\s*([^\n]+?)(?=(?:\s[C-D][\.\)]|\n[C-D][\.\)]|$))/);
      const optC = blockText.match(/(?:^|\n|\s)C[\.\)]\s*([^\n]+?)(?=(?:\s[D][\.\)]|\n[D][\.\)]|$))/);
      const optD = blockText.match(/(?:^|\n|\s)D[\.\)]\s*([^\n]+?)$/);

      // Question body is everything before "A."
      let content = blockText;
      const firstOptIndex = blockText.search(/(?:^|\n|\s)A[\.\)]/);
      if (firstOptIndex !== -1) {
        content = blockText.substring(0, firstOptIndex).trim();
      }

      // Clean leading "Câu X."
      content = content.replace(/^(?:Câu|Bài)\s*\d+[\.:\s\-]+/i, '').trim();

      const correctLetter = answersMap[block.num] || 'A';
      const options: MCQOption[] = [
        { id: 'A', text: optA ? optA[1].trim() : 'Phương án A', isCorrect: correctLetter === 'A' },
        { id: 'B', text: optB ? optB[1].trim() : 'Phương án B', isCorrect: correctLetter === 'B' },
        { id: 'C', text: optC ? optC[1].trim() : 'Phương án C', isCorrect: correctLetter === 'C' },
        { id: 'D', text: optD ? optD[1].trim() : 'Phương án D', isCorrect: correctLetter === 'D' },
      ];

      questions.push({
        id: qId,
        type: 'MCQ',
        level: 'THÔNG HIỂU',
        content: content || `Câu hỏi ${block.num}`,
        points: 0.25,
        options
      });
    } else if (block.section === 'TF') {
      // Extract sub-questions a), b), c), d)
      const subA = blockText.match(/(?:^|\n|\s)a[\)\.]\s*([^\n]+?)(?=(?:\s[b-d][\)\.]|\n[b-d][\)\.]|$))/i);
      const subB = blockText.match(/(?:^|\n|\s)b[\)\.]\s*([^\n]+?)(?=(?:\s[c-d][\)\.]|\n[c-d][\)\.]|$))/i);
      const subC = blockText.match(/(?:^|\n|\s)c[\)\.]\s*([^\n]+?)(?=(?:\s[d][\)\.]|\n[d][\)\.]|$))/i);
      const subD = blockText.match(/(?:^|\n|\s)d[\)\.]\s*([^\n]+?)$/i);

      let content = blockText;
      const firstSubIndex = blockText.search(/(?:^|\n|\s)a[\)\.]/i);
      if (firstSubIndex !== -1) {
        content = blockText.substring(0, firstSubIndex).trim();
      }
      content = content.replace(/^(?:Câu|Bài)\s*\d+[\.:\s\-]+/i, '').trim();

      const tfSubQuestions: TFSubQuestion[] = [
        { id: 'a', text: subA ? subA[1].trim() : 'Ý mệnh đề a', isCorrect: true },
        { id: 'b', text: subB ? subB[1].trim() : 'Ý mệnh đề b', isCorrect: false },
        { id: 'c', text: subC ? subC[1].trim() : 'Ý mệnh đề c', isCorrect: true },
        { id: 'd', text: subD ? subD[1].trim() : 'Ý mệnh đề d', isCorrect: false },
      ];

      questions.push({
        id: qId,
        type: 'TF',
        level: 'THÔNG HIỂU',
        content: content || `Câu hỏi Đúng/Sai ${block.num}`,
        points: 1.0,
        tfSubQuestions
      });
    } else if (block.section === 'SA') {
      let content = blockText.replace(/^(?:Câu|Bài)\s*\d+[\.:\s\-]+/i, '').trim();
      const ansMatch = content.match(/(?:Đáp án|Đáp số|Kết quả):?\s*([^\n]+)/i);
      let ansVal = '';
      if (ansMatch) {
        ansVal = ansMatch[1].trim();
        content = content.replace(ansMatch[0], '').trim();
      }

      const saSubQuestions: SASubQuestion[] = [
        { id: '1', text: content, answer: ansVal || '1' }
      ];

      questions.push({
        id: qId,
        type: 'SA',
        level: 'VẬN DỤNG',
        content: content || `Câu hỏi trả lời ngắn ${block.num}`,
        points: 0.5,
        saSubQuestions
      });
    } else {
      // TL - Tự luận
      let content = blockText.replace(/^(?:Câu|Bài)\s*\d+[\.:\s\-]+/i, '').trim();
      questions.push({
        id: qId,
        type: 'TL',
        level: 'VẬN DỤNG',
        content: content || `Câu hỏi tự luận ${block.num}`,
        points: 1.0,
        solution: 'Hướng dẫn giải chi tiết cho câu hỏi tự luận.'
      });
    }
  });

  // If no questions were parsed by regex, generate at least 1 preview question from raw text
  if (questions.length === 0) {
    questions.push({
      id: `q_up_${Date.now()}_1`,
      type: 'MCQ',
      level: 'THÔNG HIỂU',
      content: rawText.substring(0, 300) || 'Nội dung đề thi tải lên',
      points: 1.0,
      options: [
        { id: 'A', text: 'Đáp án A', isCorrect: true },
        { id: 'B', text: 'Đáp án B', isCorrect: false },
        { id: 'C', text: 'Đáp án C', isCorrect: false },
        { id: 'D', text: 'Đáp án D', isCorrect: false }
      ]
    });
  }

  return {
    title,
    subject,
    grade,
    duration,
    bookSeries: 'Kết nối tri thức với cuộc sống',
    questions,
    topics: [subject],
    code: '101'
  };
}

/**
 * AI-powered smart parser using Gemini
 */
export async function parseExamWithAI(rawText: string, apiKey: string): Promise<ExamData> {
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
Bạn là chuyên gia khảo thí Việt Nam. Hãy đọc kỹ văn bản đề thi sau đây và trích xuất TOÀN BỘ nội dung đề thi, các phần thi, từng câu hỏi, loại câu hỏi và đáp án chính xác theo chuẩn GDPT 2018.

VĂN BẢN ĐỀ THI ĐẦU VÀO:
"""
${rawText.slice(0, 45000)}
"""

HÃY TRẢ VỀ DUY NHẤT 1 ĐỐI TƯỢNG JSON CÓ CẤU TRÚC SAU:
{
  "title": "Tên đề thi (ví dụ: ĐỀ KIỂM TRA ĐỊNH KỲ MÔN TOÁN 12)",
  "subject": "Tên môn học (Toán, Vật lí, Hóa học, Sinh học, Lịch sử, Địa lí, GDCD, Tin học, Tiếng Anh, Công nghệ, Ngữ văn,...)",
  "grade": "Khối lớp (Khối 6, Khối 7, Khối 8, Khối 9, Khối 10, Khối 11 hoặc Khối 12)",
  "duration": 45, // Số phút làm bài (số nguyên)
  "questions": [
    // Mỗi câu hỏi gồm:
    // id: string ngẫu nhiên duy nhất
    // type: "MCQ" | "TF" | "SA" | "TL"
    // level: "NHẬN BIẾT" | "THÔNG HIỂU" | "VẬN DỤNG"
    // content: "Nội dung câu hỏi. Giữ nguyên công thức toán dạng LaTeX $...$"
    // points: số điểm (ví dụ: MCQ: 0.25, TF: 1.0, SA: 0.5, TL: 1.0)
    
    // Nếu type là "MCQ" (Trắc nghiệm nhiều lựa chọn 4 phương án):
    // options: [
    //   { "id": "A", "text": "Nội dung A", "isCorrect": true/false },
    //   { "id": "B", "text": "Nội dung B", "isCorrect": true/false },
    //   { "id": "C", "text": "Nội dung C", "isCorrect": true/false },
    //   { "id": "D", "text": "Nội dung D", "isCorrect": true/false }
    // ]
    
    // Nếu type là "TF" (Trắc nghiệm Đúng/Sai với 4 lệnh hỏi a, b, c, d):
    // tfSubQuestions: [
    //   { "id": "a", "text": "Nội dung ý a", "isCorrect": true/false }, // true là Đúng, false là Sai
    //   { "id": "b", "text": "Nội dung ý b", "isCorrect": true/false },
    //   { "id": "c", "text": "Nội dung ý c", "isCorrect": true/false },
    //   { "id": "d", "text": "Nội dung ý d", "isCorrect": true/false }
    // ]

    // Nếu type là "SA" (Trắc nghiệm trả lời ngắn):
    // saSubQuestions: [
    //   { "id": "1", "text": "Lệnh hỏi", "answer": "Đáp án ngắn chính xác (số, phân số hoặc từ khóa)" }
    // ]

    // Nếu type là "TL" (Tự luận):
    // solution: "Hướng dẫn giải chi tiết / Đáp án"
  ]
}

LƯU Ý QUAN TRỌNG:
1. Đọc kỹ bảng đáp án ở cuối đề (nếu có) để gắn chính xác isCorrect cho từng câu/từng ý.
2. Tuyệt đối không bỏ sót câu hỏi nào trong đề.
3. Giữ nguyên các công thức Toán/Lý/Hóa dưới dạng LaTeX $...$.
4. Chỉ trả về JSON hợp lệ, không bọc markdown hay thêm bất kỳ lời dẫn nào.
`;

  const CANDIDATE_MODELS = [
    "gemini-flash-latest",
    "gemini-3.8-flash",
    "gemini-3.1-flash-lite"
  ];

  let lastErr = null;
  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text || '';
      let cleanJson = responseText.trim();
      const codeBlockMatch = cleanJson.match(/```json\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch) {
        cleanJson = codeBlockMatch[1].trim();
      } else {
        const genericMatch = cleanJson.match(/```\s*([\s\S]*?)\s*```/);
        if (genericMatch) cleanJson = genericMatch[1].trim();
      }

      const parsed = JSON.parse(cleanJson);
      if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        return {
          title: parsed.title || 'Đề thi tải lên từ nguồn khác',
          subject: parsed.subject || 'Toán',
          grade: parsed.grade || 'Khối 12',
          duration: Number(parsed.duration) || 45,
          bookSeries: 'Kết nối tri thức với cuộc sống',
          questions: parsed.questions,
          topics: [parsed.subject || 'Đề tải lên'],
          code: '101'
        };
      }
    } catch (err) {
      console.warn(`Model ${model} extraction error:`, err);
      lastErr = err;
    }
  }

  throw lastErr || new Error('Không thể trích xuất đề thi bằng AI');
}
