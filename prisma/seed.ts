import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding data LMS UNUSU...");

  // 1. Semester Aktif
  const semester = await prisma.semester.upsert({
    where: { name: "2026/2027 Ganjil" },
    update: {},
    create: {
      name: "2026/2027 Ganjil",
      active: true,
      open: true,
    },
  });

  // 2. Dosen Pengampu
  const dosen1 = await prisma.lecturer.upsert({
    where: { nidn: "0123068901" },
    update: {},
    create: {
      nidn: "0123068901",
      name: "Junaidy, M.Kom.",
      email: "junaidy@unusu.ac.id",
    },
  });

  const dosen2 = await prisma.lecturer.upsert({
    where: { nidn: "0115049002" },
    update: {},
    create: {
      nidn: "0115049002",
      name: "Ahmad Zaki, M.Kom.",
      email: "ahmadzaki@unusu.ac.id",
    },
  });

  // 3. Mahasiswa
  const mhs1 = await prisma.student.upsert({
    where: { nim: "230101001" },
    update: {},
    create: {
      nim: "230101001",
      name: "Muhammad Fadhil",
      email: "fadhil@student.unusu.ac.id",
      prodi: "S1 Sistem Informasi",
    },
  });

  const mhs2 = await prisma.student.upsert({
    where: { nim: "230101002" },
    update: {},
    create: {
      nim: "230101002",
      name: "Aisyah Putri",
      email: "aisyah@student.unusu.ac.id",
      prodi: "S1 Sistem Informasi",
    },
  });

  // 4. Kelas Perkuliahan
  const kelasWeb = await prisma.class.upsert({
    where: {
      semesterId_code_group: {
        semesterId: semester.id,
        code: "SI-301",
        group: "Reguler A",
      },
    },
    update: {},
    create: {
      semesterId: semester.id,
      code: "SI-301",
      courseName: "Pemrograman Web Lanjut (Fullstack)",
      sks: 3,
      group: "Reguler A",
      description: "Membahas pengembangan web modern menggunakan Vite React, REST API Node.js, dan Prisma ORM.",
      schedule: "Senin, 08:00 - 10:30 WIB",
      room: "Lab Komputer 1",
      meetings: 16,
      done: 4,
      status: "active",
      lecturers: {
        create: [{ lecturerId: dosen1.id }],
      },
    },
  });

  const kelasBasisData = await prisma.class.upsert({
    where: {
      semesterId_code_group: {
        semesterId: semester.id,
        code: "SI-202",
        group: "Reguler A",
      },
    },
    update: {},
    create: {
      semesterId: semester.id,
      code: "SI-202",
      courseName: "Sistem Basis Data Relasional",
      sks: 3,
      group: "Reguler A",
      description: "Perancangan database, normalisasi data, SQL query optimization, dan integrasi ORM.",
      schedule: "Rabu, 10:45 - 13:15 WIB",
      room: "Lab Komputer 2",
      meetings: 16,
      done: 4,
      status: "active",
      lecturers: {
        create: [{ lecturerId: dosen2.id }],
      },
    },
  });

  // 5. Enroll Mahasiswa ke Kelas
  const enroll1 = await prisma.enrollment.upsert({
    where: {
      classId_studentId: {
        classId: kelasWeb.id,
        studentId: mhs1.id,
      },
    },
    update: {},
    create: {
      classId: kelasWeb.id,
      studentId: mhs1.id,
      grades: { tugas1: 90, tugas2: 85, uts: 88 },
    },
  });

  const enroll2 = await prisma.enrollment.upsert({
    where: {
      classId_studentId: {
        classId: kelasWeb.id,
        studentId: mhs2.id,
      },
    },
    update: {},
    create: {
      classId: kelasWeb.id,
      studentId: mhs2.id,
      grades: { tugas1: 88, tugas2: 92, uts: 86 },
    },
  });

  // 6. Resources Perkuliahan (Materi & Tugas)
  const materi1 = await prisma.resource.create({
    data: {
      classId: kelasWeb.id,
      type: "materials",
      title: "Pengenalan Ekosistem Web Modern & Arsitektur SPA",
      meeting: 1,
      description: "Slide kuliah pertemuan 1 mengenai Single Page Application dan Client-Server separation.",
      fileName: "Pertemuan-01-Pengenalan-SPA.pdf",
    },
  });

  const tugas1 = await prisma.resource.create({
    data: {
      classId: kelasWeb.id,
      type: "tasks",
      title: "Tugas 1: Pembuatan Komponen UI Responsif dengan Tailwind",
      meeting: 3,
      description: "Buat halaman dashboard responsive sederhana menggunakan Vite React dan Tailwind CSS. Kumpulkan link GitHub dan file zip.",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  // 7. Pengumpulan Tugas (Submission)
  await prisma.submission.upsert({
    where: {
      resourceId_enrollmentId: {
        resourceId: tugas1.id,
        enrollmentId: enroll1.id,
      },
    },
    update: {},
    create: {
      resourceId: tugas1.id,
      enrollmentId: enroll1.id,
      note: "Sudah diselesaikan dengan fitur responsive navbar dan card dashboard, Pak.",
      fileName: "Tugas1_MuhammadFadhil_230101001.zip",
      score: 90.0,
      feedback: "Implementasi komponen sudah rapi dan responsive.",
    },
  });

  // 8. Presensi Pertemuan 1
  await prisma.attendance.upsert({
    where: {
      enrollmentId_meeting: {
        enrollmentId: enroll1.id,
        meeting: 1,
      },
    },
    update: {},
    create: {
      enrollmentId: enroll1.id,
      meeting: 1,
      status: "Hadir",
    },
  });

  await prisma.attendance.upsert({
    where: {
      enrollmentId_meeting: {
        enrollmentId: enroll2.id,
        meeting: 1,
      },
    },
    update: {},
    create: {
      enrollmentId: enroll2.id,
      meeting: 1,
      status: "Hadir",
    },
  });

  console.log("Seeding data LMS UNUSU berhasil!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
