import { inject, Injectable, signal } from '@angular/core'
import { Supabase } from '../data/supabase'
import { from } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class Auth {
  #supabase = inject(Supabase)
  #database = this.#supabase.client

  constructor() {}

  get authState() {
    return this.#database.auth.getClaims().then((res) => {
      if (res.error || !res.data) return null

      return {
        ...res.data.claims.user_metadata,
        email: res.data.claims.email,
        role: res.data.claims.role,
      }
    })
  }

  login(loginData: UserLogin) {
    const { email, password } = loginData

    const response = this.#database.auth.signInWithPassword({
      email,
      password,
    })

    return from(response)
  }

  logout() {}

  signup() {}
}
