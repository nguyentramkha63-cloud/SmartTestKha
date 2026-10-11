import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  X, 
  Clock, 
  BookOpen, 
  Eye, 
  Settings, 
  ShieldCheck, 
  Save, 
  Pencil, 
  Check, 
  ArrowRight, 
  Globe, 
  Lock, 
  FileCode
} from 'lucide-react';
import type { ExamData, Question } from '../types';
import { extractTextFromFile, parseExamWithAI, parseExamOffline } from '../utils/examParser';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface UploadExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string | null;
  onExamExtractedAndSaved: (exam: ExamData, action: 'save_to_library' | 'load_to_step3' | 'open_config') => void;
  defaultSubject?: string;
  defaultGrade?: string;
}

export function UploadExamModal({
  isOpen,
  onClose,
  apiKey,
  onExamExtractedAndSaved,
  defaultSubject = 'Toán',
  defaultGrade = 'Khối 12'
}: UploadExamModalProps) {
  const [activeTab, setActiveTab] = useState<'file' | 'text'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState<string>('');
  const [subject, setSubject] = useState<string>(defaultSubject);
  const [grade, setGrade] = useState<string>(defaultGrade);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Review Mode after extraction
  const [extractedExam, setExtractedExam] = useState<ExamData | null>(null);
  const [isEditingMeta, setIsEditingMeta] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editDuration, setEditDuration] = useState<number>(45);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setErrorMessage(null);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setErrorMessage(null);
    }
  };

  const handleStartExtraction = async () => {
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      let rawText = '';
      if (activeTab === 'file') {
        if (!selectedFile) {
          throw new Error('Vui lòng chọn file đề thi (Word, PDF hoặc Text) để tải lên!');
        }
        setProcessingStep(`Đang đọc nội dung từ file "${selectedFile.name}"...`);
        rawText = await extractTextFromFile(selectedFile);
      } else {
        if (!pastedText.trim()) {
          throw new Error('Vui lòng dán nội dung văn bản đề thi vào ô bên dưới!');
        }
        rawText = pastedText.trim();
      }

      if (!rawText || rawText.trim().length < 20) {
        throw new Error('Nội dung đề thi quá ngắn hoặc không đọc được văn bản.');
      }

      let parsed: ExamData;
      if (apiKey && apiKey.trim().length > 10) {
        setProcessingStep('Đang sử dụng Gemini AI phân tích câu trúc, phân loại câu hỏi (MCQ, Đúng/Sai, Trả lời ngắn, Tự luận) và gắn đáp án chuẩn...');
        try {
          parsed = await parseExamWithAI(rawText, apiKey);
        } catch (aiErr) {
          console.warn('AI parsing failed, falling back to offline parser:', aiErr);
          setProcessingStep('AI tạm thời quá tải, đang chuyển sang bộ trích xuất quy tắc nội bộ...');
          parsed = parseExamOffline(rawText, subject, grade);
        }
      } else {
        setProcessingStep('Đang trích xuất câu hỏi, loại câu và đáp án bằng bộ quy tắc...');
        parsed = parseExamOffline(rawText, subject, grade);
      }

      // Ensure fallback metadata if empty
      if (!parsed.subject) parsed.subject = subject;
      if (!parsed.grade) parsed.grade = grade;
      if (!parsed.duration) parsed.duration = 45;

      setExtractedExam(parsed);
      setEditTitle(parsed.title);
      setEditDuration(Number(parsed.duration) || 45);
    } catch (err: any) {
      console.error('Extraction error:', err);
      setErrorMessage(err.message || 'Đã có lỗi xảy ra trong quá trình trích xuất đề thi.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const handleSaveToPrivateLibrary = (examToSave: ExamData) => {
    try {
      const existingStr = localStorage.getItem('smarttest_exam_library');
      const library = existingStr ? JSON.parse(existingStr) : [];
      const newId = 'lib_ext_' + Date.now();
      
      const libraryItem = {
        id: newId,
        title: examToSave.title,
        subject: examToSave.subject,
        grade: examToSave.grade,
        duration: Number(examToSave.duration) || 45,
        questionsCount: examToSave.questions?.length || 0,
        examData: examToSave,
        allShuffledExams: [examToSave],
        createdAt: Date.now(),
        visibility: 'private', // Luôn nằm trong Kho riêng tư theo yêu cầu người dùng
        author: 'Tôi (Giáo viên)',
        isExternalUpload: true,
        source: selectedFile ? `File: ${selectedFile.name}` : 'Nguồn bên ngoài',
        config: {
          allowShuffleCodes: true,
          requireFullscreen: true,
          detectTabSwitch: true,
          maxViolations: 3,
          preventCopyInspect: true,
          showSolutionsAfterSubmit: true,
          minSubmitMinutes: Math.min(15, Math.floor((Number(examToSave.duration) || 45) / 3)),
          maxAttempts: 1
        },
        sessions: []
      };

      const updatedLib = [libraryItem, ...library].slice(0, 60);
      localStorage.setItem('smarttest_exam_library', JSON.stringify(updatedLib));
    } catch (e) {
      console.warn('Lỗi lưu kho riêng tư:', e);
    }
  };

  // Actions for Review Step
  const handleConfirmAction = (action: 'save_to_library' | 'load_to_step3' | 'open_config') => {
    if (!extractedExam) return;
    const finalExam: ExamData = {
      ...extractedExam,
      title: editTitle.trim() || extractedExam.title,
      duration: editDuration || 45
    };

    // Auto-save to private library in all cases
    handleSaveToPrivateLibrary(finalExam);
    onExamExtractedAndSaved(finalExam, action);
    onClose();
  };

  const mcqCount = extractedExam?.questions.filter(q => q.type === 'MCQ').length || 0;
  const tfCount = extractedExam?.questions.filter(q => q.type === 'TF').length || 0;
  const saCount = extractedExam?.questions.filter(q => q.type === 'SA').length || 0;
  const tlCount = extractedExam?.questions.filter(q => q.type === 'TL').length || 0;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-5 bg-slate-900/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-[32px] w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp">
        
        {/* MODAL HEADER */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-center justify-between gap-4 border-b border-emerald-800/60 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-2xl shrink-0">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" /> Tự động lưu vào Kho riêng tư
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Chuẩn GDPT 2018
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mt-1 truncate">
                {extractedExam ? 'Xem lại & Hiệu chỉnh đề thi đã trích xuất' : 'Tải lên đề thi từ nguồn khác'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-2xl transition-colors shrink-0"
            title="Đóng"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          {errorMessage && (
            <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl text-rose-800 text-sm font-bold flex items-start gap-3 animate-fadeIn">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-black">Không thể hoàn tất trích xuất:</p>
                <p className="font-medium text-xs text-rose-700">{errorMessage}</p>
              </div>
            </div>
          )}

          {!extractedExam ? (
            /* UPLOAD & PARSE FORM */
            <div className="space-y-6">
              {/* Tabs: Upload File vs Paste Text */}
              <div className="flex p-1.5 bg-slate-100 rounded-2xl max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('file')}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'file' 
                      ? 'bg-white text-emerald-900 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Tải lên file Word (.docx) / PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('text')}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'text' 
                      ? 'bg-white text-emerald-900 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileCode className="w-4 h-4" />
                  <span>Dán văn bản đề thi</span>
                </button>
              </div>

              {activeTab === 'file' ? (
                /* FILE UPLOAD DROPZONE */
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center transition-all cursor-pointer ${
                    selectedFile 
                      ? 'border-emerald-500 bg-emerald-50/40' 
                      : 'border-slate-300 hover:border-emerald-400 bg-slate-50/60 hover:bg-slate-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".docx,.pdf,.txt,.json,.md"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  {selectedFile ? (
                    <div className="space-y-3">
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                        <CheckCircle2 className="w-9 h-9" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-slate-900">{selectedFile.name}</h4>
                        <p className="text-xs text-slate-500 font-medium">
                          Kích thước: {(selectedFile.size / 1024).toFixed(1)} KB • Sẵn sàng trích xuất
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                        className="text-xs font-bold text-rose-600 hover:text-rose-800 underline"
                      >
                        Chọn file khác
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-16 h-16 bg-slate-200/80 text-slate-600 rounded-2xl flex items-center justify-center mx-auto">
                        <Upload className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-slate-800">
                          Kéo thả hoặc bấm để tải lên file đề thi
                        </h4>
                        <p className="text-xs text-slate-500 font-medium max-w-md mx-auto mt-1">
                          Hỗ trợ định dạng Microsoft Word (<strong>.docx</strong>), tài liệu <strong>.pdf</strong>, <strong>.txt</strong> hoặc <strong>.json</strong>.
                        </p>
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 shadow-xs">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Tự động nhận diện công thức Toán, bảng đáp án, loại câu hỏi GDPT 2018
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* TEXTAREA PASTE */
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Nội dung văn bản đề thi:</span>
                    <span className="text-[11px] text-slate-400 font-normal">Có thể dán cả đề kèm bảng đáp án ở cuối</span>
                  </label>
                  <textarea
                    rows={10}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Dán nội dung đề thi tại đây... (Bao gồm Phần I trắc nghiệm A B C D, Phần II Đúng/Sai a b c d, Phần III trả lời ngắn, và bảng đáp án nếu có)"
                    className="w-full p-4 rounded-2xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs font-mono leading-relaxed bg-slate-50"
                  />
                </div>
              )}

              {/* Subject & Grade Defaults */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Môn học:</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none"
                  >
                    {['Toán', 'Vật lí', 'Hóa học', 'Sinh học', 'Lịch sử', 'Địa lí', 'GDKT & PL', 'Tin học', 'Tiếng Anh', 'Công nghệ', 'Ngữ văn', 'KHTN'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Khối lớp:</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none"
                  >
                    {['Khối 6', 'Khối 7', 'Khối 8', 'Khối 9', 'Khối 10', 'Khối 11', 'Khối 12'].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Extraction method info */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950 space-y-1 font-medium">
                  <p className="font-black text-emerald-900">
                    Cơ chế trích xuất đề thông minh:
                  </p>
                  <p>
                    {apiKey 
                      ? 'Hệ thống sẽ kết hợp Gemini AI và bộ phân tích ngữ nghĩa để nhận diện đầy đủ công thức LaTeX ($...$), các phân mục Phần I, II, III, IV và tự động dò khớp bảng đáp án ở cuối đề.'
                      : 'Hệ thống sử dụng bộ phân tích quy tắc cấu trúc chuẩn GDPT 2018 để tách từng câu, phương án A-B-C-D, ý Đúng/Sai và đáp số ngắn.'}
                  </p>
                </div>
              </div>

              {/* Start Extraction Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  disabled={isProcessing || (activeTab === 'file' ? !selectedFile : !pastedText.trim())}
                  onClick={handleStartExtraction}
                  className="px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{processingStep || 'Đang trích xuất...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>BẮT ĐẦU TRÍCH XUẤT ĐỀ THI</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* REVIEW & CONFIGURE EXTRACTED EXAM */
            <div className="space-y-6 animate-fadeIn">
              {/* Top Banner: Extraction Summary */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border-2 border-emerald-300 rounded-3xl space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-emerald-600 text-white rounded-xl shadow-xs">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-black text-emerald-900 uppercase tracking-wider">
                      Trích xuất thành công • Sẽ lưu vào Kho riêng tư
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingMeta(!isEditingMeta)}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-300 rounded-xl shadow-2xs"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>{isEditingMeta ? 'Lưu chỉnh sửa' : 'Đổi thông tin đề / Thời gian'}</span>
                  </button>
                </div>

                {isEditingMeta ? (
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Tiêu đề đề thi:</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full p-2 bg-white border border-emerald-400 rounded-xl text-xs font-bold text-slate-900 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Môn học:</label>
                      <select
                        value={extractedExam.subject}
                        onChange={(e) => setExtractedExam({ ...extractedExam, subject: e.target.value })}
                        className="w-full p-2 bg-white border border-emerald-400 rounded-xl text-xs font-bold text-slate-900 outline-none"
                      >
                        {['Toán', 'Vật lí', 'Hóa học', 'Sinh học', 'Lịch sử', 'Địa lí', 'GDKT & PL', 'Tin học', 'Tiếng Anh', 'Công nghệ', 'Ngữ văn', 'KHTN'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Khối lớp:</label>
                      <select
                        value={extractedExam.grade}
                        onChange={(e) => setExtractedExam({ ...extractedExam, grade: e.target.value })}
                        className="w-full p-2 bg-white border border-emerald-400 rounded-xl text-xs font-bold text-slate-900 outline-none"
                      >
                        {['Khối 6', 'Khối 7', 'Khối 8', 'Khối 9', 'Khối 10', 'Khối 11', 'Khối 12'].map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1 sm:col-span-4">
                      <label className="text-[11px] font-bold text-slate-600">Thời gian làm bài (phút):</label>
                      <input
                        type="number"
                        min={5}
                        max={180}
                        value={editDuration}
                        onChange={(e) => setEditDuration(parseInt(e.target.value, 10) || 45)}
                        className="w-full sm:w-48 p-2 bg-white border border-emerald-400 rounded-xl text-xs font-bold text-slate-900 outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase">
                      {editTitle}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-semibold mt-1">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-600" /> Môn: <strong>{extractedExam.subject}</strong>
                      </span>
                      <span>•</span>
                      <span>Khối: <strong>{extractedExam.grade}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" /> Thời gian: <strong>{editDuration} phút</strong>
                      </span>
                      <span>•</span>
                      <span>Tổng: <strong className="text-emerald-700">{extractedExam.questions.length} câu hỏi</strong></span>
                    </div>
                  </div>
                )}

                {/* Question Type Statistics Badges */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-emerald-200/80">
                  <div className="px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs">
                    Phần I (Trắc nghiệm 4 lựa chọn): <span className="text-emerald-700 font-black">{mcqCount}</span> câu
                  </div>
                  <div className="px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs">
                    Phần II (Đúng/Sai): <span className="text-teal-700 font-black">{tfCount}</span> câu
                  </div>
                  <div className="px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs">
                    Phần III (Trả lời ngắn): <span className="text-indigo-700 font-black">{saCount}</span> câu
                  </div>
                  {tlCount > 0 && (
                    <div className="px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs">
                      Phần IV (Tự luận): <span className="text-amber-700 font-black">{tlCount}</span> câu
                    </div>
                  )}
                </div>
              </div>

              {/* Questions List Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
                    <Eye className="w-4 h-4 text-emerald-600" />
                    <span>Nội dung chi tiết các câu hỏi ({extractedExam.questions.length})</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Có thể biên tập thêm tại Bước 3 hoặc mở phòng thi online
                  </span>
                </div>

                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {extractedExam.questions.map((q, idx) => {
                    return (
                      <div 
                        key={q.id || idx}
                        className="p-4 bg-slate-50/80 hover:bg-white border border-slate-200 rounded-2xl space-y-2.5 transition-all shadow-2xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 bg-slate-800 text-white rounded-lg text-xs font-black">
                              Câu {idx + 1}
                            </span>
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${
                              q.type === 'MCQ' ? 'bg-emerald-100 text-emerald-800' :
                              q.type === 'TF' ? 'bg-teal-100 text-teal-800' :
                              q.type === 'SA' ? 'bg-indigo-100 text-indigo-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {q.type === 'MCQ' ? 'Phần I: 4 Lựa chọn' :
                               q.type === 'TF' ? 'Phần II: Đúng / Sai' :
                               q.type === 'SA' ? 'Phần III: Trả lời ngắn' :
                               'Tự luận'}
                            </span>
                            <span className="text-[11px] text-slate-500 font-semibold">
                              ({q.points || (q.type === 'MCQ' ? 0.25 : q.type === 'TF' ? 1.0 : 0.5)} điểm)
                            </span>
                          </div>
                        </div>

                        {/* Question Content */}
                        <div className="text-xs text-slate-800 font-medium leading-relaxed prose prose-sm max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {q.content}
                          </ReactMarkdown>
                        </div>

                        {/* MCQ Options */}
                        {q.type === 'MCQ' && q.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {q.options.map(opt => (
                              <div
                                key={opt.id}
                                className={`p-2 rounded-xl text-xs flex items-start gap-2 border ${
                                  opt.isCorrect 
                                    ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-950' 
                                    : 'bg-white border-slate-200 text-slate-700'
                                }`}
                              >
                                <span className={`w-5 h-5 rounded-lg text-[11px] font-black flex items-center justify-center shrink-0 ${
                                  opt.isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {opt.id}
                                </span>
                                <div className="min-w-0 prose prose-sm">
                                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                    {opt.text}
                                  </ReactMarkdown>
                                </div>
                                {opt.isCorrect && (
                                  <Check className="w-4 h-4 text-emerald-600 ml-auto shrink-0" />
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* TF Sub-questions */}
                        {q.type === 'TF' && q.tfSubQuestions && (
                          <div className="space-y-1.5 pt-1">
                            {q.tfSubQuestions.map(sub => (
                              <div
                                key={sub.id}
                                className="p-2 bg-white border border-slate-200 rounded-xl text-xs flex items-center justify-between gap-2"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="font-black text-slate-700">{sub.id})</span>
                                  <div className="prose prose-sm">
                                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                      {sub.text}
                                    </ReactMarkdown>
                                  </div>
                                </div>
                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black shrink-0 ${
                                  sub.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {sub.isCorrect ? 'ĐÚNG' : 'SAI'}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* SA Sub-questions */}
                        {q.type === 'SA' && q.saSubQuestions && (
                          <div className="p-2.5 bg-indigo-50/60 border border-indigo-200 rounded-xl text-xs space-y-1">
                            <span className="font-bold text-indigo-900">Đáp án ngắn:</span>
                            {q.saSubQuestions.map((sa, sIdx) => (
                              <div key={sa.id || sIdx} className="font-mono font-black text-indigo-700">
                                ➔ {sa.answer || 'Chưa có đáp số'}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* TL Solution */}
                        {q.type === 'TL' && q.solution && (
                          <div className="p-2.5 bg-amber-50/60 border border-amber-200 rounded-xl text-xs text-amber-950">
                            <span className="font-bold">Hướng dẫn giải / Đáp án:</span> {q.solution}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ACTION: ĐƯA VÀO THƯ VIỆN ĐỀ THI ONLINE */}
              <div className="p-5 sm:p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black uppercase text-emerald-400 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>Lưu trữ đề thi đã trích xuất</span>
                    </h4>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-xl">
                      Đề thi sẽ được lưu tự động trong <strong>Kho riêng tư</strong> của thầy cô (chỉ mình thầy cô thấy và tổ chức thi trực tuyến).
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleConfirmAction('save_to_library')}
                    className="px-6 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-tight rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-95 transition-all cursor-pointer shrink-0 group"
                  >
                    <Globe className="w-5 h-5 text-slate-950" />
                    <span>Đưa vào Thư viện đề thi online</span>
                    <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Bottom buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setExtractedExam(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs"
                >
                  ← Tải file khác
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
