import { environment } from '@/environments/environment'
import { HttpClient } from '@angular/common/http'
import { inject, Injectable, signal } from '@angular/core'
import { AuthResponse, AuthState, OrganizationSignup, UserLogin, VolunteerSignup } from './auth.types'
import { tap } from 'rxjs/internal/operators/tap'

@Injectable({
  providedIn: 'root',
})
export class Auth {
  #http = inject(HttpClient)

  currentUser = signal<any>(this.getUserFromStorage());
  
  get isAuthenticated() {
    return !!this.currentUser();
  }

  obtainCsrfToken() {
    return this.#http.get(`${environment.apiUrl}/api/auth/csrf`, { withCredentials: true })
  }

  login(loginData: UserLogin) {
    return this.#http.post<AuthResponse>(`${environment.apiUrl}/api/auth/login`, loginData).pipe(
      tap((response) => {
       
        if (response.token) {
          localStorage.setItem('access_token', response.token);

          
          const user = { email: loginData.email, ...response };
          localStorage.setItem('user_data', JSON.stringify(user));
          
          
          this.currentUser.set(user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    this.currentUser.set(null);

  }

  signupOrganization(signupData: OrganizationSignup) {
    return this.#http.post(`${environment.apiUrl}/auth/register`, { 
      ...signupData, 
      userType: 'ORGANIZATION'
        })
  }

  signupVolunteer(signupData: VolunteerSignup) {
    return this.#http.post(`${environment.apiUrl}auth/register`, { 
      ...signupData, 
      userType: 'VOLUNTEER' 
    })
  }

  getUser() {
    const user = this.currentUser();
    return Promise.resolve({ data: { user }, error: user ? null : 'Not logged in' });
  }

  private getUserFromStorage() {
    const data = localStorage.getItem('user_data');
    return data ? JSON.parse(data) : null;
  }
}
