import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const path = window.location.pathname;
    if (status === 401 && path !== import.meta.env.BASE_URL + 'login' && path !== import.meta.env.BASE_URL + 'sso/callback') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.location.replace(import.meta.env.BASE_URL + 'login');
    }
    return Promise.reject(error);
  }
);

export const ssoLogin = (client_id: string, token: string) =>
  api.post<{ success: boolean; token: string; user: SessionUser }>('/auth/sso', { client_id, token });

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
