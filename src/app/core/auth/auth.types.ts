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
  password: string
  location: Object
  cnpj?: string
  cause?: string
  company_name?: string
}
