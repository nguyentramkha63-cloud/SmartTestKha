import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Play, 
  Award, 
  Printer, 
  X, 
  Users, 
  QrCode, 
  Download, 
  ShieldAlert, 
  ShieldCheck, 
  Radio, 
  ExternalLink, 
  Pause, 
  Search, 
  GraduationCap,
  Copy,
  Check,
  Loader2,
  Maximize2,
  HelpCircle,
  RotateCcw,
  BookOpen,
  Eye,
  Settings,
  Trash2,
  Sliders,
  Lock,
  Layers,
  Sparkles,
  FileCheck,
  ChevronDown,
  ChevronUp,
  ListOrdered,
  PlusCircle,
  TrendingUp,
  BarChart3,
  FileSpreadsheet,
  RotateCw,
  Calendar,
  Share2,
  Globe,
  Edit3,
  Info,
  Upload,
  UserCheck,
  UserPlus
} from 'lucide-react';
import QRCode from 'qrcode';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import type { Question, ExamData } from '../types';

export interface TeacherAccount {
  id: string; // e.g. 'nguyentramkha63@gmail.com'
  name: string; // e.g. 'Thầy Nguyễn Trầm Kha'
  email: string;
  avatarColor?: string;
}

export const DEFAULT_TEACHER_ACCOUNT: TeacherAccount = {
  id: 'nguyentramkha63@gmail.com',
  name: 'Thầy Nguyễn Trầm Kha',
  email: 'nguyentramkha63@gmail.com',
  avatarColor: 'from-emerald-600 to-teal-700'
};

export interface ExamConfig {
  allowShuffleCodes: boolean;
  requireFullscreen: boolean;
  detectTabSwitch: boolean;
  maxViolations: number;
  preventCopyInspect: boolean;
  showSolutionsAfterSubmit: boolean;
  minSubmitMinutes: number;
  maxAttempts: number;
}

export interface ExamSession {
  id: string;
  className: string;
  roomCode: string;
  createdAt: number;
  status: 'lobby' | 'started' | 'ended';
  students: StudentRecord[];
  notes?: string;
}

export interface LibraryExamItem {
  id: string;
  title: string;
  subject: string;
  grade: string;
  duration: number;
  questionsCount: number;
  examData: ExamData & { code?: string };
  allShuffledExams?: (ExamData & { code?: string })[];
  createdAt: number;
  config: ExamConfig;
  sessions?: ExamSession[];
  visibility?: 'private' | 'public'; // 'private': Chỉ mình tôi (bảo mật), 'public': Chia sẻ cộng đồng
  author?: string; // Tên tác giả/giáo viên
  ownerId?: string; // ID tài khoản sở hữu đề (chỉ tài khoản này thấy trong kho riêng tư và có quyền xóa)
  ownerEmail?: string;
  sharedAt?: number;
  isExternalUpload?: boolean;
  source?: string;
}

const defaultExamConfig: ExamConfig = {
  allowShuffleCodes: true,
  requireFullscreen: true,
  detectTabSwitch: true,
  maxViolations: 3,
  preventCopyInspect: true,
  showSolutionsAfterSubmit: true,
  minSubmitMinutes: 15,
  maxAttempts: 1
};

export const generateSampleStudents = (className: string, totalQuestions = 20): StudentRecord[] => {
  const sampleData = [
    { name: 'Nguyễn Văn An', score: 9.5, rating: 'Xuất sắc 🏆', violations: 0, answered: totalQuestions },
    { name: 'Trần Thị Bích Ngọc', score: 8.75, rating: 'Giỏi 🥇', violations: 0, answered: totalQuestions },
    { name: 'Lê Hoàng Nam', score: 7.5, rating: 'Khá 🥈', violations: 1, answered: totalQuestions - 1 },
    { name: 'Phạm Minh Thư', score: 8.25, rating: 'Giỏi 🥇', violations: 0, answered: totalQuestions },
    { name: 'Đặng Quốc Bảo', score: 6.75, rating: 'Khá 🥈', violations: 0, answered: totalQuestions },
    { name: 'Hoàng Mai Anh', score: 9.0, rating: 'Xuất sắc 🏆', violations: 0, answered: totalQuestions },
    { name: 'Vũ Đức Thịnh', score: 5.5, rating: 'Trung bình 🥉', violations: 0, answered: totalQuestions - 3 },
    { name: 'Ngô Phương Thảo', score: 8.0, rating: 'Giỏi 🥇', violations: 0, answered: totalQuestions }
  ];
  return sampleData.map((s, idx) => ({
    id: `stu_sample_${className}_${idx + 1}_${Date.now()}`,
    name: s.name,
    className,
    studentId: `SBD-${idx + 1 < 10 ? '0' : ''}${idx + 1}`,
    code: '101',
    joinedAt: Date.now() - 7200000 + idx * 60000,
    status: 'submitted',
    answeredCount: s.answered,
    totalQuestions,
    violations: s.violations,
    score: s.score,
    rating: s.rating,
    submittedAt: Date.now() - 3600000 + idx * 120000
  }));
};

export const defaultDemoExamData: ExamData = {
  title: 'Kiểm tra cuối học kì 1, môn: Toán',
  subject: 'Toán học',
  grade: 'Khối 12',
  duration: 45,
  bookSeries: 'Kết nối tri thức với cuộc sống',
  topics: ['Ứng dụng đạo hàm khảo sát hàm số', 'Phương pháp toạ độ trong không gian'],
  questions: [
    {
      id: 'demo_q1',
      type: 'MCQ',
      content: 'Cho hàm số $y = f(x)$ có bảng biến thiên trên đoạn $[-2; 2]$. Điểm cực đại của đồ thị hàm số là:',
      options: [
        { id: 'A', text: '$x = 1$', isCorrect: true },
        { id: 'B', text: '$x = -1$', isCorrect: false },
        { id: 'C', text: '$y = 2$', isCorrect: false },
        { id: 'D', text: '$y = -2$', isCorrect: false }
      ]
    },
    {
      id: 'demo_q2',
      type: 'MCQ',
      content: 'Trong không gian $Oxyz$, cho mặt cầu $(S): (x-1)^2 + (y+2)^2 + (z-3)^2 = 16$. Tọa độ tâm $I$ và bán kính $R$ của mặt cầu là:',
      options: [
        { id: 'A', text: '$I(1; -2; 3), R = 4$', isCorrect: true },
        { id: 'B', text: '$I(-1; 2; -3), R = 4$', isCorrect: false },
        { id: 'C', text: '$I(1; -2; 3), R = 16$', isCorrect: false },
        { id: 'D', text: '$I(-1; 2; -3), R = 16$', isCorrect: false }
      ]
    },
    {
      id: 'demo_q3',
      type: 'TF',
      content: 'Cho hình chóp $S.ABC$ có đáy $ABC$ là tam giác vuông tại $B$, $SA \\perp (ABC)$. Xét tính đúng/sai của các mệnh đề sau:',
      tfSubQuestions: [
        { id: 'a', text: '$BC \\perp (SAB)$', isCorrect: true },
        { id: 'b', text: '$AC \\perp (SBC)$', isCorrect: false },
        { id: 'c', text: '$SA$ là khoảng cách từ $S$ đến mặt phẳng $(ABC)$', isCorrect: true },
        { id: 'd', text: 'Góc giữa $SC$ và $(ABC)$ là góc $\\widehat{SCA}$', isCorrect: true }
      ]
    },
    {
      id: 'demo_q4',
      type: 'SA',
      content: 'Tìm giá trị lớn nhất của hàm số $f(x) = -x^2 + 4x + 5$ trên đoạn $[0; 3]$.',
      saSubQuestions: [
        { id: '1', text: 'Giá trị lớn nhất của hàm số', answer: '9' }
      ]
    }
  ]
};

