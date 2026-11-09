import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env?.VITE_API_URL || 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==========================================
// SESI SSO ONE UNUSU
// ==========================================
export interface SessionUser {
  id: number;
  username: string;
  nama: string;
  email: string | null;
  role: string;
  ssoRole: string;
  nim?: string | null;
  nidn?: string | null;
  prodi?: string | null;
  fakultas?: string | null;
}

const TOKEN_KEY = 'lms_unusu_token';
const USER_KEY = 'lms_unusu_user';

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Rute publik yang boleh dibuka tanpa sesi. Respons 401 TIDAK boleh melempar
 * pengguna ke /login dari halaman-halaman ini.
 *
 * Cara lama membandingkan `window.location.pathname` dengan `BASE_URL + 'login'`.
 * Perbandingan itu rapuh: bila BASE_URL bukan '/' atau pathname berakhir garis
 * miring, hasilnya tidak cocok sehingga halaman publik seperti '/' ikut
 * terlempar ke /login. Sekarang pathname dinormalisasi lalu dicocokkan ke
 * daftar rute publik yang eksplisit.
 */
const PUBLIC_PATHS = ['/', '/login', '/sso/callback', '/akses-ditolak'];

const isPublicPath = (pathname: string) => {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  let path = pathname;
  if (base && path.startsWith(base)) {
    path = path.slice(base.length);
  }
  path = path.replace(/\/+$/, '').replace(/\/index\.html$/, '');
  return PUBLIC_PATHS.includes(path || '/');
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const path = window.location.pathname;
    if (status === 401 && !isPublicPath(path)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.location.replace(import.meta.env.BASE_URL + 'login');
    }
    return Promise.reject(error);
  }
);

export const ssoLogin = (token: string, client_id?: string) =>
  api.post<{ success: boolean; token: string; user: SessionUser; message?: string }>('/auth/sso', { client_id: client_id || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SSO_CLIENT_ID) || 'cli_lms_8f3b2a1c', token });

export interface ClassItem {
  id: number;
  code: string;
  courseName: string;
  sks: number;
  group: string;
  description?: string;
  schedule?: string;
  room?: string;
  meetings: number;
  done: number;
  status: string;
  semester?: {
    id: number;
    name: string;
    active: boolean;
  };
  lecturers?: Array<{
    lecturer: {
      id: number;
      name: string;
      nidn: string;
      email?: string;
    };
  }>;
  resources?: ResourceItem[];
}

export interface ResourceItem {
  id: number;
  classId: number;
  type: 'materials' | 'tasks' | 'quizzes' | 'threads';
  title: string;
  meeting: number;
  description?: string;
  fileName?: string;
  filePath?: string;
  dueDate?: string;
  submissions?: SubmissionItem[];
}

export interface SubmissionItem {
  id: number;
  resourceId: number;
  enrollmentId: number;
  note?: string;
  fileName?: string;
  score?: number;
  feedback?: string;
  submittedAt: string;
}

export const fetchMahasiswaClasses = (studentId = 1) => api.get<{ success: boolean; data: any[] }>(`/mahasiswa/classes?studentId=${studentId}`);
export const fetchClassDetail = (id: number) => api.get<{ success: boolean; data: ClassItem }>(`/classes/${id}`);
export const fetchMahasiswaTasks = () => api.get<{ success: boolean; data: ResourceItem[] }>('/mahasiswa/tasks');
export const submitMahasiswaTask = (data: { resourceId: number; enrollmentId: number; note: string; fileName?: string }) => 
  api.post('/mahasiswa/submit', data);

export const fetchDosenClasses = (lecturerId = 1) => api.get<{ success: boolean; data: ClassItem[] }>(`/dosen/classes?lecturerId=${lecturerId}`);
export const createDosenResource = (data: any) => api.post('/dosen/resources', data);
export const gradeSubmission = (id: number, data: { score: number; feedback?: string }) => 
  api.put(`/dosen/submissions/${id}/grade`, data);
export const fetchClassAttendance = (id: number) => api.get<{ success: boolean; data: any[] }>(`/classes/${id}/attendance`);

export default api;
