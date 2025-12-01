import { computed, inject, Injectable, signal } from '@angular/core'
import { Supabase } from '../database/supabase'
import { AuthResponse, User } from '@supabase/supabase-js'
import { OrganizationSignup, UserLogin, UserSignup } from './auth.types'

@Injectable({
  providedIn: 'root',
})
export class Auth {
  #supabase = inject(Supabase)
  #database = this.#supabase.client
  #session = signal<User | null>(null)
  session = computed(() => this.#session())

  constructor() {
    this.#database.auth.onAuthStateChange((event, session) => {
      this.#session.set(session?.user ?? null)
    })
  }

  async isAuthenticated() {
    return this.#database.auth.getClaims().then(({ data, error }) => {
      if (!data || error) return false

      return true
    })
  }

  getClaims() {
    return this.#database.auth.getClaims()
  }

  login(loginData: UserLogin) {
    const { email, password } = loginData

    return this.#database.auth
      .signInWithPassword({
        email,
        password,
      })
      .then((res) => {
        if (!res.error && res.data) {
          this.#session.set(res.data.user)
        }

        return res
      })
  }

  logout() {
    return this.#database.auth.signOut()
  }

  signup(signupData: OrganizationSignup): Promise<AuthResponse>
  signup(signupData: UserSignup): Promise<AuthResponse>

  signup(signupData: UserSignup | OrganizationSignup) {
    const { email, password, ...metadata } = signupData

    if ('cnpj' in signupData) {
      console.log(signupData)
      return this.#database.auth.signUp({
        email,
        password,
        options: {
          data: { ...metadata, user_type: 'organization' },
        },
      })
    }

    return this.#database.auth.signUp({
      email,
      password,
      options: {
        data: { ...metadata, user_type: 'volunteer' },
      },
    })
  }
}
