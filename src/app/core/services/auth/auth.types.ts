import { User } from '@supabase/supabase-js'

export interface AuthState {
  session: User
}

export interface UserLogin {
  email: string
  password: string
}

export interface UserSignup {
  name: string
  email: string
  phone: string
  password: string
  cep: string
  number: string
}

export interface OrganizationSignup extends UserSignup {
  cnpj: string
  cause: string
  company_name: string
}
