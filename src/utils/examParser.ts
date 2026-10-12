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
 * Helper to clean exam text and separate Header Metadata, Questions, and Footer/Answer Key
 */
export function partitionExamContent(rawText: string, fallbackSubject = 'Toán', fallbackGrade = 'Khối 12') {
  const allLines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

  let title = 'ĐỀ KIỂM TRA TẢI LÊN TỪ NGUỒN KHÁC';
  let subject = fallbackSubject;
  let grade = fallbackGrade;
  let duration = 45;
  let code = '101';
  let school = '';

  // 1. Identify Preamble Lines (before first question / section)
  let firstQuestionIndex = -1;
  let footerStartIndex = -1;

  for (let i = 0; i < allLines.length; i++) {
    const line = allLines[i];
    const upper = line.toUpperCase();

    // Check if question section begins
    const isSectionHeader = /^(?:PHẦN|Phần)\s*(?:I|1|II|2|III|3|IV|4)\b/i.test(line) ||
                            /^[I|1]\.\s*(?:TRẮC NGHIỆM|PHẦN TRẮC NGHIỆM)/i.test(line);
    const isQuestionStart = /^(?:Câu|Bài)\s*\d+[\.:\s\-]/i.test(line);

    if (firstQuestionIndex === -1 && (isSectionHeader || isQuestionStart)) {
      firstQuestionIndex = i;
      break;
    }
  }

  // If no clear marker found, fallback to scanning from start
  const preambleEnd = firstQuestionIndex !== -1 ? firstQuestionIndex : Math.min(15, allLines.length);
  const preambleLines = allLines.slice(0, preambleEnd);

  // Extract Metadata from Preamble
  for (const line of preambleLines) {
    const upper = line.toUpperCase();

    if (upper.includes('TRƯỜNG THPT') || upper.includes('TRƯỜNG THCS') || upper.includes('TRƯỜNG TIỂU HỌC') || upper.includes('SỞ GD') || upper.includes('SỞ GIÁO DỤC')) {
      school = line;
    }
    if (upper.includes('ĐỀ KIỂM TRA') || upper.includes('BÀI KIỂM TRA') || upper.includes('ĐỀ THI') || upper.includes('KHẢO SÁT CHẤT LƯỢNG')) {
      title = line;
    }
    if (upper.includes('MÔN:') || upper.includes('MÔN ')) {
      const match = line.match(/môn:?\s*([a-zA-ZÀ-ỹ\s&]+)/i);
      if (match && match[1]) {
        const cleanSub = match[1].replace(/[-–].*$/, '').trim();
        if (cleanSub.length >= 2) subject = cleanSub;
      }
    }
    if (upper.includes('LỚP') || upper.includes('KHỐI')) {
      const gMatch = line.match(/(?:lớp|khối)\s*(\d{1,2})/i);
      if (gMatch && gMatch[1]) grade = `Khối ${gMatch[1]}`;
    }
    if (upper.includes('THỜI GIAN') || upper.includes('PHÚT')) {
      const tMatch = line.match(/(\d{2,3})\s*phút/i);
      if (tMatch && tMatch[1]) duration = parseInt(tMatch[1], 10);
    }
    if (upper.includes('MÃ ĐỀ') || upper.includes('MÃ ĐỀ THI')) {
      const cMatch = line.match(/mã\s*đề(?:\s*thi)?\s*[:\.]?\s*([a-zA-Z0-9]+)/i);
      if (cMatch && cMatch[1]) code = cMatch[1].trim();
    }
  }

  // 2. Identify Footer / Answer Key lines
  const contentStartIndex = firstQuestionIndex !== -1 ? firstQuestionIndex : 0;
  const contentCandidateLines = allLines.slice(contentStartIndex);

  for (let i = 0; i < contentCandidateLines.length; i++) {
    const line = contentCandidateLines[i];
    const upper = line.toUpperCase();

    const isEndMarker = /^(?:--+|—+|══+)?\s*(?:HẾT|THE END)\s*(?:--+|—+|══+)?$/i.test(line) ||
                        /^thí sinh không được sử dụng tài liệu/i.test(line) ||
                        /^cán bộ coi thi không giải thích/i.test(line) ||
                        /^giám thị không giải thích/i.test(line) ||
                        /^(?:bảng\s+)?đáp\s+án(?:\s*chi\s*tiết)?/i.test(line) ||
                        /^(?:hướng dẫn|lời giải)\s+(?:chấm|giải|chi tiết)/i.test(line);

    if (isEndMarker) {
      footerStartIndex = i;
      break;
    }
  }

  let questionLines: string[] = [];
  let footerLines: string[] = [];

  if (footerStartIndex !== -1) {
    questionLines = contentCandidateLines.slice(0, footerStartIndex);
    footerLines = contentCandidateLines.slice(footerStartIndex);
  } else {
    questionLines = contentCandidateLines;
  }

  // Parse Answer Map from Footer and full text
  const fullTextToScan = [...footerLines, ...allLines].join('\n');
  const answersMap: Record<number, string> = {};
  const ansKeyRegex = /(?:câu\s*)?(\d+)[\.\s:\-_]+([A-D]|[a-d]|Đ|S|đ|s)/gi;
  let match;
  while ((match = ansKeyRegex.exec(fullTextToScan)) !== null) {
    const qNum = parseInt(match[1], 10);
    // Don't overwrite if already detected from a closer answer table
    if (!answersMap[qNum]) {
      answersMap[qNum] = match[2].toUpperCase();
    }
  }

  return {
    meta: { title, subject, grade, duration, code, school },
    questionLines,
    footerLines,
    answersMap
  };
}

