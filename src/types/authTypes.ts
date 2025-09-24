
export type err={
  message:string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}