export interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
  isLocked?: boolean;
  imageUrl?: string;
}

export interface TFSubQuestion {
  id: string;
  text: string;
  isCorrect: boolean;
  isLocked?: boolean;
  imageUrl?: string;
}

export interface SASubQuestion {
  id: string;
  text: string;
  answer: string;
  isLocked?: boolean;
  imageUrl?: string;
}

export interface Question {
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

export interface Specification {
  topic: string;
  level: 'NHẬN BIẾT' | 'THÔNG HIỂU' | 'VẬN DỤNG';
  criteria: string;
}

export interface ExamData {
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
  contexts?: { topic: string; content: string }[];
}
