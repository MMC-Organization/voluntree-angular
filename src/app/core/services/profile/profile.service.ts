import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

export interface UserProfile {
  name: string;
  email: string;
  phoneNumber: string;
  cep: string;
  number: string; 
  userType: 'VOLUNTEER' | 'ORGANIZATION';
  
  
  cpf?: string;
  cnpj?: string;
  companyName?: string;
  cause?: string;
}


export interface UpdateProfileData {
  name?: string;
  email?: string;
  phoneNumber?: string;
  cep?: string;
  number?: string;
  
}

export interface PasswordUpdateData {
  currentPassword?: string;
  newPassword?: string;
  confirmationPassword?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient);
 
  private apiUrl = `${environment.apiUrl}/api/user`;

  getMyProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/me`);
  }
  

  updateProfile(data: UpdateProfileData) {
    return this.http.put<void>(`${this.apiUrl}/me`, data);
  }


  updatePassword(data: PasswordUpdateData) {
    return this.http.patch<void>(`${this.apiUrl}/me/password`, data);
  }
}