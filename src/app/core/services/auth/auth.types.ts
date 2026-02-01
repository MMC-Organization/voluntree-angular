export interface AuthState {
  status: boolean
  userId?: number
  userType: 'VOLUNTEER' | 'ORGANIZATION'
}

export interface AuthResponse {
  authenticated: boolean
  message: string
}

export interface UserLogin {
  email: string
  password: string
}

export interface VolunteerSignup {
  name: string
  email: string
  phoneNumber: string
  password: string
  cep: string
  number: string
  cpf: string
}

export interface OrganizationSignup extends Omit<VolunteerSignup, 'cpf'> {
  cnpj: string
  cause: string
  companyName: string
}

export interface User {
  id: string
  email: string
  userType: 'VOLUNTEER' | 'ORGANIZATION'
}

export interface UserResponse {
  user: User | null
}

export interface UserDataResponse {
  data: UserResponse
  error: any
}