/**
 * Check if a text line is purely administrative noise or section instruction
 */
function isIgnorableNoise(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return true;

  // Page numbers, document structure
  if (/^trang\s+\d+(?:\s*\/\s*\d+)?/i.test(trimmed)) return true;
  if (/^\(?đề thi có \d+ trang\)?/i.test(trimmed)) return true;
  if (/^mã đề(?:\s*thi)?\s*[:\.]?\s*[a-zA-Z0-9]+$/i.test(trimmed)) return true;

  // Administrative student info
  if (/^họ(?:\s*và)?\s*tên(?:\s*thí sinh|\s*học sinh)?\s*[:\.]/i.test(trimmed)) return true;
  if (/^(?:số báo danh|sbd)\s*[:\.]/i.test(trimmed)) return true;
  if (/^(?:phòng thi|chữ ký giám thị|giám thị \d)\s*[:\.]/i.test(trimmed)) return true;

  // Section intro instructions (not questions)
  if (/^thí sinh trả lời từ câu \d+ đến câu \d+/i.test(trimmed)) return true;
  if (/^mỗi câu hỏi(?: thí sinh)? chỉ chọn một phương án/i.test(trimmed)) return true;
  if (/^trong mỗi ý a\),? b\),? c\),? d\) ở mỗi câu/i.test(trimmed)) return true;
  if (/^từ câu \d+ đến câu \d+.*mỗi câu/i.test(trimmed)) return true;

  return false;
}

/**
 * Offline rule-based parser for Vietnamese GDPT 2018 exams
 * Intelligently strips school headers, metadata boxes, and footer answer tables
 */
