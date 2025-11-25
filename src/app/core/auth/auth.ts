import { computed, inject, Injectable, signal } from '@angular/core'
import { Supabase } from '../database/supabase'
import { User } from '@supabase/supabase-js'
import { UserLogin, UserSignup } from './auth.types'

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
      if (event === 'INITIAL_SESSION') {
        this.#session.set(session?.user as User)
        return
      }

      if (event === 'SIGNED_OUT') {
        this.#session.set(null)
      }
    })
  }

  fetchUser() {
    return this.#database.auth.getClaims().then(({ data, error }) => {
      if (error || !data?.claims.user_metadata) return null

      return data.claims.user_metadata
    })
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

  signup(signupData: UserSignup) {
    const { email, password, ...metadata } = signupData

    return this.#database.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
  }
}
