import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { UserProfile } from './auth.types'

@Injectable({
  providedIn: 'root',
})
export class User {
  #http = inject(HttpClient)

  get userData() {
    return this.#http.get<UserProfile>('/api/user/me')
  }
}
