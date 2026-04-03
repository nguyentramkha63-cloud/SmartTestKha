/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, Fragment, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Plus, 
  FolderOpen, 
  Save, 
  Settings, 
  Maximize2, 
  ChevronRight,
  LayoutGrid,
  FileText,
  Shuffle,
  Sparkles,
  Trash2,
  ArrowLeft,
  BookOpen,
  RotateCcw,
  GraduationCap,
  Clock,
  Layout,
  BarChart3,
  BrainCircuit,
  Target,
  Loader2,
  Pencil,
  CheckCircle2,
  X,
  Check,
  HelpCircle,
  Image as ImageIcon,
  Download,
  FileArchive,
  Eye,
  Sigma
} from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { LESSON_LIBRARY } from './data/lessons';
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  AlignmentType, 
  HeadingLevel, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  BorderStyle,
  VerticalAlign,
  ImageRun,
  Footer,
  PageNumber,
  PageOrientation,
  ShadingType
} from 'docx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Helper to convert base64 to Uint8Array for docx
const safeJsonParse = (str: string) => {
  if (!str || str.trim() === "") return {};
  let cleaned = str.trim();
  
  // 1. Try to extract JSON from markdown blocks first
  const jsonMatch = cleaned.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    cleaned = jsonMatch[1];
  } else {
    const genericMatch = cleaned.match(/```\s*([\s\S]*?)\s*```/);
    if (genericMatch) {
      cleaned = genericMatch[1];
    }
  }
  
  // 2. If no markdown blocks, try to find the first '{' or '[' and last '}' or ']'
  if (!cleaned.includes("```")) {
    const firstBrace = cleaned.indexOf('{');
    const firstBracket = cleaned.indexOf('[');
    const lastBrace = cleaned.lastIndexOf('}');
    const lastBracket = cleaned.lastIndexOf(']');
    
    let start = -1;
    let end = -1;
    
    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      start = firstBrace;
      end = lastBrace;
    } else if (firstBracket !== -1) {
      start = firstBracket;
      end = lastBracket;
    }
    
    if (start !== -1 && end !== -1 && end > start) {
      cleaned = cleaned.substring(start, end + 1);
    }
  }

  cleaned = cleaned.trim();

  try {
    // Attempt standard parse first
    return JSON.parse(cleaned);
  } catch (e) {
    // Try to fix common control character issues
    try {
      const fixedChars = cleaned
        .replace(/\x0C/g, '\\\\f')
        .replace(/\x09/g, '\\\\t')
        .replace(/\x08/g, '\\\\b')
        .replace(/\x0B/g, '\\\\v');
      return JSON.parse(fixedChars);
    } catch (e2) {
      // If still failing, try to fix truncated JSON
      try {
        let truncated = cleaned;
        
        // Remove trailing incomplete parts: commas, colons, or partial keys/values
        for (let i = 0; i < 5; i++) {
          truncated = truncated.trim();
          truncated = truncated.replace(/,\s*$/, "");
          truncated = truncated.replace(/:\s*$/, "");
          
          if (truncated.endsWith('"')) {
            const lastQuoteIndex = truncated.lastIndexOf('"', truncated.length - 2);
            if (lastQuoteIndex !== -1) {
              truncated = truncated.substring(0, lastQuoteIndex).trim();
            } else {
              truncated = truncated.substring(0, truncated.length - 1).trim();
            }
          }
        }

        // Now close the braces/brackets correctly by tracking state
        let stack = [];
        let inString = false;
        let escaped = false;
        
        for (let i = 0; i < truncated.length; i++) {
          const char = truncated[i];
          if (char === '"' && !escaped) {
            inString = !inString;
          }
          if (!inString) {
            if (char === '{') stack.push('}');
            else if (char === '[') stack.push(']');
            else if (char === '}' || char === ']') {
              if (stack.length > 0 && stack[stack.length - 1] === char) stack.pop();
            }
          }
          escaped = (char === '\\' && !escaped);
        }
        
        let fixed = truncated;
        if (inString) fixed += '"';
        while (stack.length > 0) fixed += stack.pop();
        
        return JSON.parse(fixed);
      } catch (e3) {
        console.error("JSON Parse Error:", e3, "Raw string:", str);
        // If it's still not valid JSON, return an empty object or array based on the first character
        return cleaned.startsWith('[') ? [] : {};
      }
    }
  }
};

const cleanString = (str: string) => {
  if (!str) return "";
  // Remove control characters except tab, newline, carriage return
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
};

const formatMathForWord = (str: string) => {
  if (!str) return "";
  let text = cleanString(str);
  
  // 1. Smart Unwrap for very simple math
  // Matches $...$ where content is just simple text (no \, ^, _, {, })
  // We unwrap if it's simple and relatively short to avoid unnecessary MathType conversion
  text = text.replace(/\$([^\\^_{}$]+)\$/g, (match, content) => {
    const trimmed = content.trim();
    // If it's just a single letter, or a simple equation/unit without complex LaTeX, unwrap it
    if (trimmed.length < 25) {
       return trimmed;
    }
    return match;
  });

  // 2. Add spaces around remaining math blocks to prevent sticking to text
  // This helps MathType distinguish math from surrounding text
  // We handle block math first, then inline math
  text = text.replace(/\$\$(.*?)\$\$/g, ' $$ $1 $$ ');
  
  // For inline math, we use multiple passes to ensure all stuck delimiters are handled
  text = text.replace(/([^\s$])(\$[^$]+\$)/g, '$1 $2');
  text = text.replace(/(\$[^$]+\$)([^\s$])/g, '$1 $2');
  
  // Clean up any double spaces we might have introduced
  return text.trim().replace(/\s\s+/g, ' ');
};

const renderTextWithMath = (str: string, options: { size?: number; bold?: boolean; color?: string; italics?: boolean } = {}) => {
  const text = formatMathForWord(str);
  if (!text) return [];

  // Split by $ but keep the $ delimiters
  const parts = text.split(/(\$[^$]+\$)/g);
  
  return parts.map(part => {
    const isMath = part.startsWith('$') && part.endsWith('$');
    return new TextRun({
      text: part,
      size: options.size,
      bold: options.bold,
      italics: options.italics,
      color: isMath ? "059669" : options.color, // Emerald 600 for math highlighting
    });
  });
};

const base64ToUint8Array = (base64: string) => {
  try {
    const parts = base64.split(',');
    const data = parts.length > 1 ? parts[1] : parts[0];
    const binaryString = window.atob(data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  } catch (e) {
    console.error("Invalid base64:", e);
    return new Uint8Array(0);
  }
};

// Helper to get Gemini instance with user's key
const getAiInstance = (key: string) => {
  return new GoogleGenAI({ apiKey: key });
};

interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
  isLocked?: boolean;
  imageUrl?: string;
}

interface TFSubQuestion {
  id: string;
  text: string;
  isCorrect: boolean;
  isLocked?: boolean;
  imageUrl?: string;
}

interface SASubQuestion {
  id: string;
  text: string;
  answer: string;
  isLocked?: boolean;
  imageUrl?: string;
}

interface Question {
  id: string;
  type: 'MCQ' | 'TF' | 'SA' | 'TL';
  level?: 'NHẬN BIẾT' | 'THÔNG HIỂU' | 'VẬN DỤNG';
  topic?: string;
  content: string;
  points?: number;
  options?: MCQOption[]; // For MCQ
  tfSubQuestions?: TFSubQuestion[]; // For TF
  saSubQuestions?: SASubQuestion[]; // For SA
  solution?: string; // For TL
  isLocked?: boolean;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
}

interface Specification {
  topic: string;
  level: 'NHẬN BIẾT' | 'THÔNG HIỂU' | 'VẬN DỤNG';
  criteria: string;
}

interface ExamData {
  title: string;
  subject: string;
  grade: string;
  duration: number | string;
  bookSeries: string;
  questions: Question[];
  topics: string[];
  specifications?: Specification[];
  code?: string;
  isSimpleExport?: boolean;
}

