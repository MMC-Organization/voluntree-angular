import { environment } from '@/environments/environment'
import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { AuthResponse, AuthState, OrganizationSignup, UserLogin, VolunteerSignup, UserDataResponse } from './auth.types'
import { firstValueFrom } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class Auth {
  #http = inject(HttpClient)

  get isAuthenticated() {
    return this.#http.get<AuthState>(`${environment.apiUrl}/api/auth`)
  }

  async getUser(): Promise<UserDataResponse> {
    try {
      const authState = await firstValueFrom(this.isAuthenticated)
      if (authState.status && authState.userId) {
        return {
          data: {
            user: {
              id: authState.userId.toString(),
              email: '',
              userType: authState.userType
            }
          },
          error: null
        }
      }
      return { data: { user: null }, error: { message: 'Usuário não autenticado' } }
    } catch (error) {
      return { data: { user: null }, error }
    }
  }

  obtainCsrfToken() {
    return this.#http.get(`${environment.apiUrl}/api/auth/csrf`)
  }

  login(loginData: UserLogin) {
    return this.#http.post<AuthResponse>(`${environment.apiUrl}/api/auth/login`, loginData, {
      observe: 'response'
    })
  }

  logout() {
    return this.#http.post(`${environment.apiUrl}/api/auth/logout`, null)
  }

  signupOrganization(signupData: OrganizationSignup) {
    return this.#http.post(`${environment.apiUrl}/api/auth/signup/organization`, signupData)
  }

  signupVolunteer(signupData: VolunteerSignup) {
    return this.#http.post(`${environment.apiUrl}/api/auth/signup/volunteer`, signupData)
  }
}
