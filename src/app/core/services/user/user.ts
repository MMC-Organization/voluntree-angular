import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { UserProfile } from './user.types'
import { environment } from '@/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class User {
  #http = inject(HttpClient)

  get userData() {
    return this.#http.get<UserProfile>(`${environment.apiUrl}/api/user/me`, {withCredentials: true})
  }
}
