export interface User {
  id: string
  userName: string
  email: string
  roles?: string[]
}

export interface LoginRequest {
  userName: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface RegisterRequest {
  userName: string
  email: string
  password: string
}