const MathRenderer = ({ content }: { content: string }) => {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default function App() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');

  const [step, setStep] = useState(1);
  const [maxStepReached, setMaxStepReached] = useState(1);

  useEffect(() => {
    if (step > maxStepReached) {
      setMaxStepReached(step);
    }
  }, [step, maxStepReached]);
  const [level, setLevel] = useState('vừa-phải');
  const [knowledge, setKnowledge] = useState(40);
  const [comprehension, setComprehension] = useState(30);
  const [application, setApplication] = useState(30);

  const [subject, setSubject] = useState('Toán học');
  const [grade, setGrade] = useState('Khối 12');
  const [exam, setExam] = useState('Kiểm tra giữa học kì 1');
  const [duration, setDuration] = useState<number | string>(90);
  const [bookSeries, setBookSeries] = useState('Kết nối tri thức với cuộc sống');
  const [customBook, setCustomBook] = useState('');
  const [subSubject, setSubSubject] = useState('');

  // Step 2 State
  const [mcqCount, setMcqCount] = useState<number | string>(16);
  const [mcqPoints, setMcqPoints] = useState<number | string>(0.25);
  const [tfCount, setTfCount] = useState<number | string>(2);
  const [tfPoints, setTfPoints] = useState<number | string>(1);
  const [saCount, setSaCount] = useState<number | string>(2);
  const [saPoints, setSaPoints] = useState<number | string>(1);
  const [essays, setEssays] = useState<{ id: number; name: string; points: number | string }[]>([
    { id: 1, name: 'Câu tự luận 1', points: 1 },
    { id: 2, name: 'Câu tự luận 2', points: 1 },
  ]);
  const [topics, setTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState('');
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [dataSource, setDataSource] = useState<'library' | 'ai' | 'none'>('none');
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [isGeneratingExam, setIsGeneratingExam] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState<number | null>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  
  // Step 4 State
  const [numCodes, setNumCodes] = useState(4);
  const [shuffledExams, setShuffledExams] = useState<(ExamData & { code: string })[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [masterExamData, setMasterExamData] = useState<ExamData | null>(null);
  const [showNewConfirm, setShowNewConfirm] = useState(false);
  const [errorModal, setErrorModal] = useState<{ show: boolean; title: string; message: string }>({
    show: false,
    title: '',
    message: ''
  });

  const showError = (title: string, message: string) => {
    setErrorModal({ show: true, title, message });
  };

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    
    if (savedKey && savedKey.trim() !== '') {
      setApiKey(savedKey);
    } else {
      // Nếu chưa có key trong localStorage, luôn hiện Modal để người dùng nhập/dán key của họ
      setShowApiKeyModal(true);
      // Không tự động điền key từ hệ thống để đảm bảo đồng nghiệp phải dán key của chính họ
      setTempApiKey('');
    }
  }, []);

  useEffect(() => {
    if (showApiKeyModal) {
      setTempApiKey(apiKey || '');
      setShowLogoutConfirm(false);
    }
  }, [showApiKeyModal, apiKey]);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      localStorage.setItem('gemini_api_key', tempApiKey.trim());
      setApiKey(tempApiKey.trim());
      setShowApiKeyModal(false);
    } else {
      // Use a simple state for error instead of alert if possible, but for now just keep it simple
      showError("Thiếu thông tin", "Vui lòng nhập API Key để tiếp tục!");
    }
  };

  const handleLogoutApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey(null);
    setTempApiKey('');
    setShowLogoutConfirm(false);
    setShowApiKeyModal(true);
  };

  useEffect(() => {
    if (examData && step === 3) {
      setMasterExamData(examData);
    }
  }, [examData, step]);

  const loadingMessages = [
    "Đang phân tích ma trận kiến thức...",
    "Đang soạn thảo câu hỏi trắc nghiệm...",
    "Đang thiết lập các phương án nhiễu...",
    "Đang tối ưu hóa độ khó theo yêu cầu...",
    "Đang chuẩn bị hướng dẫn chấm chi tiết...",
    "Đang hoàn thiện hồ sơ đề thi..."
  ];

  useEffect(() => {
    let interval: any;
    if (isGeneratingExam) {
      window.scrollTo(0, 0);
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
    } else {
      setLoadingMessageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isGeneratingExam]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const shuffleExam = (originalData: ExamData, code: string): ExamData & { code: string } => {
    const shuffledQuestions = [...originalData.questions];
    
    // Group by type to shuffle within sections
    const mcq = shuffledQuestions.filter(q => q.type === 'MCQ');
    const tf = shuffledQuestions.filter(q => q.type === 'TF');
    const sa = shuffledQuestions.filter(q => q.type === 'SA');
    const tl = shuffledQuestions.filter(q => q.type === 'TL');

    const shuffleSection = (section: Question[]) => {
      const lockedIndices = section.map((q, i) => q.isLocked ? i : -1).filter(i => i !== -1);
      const unlockedQuestions = section.filter(q => !q.isLocked);
      const shuffledUnlocked = shuffleArray(unlockedQuestions);
      
      const result = new Array(section.length);
      lockedIndices.forEach(idx => {
        result[idx] = section[idx];
      });
      
      let unlockedIdx = 0;
      for (let i = 0; i < result.length; i++) {
        if (result[i] === undefined) {
          result[i] = shuffledUnlocked[unlockedIdx++];
        }
      }
      
      // Shuffle options/sub-questions within each question
      return result.map(q => {
        const newQ = { ...q };
        if (newQ.type === 'MCQ' && newQ.options) {
          const lockedOpts = newQ.options.map((o, i) => o.isLocked ? i : -1).filter(i => i !== -1);
          const unlockedOpts = newQ.options.filter(o => !o.isLocked);
          const shuffledUnlockedOpts = shuffleArray(unlockedOpts);
          const newOptions = new Array(newQ.options.length);
          lockedOpts.forEach(idx => { newOptions[idx] = newQ.options![idx]; });
          let uIdx = 0;
          for (let i = 0; i < newOptions.length; i++) {
            if (newOptions[i] === undefined) newOptions[i] = shuffledUnlockedOpts[uIdx++];
          }
          const originalIds = q.options.map(o => o.id);
          newQ.options = newOptions.map((opt, idx) => ({ ...opt, id: originalIds[idx] }));
        } else if (newQ.type === 'TF' && newQ.tfSubQuestions) {
          const lockedSub = newQ.tfSubQuestions.map((s, i) => s.isLocked ? i : -1).filter(i => i !== -1);
          const unlockedSub = newQ.tfSubQuestions.filter(s => !s.isLocked);
          const shuffledUnlockedSub = shuffleArray(unlockedSub);
          const newSub = new Array(newQ.tfSubQuestions.length);
          lockedSub.forEach(idx => { newSub[idx] = newQ.tfSubQuestions![idx]; });
          let uIdx = 0;
          for (let i = 0; i < newSub.length; i++) {
            if (newSub[i] === undefined) newSub[i] = shuffledUnlockedSub[uIdx++];
          }
          const originalIds = q.tfSubQuestions.map(s => s.id);
          newQ.tfSubQuestions = newSub.map((sub, idx) => ({ ...sub, id: originalIds[idx] }));
        } else if (newQ.type === 'SA' && newQ.saSubQuestions) {
          const lockedSub = newQ.saSubQuestions.map((s, i) => s.isLocked ? i : -1).filter(i => i !== -1);
          const unlockedSub = newQ.saSubQuestions.filter(s => !s.isLocked);
          const shuffledUnlockedSub = shuffleArray(unlockedSub);
          const newSub = new Array(newQ.saSubQuestions.length);
          lockedSub.forEach(idx => { newSub[idx] = newQ.saSubQuestions![idx]; });
          let uIdx = 0;
          for (let i = 0; i < newSub.length; i++) {
            if (newSub[i] === undefined) newSub[i] = shuffledUnlockedSub[uIdx++];
          }
          const originalIds = q.saSubQuestions.map(s => s.id);
          newQ.saSubQuestions = newSub.map((sub, idx) => ({ ...sub, id: originalIds[idx] }));
        }
        return newQ;
      });
    };

    return {
      ...originalData,
      code,
      questions: [
        ...shuffleSection(mcq),
        ...shuffleSection(tf),
        ...shuffleSection(sa),
        ...shuffleSection(tl)
      ]
    };
  };

  const handleShuffleNow = () => {
    if (!examData) return;
    setIsShuffling(true);
    
    // Extract grade number (e.g., "Khối 10" -> "10")
    const gradeNumber = grade.replace(/[^0-9]/g, '');
    
    // Generate codes: gradeNumber + "01", "02", ...
    const codes = Array.from({ length: numCodes }, (_, i) => {
      const suffix = (i + 1).toString().padStart(2, '0');
      return `${gradeNumber}${suffix}`;
    });
    
    const baseData = masterExamData || examData;
    if (!baseData) {
      setIsShuffling(false);
      return;
    }

    // Shuffled versions are always simple exports
    const newShuffled = codes.map(code => shuffleExam({ ...baseData, isSimpleExport: true }, code));
    setShuffledExams(newShuffled);
    
    setStep(4);
    setIsShuffling(false);
  };

  const generateWordBlob = async (data: ExamData & { code?: string }) => {
    const isFullExport = !data.code && 
                         !data.title?.toLowerCase().includes("thường xuyên");
    const normalizeTopic = (t: string) => 
      t?.trim()?.toLowerCase()
       .replace(/^bài\s+\d+[\s.:]*/i, '')
       .replace(/[:.]/g, '')
       .trim() || "";

    const normalizeLevel = (l: string) => l?.trim()?.toUpperCase() || "";

    const questions = data.questions || [];
    const topicsList = data.topics || topics || [];
    const matrixRows = topicsList.map(topic => {
      const normalizedTopic = normalizeTopic(topic);
      const qInTopic = questions.filter(q => 
        normalizeTopic(q.topic) === normalizedTopic
      );
      
      const counts: Record<string, { mcq: number, tf: number, sa: number, tl: number }> = {
        'NHẬN BIẾT': { mcq: 0, tf: 0, sa: 0, tl: 0 },
        'THÔNG HIỂU': { mcq: 0, tf: 0, sa: 0, tl: 0 },
        'VẬN DỤNG': { mcq: 0, tf: 0, sa: 0, tl: 0 },
        'VẬN DỤNG CAO': { mcq: 0, tf: 0, sa: 0, tl: 0 }
      };

      qInTopic.forEach(q => {
        let lvl = normalizeLevel(q.level);
        
        if (lvl && counts[lvl]) {
          if (q.type === 'MCQ') counts[lvl].mcq++;
          else if (q.type === 'TF') counts[lvl].tf++;
          else if (q.type === 'SA') counts[lvl].sa++;
          else if (q.type === 'TL') counts[lvl].tl++;
        }
      });

      const totalPoints = qInTopic.reduce((sum, q) => sum + (q.points || 0), 0);
      const examTotalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0) || 10;
      
      return {
        topic,
        counts,
        totalCount: qInTopic.length,
        totalPoints,
        percentage: parseFloat(((totalPoints / examTotalPoints) * 100).toFixed(2)).toString()
      };
    });

    const matrixTotals = {
      levels: {
        'NHẬN BIẾT': { mcq: 0, tf: 0, sa: 0, tl: 0, points: 0 },
        'THÔNG HIỂU': { mcq: 0, tf: 0, sa: 0, tl: 0, points: 0 },
        'VẬN DỤNG': { mcq: 0, tf: 0, sa: 0, tl: 0, points: 0 }
      },
      totalCount: 0,
      totalPoints: 0
    };

    matrixRows.forEach(row => {
      ['NHẬN BIẾT', 'THÔNG HIỂU', 'VẬN DỤNG'].forEach(lvl => {
        const level = lvl as 'NHẬN BIẾT' | 'THÔNG HIỂU' | 'VẬN DỤNG';
        matrixTotals.levels[level].mcq += row.counts[level].mcq;
        matrixTotals.levels[level].tf += row.counts[level].tf;
        matrixTotals.levels[level].sa += row.counts[level].sa;
        matrixTotals.levels[level].tl += row.counts[level].tl;
        
        // Calculate points for this level in this row
        const rowLvlPoints = questions.filter(q => 
          normalizeTopic(q.topic) === normalizeTopic(row.topic) && 
          normalizeLevel(q.level) === lvl
        ).reduce((sum, q) => sum + (q.points || 0), 0);
        
        matrixTotals.levels[level].points += rowLvlPoints;
      });
      matrixTotals.totalCount += row.totalCount;
      matrixTotals.totalPoints += row.totalPoints;
    });

    const levelMap: Record<string, string> = {
      'NHẬN BIẾT': 'NB',
      'THÔNG HIỂU': 'TH',
      'VẬN DỤNG': 'VD'
    };

    const commonFooter = new Footer({
      children: [
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({
              text: isFullExport 
                ? `Hồ sơ đề ${data.title} - ${data.subject} ${data.grade} - Năm học: 2025 – 2026 ---- trang `
                : `Đề ${data.title} môn ${data.subject} lớp ${data.grade.replace(/[^0-9]/g, '')} Năm học: 2025 - 2026 - Mã đề ${data.code} trang `,
              italics: true,
              size: 20,
            }),
            new TextRun({ children: [PageNumber.CURRENT], italics: true, size: 20 }),
            new TextRun({ text: "/", italics: true, size: 20 }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], italics: true, size: 20 }),
          ],
        }),
      ],
    });

    const doc = new Document({
      sections: [
        ...(isFullExport ? [
          {
            properties: {
              page: {
                margin: { top: 850, bottom: 850, left: 1417, right: 1134 },
                size: { width: 11906, height: 16838 },
              },
            },
            footers: { default: commonFooter },
            children: [
              // Cover Page
            new Paragraph({
            children: [
              new TextRun({ text: "TRƯỜNG THCS&THPT NAM YÊN", bold: true, size: 24 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "TỔ TOÁN - TIN", bold: true, size: 24 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "GV RA ĐỀ: NGUYỄN TRẦM KHA", bold: true, size: 24 }),
            ],
          }),
          new Paragraph({ text: "", spacing: { before: 400 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: renderTextWithMath(`${(data.title || "").toUpperCase()}`, { bold: true, size: 24 }),
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: renderTextWithMath(`MÔN: ${(data.subject || "").toUpperCase()} - LỚP: ${(data.grade || "").replace(/[^0-9]/g, '')}`, { bold: true, size: 24 }),
          }),
          new Paragraph({ text: "", spacing: { before: 600 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "MỤC TIÊU ĐỀ KIỂM TRA", bold: true, size: 26 }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({ text: "a). Mục tiêu: ", bold: true, size: 26 }),
              new TextRun({ text: "đánh giá chính xác kết quả học tập, mức độ đạt chuẩn kiến thức, kỹ năng và phẩm chất của học sinh sau một giai đoạn. Bao gồm:", size: 26 }),
            ],
            spacing: { before: 200 }
          }),
          ...[
            "- Đánh giá mức độ đạt chuẩn: Xác định khả năng của học sinh so với yêu cầu cần đạt của chương trình giáo dục.",
            "- Phân loại và xếp loại học sinh: Đánh giá năng lực tư duy, ghi nhớ, hiểu và vận dụng kiến thức vào các tình huống, từ đó phân loại học lực.",
            "- Cung cấp phản hồi: Giúp giáo viên nhận biết các lỗi sai phổ biến để khắc phục, đồng thời giúp học sinh biết điểm mạnh/yếu của mình.",
            "- Định hướng dạy và học: Thúc đẩy học sinh ôn tập, củng cố kiến thức và điều chỉnh phương pháp giảng dạy để nâng cao chất lượng.",
            "- Đảm bảo tính công bằng: Đề kiểm tra xây dựng theo ma trận và đặc tả (nhận biết, thông hiểu, vận dụng) đảm bảo đánh giá toàn diện, khách quan."
          ].map(text => new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [new TextRun({ text, size: 26 })],
            indent: { left: 720 }
          })),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({ text: "b). Nội dung: ", bold: true, size: 26 }),
              ...renderTextWithMath(topicsList.join(", "), { size: 26 }),
            ],
            spacing: { before: 200 }
          }),

            ]
          },
          {
            properties: {
              page: {
                margin: { top: 850, bottom: 850, left: 850, right: 850 },
                size: {
                  width: 16838,
                  height: 11906,
                  orientation: PageOrientation.LANDSCAPE,
                },
              },
            },
            footers: { default: commonFooter },
            children: [
              // Matrix Page
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "TRƯỜNG THCS&THPT NAM YÊN", bold: true, size: 24 })],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "TỔ TOÁN - TIN", bold: true, size: 24 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: renderTextWithMath(`KHUNG MA TRẬN ĐỀ ${(data.title || "").toUpperCase()}`, { bold: true, size: 24 }),
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: renderTextWithMath(`MÔN: ${(data.subject || "").toUpperCase()}- LỚP: ${(data.grade || "").replace(/[^0-9]/g, '')}`, { bold: true, size: 24 }),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          new Paragraph({ text: "", spacing: { before: 400 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "MA TRẬN ĐỀ KIỂM TRA", bold: true, size: 28 }),
            ],
          }),
          new Paragraph({ text: "", spacing: { before: 200 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              // Header Row 1
              new TableRow({
                children: [
                  new TableCell({ width: { size: 5, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "TT", bold: true, size: 22 })] })], verticalAlign: VerticalAlign.CENTER, rowSpan: 3 }),
                  new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Nội dung kiến thức", bold: true, size: 22 })] })], verticalAlign: VerticalAlign.CENTER, rowSpan: 3 }),
                  new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Mức độ nhận thức", bold: true, size: 22 })] })], columnSpan: 12 }),
                  new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Tổng", bold: true, size: 22 })] })], columnSpan: 2, rowSpan: 2, verticalAlign: VerticalAlign.CENTER }),
                  new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Tỉ lệ (%)", bold: true, size: 22 })] })], verticalAlign: VerticalAlign.CENTER, rowSpan: 3 }),
                ],
              }),
              // Header Row 2
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Nhận biết", bold: true, size: 22 })] })], columnSpan: 4 }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Thông hiểu", bold: true, size: 22 })] })], columnSpan: 4 }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Vận dụng", bold: true, size: 22 })] })], columnSpan: 4 }),
                ],
              }),
              // Header Row 3
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "I", bold: true, size: 22 })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "II", bold: true, size: 22 })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "III", bold: true, size: 22 })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "IV", bold: true, size: 22 })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "I", bold: true, size: 22 })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "II", bold: true, size: 22 })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "III", bold: true, size: 22 })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "IV", bold: true, size: 22 })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "I", bold: true, size: 22 })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "II", bold: true, size: 22 })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "III", bold: true, size: 22 })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "IV", bold: true, size: 22 })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Số câu", bold: true, size: 22 })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Điểm", bold: true, size: 22 })] })] }),
                ],
              }),
              // Data Rows
              ...matrixRows.map((row, idx) => {
                const getCountText = (lvl: string, type: 'mcq' | 'tf' | 'sa' | 'tl') => {
                  const count = row.counts[lvl][type];
                  return count > 0 ? count.toString() : "";
                };

                return new TableRow({
                  children: [
                    new TableCell({ width: { size: 4, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: (idx + 1).toString(), size: 22 })] })] }),
                    new TableCell({ width: { size: 24, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: renderTextWithMath(row.topic, { size: 22 }) })] }),
                    new TableCell({ width: { size: 4, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: getCountText('NHẬN BIẾT', 'mcq'), size: 22 })] })] }),
                    new TableCell({ width: { size: 4, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: getCountText('NHẬN BIẾT', 'tf'), size: 22 })] })] }),
                    new TableCell({ width: { size: 4, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: getCountText('NHẬN BIẾT', 'sa'), size: 22 })] })] }),
                    new TableCell({ width: { size: 4, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: getCountText('NHẬN BIẾT', 'tl'), size: 22 })] })] }),
                    new TableCell({ width: { size: 4, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: getCountText('THÔNG HIỂU', 'mcq'), size: 22 })] })] }),
                    new TableCell({ width: { size: 4, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: getCountText('THÔNG HIỂU', 'tf'), size: 22 })] })] }),
                    new TableCell({ width: { size: 4, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: getCountText('THÔNG HIỂU', 'sa'), size: 22 })] })] }),
                    new TableCell({ width: { size: 4, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: getCountText('THÔNG HIỂU', 'tl'), size: 22 })] })] }),
                    new TableCell({ width: { size: 4, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: getCountText('VẬN DỤNG', 'mcq'), size: 22 })] })] }),
                    new TableCell({ width: { size: 4, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: getCountText('VẬN DỤNG', 'tf'), size: 22 })] })] }),
                    new TableCell({ width: { size: 4, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: getCountText('VẬN DỤNG', 'sa'), size: 22 })] })] }),
                    new TableCell({ width: { size: 3, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: getCountText('VẬN DỤNG', 'tl'), size: 22 })] })] }),
                    new TableCell({ width: { size: 5, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: row.totalCount.toString(), bold: true, size: 22 })] })] }),
                    new TableCell({ width: { size: 5, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: row.totalPoints.toFixed(2), bold: true, size: 22 })] })] }),
                  new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: row.percentage + "%", size: 22 })] })] }),
                ],
              });
            }),
              // Footer Row: Tổng số câu
              new TableRow({
                children: [
                  new TableCell({ width: { size: 28, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Tổng số câu:", bold: true, italics: true, size: 22 })] })], columnSpan: 2 }),
                  ...['NHẬN BIẾT', 'THÔNG HIỂU', 'VẬN DỤNG'].flatMap(lvl => [
                    new TableCell({ width: { size: 3, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: matrixTotals.levels[lvl as 'NHẬN BIẾT' | 'THÔNG HIỂU' | 'VẬN DỤNG'].mcq.toString(), bold: true, size: 22 })] })] }),
                    new TableCell({ width: { size: 3, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: matrixTotals.levels[lvl as 'NHẬN BIẾT' | 'THÔNG HIỂU' | 'VẬN DỤNG'].tf.toString(), bold: true, size: 22 })] })] }),
                    new TableCell({ width: { size: 3, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: matrixTotals.levels[lvl as 'NHẬN BIẾT' | 'THÔNG HIỂU' | 'VẬN DỤNG'].sa.toString(), bold: true, size: 22 })] })] }),
                    new TableCell({ width: { size: 3, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: matrixTotals.levels[lvl as 'NHẬN BIẾT' | 'THÔNG HIỂU' | 'VẬN DỤNG'].tl.toString(), bold: true, size: 22 })] })] }),
                  ]),
                  new TableCell({ width: { size: 7, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: matrixTotals.totalCount.toString(), bold: true, size: 22 })] })] }),
                  new TableCell({
                    width: { size: 7, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ text: "" })]
                  }),
                  new TableCell({
                    width: { size: 10, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ text: "" })]
                  }),
                ],
              }),
              // Footer Row: Tổng số điểm
              new TableRow({
                children: [
                  new TableCell({ width: { size: 28, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Tổng số điểm:", bold: true, italics: true, size: 22 })] })], columnSpan: 2 }),
                  ...['NHẬN BIẾT', 'THÔNG HIỂU', 'VẬN DỤNG'].flatMap(lvl => {
                    const pts = matrixTotals.levels[lvl as 'NHẬN BIẾT' | 'THÔNG HIỂU' | 'VẬN DỤNG'].points;
                    return new TableCell({ width: { size: 12, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: pts.toFixed(2), bold: true, size: 22 })] })], columnSpan: 4 });
                  }),
                  new TableCell({
                    width: { size: 7, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ text: "" })]
                  }),
                  new TableCell({ width: { size: 7, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: matrixTotals.totalPoints.toFixed(2), bold: true, size: 22 })] })] }),
                  new TableCell({
                    width: { size: 10, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ text: "" })]
                  }),
                ],
              }),
              // Footer Row: Tỉ lệ % điểm
              new TableRow({
                children: [
                  new TableCell({ width: { size: 28, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Tỉ lệ % điểm:", bold: true, italics: true, size: 22 })] })], columnSpan: 2 }),
                  ...['NHẬN BIẾT', 'THÔNG HIỂU', 'VẬN DỤNG'].flatMap(lvl => {
                    const pts = matrixTotals.levels[lvl as 'NHẬN BIẾT' | 'THÔNG HIỂU' | 'VẬN DỤNG'].points;
                    const pct = matrixTotals.totalPoints > 0 ? parseFloat(((pts / matrixTotals.totalPoints) * 100).toFixed(2)).toString() : "0";
                    return new TableCell({ width: { size: 12, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: pct + "%", bold: true, size: 22 })] })], columnSpan: 4 });
                  }),
                  new TableCell({
                    width: { size: 7, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ text: "" })]
                  }),
                  new TableCell({
                    width: { size: 7, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ text: "" })]
                  }),
                  new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: matrixTotals.totalPoints > 0 ? "100%" : "0%", bold: true, size: 22 })] })] }),
                ],
              }),
              // Note Row
              new TableRow({
                children: [
                  new TableCell({
                    columnSpan: 17,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ 
                            text: "Ghi chú: I: Trắc nghiệm nhiều lựa chọn MCQ; II: Trắc nghiệm Đúng/Sai TF; III: Trắc nghiệm Trả lời ngắn SA; IV: Tự luận TL", 
                            bold: true,
                            italics: true, 
                            size: 22,
                            color: "0070C0" // Blue color as seen in screenshot
                          })
                        ],
                        spacing: { before: 100, after: 100 }
                      })
                    ]
                  })
                ]
              }),
            ],
          }),

          new Paragraph({ text: "", pageBreakBefore: true }),

          // Specification Page
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "BẢN ĐẶC TẢ MỨC ĐỘ ĐÁNH GIÁ ĐỀ KIỂM TRA", bold: true, size: 28 })],
          }),
          new Paragraph({ text: "" }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ width: { size: 5, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "TT", bold: true, size: 22 })] })], rowSpan: 2 }),
                  new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Đơn vị kiến thức", bold: true, size: 22 })] })], rowSpan: 2 }),
                  new TableCell({ width: { size: 40, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Mức độ đánh giá / Yêu cầu cần đạt", bold: true, size: 22 })] })], rowSpan: 2 }),
                  new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Số câu hỏi", bold: true, size: 22 })] })], columnSpan: 4 }),
                  new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Câu hỏi", bold: true, size: 22 })] })], rowSpan: 2 }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ width: { size: 3.75, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "I", bold: true, size: 22 })] })] }),
                  new TableCell({ width: { size: 3.75, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "II", bold: true, size: 22 })] })] }),
                  new TableCell({ width: { size: 3.75, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "III", bold: true, size: 22 })] })] }),
                  new TableCell({ width: { size: 3.75, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "IV", bold: true, size: 22 })] })] }),
                ],
              }),
              ...(() => {
                const rows: TableRow[] = [];
                let tt = 1;
                topicsList.forEach((topic) => {
                  const levels = ['NHẬN BIẾT', 'THÔNG HIỂU', 'VẬN DỤNG'];
                  const topicLevels = levels.filter(l => questions.some(q => normalizeTopic(q.topic) === normalizeTopic(topic) && normalizeLevel(q.level) === l));
                  
                  topicLevels.forEach((level, idx) => {
                    const questionsInLevel = questions.filter(q => normalizeTopic(q.topic) === normalizeTopic(topic) && normalizeLevel(q.level) === level);
                    const mcqCount = questionsInLevel.filter(q => q.type === 'MCQ').length;
                    const tfCount = questionsInLevel.filter(q => q.type === 'TF').length;
                    const saCount = questionsInLevel.filter(q => q.type === 'SA').length;
                    const tlCount = questionsInLevel.filter(q => q.type === 'TL').length;
                    
                    const qRefs: string[] = [];
                    const mcqs = questionsInLevel.filter(q => q.type === 'MCQ').map(q => questions.indexOf(q) + 1);
                    const tfs = questionsInLevel.filter(q => q.type === 'TF').map(q => questions.indexOf(q) + 1);
                    const sas = questionsInLevel.filter(q => q.type === 'SA').map(q => questions.indexOf(q) + 1);
                    const tls = questionsInLevel.filter(q => q.type === 'TL').map(q => questions.indexOf(q) + 1);
                    
                    if (mcqs.length > 0) qRefs.push(`I. ${mcqs.join(', ')}`);
                    if (tfs.length > 0) qRefs.push(`II. ${tfs.join(', ')}`);
                    if (sas.length > 0) qRefs.push(`III. ${sas.join(', ')}`);
                    if (tls.length > 0) qRefs.push(`IV. ${tls.join(', ')}`);

                    const rawCriteria = data.specifications?.find(s => 
                      normalizeTopic(s.topic) === normalizeTopic(topic) && 
                      normalizeLevel(s.level) === level
                    )?.criteria || topic;
                    
                    // Remove any existing level prefix from AI to avoid duplication (only if followed by colon or space)
                    const cleanCriteria = rawCriteria.replace(/^(NHẬN BIẾT|THÔNG HIỂU|VẬN DỤNG)[:\s-]*/i, "").trim();
                    
                    // Format: "Nhận biết: [Criteria]" with "Nhận biết:" bolded
                    const levelStr = level || "";
                    const displayLevel = levelStr ? (levelStr.charAt(0).toUpperCase() + levelStr.slice(1).toLowerCase()) : "";

                    rows.push(new TableRow({
                      children: [
                        ...(idx === 0 ? [
                          new TableCell({ width: { size: 5, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: tt.toString(), size: 22 })] })], rowSpan: topicLevels.length }),
                          new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: renderTextWithMath(topic, { size: 22 }) })], rowSpan: topicLevels.length }),
                        ] : []),
                        new TableCell({ 
                          width: { size: 40, type: WidthType.PERCENTAGE }, 
                          children: [
                            new Paragraph({ 
                              children: [
                                new TextRun({ text: `${displayLevel}: `, bold: true, size: 22 }),
                                ...renderTextWithMath(cleanCriteria, { size: 22 })
                              ] 
                            })
                          ] 
                        }),
                        new TableCell({ width: { size: 3.75, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: mcqCount > 0 ? mcqCount.toString() : "-", size: 22 })] })] }),
                        new TableCell({ width: { size: 3.75, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: tfCount > 0 ? tfCount.toString() : "-", size: 22 })] })] }),
                        new TableCell({ width: { size: 3.75, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: saCount > 0 ? saCount.toString() : "-", size: 22 })] })] }),
                        new TableCell({ width: { size: 3.75, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: tlCount > 0 ? tlCount.toString() : "-", size: 22 })] })] }),
                        new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: qRefs.join('; '), size: 22 })] })] }),
                      ]
                    }));
                  });
                  if (topicLevels.length > 0) tt++;
                });
                return rows;
              })()
            ],
          }),
            ]
          }
        ] : []),
        {
          properties: {
            page: {
              margin: { top: 850, bottom: 850, left: 1417, right: 1134 },
              size: { width: 11906, height: 16838 },
            },
          },
          footers: { default: commonFooter },
          children: [
            // Questions Page Header
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "TRƯỜNG THCS&THPT NAM YÊN", bold: true, size: 24 })],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "TỔ TOÁN - TIN", bold: true, size: 24 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: renderTextWithMath(`ĐỀ ${(data.title || "").toUpperCase()}`, { bold: true, size: 24 }),
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "NĂM HỌC 2025 - 2026", bold: true, size: 24 })],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          new Paragraph({ text: "", spacing: { before: 200 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: renderTextWithMath(`${(data.title || "").toUpperCase()} - ${(data.subject || "").toUpperCase()} ${(data.grade || "").replace(/[^0-9]/g, '')} (${(data.bookSeries || "").toUpperCase()})`, { bold: true, size: 28 }),
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: renderTextWithMath(`Môn: ${data.subject || ""} - Lớp: ${(data.grade || "").replace(/[^0-9]/g, '')}`, { italics: true, size: 24 }),
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `Thời gian làm bài: ${data.duration || duration} phút (Không kể thời gian giao đề)`, italics: true, size: 24 }),
            ],
          }),
          ...(data.code ? [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({ text: `Mã đề: ${data.code}`, bold: true, size: 24 }),
              ],
            })
          ] : []),
          new Paragraph({ text: "", spacing: { before: 200 } }),

          // Questions
          ...questions.flatMap((q, idx) => {
            const sectionStartIndex = questions.findIndex(question => question.type === q.type);
            const questionNumber = idx - sectionStartIndex + 1;
            const paragraphs: (Paragraph | Table)[] = [];

            // Section Header
            const isFirstInType = idx === 0 || questions[idx - 1].type !== q.type;
            if (isFirstInType) {
              let headerText = "";
              const typeQuestions = questions.filter(question => question.type === q.type);
              const totalPoints = typeQuestions.reduce((sum, question) => sum + (Number(question.points) || 0), 0);

              switch (q.type) {
                case 'MCQ': headerText = `PHẦN I. CÂU HỎI TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (${totalPoints} điểm)`; break;
                case 'TF': headerText = `PHẦN II. CÂU HỎI TRẮC NGHIỆM ĐÚNG SAI (${totalPoints} điểm)`; break;
                case 'SA': headerText = `PHẦN III. CÂU HỎI TRẮC NGHIỆM TRẢ LỜI NGẮN (${totalPoints} điểm)`; break;
                case 'TL': headerText = `PHẦN IV. CÂU HỎI TỰ LUẬN (${totalPoints} điểm)`; break;
              }
              paragraphs.push(new Paragraph({
                children: [new TextRun({ text: headerText, bold: true, size: 26 })],
                spacing: { before: 400, after: 200 }
              }));
            }

            const indicator = data.code ? "" : ` (${q.type}-${levelMap[q.level] || q.level})`;

            // Question Content - Remove [HÌNH ẢNH] placeholder if image exists to avoid double display
            const hasActualImage = q.imageUrl && q.imageUrl.includes('base64,');
            const cleanContent = hasActualImage ? q.content.replace(/\[HÌNH ẢNH\]/g, "").trim() : q.content;

            paragraphs.push(new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              children: [
                new TextRun({ text: `Câu ${questionNumber}${indicator}: `, bold: true, size: 26 }),
                ...renderTextWithMath(cleanContent, { size: 26 })
              ],
              spacing: { before: 200 }
            }));

            // AI Illustration in Word
            if (q.imageUrl && q.imageUrl.includes('base64,')) {
              try {
                const imageBuffer = base64ToUint8Array(q.imageUrl);
                if (imageBuffer.length > 0) {
                  // Calculate dimensions
                  let width = 300;
                  let height = 300;
                  
                  if (q.imageWidth && q.imageHeight) {
                    const maxWidth = 450;
                    width = Math.min(q.imageWidth, maxWidth);
                    height = (q.imageHeight / q.imageWidth) * width;
                  }

                  paragraphs.push(new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new ImageRun({
                        data: imageBuffer,
                        transformation: {
                          width,
                          height,
                        },
                      } as any),
                    ],
                    spacing: { before: 200, after: 200 }
                  }));
                }
              } catch (e) {
                console.error("Error adding image to docx:", e);
              }
            }

            // Options/Sub-questions
            if (q.type === 'MCQ' && q.options) {
              const maxLen = Math.max(...q.options.map(o => o.text.length));
              const hasImages = q.options.some(o => o.imageUrl && o.imageUrl.includes('base64,'));
              
              let columns = 1;
              if (!hasImages) {
                if (maxLen < 15) columns = 4;
                else if (maxLen < 35) columns = 2;
              }

              if (columns > 1) {
                const rows: TableRow[] = [];
                for (let i = 0; i < q.options.length; i += columns) {
                  const cells: TableCell[] = [];
                  for (let j = 0; j < columns; j++) {
                    const opt = q.options[i + j];
                    if (opt) {
                      const isCorrectAnswer = !data.code && opt.isCorrect;
                      cells.push(new TableCell({
                        children: [new Paragraph({
                          children: [
                            new TextRun({ 
                              text: opt.id, 
                              size: 26,
                              color: isCorrectAnswer ? "FF0000" : undefined
                            }),
                            new TextRun({ text: ". ", size: 26 }),
                            ...renderTextWithMath(opt.text, { size: 26 })
                          ],
                          alignment: AlignmentType.LEFT
                        })],
                        borders: {
                          top: { style: BorderStyle.NONE },
                          bottom: { style: BorderStyle.NONE },
                          left: { style: BorderStyle.NONE },
                          right: { style: BorderStyle.NONE },
                        },
                        width: { size: 100 / columns, type: WidthType.PERCENTAGE }
                      }));
                    } else {
                      cells.push(new TableCell({ 
                        children: [new Paragraph({ text: "" })],
                        borders: {
                          top: { style: BorderStyle.NONE },
                          bottom: { style: BorderStyle.NONE },
                          left: { style: BorderStyle.NONE },
                          right: { style: BorderStyle.NONE },
                        }
                      }));
                    }
                  }
                  rows.push(new TableRow({ children: cells }));
                }
                paragraphs.push(new Table({
                  rows,
                  width: { size: 100, type: WidthType.PERCENTAGE },
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                    insideHorizontal: { style: BorderStyle.NONE },
                    insideVertical: { style: BorderStyle.NONE },
                  }
                }));
              } else {
                q.options.forEach((opt, i) => {
                  const isCorrectAnswer = !data.code && opt.isCorrect;
                  const optionParagraph = new Paragraph({
                    alignment: AlignmentType.JUSTIFIED,
                    children: [
                      new TextRun({ 
                        text: opt.id, 
                        size: 26,
                        color: isCorrectAnswer ? "FF0000" : undefined
                      }),
                      new TextRun({ text: ". ", size: 26 }),
                      ...renderTextWithMath(opt.text, { size: 26 })
                    ],
                    indent: { left: 720 }
                  });
                  paragraphs.push(optionParagraph);

                  if (opt.imageUrl && opt.imageUrl.includes('base64,')) {
                    try {
                      const imgBuffer = base64ToUint8Array(opt.imageUrl);
                      if (imgBuffer.length > 0) {
                        paragraphs.push(new Paragraph({
                          alignment: AlignmentType.LEFT,
                          children: [
                            new ImageRun({
                              data: imgBuffer,
                              transformation: { width: 150, height: 150 },
                            } as any),
                          ],
                          indent: { left: 720 },
                          spacing: { before: 100, after: 100 }
                        }));
                      }
                    } catch (e) { console.error(e); }
                  }
                });
              }
            } else if (q.type === 'TF' && q.tfSubQuestions) {
              q.tfSubQuestions.forEach((sub, i) => {
                const isPlain = !sub.text.includes('$');
                const showAnswer = !data.code;
                paragraphs.push(new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({ text: `${sub.id}) `, size: 26 }),
                    ...renderTextWithMath(sub.text, { size: 26 }),
                    ...(showAnswer ? [
                      new TextRun({ 
                        text: sub.isCorrect ? " [Đúng]" : " [Sai]", 
                        color: "FF0000", 
                        size: 26,
                        bold: true 
                      })
                    ] : [])
                  ],
                  indent: { left: 720 }
                }));

                if (sub.imageUrl && sub.imageUrl.includes('base64,')) {
                  try {
                    const imgBuffer = base64ToUint8Array(sub.imageUrl);
                    if (imgBuffer.length > 0) {
                      paragraphs.push(new Paragraph({
                        alignment: AlignmentType.LEFT,
                        children: [
                          new ImageRun({
                            data: imgBuffer,
                            transformation: { width: 120, height: 120 },
                          } as any),
                        ],
                        indent: { left: 720 },
                        spacing: { before: 100, after: 100 }
                      }));
                    }
                  } catch (e) { console.error(e); }
                }
              });
            } else if (q.type === 'SA' && q.saSubQuestions) {
              q.saSubQuestions.forEach((sub, i) => {
                const showAnswer = !data.code;
                paragraphs.push(new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({ text: `${sub.id}) `, size: 26 }),
                    ...renderTextWithMath(sub.text, { size: 26 }),
                    ...(showAnswer ? [
                      new TextRun({ 
                        text: ` [Đáp án: ${sub.answer}]`, 
                        color: "FF0000", 
                        size: 26,
                        bold: true 
                      })
                    ] : [])
                  ],
                  indent: { left: 720 }
                }));

                if (sub.imageUrl && sub.imageUrl.includes('base64,')) {
                  try {
                    const imgBuffer = base64ToUint8Array(sub.imageUrl);
                    if (imgBuffer.length > 0) {
                      paragraphs.push(new Paragraph({
                        alignment: AlignmentType.LEFT,
                        children: [
                          new ImageRun({
                            data: imgBuffer,
                            transformation: { width: 120, height: 120 },
                          } as any),
                        ],
                        indent: { left: 720 },
                        spacing: { before: 100, after: 100 }
                      }));
                    }
                  } catch (e) { console.error(e); }
                }
              });
            }

            return paragraphs;
          }),

          // Answer Key
          new Paragraph({
            children: [new TextRun({ text: "ĐÁP ÁN", bold: true, size: 28 })],
            spacing: { before: 800, after: 400 },
            alignment: AlignmentType.CENTER,
            pageBreakBefore: true
          }),

          ...(['MCQ', 'TF', 'SA', 'TL'] as const).flatMap(type => {
            const typeQuestions = questions.filter(q => q.type === type);
            if (typeQuestions.length === 0) return [];

            const paragraphs: (Paragraph | Table)[] = [];
            let headerText = "";
            let instructionText = "";
            const totalPoints = typeQuestions.reduce((sum, q) => sum + (Number(q.points) || 0), 0);

            switch (type) {
              case 'MCQ': 
                const mcqPointsPerQuestion = typeQuestions.length > 0 ? (totalPoints / typeQuestions.length) : 0;
                headerText = `PHẦN I. CÂU HỎI TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (${totalPoints} điểm)`;
                instructionText = `Hướng dẫn: Học sinh chọn đúng một phương án đạt ${mcqPointsPerQuestion.toFixed(2).replace(/\.00$/, '')} điểm`;
                break;
              case 'TF': 
                const tfPointsPerSub = typeQuestions.length > 0 ? (totalPoints / (typeQuestions.length * 4)) : 0;
                headerText = `PHẦN II. CÂU HỎI TRẮC NGHIỆM ĐÚNG SAI (${totalPoints} điểm)`;
                instructionText = `Hướng dẫn: Học sinh xác định đúng một ý thành phần đạt ${tfPointsPerSub.toFixed(2).replace(/\.00$/, '')} điểm`;
                break;
              case 'SA': 
                const saPointsPerSub = typeQuestions.length > 0 ? (totalPoints / (typeQuestions.length * 4)) : 0;
                headerText = `PHẦN III. CÂU HỎI TRẮC NGHIỆM TRẢ LỜI NGẮN (${totalPoints} điểm)`;
                instructionText = `Hướng dẫn: Học sinh trả lời đúng một ý thành phần đạt ${saPointsPerSub.toFixed(2).replace(/\.00$/, '')} điểm`;
                break;
              case 'TL': 
                headerText = `PHẦN IV. CÂU HỎI TỰ LUẬN (${totalPoints} điểm)`;
                instructionText = "";
                break;
            }

            paragraphs.push(new Paragraph({
              children: [new TextRun({ text: headerText, bold: true, size: 26 })],
              spacing: { before: 400, after: 100 }
            }));

            if (instructionText) {
              paragraphs.push(new Paragraph({
                children: [new TextRun({ text: instructionText, italics: true, size: 24 })],
                spacing: { after: 200 }
              }));
            }

            if (type === 'MCQ') {
              const rows: TableRow[] = [];
              const cols = 10;
              for (let i = 0; i < typeQuestions.length; i += cols) {
                const rowCells: TableCell[] = [];
                for (let j = 0; j < cols; j++) {
                  const qIdx = i + j;
                  if (qIdx < typeQuestions.length) {
                    const q = typeQuestions[qIdx];
                    const ans = q.options?.find(o => o.isCorrect)?.id || "";
                    rowCells.push(new TableCell({
                      children: [new Paragraph({
                        children: [
                          new TextRun({ text: `Câu ${qIdx + 1}: `, bold: true, size: 24 }),
                          new TextRun({ text: ans, size: 24 })
                        ],
                        alignment: AlignmentType.CENTER
                      })],
                      verticalAlign: VerticalAlign.CENTER,
                    }));
                  } else {
                    rowCells.push(new TableCell({ children: [new Paragraph({ text: "" })] }));
                  }
                }
                rows.push(new TableRow({ children: rowCells }));
              }
              paragraphs.push(new Table({
                rows,
                width: { size: 100, type: WidthType.PERCENTAGE },
              }));
            } else {
              typeQuestions.forEach((q, idx) => {
                const children: any[] = [
                  new TextRun({ text: `Câu ${idx + 1}: `, bold: true, size: 26 }),
                ];

                if (q.type === 'TF') {
                  const answerText = q.tfSubQuestions?.map(s => `${s.id}: ${s.isCorrect ? "Đ" : "S"}`).join(", ") || "";
                  children.push(new TextRun({ text: answerText, size: 26 }));
                } else if (q.type === 'SA') {
                  const answerText = q.saSubQuestions?.map(s => `${s.id}: ${s.answer}`).join(", ") || "";
                  children.push(...renderTextWithMath(answerText, { size: 26 }));
                } else if (q.type === 'TL') {
                  children.push(...renderTextWithMath(q.solution || "", { size: 26 }));
                }

                paragraphs.push(new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children,
                  spacing: { before: 100 }
                }));
              });
            }

            return paragraphs;
          }),
          ...(isFullExport ? [
            new Paragraph({ text: "", spacing: { before: 800 } }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
                insideHorizontal: { style: BorderStyle.NONE },
                insideVertical: { style: BorderStyle.NONE },
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [new TextRun({ text: "GIÁO VIÊN RA ĐỀ", bold: true, size: 26 })],
                        }),
                        new Paragraph({ text: "", spacing: { before: 1200 } }),
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [new TextRun({ text: "Nguyễn Trầm Kha", bold: true, size: 26 })],
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [new TextRun({ text: "TỔ TRƯỞNG CHUYÊN MÔN DUYỆT", bold: true, size: 26 })],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ] : [])
        ],
      }
    ],
  });

    return await Packer.toBlob(doc);
  };

  const exportToWord = async (data: ExamData & { code?: string }) => {
    setIsExporting(true);
    try {
      const blob = await generateWordBlob(data);
      const baseName = `Đề ${data.title} môn ${data.subject} ${data.grade.replace(/Khối/g, 'lớp')}`;
      const fileName = `${baseName}${data.code ? ` - Mã đề ${data.code}` : ""}.docx`.replace(/[\\?%*:|"<>]/g, '_');
      saveAs(blob, fileName);
    } catch (error) {
      console.error("Export Error:", error);
      showError("Lỗi xuất file", "Có lỗi xảy ra khi xuất file Word. Vui lòng thử lại.");
    } finally {
      setIsExporting(false);
    }
  };

  const exportAllToZip = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();
      
      // Original Exam
      if (examData) {
        const originalBlob = await generateWordBlob(examData);
        const baseName = `Đề ${examData.title} môn ${examData.subject} ${examData.grade.replace(/Khối/g, 'lớp')}`;
        zip.file(`${baseName} - Gốc.docx`.replace(/[\\?%*:|"<>]/g, '_'), originalBlob);
      }

      // Shuffled Exams
      for (const exam of shuffledExams) {
        const blob = await generateWordBlob(exam);
        const baseName = `Đề ${exam.title} môn ${exam.subject} ${exam.grade.replace(/Khối/g, 'lớp')}`;
        const fileName = `${baseName} - Mã đề ${exam.code}.docx`.replace(/[\\?%*:|"<>]/g, '_');
        zip.file(fileName, blob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipName = `Đề ${examData?.title || "Đề thi"} môn ${examData?.subject || ""} ${examData?.grade?.replace(/Khối/g, 'lớp') || ""} - Bộ đề trộn.zip`.replace(/[\\?%*:|"<>]/g, '_');
      saveAs(zipBlob, zipName);
    } catch (error) {
      console.error("ZIP Export Error:", error);
      showError("Lỗi tạo ZIP", "Có lỗi xảy ra khi tạo file ZIP. Vui lòng thử lại.");
    } finally {
      setIsExporting(false);
    }
  };

  const shufflePartial = <T extends { isLocked?: boolean }>(array: T[]): T[] => {
    const newArray = [...array];
    const indicesToShuffle = newArray
      .map((item, i) => !item.isLocked ? i : -1)
      .filter(i => i !== -1);
    
    if (indicesToShuffle.length <= 1) return newArray;

    const itemsToShuffle = indicesToShuffle.map(i => newArray[i]);
    for (let i = itemsToShuffle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [itemsToShuffle[i], itemsToShuffle[j]] = [itemsToShuffle[j], itemsToShuffle[i]];
    }

    indicesToShuffle.forEach((originalIdx, i) => {
      newArray[originalIdx] = itemsToShuffle[i];
    });

    return newArray;
  };

  const deleteQuestion = (index: number) => {
    if (!examData) return;
    const newQuestions = [...examData.questions];
    newQuestions.splice(index, 1);
    setExamData({ ...examData, questions: newQuestions });
  };

  const shuffleQuestionOptions = (index: number) => {
    if (!examData) return;
    const newQuestions = [...examData.questions];
    const q = newQuestions[index];
    
    if (q.type === 'MCQ' && q.options) {
      newQuestions[index] = { ...q, options: shufflePartial(q.options) };
    } else if (q.type === 'TF' && q.tfSubQuestions) {
      newQuestions[index] = { ...q, tfSubQuestions: shufflePartial(q.tfSubQuestions) };
    } else if (q.type === 'SA' && q.saSubQuestions) {
      newQuestions[index] = { ...q, saSubQuestions: shufflePartial(q.saSubQuestions) };
    }
    
    setExamData({ ...examData, questions: newQuestions });
  };

  const shuffleAllQuestions = () => {
    if (!examData) return;
    
    const typeOrder = ['MCQ', 'TF', 'SA', 'TL'];
    let newQuestions = [...examData.questions];
    
    typeOrder.forEach(type => {
      const indices = newQuestions
        .map((q, i) => (q.type === type && !q.isLocked) ? i : -1)
        .filter(i => i !== -1);
      
      if (indices.length > 1) {
        const questionsToShuffle = indices.map(i => newQuestions[i]);
        const shuffled = shuffleArray(questionsToShuffle);
        indices.forEach((originalIdx, i) => {
          newQuestions[originalIdx] = shuffled[i];
        });
      }
    });
    
    setExamData({ ...examData, questions: newQuestions });
  };

  const shuffleAllOptions = () => {
    if (!examData) return;
    const newQuestions = (examData?.questions || []).map((q) => {
      if (q.type === 'MCQ' && q.options) {
        return { ...q, options: shufflePartial(q.options) };
      }
      if (q.type === 'TF' && q.tfSubQuestions) {
        return { ...q, tfSubQuestions: shufflePartial(q.tfSubQuestions) };
      }
      if (q.type === 'SA' && q.saSubQuestions) {
        return { ...q, saSubQuestions: shufflePartial(q.saSubQuestions) };
      }
      return q;
    });
    setExamData({ ...examData, questions: newQuestions });
  };

  const toggleLockQuestion = (index: number) => {
    if (!examData) return;
    const newQuestions = [...examData.questions];
    newQuestions[index] = { ...newQuestions[index], isLocked: !newQuestions[index].isLocked };
    setExamData({ ...examData, questions: newQuestions });
  };

  const toggleLockOption = (qIndex: number, optIndex: number) => {
    if (!examData) return;
    const newQuestions = [...examData.questions];
    const q = newQuestions[qIndex];
    
    if (q.type === 'MCQ' && q.options) {
      const newOptions = [...q.options];
      newOptions[optIndex] = { ...newOptions[optIndex], isLocked: !newOptions[optIndex].isLocked };
      newQuestions[qIndex] = { ...q, options: newOptions };
    } else if (q.type === 'TF' && q.tfSubQuestions) {
      const newSub = [...q.tfSubQuestions];
      newSub[optIndex] = { ...newSub[optIndex], isLocked: !newSub[optIndex].isLocked };
      newQuestions[qIndex] = { ...q, tfSubQuestions: newSub };
    } else if (q.type === 'SA' && q.saSubQuestions) {
      const newSub = [...q.saSubQuestions];
      newSub[optIndex] = { ...newSub[optIndex], isLocked: !newSub[optIndex].isLocked };
      newQuestions[qIndex] = { ...q, saSubQuestions: newSub };
    }
    
    setExamData({ ...examData, questions: newQuestions });
  };

  const generateAIIllustration = async (index: number) => {
    if (!examData || !apiKey) {
      if (!apiKey) setShowApiKeyModal(true);
      return;
    }
    setIsGeneratingImage(index);
    try {
      const ai = getAiInstance(apiKey);
      const q = examData.questions[index];
      const prompt = `Vẽ một hình ảnh minh họa cho câu hỏi sau đây trong đề thi ${subject} ${grade}:
      Nội dung câu hỏi: ${q.content}
      ${q.options ? `Các phương án: ${q.options.map(o => o.text).join(', ')}` : ''}
      ${q.tfSubQuestions ? `Các ý đúng sai: ${q.tfSubQuestions.map(s => s.text).join(', ')}` : ''}
      Yêu cầu: Ảnh minh họa rõ nét, mang tính giáo dục, có thể là sơ đồ, biểu đồ, hình vẽ vật thể hoặc đồ thị hàm số nếu phù hợp. Tuyệt đối KHÔNG ghi nội dung câu hỏi, KHÔNG ghi các phương án trả lời và KHÔNG chứa văn bản rườm rà vào trong ảnh.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          }
        }
      });

      let imageUrl = "";
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        const newQuestions = [...examData.questions];
        newQuestions[index] = { ...newQuestions[index], imageUrl };
        setExamData({ ...examData, questions: newQuestions });
      }
    } catch (error) {
      console.error("Image Generation Error:", error);
      showError("Lỗi tạo ảnh", "Không thể tạo ảnh minh họa lúc này do lỗi kết nối hoặc hết lượt. Thầy cô thử đăng xuất và dùng API khác trong Cài đặt API!");
    } finally {
      setIsGeneratingImage(null);
    }
  };

  const updateQuestion = (index: number, updatedFields: Partial<Question>) => {
    if (!examData) return;
    const newQuestions = [...examData.questions];
    newQuestions[index] = { ...newQuestions[index], ...updatedFields };
    setExamData({ ...examData, questions: newQuestions });
  };

  const handlePaste = async (e: React.ClipboardEvent, qIndex: number, type: 'content' | 'option' | 'tf' | 'sa', subIndex?: number) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target?.result as string;
            if (base64 && examData) {
              const newQuestions = [...examData.questions];
              const q = { ...newQuestions[qIndex] };
              
              if (type === 'content') {
                q.imageUrl = base64;
              } else if (type === 'option' && subIndex !== undefined && q.options) {
                const newOptions = [...q.options];
                newOptions[subIndex] = { ...newOptions[subIndex], imageUrl: base64 };
                q.options = newOptions;
              } else if (type === 'tf' && subIndex !== undefined && q.tfSubQuestions) {
                const newSub = [...q.tfSubQuestions];
                newSub[subIndex] = { ...newSub[subIndex], imageUrl: base64 };
                q.tfSubQuestions = newSub;
              } else if (type === 'sa' && subIndex !== undefined && q.saSubQuestions) {
                const newSub = [...q.saSubQuestions];
                newSub[subIndex] = { ...newSub[subIndex], imageUrl: base64 };
                q.saSubQuestions = newSub;
              }
              
              newQuestions[qIndex] = q;
              setExamData({ ...examData, questions: newQuestions });
            }
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  };

  const getSuggestedTopics = (subj: string, grd: string, exm: string, subSubj?: string, bk?: string) => {
    // Try to find in library
    const bookKey = bk || 'Kết nối tri thức với cuộc sống';
    const subjectLessons = LESSON_LIBRARY[subj]?.[grd]?.[bookKey];
    
    if (!subjectLessons) {
      // Fallback for missing data: generate generic n=20 list
      const n = 20;
      const generic = Array.from({ length: n }, (_, i) => `Bài ${i + 1}. Nội dung kiến thức môn ${subj} ${grd}`);
      return { lessons: sliceByExam(generic, exm), source: 'none' as const };
    }

    return { lessons: sliceByExam(subjectLessons, exm), source: 'library' as const };
  };

  // Helper to slice lessons based on the "Convention" (Quy ước)
  const sliceByExam = (lessons: string[], examType: string) => {
    const n = lessons.length;
    const q1 = Math.floor(n / 4);
    const q2 = Math.floor(n / 2);
    const q3 = Math.floor(3 * n / 4);

    const e = examType.toLowerCase();
    
    // Quy ước:
    // - Giữa HK1: 1 -> n/4
    // - Cuối HK1: 1 -> n/2
    // - Giữa HK2: n/2+1 -> 3n/4
    // - Cuối HK2: n/2+1 -> hết sách
    
    if (e.includes('giữa học kì 1')) {
      return lessons.slice(0, q1);
    } 
    if (e.includes('cuối học kì 1')) {
      return lessons.slice(0, q2);
    } 
    if (e.includes('giữa học kì 2')) {
      return lessons.slice(q2, q3);
    } 
    if (e.includes('cuối học kì 2')) {
      return lessons.slice(q2, n);
    }
    
    // Mặc định hoặc Kiểm tra thường xuyên: lấy 5 bài đầu tiên
    return lessons.slice(0, 5);
  };
  const updateSuggestedTopics = async (forceAI = false) => {
    if (forceAI && !apiKey) {
      setShowApiKeyModal(true);
      return;
    }
    setLoadingTopics(true);
    try {
      // 1. Check library first
      const { lessons: libraryLessons, source } = getSuggestedTopics(subject, grade, exam, subSubject, bookSeries);
      
      if (source === 'library' && !forceAI) {
        setTopics(libraryLessons);
        setDataSource('library');
        setLoadingTopics(false);
        return;
      }

      if (!apiKey) {
        setShowApiKeyModal(true);
        setLoadingTopics(false);
        return;
      }

      const ai = getAiInstance(apiKey);
      // 2. Use AI if not in library or forced
      const prompt = `
        Bạn là một chuyên gia giáo dục Việt Nam am hiểu sâu sắc về Chương trình Giáo dục Phổ thông (GDPT) 2018.
        Hãy liệt kê danh sách các tên bài học (nội dung cốt lõi) chính xác theo bộ sách và khối lớp sau:
        - Môn học: ${subject} ${subSubject ? `(${subSubject})` : ''}
        - Khối lớp: ${grade}
        - Bộ sách: ${bookSeries} ${customBook ? `(${customBook})` : ''}
        - Kỳ kiểm tra: ${exam}

        YÊU CẦU QUAN TRỌNG:
        1. CHỈ liệt kê tên các BÀI HỌC cụ thể (ví dụ: "Bài 1. Internet", "Bài 2. Mạng máy tính"). 
        2. TUYỆT ĐỐI KHÔNG lấy tên Chương, tên Chủ đề lớn, hoặc các đề mục tổng quát.
        3. Phải lấy đúng tên bài học theo mục lục của bộ sách ${bookSeries} cho khối ${grade}. Không được tự ý bịa đặt hoặc lấy tên bài từ bộ sách khác.
        4. QUY ƯỚC CHIA BÀI HỌC (Giả sử tổng số bài trong cả năm học là n):
           - Nếu chọn "Kiểm tra giữa học kì 1": Liệt kê các bài từ đầu sách đến khoảng bài n/4.
           - Nếu chọn "Kiểm tra cuối học kì 1": Liệt kê các bài từ đầu sách đến khoảng bài n/2.
           - Nếu chọn "Kiểm tra giữa học kì 2": Liệt kê các bài từ bài n/2+1 đến khoảng bài 3n/4.
           - Nếu chọn "Kiểm tra cuối học kì 2": Liệt kê các bài từ bài n/2+1 đến hết sách.
        
        3. ĐỊNH DẠNG TRẢ VỀ:
           - Chỉ trả về danh sách tên các bài học dưới dạng mảng JSON.
           - Mỗi phần tử có định dạng: "Bài X. Tên bài học" hoặc "Chương X. Tên chương".
           - Không trả về lời dẫn hay giải thích gì thêm.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });

      const aiTopics = safeJsonParse(response.text || "[]");
      if (aiTopics && aiTopics.length > 0) {
        setTopics(aiTopics);
        setDataSource('ai');
      } else {
        setTopics(libraryLessons);
        setDataSource('none');
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      const { lessons } = getSuggestedTopics(subject, grade, exam, subSubject, bookSeries);
      setTopics(lessons);
      setDataSource('none');
    } finally {
      setLoadingTopics(false);
    }
  };

  const generateExam = async () => {
    if (!apiKey) {
      setShowApiKeyModal(true);
      return;
    }
    setIsGeneratingExam(true);
    try {
      const ai = getAiInstance(apiKey);
      
      const activeEssays = essays.filter(e => Number(e.points) > 0);
      const mcqTotal = Number(mcqCount) * Number(mcqPoints);
      const tfTotal = Number(tfCount) * Number(tfPoints);
      const saTotal = Number(saCount) * Number(saPoints);

      const totalExpectedPoints = mcqTotal + tfTotal + saTotal + 
                               activeEssays.reduce((sum, e) => sum + Number(e.points), 0);

      const prompt = `
        Bạn là một chuyên gia khảo thí Việt Nam. Hãy soạn một bộ đề thi dựa trên các thông số sau:
        - Tiêu đề: ${(exam || "").toUpperCase()}
        - Môn học: ${subject} ${subSubject ? `(${subSubject})` : ''}
        - Khối lớp: ${grade}
        - Bộ sách: ${bookSeries}
        - Mức độ phân bổ điểm số: Nhận biết ${knowledge}%, Thông hiểu ${comprehension}%, Vận dụng ${application}%
        - Danh sách các chủ đề/bài học: ${topics.join(', ')}

        LƯU Ý QUAN TRỌNG VỀ MỨC ĐỘ NHẬN THỨC:
        - Phân bổ các mức độ nhận thức (NHẬN BIẾT, THÔNG HIỂU, VẬN DỤNG) linh hoạt cho TẤT CẢ các loại câu hỏi (MCQ, TF, SA, TL) để đảm bảo tổng điểm khớp với tỷ lệ yêu cầu.
        - ƯU TIÊN: Mỗi loại câu hỏi (ví dụ MCQ) nên có sự pha trộn của 2-3 mức độ nhận thức khác nhau (ví dụ MCQ có cả câu NB, TH và VD). Chỉ sử dụng 1 mức độ duy nhất cho một loại câu hỏi khi thực sự cần thiết hoặc không còn lựa chọn nào khác để đảm bảo tính đa dạng của đề thi.

        YÊU CẦU BẮT BUỘC VỀ SỐ LƯỢNG VÀ ĐIỂM SỐ (PHẢI TUÂN THỦ TUYỆT ĐỐI):
        Bạn PHẢI tạo ra CHÍNH XÁC số lượng câu hỏi sau, KHÔNG ĐƯỢC THIẾU DÙ CHỈ MỘT CÂU:
        ${mcqTotal > 0 ? `1. MCQ (Trắc nghiệm nhiều lựa chọn): ĐÚNG ${mcqCount} câu. Mỗi câu ${mcqPoints} điểm. Mỗi câu PHẢI có đúng 4 phương án (A, B, C, D).` : ''}
        ${tfTotal > 0 ? `2. TF (Trắc nghiệm Đúng/Sai): ĐÚNG ${tfCount} câu. Mỗi câu ${tfPoints} điểm. Mỗi câu PHẢI có đúng 4 ý (a, b, c, d).` : ''}
        ${saTotal > 0 ? `3. SA (Trắc nghiệm trả lời ngắn): ĐÚNG ${saCount} câu. Mỗi câu ${saPoints} điểm. Mỗi câu PHẢI có đúng 4 ý (a, b, c, d).` : ''}
        ${activeEssays.length > 0 ? `4. TL (Tự luận): ĐÚNG ${activeEssays.length} câu. Điểm số từng câu: ${activeEssays.map(e => `${e.name}: ${e.points}đ`).join(', ')}.` : ''}

        CHÚ Ý: Nếu tổng số câu hỏi là lớn, hãy đảm bảo bạn không dừng lại giữa chừng. Phải hoàn thành toàn bộ danh sách câu hỏi trong một lần phản hồi duy nhất.
        TỔNG ĐIỂM PHẢI LÀ ${totalExpectedPoints} ĐIỂM.
        
        YÊU CẦU VỀ BẢN ĐẶC TẢ (specifications):
        - Với mỗi cặp (Chủ đề, Mức độ) xuất hiện trong câu hỏi, tạo một mục trong "specifications".
        - "criteria" là mô tả cụ thể yêu cầu cần đạt theo chương trình GDPT 2018.
        - KHÔNG lặp lại tên mức độ hay tên bài học ở đầu "criteria".

        PHÂN BỔ ĐIỂM:
        - Nhận biết: ${knowledge}% (${totalExpectedPoints * (knowledge / 100)}đ)
        - Thông hiểu: ${comprehension}% (${totalExpectedPoints * (comprehension / 100)}đ)
        - Vận dụng: ${application}% (${totalExpectedPoints * (application / 100)}đ)

        THỜI GIAN: ${duration} phút. ĐỘ KHÓ: "${level}".

        YÊU CẦU VỀ ĐỊNH DẠNG TOÁN HỌC (LaTeX):
        - Sử dụng LaTeX chuẩn cho công thức.
        - Đảm bảo các công thức được đặt trong cặp dấu $ (inline) hoặc $$ (block).
        - Có khoảng trắng xung quanh dấu $.
        - TUYỆT ĐỐI KHÔNG bao quanh văn bản bình thường bằng dấu $.
        - Đảm bảo các công thức hiển thị chuẩn xác.

        YÊU CẦU ĐỊNH DẠNG JSON:
        Trả về DUY NHẤT một object JSON (không kèm lời dẫn) có cấu trúc:
        {
          "title": "...", "subject": "...", "grade": "...", "bookSeries": "...",
          "specifications": [{"topic": "...", "level": "...", "criteria": "..."}],
          "questions": [
            { "type": "MCQ", "level": "...", "topic": "...", "content": "...", "points": 0, "options": [{"id": "A", "text": "...", "isCorrect": false}] },
            { "type": "TF", "level": "...", "topic": "...", "content": "...", "points": 0, "tfSubQuestions": [{"id": "a", "text": "...", "isCorrect": false}] },
            { "type": "SA", "level": "...", "topic": "...", "content": "...", "points": 0, "saSubQuestions": [{"id": "a", "text": "...", "answer": "..."}] },
            { "type": "TL", "level": "...", "topic": "...", "content": "...", "points": 0, "solution": "..." }
          ]
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          systemInstruction: "Bạn là một chuyên gia khảo thí Việt Nam. Hãy soạn đề thi chuẩn GDPT 2018, nội dung khoa học, chính xác. Trả về JSON chuẩn. QUAN TRỌNG: Phải đếm kỹ số lượng câu hỏi trước khi kết thúc phản hồi để đảm bảo khớp 100% với yêu cầu.",
          responseMimeType: "application/json",
          maxOutputTokens: 16384,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              subject: { type: Type.STRING },
              grade: { type: Type.STRING },
              bookSeries: { type: Type.STRING },
              specifications: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    topic: { type: Type.STRING },
                    level: { type: Type.STRING },
                    criteria: { type: Type.STRING }
                  },
                  required: ["topic", "level", "criteria"]
                }
              },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: { 
                      type: Type.STRING, 
                      enum: ["MCQ", "TF", "SA", "TL"],
                      description: "Loại câu hỏi: MCQ (Trắc nghiệm), TF (Đúng/Sai), SA (Trả lời ngắn), TL (Tự luận)" 
                    },
                    level: { type: Type.STRING },
                    topic: { type: Type.STRING },
                    content: { type: Type.STRING },
                    points: { type: Type.NUMBER },
                    options: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          text: { type: Type.STRING },
                          isCorrect: { type: Type.BOOLEAN }
                        },
                        required: ["id", "text", "isCorrect"]
                      }
                    },
                    tfSubQuestions: {
                      type: Type.ARRAY,
                      description: "BẮT BUỘC phải có đúng 4 ý thành phần (a, b, c, d)",
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          text: { type: Type.STRING },
                          isCorrect: { type: Type.BOOLEAN }
                        },
                        required: ["id", "text", "isCorrect"]
                      }
                    },
                    saSubQuestions: {
                      type: Type.ARRAY,
                      description: "BẮT BUỘC phải có đúng 4 ý thành phần (a, b, c, d)",
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          text: { type: Type.STRING },
                          answer: { type: Type.STRING }
                        },
                        required: ["id", "text", "answer"]
                      }
                    },
                    solution: { type: Type.STRING }
                  },
                  required: ["type", "level", "topic", "content", "points"]
                }
              }
            },
            required: ["title", "subject", "grade", "bookSeries", "questions"]
          }
        }
      });

      let responseText = response.text || "{}";
      const data = safeJsonParse(responseText.trim());
      data.duration = duration;
      data.topics = topics;

      if (data.questions && data.questions.length > 0) {
        // Strict validation of question counts
        const mcqRequested = Number(mcqCount);
        const tfRequested = Number(tfCount);
        const saRequested = Number(saCount);
        const tlRequested = essays.filter(e => Number(e.points) > 0).length;

        const mcqActual = data.questions.filter((q: any) => q.type?.toUpperCase() === 'MCQ').length;
        const tfActual = data.questions.filter((q: any) => q.type?.toUpperCase() === 'TF').length;
        const saActual = data.questions.filter((q: any) => q.type?.toUpperCase() === 'SA').length;
        const tlActual = data.questions.filter((q: any) => q.type?.toUpperCase() === 'TL').length;

        // Check for missing sub-questions or options
        const incompleteMCQ = data.questions.filter((q: any) => q.type?.toUpperCase() === 'MCQ' && (!q.options || q.options.length < 4)).length;
        const incompleteTF = data.questions.filter((q: any) => q.type?.toUpperCase() === 'TF' && (!q.tfSubQuestions || q.tfSubQuestions.length < 4)).length;
        const incompleteSA = data.questions.filter((q: any) => q.type?.toUpperCase() === 'SA' && (!q.saSubQuestions || q.saSubQuestions.length < 4)).length;

        if (mcqActual < mcqRequested || tfActual < tfRequested || saActual < saRequested || tlActual < tlRequested || 
            incompleteMCQ > 0 || incompleteTF > 0 || incompleteSA > 0) {
          
          let errorMsg = `AI soạn thiếu câu hỏi hoặc nội dung không đầy đủ so với cấu trúc đề thi:\n`;
          if (mcqActual < mcqRequested) errorMsg += `- Trắc nghiệm (MCQ): Thiếu ${mcqRequested - mcqActual} câu\n`;
          if (incompleteMCQ > 0) errorMsg += `- Trắc nghiệm (MCQ): Có ${incompleteMCQ} câu thiếu phương án trả lời\n`;
          if (tfActual < tfRequested) errorMsg += `- Đúng/Sai (TF): Thiếu ${tfRequested - tfActual} câu\n`;
          if (incompleteTF > 0) errorMsg += `- Đúng/Sai (TF): Có ${incompleteTF} câu thiếu các ý a, b, c, d\n`;
          if (saActual < saRequested) errorMsg += `- Trả lời ngắn (SA): Thiếu ${saRequested - saActual} câu\n`;
          if (incompleteSA > 0) errorMsg += `- Trả lời ngắn (SA): Có ${incompleteSA} câu thiếu các ý a, b, c, d\n`;
          if (tlActual < tlRequested) errorMsg += `- Tự luận (TL): Thiếu ${tlRequested - tlActual} câu\n`;
          
          errorMsg += `\nVui lòng nhấn "Kích hoạt soạn đề AI" để AI soạn lại đề đầy đủ hơn.`;
          throw new Error(errorMsg);
        }

        // Sort questions by type to match Part I, II, III, IV
        const typeOrder: Record<string, number> = { 'MCQ': 1, 'TF': 2, 'SA': 3, 'TL': 4 };
        data.questions.sort((a: any, b: any) => (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99));

        data.questions = data.questions.map((q: any, idx: number) => {
          let finalQ = { ...q };
          if (finalQ.type === 'TF') {
            const subs = finalQ.tfSubQuestions || [];
            const ids = ['a', 'b', 'c', 'd'];
            finalQ.tfSubQuestions = ids.map((id, i) => {
              if (subs[i]) return { ...subs[i], id };
              return { id, text: `Ý ${id} (AI chưa soạn thảo nội dung)`, isCorrect: false };
            });
          } else if (finalQ.type === 'SA') {
            const subs = finalQ.saSubQuestions || [];
            const ids = ['a', 'b', 'c', 'd'];
            finalQ.saSubQuestions = ids.map((id, i) => {
              if (subs[i]) return { ...subs[i], id };
              return { id, text: `Ý ${id} (AI chưa soạn thảo nội dung)`, answer: "Chưa có đáp án" };
            });
          }

          let pts = finalQ.points;
          if (finalQ.type === 'MCQ') pts = Number(mcqPoints);
          else if (finalQ.type === 'TF') pts = Number(tfPoints);
          else if (finalQ.type === 'SA') pts = Number(saPoints);
          else if (finalQ.type === 'TL') {
            // Assign points from active essays list sequentially
            const tlQuestions = data.questions.filter((item: any) => item.type === 'TL');
            const tlIdx = tlQuestions.indexOf(q);
            if (tlIdx !== -1 && activeEssays[tlIdx]) {
              pts = Number(activeEssays[tlIdx].points);
            }
          }
          return {
            ...finalQ,
            points: pts,
            id: finalQ.id || `q-${idx + 1}`
          };
        });
        setExamData(data);
        setStep(3);
      } else {
        throw new Error("Không thể trích xuất được câu hỏi từ phản hồi của AI.");
      }
    } catch (error) {
      console.error("Exam Generation Error:", error);
      const msg = error.message || "";
      let userFriendlyMsg = "Có lỗi xảy ra khi soạn đề AI. Vui lòng thử lại.";
      
      if (msg.toLowerCase().includes("quota") || msg.toLowerCase().includes("429")) {
        userFriendlyMsg = "Tài khoản của thầy cô đã hết lượt sử dụng (Quota exceeded). Thầy cô thử đăng xuất và dùng API khác trong Cài đặt API!";
      } else if (msg.toLowerCase().includes("network") || msg.toLowerCase().includes("fetch")) {
        userFriendlyMsg = "Lỗi kết nối mạng: Không thể kết nối tới máy chủ AI. Thầy cô vui lòng kiểm tra lại đường truyền internet hoặc thử đăng xuất và dùng API khác trong Cài đặt API!";
      } else if (msg.toLowerCase().includes("api key") || msg.toLowerCase().includes("invalid")) {
        userFriendlyMsg = "API Key không hợp lệ hoặc đã hết hạn. Thầy cô thử đăng xuất và dùng API khác trong Cài đặt API!";
      }
      
      showError("Lỗi soạn đề AI", userFriendlyMsg);
    } finally {
      setIsGeneratingExam(false);
    }
  };

  const total = knowledge + comprehension + application;
  const totalPoints = (Number(mcqCount) * Number(mcqPoints)) + (Number(tfCount) * Number(tfPoints)) + (Number(saCount) * Number(saPoints)) + essays.reduce((sum, e) => sum + Number(e.points), 0);

  const handleNumericInput = (value: string, setter: (val: number | string) => void) => {
    if (value === '') {
      setter('');
      return;
    }
    const num = Number(value);
    if (!isNaN(num)) {
      setter(Math.max(0, num));
    }
  };

  const resetApp = () => {
    setStep(1);
    setMaxStepReached(1);
    setLevel('vừa-phải');
    setKnowledge(40);
    setComprehension(30);
    setApplication(30);
    setSubject('Toán học');
    setGrade('Khối 12');
    setExam('Kiểm tra giữa học kì 1');
    setDuration(90);
    setBookSeries('Kết nối tri thức với cuộc sống');
    setCustomBook('');
    setSubSubject('');
    setMcqCount(16);
    setMcqPoints(0.25);
    setTfCount(2);
    setTfPoints(1);
    setSaCount(2);
    setSaPoints(1);
    setEssays([
      { id: 1, name: 'Câu tự luận 1', points: 1 },
      { id: 2, name: 'Câu tự luận 2', points: 1 },
    ]);
    setTopics([]);
    setNewTopic('');
    setExamData(null);
    setMasterExamData(null);
    setShuffledExams([]);
    setNumCodes(4);
    setDataSource('none');
    setIsGeneratingExam(false);
    setEditingQuestionIndex(null);
    setIsGeneratingImage(null);
    setIsShuffling(false);
    setIsExporting(false);
    setLoadingTopics(false);
    setLoadingMessageIndex(0);
  };

  const handleNewAndClose = () => {
    setShowNewConfirm(true);
  };

  const confirmNewAndClose = (save: boolean) => {
    if (save) {
      saveState();
    }
    resetApp();
    setShowNewConfirm(false);
  };

  const saveState = () => {
    const state = {
      step,
      level,
      knowledge,
      comprehension,
      application,
      subject,
      grade,
      exam,
      bookSeries,
      customBook,
      subSubject,
      duration,
      mcqCount,
      mcqPoints,
      tfCount,
      tfPoints,
      saCount,
      saPoints,
      essays,
      topics,
      dataSource,
      examData
    };

    const baseName = `${exam}_${subject}_${grade}`.replace(/[\s/\\?%*:|"<>]/g, '_');
    const fileName = `${baseName} Bước ${step}.json`;
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const openState = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event: any) => {
        try {
          const state = JSON.parse(event.target.result);
          if (state.step !== undefined) setStep(state.step);
          if (state.level !== undefined) setLevel(state.level);
          if (state.knowledge !== undefined) setKnowledge(state.knowledge);
          if (state.comprehension !== undefined) setComprehension(state.comprehension);
          if (state.application !== undefined) setApplication(state.application);
          if (state.subject !== undefined) setSubject(state.subject);
          if (state.grade !== undefined) setGrade(state.grade);
          if (state.exam !== undefined) setExam(state.exam);
          if (state.bookSeries !== undefined) setBookSeries(state.bookSeries);
          if (state.customBook !== undefined) setCustomBook(state.customBook);
          if (state.subSubject !== undefined) setSubSubject(state.subSubject);
          if (state.duration !== undefined) setDuration(state.duration);
          if (state.mcqCount !== undefined) setMcqCount(state.mcqCount);
          if (state.mcqPoints !== undefined) setMcqPoints(state.mcqPoints);
          if (state.tfCount !== undefined) setTfCount(state.tfCount);
          if (state.tfPoints !== undefined) setTfPoints(state.tfPoints);
          if (state.saCount !== undefined) setSaCount(state.saCount);
          if (state.saPoints !== undefined) setSaPoints(state.saPoints);
          if (state.essays !== undefined) setEssays(state.essays);
          if (state.topics !== undefined) setTopics(state.topics);
          if (state.dataSource !== undefined) setDataSource(state.dataSource);
          if (state.examData !== undefined) setExamData(state.examData);
        } catch (error) {
          console.error("Error parsing JSON file:", error);
          showError("Lỗi mở file", "Định dạng file không hợp lệ hoặc file đã bị hỏng. Vui lòng kiểm tra lại.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const addEssay = () => {
    const newId = essays.length > 0 ? Math.max(...essays.map(e => e.id)) + 1 : 1;
    setEssays([...essays, { id: newId, name: `Câu tự luận ${essays.length + 1}`, points: 1 }]);
  };

  const removeEssay = (id: number) => {
    setEssays(essays.filter(e => e.id !== id));
  };

  const updateEssayPoints = (id: number, pts: string) => {
    setEssays(essays.map(e => {
      if (e.id === id) {
        if (pts === '') return { ...e, points: '' };
        const num = Number(pts);
        return { ...e, points: isNaN(num) ? e.points : Math.max(0, num) };
      }
      return e;
    }));
  };

  const addTopic = () => {
    if (newTopic.trim()) {
      setTopics([...topics, newTopic.trim()]);
      setNewTopic('');
    }
  };

  const removeTopic = (index: number) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  const subjects = [
    'Toán học', 'Vật lí', 'Hóa học', 'Sinh học', 
    'Lịch sử', 'Địa lí', 'Giáo dục kinh tế và pháp luật', 'Giáo dục công dân', 'Công nghệ', 
    'Tin học', 'Khoa học tự nhiên', 'Lịch sử và Địa lí'
  ];

  const grades = Array.from({ length: 7 }, (_, i) => `Khối ${i + 6}`);
  
  const exams = [
    'Kiểm tra giữa học kì 1',
    'Kiểm tra cuối học kì 1',
    'Kiểm tra giữa học kì 2',
    'Kiểm tra cuối học kì 2',
    'Kiểm tra thường xuyên'
  ];

  const books = [
    'Kết nối tri thức với cuộc sống',
    'Cánh diều',
    'Chân trời sáng tạo',
    'Khác'
  ];

  const subSubjectsMap: Record<string, string[]> = {
    'Tin học': ['Tin học ứng dụng ICT', 'Khoa học máy tính CS'],
    'Công nghệ': ['Công nghệ công nghiệp', 'Công nghệ nông nghiệp']
  };

  const isHighSchool = ['Khối 10', 'Khối 11', 'Khối 12'].includes(grade);
  const hasSubSubject = isHighSchool && subSubjectsMap[subject];

  return (
    <div className="min-h-screen p-1 md:p-2 max-w-7xl mx-auto">
      {/* Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[32px] p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
          >
            <button 
              onClick={() => setShowGuide(false)}
              className="absolute top-6 right-6 p-3 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-8 h-8 text-slate-400" />
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/20">
                <HelpCircle className="text-white w-8 h-8" />
              </div>
              <div>
                <h2 className="text-[40px] font-black text-slate-900 uppercase tracking-tight">Hướng dẫn sử dụng</h2>
                <p className="text-slate-500 font-bold text-[16px] uppercase tracking-widest mt-1">SmartTest AI PRO - Trợ lý soạn đề thông minh</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <section>
                  <h3 className="flex items-center gap-2 text-[24px] font-black text-blue-600 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-[16px]">1</div>
                    THAY ĐỔI API
                  </h3>
                  <p className="text-[18px] text-slate-600 leading-relaxed">
                    Nếu thầy cô đã dùng hết API miễn phí/ngày xin vui lòng <strong>Đăng xuất</strong> và copy/dán API khác để tiếp tục!
                  </p>
                </section>

                <section>
                  <h3 className="flex items-center gap-2 text-[24px] font-black text-blue-600 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-[16px]">2</div>
                    CẤU HÌNH ĐỀ THI (BƯỚC 1)
                  </h3>
                  <div className="text-[18px] text-slate-600 leading-relaxed space-y-1">
                    <p>- Chọn Môn học - Khối lớp - Tên kì KTĐG - Bộ sách giáo khoa - Nhập thời gian làm bài - Chọn độ khó cho đề</p>
                    <p>- Kéo trượt các nút hoặc nhập số để chọn Tỉ lệ ma trận năng lực. Mặc định NB/TH/VD:40/30/30 (%)</p>
                  </div>
                </section>

                <section>
                  <h3 className="flex items-center gap-2 text-[24px] font-black text-blue-600 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-[16px]">3</div>
                    THIẾT LẬP MA TRẬN (BƯỚC 2)
                  </h3>
                  <div className="text-[18px] text-slate-600 leading-relaxed space-y-1">
                    <p>- Ứng dụng thiết kế với 4 loại câu: MCQ, TF, SA và TL</p>
                    <p>- Thầy cô chọn lại Số câu, điểm/câu cho từng loại. Nếu không sử dụng loại câu nào thì đặt số câu loại đó là 0</p>
                    <p>- AI đề xuất sẵn các nội dung cốt lõi, thầy cô có thể xóa/thêm bài học. Trong trường hợp AI không đề xuất hoặc sai tên bài, hãy nhấn "Tải lại bằng AI"</p>
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <section>
                  <h3 className="flex items-center gap-2 text-[24px] font-black text-blue-600 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-[16px]">4</div>
                    SOẠN ĐỀ VÀ CHỈNH SỬA (BƯỚC 3)
                  </h3>
                  <div className="text-[18px] text-slate-600 leading-relaxed">
                    Sau khi AI soạn xong, thầy cô có thể:
                    <ul className="list-disc ml-5 mt-2 space-y-1">
                      <li>Chỉnh sửa nội dung câu hỏi, phương án, đáp án bằng công cụ "cây bút"</li>
                      <li>Tạo hình ảnh minh họa cho câu hỏi bằng AI. Lưu ý: AI vẽ tốt dạng hình ảnh nghệ thuật như họa sĩ, chưa chính xác về mặt khoa học. Thầy cô có thể copy/dán hình ảnh từ nguồn khác vào câu hỏi/đáp án</li>
                      <li>Chọn khóa các câu hỏi/đáp án (nếu muốn) để không bị thay đổi khi trộn đề bằng cách click công cụ "mũi tên tròn" màu xanh.</li>
                      <li>Sau khi kiểm tra kỹ, thầy cô có thể "Xuất hồ sơ đề", trong file word này có đầy đủ các phần: Mục tiêu-Ma trận-Đặc tả-Đề gốc-Đáp án. Nếu thầy cô quên thì file này vẫn có trong file Zip ở Bước 4</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="flex items-center gap-2 text-[24px] font-black text-blue-600 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-[16px]">5</div>
                    TRỘN ĐỀ VÀ XUẤT BẢN (BƯỚC 4)
                  </h3>
                  <p className="text-[18px] text-slate-600 leading-relaxed">
                    Nhập số lượng mã đề cần tạo (mặc định sẵn: 4) và nhấn <strong>"Cập nhật danh sách mã đề"</strong>. 
                    Hệ thống sẽ hoán vị câu hỏi và phương án. Cuối cùng, thầy cô có thể xem/tải xuống file <strong>Word (.docx)</strong> từng mã đề hoặc <strong>"Tải file ZIP (Full)"</strong> chứa toàn bộ Hồ sơ đề và các mã đề.
                  </p>
                </section>

                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                  <h4 className="text-[18px] font-bold text-emerald-900 mb-2">Một số Lưu ý khác:</h4>
                  <ul className="text-[16px] text-emerald-800 space-y-2 leading-relaxed italic">
                    <li>- Thầy cô có thể <strong>Lưu</strong> trạng thái đang làm việc thành file <strong>.json</strong> và <strong>Mở</strong> lại sau này để tiếp tục chỉnh sửa mà không mất dữ liệu.</li>
                    <li>- Trong các file word đề, nếu có sử dụng biểu thức toán thì phần này sẽ nằm trong <strong>$...$</strong> và có màu xanh ngọc. Thầy cô có thể chọn từng nội dung hoặc tất cả và chuyển sang thẻ <strong>MathType</strong>, bấm tổ hợp <strong>"Alt+\"</strong> để chuyển sang dạng chuẩn SGK.</li>
                  </ul>
                </div>

                <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-2xl text-center">
                  <p className="text-[18px] font-bold text-blue-900 leading-relaxed">
                    Ứng dụng được tạo bởi GEMINI và thầy NGUYỄN TRẦM KHA - Trường THCS & THPT Nam Yên, tỉnh An Giang
                  </p>
                  <p className="text-[16px] text-blue-800 mt-2 leading-relaxed italic">
                    - Hiện tại, ứng dụng tập trung vào bộ sách KNTT là chủ yếu và Phù hợp với một số GV, chưa mang "chất" chung của cộng đồng và còn nhiều hạn chế.<br />
                    - Xin thầy cô góp ý qua zalo t/g để cải thiện ứng dụng. Trân trọng cám ơn!
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <button 
                onClick={() => setShowGuide(false)}
                className="px-16 py-6 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl active:scale-95 text-[24px]"
              >
                TÔI ĐÃ HIỂU
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
          >
            {apiKey && (
              <button 
                onClick={() => setShowApiKeyModal(false)}
                className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            )}

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-blue-600 uppercase tracking-tight">Cài đặt API</h2>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-3">Bước 1:</p>
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-100 transition-all group"
                >
                  <span className="text-2xl">🔑</span>
                  <span className="font-bold text-blue-600 uppercase tracking-tight">Lấy API Key</span>
                </a>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-3">Hướng dẫn:</p>
                <ul className="space-y-2 text-sm text-slate-600 font-medium">
                  <li className="flex gap-2">
                    <span className="text-blue-500">1.</span>
                    <span>Nhấn nút 'LẤY API KEY' phía trên</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-500">2.</span>
                    <span>Nhấn 'Create API key' (màu xanh)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-500">3.</span>
                    <span>Copy mã đó và Dán vào ô Bước 2 bên dưới</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <p className="text-[10px] italic text-emerald-700">Lấy key miễn phí tại Google AI Studio</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-3">Bước 2:</p>
                <div className="relative">
                  <input 
                    type="password"
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    placeholder="DÁN API KEY VÀO ĐÂY"
                    className="w-full py-4 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-center font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              <button 
                onClick={handleSaveApiKey}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98] transition-all uppercase tracking-tight"
              >
                Lưu & Bắt đầu
              </button>

              {apiKey && (
                <div className="pt-2 border-t border-slate-100">
                  {!showLogoutConfirm ? (
                    <button 
                      onClick={() => setShowLogoutConfirm(true)}
                      className="w-full py-4 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl font-bold text-sm hover:bg-rose-100 transition-all uppercase tracking-tight flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" /> Đăng xuất API
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-center text-xs font-bold text-rose-600 uppercase tracking-tight">Xác nhận đăng xuất API Key?</p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setShowLogoutConfirm(false)}
                          className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs hover:bg-slate-200 transition-all uppercase tracking-tight"
                        >
                          Hủy
                        </button>
                        <button 
                          onClick={handleLogoutApiKey}
                          className="flex-1 py-3 bg-rose-600 text-white rounded-2xl font-bold text-xs hover:bg-rose-700 transition-all uppercase tracking-tight shadow-lg shadow-rose-600/20"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* AI Generating Loading Overlay */}
      {isGeneratingExam && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md p-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[40px] p-12 max-w-lg w-full shadow-[0_0_50px_rgba(16,185,129,0.3)] border-4 border-emerald-500/20 flex flex-col items-center text-center relative overflow-hidden"
          >
            {/* Decorative top bar */}
            <div className="absolute top-0 left-0 w-full h-3 bg-emerald-500" />
            
            <div className="mb-10 relative">
              <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-emerald-100 shadow-inner">
                <Sparkles className="w-16 h-16 text-emerald-600 animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2">
                 <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-xl animate-bounce">
                   <Plus className="w-6 h-6 text-white" />
                 </div>
              </div>
            </div>

            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-6">
              Hệ thống đang soạn đề
            </h2>
            
            <p className="text-slate-600 font-bold text-lg leading-relaxed mb-8">
              Vui lòng đợi trong giây lát để AI hoàn thiện hồ sơ đề thi chuẩn GDPT 2018 và CV 7991.
            </p>

            {/* Progress bar simulation */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 25, ease: "linear" }}
                className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]"
              />
            </div>
            <motion.span 
              key={loadingMessageIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-xs font-black text-emerald-600 uppercase tracking-widest"
            >
              {loadingMessages[loadingMessageIndex]}
            </motion.span>
          </motion.div>

          {/* Warning message below the box */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 max-w-3xl text-center px-4"
          >
            <p className="text-slate-300 text-base font-bold leading-relaxed italic">
              "Ứng dụng không thể đáp ứng 100% nhu cầu của thầy cô cũng như không biết trung bình học sinh của thầy cô ở mức độ năng lực nào để ra đề cho phù hợp. Hãy kiểm tra lại đề trước khi tổ chức kiểm tra. Trân trọng!"
            </p>
          </motion.div>
        </div>
      )}
      {/* Header Section */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2 mb-2">
        <div className="flex items-center gap-4">
          <div className="bg-brand-primary p-3 rounded-2xl shadow-lg shadow-brand-primary/20">
            <Sparkles className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter flex items-center gap-2">
              SmartTest AI <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full border border-green-200">PRO</span>
            </h1>
            <div className="text-emerald-900 mt-2 text-xs font-bold uppercase tracking-tight">
              Giải pháp thông minh KTĐG cho Giáo dục 4.0
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
            <span className="text-[10px] font-bold text-black px-2 uppercase">Tác vụ:</span>
            <button onClick={handleNewAndClose} className="bg-rose-500 text-white p-2 rounded-xl hover:bg-rose-600 transition-colors flex items-center gap-2 px-4 text-sm font-bold">
              <Plus className="w-4 h-4" /> Mới và Đóng
            </button>
            <button onClick={openState} className="btn-outline text-sm">
              <FolderOpen className="w-4 h-4" /> Mở
            </button>
            <button onClick={saveState} className="btn-outline text-sm bg-brand-primary/5 text-brand-primary border-brand-primary/20">
              <Save className="w-4 h-4" /> Lưu
            </button>
            <button onClick={() => setShowApiKeyModal(true)} className="btn-outline text-sm bg-slate-900 text-white border-slate-900">
              <Settings className="w-4 h-4" /> Cài đặt API
            </button>
            <button onClick={() => setShowGuide(true)} className="btn-outline text-sm bg-blue-600 text-white border-blue-600 hover:bg-blue-700">
              <HelpCircle className="w-4 h-4" /> Hướng dẫn
            </button>

          </div>
        </div>
      </header>

      {/* Navigation Steps */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        <div className="flex items-center gap-2 bg-white/50 p-1 rounded-2xl border border-slate-100">
          {[
            { id: 1, label: 'Cấu hình', icon: Settings },
            { id: 2, label: 'Ma trận', icon: LayoutGrid },
            { id: 3, label: 'Xem đề gốc', icon: FileText },
            { id: 4, label: 'Trộn đề', icon: Shuffle },
          ].map((s, idx) => {
            const isClickable = s.id <= maxStepReached;
            return (
              <div key={s.id} className="flex items-center gap-2">
                <button 
                  onClick={() => isClickable && setStep(s.id)}
                  disabled={!isClickable}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${
                    step === s.id 
                      ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                      : isClickable 
                        ? 'text-slate-600 hover:bg-slate-100 cursor-pointer' 
                        : 'text-slate-300 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    step === s.id ? 'bg-white/20' : isClickable ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100'
                  }`}>
                    {s.id}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-bold leading-none">{s.label}</span>
                  </div>
                </button>
                {idx < 3 && <div className="w-3 h-px bg-slate-200" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Grid */}
      {step === 1 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Card: Basic Configuration */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-emerald-50 p-2 rounded-xl">
                <Settings className="text-brand-primary w-6 h-6" />
              </div>
              <h2 className="text-xl font-black tracking-tight uppercase">Cấu hình cơ bản</h2>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="input-group">
                  <label className="input-label">Môn học</label>
                  <select 
                    value={subject} 
                    onChange={(e) => {
                      setSubject(e.target.value);
                      setSubSubject(''); // Reset sub-subject when subject changes
                    }}
                    className="input-field font-bold appearance-none"
                  >
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Khối lớp giảng dạy</label>
                  <select 
                    value={grade} 
                    onChange={(e) => {
                      setGrade(e.target.value);
                      setSubSubject(''); // Reset sub-subject when grade changes
                    }}
                    className="input-field font-bold appearance-none"
                  >
                    {grades.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              {hasSubSubject && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="input-group bg-emerald-50 p-3 rounded-2xl border border-emerald-100 shadow-sm"
                >
                  <label className="input-label text-emerald-900">Phân môn</label>
                  <select 
                    value={subSubject} 
                    onChange={(e) => setSubSubject(e.target.value)}
                    className="input-field font-bold appearance-none border-emerald-200 bg-white focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="">-- Chọn phân môn --</option>
                    {subSubjectsMap[subject].map(sub => <option key={sub} value={sub}>{sub}</option>)}
                  </select>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2 input-group">
                  <label className="input-label">Tên kỳ kiểm tra đánh giá</label>
                  <select 
                    value={exam} 
                    onChange={(e) => setExam(e.target.value)}
                    className="input-field font-bold appearance-none"
                  >
                    {exams.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Thời gian (phút)</label>
                  <input 
                    type="number" 
                    value={duration}
                    onChange={(e) => handleNumericInput(e.target.value, setDuration)}
                    className="input-field font-bold"
                    placeholder="Phút..."
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Bộ sách</label>
                <div className="flex flex-col gap-2">
                  <select 
                    value={bookSeries} 
                    onChange={(e) => setBookSeries(e.target.value)}
                    className="input-field font-bold appearance-none"
                  >
                    {books.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  {bookSeries === 'Khác' && (
                    <input 
                      type="text" 
                      placeholder="Nhập tên bộ sách..." 
                      value={customBook}
                      onChange={(e) => setCustomBook(e.target.value)}
                      className="input-field font-bold mt-1"
                    />
                  )}
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Phân loại mức độ năng lực</label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl">
                  {[
                    { label: 'Dễ', val: 'dễ', color: 'bg-emerald-600' },
                    { label: 'Vừa phải', val: 'vừa-phải', color: 'bg-blue-600' },
                    { label: 'Khó', val: 'khó', color: 'bg-rose-600' }
                  ].map((l) => {
                    const isActive = level === l.val;
                    return (
                      <button
                        key={l.label}
                        onClick={() => setLevel(l.val)}
                        className={`py-3 rounded-xl text-xs font-bold transition-all ${isActive ? `${l.color} text-white shadow-lg scale-[1.02]` : 'text-slate-500 hover:bg-white/50'}`}
                      >
                        {l.label.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Card: Matrix Ratio */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card flex flex-col"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-emerald-50 p-2 rounded-xl">
                <LayoutGrid className="text-brand-primary w-6 h-6" />
              </div>
              <h2 className="text-xl font-black tracking-tight uppercase">Tỉ lệ ma trận năng lực (%)</h2>
            </div>

            <div className="space-y-6 flex-grow">
              {/* Knowledge Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">NHẬN BIẾT (Knowledge)</span>
                  <div className="flex items-center gap-1 border-b-2 border-slate-900 pb-1">
                    <input 
                      type="number" 
                      value={knowledge} 
                      onChange={(e) => setKnowledge(Number(e.target.value))}
                      className="text-2xl font-black text-slate-900 w-16 text-right bg-transparent outline-none"
                      min="0" max="100"
                    />
                    <span className="text-2xl font-black text-slate-900">%</span>
                  </div>
                </div>
                <div className="relative h-6 flex items-center">
                  {/* Track Background */}
                  <div className="absolute w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    {/* Ticks Inside Track */}
                    <div className="absolute w-full h-full flex justify-between px-1">
                      {[...Array(11)].map((_, i) => (
                        <div key={i} className="w-0.5 h-full bg-slate-200" />
                      ))}
                    </div>
                  </div>

                  {/* Slider Input */}
                  <input 
                    type="range" 
                    min="0" max="100" 
                    step="1"
                    value={knowledge} 
                    onChange={(e) => setKnowledge(parseInt(e.target.value))}
                    className="absolute w-full bg-transparent appearance-none cursor-pointer z-10 
                      [&::-webkit-slider-thumb]:appearance-none 
                      [&::-webkit-slider-thumb]:w-5 
                      [&::-webkit-slider-thumb]:h-5 
                      [&::-webkit-slider-thumb]:rounded-full 
                      [&::-webkit-slider-thumb]:bg-blue-600 
                      [&::-webkit-slider-thumb]:border-2 
                      [&::-webkit-slider-thumb]:border-white 
                      [&::-webkit-slider-thumb]:shadow-lg
                      [&::-moz-range-thumb]:w-5
                      [&::-moz-range-thumb]:h-5
                      [&::-moz-range-thumb]:rounded-full
                      [&::-moz-range-thumb]:bg-blue-600
                      [&::-moz-range-thumb]:border-2
                      [&::-moz-range-thumb]:border-white
                      [&::-moz-range-thumb]:shadow-lg"
                  />
                </div>
              </div>

              {/* Comprehension Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">THÔNG HIỂU (Comprehension)</span>
                  <div className="flex items-center gap-1 border-b-2 border-slate-900 pb-1">
                    <input 
                      type="number" 
                      value={comprehension} 
                      onChange={(e) => setComprehension(Number(e.target.value))}
                      className="text-2xl font-black text-slate-900 w-16 text-right bg-transparent outline-none"
                      min="0" max="100"
                    />
                    <span className="text-2xl font-black text-slate-900">%</span>
                  </div>
                </div>
                <div className="relative h-6 flex items-center">
                  {/* Track Background */}
                  <div className="absolute w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    {/* Ticks Inside Track */}
                    <div className="absolute w-full h-full flex justify-between px-1">
                      {[...Array(11)].map((_, i) => (
                        <div key={i} className="w-0.5 h-full bg-slate-200" />
                      ))}
                    </div>
                  </div>

                  {/* Slider Input */}
                  <input 
                    type="range" 
                    min="0" max="100" 
                    step="1"
                    value={comprehension} 
                    onChange={(e) => setComprehension(parseInt(e.target.value))}
                    className="absolute w-full bg-transparent appearance-none cursor-pointer z-10 
                      [&::-webkit-slider-thumb]:appearance-none 
                      [&::-webkit-slider-thumb]:w-5 
                      [&::-webkit-slider-thumb]:h-5 
                      [&::-webkit-slider-thumb]:rounded-full 
                      [&::-webkit-slider-thumb]:bg-emerald-600 
                      [&::-webkit-slider-thumb]:border-2 
                      [&::-webkit-slider-thumb]:border-white 
                      [&::-webkit-slider-thumb]:shadow-lg
                      [&::-moz-range-thumb]:w-5
                      [&::-moz-range-thumb]:h-5
                      [&::-moz-range-thumb]:rounded-full
                      [&::-moz-range-thumb]:bg-emerald-600
                      [&::-moz-range-thumb]:border-2
                      [&::-moz-range-thumb]:border-white
                      [&::-moz-range-thumb]:shadow-lg"
                  />
                </div>
              </div>

              {/* Application Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">VẬN DỤNG (Application)</span>
                  <div className="flex items-center gap-1 border-b-2 border-slate-900 pb-1">
                    <input 
                      type="number" 
                      value={application} 
                      onChange={(e) => setApplication(Number(e.target.value))}
                      className="text-2xl font-black text-slate-900 w-16 text-right bg-transparent outline-none"
                      min="0" max="100"
                    />
                    <span className="text-2xl font-black text-slate-900">%</span>
                  </div>
                </div>
                <div className="relative h-6 flex items-center">
                  {/* Track Background */}
                  <div className="absolute w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    {/* Ticks Inside Track */}
                    <div className="absolute w-full h-full flex justify-between px-1">
                      {[...Array(11)].map((_, i) => (
                        <div key={i} className="w-0.5 h-full bg-slate-200" />
                      ))}
                    </div>
                  </div>

                  {/* Slider Input */}
                  <input 
                    type="range" 
                    min="0" max="100" 
                    step="1"
                    value={application} 
                    onChange={(e) => setApplication(parseInt(e.target.value))}
                    className="absolute w-full bg-transparent appearance-none cursor-pointer z-10 
                      [&::-webkit-slider-thumb]:appearance-none 
                      [&::-webkit-slider-thumb]:w-5 
                      [&::-webkit-slider-thumb]:h-5 
                      [&::-webkit-slider-thumb]:rounded-full 
                      [&::-webkit-slider-thumb]:bg-orange-800 
                      [&::-webkit-slider-thumb]:border-2 
                      [&::-webkit-slider-thumb]:border-white 
                      [&::-webkit-slider-thumb]:shadow-lg
                      [&::-moz-range-thumb]:w-5
                      [&::-moz-range-thumb]:h-5
                      [&::-moz-range-thumb]:rounded-full
                      [&::-moz-range-thumb]:bg-orange-800
                      [&::-moz-range-thumb]:border-2
                      [&::-moz-range-thumb]:border-white
                      [&::-moz-range-thumb]:shadow-lg"
                  />
                </div>
              </div>
            </div>

            <div className="mt-2 flex justify-between items-center">
              <div className={`px-6 py-3 rounded-2xl font-bold text-lg border-2 transition-all ${total === 100 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                Tổng: {total}%
              </div>
              <button 
                onClick={async () => {
                  if (total === 100) {
                    setStep(2);
                    await updateSuggestedTopics();
                  }
                }}
                disabled={total !== 100 || loadingTopics}
                className={`px-10 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-xl active:scale-95 ${
                  total === 100 
                    ? 'bg-slate-900 text-white hover:bg-black shadow-slate-900/20 cursor-pointer' 
                    : 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed'
                }`}
              >
                Tiếp tục <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      ) : step === 2 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Card: Exam Structure */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-50 p-2 rounded-xl">
                  <FileText className="text-brand-primary w-6 h-6" />
                </div>
                <h2 className="text-xl font-black tracking-tight uppercase">Cấu trúc đề thi</h2>
              </div>
              <div className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${Math.abs(totalPoints - 10) < 0.01 ? 'bg-slate-900 text-emerald-400' : 'bg-rose-100 text-rose-700'}`}>
                TỔNG ĐIỂM: {totalPoints.toFixed(1)}
              </div>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-2 text-[10px] font-bold text-slate-400 uppercase px-2">
                <div>Phần / Loại câu</div>
                <div className="text-center">Số câu</div>
                <div className="text-center">Điểm/Câu</div>
                <div className="text-right">Điểm</div>
              </div>

              {/* MCQ Row */}
              <div className="grid grid-cols-4 gap-2 items-center p-1.5 hover:bg-slate-50 rounded-xl transition-colors">
                <div className="text-sm font-bold">Phần I: MCQ</div>
                <div className="flex justify-center">
                  <input 
                    type="number" 
                    value={mcqCount} 
                    onChange={(e) => handleNumericInput(e.target.value, setMcqCount)}
                    className="w-16 p-1.5 bg-white border border-emerald-100 rounded-xl text-center font-bold text-sm outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex justify-center">
                  <input 
                    type="number" 
                    step="0.05"
                    value={mcqPoints} 
                    onChange={(e) => handleNumericInput(e.target.value, setMcqPoints)}
                    className="w-20 p-1.5 bg-white border border-emerald-100 rounded-xl text-center font-bold text-sm outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="text-right font-black text-slate-900">{(Number(mcqCount) * Number(mcqPoints)).toFixed(2)}</div>
              </div>

              {/* T/F Row */}
              <div className="grid grid-cols-4 gap-2 items-center p-1.5 hover:bg-slate-50 rounded-xl transition-colors">
                <div className="text-sm font-bold">Phần II: T/F</div>
                <div className="flex justify-center">
                  <input 
                    type="number" 
                    value={tfCount} 
                    onChange={(e) => handleNumericInput(e.target.value, setTfCount)}
                    className="w-16 p-1.5 bg-white border border-emerald-100 rounded-xl text-center font-bold text-sm outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex justify-center">
                  <input 
                    type="number" 
                    value={tfPoints} 
                    onChange={(e) => handleNumericInput(e.target.value, setTfPoints)}
                    className="w-20 p-1.5 bg-white border border-emerald-100 rounded-xl text-center font-bold text-sm outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="text-right font-black text-slate-900">{(Number(tfCount) * Number(tfPoints)).toFixed(2)}</div>
              </div>

              {/* SA Row */}
              <div className="grid grid-cols-4 gap-2 items-center p-1.5 hover:bg-slate-50 rounded-xl transition-colors">
                <div className="text-sm font-bold">Phần III: SA</div>
                <div className="flex justify-center">
                  <input 
                    type="number" 
                    value={saCount} 
                    onChange={(e) => handleNumericInput(e.target.value, setSaCount)}
                    className="w-16 p-1.5 bg-white border border-emerald-100 rounded-xl text-center font-bold text-sm outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex justify-center">
                  <input 
                    type="number" 
                    value={saPoints} 
                    onChange={(e) => handleNumericInput(e.target.value, setSaPoints)}
                    className="w-20 p-1.5 bg-white border border-emerald-100 rounded-xl text-center font-bold text-sm outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="text-right font-black text-slate-900">{(Number(saCount) * Number(saPoints)).toFixed(2)}</div>
              </div>

              {/* Essay Section */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-bold">Phần IV: TL</div>
                  <button 
                    onClick={addEssay}
                    className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 hover:bg-emerald-700 transition-all"
                  >
                    <Plus className="w-3 h-3" /> THÊM CÂU TL
                  </button>
                  <div className="text-right font-black text-slate-900">{essays.reduce((sum, e) => sum + Number(e.points), 0).toFixed(2)}</div>
                </div>

                <div className="space-y-1.5">
                  {essays.map((essay) => (
                    <div key={essay.id} className="flex items-center justify-between bg-slate-50/50 p-1.5 rounded-xl border border-emerald-50">
                      <div className="text-xs font-medium text-slate-600">{essay.name}</div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400">ĐIỂM:</span>
                          <input 
                            type="number" 
                            value={essay.points} 
                            onChange={(e) => updateEssayPoints(essay.id, e.target.value)}
                            className="w-12 p-1 bg-white border border-emerald-100 rounded-lg text-center font-bold text-xs outline-none focus:border-emerald-500"
                          />
                        </div>
                        <button 
                          onClick={() => removeEssay(essay.id)}
                          className="text-rose-500 hover:text-rose-600 p-1"
                        >
                          <Plus className="w-4 h-4 rotate-45" />
                        </button>
                        <div className="w-10 text-right font-bold text-slate-900 text-sm">{Number(essay.points).toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-[2rem] flex gap-6 mt-4 items-center">
                <div className="bg-emerald-100 p-3 rounded-xl h-fit">
                  <Settings className="text-emerald-700 w-8 h-8" />
                </div>
                <p className="text-xl italic text-emerald-800 leading-relaxed">
                  Quy tắc của ứng dụng: Câu hỏi dạng Đúng/Sai (TF) và Trả lời ngắn (SA) được AI soạn thảo mặc định 4 ý thành phần (a, b, c, d). Điểm số mỗi câu sẽ được phân bổ đều cho từng ý trả lời đúng.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Card: Core Topics List (Matching Image) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card flex flex-col h-full"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <BookOpen className="text-emerald-800 w-6 h-6" />
                <h2 className="text-xl font-black tracking-tight text-emerald-900 uppercase">Nội dung cốt lõi</h2>
              </div>
              <button 
                onClick={() => updateSuggestedTopics(true)}
                disabled={loadingTopics}
                className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingTopics ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RotateCcw className="w-3.5 h-3.5" />
                )}
                Tải lại bằng AI
              </button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              {dataSource === 'library' && (
                <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold border border-blue-100">
                  <BookOpen className="w-3 h-3" /> Dữ liệu từ thư viện (Tốc độ cao)
                </div>
              )}
              {dataSource === 'ai' && (
                <div className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-[10px] font-bold border border-purple-100">
                  <Sparkles className="w-3 h-3" /> Dữ liệu từ AI thông minh
                </div>
              )}
            </div>

            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-2 mb-6 relative">
              {loadingTopics && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-20 flex items-center justify-center rounded-2xl">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                    <span className="text-xs font-bold text-emerald-800 animate-pulse">AI đang soạn thảo...</span>
                  </div>
                </div>
              )}
              {topics.map((topic, index) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={index} 
                  className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-emerald-200 transition-all group"
                >
                  <span className="text-sm font-bold text-slate-800 leading-tight">
                    <MathRenderer content={topic} />
                  </span>
                  <button 
                    onClick={() => removeTopic(index)}
                    className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-2 mb-8">
              <input 
                type="text" 
                placeholder="Thêm nội dung bài học mới..." 
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTopic()}
                className="flex-grow p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 transition-all"
              />
              <button 
                onClick={addTopic}
                className="bg-emerald-900 text-white p-3 rounded-xl hover:bg-emerald-950 transition-all shadow-lg"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-4 mt-auto">
              <button 
                onClick={() => setStep(1)}
                className="flex-1 bg-slate-50 text-slate-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 border border-slate-200 hover:bg-slate-100 transition-all"
              >
                <ArrowLeft className="w-5 h-5" /> Quay lại
              </button>
              <button 
                onClick={generateExam}
                disabled={Math.abs(totalPoints - 10) >= 0.01 || isGeneratingExam}
                className={`flex-[2] py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 ${
                  Math.abs(totalPoints - 10) < 0.01 
                    ? 'bg-emerald-900 text-white hover:bg-emerald-950 shadow-emerald-900/20 cursor-pointer' 
                    : 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-5 h-5" /> Kích hoạt soạn đề AI
              </button>
            </div>
          </motion.div>
        </div>
      ) : step === 3 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Exam Content */}
          <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden relative">
            <div className="p-8 md:p-12">
              {/* Exam Header (Paper Style) */}
              <div className="text-center mb-12 space-y-2">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-widest">{examData?.title}</h2>
                <div className="flex justify-center items-center gap-6 text-slate-500 font-bold uppercase text-xs tracking-widest">
                  <span>MÔN: {subject}</span>
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                  <span>LỚP: {grade}</span>
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                  <span>THỜI GIAN: {duration} PHÚT</span>
                </div>
                <div className="w-24 h-1 bg-emerald-600 mx-auto mt-6 rounded-full" />
              </div>

              {/* Questions List */}
              <div className="space-y-12">
                {(examData?.questions || []).map((q, idx) => {
                  const showHeader = idx === 0 || (examData?.questions || [])[idx - 1]?.type !== q.type;
                  const sectionStartIndex = (examData?.questions || []).findIndex(question => question.type === q.type);
                  const questionNumber = idx - sectionStartIndex + 1;
                  let headerText = "";
                  if (showHeader) {
                    switch (q.type) {
                      case 'MCQ': headerText = "PHẦN I. CÂU HỎI TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN"; break;
                      case 'TF': headerText = "PHẦN II. CÂU HỎI TRẮC NGHIỆM ĐÚNG SAI"; break;
                      case 'SA': headerText = "PHẦN III. CÂU HỎI TRẮC NGHIỆM TRẢ LỜI NGẮN"; break;
                      case 'TL': headerText = "PHẦN IV. CÂU HỎI TỰ LUẬN"; break;
                    }
                  }

                  return (
                    <Fragment key={idx}>
                      {showHeader && (
                        <div className="flex items-center gap-4 mb-8 mt-4">
                          <div className="w-1.5 h-8 bg-emerald-600 rounded-full" />
                          <h3 className="text-xl font-black text-emerald-900 uppercase tracking-tight">
                            {headerText}
                          </h3>
                        </div>
                      )}
                      <div className="relative group border border-emerald-500/30 rounded-[32px] p-6 mb-8 hover:shadow-xl hover:shadow-emerald-500/5 transition-all bg-white">
                        {/* Question Header */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-slate-900/20">
                              {questionNumber}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-slate-200">
                                {q.type}
                              </span>
                              <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-200">
                                {q.level}
                              </span>
                              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-100 italic">
                                NỘI DUNG: {q.topic}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => toggleLockQuestion(idx)}
                              className={`p-2.5 rounded-xl transition-all shadow-lg ${
                                q.isLocked
                                ? 'bg-amber-500 text-white shadow-amber-500/20'
                                : 'bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-700'
                              }`}
                              title={q.isLocked ? "Mở khóa vị trí câu hỏi" : "Khóa vị trí câu hỏi"}
                            >
                              <RotateCcw className={`w-4 h-4 transition-transform ${q.isLocked ? 'rotate-180' : ''}`} />
                            </button>
                            <button 
                              onClick={() => generateAIIllustration(idx)}
                              disabled={isGeneratingImage === idx}
                              className="flex items-center gap-2 px-4 py-2.5 bg-white text-emerald-600 rounded-xl border-2 border-emerald-500/30 font-black text-[10px] uppercase tracking-wider hover:bg-emerald-50 transition-all disabled:opacity-50"
                            >
                              {isGeneratingImage === idx ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Sparkles className="w-3.5 h-3.5" />
                              )}
                              MINH HỌA AI
                            </button>
                            {editingQuestionIndex === idx ? (
                              <button 
                                onClick={() => setEditingQuestionIndex(null)}
                                className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                                title="Lưu lại"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            ) : (
                              <button 
                                onClick={() => setEditingQuestionIndex(idx)}
                                className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all border border-slate-200"
                                title="Sửa câu hỏi"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            )}
                            <button 
                              onClick={() => deleteQuestion(idx)}
                              className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-all border border-rose-200"
                              title="Xóa câu hỏi"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-6">
                          {q.imageUrl && (
                            <div className="relative w-full max-w-2xl mx-auto aspect-square rounded-[32px] overflow-hidden border-4 border-emerald-100 shadow-2xl group/img">
                              <img 
                                src={q.imageUrl} 
                                alt="Minh họa AI" 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover/img:opacity-100 transition-all">
                                <button 
                                  onClick={() => generateAIIllustration(idx)}
                                  disabled={isGeneratingImage === idx}
                                  className="p-2 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-all disabled:opacity-50"
                                  title="Vẽ lại"
                                >
                                  {isGeneratingImage === idx ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <RotateCcw className="w-4 h-4" />
                                  )}
                                </button>
                                <button 
                                  onClick={() => updateQuestion(idx, { imageUrl: undefined })}
                                  className="p-2 bg-rose-600 text-white rounded-full shadow-lg hover:bg-rose-700 transition-all"
                                  title="Xóa ảnh"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}

                          {editingQuestionIndex === idx ? (
                            <div className="space-y-4 px-2">
                              <div>
                                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 block">Nội dung câu hỏi</label>
                                <textarea 
                                  value={q.content}
                                  onPaste={(e) => handlePaste(e, idx, 'content')}
                                  onChange={(e) => updateQuestion(idx, { content: e.target.value })}
                                  className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:border-emerald-500 focus:ring-0 transition-all min-h-[120px]"
                                  placeholder="Nhập nội dung câu hỏi hoặc dán ảnh (Ctrl+V) vào đây..."
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 block">Nội dung kiến thức</label>
                                <input 
                                  type="text"
                                  value={q.topic}
                                  onChange={(e) => updateQuestion(idx, { topic: e.target.value })}
                                  className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-emerald-700 focus:border-emerald-500 focus:ring-0 transition-all"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="text-base font-bold text-slate-800 leading-relaxed px-2">
                              <MathRenderer content={q.imageUrl ? q.content.replace(/\[HÌNH ẢNH\]/g, "").trim() : q.content} />
                            </div>
                          )}

                          {/* MCQ Options */}
                          {q.type === 'MCQ' && q.options && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {q.options.map((opt, oIdx) => (
                                <div 
                                  key={oIdx} 
                                  className={`p-2.5 rounded-2xl border-2 transition-all flex items-center justify-between group/opt ${
                                    opt.isCorrect 
                                    ? 'bg-emerald-50/50 border-emerald-500/50 text-emerald-900' 
                                    : 'bg-white border-slate-100 text-slate-700 hover:border-slate-200 shadow-sm'
                                  }`}
                                >
                                  <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                                      opt.isCorrect 
                                      ? 'bg-emerald-600 text-white' 
                                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                                    }`}>
                                      {String.fromCharCode(65 + oIdx)}
                                    </div>
                                    {editingQuestionIndex === idx ? (
                                      <div className="flex-grow space-y-2">
                                        <input 
                                          type="text"
                                          value={opt.text}
                                          onPaste={(e) => handlePaste(e, idx, 'option', oIdx)}
                                          onChange={(e) => {
                                            const newOptions = [...(q.options || [])];
                                            newOptions[oIdx] = { ...opt, text: e.target.value };
                                            updateQuestion(idx, { options: newOptions });
                                          }}
                                          className="w-full p-2 bg-transparent border-b-2 border-emerald-200 focus:border-emerald-500 focus:ring-0 font-bold text-sm outline-none"
                                          placeholder="Nội dung phương án hoặc dán ảnh..."
                                        />
                                        {opt.imageUrl && (
                                          <div className="relative w-32 aspect-square rounded-lg overflow-hidden border border-emerald-200">
                                            <img src={opt.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                            <button 
                                              onClick={() => {
                                                const newOptions = [...(q.options || [])];
                                                newOptions[oIdx] = { ...opt, imageUrl: undefined };
                                                updateQuestion(idx, { options: newOptions });
                                              }}
                                              className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full"
                                            >
                                              <X className="w-3 h-3" />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                    <div className="font-bold text-sm space-y-2">
                                        <MathRenderer content={opt.text} />
                                        {opt.imageUrl && (
                                          <div className="w-32 aspect-square rounded-lg overflow-hidden border border-emerald-200">
                                            <img src={opt.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {opt.isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                                    <button 
                                      onClick={() => toggleLockOption(idx, oIdx)}
                                      className={`p-2 rounded-lg transition-all shadow-lg ${
                                        opt.isLocked
                                        ? 'bg-amber-500 text-white shadow-amber-500/10'
                                        : 'bg-emerald-600 text-white shadow-emerald-600/10 hover:bg-emerald-700'
                                      }`}
                                      title={opt.isLocked ? "Mở khóa đáp án này" : "Khóa đáp án này"}
                                    >
                                      <RotateCcw className={`w-3.5 h-3.5 transition-transform ${opt.isLocked ? 'rotate-180' : ''}`} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* True/False Options */}
                          {q.type === 'TF' && q.tfSubQuestions && (
                            <div className="space-y-2">
                              {q.tfSubQuestions.map((sub, sIdx) => (
                                <div key={sIdx} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all">
                                  <div className="flex items-center gap-4">
                                    <span className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-slate-200 text-slate-600 rounded-lg font-black text-sm">
                                      {String.fromCharCode(97 + sIdx)}
                                    </span>
                                    {editingQuestionIndex === idx ? (
                                      <div className="flex-grow space-y-2">
                                        <input 
                                          type="text"
                                          value={sub.text}
                                          onPaste={(e) => handlePaste(e, idx, 'tf', sIdx)}
                                          onChange={(e) => {
                                            const newSub = [...(q.tfSubQuestions || [])];
                                            newSub[sIdx] = { ...sub, text: e.target.value };
                                            updateQuestion(idx, { tfSubQuestions: newSub });
                                          }}
                                          className="w-full p-1 bg-transparent border-b border-slate-300 focus:border-emerald-500 focus:ring-0 font-bold text-slate-700 outline-none text-sm"
                                          placeholder="Nội dung ý hoặc dán ảnh..."
                                        />
                                        {sub.imageUrl && (
                                          <div className="relative w-24 aspect-square rounded-lg overflow-hidden border border-slate-200">
                                            <img src={sub.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                            <button 
                                              onClick={() => {
                                                const newSub = [...(q.tfSubQuestions || [])];
                                                newSub[sIdx] = { ...sub, imageUrl: undefined };
                                                updateQuestion(idx, { tfSubQuestions: newSub });
                                              }}
                                              className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full"
                                            >
                                              <X className="w-3 h-3" />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="font-bold text-slate-700 space-y-2 text-sm">
                                        <MathRenderer content={sub.text} />
                                        {sub.imageUrl && (
                                          <div className="w-24 aspect-square rounded-lg overflow-hidden border border-slate-200">
                                            <img src={sub.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => toggleLockOption(idx, sIdx)}
                                      className={`p-2 rounded-lg transition-all shadow-lg ${
                                        sub.isLocked
                                        ? 'bg-amber-500 text-white shadow-amber-500/10'
                                        : 'bg-emerald-600 text-white shadow-emerald-600/10 hover:bg-emerald-700'
                                      }`}
                                      title={sub.isLocked ? "Mở khóa ý này" : "Khóa ý này"}
                                    >
                                      <RotateCcw className={`w-3.5 h-3.5 transition-transform ${sub.isLocked ? 'rotate-180' : ''}`} />
                                    </button>
                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm ${
                                      sub.isCorrect 
                                      ? 'bg-emerald-600 text-white' 
                                      : 'bg-rose-600 text-white'
                                    }`}>
                                      {sub.isCorrect ? 'Đúng' : 'Sai'}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Short Answer Options */}
                          {q.type === 'SA' && q.saSubQuestions && (
                            <div className="space-y-2">
                              {q.saSubQuestions.map((sub, sIdx) => (
                                <div key={sIdx} className="p-3 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col gap-2 hover:border-slate-200 transition-all">
                                  <div className="flex items-center gap-4">
                                    <span className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-slate-200 text-slate-600 rounded-lg font-black text-sm">
                                      {String.fromCharCode(97 + sIdx)}
                                    </span>
                                    {editingQuestionIndex === idx ? (
                                      <div className="flex-grow space-y-2">
                                        <input 
                                          type="text"
                                          value={sub.text}
                                          onPaste={(e) => handlePaste(e, idx, 'sa', sIdx)}
                                          onChange={(e) => {
                                            const newSub = [...(q.saSubQuestions || [])];
                                            newSub[sIdx] = { ...sub, text: e.target.value };
                                            updateQuestion(idx, { saSubQuestions: newSub });
                                          }}
                                          className="w-full p-1 bg-transparent border-b border-slate-300 focus:border-emerald-500 focus:ring-0 font-bold text-slate-700 outline-none text-sm"
                                          placeholder="Nội dung ý hoặc dán ảnh..."
                                        />
                                        {sub.imageUrl && (
                                          <div className="relative w-24 aspect-square rounded-lg overflow-hidden border border-slate-200">
                                            <img src={sub.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                            <button 
                                              onClick={() => {
                                                const newSub = [...(q.saSubQuestions || [])];
                                                newSub[sIdx] = { ...sub, imageUrl: undefined };
                                                updateQuestion(idx, { saSubQuestions: newSub });
                                              }}
                                              className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full"
                                            >
                                              <X className="w-3 h-3" />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="font-bold text-slate-700 space-y-2 text-sm">
                                        <MathRenderer content={sub.text} />
                                        {sub.imageUrl && (
                                          <div className="w-24 aspect-square rounded-lg overflow-hidden border border-slate-200">
                                            <img src={sub.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button 
                                      onClick={() => toggleLockOption(idx, sIdx)}
                                      className={`p-2 rounded-lg transition-all shadow-lg ${
                                        sub.isLocked
                                        ? 'bg-amber-500 text-white shadow-amber-500/10'
                                        : 'bg-emerald-600 text-white shadow-emerald-600/10 hover:bg-emerald-700'
                                      }`}
                                      title={sub.isLocked ? "Mở khóa ý này" : "Khóa ý này"}
                                    >
                                      <RotateCcw className={`w-3.5 h-3.5 transition-transform ${sub.isLocked ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div className="flex items-center gap-2 text-emerald-700 text-xs font-black bg-emerald-100/50 w-fit px-3 py-1.5 rounded-xl border border-emerald-200/50">
                                      <Sparkles className="w-3.5 h-3.5" /> ĐÁP ÁN: 
                                    {editingQuestionIndex === idx ? (
                                      <input 
                                        type="text"
                                        value={sub.answer}
                                        onChange={(e) => {
                                          const newSub = [...(q.saSubQuestions || [])];
                                          newSub[sIdx] = { ...sub, answer: e.target.value };
                                          updateQuestion(idx, { saSubQuestions: newSub });
                                        }}
                                        className="bg-transparent border-b border-emerald-400 focus:border-emerald-600 outline-none w-24"
                                      />
                                    ) : (
                                      <MathRenderer content={sub.answer} />
                                    )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Essay Solution */}
                          {q.type === 'TL' && q.solution && (
                            <div className="p-8 bg-amber-50/50 rounded-[32px] border border-amber-200/50 space-y-4">
                              <div className="flex items-center gap-3 text-amber-800 font-black text-xs uppercase tracking-[0.2em]">
                                <div className="p-2 bg-amber-100 rounded-lg">
                                  <FileText className="w-4 h-4" />
                                </div>
                                Hướng dẫn chấm & Đáp án
                              </div>
                              {editingQuestionIndex === idx ? (
                                <textarea 
                                  value={q.solution}
                                  onChange={(e) => updateQuestion(idx, { solution: e.target.value })}
                                  className="w-full p-4 bg-white border-2 border-amber-200 rounded-2xl text-sm text-amber-900 focus:border-amber-500 focus:ring-0 transition-all min-h-[100px] font-medium"
                                />
                              ) : (
                                <div className="text-sm text-amber-900/80 leading-relaxed whitespace-pre-wrap font-medium italic pl-2 border-l-4 border-amber-200">
                                  <MathRenderer content={q.solution} />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Fragment>
                  );
                })}
              </div>

              {/* Step 3 Action Buttons */}
              <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs italic flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <span>Mẹo: Đối với các môn Toán/Lý/Hóa, bạn có thể dùng tổ hợp phím <b>Alt + \</b> trong Word (nếu cài MathType) để chuyển đổi các công thức LaTeX sang dạng Equation/MathType chuẩn sách giáo khoa.</span>
              </div>
              <div className="mt-6 flex flex-wrap gap-4 justify-center">
                <button 
                  onClick={() => setStep(2)}
                  className="px-8 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold flex items-center gap-3 hover:bg-slate-200 transition-all border border-slate-200"
                >
                  <ArrowLeft className="w-5 h-5" /> Quay lại Bước 2
                </button>
                <button 
                  onClick={() => examData && exportToWord(examData)}
                  disabled={isExporting}
                  className="px-8 py-4 bg-white text-emerald-700 rounded-2xl font-bold flex items-center gap-3 border-2 border-emerald-500/30 hover:bg-emerald-50 transition-all disabled:opacity-50"
                >
                  {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                  {examData?.title?.toLowerCase().includes("thường xuyên") ? "Xuất đề & đáp án (Word)" : "Xuất hồ sơ đề (Word)"}
                </button>
                <button 
                  onClick={handleShuffleNow}
                  disabled={isShuffling}
                  className="px-10 py-4 bg-emerald-900 text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-emerald-950 transition-all shadow-xl shadow-emerald-900/20"
                >
                  {isShuffling ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shuffle className="w-5 h-5" />}
                  Trộn đề ngay
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : step === 4 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Step 4 Header */}
          <div className="card text-center py-12">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-emerald-50">
              <Shuffle className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">Trộn đề & Xuất bản</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
              Hệ thống đã trộn ngẫu nhiên các câu hỏi và phương án dựa trên đề gốc. 
              Thầy cô có thể tùy chỉnh số lượng mã đề và tải xuống từng mã hoặc toàn bộ hồ sơ.
            </p>
          </div>

          {/* Controls */}
          <div className="card w-full mb-8">
            <h3 className="text-lg font-black text-slate-900 uppercase mb-8 flex items-center justify-center gap-3">
              <Settings className="w-5 h-5 text-emerald-600" /> Cấu hình mã đề
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 w-full md:w-auto">
                <label className="block text-xs font-black text-emerald-600 uppercase tracking-widest mb-4 text-center">Số lượng mã đề cần trộn</label>
                <div className="flex items-center justify-center gap-4">
                  <button 
                    onClick={() => setNumCodes(Math.max(1, numCodes - 1))}
                    className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center hover:bg-slate-200 transition-all font-black text-2xl text-slate-600"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    min="1" max="24" 
                    value={numCodes} 
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val)) setNumCodes(Math.min(24, Math.max(1, val)));
                    }}
                    className="w-24 h-14 bg-slate-900 text-white rounded-2xl text-center font-black text-2xl focus:ring-2 focus:ring-emerald-500 border-none"
                  />
                  <button 
                    onClick={() => setNumCodes(Math.min(24, numCodes + 1))}
                    className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center hover:bg-slate-200 transition-all font-black text-2xl text-slate-600"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="w-full md:w-auto">
                <button 
                  onClick={handleShuffleNow}
                  disabled={isShuffling}
                  className="w-full md:w-auto px-12 py-5 bg-emerald-600 text-white rounded-2xl font-black flex items-center justify-center gap-4 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 text-lg"
                >
                  {isShuffling ? <Loader2 className="w-6 h-6 animate-spin" /> : <RotateCcw className="w-6 h-6" />}
                  CẬP NHẬT DANH SÁCH MÃ ĐỀ
                </button>
              </div>
            </div>
          </div>

          {/* Shuffled List */}
          <div className="card">
            <h3 className="text-lg font-black text-slate-900 uppercase mb-8 flex items-center gap-3">
              <LayoutGrid className="w-5 h-5 text-emerald-600" /> Danh sách mã đề đã xuất
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {shuffledExams.map((exam, idx) => (
                <motion.div 
                  key={exam.code}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-6 bg-slate-50 border border-slate-200 rounded-[32px] flex flex-col items-center text-center hover:border-emerald-500/50 transition-all group"
                >
                  <div className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-2">Mã đề thi</div>
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center font-black text-2xl text-slate-900 shadow-sm mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    {exam.code}
                  </div>
                  <div className="flex gap-2 w-full">
                    <button 
                      onClick={() => {
                        setExamData(exam);
                        setStep(5);
                      }}
                      className="flex-1 p-3 bg-white text-slate-700 rounded-xl border border-slate-200 hover:bg-slate-100 transition-all flex items-center justify-center"
                      title="Xem trước"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => exportToWord(exam)}
                      disabled={isExporting}
                      className="flex-1 p-3 bg-emerald-600 text-white rounded-xl border border-emerald-600 hover:bg-emerald-700 transition-all flex items-center justify-center"
                      title="Tải Word"
                    >
                      {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6 pt-12">
            <div className="card flex-1 max-w-3xl flex flex-col md:flex-row items-center justify-between gap-8 bg-emerald-50/50 border-emerald-100 shadow-sm">
              <div className="text-center md:text-left">
                <h3 className="text-lg font-black text-slate-900 uppercase mb-2 flex items-center gap-3 justify-center md:justify-start">
                  <FileArchive className="w-6 h-6 text-emerald-600" /> Đóng gói toàn bộ
                </h3>
                <p className="text-base text-slate-600 font-medium">Tải xuống file ZIP chứa tất cả các mã đề đã trộn kèm theo hồ sơ đề gốc.</p>
              </div>
              <button 
                onClick={exportAllToZip}
                disabled={isExporting}
                className="w-full md:w-auto px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black flex items-center justify-center gap-4 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 whitespace-nowrap text-lg group"
              >
                {isExporting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6 group-hover:translate-y-0.5 transition-transform" />}
                TẢI FILE ZIP (FULL)
              </button>
            </div>
            
            <div className="flex items-center">
              <button 
                onClick={() => {
                  if (masterExamData) setExamData(masterExamData);
                  setStep(3);
                }}
                className="w-full lg:w-auto px-10 py-6 bg-white text-slate-600 rounded-2xl font-black flex items-center justify-center gap-4 border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm text-lg"
              >
                <ArrowLeft className="w-6 h-6" /> QUAY LẠI ĐỀ GỐC
              </button>
            </div>
          </div>
        </motion.div>
      ) : step === 5 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Exam Content (Read-only) */}
          <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden relative">
            <div className="p-8 md:p-12">
              {/* Exam Header */}
              <div className="text-center mb-12 space-y-2">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-widest">
                  {examData?.title}
                  {examData?.code && ` - MÃ ĐỀ: ${examData.code}`}
                </h2>
                <div className="flex justify-center items-center gap-6 text-slate-500 font-bold uppercase text-xs tracking-widest">
                  <span>MÔN: {subject}</span>
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                  <span>LỚP: {grade}</span>
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                  <span>THỜI GIAN: {duration} PHÚT</span>
                </div>
                <div className="w-24 h-1 bg-emerald-600 mx-auto mt-6 rounded-full" />
              </div>

              {/* Questions List */}
              <div className="space-y-12">
                {(examData?.questions || []).map((q, idx) => {
                  const showHeader = idx === 0 || (examData?.questions || [])[idx - 1]?.type !== q.type;
                  const sectionStartIndex = (examData?.questions || []).findIndex(question => question.type === q.type);
                  const questionNumber = idx - sectionStartIndex + 1;
                  let headerText = "";
                  if (showHeader) {
                    switch (q.type) {
                      case 'MCQ': headerText = "PHẦN I. CÂU HỎI TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN"; break;
                      case 'TF': headerText = "PHẦN II. CÂU HỎI TRẮC NGHIỆM ĐÚNG SAI"; break;
                      case 'SA': headerText = "PHẦN III. CÂU HỎI TRẮC NGHIỆM TRẢ LỜI NGẮN"; break;
                      case 'TL': headerText = "PHẦN IV. CÂU HỎI TỰ LUẬN"; break;
                    }
                  }

                  return (
                    <Fragment key={idx}>
                      {showHeader && (
                        <div className="flex items-center gap-4 mb-8 mt-4">
                          <div className="w-1.5 h-8 bg-emerald-600 rounded-full" />
                          <h3 className="text-xl font-black text-emerald-900 uppercase tracking-tight">
                            {headerText}
                          </h3>
                        </div>
                      )}
                      <div className="relative group border border-emerald-500/30 rounded-[32px] p-6 mb-8 bg-white">
                        {/* Question Header */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-slate-900/20">
                              {questionNumber}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-slate-200">
                                {q.type}
                              </span>
                              <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-200">
                                {q.level}
                              </span>
                              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-100 italic">
                                NỘI DUNG: {q.topic}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          {q.imageUrl && (
                            <div className="relative w-full max-w-2xl mx-auto aspect-square rounded-[32px] overflow-hidden border-4 border-emerald-100 shadow-2xl">
                              <img 
                                src={q.imageUrl} 
                                alt="Minh họa AI" 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}
                          <div className="text-base font-bold text-slate-800 leading-relaxed">
                            <MathRenderer content={q.content} />
                          </div>

                          {/* MCQ Options */}
                          {q.type === 'MCQ' && q.options && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {q.options.map((opt, oIdx) => (
                                <div 
                                  key={oIdx}
                                  className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                                    opt.isCorrect 
                                    ? 'bg-emerald-50 border-emerald-200' 
                                    : 'bg-slate-50 border-slate-100'
                                  }`}
                                >
                                  <span className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg font-black text-sm ${
                                    opt.isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                                  }`}>
                                    {opt.id}
                                  </span>
                                  <div className="font-bold text-slate-700 text-sm">
                                    <MathRenderer content={opt.text} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* True/False Options */}
                          {q.type === 'TF' && q.tfSubQuestions && (
                            <div className="space-y-2">
                              {q.tfSubQuestions.map((sub, sIdx) => (
                                <div key={sIdx} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                                  <div className="flex items-center gap-4">
                                    <span className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-slate-200 text-slate-600 rounded-lg font-black text-sm">
                                      {String.fromCharCode(97 + sIdx)}
                                    </span>
                                    <div className="font-bold text-slate-700 text-sm">
                                      <MathRenderer content={sub.text} />
                                    </div>
                                  </div>
                                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm ${
                                    sub.isCorrect 
                                    ? 'bg-emerald-600 text-white' 
                                    : 'bg-rose-600 text-white'
                                  }`}>
                                    {sub.isCorrect ? 'Đúng' : 'Sai'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Short Answer Options */}
                          {q.type === 'SA' && q.saSubQuestions && (
                            <div className="space-y-2">
                              {q.saSubQuestions.map((sub, sIdx) => (
                                <div key={sIdx} className="p-3 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col gap-2">
                                  <div className="flex items-center gap-4">
                                    <span className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-slate-200 text-slate-600 rounded-lg font-black text-sm">
                                      {String.fromCharCode(97 + sIdx)}
                                    </span>
                                    <div className="font-bold text-slate-700 text-sm">
                                      <MathRenderer content={sub.text} />
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm">
                                      ĐÁP ÁN: {sub.answer}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Essay Answer */}
                          {q.type === 'TL' && q.solution && (
                            <div className="p-6 bg-emerald-50/50 rounded-[32px] border border-emerald-100">
                              <div className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-4">Gợi ý đáp án</div>
                              <div className="text-slate-700 leading-relaxed font-medium text-sm">
                                <MathRenderer content={q.solution} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Fragment>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button 
              onClick={() => setStep(4)}
              className="px-8 py-4 bg-white text-slate-600 rounded-2xl font-bold flex items-center gap-3 border border-slate-200 hover:bg-slate-50 transition-all"
            >
              <ArrowLeft className="w-5 h-5" /> Quay lại danh sách mã đề
            </button>
            <button 
              onClick={() => examData && exportToWord(examData)}
              disabled={isExporting}
              className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 disabled:opacity-50"
            >
              {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              Xuất file word mã đề này
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 card">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <FileText className="w-10 h-10 text-slate-300" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase mb-2">Chưa có dữ liệu đề thi</h2>
          <p className="text-slate-500 mb-8">Vui lòng quay lại Bước 1 để bắt đầu soạn đề mới.</p>
          <button 
            onClick={() => setStep(1)}
            className="px-8 py-4 bg-emerald-900 text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-emerald-950 transition-all"
          >
            <ArrowLeft className="w-5 h-5" /> Quay lại Bước 1
          </button>
        </div>
      )}
      
      {/* Footer Info */}
      <footer className="mt-4 flex justify-center">
        <div className="bg-emerald-600 text-white px-8 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-emerald-600/20">
          ỨNG DỤNG SOẠN ĐỀ THÔNG MINH AI - BY GEMINI & NGUYỄN TRẦM KHA - 0917.548.463
        </div>
      </footer>

      {/* New and Close Confirmation Dialog */}
      {showNewConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100"
          >
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <HelpCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
                Xác nhận đóng công việc
              </h3>
              <p className="text-slate-600 font-medium leading-relaxed mb-8">
                Thầy cô có muốn <span className="text-brand-primary font-bold">Lưu lại</span> công việc hiện tại trước khi bắt đầu một đề thi mới không?
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => confirmNewAndClose(true)}
                  className="flex flex-col items-center justify-center gap-3 p-6 bg-brand-primary text-white rounded-[32px] hover:bg-brand-primary/90 transition-all group shadow-lg shadow-brand-primary/20"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Save className="w-6 h-6" />
                  </div>
                  <span className="font-black uppercase text-xs tracking-widest">Có, Lưu lại</span>
                </button>
                
                <button 
                  onClick={() => confirmNewAndClose(false)}
                  className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-100 text-slate-600 rounded-[32px] hover:bg-slate-200 transition-all group"
                >
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <X className="w-6 h-6" />
                  </div>
                  <span className="font-black uppercase text-xs tracking-widest text-slate-500">Không lưu</span>
                </button>
              </div>
              
              <button 
                onClick={() => setShowNewConfirm(false)}
                className="mt-6 text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors"
              >
                Hủy bỏ và quay lại
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {/* Error Modal */}
      {errorModal.show && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden border border-red-100"
          >
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <X className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase">
                {errorModal.title || "Cảnh báo lỗi"}
              </h3>
              <div className="bg-red-50/50 rounded-2xl p-4 mb-8">
                <p className="text-red-800 font-medium leading-relaxed">
                  {errorModal.message}
                </p>
              </div>
              
              <button 
                onClick={() => setErrorModal({ ...errorModal, show: false })}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95"
              >
                Đã hiểu
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