export function parseExamOffline(rawText: string, fallbackSubject = 'Toán', fallbackGrade = 'Khối 12'): ExamData {
  const { meta, questionLines, answersMap } = partitionExamContent(rawText, fallbackSubject, fallbackGrade);
  
  const title = meta.title;
  const subject = meta.subject;
  const grade = meta.grade;
  const duration = meta.duration;
  const code = meta.code;

  // Parse questions by "Câu X" or "Bài X"
  const questions: Question[] = [];
  const questionBlocks: { num: number; section: 'MCQ' | 'TF' | 'SA' | 'TL'; text: string }[] = [];
  
  let currentSection: 'MCQ' | 'TF' | 'SA' | 'TL' = 'MCQ';
  let currentNum = 1;
  let currentBuffer: string[] = [];
  let hasStartedFirstQuestion = false;

  const flushBuffer = () => {
    if (hasStartedFirstQuestion && currentBuffer.length > 0) {
      const fullText = currentBuffer.join('\n').trim();
      // Verify block is not purely administrative headers
      const isHeaderTrash = /^(?:sở giáo dục|trường thpt|kỳ thi khảo sát|họ và tên|số báo danh)/i.test(fullText);
      if (!isHeaderTrash && fullText.length >= 8) {
        questionBlocks.push({
          num: currentNum,
          section: currentSection,
          text: fullText
        });
      }
      currentBuffer = [];
    }
  };

  for (const line of questionLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const upper = trimmed.toUpperCase();

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

    // Skip ignorable noise lines
    if (isIgnorableNoise(trimmed)) {
      continue;
    }

    // Detect question start: "Câu 1.", "Câu 1:", "Bài 1:", "Câu 01."
    const qStartMatch = trimmed.match(/^(?:Câu|Bài)\s*(\d+)[\.:\s\-]/i);
    if (qStartMatch) {
      flushBuffer();
      hasStartedFirstQuestion = true;
      currentNum = parseInt(qStartMatch[1], 10);
      currentBuffer.push(trimmed);
    } else {
      // Only buffer if question has started! (Ignore any leftover preamble lines)
      if (hasStartedFirstQuestion) {
        currentBuffer.push(trimmed);
      }
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

      const correctLetter = answersMap[block.num] || answersMap[idx + 1] || 'A';
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
    code: code || '101'
  };
}

/**
 * Filter out any questions that are actually administrative noise, section intros, or answer tables
 */
function filterExtractedQuestions(questions: Question[]): Question[] {
  return questions.filter((q, idx) => {
    const content = (q.content || '').trim();
    if (content.length < 10) return false;

    // Check if content is school/exam header or student info
    const isPreambleNoise = /^(?:sở giáo dục|bộ giáo dục|trường thpt|trường thcs|kỳ thi khảo sát|đề thi khảo sát|tổ chuyên môn|họ và tên thí sinh|số báo danh|phòng thi:)/i.test(content);
    if (isPreambleNoise) return false;

    // Check if content is section instruction
    const isSectionInstruction = /^(?:phần [i|1|ii|2|iii|3|iv|4]\b.*thí sinh trả lời|thí sinh trả lời từ câu \d+ đến câu \d+|trong mỗi ý a\),? b\),? c\),? d\))/i.test(content);
    if (isSectionInstruction) return false;

    // Check if content is exam end marker or answer table
    const isFooterNoise = /^(?:--+|—+)?\s*(?:hết|the end)\s*(?:--+|—+)?$|^thí sinh không được sử dụng tài liệu|^bảng đáp án|^hướng dẫn chấm/i.test(content);
    if (isFooterNoise) return false;

    return true;
  });
}

/**
 * AI-powered smart parser using Gemini
 */
