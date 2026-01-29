export interface AuthState {
  status: boolean
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