const MathRenderer = ({ content }: { content: string }) => {
  return (
    <div className="markdown-body">
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export interface StudentRecord {
  id: string;
  name: string;
  className: string;
  studentId: string;
  code: string;
  joinedAt: number;
  status: 'waiting' | 'in_progress' | 'submitted' | 'suspended';
  answeredCount: number;
  totalQuestions: number;
  violations: number;
  score?: number;
  rating?: string;
  submittedAt?: number;
}

interface OnlineExamViewProps {
  exam?: ExamData & { code?: string };
  allShuffledExams?: (ExamData & { code: string })[];
  onBackToStep4?: () => void;
  onExitStudentMode?: () => void;
  mcqPoints?: number | string;
  tfPoints?: number | string;
  saPoints?: number | string;
  essays?: { id: number; name: string; points: number | string }[];
  isStudentOnly?: boolean;
  isStandaloneStudentPortal?: boolean;
  defaultRoomCode?: string;
  onSelectExamCode?: (chosenExam: ExamData & { code?: string }) => void;
  initialTab?: 'library' | 'room' | 'report' | 'settings';
  onOpenUploadModal?: () => void;
  activeTeacherAccount?: TeacherAccount;
  onOpenAccountModal?: () => void;
}

export default function OnlineExamView({
  exam: initialExam,
  allShuffledExams = [],
  onBackToStep4,
  onExitStudentMode,
  mcqPoints = 0.25,
  tfPoints = 1,
  saPoints = 1,
  essays = [],
  isStudentOnly = false,
  isStandaloneStudentPortal = false,
  defaultRoomCode = '',
  onSelectExamCode,
  initialTab = 'library',
  onOpenUploadModal,
  activeTeacherAccount: activeTeacherAccountProp,
  onOpenAccountModal
}: OnlineExamViewProps) {
  // Check URL params
  const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const isUrlStudent = isStudentOnly || urlParams.get('student') === 'true' || Boolean(urlParams.get('room'));
  const urlRoom = defaultRoomCode || urlParams.get('room') || '';

  // Role: Teacher (Quản lý phòng thi) or Student (Làm bài)
  const [role, setRole] = useState<'teacher' | 'student'>(isUrlStudent ? 'student' : 'teacher');

  // Distinguish real student accessing on student device vs teacher simulating student guidance
  const isRealStudentDevice = isStudentOnly || isStandaloneStudentPortal || isUrlStudent;
  const [isTeacherGuidanceMode, setIsTeacherGuidanceMode] = useState<boolean>(false);
  const showTeacherGuidanceReturn = !isRealStudentDevice && (role === 'student' || isTeacherGuidanceMode);

  const handleReturnToTeacher = () => {
    setRole('teacher');
    setIsTeacherGuidanceMode(false);
  };

  // Room PIN (Persistent or from URL)
  const [roomCode, setRoomCode] = useState<string>(() => {
    if (urlRoom) return urlRoom;
    if (isUrlStudent) return '';
    const existing = localStorage.getItem('smarttest_current_room');
    if (existing) return existing;
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem('smarttest_current_room', newCode);
    return newCode;
  });

  // Manual PIN input state (for students joining without a direct link)
  const [inputPin, setInputPin] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isVerifyingPin, setIsVerifyingPin] = useState<boolean>(false);

  // Effective Exam data (either passed from teacher or loaded from API/localStorage)
  const [activeExam, setActiveExam] = useState<(ExamData & { code?: string }) | null>(initialExam || defaultDemoExamData);
  const [isLoadingExam, setIsLoadingExam] = useState<boolean>(Boolean(roomCode && (!initialExam || isUrlStudent)));

  // Teacher Account State (Phân tách kho riêng tư bảo mật theo từng tài khoản giáo viên)
  const [teacherAccount, setTeacherAccount] = useState<TeacherAccount>(() => {
    try {
      const saved = localStorage.getItem('smarttest_active_teacher_account');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.id) return parsed;
      }
    } catch (_) {}
    return DEFAULT_TEACHER_ACCOUNT;
  });

  const [teacherAccountsList, setTeacherAccountsList] = useState<TeacherAccount[]>(() => {
    try {
      const saved = localStorage.getItem('smarttest_teacher_accounts_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return [
      DEFAULT_TEACHER_ACCOUNT,
      {
        id: 'giaovien2@school.edu.vn',
        name: 'Cô Trần Thị Lan',
        email: 'giaovien2@school.edu.vn',
        avatarColor: 'from-blue-600 to-indigo-700'
      }
    ];
  });

  const [showAccountModal, setShowAccountModal] = useState<boolean>(false);
  const [newAccountName, setNewAccountName] = useState<string>('');
  const [newAccountEmail, setNewAccountEmail] = useState<string>('');

  // Teacher State: Exam Library (được lưu trữ và phân vùng theo tài khoản)
  const [examLibrary, setExamLibrary] = useState<LibraryExamItem[]>(() => {
    try {
      const activeId = (() => {
        try {
          const acc = localStorage.getItem('smarttest_active_teacher_account');
          if (acc) return JSON.parse(acc)?.id || DEFAULT_TEACHER_ACCOUNT.id;
        } catch (_) {}
        return DEFAULT_TEACHER_ACCOUNT.id;
      })();

      const accountSaved = localStorage.getItem(`smarttest_exam_library_${activeId}`);
      const saved = accountSaved || localStorage.getItem('smarttest_exam_library');
      if (saved) {
        const parsed: LibraryExamItem[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const list = parsed.map((item, idx) => {
            const gradeClean = item.grade?.replace(/[^0-9]/g, '') || '12';
            const existingSessions = Array.isArray(item.sessions) ? item.sessions : [];
            const visibility: 'private' | 'public' = item.visibility || 'private';
            const author = item.author || DEFAULT_TEACHER_ACCOUNT.name;
            const ownerId = item.ownerId || activeId;
            // If item has no sessions, pre-seed a sample class so teacher immediately sees the feature in action
            if (existingSessions.length === 0 && idx === 0) {
              return {
                ...item,
                visibility,
                author,
                ownerId,
                sessions: [
                  {
                    id: `sess_${item.id}_sample`,
                    className: `${gradeClean}A1`,
                    roomCode: '682194',
                    createdAt: item.createdAt || (Date.now() - 3600000 * 3),
                    status: 'ended' as const,
                    students: generateSampleStudents(`${gradeClean}A1`, item.questionsCount || 20)
                  }
                ]
              };
            }
            return {
              ...item,
              visibility,
              author,
              ownerId,
              sessions: existingSessions
            };
          });
          list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          return list;
        }
      }
    } catch (e) {}
    if (initialExam) {
      const gradeClean = initialExam.grade?.replace(/[^0-9]/g, '') || '12';
      return [{
        id: 'lib_' + Date.now(),
        title: initialExam.title || 'Đề thi trực tuyến GDPT 2018',
        subject: initialExam.subject || 'Toán học',
        grade: initialExam.grade || '12',
        duration: Number(initialExam.duration) || 45,
        questionsCount: initialExam.questions?.length || 0,
        examData: initialExam,
        allShuffledExams: allShuffledExams.length > 0 ? allShuffledExams : [initialExam],
        createdAt: Date.now(),
        visibility: 'private', // Mặc định riêng tư bảo mật cho kỳ thi
        author: 'Tôi (Giáo viên)',
        config: defaultExamConfig,
        sessions: [
          {
            id: 'sess_init_sample',
            className: `${gradeClean}A1`,
            roomCode: '682194',
            createdAt: Date.now() - 3600000 * 2,
            status: 'ended' as const,
            students: generateSampleStudents(`${gradeClean}A1`, initialExam.questions?.length || 20)
          }
        ]
      }];
    }
    // Giáo viên mở trực tiếp Bước 5 mà chưa xuất đề từ Bước 4: Cung cấp sẵn đề mẫu để trải nghiệm đầy đủ tính năng
    return [{
      id: 'lib_sample_direct',
      title: defaultDemoExamData.title,
      subject: defaultDemoExamData.subject,
      grade: defaultDemoExamData.grade,
      duration: Number(defaultDemoExamData.duration) || 45,
      questionsCount: defaultDemoExamData.questions?.length || 4,
      examData: defaultDemoExamData,
      allShuffledExams: [],
      createdAt: Date.now() - 3600000 * 2,
      visibility: 'private',
      author: 'Tôi (Giáo viên)',
      config: defaultExamConfig,
      sessions: [
        {
          id: 'sess_sample_direct_12a1',
          className: '12A1',
          roomCode: '682194',
          createdAt: Date.now() - 3600000 * 3,
          status: 'ended' as const,
          students: generateSampleStudents('12A1', defaultDemoExamData.questions?.length || 4)
        }
      ]
    }];
  });

  // Library Scope: Kho riêng tư (private - Chỉ mình tôi) vs Kho cộng đồng (public - Chia sẻ giáo viên)
  const [libraryTabScope, setLibraryTabScope] = useState<'private' | 'public'>('private');
  const [communityExams, setCommunityExams] = useState<LibraryExamItem[]>([]);
  const [isLoadingCommunity, setIsLoadingCommunity] = useState<boolean>(false);
  const [examToToggleShare, setExamToToggleShare] = useState<LibraryExamItem | null>(null);
  const [shareToast, setShareToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const [previewingLibraryExam, setPreviewingLibraryExam] = useState<LibraryExamItem | null>(null);
  const [selectedPreviewCode, setSelectedPreviewCode] = useState<string>('goc');
  const [editingQuestionIdx, setEditingQuestionIdx] = useState<number | null>(null);
  const [editingQuestionDraft, setEditingQuestionDraft] = useState<Question | null>(null);
  const [configuringLibraryExam, setConfiguringLibraryExam] = useState<LibraryExamItem | null>(null);
  const [tempConfig, setTempConfig] = useState<ExamConfig>(defaultExamConfig);
  const [activeExamSource, setActiveExamSource] = useState<string>('library');

  // Active Class Session tracking
  const [activeExamLibraryId, setActiveExamLibraryId] = useState<string | null>(() => examLibrary[0]?.id || null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => examLibrary[0]?.sessions?.[0]?.id || null);
  const [activeSessionClassName, setActiveSessionClassName] = useState<string>(() => examLibrary[0]?.sessions?.[0]?.className || '');

  // Modal: Mở lớp kiểm tra mới
  const [creatingClassForExam, setCreatingClassForExam] = useState<LibraryExamItem | null>(null);
  const [newClassInputName, setNewClassInputName] = useState<string>('');
  const [newClassPin, setNewClassPin] = useState<string>('');
  const [newClassNotes, setNewClassNotes] = useState<string>('');

  // Modal: Xem kết quả thi của từng lớp
  const [viewingClassResult, setViewingClassResult] = useState<{
    exam: LibraryExamItem;
    session: ExamSession;
  } | null>(null);
  const [classResultSearch, setClassResultSearch] = useState<string>('');
  const [classResultFilter, setClassResultFilter] = useState<'all' | 'gioi' | 'kha' | 'tb' | 'duoitb' | 'violation'>('all');

  // Confirmation Modals for Deletions (Eliminates window.confirm blocked in sandboxed iframes)
  const [examToDelete, setExamToDelete] = useState<LibraryExamItem | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<{ examId: string; sessionId: string; className: string; examTitle: string } | null>(null);

  // Teacher State
  const [roomStatus, setRoomStatus] = useState<'lobby' | 'started' | 'ended'>('lobby');
  const [teacherTab, setTeacherTab] = useState<'library' | 'room' | 'report' | 'settings'>(initialTab || 'library');
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [showProjectorModal, setShowProjectorModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Anti-cheat Settings
  const [antiCheatSettings, setAntiCheatSettings] = useState<ExamConfig>(defaultExamConfig);

  // Student State
  const [studentId, setStudentId] = useState<string>(() => 'stu_' + Math.random().toString(36).substring(2, 9));
  const [studentName, setStudentName] = useState<string>('');
  const [studentClass, setStudentClass] = useState<string>('12A1');
  const [studentSBD, setStudentSBD] = useState<string>('');
  const [studentAssignedCode, setStudentAssignedCode] = useState<string>(initialExam?.code || '101');
  const [studentJoined, setStudentJoined] = useState<boolean>(false);
  const [studentStatus, setStudentStatus] = useState<'waiting' | 'testing' | 'submitted' | 'suspended'>('waiting');
  const [resumedNotice, setResumedNotice] = useState<{ code: string; count: number; total: number } | null>(null);

  const durationMinutes = Number(activeExam?.duration) || 45;
  const [studentTimeLeft, setStudentTimeLeft] = useState<number>(durationMinutes * 60);
  const [studentAnswers, setStudentAnswers] = useState<{
    mcq: Record<number, string>;
    tf: Record<number, Record<number, boolean | null>>;
    sa: Record<number, Record<number, string>>;
    tl: Record<number, string>;
  }>({ mcq: {}, tf: {}, sa: {}, tl: {} });
  const [studentViolations, setStudentViolations] = useState<number>(0);
  const [violationAlert, setViolationAlert] = useState<string | null>(null);
  const [studentScore, setStudentScore] = useState<{ score: number; rating: string } | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [countdownNumber, setCountdownNumber] = useState<number | null>(null);
  const [isPaletteCollapsed, setIsPaletteCollapsed] = useState<boolean>(false);
  const [isScreenShieldActive, setIsScreenShieldActive] = useState<boolean>(false);
  const [isMissingFullscreen, setIsMissingFullscreen] = useState<boolean>(false);

  // Nhận diện thiết bị di động (điện thoại/máy tính bảng) để tránh khóa nhầm Fullscreen do giới hạn trình duyệt mobile
  const isMobileDevice = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      ('maxTouchPoints' in navigator && navigator.maxTouchPoints > 2);
  }, []);

  // Helper: Request Fullscreen and lock keyboard (prevent ESC exit)
  const enterFullscreenAndLock = async () => {
    // Trình duyệt điện thoại (iOS Safari, Android Webview/Zalo/QR) không hỗ trợ HTML5 Fullscreen API như máy tính
    if (isMobileDevice) {
      setIsMissingFullscreen(false);
      return;
    }
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      // HTML5 Keyboard Lock API: Chặn phím ESC thoát fullscreen trên Chrome/Chromium/Edge
      if ('keyboard' in navigator && (navigator as any).keyboard?.lock) {
        await (navigator as any).keyboard.lock(['Escape']);
      }
      setIsMissingFullscreen(false);
    } catch (err) {
      console.warn('Fullscreen / keyboard lock request:', err);
      if (antiCheatSettings.requireFullscreen && !document.fullscreenElement && !isMobileDevice) {
        setIsMissingFullscreen(true);
      }
    }
  };

  // Modals for Student Submissions (early submit notice and submission confirmation)
  const [earlySubmitModal, setEarlySubmitModal] = useState<{
    isOpen: boolean;
    minMinutes: number;
    waitMinutes: number;
    waitSeconds: number;
  } | null>(null);
  const [confirmSubmitModal, setConfirmSubmitModal] = useState<boolean>(false);
  const isStudentModalOpenRef = useRef<boolean>(false);

  useEffect(() => {
    isStudentModalOpenRef.current = Boolean(earlySubmitModal || confirmSubmitModal);
  }, [earlySubmitModal, confirmSubmitModal]);

  const answeredQuestionsCount = useMemo(() => {
    const questions = activeExam?.questions || [];
    return questions.filter((_, qIdx) => {
      const isMCQDone = studentAnswers.mcq[qIdx] !== undefined;
      const isTFDone = Boolean(studentAnswers.tf[qIdx] && Object.keys(studentAnswers.tf[qIdx]).length > 0);
      const isSADone = Boolean(studentAnswers.sa[qIdx] && Object.keys(studentAnswers.sa[qIdx]).length > 0);
      const isTLDone = Boolean(studentAnswers.tl?.[qIdx] && studentAnswers.tl[qIdx].trim().length > 0);
      return isMCQDone || isTFDone || isSADone || isTLDone;
    }).length;
  }, [activeExam?.questions, studentAnswers]);

  const triggerCountdownAndStart = () => {
    if (studentStatus === 'testing' || studentStatus === 'submitted') return;
    setCountdownNumber(3);
  };

  // Countdown effect: 3 -> 2 -> 1 -> 0 (Bắt đầu) -> Vào làm bài thi
  useEffect(() => {
    if (countdownNumber === null) return;
    if (countdownNumber > 0) {
      const timer = setTimeout(() => {
        setCountdownNumber(countdownNumber - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdownNumber === 0) {
      const timer = setTimeout(() => {
        if (antiCheatSettings.requireFullscreen) {
          enterFullscreenAndLock();
        }
        setStudentStatus('testing');
        setCountdownNumber(null);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [countdownNumber, antiCheatSettings.requireFullscreen]);

  // Teacher Security PIN Protection (Mật mã bảo vệ giáo viên)
  const [teacherSecurityPin, setTeacherSecurityPin] = useState<string>(() => {
    return localStorage.getItem('smarttest_teacher_security_pin') || '123456';
  });
  const [showTeacherUnlockModal, setShowTeacherUnlockModal] = useState<boolean>(false);
  const [unlockPinInput, setUnlockPinInput] = useState<string>('');
  const [unlockPinError, setUnlockPinError] = useState<string | null>(null);
  const [pendingUnlockAction, setPendingUnlockAction] = useState<(() => void) | null>(null);
  const [newSecurityPinInput, setNewSecurityPinInput] = useState<string>('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState<boolean>(false);
  const [pinChangeError, setPinChangeError] = useState<string | null>(null);

  const requestTeacherAccess = (action: () => void) => {
    setPendingUnlockAction(() => action);
    setUnlockPinInput('');
    setUnlockPinError(null);
    setShowTeacherUnlockModal(true);
  };

  const handleVerifyTeacherPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockPinInput.trim() === teacherSecurityPin.trim()) {
      setShowTeacherUnlockModal(false);
      setUnlockPinInput('');
      setUnlockPinError(null);
      if (pendingUnlockAction) {
        pendingUnlockAction();
      }
    } else {
      setUnlockPinError('Mật mã giáo viên không chính xác. Quyền truy cập bị từ chối!');
    }
  };

  const handleUpdateSecurityPin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newSecurityPinInput.trim();
    if (clean.length < 4) {
      setPinChangeError('Mật mã phải có ít nhất 4 ký tự!');
      return;
    }
    setPinChangeError(null);
    setTeacherSecurityPin(clean);
    localStorage.setItem('smarttest_teacher_security_pin', clean);
    setPinChangeSuccess(true);
    setTimeout(() => setPinChangeSuccess(false), 2500);
  };

  const channelRef = useRef<BroadcastChannel | null>(null);
  const timerRef = useRef<any>(null);

  // Student URL to join
  const studentUrl = useMemo(() => {
    const origin = window.location.origin;
    return `${origin}/?room=${roomCode}&student=true`;
  }, [roomCode]);

  useEffect(() => {
    if (initialTab) {
      setTeacherTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('smarttest_exam_library');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          parsed.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
          setExamLibrary(parsed);
        }
      }
    } catch (e) {}
  }, [initialExam]);

  // Generate QR Code
  useEffect(() => {
    if (!roomCode) return;
    QRCode.toDataURL(studentUrl, { width: 400, margin: 2, color: { dark: '#004d40', light: '#ffffff' } })
      .then(url => setQrCodeDataUrl(url))
      .catch(console.error);
  }, [studentUrl, roomCode]);

  // TEACHER: Register & Sync Room to Server + LocalStorage
  useEffect(() => {
    if (role === 'teacher' && activeExam && roomCode) {
      // 1. Save to LocalStorage for same-origin tabs
      localStorage.setItem(`smarttest_room_${roomCode}`, JSON.stringify({
        roomCode,
        examData: activeExam,
        allShuffledExams,
        antiCheatSettings,
        status: roomStatus,
        timestamp: Date.now()
      }));

      // 2. Sync to Backend Server API so phones can access
      fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomCode,
          examData: activeExam,
          allShuffledExams,
          antiCheatSettings,
          status: roomStatus
        })
      })
        .then(r => r.json())
        .then(data => {
          console.log('[Room synced to server]:', data);
        })
        .catch(err => {
          console.warn('[Could not sync room to server, will use local fallback]:', err);
        });
    }
  }, [role, roomCode, activeExam, allShuffledExams, antiCheatSettings, roomStatus]);

  // STUDENT: Load Exam Data from Server API or LocalStorage
  useEffect(() => {
    if (role === 'student' && roomCode) {
      setIsLoadingExam(true);

      // Attempt 1: Fetch from Server API
      fetch(`/api/rooms/${roomCode}`)
        .then(r => {
          if (!r.ok) throw new Error('Phòng thi không tồn tại trên hệ thống');
          return r.json();
        })
        .then(data => {
          if (data && data.examData) {
            setActiveExam(data.examData);
            if (data.antiCheatSettings) setAntiCheatSettings(data.antiCheatSettings);
            if (data.status) setRoomStatus(data.status);
            setIsLoadingExam(false);
          } else {
            throw new Error('Dữ liệu phòng thi không hợp lệ');
          }
        })
        .catch(() => {
          // Attempt 2: Fallback to LocalStorage (for same-browser preview)
          const local = localStorage.getItem(`smarttest_room_${roomCode}`);
          if (local) {
            try {
              const parsed = JSON.parse(local);
              if (parsed.examData) {
                setActiveExam(parsed.examData);
                if (parsed.antiCheatSettings) setAntiCheatSettings(parsed.antiCheatSettings);
                if (parsed.status) setRoomStatus(parsed.status);
                setIsLoadingExam(false);
                return;
              }
            } catch (e) {
              console.error(e);
            }
          }
          if (initialExam) {
            setActiveExam(initialExam);
          }
          setIsLoadingExam(false);
        });
    }
  }, [role, roomCode]);

  // TEACHER: Poll server every 2 seconds for new students from phones
  useEffect(() => {
    if (role !== 'teacher' || !roomCode) return;

    const interval = setInterval(() => {
      fetch(`/api/rooms/${roomCode}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data && Array.isArray(data.students)) {
            setStudents(prev => {
              const map = new Map<string, StudentRecord>();
              prev.forEach(s => map.set(s.id, s));
              data.students.forEach((s: StudentRecord) => map.set(s.id, s));
              return Array.from(map.values());
            });
          }
        })
        .catch(() => {});
    }, 2000);

    return () => clearInterval(interval);
  }, [role, roomCode]);

  // STUDENT: Poll server every 1.5 seconds for room status & suspensions
  useEffect(() => {
    if (role !== 'student' || !roomCode) return;

    const interval = setInterval(() => {
      const clean = encodeURIComponent(String(roomCode).trim());
      fetch(`/api/rooms/${clean}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data) {
            if (data.status) {
              setRoomStatus(data.status);
            }
            // CRITICAL FIX: Luôn kích hoạt bắt đầu làm bài khi phòng ở trạng thái 'started' và học sinh đã điểm danh đang chờ
            if (data.status === 'started' && studentJoined && studentStatus === 'waiting') {
              triggerCountdownAndStart();
            } else if (data.status === 'ended' && studentStatus === 'testing') {
              handleStudentSubmit(true);
            }
            if (Array.isArray(data.students)) {
              const me = data.students.find((s: any) => s.id === studentId);
              if (me && me.status === 'suspended' && studentStatus !== 'suspended') {
                setStudentStatus('suspended');
                setViolationAlert('Giáo viên đã đình chỉ bài thi của bạn do vi phạm quy chế.');
              }
            }
          }
        })
        .catch(() => {});
    }, 1500);

    return () => clearInterval(interval);
  }, [role, roomCode, studentJoined, studentStatus, studentId]);

  // STUDENT: Tự động kích hoạt vào thi ngay lập tức khi học sinh vừa điểm danh xong mà phòng đã mở
  useEffect(() => {
    if (role === 'student' && studentJoined && studentStatus === 'waiting' && roomStatus === 'started') {
      triggerCountdownAndStart();
    }
  }, [role, studentJoined, studentStatus, roomStatus]);

  // Broadcast Channel for live same-device cross-tab synchronization
  useEffect(() => {
    if (!roomCode) return;
    const bc = new BroadcastChannel(`smarttest_room_${roomCode}`);
    channelRef.current = bc;

    bc.onmessage = (e) => {
      const { type, payload } = e.data;
      if (type === 'STUDENT_JOIN') {
        setStudents(prev => prev.some(s => s.id === payload.id) ? prev : [...prev, payload]);
      } else if (type === 'STUDENT_PROGRESS') {
        setStudents(prev => prev.map(s => s.id === payload.id ? { ...s, answeredCount: payload.count } : s));
      } else if (type === 'STUDENT_VIOLATION') {
        setStudents(prev => prev.map(s => {
          if (s.id === payload.id) {
            const v = s.violations + 1;
            return { ...s, violations: v, status: v >= antiCheatSettings.maxViolations ? 'suspended' : s.status };
          }
          return s;
        }));
      } else if (type === 'STUDENT_SUBMIT') {
        setStudents(prev => prev.map(s => s.id === payload.id ? {
          ...s,
          status: 'submitted',
          score: payload.score,
          rating: payload.rating,
          submittedAt: Date.now()
        } : s));
      } else if (type === 'START_EXAM') {
        setRoomStatus('started');
        if (studentJoined && studentStatus === 'waiting') {
          triggerCountdownAndStart();
        }
      } else if (type === 'STOP_EXAM') {
        setRoomStatus('ended');
        if (studentStatus === 'testing') handleStudentSubmit(true);
      }
    };

    return () => bc.close();
  }, [roomCode, studentJoined, studentStatus, antiCheatSettings.maxViolations]);

  // Student Countdown Timer
  useEffect(() => {
    if (studentStatus === 'testing') {
      timerRef.current = setInterval(() => {
        setStudentTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleStudentSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [studentStatus]);

  // Anti-cheat Listeners for Student
  useEffect(() => {
    if (role !== 'student' || studentStatus !== 'testing' || showTeacherGuidanceReturn) return;

    const handleVisibility = () => {
      if (document.hidden) {
        setIsScreenShieldActive(true);
        if (antiCheatSettings.detectTabSwitch) {
          triggerViolation('Rời khỏi tab bài thi (Chuyển tab hoặc mở ứng dụng khác)');
        }
      } else {
        setIsScreenShieldActive(false);
      }
    };

    const handleBlur = () => {
      // Bỏ qua mất tiêu điểm nếu học sinh đang mở hộp thoại thông báo nộp bài / xác nhận nộp bài
      if (isStudentModalOpenRef.current) return;
      // Whenever window loses focus (e.g., user opens Snipping Tool, Win+Shift+S, Lightshot, or switches windows)
      setIsScreenShieldActive(true);
      if (antiCheatSettings.detectTabSwitch) {
        triggerViolation('Mất tiêu điểm (Mở cửa sổ hoặc công cụ chụp/quay màn hình)');
      }
    };

    const handleFocus = () => {
      setIsScreenShieldActive(false);
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (antiCheatSettings.preventCopyInspect) e.preventDefault();
    };
    const handleCopyCut = (e: ClipboardEvent) => {
      if (antiCheatSettings.preventCopyInspect) e.preventDefault();
    };
    const handleSelectStart = (e: Event) => {
      if (antiCheatSettings.preventCopyInspect) e.preventDefault();
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      // Chặn phím chụp màn hình PrintScreen
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        setIsScreenShieldActive(true);
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText('');
          }
        } catch (_) {}
        triggerViolation('Phát hiện phím chụp ảnh màn hình (PrintScreen)');
        return;
      }

      // Chặn in đề thi (Ctrl+P / Cmd+P)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        e.stopPropagation();
        triggerViolation('Cố gắng in đề thi hoặc lưu PDF (Ctrl+P)');
        return;
      }

      // Chặn phím ESC để chống thoát chế độ toàn màn hình
      if (e.key === 'Escape' || e.keyCode === 27) {
        if (antiCheatSettings.requireFullscreen) {
          e.preventDefault();
          e.stopPropagation();
          if (!document.fullscreenElement) {
            setIsMissingFullscreen(true);
          }
          triggerViolation('Bấm phím ESC trong chế độ toàn màn hình');
          return;
        }
      }

      if (!antiCheatSettings.preventCopyInspect) return;
      if (
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c' || e.key === 'S' || e.key === 's')) ||
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) ||
        ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U' || e.key === 'c' || e.key === 'C' || e.key === 's' || e.key === 'S' || e.key === 'a' || e.key === 'A'))
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        setIsScreenShieldActive(true);
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText('');
          }
        } catch (_) {}
      }
    };

    const handleFullscreenChange = () => {
      if (isMobileDevice) return;
      const isFs = Boolean(document.fullscreenElement);
      if (antiCheatSettings.requireFullscreen) {
        if (!isFs) {
          setIsMissingFullscreen(true);
          triggerViolation('Thoát chế độ toàn màn hình (phím ESC hoặc phím tắt)');
        } else {
          setIsMissingFullscreen(false);
          // Tái kích hoạt khóa phím ESC nếu trình duyệt hỗ trợ
          if ('keyboard' in navigator && (navigator as any).keyboard?.lock) {
            (navigator as any).keyboard.lock(['Escape']).catch(() => {});
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopyCut);
    document.addEventListener('cut', handleCopyCut);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopyCut);
      document.removeEventListener('cut', handleCopyCut);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [role, studentStatus, antiCheatSettings, showTeacherGuidanceReturn]);

  const triggerViolation = (reason: string) => {
    if (showTeacherGuidanceReturn) return;
    setStudentViolations(prev => {
      const n = prev + 1;
      const isMaxExceeded = n >= (antiCheatSettings.maxViolations || 3);

      // 1. BroadcastChannel
      channelRef.current?.postMessage({
        type: 'STUDENT_VIOLATION',
        payload: { id: studentId, violations: n, reason }
      });

      // 2. Server API
      fetch(`/api/rooms/${roomCode}/student-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          violations: n,
          status: isMaxExceeded ? 'suspended' : 'in_progress'
        })
      }).catch(() => {});

      if (isMaxExceeded) {
        setViolationAlert(`BẠN ĐÃ VI PHẠM QUÁ SỐ LẦN CHO PHÉP (${n}/${antiCheatSettings.maxViolations}): Hệ thống đang TỰ ĐỘNG THU BÀI CƯỠNG CHẾ và đình chỉ bài làm ngay lập tức!`);
        setTimeout(() => {
          handleStudentSubmit(true);
        }, 1200);
      } else {
        setViolationAlert(`CẢNH BÁO VI PHẠM (${n}/${antiCheatSettings.maxViolations}): ${reason}. Thao tác này đã được hệ thống ghi nhận và báo cáo tới giáo viên.`);
      }
      return n;
    });
  };

  // Student manual PIN submission
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputPin.trim();
    if (clean.length < 4) {
      setPinError('Vui lòng nhập mã phòng hợp lệ (từ 4-6 số)');
      return;
    }
    setIsVerifyingPin(true);
    setPinError(null);

    fetch(`/api/rooms/${clean}`)
      .then(r => {
        if (!r.ok) throw new Error('Phòng thi không tồn tại');
        return r.json();
      })
      .then(data => {
        setIsVerifyingPin(false);
        if (data && data.examData) {
          setRoomCode(clean);
          setActiveExam(data.examData);
          if (data.antiCheatSettings) setAntiCheatSettings(data.antiCheatSettings);
          if (data.status) setRoomStatus(data.status);
        } else {
          setPinError('Dữ liệu phòng thi không hợp lệ.');
        }
      })
      .catch(() => {
        setIsVerifyingPin(false);
        // Fallback to localStorage
        const local = localStorage.getItem(`smarttest_room_${clean}`);
        if (local) {
          try {
            const parsed = JSON.parse(local);
            if (parsed.examData) {
              setRoomCode(clean);
              setActiveExam(parsed.examData);
              if (parsed.antiCheatSettings) setAntiCheatSettings(parsed.antiCheatSettings);
              if (parsed.status) setRoomStatus(parsed.status);
              return;
            }
          } catch (e) {}
        }
        setPinError(`Không tìm thấy phòng thi #${clean}. Thầy cô vui lòng bấm "Xuất đề thi online" trước.`);
      });
  };

  // Student Joins
  const handleStudentJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;

    let assigned = activeExam?.code || '101';
    if (antiCheatSettings.allowShuffleCodes && allShuffledExams.length > 0) {
      const idx = Math.floor(Math.random() * allShuffledExams.length);
      assigned = allShuffledExams[idx].code;
    }
    setStudentAssignedCode(assigned);

    const record: StudentRecord = {
      id: studentId,
      name: studentName.trim(),
      className: studentClass.trim() || '12A1',
      studentId: studentSBD.trim(),
      code: assigned,
      joinedAt: Date.now(),
      status: roomStatus === 'started' ? 'in_progress' : 'waiting',
      answeredCount: 0,
      totalQuestions: activeExam?.questions?.length || 0,
      violations: 0
    };

    setStudentJoined(true);
    if (roomStatus === 'started') {
      setStudentStatus('waiting');
      triggerCountdownAndStart();
    } else {
      setStudentStatus('waiting');
    }

    // 1. BroadcastChannel
    channelRef.current?.postMessage({ type: 'STUDENT_JOIN', payload: record });

    // 2. Server API (Hỗ trợ khôi phục bài làm nếu vào lại từ thiết bị khác hoặc rớt mạng)
    fetch(`/api/rooms/${roomCode}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student: record })
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.resumed && data?.student) {
          const prev = data.student;
          setStudentId(prev.id);
          if (prev.code) setStudentAssignedCode(prev.code);
          if (prev.answers) {
            setStudentAnswers(prev.answers);
          }
          if (typeof prev.timeLeft === 'number' && prev.timeLeft > 0) {
            setStudentTimeLeft(prev.timeLeft);
          }
          if (typeof prev.violations === 'number') {
            setStudentViolations(prev.violations);
          }
          if (prev.status === 'submitted') {
            setStudentStatus('submitted');
            if (prev.score !== undefined) {
              setStudentScore({ score: prev.score, rating: prev.rating || 'Đã nộp bài' });
            }
          } else {
            const count = prev.answeredCount || (prev.answers ? Object.keys(prev.answers.mcq || {}).length + Object.keys(prev.answers.tf || {}).length + Object.keys(prev.answers.sa || {}).length + Object.keys(prev.answers.tl || {}).length : 0);
            setResumedNotice({
              code: prev.code || assigned,
              count,
              total: activeExam?.questions?.length || 0
            });
            setTimeout(() => setResumedNotice(null), 6000);
          }
        }
      })
      .catch(() => {
        // Dự phòng LocalStorage nếu máy cũ chỉ bị tải lại trang
        try {
          const localSaved = localStorage.getItem(`smarttest_progress_${roomCode}_${studentName.trim()}_${studentClass.trim()}`);
          if (localSaved) {
            const parsed = JSON.parse(localSaved);
            if (parsed.answers) setStudentAnswers(parsed.answers);
            if (parsed.code) setStudentAssignedCode(parsed.code);
            if (parsed.timeLeft) setStudentTimeLeft(parsed.timeLeft);
            if (parsed.studentId) setStudentId(parsed.studentId);
          }
        } catch (_) {}
      });

    if (antiCheatSettings.requireFullscreen) {
      enterFullscreenAndLock();
    }
  };

  const notifyProgress = (answersObj: typeof studentAnswers) => {
    const mcqAnswered = Object.keys(answersObj.mcq).length;
    const tfAnswered = Object.keys(answersObj.tf).length;
    const saAnswered = Object.keys(answersObj.sa).length;
    const tlAnswered = Object.keys(answersObj.tl).length;
    const totalCount = mcqAnswered + tfAnswered + saAnswered + tlAnswered;

    channelRef.current?.postMessage({
      type: 'STUDENT_PROGRESS',
      payload: { id: studentId, count: totalCount }
    });

    // 1. Lưu dự phòng vào LocalStorage trên thiết bị hiện tại
    try {
      localStorage.setItem(`smarttest_progress_${roomCode}_${studentName.trim()}_${studentClass.trim()}`, JSON.stringify({
        studentId,
        code: studentAssignedCode,
        answers: answersObj,
        answeredCount: totalCount,
        timeLeft: studentTimeLeft,
        updatedAt: Date.now()
      }));
    } catch (_) {}

    // 2. Đồng bộ tự động lên Server theo thời gian thực (giúp đổi máy làm tiếp tức thì)
    fetch(`/api/rooms/${roomCode}/student-update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        studentId, 
        answeredCount: totalCount,
        answers: answersObj,
        timeLeft: studentTimeLeft
      })
    }).catch(() => {});
  };

  // Thực hiện nộp bài và chấm điểm
  const doExecuteSubmit = () => {
    setConfirmSubmitModal(false);
    setEarlySubmitModal(null);
    if (timerRef.current) clearInterval(timerRef.current);

    // Mở khóa bàn phím và thoát chế độ toàn màn hình
    if ('keyboard' in navigator && (navigator as any).keyboard?.unlock) {
      (navigator as any).keyboard.unlock();
    }
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    setIsMissingFullscreen(false);

    const questions = activeExam?.questions || [];
    let total = 0;

    questions.forEach((q, idx) => {
      const pts = Number(q.points) || (q.type === 'MCQ' ? Number(mcqPoints) : q.type === 'TF' ? Number(tfPoints) : Number(saPoints));
      if (q.type === 'MCQ') {
        const c = studentAnswers.mcq[idx];
        const correct = q.options?.find(o => o.isCorrect)?.id;
        if (c && correct && c === correct) total += pts;
      } else if (q.type === 'TF') {
        const subs = q.tfSubQuestions || [];
        const choices = studentAnswers.tf[idx] || {};
        let count = 0;
        subs.forEach((s, i) => { if (choices[i] === s.isCorrect) count++; });
        let r = count === 4 ? 1.0 : count === 3 ? 0.5 : count === 2 ? 0.25 : count === 1 ? 0.1 : 0;
        total += r * pts;
      } else if (q.type === 'SA') {
        const subs = q.saSubQuestions || [];
        const choices = studentAnswers.sa[idx] || {};
        let count = 0;
        subs.forEach((s, i) => {
          if ((choices[i] || '').trim().toLowerCase() === (s.answer || '').trim().toLowerCase()) count++;
        });
        total += subs.length ? (count / subs.length) * pts : 0;
      }
    });

    const finalScore = Number(total.toFixed(2));
    const rating = finalScore >= 8.5 ? 'Giỏi 🥇' : finalScore >= 6.5 ? 'Khá 🥈' : finalScore >= 5.0 ? 'Trung bình 🥉' : 'Cần cố gắng 📚';

    setStudentScore({ score: finalScore, rating });
    setStudentStatus('submitted');

    const totalAnswered = Object.keys(studentAnswers.mcq).length + Object.keys(studentAnswers.tf).length + Object.keys(studentAnswers.sa).length;

    // 1. BroadcastChannel
    channelRef.current?.postMessage({
      type: 'STUDENT_SUBMIT',
      payload: { id: studentId, score: finalScore, rating }
    });

    // 2. Server API
    fetch(`/api/rooms/${roomCode}/student-update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId,
        score: finalScore,
        rating,
        status: 'submitted',
        answeredCount: totalAnswered
      })
    }).catch(() => {});
  };

  // Student Submits
  const handleStudentSubmit = (forceSubmit: boolean = false) => {
    if (forceSubmit) {
      doExecuteSubmit();
      return;
    }

    // Check minimum submission time (tính theo giây để chính xác)
    const elapsedSeconds = Math.max(0, (durationMinutes * 60) - studentTimeLeft);
    const minSubmitSeconds = (antiCheatSettings.minSubmitMinutes || 0) * 60;

    if (minSubmitSeconds > 0 && elapsedSeconds < minSubmitSeconds) {
      const remainingSec = minSubmitSeconds - elapsedSeconds;
      const waitMinutes = Math.floor(remainingSec / 60);
      const waitSeconds = remainingSec % 60;
      setEarlySubmitModal({
        isOpen: true,
        minMinutes: antiCheatSettings.minSubmitMinutes || 0,
        waitMinutes,
        waitSeconds
      });
      return;
    }

    // Mở hộp thoại xác nhận nộp bài (tránh nộp nhầm và không bao giờ gây mất tiêu điểm / gian lận)
    setConfirmSubmitModal(true);
  };

  // Auto-sync students in current room to the active class session in examLibrary
  useEffect(() => {
    if (!activeExamLibraryId || !activeSessionId) return;
    setExamLibrary(prev => {
      let changed = false;
      const next = prev.map(item => {
        if (item.id !== activeExamLibraryId) return item;
        const sessions = item.sessions || [];
        const sessIdx = sessions.findIndex(s => s.id === activeSessionId);
        if (sessIdx === -1) return item;
        const curSess = sessions[sessIdx];
        if (curSess.students.length === students.length && 
            curSess.status === roomStatus &&
            JSON.stringify(curSess.students) === JSON.stringify(students)) {
          return item;
        }
        changed = true;
        const updatedSessions = [...sessions];
        updatedSessions[sessIdx] = {
          ...curSess,
          students,
          status: roomStatus
        };
        return { ...item, sessions: updatedSessions };
      });
      if (changed) {
        localStorage.setItem('smarttest_exam_library', JSON.stringify(next));
        return next;
      }
      return prev;
    });
  }, [students, roomStatus, activeExamLibraryId, activeSessionId]);

  // Class Session Handlers
  const handleOpenNewClassModal = (item: LibraryExamItem) => {
    setCreatingClassForExam(item);
    const gradeClean = item.grade?.replace(/[^0-9]/g, '') || '12';
    const nextNum = (item.sessions?.length || 0) + 1;
    setNewClassInputName(`${gradeClean}A${nextNum}`);
    setNewClassPin(Math.floor(100000 + Math.random() * 900000).toString());
    setNewClassNotes('');
  };

  const handleCreateNewClassSession = (
    item: LibraryExamItem, 
    startNow = true, 
    withSampleStudents = false
  ) => {
    const gradeClean = item.grade?.replace(/[^0-9]/g, '') || '12';
    const className = newClassInputName.trim() || `${gradeClean}A1`;
    const newSessionId = 'sess_' + Date.now();
    const pin = newClassPin || Math.floor(100000 + Math.random() * 900000).toString();
    const mockList = withSampleStudents 
      ? generateSampleStudents(className, item.questionsCount || 20) 
      : [];

    const newSession: ExamSession = {
      id: newSessionId,
      className,
      roomCode: pin,
      createdAt: Date.now(),
      status: withSampleStudents ? 'ended' : 'started',
      students: mockList,
      notes: newClassNotes.trim()
    };

    const updatedLib = examLibrary.map(libItem => {
      if (libItem.id === item.id) {
        const existingSessions = libItem.sessions || [];
        return { ...libItem, sessions: [newSession, ...existingSessions] };
      }
      return libItem;
    });
    setExamLibrary(updatedLib);
    localStorage.setItem('smarttest_exam_library', JSON.stringify(updatedLib));

    setCreatingClassForExam(null);

    if (withSampleStudents) {
      setViewingClassResult({ exam: item, session: newSession });
    } else if (startNow) {
      setActiveExamLibraryId(item.id);
      setActiveSessionId(newSessionId);
      setActiveSessionClassName(className);
      setRoomCode(pin);
      setActiveExam(item.examData);
      setAntiCheatSettings(item.config);
      setRoomStatus('started');
      setStudents([]);

      fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomCode: pin,
          examData: item.examData,
          allShuffledExams: item.allShuffledExams || allShuffledExams,
          antiCheatSettings: item.config,
          className,
          status: 'started'
        })
      }).catch(console.error);

      setTeacherTab('room');
    }
  };

  const handleViewClassResult = (exam: LibraryExamItem, session: ExamSession) => {
    const freshExam = examLibrary.find(e => e.id === exam.id) || exam;
    const freshSession = freshExam.sessions?.find(s => s.id === session.id) || session;
    setViewingClassResult({ exam: freshExam, session: freshSession });
    setClassResultSearch('');
    setClassResultFilter('all');
  };

  const handleExportClassCSV = (exam: LibraryExamItem, session: ExamSession) => {
    const headers = ["STT", "Họ và tên", "Lớp", "SBD", "Mã đề", "Số câu đã làm", "Điểm số", "Xếp loại", "Vi phạm gian lận", "Trạng thái", "Thời gian nộp"];
    const rows = session.students.map((s, idx) => [
      idx + 1,
      `"${s.name}"`,
      `"${s.className}"`,
      `"${s.studentId}"`,
      `"${s.code}"`,
      `${s.answeredCount}/${s.totalQuestions}`,
      s.score ?? '',
      `"${s.rating || ''}"`,
      s.violations,
      `"${s.status === 'submitted' ? 'Đã nộp bài' : s.status === 'suspended' ? 'Đình chỉ' : 'Đang làm bài'}"`,
      `"${s.submittedAt ? new Date(s.submittedAt).toLocaleTimeString('vi-VN') : ''}"`
    ]);
    const csv = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `Bang_diem_Lop_${session.className.replace(/\s+/g, '_')}_${exam.title.replace(/\s+/g, '_')}.csv`;
    a.click();
  };

  const handleDeleteClassSession = (examId: string, sessionId: string) => {
    const exam = examLibrary.find(e => e.id === examId);
    const session = exam?.sessions?.find(s => s.id === sessionId);
    if (exam && session) {
      setSessionToDelete({
        examId,
        sessionId,
        className: session.className,
        examTitle: exam.title
      });
    }
  };

  const handleConfirmDeleteClassSession = () => {
    if (!sessionToDelete) return;
    const { examId, sessionId } = sessionToDelete;
    const updatedLib = examLibrary.map(item => {
      if (item.id === examId) {
        return {
          ...item,
          sessions: (item.sessions || []).filter(s => s.id !== sessionId)
        };
      }
      return item;
    });
    setExamLibrary(updatedLib);
    try {
      localStorage.setItem('smarttest_exam_library', JSON.stringify(updatedLib));
    } catch (e) {
      console.error(e);
    }
    if (viewingClassResult?.session.id === sessionId) {
      setViewingClassResult(null);
    }
    if (activeSessionId === sessionId) {
      setActiveSessionId(null);
      setActiveSessionClassName('');
    }
    setSessionToDelete(null);
  };

  const handleResumeClassRoom = (exam: LibraryExamItem, session: ExamSession) => {
    setActiveExamLibraryId(exam.id);
    setActiveSessionId(session.id);
    setActiveSessionClassName(session.className);
    setRoomCode(session.roomCode);
    setActiveExam(exam.examData);
    setAntiCheatSettings(exam.config);
    setRoomStatus(session.status);
    setStudents(session.students || []);

    fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomCode: session.roomCode,
        examData: exam.examData,
        allShuffledExams: exam.allShuffledExams || allShuffledExams,
        antiCheatSettings: exam.config,
        className: session.className
      })
    }).catch(console.error);

    setViewingClassResult(null);
    setTeacherTab('room');
  };

  // Teacher Library Handlers
  const handleLaunchExam = (item: LibraryExamItem) => {
    setActiveExam(item.examData);
    setActiveExamLibraryId(item.id);
    setAntiCheatSettings(item.config || defaultExamConfig);
    const existingCode = item.sessions?.find(s => s.status === 'started' || s.status === 'lobby')?.roomCode;
    const newCode = existingCode || Math.floor(100000 + Math.random() * 900000).toString();
    setRoomCode(newCode);
    setRoomStatus('started');
    setStudents([]);
    setActiveSessionId(null);
    setActiveSessionClassName('');

    fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomCode: newCode,
        examData: item.examData,
        allShuffledExams: item.allShuffledExams || [item.examData],
        antiCheatSettings: item.config || defaultExamConfig,
        className: 'Chung',
        status: 'started'
      })
    }).catch(console.error);

    setTeacherTab('room');
  };

  const handleSaveExamConfig = (updatedConfig: ExamConfig) => {
    if (!configuringLibraryExam) return;
    const updatedLib = examLibrary.map(item => 
      item.id === configuringLibraryExam.id ? { ...item, config: updatedConfig } : item
    );
    setExamLibrary(updatedLib);
    localStorage.setItem('smarttest_exam_library', JSON.stringify(updatedLib));
    if (activeExam?.title === configuringLibraryExam.title) {
      setAntiCheatSettings(updatedConfig);
    }
    if (creatingClassForExam?.id === configuringLibraryExam.id) {
      setCreatingClassForExam(prev => prev ? { ...prev, config: updatedConfig } : null);
    }
    setConfiguringLibraryExam(null);
  };

  const handleSaveAndLaunch = (updatedConfig: ExamConfig) => {
    if (!configuringLibraryExam) return;
    const itemWithNewConfig = { ...configuringLibraryExam, config: updatedConfig };
    handleSaveExamConfig(updatedConfig);
    handleLaunchExam(itemWithNewConfig);
  };

  const handleDeleteLibraryExam = (id: string) => {
    const target = examLibrary.find(item => item.id === id);
    if (target) {
      setExamToDelete(target);
    }
  };

  const handleConfirmDeleteLibraryExam = async () => {
    if (!examToDelete) return;
    const id = examToDelete.id;
    const isPublic = examToDelete.visibility === 'public';

    // Nếu đề công khai và thuộc về tài khoản khác -> Ngăn chặn xóa
    if (isPublic && examToDelete.ownerId && examToDelete.ownerId !== teacherAccount.id) {
      setShareToast({
        type: 'info',
        message: 'Bạn không có quyền xóa đề công khai do giáo viên khác chia sẻ!'
      });
      setExamToDelete(null);
      setTimeout(() => setShareToast(null), 4000);
      return;
    }

    const updatedLib = examLibrary.filter(item => item.id !== id);
    setExamLibrary(updatedLib);
    try {
      localStorage.setItem(`smarttest_exam_library_${teacherAccount.id}`, JSON.stringify(updatedLib));
      localStorage.setItem('smarttest_exam_library', JSON.stringify(updatedLib));
    } catch (e) {
      console.error(e);
    }

    // Xóa trên Server theo tài khoản
    try {
      await fetch(`/api/teacher-library/${encodeURIComponent(teacherAccount.id)}/${id}`, {
        method: 'DELETE'
      });
    } catch (_) {}

    // Nếu là đề công khai do chính tài khoản này chia sẻ, gỡ khỏi kho cộng đồng
    if (isPublic) {
      try {
        await fetch(`/api/community-exams/${id}`, {
          method: 'DELETE',
          headers: { 'x-teacher-id': teacherAccount.id }
        });
        fetchCommunityExams();
      } catch (_) {}
    }

    setShareToast({
      type: 'success',
      message: `Đã xóa đề "${examToDelete.title}" khỏi kho riêng tư của tài khoản.`
    });
    setTimeout(() => setShareToast(null), 3000);

    if (activeExamLibraryId === id) {
      setActiveExamLibraryId(null);
      setActiveSessionId(null);
      setActiveSessionClassName('');
    }
    if (previewingLibraryExam?.id === id) {
      setPreviewingLibraryExam(null);
    }
    if (configuringLibraryExam?.id === id) {
      setConfiguringLibraryExam(null);
    }
    if (viewingClassResult?.exam.id === id) {
      setViewingClassResult(null);
    }
    setExamToDelete(null);
  };

  // Question editing handlers within "Xem lại đề" preview modal
  const handleStartEditQuestion = (q: Question, idx: number) => {
    setEditingQuestionIdx(idx);
    setEditingQuestionDraft(JSON.parse(JSON.stringify(q)));
  };

  const handleCancelQuestionEdit = () => {
    setEditingQuestionIdx(null);
    setEditingQuestionDraft(null);
  };

  const handleSaveQuestionEdit = () => {
    if (!previewingLibraryExam || editingQuestionIdx === null || !editingQuestionDraft) return;

    const currentExamData = selectedPreviewCode === 'goc' 
      ? previewingLibraryExam.examData 
      : (previewingLibraryExam.allShuffledExams?.find(e => e.code === selectedPreviewCode) || previewingLibraryExam.examData);

    const updatedQuestions = [...(currentExamData.questions || [])];
    updatedQuestions[editingQuestionIdx] = { ...editingQuestionDraft };

    const updatedCurrentExamData = {
      ...currentExamData,
      questions: updatedQuestions
    };

    let updatedAllShuffled = previewingLibraryExam.allShuffledExams ? [...previewingLibraryExam.allShuffledExams] : undefined;

    if (selectedPreviewCode !== 'goc' && updatedAllShuffled) {
      updatedAllShuffled = updatedAllShuffled.map(ex =>
        ex.code === selectedPreviewCode ? { ...ex, questions: updatedQuestions } : ex
      );
    }

    const updatedMasterExamData = selectedPreviewCode === 'goc' ? updatedCurrentExamData : previewingLibraryExam.examData;

    const updatedItem: LibraryExamItem = {
      ...previewingLibraryExam,
      examData: updatedMasterExamData,
      allShuffledExams: updatedAllShuffled,
      questionsCount: updatedMasterExamData.questions?.length || previewingLibraryExam.questionsCount
    };

    // Update preview modal state
    setPreviewingLibraryExam(updatedItem);

    // Update in exam library & localStorage
    const updatedLib = examLibrary.map(item => item.id === updatedItem.id ? updatedItem : item);
    setExamLibrary(updatedLib);
    try {
      localStorage.setItem('smarttest_exam_library', JSON.stringify(updatedLib));
    } catch (e) {
      console.error(e);
    }

    // Sync active room exam if it's currently selected
    if (activeExamLibraryId === updatedItem.id || activeExam?.title === updatedItem.title) {
      setActiveExam(selectedPreviewCode === 'goc' ? updatedMasterExamData : { ...activeExam!, questions: updatedQuestions });
    }

    const savedIdx = editingQuestionIdx;
    setEditingQuestionIdx(null);
    setEditingQuestionDraft(null);

    setShareToast({
      type: 'success',
      message: `Đã lưu cập nhật cho câu hỏi số ${savedIdx + 1} thành công!`
    });
  };

  // Community Exam fetching
  const fetchCommunityExams = async () => {
    setIsLoadingCommunity(true);
    try {
      const res = await fetch('/api/community-exams');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setCommunityExams(data);
        }
      }
    } catch (e) {
      console.warn('Lỗi tải đề cộng đồng:', e);
    } finally {
      setIsLoadingCommunity(false);
    }
  };

  useEffect(() => {
    if (teacherTab === 'library' && libraryTabScope === 'public') {
      fetchCommunityExams();
    }
  }, [teacherTab, libraryTabScope]);

  // Open modal to confirm toggle privacy / share
  const handleRequestToggleVisibility = (item: LibraryExamItem) => {
    setExamToToggleShare(item);
  };

  // Confirm toggle privacy / share
  const handleConfirmToggleVisibility = async () => {
    if (!examToToggleShare) return;
    const item = examToToggleShare;
    const isCurrentlyPublic = item.visibility === 'public';
    const nextVisibility: 'private' | 'public' = isCurrentlyPublic ? 'private' : 'public';

    const updatedItem: LibraryExamItem = {
      ...item,
      visibility: nextVisibility,
      sharedAt: nextVisibility === 'public' ? Date.now() : undefined,
      author: item.author || 'Tôi (Giáo viên)'
    };

    // Update in local library
    const updatedLibrary = examLibrary.map(it => it.id === item.id ? updatedItem : it);
    setExamLibrary(updatedLibrary);
    try {
      localStorage.setItem('smarttest_exam_library', JSON.stringify(updatedLibrary));
    } catch (e) {}

    // Sync with server community API
    if (nextVisibility === 'public') {
      try {
        await fetch('/api/community-exams', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedItem)
        });
        fetchCommunityExams();
        setShareToast({
          type: 'success',
          message: `Đã chia sẻ đề "${item.title}" lên Thư viện cộng đồng!`
        });
      } catch (e) {}
    } else {
      try {
        await fetch(`/api/community-exams/${item.id}`, { method: 'DELETE' });
        fetchCommunityExams();
        setShareToast({
          type: 'info',
          message: `Đã chuyển đề "${item.title}" về Chế độ riêng tư (Chỉ mình tôi).`
        });
      } catch (e) {}
    }
    setExamToToggleShare(null);
    setTimeout(() => setShareToast(null), 4000);
  };

  // Clone community exam into teacher's private library
  const handleCloneToPrivate = (item: LibraryExamItem) => {
    const clonedId = 'lib_' + Date.now();
    const clonedItem: LibraryExamItem = {
      ...item,
      id: clonedId,
      title: `${item.title} (Bản sao)`,
      visibility: 'private',
      author: 'Tôi (Giáo viên)',
      createdAt: Date.now(),
      sessions: []
    };
    const updatedLib = [clonedItem, ...examLibrary];
    setExamLibrary(updatedLib);
    try {
      localStorage.setItem('smarttest_exam_library', JSON.stringify(updatedLib));
    } catch (e) {}
    setShareToast({
      type: 'success',
      message: `Đã sao chép đề "${item.title}" vào Kho riêng tư của thầy cô!`
    });
    setLibraryTabScope('private');
    setTimeout(() => setShareToast(null), 4000);
  };

  // Tải đồng bộ kho đề riêng tư của tài khoản giáo viên đang chọn từ server
  useEffect(() => {
    if (role !== 'teacher' || !teacherAccount?.id) return;
    const fetchAccountLibrary = async () => {
      try {
        const res = await fetch(`/api/teacher-library/${encodeURIComponent(teacherAccount.id)}`);
        if (res.ok) {
          const serverItems = await res.json();
          if (Array.isArray(serverItems) && serverItems.length > 0) {
            setExamLibrary(prev => {
              const map = new Map<string, LibraryExamItem>();
              prev.forEach(it => map.set(it.id, it));
              serverItems.forEach((it: LibraryExamItem) => map.set(it.id, { ...it, ownerId: teacherAccount.id }));
              const merged = Array.from(map.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
              try {
                localStorage.setItem(`smarttest_exam_library_${teacherAccount.id}`, JSON.stringify(merged));
              } catch (_) {}
              return merged;
            });
          }
        }
      } catch (err) {
        console.warn('Lỗi tải kho riêng tư từ máy chủ:', err);
      }
    };
    fetchAccountLibrary();
  }, [teacherAccount.id, role]);

  useEffect(() => {
    if (activeTeacherAccountProp && activeTeacherAccountProp.id !== teacherAccount.id) {
      handleSwitchAccount(activeTeacherAccountProp);
    }
  }, [activeTeacherAccountProp]);

  useEffect(() => {
    const handleAccountEvent = (e: any) => {
      const newAcc = e.detail;
      if (newAcc && newAcc.id) {
        handleSwitchAccount(newAcc);
      }
    };
    window.addEventListener('teacher-account-changed', handleAccountEvent);
    return () => window.removeEventListener('teacher-account-changed', handleAccountEvent);
  }, []);

  const handleSwitchAccount = async (targetAccount: TeacherAccount) => {
    setTeacherAccount(targetAccount);
    try {
      localStorage.setItem('smarttest_active_teacher_account', JSON.stringify(targetAccount));
    } catch (_) {}

    // 1. Tải từ LocalStorage của tài khoản đích
    const localSaved = localStorage.getItem(`smarttest_exam_library_${targetAccount.id}`);
    if (localSaved) {
      try {
        const parsed = JSON.parse(localSaved);
        if (Array.isArray(parsed)) {
          setExamLibrary(parsed);
        }
      } catch (_) {}
    } else {
      setExamLibrary([]);
    }

    // 2. Tải từ Server của tài khoản đích
    try {
      const res = await fetch(`/api/teacher-library/${encodeURIComponent(targetAccount.id)}`);
      if (res.ok) {
        const serverData = await res.json();
        if (Array.isArray(serverData)) {
          setExamLibrary(serverData);
          try {
            localStorage.setItem(`smarttest_exam_library_${targetAccount.id}`, JSON.stringify(serverData));
          } catch (_) {}
        }
      }
    } catch (_) {}

    setShowAccountModal(false);
    setShareToast({
      type: 'success',
      message: `Đã chuyển sang tài khoản: ${targetAccount.name}. Kho đề riêng tư đã được tải tương ứng.`
    });
    setTimeout(() => setShareToast(null), 4000);
  };

  const handleAddNewAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newAccountName.trim();
    const cleanEmail = newAccountEmail.trim().toLowerCase();
    if (!cleanName || !cleanEmail) return;

    const existing = teacherAccountsList.find(a => a.id === cleanEmail || a.email === cleanEmail);
    if (existing) {
      handleSwitchAccount(existing);
      setNewAccountName('');
      setNewAccountEmail('');
      return;
    }

    const colors = [
      'from-emerald-600 to-teal-700',
      'from-blue-600 to-indigo-700',
      'from-purple-600 to-pink-700',
      'from-amber-600 to-orange-700',
      'from-rose-600 to-red-700'
    ];
    const newAcc: TeacherAccount = {
      id: cleanEmail,
      name: cleanName,
      email: cleanEmail,
      avatarColor: colors[teacherAccountsList.length % colors.length]
    };

    const updatedList = [...teacherAccountsList, newAcc];
    setTeacherAccountsList(updatedList);
    try {
      localStorage.setItem('smarttest_teacher_accounts_list', JSON.stringify(updatedList));
    } catch (_) {}

    handleSwitchAccount(newAcc);
    setNewAccountName('');
    setNewAccountEmail('');
  };

  // Filtered exams according to selected scope - PHÂN TÁCH KHO RIÊNG TƯ THEO TÀI KHOẢN
  const privateExams = useMemo(() => {
    return examLibrary.filter(it => 
      it.visibility !== 'public' && 
      (!it.ownerId || it.ownerId === teacherAccount.id)
    );
  }, [examLibrary, teacherAccount.id]);

  const publicExams = useMemo(() => {
    const localPublic = examLibrary.filter(it => it.visibility === 'public');
    const map = new Map<string, LibraryExamItem>();
    localPublic.forEach(it => map.set(it.id, it));
    communityExams.forEach(it => map.set(it.id, it));
    return Array.from(map.values()).sort((a, b) => (b.sharedAt || b.createdAt || 0) - (a.sharedAt || a.createdAt || 0));
  }, [examLibrary, communityExams]);

  const displayedExams = libraryTabScope === 'private' ? privateExams : publicExams;

  // Teacher Controls: Start
  const handleTeacherStart = () => {
    setRoomStatus('started');
    channelRef.current?.postMessage({ type: 'START_EXAM' });
    fetch(`/api/rooms/${roomCode}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'started' })
    }).catch(() => {});
  };

  // Teacher Controls: Stop
  const handleTeacherStop = () => {
    setRoomStatus('ended');
    channelRef.current?.postMessage({ type: 'STOP_EXAM' });
    fetch(`/api/rooms/${roomCode}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ended' })
    }).catch(() => {});
  };

  // Teacher Demo students
  const handleAddDemoStudents = () => {
    const names = ['Nguyễn Văn An', 'Trần Thị Bích Ngọc', 'Lê Hoàng Nam', 'Phạm Minh Thư', 'Đặng Quốc Bảo'];
    const newRecords: StudentRecord[] = names.map((name, i) => {
      const code = allShuffledExams.length > 0 ? allShuffledExams[i % allShuffledExams.length].code : activeExam?.code || '101';
      const isDone = i === 0;
      const isViolated = i === 2;
      return {
        id: 'demo_' + Math.random().toString(36).substring(2, 7),
        name,
        className: '12A1',
        studentId: `SBD-${101 + i + students.length}`,
        code,
        joinedAt: Date.now() - (i * 90000),
        status: isDone ? 'submitted' : 'in_progress',
        answeredCount: isDone ? (activeExam?.questions?.length || 20) : Math.floor(Math.random() * 10) + 6,
        totalQuestions: activeExam?.questions?.length || 20,
        violations: isViolated ? 2 : 0,
        score: isDone ? 8.75 : undefined,
        rating: isDone ? 'Giỏi 🥇' : undefined
      };
    });
    setStudents(prev => [...prev, ...newRecords]);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["STT", "Họ và tên", "Lớp", "SBD", "Mã đề", "Điểm số", "Xếp loại", "Vi phạm gian lận", "Trạng thái"];
    const rows = students.map((s, idx) => [
      idx + 1,
      `"${s.name}"`,
      `"${s.className}"`,
      `"${s.studentId}"`,
      `"${s.code}"`,
      s.score ?? '',
      `"${s.rating || ''}"`,
      s.violations,
      `"${s.status === 'submitted' ? 'Đã nộp bài' : s.status === 'in_progress' ? 'Đang làm bài' : 'Chưa thi'}"`
    ]);
    const csv = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `Bang_diem_phong_thi_${roomCode}.csv`;
    a.click();
  };

  const copyStudentLink = () => {
    navigator.clipboard.writeText(studentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ----------------------------------------------------
  // GIAO DIỆN HỌC SINH NHẬP MÃ PIN (NẾU CHƯA CÓ ROOM CODE)
  // ----------------------------------------------------
  if (role === 'student' && !roomCode) {
    const recentRoom = typeof window !== 'undefined' ? localStorage.getItem('smarttest_current_room') : null;

    return (
      <div className="max-w-md mx-auto space-y-4 mt-8 animate-in fade-in pb-16">
        {showTeacherGuidanceReturn && (
          <div className="bg-slate-900 text-white p-3.5 rounded-2xl border border-emerald-500/40 shadow-xl flex items-center justify-between gap-3 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-emerald-500 text-slate-950 rounded-xl font-black text-xs shrink-0">👨‍🏫</span>
              <div className="text-left">
                <p className="text-xs font-black uppercase text-white tracking-tight">Chế độ hướng dẫn học sinh</p>
                <p className="text-[11px] text-emerald-200/80 font-medium">Màn hình nhập mã PIN phòng thi</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleReturnToTeacher}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase flex items-center gap-1.5 shadow-md active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Về Giáo viên</span>
            </button>
          </div>
        )}

        <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <GraduationCap className="w-8 h-8" />
        </div>
        <div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black uppercase tracking-wider">
            CỔNG THI HỌC SINH • QUIZIZZ-STYLE
          </span>
          <h2 className="text-2xl font-black uppercase text-slate-900 mt-2">VÀO PHÒNG THI TRỰC TUYẾN</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">Nhập mã phòng thi 6 số do thầy cô giáo cung cấp</p>
        </div>

        <form onSubmit={handlePinSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase">
              <span>Mã phòng thi (PIN)</span>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    const num = text.replace(/[^0-9]/g, '').slice(0, 6);
                    if (num) {
                      setInputPin(num);
                      setPinError(null);
                    }
                  } catch (e) {}
                }}
                className="text-[11px] text-emerald-600 hover:text-emerald-700 normal-case font-bold flex items-center gap-1"
              >
                <Copy className="w-3 h-3" /> Dán từ bộ nhớ tạm
              </button>
            </div>

            <input
              type="text"
              required
              maxLength={6}
              value={inputPin}
              onChange={e => {
                setInputPin(e.target.value.replace(/[^0-9]/g, ''));
                setPinError(null);
              }}
              placeholder="VD: 582194"
              className="w-full text-center tracking-widest text-3xl font-black font-mono py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-emerald-600 focus:outline-none focus:bg-white transition-all shadow-inner"
            />
          </div>

          {recentRoom && recentRoom !== inputPin && (
            <div className="text-left p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <span className="text-[11px] text-emerald-900 font-medium">
                Phòng thi đang mở gần nhất: <strong className="font-mono text-emerald-800 font-bold">{recentRoom}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  setInputPin(recentRoom);
                  setPinError(null);
                }}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold uppercase"
              >
                Điền nhanh
              </button>
            </div>
          )}

          {pinError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold flex items-center gap-2 text-left">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{pinError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isVerifyingPin}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm uppercase shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
          >
            {isVerifyingPin ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isVerifyingPin ? 'Đang kiểm tra phòng thi...' : 'THAM GIA PHÒNG THI NGAY'}</span>
          </button>
        </form>

        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs text-slate-500 space-y-1">
          <div className="font-bold text-slate-700 flex items-center gap-1.5 text-[11px] uppercase">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" /> Hướng dẫn cho thí sinh:
          </div>
          <p className="text-[11px] leading-relaxed">
            Học sinh nhận mã PIN từ thầy cô giáo trên bảng chiếu hoặc màn hình máy chủ, nhập 6 chữ số và bấm tham gia để điểm danh và nhận mã đề tự động.
          </p>
        </div>
      </div>
      </div>
    );
  }

  // Loading state for student entering via URL
  if (role === 'student' && isLoadingExam) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        {showTeacherGuidanceReturn && (
          <button
            type="button"
            onClick={handleReturnToTeacher}
            className="mb-3 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold uppercase flex items-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
            <span>Quay lại chế độ Giáo viên</span>
          </button>
        )}
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
        <h3 className="text-lg font-black uppercase text-slate-900">ĐANG KẾT NỐI VỚI PHÒNG THI #{roomCode}...</h3>
        <p className="text-xs text-slate-500">Vui lòng đợi trong giây lát khi hệ thống tải dữ liệu đề thi.</p>
      </div>
    );
  }

  // If student opened room that doesn't exist yet
  if (role === 'student' && !activeExam) {
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-4 mt-12 animate-in fade-in">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black uppercase text-slate-900">CHƯA TÌM THẤY PHÒNG THI #{roomCode}</h2>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          Phòng thi này hiện chưa được mở hoặc mã phòng thi không chính xác. Thí sinh vui lòng kiểm tra lại mã PIN với thầy cô giáo giám thị.
        </p>
        <div className="flex flex-col gap-2 pt-2">
          {showTeacherGuidanceReturn && (
            <button
              type="button"
              onClick={handleReturnToTeacher}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span>Quay lại chế độ Giáo viên</span>
            </button>
          )}
          <button
            onClick={() => {
              setRoomCode('');
              setInputPin('');
            }}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase"
          >
            Nhập mã phòng khác
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // GIAO DIỆN GIÁO VIÊN (QUẢN LÝ PHÒNG THI)
  // ----------------------------------------------------
  if (role === 'teacher') {
    return (
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in pb-16">
        
        {/* Top bar with Step 5 title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
              <Radio className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-tight">Hệ thống Thi Online & Phòng thi Trực tuyến</h2>
              <p className="text-[11px] text-slate-500 font-medium">Tổ chức kiểm tra trắc nghiệm, quản lý phòng thi và chấm điểm tự động</p>
            </div>
          </div>
        </div>

        {/* Development Warning Banner */}
        <div className="bg-amber-50 border-2 border-red-500 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-red-600 text-white rounded-xl shadow-sm shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <div>
              <p className="text-sm font-black text-red-600">
                Chức năng Thi online đang trong quá trình phát triển! Thầy cô vui lòng không sử dụng!
              </p>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Tính năng này đang trong giai đoạn xây dựng và kiểm thử kỹ thuật trên web. Thầy cô vui lòng không áp dụng tổ chức thi chính thức cho học sinh.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block px-3 py-1 bg-red-600 text-white text-[11px] font-black rounded-lg uppercase tracking-wider shrink-0 shadow-xs">
            Đang phát triển
          </span>
        </div>

        {/* TAB 0: THƯ VIỆN ĐỀ THI TRỰC TUYẾN */}
        {teacherTab === 'library' && (
          <div className="space-y-6">
            {/* Library Header Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 sm:px-6 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
                  <BookOpen className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-base font-black text-slate-900 uppercase">Thư viện đề thi trực tuyến</h2>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Phân tách an toàn giữa Kho đề riêng tư (bảo mật) & Kho đề chia sẻ cộng đồng
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {/* Scope Switcher: Kho riêng tư vs Kho cộng đồng */}
                <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold shrink-0">
                  <button
                    onClick={() => setLibraryTabScope('private')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                      libraryTabScope === 'private'
                        ? 'bg-white text-slate-900 shadow-xs font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Kho riêng tư ({privateExams.length})</span>
                  </button>
                  <button
                    onClick={() => setLibraryTabScope('public')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                      libraryTabScope === 'public'
                        ? 'bg-white text-emerald-800 shadow-xs font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Kho cộng đồng ({publicExams.length})</span>
                  </button>
                </div>

                {onOpenUploadModal && (
                  <button
                    type="button"
                    onClick={onOpenUploadModal}
                    className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
                    title="Tải lên file Word (.docx), PDF hoặc Text bên ngoài vào Kho riêng tư"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Tải lên đề từ nguồn khác</span>
                  </button>
                )}
              </div>
            </div>

            {/* Scope explanation banner */}
            {libraryTabScope === 'private' ? (
              <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-xs text-amber-950 flex items-start sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-start sm:items-center gap-2.5">
                  <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg shrink-0 mt-0.5 sm:mt-0">
                    <Lock className="w-4 h-4" />
                  </span>
                  <div>
                    <strong className="block font-black text-amber-950">Chế độ riêng tư (Chỉ mình tôi — Mặc định bảo mật):</strong>
                    <span className="text-[11px] text-amber-900 font-medium leading-relaxed">
                      Toàn bộ đề thi trong kho này chỉ lưu trên thiết bị của thầy cô. Học sinh và giáo viên khác <strong>tuyệt đối không thể tìm kiếm hay xem trước</strong> đề kiểm tra. Sau khi học sinh thi xong, thầy cô có thể bấm <strong>"Chia sẻ"</strong> để đóng góp cho cộng đồng tham khảo.
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl text-xs text-emerald-950 flex items-start sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-start sm:items-center gap-2.5">
                  <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg shrink-0 mt-0.5 sm:mt-0">
                    <Globe className="w-4 h-4" />
                  </span>
                  <div>
                    <strong className="block font-black text-emerald-950">Thư viện đề chia sẻ cộng đồng giáo viên:</strong>
                    <span className="text-[11px] text-emerald-900 font-medium leading-relaxed">
                      Nơi các thầy cô công khai chia sẻ đề thi ôn tập và trao đổi chuyên môn. Thầy cô có thể bấm nút <strong>"Lưu về kho tôi"</strong> để nhân bản đề thi về kho riêng tư và phát đề kiểm tra cho học sinh của mình.
                    </span>
                  </div>
                </div>
                {isLoadingCommunity && (
                  <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 shrink-0">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang cập nhật...
                  </span>
                )}
              </div>
            )}

            {/* Library Exam Grid */}
            {displayedExams.length === 0 ? (
              <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center space-y-4">
                <BookOpen className="w-16 h-16 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">
                  {libraryTabScope === 'private' 
                    ? 'Chưa có đề thi nào trong Kho đề riêng tư' 
                    : 'Chưa có đề thi nào trong Thư viện cộng đồng'}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {libraryTabScope === 'private'
                    ? 'Thầy cô có thể hoàn thành tạo đề từ Bước 1-4 rồi xuất vào đây, tải lên file đề từ máy tính, hoặc bấm "Lưu về kho tôi" từ Kho cộng đồng.'
                    : 'Thầy cô có thể chuyển sang Kho riêng tư và bấm nút "Chia sẻ" để đóng góp đề thi đầu tiên cho cộng đồng giáo viên!'}
                </p>
                {libraryTabScope === 'private' && onOpenUploadModal && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={onOpenUploadModal}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black inline-flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
                    >
                      <Upload className="w-4 h-4" /> Tải lên đề từ nguồn khác ngay
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {displayedExams.map((item, idx) => {
                  const isCurrentActive = activeExam?.title === item.title;
                  const isJustExported = idx === 0 && (Date.now() - (item.createdAt || 0) < 600000 || initialExam?.title === item.title);
                  return (
                    <div 
                      key={item.id ? `exam_${item.id}_${idx}` : `exam_${idx}`}
                      className={`bg-white rounded-3xl border-2 p-6 transition-all hover:shadow-lg space-y-5 ${
                        isJustExported ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20' :
                        isCurrentActive ? 'border-emerald-400 ring-1 ring-emerald-400/20' : 'border-slate-200'
                      }`}
                    >
                      {/* Item Top Info */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          {/* Tên kì kiểm tra/thi đưa lên trên cùng, đứng trước tên môn */}
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {isJustExported && (
                                <span className="px-2.5 py-0.5 bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase flex items-center gap-1 shadow-xs animate-pulse">
                                  <Sparkles className="w-3 h-3" /> Đề vừa xuất
                                </span>
                              )}

                              {/* Status Pill: Riêng tư vs Cộng đồng */}
                              {item.visibility === 'public' ? (
                                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 shadow-2xs">
                                  <Globe className="w-3 h-3 text-emerald-600" /> Cộng đồng
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 shadow-2xs" title="Đề thi bảo mật, chỉ mình thầy cô thấy">
                                  <Lock className="w-3 h-3 text-amber-600" /> Riêng tư
                                </span>
                              )}

                              {item.isExternalUpload && (
                                <span className="px-2.5 py-0.5 bg-teal-50 text-teal-800 border border-teal-300 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 shadow-2xs" title={item.source || 'Đề tải lên từ nguồn khác'}>
                                  <Upload className="w-3 h-3 text-teal-600" /> Nguồn bên ngoài
                                </span>
                              )}

                              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                                {item.title}
                              </h3>
                              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-lg text-[11px] font-black uppercase tracking-wide">
                                Môn: {item.subject}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-400">
                              Ngày lưu: {new Date(item.createdAt).toLocaleDateString('vi-VN')} {new Date(item.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                              {item.author && <span className="ml-1 text-slate-500 font-medium">• Tác giả: {item.author}</span>}
                            </p>
                          </div>

                          {/* Thông tin Khối, Thời gian, Số câu hỏi, Mã đề */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold">
                              {item.grade.includes('Khối') ? item.grade : `Khối ${item.grade}`}
                            </span>

                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {item.duration} phút
                            </span>
                            <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-lg text-[10px] font-bold">
                              {item.questionsCount} câu hỏi
                            </span>
                          </div>

                          {/* KHU VỰC GẠCH ĐỎ PHÍA DƯỚI: HIỂN THỊ CÁC LỚP ĐÃ THAM GIA THI & KẾT QUẢ TỪNG LỚP */}
                          <div className="pt-2 pb-1 border-t border-slate-100">
                            <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase tracking-wide mb-2">
                              <GraduationCap className="w-4 h-4 text-emerald-600" />
                              <span>Các lớp đã thi đề này ({(item.sessions || []).length}):</span>
                            </div>

                            {(!item.sessions || item.sessions.length === 0) ? (
                              <div className="p-3 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200 text-center">
                                <p className="text-xs text-slate-500 font-medium">Chưa có lớp nào tham gia thi đề này. Bấm nút <strong>"Mở thêm lớp"</strong> ở dưới để bắt đầu.</p>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {item.sessions.map((sess, sIdx) => {
                                  const submittedCount = sess.students.filter(s => s.status === 'submitted').length;
                                  const totalCount = sess.students.length;
                                  const scores = sess.students.filter(s => s.status === 'submitted' && typeof s.score === 'number').map(s => s.score as number);
                                  const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : null;
                                  const isLiveRoom = roomCode === sess.roomCode && roomStatus !== 'ended';

                                  return (
                                    <div
                                      key={sess.id ? `sess_${item.id}_${sess.id}_${sIdx}` : `sess_${item.id}_${sIdx}`}
                                      onClick={() => handleViewClassResult(item, sess)}
                                      className="p-3 rounded-2xl border border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/30 transition-all cursor-pointer group shadow-2xs space-y-1.5 relative"
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="font-black text-slate-900 text-sm group-hover:text-emerald-700 flex items-center gap-1.5">
                                          <Users className="w-3.5 h-3.5 text-emerald-600" />
                                          Lớp {sess.className}
                                        </span>
                                        {isLiveRoom ? (
                                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 animate-pulse">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Đang thi
                                          </span>
                                        ) : (
                                          <span className="text-[10px] text-slate-400 font-mono">
                                            PIN: {sess.roomCode}
                                          </span>
                                        )}
                                      </div>

                                      <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500 font-medium">
                                          {submittedCount}/{totalCount} HS nộp bài
                                        </span>
                                        {avgScore !== null ? (
                                          <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                                            ĐTB: {avgScore}
                                          </span>
                                        ) : (
                                          <span className="text-slate-400 text-[11px] italic">Chưa nộp bài</span>
                                        )}
                                      </div>

                                      <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[11px]">
                                        <span className="text-slate-400">
                                          {new Date(sess.createdAt).toLocaleDateString('vi-VN')} {new Date(sess.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <span className="text-emerald-700 font-bold group-hover:underline flex items-center gap-0.5">
                                          Xem kết quả thi →
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {/* Nút Chuyển quyền riêng tư (chỉ hiện khi là chủ sở hữu đề) */}
                          {(!item.ownerId || item.ownerId === teacherAccount.id) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRequestToggleVisibility(item);
                              }}
                              className={`p-2 rounded-xl transition-colors ${
                                item.visibility === 'public'
                                  ? 'text-emerald-700 hover:text-amber-700 hover:bg-amber-50'
                                  : 'text-slate-400 hover:text-emerald-700 hover:bg-emerald-50'
                              }`}
                              title={item.visibility === 'public' ? 'Đang công khai. Bấm để chuyển về Chế độ riêng tư' : 'Đang riêng tư. Bấm để chia sẻ lên Thư viện cộng đồng'}
                            >
                              {item.visibility === 'public' ? <Globe className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                            </button>
                          )}

                          {/* Nút Xóa đề: Chỉ tài khoản sở hữu đề mới được xóa */}
                          {(!item.ownerId || item.ownerId === teacherAccount.id) ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteLibraryExam(item.id);
                              }}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                              title="Xóa đề khỏi thư viện"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <span 
                              className="p-2 text-slate-300 cursor-not-allowed" 
                              title="Đề do giáo viên khác chia sẻ (không thể xóa)"
                            >
                              <Lock className="w-4 h-4" />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons: Xem lại đề & Mở thêm lớp */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setSelectedPreviewCode('goc');
                            setPreviewingLibraryExam(item);
                          }}
                          className="flex-1 py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs border border-slate-200 flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-600" />
                          <span>Xem lại đề</span>
                        </button>

                        {/* Nút Chia sẻ / Về riêng tư (chỉ chủ sở hữu đề) */}
                        {(!item.ownerId || item.ownerId === teacherAccount.id) && (
                          <button
                            onClick={() => handleRequestToggleVisibility(item)}
                            className={`py-2.5 px-3 rounded-xl font-bold text-xs border flex items-center justify-center gap-1.5 transition-colors shadow-xs ${
                              item.visibility === 'public'
                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                            title={item.visibility === 'public' ? 'Chuyển về kho riêng tư (Chỉ mình tôi)' : 'Chia sẻ lên cộng đồng giáo viên'}
                          >
                            {item.visibility === 'public' ? (
                              <>
                                <Lock className="w-3.5 h-3.5 text-amber-600" />
                                <span>Về riêng tư</span>
                              </>
                            ) : (
                              <>
                                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Chia sẻ</span>
                              </>
                            )}
                          </button>
                        )}

                        {/* Nút nhân bản khi ở kho cộng đồng */}
                        {libraryTabScope === 'public' && (
                          <button
                            onClick={() => handleCloneToPrivate(item)}
                            className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                            title="Nhân bản đề này về Kho riêng tư của tôi"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Lưu về kho tôi</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenNewClassModal(item)}
                          className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Mở thêm lớp</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 1: PHÒNG THI & ĐIỂM DANH */}
        {teacherTab === 'room' && (
          <div className="space-y-6">
            {/* Room Header Hero */}
            <div className="bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 rounded-[32px] p-6 md:p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-black uppercase flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" /> PHÒNG THI ONLINE
                    </span>
                    <span className="px-3 py-1 bg-white/10 text-white rounded-full text-xs font-black">
                      MÃ PHÒNG (PIN): <strong className="text-emerald-300 font-mono text-base">{roomCode}</strong>
                    </span>
                    <span className="px-3 py-1 bg-emerald-400/10 text-emerald-200 rounded-full text-xs font-bold">
                      {roomStatus === 'started' ? '● Đang làm bài' : roomStatus === 'ended' ? '■ Đã thu bài' : '○ Chờ học sinh điểm danh'}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tight">
                    {activeExam?.title || 'ĐỀ THI TRỰC TUYẾN'}
                  </h1>
                  <p className="text-xs text-slate-300">
                    Môn: <strong>{activeExam?.subject}</strong> • Khối: <strong>{activeExam?.grade}</strong> • Thời gian: <strong>{durationMinutes} phút</strong>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  {roomStatus === 'lobby' && (
                    <button
                      onClick={() => {
                        const item = examLibrary.find(e => e.id === activeExamLibraryId) || {
                          id: 'active_exam',
                          title: activeExam?.title || 'Đề thi trực tuyến',
                          subject: activeExam?.subject || '',
                          grade: activeExam?.grade || '',
                          duration: durationMinutes,
                          questionsCount: activeExam?.questions?.length || 0,
                          examData: activeExam!,
                          createdAt: Date.now(),
                          config: antiCheatSettings
                        };
                        setSelectedPreviewCode('goc');
                        setEditingQuestionIdx(null);
                        setEditingQuestionDraft(null);
                        setPreviewingLibraryExam(item);
                      }}
                      className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-xs uppercase flex items-center gap-2 backdrop-blur-sm shadow-sm"
                      title="Xem lại và chỉnh sửa nội dung câu hỏi trước khi phát đề"
                    >
                      <Eye className="w-4 h-4 text-emerald-300" />
                      <span>Xem & Sửa đề thi</span>
                    </button>
                  )}

                  <button
                    onClick={() => setShowProjectorModal(true)}
                    className="px-5 py-3 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black text-xs uppercase flex items-center gap-2 shadow-lg"
                  >
                    <QrCode className="w-4 h-4 text-emerald-700" />
                    <span>Chiếu mã QR lớp học</span>
                  </button>

                  <button
                    onClick={copyStudentLink}
                    className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-xs uppercase flex items-center gap-2 backdrop-blur-sm"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Đã sao chép link' : 'Copy link thi'}</span>
                  </button>

                  {roomStatus !== 'ended' && (
                    <button
                      onClick={() => {
                        setRole('student');
                        setIsTeacherGuidanceMode(true);
                      }}
                      className="px-4 py-3 bg-white/15 hover:bg-white/25 text-white border border-white/25 rounded-2xl font-black text-xs uppercase flex items-center gap-2 backdrop-blur-sm shadow-sm transition-all cursor-pointer active:scale-95"
                      title="Chuyển sang màn hình thi để giáo viên chiếu bảng hướng dẫn học sinh cách vào phòng thi"
                    >
                      <GraduationCap className="w-4 h-4 text-emerald-300" />
                      <span>Hướng dẫn HS vào phòng</span>
                    </button>
                  )}

                  {roomStatus === 'lobby' ? (
                    <button
                      onClick={handleTeacherStart}
                      className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl font-black text-xs uppercase flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Phát đề & Bắt đầu thi</span>
                    </button>
                  ) : roomStatus === 'started' ? (
                    <button
                      onClick={handleTeacherStop}
                      className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-xs uppercase flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Thu bài & Kết thúc</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setTeacherTab('report')}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>Xem Bảng điểm ({students.filter(s => s.status === 'submitted').length} bài)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Live Counters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Đã vào phòng</span>
                <span className="text-3xl font-black text-slate-900">{students.length}</span>
                <span className="text-[10px] text-slate-400 block">học sinh</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Đang làm bài</span>
                <span className="text-3xl font-black text-emerald-600">{students.filter(s => s.status === 'in_progress').length}</span>
                <span className="text-[10px] text-slate-400 block">học sinh</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Đã nộp bài</span>
                <span className="text-3xl font-black text-blue-600">{students.filter(s => s.status === 'submitted').length}</span>
                <span className="text-[10px] text-slate-400 block">học sinh</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Cảnh báo gian lận</span>
                <span className={`text-3xl font-black ${students.filter(s => s.violations > 0).length ? 'text-rose-600' : 'text-slate-400'}`}>
                  {students.filter(s => s.violations > 0).length}
                </span>
                <span className="text-[10px] text-slate-400 block">rời tab</span>
              </div>
            </div>

            {/* Active Class & Exam Info Banner */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
                  <GraduationCap className="w-5 h-5" />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-black text-slate-900 text-sm">
                      {activeSessionClassName ? `Lớp kiểm tra: ${activeSessionClassName}` : 'Phòng thi trực tuyến'}
                    </h3>
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px] border border-emerald-200">
                      Mã PIN: {roomCode}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      roomStatus === 'started' ? 'bg-emerald-500 text-white animate-pulse' :
                      roomStatus === 'ended' ? 'bg-slate-200 text-slate-700' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {roomStatus === 'started' ? 'Đang làm bài' : roomStatus === 'ended' ? 'Đã thu bài' : 'Chờ mở đề'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    Đề: <strong>{activeExam?.title || 'Chưa chọn đề'}</strong> ({students.length} học sinh đã vào phòng, {students.filter(s => s.status === 'submitted').length} đã nộp bài)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {roomStatus !== 'ended' && (
                  <button
                    onClick={() => {
                      setRole('student');
                      setIsTeacherGuidanceMode(true);
                    }}
                    className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs border border-emerald-200 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Chuyển sang màn hình thi để giáo viên hướng dẫn học sinh vào phòng thi"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Hướng dẫn HS vào phòng</span>
                  </button>
                )}
                {roomStatus === 'ended' && (
                  <button
                    onClick={() => setTeacherTab('report')}
                    className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs border border-emerald-200 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Báo cáo & Bảng điểm</span>
                  </button>
                )}
                <button
                  onClick={() => setTeacherTab('library')}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs border border-slate-200 shadow-2xs flex items-center gap-1.5 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Về Thư viện đề</span>
                </button>
              </div>
            </div>

            <div className="relative max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tìm học sinh theo tên, lớp..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-900"
              />
            </div>

            {students.length === 0 ? (
              <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center space-y-3">
                <Users className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800">Chưa có học sinh nào vào phòng thi</h3>
                <p className="text-xs text-slate-500">Bấm "Chiếu mã QR lớp học" để học sinh quét vào thi, hoặc "+ Thêm 5 thí sinh mẫu".</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                      <th className="py-3 px-4">STT</th>
                      <th className="py-3 px-4">Họ và tên</th>
                      <th className="py-3 px-4">Lớp</th>
                      <th className="py-3 px-4">SBD</th>
                      <th className="py-3 px-4">Mã đề</th>
                      <th className="py-3 px-4">Tiến độ câu</th>
                      <th className="py-3 px-4">Giám sát vi phạm</th>
                      <th className="py-3 px-4">Kết quả</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filtered.map((s, idx) => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                        <td className="py-3 px-4 text-slate-600">{s.className}</td>
                        <td className="py-3 px-4 text-slate-500 font-mono">{s.studentId || '-'}</td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-700">{s.code}</td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-800">{s.answeredCount}</span>
                          <span className="text-slate-400">/{s.totalQuestions || activeExam?.questions?.length || 0}</span>
                        </td>
                        <td className="py-3 px-4">
                          {s.violations > 0 ? (
                            <span className="px-2.5 py-0.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-full font-bold flex items-center gap-1 w-fit">
                              <AlertTriangle className="w-3 h-3 text-rose-600" /> {s.violations} lần rời tab
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Bình thường
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-bold">
                          {s.status === 'submitted' ? (
                            <span className="text-emerald-600">{s.score} đ ({s.rating})</span>
                          ) : s.status === 'suspended' ? (
                            <span className="text-rose-600">Đình chỉ</span>
                          ) : (
                            <span className="text-slate-500">Đang thi...</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BÁO CÁO KẾT QUẢ & XUẤT ĐIỂM */}
        {teacherTab === 'report' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase">Bảng điểm tổng hợp</h3>
                <p className="text-xs text-slate-500">
                  {activeSessionClassName ? `Kết quả của Lớp ${activeSessionClassName} (${students.length} học sinh)` : 'Kết quả đánh giá theo chuẩn khảo thí GDPT 2018.'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleExportCSV}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" /> Xuất file Excel / CSV
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> In bảng điểm
                </button>
              </div>
            </div>

            {/* Quick Class Selector in Report Tab */}
            {examLibrary.some(e => (e.sessions || []).length > 0) && (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" /> Bảng điểm các lớp đã thi:
                </span>
                {examLibrary.flatMap(e => (e.sessions || []).map(sess => ({ exam: e, session: sess }))).map(({ exam, session }, sIdx) => (
                  <button
                    key={`${exam.id}_${session.id}_${sIdx}`}
                    onClick={() => handleViewClassResult(exam, session)}
                    className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 rounded-xl border border-slate-200 hover:border-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all"
                  >
                    <span>Lớp {session.className}</span>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                      {session.students.filter(s => s.status === 'submitted').length}/{session.students.length} nộp
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                    <th className="py-3 px-4">STT</th>
                    <th className="py-3 px-4">Họ và tên</th>
                    <th className="py-3 px-4">Lớp</th>
                    <th className="py-3 px-4">Mã đề</th>
                    <th className="py-3 px-4">Điểm số</th>
                    <th className="py-3 px-4">Xếp loại</th>
                    <th className="py-3 px-4">Vi phạm rời tab</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {students.map((s, idx) => (
                    <tr key={s.id}>
                      <td className="py-3 px-4 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                      <td className="py-3 px-4 text-slate-600">{s.className}</td>
                      <td className="py-3 px-4 font-mono">{s.code}</td>
                      <td className="py-3 px-4 font-black text-emerald-600">{s.score !== undefined ? `${s.score} đ` : '-'}</td>
                      <td className="py-3 px-4">{s.rating || 'Chưa nộp'}</td>
                      <td className="py-3 px-4 font-bold">{s.violations > 0 ? `${s.violations} lần` : '0'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CÀI ĐẶT CHỐNG GIAN LẬN */}
        {teacherTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm max-w-2xl space-y-4">
            <h3 className="font-black text-slate-900 uppercase flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-600" /> Cấu hình giám sát phòng thi trực tuyến (Đề đang mở)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Các thiết lập này áp dụng cho phòng thi hiện tại (#{roomCode}) và tự động đồng bộ tới thiết bị của học sinh.
            </p>

            <div className="space-y-3 pt-2">
              {/* 1. Trộn đề */}
              <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">1. 🔀 Cho phép trộn đề tự động</span>
                  <span className="text-[11px] text-slate-500 block">Tự động đảo thứ tự câu hỏi và hoán vị đáp án cho từng học sinh khi vào thi</span>
                </div>
                <input
                  type="checkbox"
                  checked={antiCheatSettings.allowShuffleCodes}
                  onChange={e => setAntiCheatSettings(prev => ({ ...prev, allowShuffleCodes: e.target.checked }))}
                  className="w-4 h-4 rounded text-emerald-600"
                />
              </label>

              {/* 2. Toàn màn hình */}
              <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">2. 🖥️ Bắt buộc chế độ toàn màn hình</span>
                  <span className="text-[11px] text-slate-500 block">Yêu cầu học sinh mở toàn màn hình (Fullscreen) để làm bài</span>
                </div>
                <input
                  type="checkbox"
                  checked={antiCheatSettings.requireFullscreen}
                  onChange={e => setAntiCheatSettings(prev => ({ ...prev, requireFullscreen: e.target.checked }))}
                  className="w-4 h-4 rounded text-emerald-600"
                />
              </label>

              {/* 3. Phát hiện rời tab */}
              <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">3. 📑 Phát hiện chuyển Tab / mở ứng dụng khác</span>
                  <span className="text-[11px] text-slate-500 block">Cảnh báo và đếm số lần học sinh rời màn hình làm bài</span>
                </div>
                <input
                  type="checkbox"
                  checked={antiCheatSettings.detectTabSwitch}
                  onChange={e => setAntiCheatSettings(prev => ({ ...prev, detectTabSwitch: e.target.checked }))}
                  className="w-4 h-4 rounded text-emerald-600"
                />
              </label>

              {/* 4. Vi phạm tối đa */}
              <div className="p-3.5 bg-rose-50/50 rounded-2xl border border-rose-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-rose-900 block">4. 🚫 Giới hạn vi phạm tối đa (Tự Động Thu Bài Cưỡng Chế)</span>
                  <span className="text-[11px] text-slate-600 block">Khi vi phạm quá số lần này, hệ thống sẽ tự động thu bài và đình chỉ</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={antiCheatSettings.maxViolations}
                    onChange={e => setAntiCheatSettings(prev => ({ ...prev, maxViolations: Math.min(10, Math.max(1, parseInt(e.target.value) || 3)) }))}
                    className="w-14 px-2 py-1 bg-white border border-rose-300 rounded-lg text-center font-black text-rose-900 text-xs"
                  />
                  <span className="text-xs font-bold text-rose-800">lần</span>
                </div>
              </div>

              {/* 5. Chặn F12 / Copy */}
              <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">5. 🔒 Vô hiệu hóa chuột phải, bôi đen sao chép & F12</span>
                  <span className="text-[11px] text-slate-500 block">Chặn thao tác chuột phải, bôi đen copy và phím tắt xem mã nguồn</span>
                </div>
                <input
                  type="checkbox"
                  checked={antiCheatSettings.preventCopyInspect}
                  onChange={e => setAntiCheatSettings(prev => ({ ...prev, preventCopyInspect: e.target.checked }))}
                  className="w-4 h-4 rounded text-emerald-600"
                />
              </label>

              {/* 6. Xem giải sau nộp */}
              <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">6. 📝 Xem điểm số & lời giải chi tiết ngay sau khi nộp</span>
                  <span className="text-[11px] text-slate-500 block">Cho phép học sinh xem đáp án và giải thích ngay khi bấm nộp bài</span>
                </div>
                <input
                  type="checkbox"
                  checked={antiCheatSettings.showSolutionsAfterSubmit}
                  onChange={e => setAntiCheatSettings(prev => ({ ...prev, showSolutionsAfterSubmit: e.target.checked }))}
                  className="w-4 h-4 rounded text-emerald-600"
                />
              </label>

              {/* 7. Nộp sau số phút */}
              <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">7. ⏱️ Thời gian tối thiểu trước khi được nộp bài</span>
                  <span className="text-[11px] text-slate-500 block">Số phút tối thiểu học sinh phải làm bài trước khi nộp bài</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    max={durationMinutes}
                    value={antiCheatSettings.minSubmitMinutes}
                    onChange={e => setAntiCheatSettings(prev => ({ ...prev, minSubmitMinutes: Math.max(0, parseInt(e.target.value) || 0) }))}
                    className="w-14 px-2 py-1 bg-white border border-slate-300 rounded-lg text-center font-bold text-xs"
                  />
                  <span className="text-xs font-bold text-slate-500">phút</span>
                </div>
              </div>

              {/* 8. Số lần làm bài */}
              <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">8. 🔄 Số lần học sinh được phép làm bài</span>
                  <span className="text-[11px] text-slate-500 block">Giới hạn số lần nộp bài cho mỗi học sinh</span>
                </div>
                <select
                  value={antiCheatSettings.maxAttempts}
                  onChange={e => setAntiCheatSettings(prev => ({ ...prev, maxAttempts: parseInt(e.target.value) || 1 }))}
                  className="h-8 px-2 bg-white border border-slate-300 rounded-lg font-bold text-xs"
                >
                  <option value="1">1 lần</option>
                  <option value="2">2 lần</option>
                  <option value="999">Không giới hạn</option>
                </select>
              </div>

              {/* 9. Mật mã bảo vệ quyền giáo viên (Teacher Security PIN) */}
              <div className="p-4 bg-emerald-50/70 rounded-2xl border-2 border-emerald-200 space-y-2.5">
                <div>
                  <span className="text-xs font-black text-emerald-950 uppercase flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-emerald-700" /> 9. Mật mã bảo vệ Giáo viên (Teacher Security PIN)
                  </span>
                  <span className="text-[11px] text-slate-600 block mt-0.5">
                    Khóa giao diện học sinh: Học sinh không thể tự ý thoát ra xem đề gốc, ma trận hoặc đáp án nếu không có mật mã này.
                  </span>
                </div>
                <form onSubmit={handleUpdateSecurityPin} className="flex flex-wrap items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newSecurityPinInput}
                    onChange={e => setNewSecurityPinInput(e.target.value)}
                    placeholder={`Mật mã hiện tại: ${teacherSecurityPin}`}
                    className="flex-1 min-w-[170px] px-3.5 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-sm cursor-pointer"
                  >
                    Đổi mật mã
                  </button>
                  {pinChangeSuccess && (
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                      <Check className="w-4 h-4 text-emerald-600" /> Đã cập nhật mật mã mới!
                    </span>
                  )}
                  {pinChangeError && (
                    <span className="text-xs font-bold text-rose-600 block w-full mt-1">
                      {pinChangeError}
                    </span>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}

        {/* MODAL MÁY CHIẾU QR CODE */}
        {showProjectorModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
            <div className="bg-white rounded-[36px] max-w-xl w-full p-8 text-center shadow-2xl relative border space-y-6">
              <button 
                onClick={() => setShowProjectorModal(false)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black uppercase">
                  HỌC SINH QUÉT MÃ QR ĐỂ VÀO PHÒNG THI
                </span>
                <h2 className="text-2xl font-black uppercase text-slate-900 pt-2">{activeExam?.title}</h2>
                <p className="text-xs text-slate-500">Môn {activeExam?.subject} • Thời gian: {durationMinutes} phút</p>
              </div>

              {qrCodeDataUrl && (
                <div className="flex justify-center">
                  <div className="p-4 bg-white rounded-3xl border-4 border-emerald-600 shadow-2xl">
                    <img src={qrCodeDataUrl} alt="QR Code" className="w-64 h-64 object-contain" />
                  </div>
                </div>
              )}

              <div className="p-4 bg-slate-50 rounded-2xl space-y-3 border border-slate-200 text-left">
                <div className="text-center space-y-1">
                  <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wider block">
                    CÁCH 1: NHẬP MÃ PHÒNG (PIN) TRỰC TIẾP — GIỐNG QUIZIZZ / KAHOOT
                  </span>
                  <div className="inline-block px-6 py-2 bg-emerald-50 rounded-2xl border-2 border-emerald-400 my-1 shadow-sm">
                    <span className="font-mono text-4xl sm:text-5xl font-black text-emerald-700 tracking-widest block">
                      {roomCode}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    Học sinh truy cập trang làm bài riêng hoặc quét mã QR ➔ Nhập mã phòng 6 số trên để vào thi.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    CÁCH 2: DÙNG ĐƯỜNG LINK TRỰC TIẾP
                  </span>
                  <p className="text-[11px] text-slate-600 break-all bg-white p-2 rounded-xl border font-mono">
                    {studentUrl}
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={copyStudentLink}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedLink ? 'Đã sao chép link' : 'Sao chép link'}</span>
                    </button>
                    <a
                      href={studentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <ExternalLink className="w-4 h-4" /> Mở tab thi thử ngay
                    </a>
                  </div>
                </div>
              </div>

              <div className="text-xs font-bold text-slate-600">
                Đã có <strong className="text-emerald-700 text-base">{students.length}</strong> học sinh điểm danh vào phòng
              </div>
            </div>
          </div>
        )}

        {/* MODAL 1: XEM LẠI ĐỀ TRƯỚC KHI PHÁT ĐỀ */}
        {previewingLibraryExam && (() => {
          const currentExamData = selectedPreviewCode === 'goc' 
            ? previewingLibraryExam.examData 
            : (previewingLibraryExam.allShuffledExams?.find(e => e.code === selectedPreviewCode) || previewingLibraryExam.examData);
          const questions = currentExamData.questions || [];

          return (
            <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
              <div className="bg-white rounded-[32px] max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50">
                  <div className="space-y-1">
                    <h2 className="text-xl font-black text-slate-900 uppercase">
                      {previewingLibraryExam.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-black uppercase">
                        Môn: {previewingLibraryExam.subject}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold">
                        {previewingLibraryExam.grade}
                      </span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-lg text-[10px] font-bold">
                        {previewingLibraryExam.duration} phút
                      </span>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-lg text-[10px] font-bold">
                        {questions.length} câu hỏi
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setPreviewingLibraryExam(null);
                      setEditingQuestionIdx(null);
                      setEditingQuestionDraft(null);
                    }}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Shuffled Code Switcher */}
                {previewingLibraryExam.allShuffledExams && previewingLibraryExam.allShuffledExams.length > 0 && (
                  <div className="px-6 py-3 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Xem theo mã đề:</span>
                    <button
                      onClick={() => {
                        setSelectedPreviewCode('goc');
                        setEditingQuestionIdx(null);
                        setEditingQuestionDraft(null);
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                        selectedPreviewCode === 'goc' 
                          ? 'bg-slate-900 text-white shadow-sm' 
                          : 'bg-white text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Đề gốc
                    </button>
                    {previewingLibraryExam.allShuffledExams.map((ex, exIdx) => (
                      <button
                        key={ex.code ? `shuf_${ex.code}` : `shuf_idx_${exIdx}`}
                        onClick={() => {
                          setSelectedPreviewCode(ex.code);
                          setEditingQuestionIdx(null);
                          setEditingQuestionDraft(null);
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-mono font-black transition-all ${
                          selectedPreviewCode === ex.code 
                            ? 'bg-emerald-600 text-white shadow-sm' 
                            : 'bg-white text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Mã {ex.code}
                      </button>
                    ))}
                  </div>
                )}

                {/* Questions Body */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                  {questions.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-xs">Không có dữ liệu câu hỏi trong đề này.</div>
                  ) : (
                    questions.map((q, qIdx) => (
                      editingQuestionIdx === qIdx && editingQuestionDraft ? (
                        <div key={q.id ? `edit_q_${q.id}_${qIdx}` : `edit_q_${qIdx}`} className="p-5 bg-white rounded-2xl border-2 border-emerald-500 shadow-xl space-y-4 animate-in fade-in">
                          {/* Header of Editor */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-black uppercase flex items-center gap-1.5 shadow-2xs">
                                <Edit3 className="w-3.5 h-3.5" /> Sửa câu hỏi {qIdx + 1}
                              </span>
                              <span className="text-xs font-bold text-slate-500">
                                {editingQuestionDraft.type === 'MCQ' ? 'Trắc nghiệm 4 lựa chọn' : editingQuestionDraft.type === 'TF' ? 'Đúng / Sai' : editingQuestionDraft.type === 'SA' ? 'Trả lời ngắn' : 'Tự luận'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                              <label className="text-xs font-bold text-slate-600">Điểm:</label>
                              <input
                                type="number"
                                step="0.25"
                                min="0"
                                max="10"
                                value={editingQuestionDraft.points ?? 0.25}
                                onChange={(e) => setEditingQuestionDraft({ ...editingQuestionDraft, points: parseFloat(e.target.value) || 0 })}
                                className="w-16 px-2 py-0.5 text-xs font-black text-emerald-800 bg-white border border-slate-300 rounded-md text-center focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                              />
                            </div>
                          </div>

                          {/* Content Textarea */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-black text-slate-700 uppercase tracking-tight">Nội dung câu hỏi:</label>
                              <span className="text-[11px] text-slate-400 italic">Hỗ trợ gõ công thức Toán học $...$</span>
                            </div>
                            <textarea
                              value={editingQuestionDraft.content || ''}
                              onChange={(e) => setEditingQuestionDraft({ ...editingQuestionDraft, content: e.target.value })}
                              rows={3}
                              className="w-full p-3 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden resize-y"
                              placeholder="Nhập nội dung câu hỏi..."
                            />
                            {editingQuestionDraft.content && (
                              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                                <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Hiển thị trước công thức:</span>
                                <MathRenderer content={editingQuestionDraft.content} />
                              </div>
                            )}
                          </div>

                          {/* MCQ Options */}
                          {editingQuestionDraft.type === 'MCQ' && (
                            <div className="space-y-2 pt-1">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-black text-slate-700 uppercase tracking-tight">Các phương án trả lời:</label>
                                <span className="text-[11px] text-emerald-700 font-bold">Bấm vào chữ cái để chọn đáp án ĐÚNG</span>
                              </div>
                              <div className="space-y-2">
                                {(editingQuestionDraft.options || []).map((opt, oIdx) => (
                                  <div 
                                    key={opt.id || oIdx} 
                                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                                      opt.isCorrect 
                                        ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-400' 
                                        : 'bg-white border-slate-200'
                                    }`}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newOpts = (editingQuestionDraft.options || []).map((o, idx) => ({
                                          ...o,
                                          isCorrect: idx === oIdx
                                        }));
                                        setEditingQuestionDraft({ ...editingQuestionDraft, options: newOpts });
                                      }}
                                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 transition-colors ${
                                        opt.isCorrect ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                      }`}
                                      title="Bấm để đánh dấu đây là đáp án ĐÚNG"
                                    >
                                      {opt.id || String.fromCharCode(65 + oIdx)}
                                    </button>
                                    <input
                                      type="text"
                                      value={opt.text}
                                      onChange={(e) => {
                                        const newOpts = [...(editingQuestionDraft.options || [])];
                                        newOpts[oIdx] = { ...opt, text: e.target.value };
                                        setEditingQuestionDraft({ ...editingQuestionDraft, options: newOpts });
                                      }}
                                      className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:border-emerald-500 focus:outline-hidden"
                                      placeholder={`Nội dung lựa chọn ${opt.id}...`}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newOpts = (editingQuestionDraft.options || []).map((o, idx) => ({
                                          ...o,
                                          isCorrect: idx === oIdx
                                        }));
                                        setEditingQuestionDraft({ ...editingQuestionDraft, options: newOpts });
                                      }}
                                      className={`px-2 py-1 rounded-md text-[10px] font-black uppercase transition-colors shrink-0 ${
                                        opt.isCorrect 
                                          ? 'bg-emerald-600 text-white' 
                                          : 'bg-slate-100 text-slate-500 hover:bg-emerald-100 hover:text-emerald-700'
                                      }`}
                                    >
                                      {opt.isCorrect ? '✓ Đúng' : 'Đặt là Đúng'}
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* TF Sub-questions */}
                          {editingQuestionDraft.type === 'TF' && (
                            <div className="space-y-2 pt-1">
                              <label className="text-xs font-black text-slate-700 uppercase tracking-tight">Các mệnh đề Đúng / Sai:</label>
                              <div className="space-y-2">
                                {(editingQuestionDraft.tfSubQuestions || []).map((sub, sIdx) => {
                                  const letter = String.fromCharCode(97 + sIdx);
                                  return (
                                    <div key={sIdx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5">
                                      <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                                        {letter}
                                      </span>
                                      <input
                                        type="text"
                                        value={sub.text}
                                        onChange={(e) => {
                                          const newSubs = [...(editingQuestionDraft.tfSubQuestions || [])];
                                          newSubs[sIdx] = { ...sub, text: e.target.value };
                                          setEditingQuestionDraft({ ...editingQuestionDraft, tfSubQuestions: newSubs });
                                        }}
                                        className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium bg-white focus:border-emerald-500 focus:outline-hidden"
                                        placeholder={`Mệnh đề (${letter})...`}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newSubs = [...(editingQuestionDraft.tfSubQuestions || [])];
                                          newSubs[sIdx] = { ...sub, isCorrect: !sub.isCorrect };
                                          setEditingQuestionDraft({ ...editingQuestionDraft, tfSubQuestions: newSubs });
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-black shrink-0 transition-colors ${
                                          sub.isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                                        }`}
                                      >
                                        {sub.isCorrect ? 'ĐÚNG' : 'SAI'}
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* SA Sub-questions */}
                          {editingQuestionDraft.type === 'SA' && (
                            <div className="space-y-2 pt-1">
                              <label className="text-xs font-black text-slate-700 uppercase tracking-tight">Ý hỏi và Đáp án ngắn:</label>
                              <div className="space-y-2">
                                {(editingQuestionDraft.saSubQuestions || []).map((sub, sIdx) => {
                                  const letter = String.fromCharCode(97 + sIdx);
                                  return (
                                    <div key={sIdx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                                      <div className="flex items-center gap-2 flex-1">
                                        <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                                          {letter}
                                        </span>
                                        <input
                                          type="text"
                                          value={sub.text}
                                          onChange={(e) => {
                                            const newSubs = [...(editingQuestionDraft.saSubQuestions || [])];
                                            newSubs[sIdx] = { ...sub, text: e.target.value };
                                            setEditingQuestionDraft({ ...editingQuestionDraft, saSubQuestions: newSubs });
                                          }}
                                          className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium bg-white focus:border-emerald-500 focus:outline-hidden"
                                          placeholder="Nội dung ý hỏi..."
                                        />
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-600 shrink-0">Đáp án:</span>
                                        <input
                                          type="text"
                                          value={sub.answer}
                                          onChange={(e) => {
                                            const newSubs = [...(editingQuestionDraft.saSubQuestions || [])];
                                            newSubs[sIdx] = { ...sub, answer: e.target.value };
                                            setEditingQuestionDraft({ ...editingQuestionDraft, saSubQuestions: newSubs });
                                          }}
                                          className="w-32 px-3 py-1.5 border border-emerald-300 bg-emerald-50 rounded-lg text-xs font-bold text-emerald-900 focus:border-emerald-500 focus:outline-hidden"
                                          placeholder="Đáp số..."
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Solution / Explanation */}
                          <div className="space-y-1.5 pt-1">
                            <label className="text-xs font-bold text-amber-800">Lời giải chi tiết & hướng dẫn chấm:</label>
                            <textarea
                              value={editingQuestionDraft.solution || (editingQuestionDraft as any).explanation || ''}
                              onChange={(e) => setEditingQuestionDraft({ ...editingQuestionDraft, solution: e.target.value })}
                              rows={2}
                              className="w-full p-2.5 border border-amber-300 bg-amber-50/50 rounded-xl text-xs font-medium text-amber-950 focus:border-amber-500 focus:outline-hidden resize-y"
                              placeholder="Nhập lời giải hoặc hướng dẫn giải chi tiết..."
                            />
                          </div>

                          {/* Footer Buttons */}
                          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={handleCancelQuestionEdit}
                              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
                            >
                              <X className="w-4 h-4" />
                              <span>Hủy bỏ</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleSaveQuestionEdit}
                              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all"
                            >
                              <Check className="w-4 h-4" />
                              <span>Lưu câu hỏi</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div key={q.id ? `view_q_${q.id}_${qIdx}` : `view_q_${qIdx}`} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 hover:border-slate-300 transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-emerald-800 uppercase flex items-center gap-1.5">
                              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px]">
                                {qIdx + 1}
                              </span>
                              {q.type === 'MCQ' ? 'Trắc nghiệm nhiều lựa chọn' : q.type === 'TF' ? 'Đúng / Sai' : q.type === 'SA' ? 'Trả lời ngắn' : 'Tự luận'}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border">
                                {q.points || 0.25} điểm
                              </span>
                              <button
                                onClick={() => handleStartEditQuestion(q, qIdx)}
                                className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
                                title={`Chỉnh sửa nội dung câu hỏi số ${qIdx + 1}`}
                              >
                                <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Sửa</span>
                              </button>
                            </div>
                          </div>

                          <div className="text-sm font-semibold text-slate-800">
                            <MathRenderer content={q.content || (q as any).text || ''} />
                          </div>

                          {/* MCQ Options */}
                          {q.type === 'MCQ' && q.options && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                              {q.options.map((opt, oIdx) => (
                                <div
                                  key={opt.id ? `prev_opt_${opt.id}_${oIdx}` : `prev_opt_${oIdx}`}
                                  className={`p-2.5 rounded-xl border text-xs font-medium flex items-start gap-2 ${
                                    opt.isCorrect
                                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold ring-1 ring-emerald-400'
                                      : 'bg-white border-slate-200 text-slate-700'
                                  }`}
                                >
                                  <span className={`w-5 h-5 rounded-md flex items-center justify-center font-black text-[10px] shrink-0 ${
                                    opt.isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                                  }`}>
                                    {opt.id}
                                  </span>
                                  <div className="flex-1">
                                    <MathRenderer content={opt.text} />
                                  </div>
                                  {opt.isCorrect && (
                                    <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                                      Đúng ✓
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* TF Sub-questions */}
                          {q.type === 'TF' && q.tfSubQuestions && (
                            <div className="space-y-1.5 pt-1">
                              {q.tfSubQuestions.map((sub, sIdx) => {
                                const letter = String.fromCharCode(97 + sIdx);
                                return (
                                  <div key={sub.id ? `prev_tf_${sub.id}_${sIdx}` : `prev_tf_${sIdx}`} className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                                    <div className="flex items-start gap-2 flex-1">
                                      <span className="font-bold text-slate-900">({letter})</span>
                                      <MathRenderer content={sub.text} />
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                      sub.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                    }`}>
                                      {sub.isCorrect ? 'ĐÚNG' : 'SAI'}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* SA Sub-questions */}
                          {q.type === 'SA' && q.saSubQuestions && (
                            <div className="space-y-1.5 pt-1">
                              {q.saSubQuestions.map((sub, sIdx) => {
                                const letter = String.fromCharCode(97 + sIdx);
                                return (
                                  <div key={sub.id ? `prev_sa_${sub.id}_${sIdx}` : `prev_sa_${sIdx}`} className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                                    <div className="flex items-start gap-2 flex-1">
                                      <span className="font-bold text-slate-900">({letter})</span>
                                      <MathRenderer content={sub.text} />
                                    </div>
                                    <span className="px-2 py-0.5 rounded-md font-bold text-xs bg-emerald-50 text-emerald-800 border border-emerald-200">
                                      Đáp án: {sub.answer}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Explanation */}
                          {(q.solution || (q as any).explanation) && (
                            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                              <span className="font-bold text-[10px] uppercase text-amber-700 block">Lời giải chi tiết:</span>
                              <MathRenderer content={q.solution || (q as any).explanation || ''} />
                            </div>
                          )}
                        </div>
                      )
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      const item = previewingLibraryExam;
                      setPreviewingLibraryExam(null);
                      setEditingQuestionIdx(null);
                      setEditingQuestionDraft(null);
                      setTempConfig({ ...defaultExamConfig, ...(item.config || {}) });
                      setConfiguringLibraryExam(item);
                    }}
                    className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Settings className="w-4 h-4 text-slate-600" />
                    <span>Cài đặt cấu hình đề này</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setPreviewingLibraryExam(null);
                        setEditingQuestionIdx(null);
                        setEditingQuestionDraft(null);
                      }}
                      className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs"
                    >
                      Đóng
                    </button>
                    <button
                      onClick={() => {
                        const item = previewingLibraryExam;
                        setPreviewingLibraryExam(null);
                        setEditingQuestionIdx(null);
                        setEditingQuestionDraft(null);
                        handleLaunchExam(item);
                      }}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Phát đề thi này ngay</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* MODAL 2: CÀI ĐẶT 8 CẤU HÌNH PHÒNG THI CHỐNG GIAN LẬN */}
        {configuringLibraryExam && (
          <div className="fixed inset-0 z-[170] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
            <div className="bg-white rounded-[32px] max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-gradient-to-r from-emerald-900 to-teal-900 text-white">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-black uppercase">
                    <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" /> CẤU HÌNH BẢO MẬT & CHỐNG GIAN LẬN
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-white">
                    Cài đặt cấu hình trước khi phát đề
                  </h2>
                  <p className="text-xs text-emerald-200">
                    Kỳ thi: <strong>{configuringLibraryExam.title}</strong> • Môn: {configuringLibraryExam.subject} ({configuringLibraryExam.grade})
                  </p>
                </div>
                <button
                  onClick={() => setConfiguringLibraryExam(null)}
                  className="p-2 text-white/70 hover:text-white rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form 8 Items */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                
                {/* Tóm tắt nhanh 8 trạng thái cấu hình */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Trạng thái cấu hình giám sát hiện tại:</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px]">
                    <div className={`p-1.5 rounded-lg border text-center font-bold ${tempConfig.allowShuffleCodes ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                      🔀 Trộn đề: {tempConfig.allowShuffleCodes ? 'Bật' : 'Tắt'}
                    </div>
                    <div className={`p-1.5 rounded-lg border text-center font-bold ${tempConfig.requireFullscreen ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                      🖥️ Toàn màn hình: {tempConfig.requireFullscreen ? 'Bắt buộc' : 'Tắt'}
                    </div>
                    <div className={`p-1.5 rounded-lg border text-center font-bold ${tempConfig.detectTabSwitch ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                      📑 Chống rời tab: {tempConfig.detectTabSwitch ? 'Bật' : 'Tắt'}
                    </div>
                    <div className={`p-1.5 rounded-lg border text-center font-bold ${tempConfig.maxViolations ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                      🚫 Tối đa {tempConfig.maxViolations} vi phạm
                    </div>
                    <div className={`p-1.5 rounded-lg border text-center font-bold ${tempConfig.preventCopyInspect ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                      🔒 Chặn F12/Copy: {tempConfig.preventCopyInspect ? 'Bật' : 'Tắt'}
                    </div>
                    <div className={`p-1.5 rounded-lg border text-center font-bold ${tempConfig.showSolutionsAfterSubmit ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                      👁️ Xem giải sau nộp: {tempConfig.showSolutionsAfterSubmit ? 'Bật' : 'Tắt'}
                    </div>
                    <div className={`p-1.5 rounded-lg border text-center font-bold ${tempConfig.minSubmitMinutes ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                      ⏱️ Nộp sau {tempConfig.minSubmitMinutes}p
                    </div>
                    <div className={`p-1.5 rounded-lg border text-center font-bold ${tempConfig.maxAttempts ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                      🔄 Làm {tempConfig.maxAttempts} lần
                    </div>
                  </div>
                </div>

                {/* 1. Nút cho phép trộn đề */}
                <div className="p-4 bg-slate-50 hover:bg-slate-100/70 rounded-2xl border border-slate-200 transition-colors flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🔀</span>
                      <h4 className="font-bold text-xs text-slate-900 uppercase">1. Cho phép trộn đề</h4>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Tự động đảo thứ tự câu hỏi và hoán vị đáp án cho từng học sinh khi vào phòng thi.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={tempConfig.allowShuffleCodes}
                      onChange={e => setTempConfig(prev => ({ ...prev, allowShuffleCodes: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {/* 2. Bắt buộc kích hoạt chế độ toàn màn hình */}
                <div className="p-4 bg-slate-50 hover:bg-slate-100/70 rounded-2xl border border-slate-200 transition-colors flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🖥️</span>
                      <h4 className="font-bold text-xs text-slate-900 uppercase">2. Bắt buộc kích hoạt chế độ toàn màn hình</h4>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Yêu cầu học sinh mở Fullscreen khi làm bài. Nếu thoát chế độ toàn màn hình, hệ thống sẽ cảnh báo và ghi nhận vi phạm.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={tempConfig.requireFullscreen}
                      onChange={e => setTempConfig(prev => ({ ...prev, requireFullscreen: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {/* 3. Phát hiện chuyển Tab hoặc mở ứng dụng khác */}
                <div className="p-4 bg-slate-50 hover:bg-slate-100/70 rounded-2xl border border-slate-200 transition-colors flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">📑</span>
                      <h4 className="font-bold text-xs text-slate-900 uppercase">3. Phát hiện chuyển Tab hoặc mở ứng dụng khác</h4>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Tự động phát hiện khi học sinh chuyển sang tab trình duyệt khác, thu nhỏ cửa sổ hoặc mở ứng dụng thứ ba (Zalo, Chat, Google...).
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={tempConfig.detectTabSwitch}
                      onChange={e => setTempConfig(prev => ({ ...prev, detectTabSwitch: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {/* 4. Giới hạn số lần vi phạm tối đa trước khi Tự Động Thu Bài Cưỡng Chế */}
                <div className="p-4 bg-rose-50/50 hover:bg-rose-50 rounded-2xl border border-rose-200 transition-colors space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🚫</span>
                        <h4 className="font-bold text-xs text-rose-900 uppercase">4. Giới hạn vi phạm tối đa (Tự Động Thu Bài Cưỡng Chế)</h4>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Khi học sinh vi phạm chuyển tab quá số lần này, hệ thống sẽ <strong>tự động thu bài ngay lập tức</strong> và đình chỉ bài làm.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setTempConfig(prev => ({ ...prev, maxViolations: Math.max(1, prev.maxViolations - 1) }))}
                        className="w-8 h-8 rounded-lg bg-white border border-rose-300 font-bold text-rose-700 hover:bg-rose-100 flex items-center justify-center text-sm"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={tempConfig.maxViolations}
                        onChange={e => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val)) setTempConfig(prev => ({ ...prev, maxViolations: Math.min(10, Math.max(1, val)) }));
                        }}
                        className="w-12 h-8 text-center bg-white border border-rose-300 rounded-lg font-black text-rose-900 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setTempConfig(prev => ({ ...prev, maxViolations: Math.min(10, prev.maxViolations + 1) }))}
                        className="w-8 h-8 rounded-lg bg-white border border-rose-300 font-bold text-rose-700 hover:bg-rose-100 flex items-center justify-center text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <span className="text-[10px] text-rose-700 font-bold block">
                    Khuyến nghị: 3 lần (lần 1 nhắc nhở, lần 2 cảnh cáo, lần 3 tự động thu bài cưỡng chế).
                  </span>
                </div>

                {/* 5. Vô hiệu hóa chuột phải, bôi đen sao chép và phím tắt F12 */}
                <div className="p-4 bg-slate-50 hover:bg-slate-100/70 rounded-2xl border border-slate-200 transition-colors flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🔒</span>
                      <h4 className="font-bold text-xs text-slate-900 uppercase">5. Vô hiệu hóa chuột phải, bôi đen sao chép & F12</h4>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Chặn click chuột phải, chặn sao chép / quét chọn văn bản (copy/paste), chặn phím F12 và xem nguồn trình duyệt (DevTools).
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={tempConfig.preventCopyInspect}
                      onChange={e => setTempConfig(prev => ({ ...prev, preventCopyInspect: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {/* 6. Cho phép học sinh xem điểm số & lời giải chi tiết ngay sau khi nộp */}
                <div className="p-4 bg-slate-50 hover:bg-slate-100/70 rounded-2xl border border-slate-200 transition-colors flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">📝</span>
                      <h4 className="font-bold text-xs text-slate-900 uppercase">6. Xem điểm số & lời giải chi tiết sau khi nộp</h4>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Bật để học sinh xem lại đáp án đúng và lời giải chi tiết ngay sau khi nộp bài. Tắt để giữ bí mật kết quả cho kỳ thi chính thức.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={tempConfig.showSolutionsAfterSubmit}
                      onChange={e => setTempConfig(prev => ({ ...prev, showSolutionsAfterSubmit: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {/* 7. Học sinh được phép nộp bài sau khoảng thời gian (số phút) */}
                <div className="p-4 bg-slate-50 hover:bg-slate-100/70 rounded-2xl border border-slate-200 transition-colors flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">⏱️</span>
                      <h4 className="font-bold text-xs text-slate-900 uppercase">7. Thời gian tối thiểu trước khi được nộp bài</h4>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Học sinh chỉ được bấm Nộp bài sau khi đã làm bài ít nhất số phút này (ngăn nộp bài ẩu).
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <input
                      type="number"
                      min="0"
                      max={configuringLibraryExam.duration || 45}
                      value={tempConfig.minSubmitMinutes}
                      onChange={e => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) setTempConfig(prev => ({ ...prev, minSubmitMinutes: Math.max(0, val) }));
                      }}
                      className="w-16 h-8 text-center bg-white border border-slate-300 rounded-lg font-black text-slate-900 text-xs"
                    />
                    <span className="text-xs font-bold text-slate-500">phút</span>
                  </div>
                </div>

                {/* 8. Số lần Học sinh được phép làm bài */}
                <div className="p-4 bg-slate-50 hover:bg-slate-100/70 rounded-2xl border border-slate-200 transition-colors flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🔄</span>
                      <h4 className="font-bold text-xs text-slate-900 uppercase">8. Số lần được phép làm bài</h4>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Giới hạn số lần học sinh được phép nộp bài trên thiết bị hoặc số báo danh.
                    </p>
                  </div>
                  <select
                    value={tempConfig.maxAttempts}
                    onChange={e => setTempConfig(prev => ({ ...prev, maxAttempts: parseInt(e.target.value) || 1 }))}
                    className="h-8 px-3 bg-white border border-slate-300 rounded-lg font-bold text-xs text-slate-900"
                  >
                    <option value="1">1 lần (Thi chính thức)</option>
                    <option value="2">2 lần (Có làm lại)</option>
                    <option value="999">Không giới hạn (Luyện tập)</option>
                  </select>
                </div>

              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
                <button
                  onClick={() => setConfiguringLibraryExam(null)}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs"
                >
                  Hủy
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSaveExamConfig(tempConfig)}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-sm"
                  >
                    Lưu cấu hình
                  </button>
                  <button
                    onClick={() => handleSaveAndLaunch(tempConfig)}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Lưu & Phát đề ngay</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: MỞ LỚP KIỂM TRA MỚI */}
        {creatingClassForExam && (() => {
          const item = creatingClassForExam;
          const gradeClean = item.grade?.replace(/[^0-9]/g, '') || '12';
          const quickClassOptions = [`${gradeClean}A1`, `${gradeClean}A2`, `${gradeClean}A3`, `${gradeClean}A4`, `${gradeClean}A5`, `${gradeClean}A6`, `${gradeClean}A7`, `${gradeClean}A8`];

          return (
            <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
              <div className="bg-white rounded-[32px] max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-gradient-to-r from-emerald-900 to-teal-900 text-white">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-black uppercase">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-400" /> TỔ CHỨC THI THEO LỚP
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-white">
                      Mở lớp kiểm tra mới
                    </h2>
                    <p className="text-xs text-emerald-200 line-clamp-1">
                      Kỳ thi: <strong>{item.title}</strong> • Môn: {item.subject} ({item.grade})
                    </p>
                  </div>
                  <button
                    onClick={() => setCreatingClassForExam(null)}
                    className="p-2 text-white/70 hover:text-white rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form Body */}
                <div className="p-6 overflow-y-auto flex-1 space-y-5">
                  {/* Tên lớp */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-800 uppercase">
                      1. Tên lớp kiểm tra <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newClassInputName}
                      onChange={e => setNewClassInputName(e.target.value)}
                      placeholder={`Ví dụ: ${gradeClean}A1, ${gradeClean}A2...`}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />

                    {/* Quick selection chips */}
                    <div className="space-y-1 pt-1">
                      <p className="text-[11px] text-slate-500 font-medium">Chọn nhanh tên lớp gợi ý:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {quickClassOptions.map(cls => (
                          <button
                            key={cls}
                            type="button"
                            onClick={() => setNewClassInputName(cls)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                              newClassInputName === cls
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                            }`}
                          >
                            {cls}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Mã PIN phòng thi */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-black text-slate-800 uppercase">
                        2. Mã phòng thi riêng cho lớp (PIN 6 số)
                      </label>
                      <button
                        type="button"
                        onClick={() => setNewClassPin(Math.floor(100000 + Math.random() * 900000).toString())}
                        className="text-[11px] text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1"
                      >
                        <RotateCw className="w-3 h-3" /> Đổi mã khác
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                      <div className="space-y-0.5">
                        <span className="text-[11px] text-emerald-800 font-medium">Mã PIN học sinh quét/nhập:</span>
                        <div className="font-mono text-xl font-black text-emerald-900 tracking-wider">
                          {newClassPin}
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase">
                        Tự động cấp
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Mỗi lớp kiểm tra có mã PIN riêng để điểm thi và dữ liệu của từng lớp được lưu độc lập, không bị trộn lẫn.
                    </p>
                  </div>

                  {/* Ghi chú ca thi */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-800 uppercase">
                      3. Ca thi / Ghi chú (tùy chọn)
                    </label>
                    <input
                      type="text"
                      value={newClassNotes}
                      onChange={e => setNewClassNotes(e.target.value)}
                      placeholder="Ví dụ: Tiết 2 thứ Hai, Kiểm tra 1 tiết, Thi học kỳ..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  {/* 4. Cài đặt cấu hình giám sát phòng thi */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase">
                        <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
                        <span>4. Cấu hình bảo mật & phòng thi</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setTempConfig({ ...defaultExamConfig, ...(item.config || {}) });
                          setConfiguringLibraryExam(item);
                        }}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs hover:border-emerald-400 cursor-pointer shrink-0"
                        title="Cài đặt 8 cấu hình bảo mật phòng thi trước khi phát đề"
                      >
                        <Settings className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Cài đặt cấu hình</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px]">
                      <div className={`p-1.5 rounded-lg border text-center font-bold ${item.config?.allowShuffleCodes ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                        🔀 Trộn đề: {item.config?.allowShuffleCodes ? 'Bật' : 'Tắt'}
                      </div>
                      <div className={`p-1.5 rounded-lg border text-center font-bold ${item.config?.requireFullscreen ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                        🖥️ Toàn màn hình: {item.config?.requireFullscreen ? 'Bắt buộc' : 'Tắt'}
                      </div>
                      <div className={`p-1.5 rounded-lg border text-center font-bold ${item.config?.detectTabSwitch ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                        📑 Chống rời tab: {item.config?.detectTabSwitch ? 'Bật' : 'Tắt'}
                      </div>
                      <div className={`p-1.5 rounded-lg border text-center font-bold ${(item.config?.maxViolations || 3) ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                        🚫 Tối đa {item.config?.maxViolations || 3} vi phạm
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setCreatingClassForExam(null)}
                    className="order-3 sm:order-1 px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer text-center"
                  >
                    Hủy bỏ
                  </button>

                  <div className="order-1 sm:order-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        handleCreateNewClassSession(item, true, false);
                        setRole('student');
                        setIsTeacherGuidanceMode(true);
                      }}
                      className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-slate-900/20 active:scale-95 transition-all cursor-pointer"
                      title="Mở phòng và chuyển ngay sang màn hình thi để giáo viên hướng dẫn học sinh"
                    >
                      <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Hướng dẫn HS vào phòng</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCreateNewClassSession(item, true, false)}
                      className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current shrink-0" />
                      <span>Phát đề (Mở phòng)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* MODAL 4: BẢNG ĐIỂM & KẾT QUẢ THI CỦA LỚP */}
        {viewingClassResult && (() => {
          const { exam, session } = viewingClassResult;
          const allStudents = session.students || [];
          const submittedStudents = allStudents.filter(s => s.status === 'submitted');
          const scores = submittedStudents.filter(s => typeof s.score === 'number').map(s => s.score as number);
          const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : null;
          const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
          const minScore = scores.length > 0 ? Math.min(...scores) : 0;
          const gioiCount = scores.filter(sc => sc >= 8.0).length;
          const khaCount = scores.filter(sc => sc >= 6.5 && sc < 8.0).length;
          const tbCount = scores.filter(sc => sc >= 5.0 && sc < 6.5).length;
          const duoiTbCount = scores.filter(sc => sc < 5.0).length;
          const violationCount = allStudents.filter(s => (s.violations || 0) > 0).length;

          // Filter students
          const filteredStudents = allStudents.filter(s => {
            const matchSearch = s.name.toLowerCase().includes(classResultSearch.toLowerCase()) ||
              s.studentId.toLowerCase().includes(classResultSearch.toLowerCase()) ||
              s.code.toLowerCase().includes(classResultSearch.toLowerCase());
            if (!matchSearch) return false;

            if (classResultFilter === 'gioi') return (s.score || 0) >= 8.0;
            if (classResultFilter === 'kha') return (s.score || 0) >= 6.5 && (s.score || 0) < 8.0;
            if (classResultFilter === 'tb') return (s.score || 0) >= 5.0 && (s.score || 0) < 6.5;
            if (classResultFilter === 'duoitb') return (s.score || 0) < 5.0;
            if (classResultFilter === 'violation') return (s.violations || 0) > 0;
            return true;
          });

          return (
            <div className="fixed inset-0 z-[170] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
              <div className="bg-white rounded-[32px] max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5" /> BẢNG ĐIỂM & KẾT QUẢ THI
                      </span>
                      <span className="px-2.5 py-0.5 bg-white/10 text-white rounded-full text-[10px] font-bold">
                        Lớp {session.className}
                      </span>
                      <span className="px-2.5 py-0.5 bg-emerald-500 text-white rounded-full text-[10px] font-bold">
                        PIN: {session.roomCode}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                      Kết quả thi: Lớp {session.className}
                    </h2>
                    <p className="text-xs text-emerald-100">
                      Đề thi: <strong>{exam.title}</strong> ({exam.subject} - {exam.grade}) • Ngày thi: {new Date(session.createdAt).toLocaleDateString('vi-VN')} {new Date(session.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <button
                    onClick={() => setViewingClassResult(null)}
                    className="p-2 text-white/70 hover:text-white rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* KPI Statistics Bar */}
                <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Sĩ số & Nộp bài */}
                  <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-emerald-600" /> Sĩ số & Đã nộp
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-slate-900">{submittedStudents.length}</span>
                      <span className="text-xs text-slate-500 font-bold">/ {allStudents.length} HS</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Tỉ lệ nộp bài: {allStudents.length > 0 ? Math.round((submittedStudents.length / allStudents.length) * 100) : 0}%
                    </p>
                  </div>

                  {/* Điểm trung bình */}
                  <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Điểm trung bình
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-emerald-600">{avgScore !== null ? avgScore : '--'}</span>
                      <span className="text-xs text-slate-400 font-bold">/ 10 đ</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Điểm cao nhất: <strong>{maxScore}</strong> • Thấp nhất: <strong>{minScore}</strong>
                    </p>
                  </div>

                  {/* Phổ điểm GDPT */}
                  <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <BarChart3 className="w-3.5 h-3.5 text-emerald-600" /> Xếp loại học lực
                    </span>
                    <div className="text-xs font-bold text-slate-800 space-y-0.5">
                      <div className="flex justify-between">
                        <span className="text-emerald-700">Giỏi (≥8.0):</span>
                        <span>{gioiCount} HS</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Khá (6.5-7.9):</span>
                        <span>{khaCount} HS</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 flex justify-between">
                      <span>TB: {tbCount} HS</span>
                      <span>Dưới TB: {duoiTbCount} HS</span>
                    </div>
                  </div>

                  {/* Giám sát vi phạm */}
                  <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> Giám sát gian lận
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className={`text-2xl font-black ${violationCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {violationCount}
                      </span>
                      <span className="text-xs text-slate-500 font-bold">HS có vi phạm</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {violationCount === 0 ? 'Phòng thi nghiêm túc, không có gian lận' : 'Đã ghi nhận lịch sử vi phạm'}
                    </p>
                  </div>
                </div>

                {/* Toolbar: Search, Filters, and Actions */}
                <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white">
                  {/* Left: Search & Filters */}
                  <div className="flex flex-wrap items-center gap-2 flex-1">
                    <div className="relative min-w-[200px]">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={classResultSearch}
                        onChange={e => setClassResultSearch(e.target.value)}
                        placeholder="Tìm học sinh, SBD, mã đề..."
                        className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-900 outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-1">
                      <button
                        onClick={() => setClassResultFilter('all')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          classResultFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                        }`}
                      >
                        Tất cả ({allStudents.length})
                      </button>
                      <button
                        onClick={() => setClassResultFilter('gioi')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          classResultFilter === 'gioi' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        Giỏi ({gioiCount})
                      </button>
                      <button
                        onClick={() => setClassResultFilter('kha')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          classResultFilter === 'kha' ? 'bg-blue-600 text-white' : 'bg-blue-50 hover:bg-blue-100 text-blue-800'
                        }`}
                      >
                        Khá ({khaCount})
                      </button>
                      <button
                        onClick={() => setClassResultFilter('violation')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          classResultFilter === 'violation' ? 'bg-rose-600 text-white' : 'bg-rose-50 hover:bg-rose-100 text-rose-800'
                        }`}
                      >
                        Vi phạm ({violationCount})
                      </button>
                    </div>
                  </div>

                  {/* Right: Export & Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleExportClassCSV(exam, session)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Xuất Excel / CSV</span>
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>In bảng điểm</span>
                    </button>

                    <button
                      onClick={() => handleResumeClassRoom(exam, session)}
                      className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-bold text-xs flex items-center gap-1"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>Vào quản lý phòng thi</span>
                    </button>

                    <button
                      onClick={() => handleDeleteClassSession(exam.id, session.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                      title="Xóa lớp kiểm tra này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Table Body */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  {filteredStudents.length === 0 ? (
                    <div className="p-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 space-y-3">
                      <Users className="w-10 h-10 text-slate-300 mx-auto" />
                      <h4 className="font-bold text-slate-700">Chưa có dữ liệu học sinh trong lớp này</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Thầy cô có thể bấm "Vào quản lý phòng thi" để chiếu mã QR cho học sinh vào làm bài.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                            <th className="py-3 px-3.5">STT</th>
                            <th className="py-3 px-3.5">Họ và tên thí sinh</th>
                            <th className="py-3 px-3.5">SBD</th>
                            <th className="py-3 px-3.5">Mã đề</th>
                            <th className="py-3 px-3.5">Tiến độ câu</th>
                            <th className="py-3 px-3.5">Điểm số</th>
                            <th className="py-3 px-3.5">Xếp loại</th>
                            <th className="py-3 px-3.5">Giám sát vi phạm</th>
                            <th className="py-3 px-3.5">Trạng thái</th>
                            <th className="py-3 px-3.5">Thời gian nộp</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {filteredStudents.map((s, idx) => {
                            const isSubmitted = s.status === 'submitted';
                            const score = s.score;
                            return (
                              <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-3 px-3.5 text-slate-400 font-mono">{idx + 1}</td>
                                <td className="py-3 px-3.5 font-bold text-slate-900">
                                  <div className="flex items-center gap-2">
                                    <span>{s.name}</span>
                                    {s.violations > 0 && (
                                      <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[9px] font-black">
                                        {s.violations} vi phạm
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3 px-3.5 font-mono text-slate-600">{s.studentId}</td>
                                <td className="py-3 px-3.5">
                                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-mono font-bold text-[11px]">
                                    {s.code}
                                  </span>
                                </td>
                                <td className="py-3 px-3.5 text-slate-600">
                                  {s.answeredCount}/{s.totalQuestions || exam.questionsCount}
                                </td>
                                <td className="py-3 px-3.5 font-black text-sm">
                                  {isSubmitted && typeof score === 'number' ? (
                                    <span className={`px-2 py-0.5 rounded-lg border font-mono ${
                                      score >= 8.0 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                                      score >= 6.5 ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                      score >= 5.0 ? 'bg-amber-50 border-amber-200 text-amber-800' :
                                      'bg-rose-50 border-rose-200 text-rose-700'
                                    }`}>
                                      {score} đ
                                    </span>
                                  ) : s.status === 'suspended' ? (
                                    <span className="text-rose-600 font-bold">Đình chỉ</span>
                                  ) : (
                                    <span className="text-slate-400 italic">Đang thi</span>
                                  )}
                                </td>
                                <td className="py-3 px-3.5 font-bold text-xs text-slate-700">
                                  {s.rating || (isSubmitted ? 'Đã hoàn thành' : '--')}
                                </td>
                                <td className="py-3 px-3.5">
                                  {s.violations > 0 ? (
                                    <span className="text-rose-600 font-bold flex items-center gap-1">
                                      <ShieldAlert className="w-3.5 h-3.5" /> {s.violations} lần rời tab/F12
                                    </span>
                                  ) : (
                                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Bình thường
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-3.5">
                                  {isSubmitted ? (
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                                      Đã nộp bài
                                    </span>
                                  ) : s.status === 'suspended' ? (
                                    <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full font-bold text-[10px]">
                                      Bị đình chỉ
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full font-bold text-[10px] animate-pulse">
                                      Đang làm bài
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-3.5 text-slate-400 font-mono text-[11px]">
                                  {s.submittedAt ? (
                                    new Date(s.submittedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                                  ) : '--'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 font-medium">
                    Tổng số: <strong>{filteredStudents.length}</strong> học sinh • Dữ liệu tự động lưu trữ theo từng lớp
                  </div>
                  <button
                    onClick={() => setViewingClassResult(null)}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* MODAL XÁC NHẬN XÓA ĐỀ THI */}
        {examToDelete && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 animate-scaleUp">
              <div className="flex items-center gap-3 text-rose-600">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Xác nhận xóa đề thi</h3>
                  <p className="text-xs text-slate-500 font-medium">Hành động này không thể hoàn tác</p>
                </div>
              </div>

              <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-100 text-xs text-rose-950 space-y-2.5">
                <p>Thầy cô có chắc chắn muốn xóa vĩnh viễn đề thi này khỏi thư viện không?</p>
                <div className="p-3 bg-white rounded-xl border border-rose-200 font-bold text-sm text-slate-900 space-y-1">
                  <p className="line-clamp-2">📄 {examToDelete.title}</p>
                  <p className="text-[11px] text-slate-500 font-normal">
                    Môn: {examToDelete.subject} • {examToDelete.grade} • {examToDelete.duration} phút
                  </p>
                </div>
                <p className="text-[11px] text-rose-700 font-medium">
                  ⚠️ Toàn bộ dữ liệu các lớp đã thi ({examToDelete.sessions?.length || 0} lớp) và bảng điểm của đề thi này cũng sẽ bị xóa.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setExamToDelete(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteLibraryExam}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa đề thi vĩnh viễn
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL XÁC NHẬN XÓA KẾT QUẢ LỚP THI */}
        {sessionToDelete && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 animate-scaleUp">
              <div className="flex items-center gap-3 text-rose-600">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Xác nhận xóa lớp thi</h3>
                  <p className="text-xs text-slate-500 font-medium">Hành động này không thể hoàn tác</p>
                </div>
              </div>

              <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-100 text-xs text-rose-950 space-y-2.5">
                <p>Thầy cô có chắc chắn muốn xóa toàn bộ lịch sử và kết quả thi của lớp này?</p>
                <div className="p-3 bg-white rounded-xl border border-rose-200 font-bold text-sm text-slate-900 space-y-1">
                  <p>🏫 Lớp: {sessionToDelete.className}</p>
                  <p className="text-[11px] text-slate-500 font-normal line-clamp-1">
                    Đề thi: {sessionToDelete.examTitle}
                  </p>
                </div>
                <p className="text-[11px] text-rose-700 font-medium">
                  ⚠️ Bảng điểm và bài làm của các học sinh thuộc lớp này sẽ bị xóa khỏi hệ thống.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSessionToDelete(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteClassSession}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa lớp thi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL XÁC NHẬN CHIA SẺ CỘNG ĐỒNG / THU HỒI VỀ RIÊNG TƯ */}
        {examToToggleShare && (() => {
          const isCurrentlyPublic = examToToggleShare.visibility === 'public';
          return (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 animate-scaleUp">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${isCurrentlyPublic ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {isCurrentlyPublic ? <Lock className="w-6 h-6" /> : <Share2 className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {isCurrentlyPublic ? 'Thu hồi về Chế độ riêng tư' : 'Chia sẻ lên Thư viện cộng đồng'}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {isCurrentlyPublic ? 'Chỉ mình thầy cô quản lý và sử dụng' : 'Công khai cho các thầy cô khác tham khảo'}
                    </p>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border text-xs space-y-2.5 ${
                  isCurrentlyPublic 
                    ? 'bg-amber-50/70 border-amber-200 text-amber-950' 
                    : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                }`}>
                  <p>
                    {isCurrentlyPublic 
                      ? 'Đề thi sẽ được gỡ khỏi Thư viện cộng đồng. Từ bây giờ chỉ lưu trong máy tính của thầy cô.'
                      : 'Đề thi sẽ được xuất bản lên Thư viện cộng đồng để các giáo viên khác có thể xem và nhân bản sử dụng.'}
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 font-bold text-sm text-slate-900 space-y-1">
                    <p className="line-clamp-2">📄 {examToToggleShare.title}</p>
                    <p className="text-[11px] text-slate-500 font-normal">
                      Môn: {examToToggleShare.subject} • {examToToggleShare.grade} • {examToToggleShare.duration} phút
                    </p>
                  </div>
                  {!isCurrentlyPublic && (
                    <p className="text-[11px] text-amber-700 font-medium">
                      ⚠️ <strong>Lưu ý bảo mật:</strong> Để đảm bảo tính công bằng và chống lộ đề thi, thầy cô chỉ nên chia sẻ sau khi học sinh đã thi xong hoặc đây là đề thi thử/ôn tập.
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setExamToToggleShare(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmToggleVisibility}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      isCurrentlyPublic
                        ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                    }`}
                  >
                    {isCurrentlyPublic ? <Lock className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                    {isCurrentlyPublic ? 'Xác nhận thu hồi riêng tư' : 'Xác nhận chia sẻ công khai'}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* TOAST THÔNG BÁO CHIA SẺ / THU HỒI */}
        {shareToast && (
          <div className="fixed bottom-6 right-6 z-[200] max-w-md bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-fadeIn">
            <div className={`p-1.5 rounded-xl ${shareToast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-slate-950'}`}>
              {shareToast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <p className="text-xs font-bold flex-1">{shareToast.message}</p>
            <button onClick={() => setShareToast(null)} className="text-slate-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    );
  }

  // ----------------------------------------------------
  // GIAO DIỆN HỌC SINH (LÀM BÀI THI & CHỐNG GIAN LẬN)
  // ----------------------------------------------------
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in pb-16">
      
      {/* Banner hướng dẫn giáo viên (CHỈ HIỂN THỊ KHI GIÁO VIÊN BẬT CHẾ ĐỘ HƯỚNG DẪN, KHÔNG HIỂN THỊ TRÊN MÁY HỌC SINH) */}
      {showTeacherGuidanceReturn && (
        <div className="sticky top-2 z-40 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-3.5 sm:p-4 rounded-2xl border-2 border-emerald-500/50 shadow-2xl flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 bg-emerald-500 text-slate-950 rounded-xl font-black text-lg flex items-center justify-center shrink-0 shadow-sm">
              👨‍🏫
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black uppercase tracking-tight text-white">
                  Chế độ Giáo viên: Hướng dẫn học sinh vào phòng thi
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[10px] font-bold">
                  Màn hình hướng dẫn
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/90 font-medium">
                Thầy cô đang xem giao diện phía học sinh để chiếu bảng hoặc hướng dẫn các em vào thi.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReturnToTeacher}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-black text-xs uppercase flex items-center gap-2 shadow-lg hover:shadow-xl transition-all shrink-0 cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <span>Quay lại chế độ Giáo viên</span>
          </button>
        </div>
      )}

      {/* Header học sinh */}
      <div className="flex items-center justify-between text-xs text-slate-500 bg-white/80 p-3 rounded-2xl border border-slate-200 shadow-sm">
        <span className="font-bold text-slate-700 flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4 text-emerald-600" /> Cổng thi trực tuyến học sinh
        </span>
        <div className="flex items-center gap-2">
          {showTeacherGuidanceReturn && (
            <button
              type="button"
              onClick={handleReturnToTeacher}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-xs flex items-center gap-1.5 border border-slate-300 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-600" />
              <span>Về Giáo viên</span>
            </button>
          )}
          <span className="font-mono bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg font-bold border border-emerald-200">
            Phòng #{roomCode}
          </span>
        </div>
      </div>

      {/* 1. Màn hình nhập thông tin vào phòng */}
      {!studentJoined && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl max-w-md mx-auto space-y-6">
          <div className="text-center space-y-1">
            <GraduationCap className="w-12 h-12 text-emerald-600 mx-auto" />
            <h2 className="text-xl font-black uppercase text-slate-900">VÀO PHÒNG THI ONLINE</h2>
            <p className="text-xs text-slate-500 font-medium">{activeExam?.title} ({activeExam?.subject} {activeExam?.grade})</p>
          </div>

          <form onSubmit={handleStudentJoin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Họ và tên thí sinh *</label>
              <input
                type="text"
                required
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                placeholder="Nhập họ và tên..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Lớp *</label>
                <input
                  type="text"
                  required
                  value={studentClass}
                  onChange={e => setStudentClass(e.target.value)}
                  placeholder="12A1..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Số báo danh (SBD)</label>
                <input
                  type="text"
                  value={studentSBD}
                  onChange={e => setStudentSBD(e.target.value)}
                  placeholder="SBD..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-800 space-y-1 border border-amber-200">
              <span className="font-bold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> Quy chế phòng thi chống gian lận:
              </span>
              <p className="text-[11px] text-slate-600">
                Không chuyển sang tab khác hoặc mở ứng dụng khác trong lúc làm bài. Hệ thống tự động ghi nhận số lần rời tab và báo về giáo viên.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm uppercase shadow-lg shadow-emerald-600/20"
            >
              ĐIỂM DANH & VÀO PHÒNG
            </button>
          </form>
        </div>
      )}

      {/* 2. Chờ giáo viên bắt đầu */}
      {studentJoined && studentStatus === 'waiting' && (
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl max-w-lg mx-auto text-center space-y-5 animate-in fade-in">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto shadow-inner border border-amber-100">
            <Clock className="w-8 h-8 text-amber-500 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black uppercase text-slate-900 tracking-tight">ĐÃ ĐIỂM DANH THÀNH CÔNG</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              Thí sinh: <strong className="text-slate-900">{studentName}</strong> (Lớp {studentClass}) • Mã đề: <strong className="text-emerald-700 font-mono">{studentAssignedCode}</strong>
            </p>
          </div>

          {/* VỊ TRÍ 1: TRẠNG THÁI & CẢNH BÁO CHỐNG GIAN LẬN */}
          <div className="space-y-3 text-left">
            {/* Trạng thái phòng */}
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <span>Thầy cô đang chuẩn bị. Vui lòng giữ màn hình này, bài thi sẽ <strong>tự động bắt đầu</strong> khi thầy cô bấm tính giờ trên máy chiếu!</span>
            </div>

            {/* Hộp quy định cảnh báo chống gian lận */}
            <div className="p-4 bg-amber-50/80 rounded-2xl border-2 border-amber-200 text-xs space-y-2.5">
              <div className="flex items-center gap-2 text-amber-900 font-black uppercase tracking-wide">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Quy chế phòng thi & Cảnh báo chống gian lận:</span>
              </div>
              <ul className="space-y-2 text-[11px] sm:text-xs text-slate-700 leading-relaxed font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold shrink-0">1.</span>
                  <span><strong>{antiCheatSettings.requireFullscreen ? 'Bắt buộc toàn màn hình:' : 'Chế độ thi trực tuyến:'}</strong> {antiCheatSettings.requireFullscreen ? 'Hệ thống yêu cầu chế độ Fullscreen trong suốt buổi thi. Thoát toàn màn hình sẽ bị tính là vi phạm.' : 'Thí sinh làm bài tập trung trên giao diện bài thi.'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold shrink-0">2.</span>
                  <span><strong>{antiCheatSettings.detectTabSwitch ? 'Không rời màn hình thi:' : 'Giám sát phòng thi:'}</strong> {antiCheatSettings.detectTabSwitch ? 'Nghiêm cấm chuyển tab, thu nhỏ trình duyệt hoặc mở app khác (Zalo, Facebook, Google...). Mọi lần rời tab đều được máy chủ lưu lại.' : 'Thí sinh tuân thủ nội quy phòng thi.'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold shrink-0">3.</span>
                  <span><strong>Tự Động Thu Bài Cưỡng Chế:</strong> Nếu vi phạm rời tab/thoát toàn màn hình quá <strong>{antiCheatSettings.maxViolations} lần</strong>, hệ thống sẽ <strong>tự động thu bài và đình chỉ thi ngay lập tức</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold shrink-0">4.</span>
                  <span><strong>{antiCheatSettings.preventCopyInspect ? 'Vô hiệu hóa thao tác:' : 'Bảo mật:'}</strong> {antiCheatSettings.preventCopyInspect ? 'Chuột phải, bôi đen sao chép và phím F12/DevTools bị vô hiệu hóa hoàn toàn.' : 'Bài làm được giám sát tự động.'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold shrink-0">5.</span>
                  <span><strong>Chống chụp & quay màn hình:</strong> Nghiêm cấm chụp màn hình (PrtScn, Snipping Tool, phím tắt in đề). Màn hình sẽ tự động che đen khi mất tiêu điểm và in chìm Watermark định danh thí sinh.</span>
                </li>
                {antiCheatSettings.minSubmitMinutes > 0 && (
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold shrink-0">6.</span>
                    <span><strong>Thời gian nộp bài:</strong> Bạn chỉ được phép nộp bài sau ít nhất <strong>{antiCheatSettings.minSubmitMinutes} phút</strong> làm bài.</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* TRẠNG THÁI CHỜ GIÁO VIÊN BẤM PHÁT ĐỀ HOẶC BẮT ĐẦU NGAY */}
          <div className="pt-2 space-y-3">
            <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl border-2 border-emerald-300 text-emerald-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-sm">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <span>Đang kết nối phòng thi. Bài thi sẽ tự động bắt đầu khi thầy cô phát đề!</span>
            </div>

            {/* Nút vào làm bài ngay dành cho học sinh trên điện thoại hoặc khi thầy cô đã mở phòng */}
            <button
              type="button"
              onClick={() => {
                const clean = encodeURIComponent(String(roomCode).trim());
                fetch(`/api/rooms/${clean}`)
                  .then(r => r.ok ? r.json() : null)
                  .then(data => {
                    if (data?.examData) {
                      setActiveExam(data.examData);
                      if (data.status) setRoomStatus(data.status);
                    }
                    triggerCountdownAndStart();
                  })
                  .catch(() => {
                    triggerCountdownAndStart();
                  });
              }}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-600/30 active:scale-95 transition-all cursor-pointer animate-pulse"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>BẮT ĐẦU VÀO LÀM BÀI NGAY</span>
            </button>
            <p className="text-[11px] text-slate-500 font-medium text-center">
              Thầy cô đã phát đề trên lớp? Bấm nút trên để bắt đầu làm bài ngay nếu máy chưa tự chuyển trang.
            </p>
          </div>
        </div>
      )}

      {/* 3. Màn hình làm bài thi */}
      {studentJoined && studentStatus === 'testing' && (
        <div className={`space-y-6 relative select-none ${antiCheatSettings.requireFullscreen && isMissingFullscreen ? 'pointer-events-none filter blur-md' : ''}`}>
          {/* Chống in đề thi / Save PDF */}
          <style>{`
            @media print {
              body, html, #root { display: none !important; }
            }
          `}</style>

          {/* Watermark kỹ thuật số chống chụp / quay lén màn hình */}
          <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden select-none opacity-[0.05] sm:opacity-[0.06] flex flex-wrap gap-12 sm:gap-16 p-6 items-center justify-around">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="text-xs sm:text-sm font-black text-slate-900 tracking-wider -rotate-25 whitespace-nowrap font-mono select-none">
                {studentName || 'Thí sinh'} • {studentAssignedCode} • Phòng {roomCode || '---'}
              </div>
            ))}
          </div>

          {/* Privacy Blackout Shield (Lá chắn màn hình đen khi chụp/mất tiêu điểm) */}
          {isScreenShieldActive && (
            <div 
              onClick={() => setIsScreenShieldActive(false)}
              className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 text-center select-none cursor-pointer"
            >
              <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border-2 border-rose-500/50 flex items-center justify-center text-3xl mb-4 animate-bounce">
                🛡️
              </div>
              <h3 className="text-lg sm:text-2xl font-black text-white mb-2 uppercase tracking-wide">
                Lá chắn bảo mật: Màn hình tạm thời bị che
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed mb-5">
                Phát hiện cửa sổ bị mất tiêu điểm hoặc nghi vấn thao tác chụp ảnh màn hình (Snipping Tool, PrintScreen, chuyển ứng dụng). Đề thi tự động che đen nhằm bảo mật.
              </p>
              <button
                type="button"
                onClick={() => setIsScreenShieldActive(false)}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl font-black text-xs uppercase shadow-lg transition-transform"
              >
                Nhấn vào đây để quay lại làm bài
              </button>
            </div>
          )}

          {/* MANDATORY FULLSCREEN LOCKDOWN SHIELD (Chống bấm ESC hoặc thoát Fullscreen) */}
          {antiCheatSettings.requireFullscreen && isMissingFullscreen && (
            <div className="fixed inset-0 z-[120] bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center select-none animate-fadeIn pointer-events-auto filter-none">
              <div className="max-w-lg w-full bg-slate-900 border-2 border-rose-500/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-white text-center">
                <div className="w-20 h-20 rounded-3xl bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center mx-auto text-4xl shadow-lg shadow-rose-500/20 animate-pulse">
                  ⚠️
                </div>
                
                <div className="space-y-2">
                  <span className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-full text-xs font-black uppercase tracking-wider">
                    Quy chế thi trực tuyến
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
                    Cảnh báo: Đã thoát toàn màn hình!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                    Hệ thống phát hiện bạn vừa bấm phím <strong className="text-rose-400 font-mono bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/30">ESC</strong> hoặc thoát chế độ toàn màn hình. 
                    Nội dung bài thi đã được tạm khóa để chống gian lận.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1 text-left">
                  <div className="flex items-center justify-between">
                    <span>Số lần vi phạm đã ghi nhận:</span>
                    <strong className="text-rose-400 text-sm font-black">{studentViolations} / {antiCheatSettings.maxViolations || 3} lần</strong>
                  </div>
                  <div className="text-[11px] text-amber-300/90 font-medium">
                    Vui lòng bấm nút bên dưới để quay lại toàn màn hình ngay. Nếu vi phạm quá số lần cho phép, bài thi sẽ bị tự động thu và đình chỉ.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={enterFullscreenAndLock}
                  className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer"
                >
                  <Maximize2 className="w-5 h-5" />
                  <span>BẬT LẠI TOÀN MÀN HÌNH ĐỂ TIẾP TỤC LÀM BÀI</span>
                </button>
              </div>
            </div>
          )}
          {/* Cụm cố định trên cùng: Thanh thông tin + Bảng danh sách câu hỏi cố định */}
          <div className="sticky top-2 z-40 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 shadow-md space-y-3">
            {/* Hàng 1: Thông tin thí sinh, Đồng hồ đếm ngược, Nút nộp bài */}
            <div className="flex items-center justify-between gap-2 sm:gap-4 pb-2.5 border-b border-slate-100">
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-black text-slate-900 block truncate">
                  {studentName} {studentClass ? `(${studentClass})` : ''}
                </span>
                <span className="text-[10px] text-slate-400 font-mono font-bold block">
                  MÃ ĐỀ: {studentAssignedCode}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="font-mono text-sm sm:text-base font-black px-3 py-1.5 rounded-xl bg-slate-900 text-emerald-400 flex items-center gap-1.5 shadow-inner">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 animate-spin" />
                  <span>{Math.floor(studentTimeLeft / 60)}:{(studentTimeLeft % 60).toString().padStart(2, '0')}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleStudentSubmit(false)}
                  className="px-3.5 sm:px-4 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl font-black text-xs uppercase shadow-sm transition-all"
                >
                  Nộp bài
                </button>
              </div>
            </div>

            {/* Hàng 2: Bảng danh sách câu hỏi cố định khi học sinh cuộn trang */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <ListOrdered className="w-3.5 h-3.5 text-slate-400" /> Bảng danh sách câu hỏi:
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Đã làm {answeredQuestionsCount}/{(activeExam?.questions || []).length}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPaletteCollapsed(prev => !prev)}
                  className="text-[10px] sm:text-xs text-slate-500 hover:text-slate-800 font-semibold px-2 py-0.5 rounded-lg hover:bg-slate-100 flex items-center gap-1 transition-colors"
                  title={isPaletteCollapsed ? "Mở rộng danh sách câu hỏi" : "Thu gọn danh sách câu hỏi"}
                >
                  {isPaletteCollapsed ? (
                    <><span>Mở rộng</span> <ChevronDown className="w-3.5 h-3.5" /></>
                  ) : (
                    <><span>Thu gọn</span> <ChevronUp className="w-3.5 h-3.5" /></>
                  )}
                </button>
              </div>

              {!isPaletteCollapsed && (
                <div className="flex flex-wrap gap-1.5 max-h-28 sm:max-h-40 overflow-y-auto pr-1">
                  {(activeExam?.questions || []).map((_, qIdx) => {
                    const isMCQDone = studentAnswers.mcq[qIdx] !== undefined;
                    const isTFDone = Boolean(studentAnswers.tf[qIdx] && Object.keys(studentAnswers.tf[qIdx]).length > 0);
                    const isSADone = Boolean(studentAnswers.sa[qIdx] && Object.keys(studentAnswers.sa[qIdx]).length > 0);
                    const isTLDone = Boolean(studentAnswers.tl?.[qIdx] && studentAnswers.tl[qIdx].trim().length > 0);
                    const isDone = isMCQDone || isTFDone || isSADone || isTLDone;
                    return (
                      <button
                        key={qIdx}
                        type="button"
                        onClick={() => {
                          const el = document.getElementById(`question_${qIdx}`);
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                          isDone 
                            ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-700' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80'
                        }`}
                        title={`Câu ${qIdx + 1} (${isDone ? 'Đã làm' : 'Chưa làm'})`}
                      >
                        {qIdx + 1}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {resumedNotice && (
            <div className="p-3.5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-xs font-bold text-emerald-900 flex items-center justify-between gap-3 shadow-sm animate-in fade-in">
              <div className="flex items-center gap-2 min-w-0">
                <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Đã tự động khôi phục tiến độ bài thi từ thiết bị trước: Mã đề <b>{resumedNotice.code}</b> (đã làm {resumedNotice.count}/{resumedNotice.total} câu). Bạn có thể tiếp tục làm bài!
                </span>
              </div>
              <button
                type="button"
                onClick={() => setResumedNotice(null)}
                className="text-emerald-700 hover:text-emerald-950 font-black text-xs px-2 py-1 rounded-lg hover:bg-emerald-100 shrink-0"
              >
                Đã hiểu
              </button>
            </div>
          )}

          {studentViolations > 0 && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Bạn đã có {studentViolations}/{antiCheatSettings.maxViolations} lần rời màn hình thi!</span>
            </div>
          )}

          <div className="space-y-6">
            {(activeExam?.questions || []).map((q, idx) => (
              <div id={`question_${idx}`} key={idx} className="scroll-mt-56 sm:scroll-mt-64 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center">{idx + 1}</span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold uppercase">{q.type}</span>
                </div>
                <div className="text-sm font-bold text-slate-900">
                  <MathRenderer content={q.content} />
                </div>

                {/* Phần I: MCQ */}
                {q.type === 'MCQ' && q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, oIdx) => {
                      const isChosen = studentAnswers.mcq[idx] === opt.id;
                      return (
                        <div
                          key={opt.id ? `stu_opt_${opt.id}_${oIdx}` : `stu_opt_${idx}_${oIdx}`}
                          onClick={() => {
                            setStudentAnswers(prev => {
                              const next = { ...prev, mcq: { ...prev.mcq, [idx]: opt.id } };
                              notifyProgress(next);
                              return next;
                            });
                          }}
                          className={`p-3 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                            isChosen ? 'bg-emerald-50 border-emerald-600 font-bold' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs shrink-0 ${isChosen ? 'bg-emerald-600 text-white' : 'bg-white border'}`}>{opt.id}</span>
                          <span className="text-xs text-slate-800"><MathRenderer content={opt.text} /></span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Phần II: TF (Đúng / Sai) */}
                {q.type === 'TF' && q.tfSubQuestions && (
                  <div className="space-y-3 pt-2">
                    {q.tfSubQuestions.map((sub, sIdx) => {
                      const letter = String.fromCharCode(97 + sIdx);
                      const choice = studentAnswers.tf[idx]?.[sIdx];
                      return (
                        <div key={sub.id ? `stu_tf_${sub.id}_${sIdx}` : `stu_tf_${idx}_${sIdx}`} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="text-xs text-slate-800 flex items-start gap-2">
                            <span className="font-bold text-slate-900 uppercase">({letter})</span>
                            <MathRenderer content={sub.text} />
                          </div>
                          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setStudentAnswers(prev => {
                                  const cur = prev.tf[idx] || {};
                                  const next = { ...prev, tf: { ...prev.tf, [idx]: { ...cur, [sIdx]: true } } };
                                  notifyProgress(next);
                                  return next;
                                });
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${choice === true ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white border text-slate-700 hover:bg-slate-100'}`}
                            >
                              ĐÚNG
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setStudentAnswers(prev => {
                                  const cur = prev.tf[idx] || {};
                                  const next = { ...prev, tf: { ...prev.tf, [idx]: { ...cur, [sIdx]: false } } };
                                  notifyProgress(next);
                                  return next;
                                });
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${choice === false ? 'bg-rose-600 text-white shadow-sm' : 'bg-white border text-slate-700 hover:bg-slate-100'}`}
                            >
                              SAI
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Phần III: SA (Trả lời ngắn) */}
                {q.type === 'SA' && q.saSubQuestions && (
                  <div className="space-y-3 pt-2">
                    {q.saSubQuestions.map((sub, sIdx) => {
                      const letter = String.fromCharCode(97 + sIdx);
                      const currentVal = studentAnswers.sa[idx]?.[sIdx] || '';
                      return (
                        <div key={sub.id ? `stu_sa_${sub.id}_${sIdx}` : `stu_sa_${idx}_${sIdx}`} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                          <div className="text-xs text-slate-800 flex items-start gap-2">
                            <span className="font-bold text-slate-900 uppercase">({letter})</span>
                            <MathRenderer content={sub.text} />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-500">Đáp án:</span>
                            <input
                              type="text"
                              value={currentVal}
                              onChange={e => {
                                const val = e.target.value;
                                setStudentAnswers(prev => {
                                  const cur = prev.sa[idx] || {};
                                  const next = { ...prev, sa: { ...prev.sa, [idx]: { ...cur, [sIdx]: val } } };
                                  notifyProgress(next);
                                  return next;
                                });
                              }}
                              placeholder="Nhập kết quả..."
                              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 w-full max-w-xs focus:border-emerald-600 focus:outline-none"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Phần IV: TL (Tự luận) */}
                {q.type === 'TL' && (
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Ghi chú câu trả lời hoặc tóm tắt lời giải:</label>
                    <textarea
                      rows={3}
                      value={studentAnswers.tl?.[idx] || ''}
                      onChange={e => {
                        const val = e.target.value;
                        setStudentAnswers(prev => {
                          const next = { ...prev, tl: { ...prev.tl, [idx]: val } };
                          notifyProgress(next);
                          return next;
                        });
                      }}
                      placeholder="Học sinh có thể ghi chép tóm tắt lời giải vào đây..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => handleStudentSubmit(false)}
              className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-base uppercase shadow-xl"
            >
              NỘP BÀI THI HOÀN TẤT
            </button>
          </div>
        </div>
      )}

      {/* 4. Kết quả học sinh */}
      {studentStatus === 'submitted' && studentScore && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl max-w-md mx-auto text-center space-y-6 animate-in fade-in">
          <Award className="w-16 h-16 text-emerald-600 mx-auto" />
          <div>
            <h2 className="text-2xl font-black uppercase text-slate-900">BẠN ĐÃ NỘP BÀI THÀNH CÔNG</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">Hệ thống đã tự động chấm điểm bài làm của bạn.</p>
          </div>

          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200">
            <span className="text-xs font-bold text-emerald-800 uppercase block">ĐIỂM ĐẠT ĐƯỢC</span>
            <span className="text-5xl font-black text-emerald-700">{studentScore.score}</span>
            <span className="text-xs text-slate-400 block pt-1">/ 10.0 điểm</span>
            <span className="inline-block mt-2 px-3 py-1 bg-white text-emerald-800 font-bold text-xs rounded-full border">{studentScore.rating}</span>
          </div>

          {/* Xem lời giải chi tiết hoặc thông báo bảo mật */}
          {antiCheatSettings.showSolutionsAfterSubmit ? (
            <div className="text-left space-y-4 pt-2">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-xs text-slate-800 uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Đáp án & Lời giải chi tiết:
                </span>
                <span className="text-[11px] text-slate-400">
                  {activeExam?.questions?.length || 0} câu hỏi
                </span>
              </div>

              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                {(activeExam?.questions || []).map((q, idx) => {
                  const studentMcq = studentAnswers.mcq[idx];
                  const correctMcq = q.options?.find(o => o.isCorrect)?.id;
                  const isMcqCorrect = studentMcq === correctMcq;

                  return (
                    <div key={q.id ? `res_q_${q.id}_${idx}` : `res_q_${idx}`} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-900">Câu {idx + 1} ({q.type})</span>
                        {q.type === 'MCQ' && (
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            isMcqCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {isMcqCorrect ? 'Đúng ✓' : 'Chưa đúng ✗'}
                          </span>
                        )}
                      </div>

                      <div className="text-slate-800 font-medium">
                        <MathRenderer content={q.content || (q as any).text || ''} />
                      </div>

                      {q.type === 'MCQ' && (
                        <div className="text-[11px] space-y-1 pt-1">
                          <div>Bạn chọn: <strong className={isMcqCorrect ? 'text-emerald-700' : 'text-rose-700'}>{studentMcq || 'Chưa chọn'}</strong></div>
                          <div>Đáp án đúng: <strong className="text-emerald-700">{correctMcq}</strong></div>
                        </div>
                      )}

                      {(q.solution || (q as any).explanation) && (
                        <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-1 mt-2">
                          <span className="font-bold text-[10px] uppercase text-amber-700 block">Lời giải:</span>
                          <MathRenderer content={q.solution || (q as any).explanation || ''} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 font-medium text-center space-y-1">
              <span className="font-bold text-slate-700 block">🔒 Lời giải chi tiết được bảo mật</span>
              <p className="text-[11px]">Theo quy định của giáo viên cho đề thi này, đáp án và lời giải chi tiết không được hiển thị sau khi nộp.</p>
            </div>
          )}

          {/* Thông báo hoàn thành bài thi cho học sinh */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-1.5 mt-4">
            <p className="font-bold text-emerald-900 text-xs flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Bài làm đã được nộp thành công vào hệ thống
            </p>
            <p className="text-[11px] text-emerald-700 leading-relaxed">
              Điểm số và bài làm của bạn đã được ghi nhận tự động vào hệ thống của thầy cô giáo. Thí sinh có thể an tâm đóng tab hoặc tắt trình duyệt.
            </p>
          </div>
        </div>
      )}

      {/* THÔNG BÁO CHƯA ĐỦ THỜI GIAN NỘP BÀI (KHÔNG PHẢI VI PHẠM GIAN LẬN) */}
      {earlySubmitModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full text-center space-y-4 shadow-2xl border border-amber-200">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner border border-amber-100">
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <span className="text-[11px] font-black tracking-wider text-amber-700 uppercase bg-amber-100 px-3 py-1 rounded-full">
                Quy chế phòng thi
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase mt-2.5">
                Chưa đủ thời gian nộp bài
              </h3>
            </div>
            
            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80 text-left space-y-2.5 text-xs text-slate-700">
              <p className="font-semibold text-amber-950 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                Thời gian nộp bài tối thiểu: <b>{earlySubmitModal.minMinutes} phút</b>
              </p>
              <p className="text-slate-600 leading-relaxed">
                Theo quy định của đề thi này, bạn chỉ được phép nộp bài sau khi đã làm bài ít nhất {earlySubmitModal.minMinutes} phút.
              </p>
              <div className="pt-2 border-t border-amber-200/70 flex items-center justify-between font-bold text-amber-900">
                <span>Cần làm bài thêm:</span>
                <span className="font-mono text-sm bg-white px-2.5 py-1 rounded-xl border border-amber-200 text-amber-700 font-black">
                  {earlySubmitModal.waitMinutes > 0 ? `${earlySubmitModal.waitMinutes} phút ` : ''}{earlySubmitModal.waitSeconds} giây
                </span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-[11px] font-medium flex items-center gap-2 text-left">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Thao tác này <b>không bị tính là gian lận</b>. Vui lòng tiếp tục kiểm tra lại bài thi.</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setEarlySubmitModal(null);
                setIsScreenShieldActive(false);
              }}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white rounded-xl font-black text-xs uppercase shadow-md transition-all cursor-pointer"
            >
              Đã hiểu, tiếp tục làm bài
            </button>
          </div>
        </div>
      )}

      {/* MODAL XÁC NHẬN NỘP BÀI THI */}
      {confirmSubmitModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full text-center space-y-4 shadow-2xl border border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase">
                Xác nhận nộp bài thi
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Bạn có chắc chắn muốn nộp bài thi và kết thúc lượt làm bài?
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-xs text-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Số câu đã trả lời:</span>
                <span className="font-bold text-slate-900">
                  {answeredQuestionsCount} / {(activeExam?.questions || []).length} câu
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Thời gian còn lại:</span>
                <span className="font-mono font-bold text-emerald-600">
                  {Math.floor(studentTimeLeft / 60)}:{(studentTimeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 font-medium">
              Sau khi nộp bài, hệ thống sẽ tiến hành chấm điểm và bạn không thể chỉnh sửa đáp án.
            </p>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setConfirmSubmitModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 rounded-xl font-bold text-xs uppercase transition-all cursor-pointer"
              >
                Tiếp tục làm bài
              </button>
              <button
                type="button"
                onClick={() => doExecuteSubmit()}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl font-black text-xs uppercase shadow-md transition-all cursor-pointer"
              >
                Nộp bài ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CẢNH BÁO VI PHẠM MODAL */}
      {violationAlert && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-rose-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 border-4 border-rose-500">
            <AlertTriangle className="w-12 h-12 text-rose-600 mx-auto animate-bounce" />
            <h3 className="text-lg font-black text-rose-600 uppercase">CẢNH BÁO GIAN LẬN!</h3>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">{violationAlert}</p>
            <button
              onClick={() => setViolationAlert(null)}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-xs uppercase shadow-lg"
            >
              TÔI HIỂU VÀ TIẾP TỤC LÀM BÀI
            </button>
          </div>
        </div>
      )}

      {/* HIỆU ỨNG ĐẾM NGƯỢC 3, 2, 1 TRƯỚC KHI VÀO LÀM BÀI */}
      {countdownNumber !== null && (
        <div className="fixed inset-0 z-[250] flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md text-white p-6 animate-in fade-in">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>GIÁO VIÊN ĐÃ PHÁT ĐỀ THI!</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
              {countdownNumber > 0 ? 'BÀI THI SẼ BẮT ĐẦU TRONG' : 'BẮT ĐẦU LÀM BÀI!'}
            </h2>

            {/* Glowing Big Countdown Number with Smooth Zoom Pulse */}
            <div className="py-4 flex justify-center items-center">
              <div 
                key={countdownNumber}
                className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full flex items-center justify-center font-black shadow-2xl border-4 transition-all duration-300 ${
                  countdownNumber === 0 
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-300 text-white text-3xl sm:text-4xl shadow-emerald-500/50 scale-110 animate-bounce' 
                    : countdownNumber === 1
                    ? 'bg-gradient-to-br from-emerald-600 to-teal-700 border-emerald-400 text-white text-7xl sm:text-8xl shadow-emerald-600/50 scale-105'
                    : countdownNumber === 2
                    ? 'bg-gradient-to-br from-teal-600 to-emerald-700 border-teal-400 text-white text-7xl sm:text-8xl shadow-teal-600/50 scale-100'
                    : 'bg-gradient-to-br from-amber-500 to-orange-600 border-amber-300 text-white text-7xl sm:text-8xl shadow-amber-500/50 scale-95'
                }`}
              >
                {countdownNumber === 0 ? 'BẮT ĐẦU!' : countdownNumber}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xs mx-auto leading-relaxed">
              {countdownNumber > 0 ? (
                <>Chuẩn bị sẵn sàng! Hệ thống sẽ tự động chuyển sang đề thi khi đếm ngược kết thúc.</>
              ) : (
                <>Chúc bạn làm bài thi thật tốt và đạt kết quả cao! 🚀</>
              )}
            </p>

            <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 font-bold bg-emerald-950/60 py-2 px-4 rounded-xl border border-emerald-800/60 w-fit mx-auto">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Chế độ giám sát chống gian lận đã sẵn sàng</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL MỞ KHÓA GIÁO VIÊN (BẢO VỆ ĐỀ THI & MA TRẬN) */}
      {showTeacherUnlockModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-5 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setShowTeacherUnlockModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black uppercase tracking-wider">
                BẢO MẬT KHẢO THÍ
              </span>
              <h3 className="text-xl font-black text-slate-900 uppercase pt-1">Xác nhận quyền Giáo viên</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Giao diện này đang khóa ở chế độ học sinh nhằm bảo mật ma trận, đề gốc và đáp án. Vui lòng nhập mật mã quản trị giáo viên để tiếp tục.
              </p>
            </div>

            <form onSubmit={handleVerifyTeacherPin} className="space-y-4">
              <div>
                <input
                  type="password"
                  autoFocus
                  required
                  value={unlockPinInput}
                  onChange={e => {
                    setUnlockPinInput(e.target.value);
                    setUnlockPinError(null);
                  }}
                  placeholder="Nhập mật mã giáo viên..."
                  className="w-full text-center tracking-widest text-2xl font-black font-mono py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-emerald-600 focus:outline-none focus:bg-white"
                />
                <span className="text-[11px] text-slate-400 block mt-1.5 font-medium">
                  (Mật mã mặc định: <strong>123456</strong> — thầy cô có thể đổi trong tab Cài đặt)
                </span>
              </div>

              {unlockPinError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold flex items-center gap-2 text-left">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{unlockPinError}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowTeacherUnlockModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs uppercase"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase shadow-md shadow-emerald-600/20"
                >
                  Mở khóa quản lý
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Nút nổi cố định quay lại chế độ Giáo viên (chỉ hiện khi giáo viên hướng dẫn, KHÔNG hiện trên máy học sinh) */}
      {showTeacherGuidanceReturn && (
        <div className="fixed bottom-5 right-5 z-[100] animate-in fade-in slide-in-from-bottom-2">
          <button
            type="button"
            onClick={handleReturnToTeacher}
            className="flex items-center gap-2 px-5 py-3 bg-slate-900/95 hover:bg-slate-800 text-white rounded-2xl font-black text-xs uppercase shadow-2xl border-2 border-emerald-500/50 hover:border-emerald-400 backdrop-blur-md transition-all active:scale-95 cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-1 transition-transform stroke-[2.5]" />
            <span>Quay lại chế độ Giáo viên</span>
          </button>
        </div>
      )}

    </div>
  );
}
