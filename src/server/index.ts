import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

// Serve static frontend build files in production
const clientDistPath = path.resolve(process.cwd(), "dist/client");
app.use(express.static(clientDistPath));

// Health Check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", app: "LMS UNUSU API", time: new Date().toISOString() });
});

// ==========================================
// PORTAL MAHASISWA LMS
// ==========================================

// Daftar Kelas Mahasiswa (misal filter by studentId / default mhs1)
app.get("/api/mahasiswa/classes", async (req: Request, res: Response) => {
  try {
    const studentId = parseInt(req.query.studentId as string) || 1;
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId },
      include: {
        class: {
          include: {
            semester: true,
            lecturers: {
              include: { lecturer: true }
            },
            resources: true,
          }
        }
      }
    });

    const classes = enrollments.map(e => ({
      enrollmentId: e.id,
      grades: e.grades,
      ...e.class,
    }));

    res.json({ success: true, data: classes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil data kelas mahasiswa" });
  }
});

// Detail Kelas & Materi/Tugas
app.get("/api/classes/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const kelas = await prisma.class.findUnique({
      where: { id },
      include: {
        semester: true,
        lecturers: { include: { lecturer: true } },
        resources: {
          orderBy: { meeting: "asc" }
        },
        enrollments: {
          include: { student: true }
        }
      }
    });

    if (!kelas) {
      return res.status(404).json({ success: false, message: "Kelas tidak ditemukan" });
    }

    res.json({ success: true, data: kelas });
  } catch (error) {
    res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
});

// Daftar Tugas Mendatang Mahasiswa
app.get("/api/mahasiswa/tasks", async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.resource.findMany({
      where: { type: "tasks" },
      include: {
        class: true,
        submissions: true,
      },
      orderBy: { dueDate: "asc" }
    });
    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil daftar tugas" });
  }
});

// Submit Tugas Mahasiswa
app.post("/api/mahasiswa/submit", async (req: Request, res: Response) => {
  try {
    const { resourceId, enrollmentId, note, fileName } = req.body;
    const submission = await prisma.submission.upsert({
      where: {
        resourceId_enrollmentId: {
          resourceId: Number(resourceId),
          enrollmentId: Number(enrollmentId),
        }
      },
      update: {
        note,
        fileName: fileName || "tugas_submission.pdf",
        submittedAt: new Date(),
      },
      create: {
        resourceId: Number(resourceId),
        enrollmentId: Number(enrollmentId),
        note,
        fileName: fileName || "tugas_submission.pdf",
        submittedAt: new Date(),
      }
    });

    res.json({ success: true, data: submission, message: "Tugas berhasil dikumpulkan!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengumpulkan tugas" });
  }
});

// ==========================================
// PORTAL DOSEN LMS
// ==========================================

// Daftar Kelas yang Diampu Dosen
app.get("/api/dosen/classes", async (req: Request, res: Response) => {
  try {
    const lecturerId = parseInt(req.query.lecturerId as string) || 1;
    const classLecturers = await prisma.classLecturer.findMany({
      where: { lecturerId },
      include: {
        class: {
          include: {
            semester: true,
            _count: {
              select: { enrollments: true, resources: true }
            }
          }
        }
      }
    });

    const classes = classLecturers.map(cl => cl.class);
    res.json({ success: true, data: classes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil kelas dosen" });
  }
});

// Dosen membuat Resource (Materi / Tugas Baru)
app.post("/api/dosen/resources", async (req: Request, res: Response) => {
  try {
    const { classId, type, title, meeting, description, fileName, dueDate } = req.body;
    const resource = await prisma.resource.create({
      data: {
        classId: Number(classId),
        type,
        title,
        meeting: Number(meeting) || 1,
        description,
        fileName,
        dueDate: dueDate ? new Date(dueDate) : null,
      }
    });
    res.json({ success: true, data: resource, message: "Resource berhasil ditambahkan!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal membuat materi/tugas" });
  }
});

// Dosen Memberi Nilai Submission Mahasiswa
app.put("/api/dosen/submissions/:id/grade", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { score, feedback } = req.body;

    const updated = await prisma.submission.update({
      where: { id },
      data: {
        score: Number(score),
        feedback,
      }
    });

    res.json({ success: true, data: updated, message: "Nilai berhasil disimpan" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal memperbarui nilai" });
  }
});

// Rekap Presensi Kelas
app.get("/api/classes/:id/attendance", async (req: Request, res: Response) => {
  try {
    const classId = parseInt(req.params.id);
    const enrollments = await prisma.enrollment.findMany({
      where: { classId },
      include: {
        student: true,
        attendances: {
          orderBy: { meeting: "asc" }
        }
      }
    });
    res.json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil rekap presensi" });
  }
});

// Fallback all non-API routes to index.html (SPA History Fallback)
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(clientDistPath, "index.html"), (err) => {
    if (err) {
      res.status(200).send("LMS UNUSU Server Running. Build the client using 'npm run build:client' to serve the UI.");
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 LMS UNUSU Monolith Server running on http://localhost:${PORT}`);
});