export async function parseExamWithAI(rawText: string, apiKey: string): Promise<ExamData> {
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
Bạn là chuyên gia khảo thí Việt Nam. Hãy đọc kỹ văn bản đề thi sau đây và trích xuất nội dung đề thi, từng câu hỏi, loại câu hỏi và đáp án chính xác theo chuẩn GDPT 2018.

VĂN BẢN ĐỀ THI ĐẦU VÀO:
"""
${rawText.slice(0, 45000)}
"""

QUY TẮC BẮT BUỘC ĐỂ TRÁNH TRÍCH XUẤT NHẦM (RẤT QUAN TRỌNG):
1. LOẠI BỎ TOÀN BỘ TIÊU ĐỀ TRƯỜNG/SỞ/KỲ THI/THÔNG TIN HÀNH CHÍNH Ở ĐẦU FILE:
   - Các dòng chữ như "SỞ GD&ĐT...", "TRƯỜNG THPT...", "KỲ THI...", "TỔ TOÁN...", "MÃ ĐỀ...", "Họ và tên thí sinh...", "Số báo danh...", "Lưu ý: Thí sinh không được sử dụng tài liệu..." CHỈ DÙNG để điền vào title, subject, grade, duration, code.
   - TUYỆT ĐỐI KHÔNG biến các dòng tiêu đề hay thông tin thí sinh này thành một câu hỏi trong danh sách "questions".
2. BỎ QUA CÁC DÒNG LỜI DẪN ĐẦU MỖI PHẦN:
   - "PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn...", "Thí sinh trả lời từ câu 1 đến câu 12...", "Trong mỗi ý a, b, c, d..." là lời dẫn phân môn, KHÔNG PHẢI là câu hỏi.
3. BỎ QUA VÀ TÁCH BIỆT BẢNG ĐÁP ÁN VÀ LỜI GIẢI Ở CUỐI FILE:
   - Các dòng "--- HẾT ---", "Thí sinh không được sử dụng tài liệu...", "BẢNG ĐÁP ÁN: 1.A 2.B...", "HƯỚNG DẪN GIẢI CHI TIẾT..." CHỈ DÙNG để đối chiếu và gán chính xác isCorrect/answer cho từng câu hỏi phía trên.
   - TUYỆT ĐỐI KHÔNG tạo câu hỏi mới từ bảng đáp án này.
4. CHỈ TRÍCH XUẤT ĐÚNG CÁC CÂU HỎI THỰC SỰ:
   - Bắt đầu từ câu hỏi đầu tiên (Câu 1/Bài 1) cho đến câu hỏi cuối cùng của đề thi.

HÃY TRẢ VỀ DUY NHẤT 1 ĐỐI TƯỢNG JSON CÓ CẤU TRÚC SAU:
{
  "title": "Tên đề thi (ví dụ: ĐỀ KIỂM TRA ĐỊNH KỲ MÔN TOÁN 12)",
  "subject": "Tên môn học (Toán, Vật lí, Hóa học, Sinh học, Lịch sử, Địa lí, GDCD, Tin học, Tiếng Anh, Công nghệ, Ngữ văn,...)",
  "grade": "Khối lớp (Khối 6, Khối 7, Khối 8, Khối 9, Khối 10, Khối 11 hoặc Khối 12)",
  "duration": 45, // Số phút làm bài (số nguyên)
  "code": "Mã đề nếu có (ví dụ: 101)",
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

LƯU Ý THÊM:
- Đọc kỹ bảng đáp án ở cuối đề (nếu có) để gắn chính xác isCorrect cho từng câu/từng ý.
- Giữ nguyên các công thức Toán/Lý/Hóa dưới dạng LaTeX $...$.
- Chỉ trả về JSON hợp lệ, không bọc markdown hay thêm bất kỳ lời dẫn nào.
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
        const cleanedQuestions = filterExtractedQuestions(parsed.questions);
        const finalQuestions = cleanedQuestions.length > 0 ? cleanedQuestions : parsed.questions;
        return {
          title: parsed.title || 'Đề thi tải lên từ nguồn khác',
          subject: parsed.subject || 'Toán',
          grade: parsed.grade || 'Khối 12',
          duration: Number(parsed.duration) || 45,
          bookSeries: 'Kết nối tri thức với cuộc sống',
          questions: finalQuestions,
          topics: [parsed.subject || 'Đề tải lên'],
          code: parsed.code || '101'
        };
      }
    } catch (err) {
      console.warn(`Model ${model} extraction error:`, err);
      lastErr = err;
    }
  }

  throw lastErr || new Error('Không thể trích xuất đề thi bằng AI');
}
