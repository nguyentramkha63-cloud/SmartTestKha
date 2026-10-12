import React, { useState } from 'react';
import { 
  UserCheck, 
  X, 
  UserPlus, 
  ShieldCheck, 
  CheckCircle2, 
  Trash2, 
  Pencil, 
  Check, 
  LogOut, 
  Sparkles,
  School,
  Lock
} from 'lucide-react';
import { TeacherAccount, DEFAULT_TEACHER_ACCOUNT } from '../types';

interface TeacherAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAccount: TeacherAccount;
  accountsList: TeacherAccount[];
  onSwitchAccount: (account: TeacherAccount) => void;
  onUpdateAccountsList: (list: TeacherAccount[]) => void;
  onUpdateCurrentAccount: (account: TeacherAccount) => void;
}

const AVATAR_COLORS = [
  'from-emerald-600 to-teal-700',
  'from-blue-600 to-indigo-700',
  'from-purple-600 to-pink-700',
  'from-amber-600 to-orange-700',
  'from-rose-600 to-red-700',
  'from-cyan-600 to-blue-700'
];

export const TeacherAccountModal: React.FC<TeacherAccountModalProps> = ({
  isOpen,
  onClose,
  currentAccount,
  accountsList,
  onSwitchAccount,
  onUpdateAccountsList,
  onUpdateCurrentAccount,
}) => {
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [isEditingCurrent, setIsEditingCurrent] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(currentAccount.name || '');
  const [editEmail, setEditEmail] = useState<string>(currentAccount.email || '');
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleSelectAccount = (acc: TeacherAccount) => {
    if (acc.id === currentAccount.id) return;
    onSwitchAccount(acc);
    showFeedback(`Đã đổi sang tài khoản: ${acc.name}`, 'success');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = editName.trim();
    const cleanEmail = editEmail.trim().toLowerCase();
    if (!cleanName || !cleanEmail) {
      showFeedback('Vui lòng nhập đầy đủ họ tên và email', 'error');
      return;
    }

    const updatedAccount: TeacherAccount = {
      ...currentAccount,
      name: cleanName,
      email: cleanEmail,
      id: cleanEmail // Cập nhật ID theo email mới nếu muốn
    };

    const updatedList = accountsList.map(a => 
      a.id === currentAccount.id ? updatedAccount : a
    );

    onUpdateAccountsList(updatedList);
    onUpdateCurrentAccount(updatedAccount);
    setIsEditingCurrent(false);
    showFeedback('Đã cập nhật thông tin tài khoản thành công!', 'success');
  };

  const handleAddNewAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newName.trim();
    const cleanEmail = newEmail.trim().toLowerCase();
    if (!cleanName || !cleanEmail) {
      showFeedback('Vui lòng điền đầy đủ họ tên và email!', 'error');
      return;
    }

    // Kiểm tra tài khoản đã tồn tại chưa
    const existing = accountsList.find(a => a.id.toLowerCase() === cleanEmail || a.email.toLowerCase() === cleanEmail);
    if (existing) {
      onSwitchAccount(existing);
      setNewName('');
      setNewEmail('');
      setIsAddingNew(false);
      showFeedback(`Đã chuyển sang tài khoản sẵn có: ${existing.name}`, 'success');
      return;
    }

    const newAcc: TeacherAccount = {
      id: cleanEmail,
      name: cleanName,
      email: cleanEmail,
      avatarColor: AVATAR_COLORS[accountsList.length % AVATAR_COLORS.length]
    };

    const updatedList = [...accountsList, newAcc];
    onUpdateAccountsList(updatedList);
    onSwitchAccount(newAcc);
    setNewName('');
    setNewEmail('');
    setIsAddingNew(false);
    showFeedback(`Đã tạo và đăng nhập thành công: ${cleanName}`, 'success');
  };

  const handleDeleteAccount = (accToDelete: TeacherAccount, e: React.MouseEvent) => {
    e.stopPropagation();
    if (accountsList.length <= 1) {
      showFeedback('Không thể xóa tài khoản duy nhất còn lại trên máy!', 'error');
      return;
    }

    const confirmed = window.confirm(`Thầy cô có chắc muốn xóa tài khoản "${accToDelete.name}" khỏi danh sách đăng nhập trên thiết bị này? (Dữ liệu trên máy chủ không bị mất)`);
    if (!confirmed) return;

    const remaining = accountsList.filter(a => a.id !== accToDelete.id);
    onUpdateAccountsList(remaining);

    // Nếu xóa đúng tài khoản đang chọn, chuyển sang tài khoản đầu tiên còn lại
    if (accToDelete.id === currentAccount.id) {
      onSwitchAccount(remaining[0]);
    }
    showFeedback(`Đã xóa tài khoản ${accToDelete.name} khỏi máy!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-[120] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div 
        className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase text-slate-900 tracking-tight">
                Tài khoản Giáo viên & Đổi tài khoản
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Mọi tác vụ soạn đề, kho riêng tư và thi online đều gắn với tài khoản này
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback message banner */}
        {feedbackMsg && (
          <div className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in ${
            feedbackMsg.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Thông tin tài khoản ĐANG ĐĂNG NHẬP */}
        <div className="p-4 bg-gradient-to-br from-emerald-50/80 to-teal-50/50 border border-emerald-200 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Tài khoản đang hoạt động
            </span>
            <button
              type="button"
              onClick={() => {
                setIsEditingCurrent(!isEditingCurrent);
                setEditName(currentAccount.name);
                setEditEmail(currentAccount.email);
              }}
              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>{isEditingCurrent ? 'Hủy sửa' : 'Sửa thông tin'}</span>
            </button>
          </div>

          {!isEditingCurrent ? (
            <div className="flex items-center gap-3.5 bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${currentAccount.avatarColor || 'from-emerald-600 to-teal-500'} text-white font-black text-lg flex items-center justify-center shadow-sm shrink-0`}>
                {currentAccount.name ? currentAccount.name.slice(0, 1).toUpperCase() : 'G'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-black text-slate-900 flex items-center gap-2 truncate">
                  <span>{currentAccount.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider shrink-0">
                    Đang dùng
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium truncate mt-0.5">
                  {currentAccount.email}
                </div>
                <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Kho đề riêng tư hoàn toàn độc lập & bảo mật</span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveEdit} className="space-y-2.5 bg-white p-3 rounded-xl border border-emerald-200">
              <div className="text-xs font-bold text-slate-700">Chỉnh sửa họ tên & email:</div>
              <input
                type="text"
                required
                value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder="Họ và tên giáo viên..."
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
              />
              <input
                type="email"
                required
                value={editEmail}
                onChange={e => setEditEmail(e.target.value)}
                placeholder="Email tài khoản..."
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
              />
              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditingCurrent(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black flex items-center gap-1 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" /> Lưu thay đổi
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Danh sách các tài khoản để ĐỔI NHANH */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-700 tracking-wide flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-600" /> Chọn tài khoản muốn đổi sang:
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              ({accountsList.length} tài khoản)
            </span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {accountsList.map((acc) => {
              const isActive = acc.id === currentAccount.id;
              return (
                <div
                  key={acc.id}
                  onClick={() => handleSelectAccount(acc)}
                  className={`p-3 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    isActive
                      ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${acc.avatarColor || 'from-emerald-600 to-teal-500'} text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs`}>
                      {acc.name ? acc.name.slice(0, 1).toUpperCase() : 'G'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-black text-slate-900 flex items-center gap-2 truncate">
                        <span>{acc.name}</span>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider shrink-0">
                            Đang dùng
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{acc.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isActive ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectAccount(acc);
                        }}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black rounded-lg transition-all shadow-xs"
                      >
                        Đổi sang
                      </button>
                    )}

                    {accountsList.length > 1 && !isActive && (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteAccount(acc, e)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Xóa tài khoản này khỏi máy"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form ĐĂNG NHẬP HOẶC THÊM TÀI KHOẢN MỚI */}
        {!isAddingNew ? (
          <button
            type="button"
            onClick={() => setIsAddingNew(true)}
            className="w-full py-2.5 border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/40 text-slate-700 hover:text-emerald-800 rounded-2xl text-xs font-black uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-emerald-600" />
            <span>Đăng nhập hoặc thêm tài khoản mới</span>
          </button>
        ) : (
          <form onSubmit={handleAddNewAccount} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-emerald-600" /> Đăng nhập tài khoản mới:
              </span>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Đóng form
              </button>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Họ và tên giáo viên <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="VD: Thầy Nguyễn Văn An hoặc Cô Mai Lan..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:border-emerald-500 focus:outline-none shadow-2xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Email / Tên đăng nhập <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  required
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="VD: nguyenvanan@school.edu.vn..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:border-emerald-500 focus:outline-none shadow-2xs"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Đăng nhập & Đổi sang tài khoản này</span>
              </button>
            </div>
          </form>
        )}

        {/* Footer info note */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-500 font-medium leading-relaxed">
          <span className="font-bold text-slate-700">🔒 Phân quyền độc lập:</span> Khi chuyển tài khoản, ứng dụng sẽ tự động tải riêng kho đề thi, phòng thi và kết quả bài làm của tài khoản đó. Các tài khoản khác sẽ không thể can thiệp hay xóa nhầm.
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase rounded-xl transition-all shadow-md shadow-emerald-600/20"
          >
            Hoàn tất & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
