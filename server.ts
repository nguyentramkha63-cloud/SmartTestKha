import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CACHE_FILE = path.resolve(__dirname, 'rooms_cache.json');
const COMMUNITY_FILE = path.resolve(__dirname, 'community_exams.json');

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '15mb' }));

  // In-memory Exam Room store with file persistence
  const rooms = new Map<string, any>();
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const saved = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
      Object.entries(saved).forEach(([k, v]) => rooms.set(k, v));
      console.log(`[Cache] Loaded ${rooms.size} saved exam rooms.`);
    }
  } catch (err) {
    console.warn('[Cache] Could not load rooms cache:', err);
  }

  const persistRooms = () => {
    try {
      const obj: Record<string, any> = {};
      rooms.forEach((v, k) => { obj[k] = v; });
      fs.writeFileSync(CACHE_FILE, JSON.stringify(obj, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[Cache] Could not save rooms cache:', err);
    }
  };

  // In-memory Community Exams store with file persistence
  const communityExams = new Map<string, any>();
  try {
    if (fs.existsSync(COMMUNITY_FILE)) {
      const saved = JSON.parse(fs.readFileSync(COMMUNITY_FILE, 'utf-8'));
      Object.entries(saved).forEach(([k, v]) => communityExams.set(k, v));
      console.log(`[Cache] Loaded ${communityExams.size} community exams.`);
    }
  } catch (err) {
    console.warn('[Cache] Could not load community exams:', err);
  }

  const persistCommunity = () => {
    try {
      const obj: Record<string, any> = {};
      communityExams.forEach((v, k) => { obj[k] = v; });
      fs.writeFileSync(COMMUNITY_FILE, JSON.stringify(obj, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[Cache] Could not save community exams:', err);
    }
  };

  // API: Get all public community exams
  app.get('/api/community-exams', (req, res) => {
    const list = Array.from(communityExams.values());
    list.sort((a, b) => (b.sharedAt || b.createdAt || 0) - (a.sharedAt || a.createdAt || 0));
    res.json(list);
  });

  // API: Publish or update an exam in community
  app.post('/api/community-exams', (req, res) => {
    try {
      const examItem = req.body;
      if (!examItem || !examItem.id || !examItem.title) {
        return res.status(400).json({ error: 'Thiếu dữ liệu đề thi' });
      }
      examItem.visibility = 'public';
      examItem.sharedAt = Date.now();
      communityExams.set(examItem.id, examItem);
      persistCommunity();
      res.json({ success: true, item: examItem });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API: Remove exam from community (revert to private)
  app.delete('/api/community-exams/:id', (req, res) => {
    try {
      const { id } = req.params;
      communityExams.delete(id);
      persistCommunity();
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API: Create or update room with Exam Data
  app.post('/api/rooms', (req, res) => {
    try {
      const { roomCode, examData, antiCheatSettings, teacherName, allShuffledExams } = req.body;
      if (!roomCode || !examData) {
        return res.status(400).json({ error: 'Thiếu mã phòng hoặc dữ liệu đề thi' });
      }

      const existing = rooms.get(roomCode);
      const room = {
        roomCode,
        examData,
        allShuffledExams: allShuffledExams || existing?.allShuffledExams || [],
        antiCheatSettings: antiCheatSettings || {},
        teacherName: teacherName || 'Giáo viên',
        status: existing?.status || 'lobby',
        students: existing?.students || [],
        createdAt: existing?.createdAt || Date.now(),
        lastActive: Date.now()
      };

      rooms.set(roomCode, room);
      persistRooms();
      console.log(`[Room ${roomCode}] Đã mở phòng thi với ${examData.questions?.length || 0} câu hỏi`);
      res.json({ success: true, roomCode });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API: Get room info for Student or Teacher
  app.get('/api/rooms/:roomCode', (req, res) => {
    const room = rooms.get(req.params.roomCode);
    if (!room) {
      return res.status(404).json({ error: 'Phòng thi không tồn tại hoặc đã kết thúc' });
    }
    res.json(room);
  });

  // API: Student joins room (Hỗ trợ tự động nhận diện thí sinh cũ khi đổi thiết bị / rớt mạng)
  app.post('/api/rooms/:roomCode/join', (req, res) => {
    const room = rooms.get(req.params.roomCode);
    if (!room) return res.status(404).json({ error: 'Phòng thi không tồn tại' });

    const { student } = req.body;
    if (!student || !student.id) return res.status(400).json({ error: 'Thiếu thông tin học sinh' });

    // Kiểm tra học sinh đã từng vào phòng thi này trước đó chưa (so khớp Họ tên + Lớp hoặc SBD)
    const existingIdx = room.students.findIndex((s: any) => {
      if (s.id === student.id) return true;
      const matchName = s.name && student.name && s.name.trim().toLowerCase() === student.name.trim().toLowerCase();
      const matchClass = (!student.className && !s.className) || 
        ((s.className || '').trim().toLowerCase() === (student.className || '').trim().toLowerCase());
      const matchSBD = student.studentId && s.studentId && 
        s.studentId.trim().toLowerCase() === student.studentId.trim().toLowerCase();
      return (matchName && matchClass) || (matchSBD && matchName);
    });

    if (existingIdx >= 0) {
      const existing = room.students[existingIdx];
      existing.lastActive = Date.now();
      persistRooms();
      return res.json({ 
        success: true, 
        count: room.students.length, 
        resumed: true, 
        student: existing 
      });
    }

    room.students.push(student);
    room.lastActive = Date.now();
    persistRooms();
    res.json({ success: true, count: room.students.length, resumed: false });
  });

  // API: Student updates progress / violations / submit (Hỗ trợ lưu toàn bộ đáp án theo thời gian thực)
  app.post('/api/rooms/:roomCode/student-update', (req, res) => {
    const room = rooms.get(req.params.roomCode);
    if (!room) return res.status(404).json({ error: 'Phòng thi không tồn tại' });

    const { studentId, answeredCount, violations, status, score, rating, scoreDetails, answers, timeLeft } = req.body;
    const st = room.students.find((s: any) => s.id === studentId);
    if (st) {
      if (answeredCount !== undefined) st.answeredCount = answeredCount;
      if (violations !== undefined) st.violations = violations;
      if (status !== undefined) st.status = status;
      if (score !== undefined) st.score = score;
      if (rating !== undefined) st.rating = rating;
      if (scoreDetails !== undefined) st.scoreDetails = scoreDetails;
      if (answers !== undefined) st.answers = answers;
      if (timeLeft !== undefined) st.timeLeft = timeLeft;
      if (status === 'submitted') st.submittedAt = Date.now();
    }
    room.lastActive = Date.now();
    persistRooms();
    res.json({ success: true });
  });

  // API: Teacher changes room status (lobby, started, ended)
  app.post('/api/rooms/:roomCode/status', (req, res) => {
    const room = rooms.get(req.params.roomCode);
    if (!room) return res.status(404).json({ error: 'Phòng thi không tồn tại' });

    const { status } = req.body;
    room.status = status;
    persistRooms();
    res.json({ success: true, status: room.status });
  });

  // Mount Vite middlewares in development
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    // Explicit HTML fallback in dev for routes like /join, /student
    app.use('*', async (req, res, next) => {
      if (req.method !== 'GET') return next();
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
