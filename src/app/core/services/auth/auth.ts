import { environment } from '@/environments/environment'
import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { AuthResponse, AuthState, OrganizationSignup, UserLogin, VolunteerSignup } from './auth.types'

@Injectable({
  providedIn: 'root',
})
export class Auth {
  #http = inject(HttpClient)

  get isAuthenticated() {
    return this.#http.get<AuthState>(`${environment.apiUrl}/api/auth`, { withCredentials: true })
  }

  obtainCsrfToken() {
    return this.#http.get(`${environment.apiUrl}/api/auth/csrf`, { withCredentials: true })
  }

  login(loginData: UserLogin) {
    return this.#http.post<AuthResponse>(`${environment.apiUrl}/api/auth/login`, loginData, {
      withCredentials: true,
      observe: 'response'
    })
  }

  logout() {
    return this.#http.post(`${environment.apiUrl}/api/auth/logout`, null, { withCredentials: true })
  }

  signupOrganization(signupData: OrganizationSignup) {
    return this.#http.post(`${environment.apiUrl}/api/auth/signup/organization`, signupData, {
      withCredentials: true,
    })
  }

  signupVolunteer(signupData: VolunteerSignup) {
    return this.#http.post(`${environment.apiUrl}/api/auth/signup/volunteer`, signupData, {
      withCredentials: true,
    })
  }
}
