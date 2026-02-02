import { Component, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Auth } from '../../../core/services/auth/auth'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'
import { firstValueFrom } from 'rxjs'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; 

interface VolunteerProfile {
  id: string
  name: string
  cpf: string
  cep: string
  number: string | null
  email?: string
  phoneNumber?: string
}

@Component({
  selector: 'app-volunteer-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class VolProfile {
  private authService = inject(Auth)
  private http = inject(HttpClient)
  private fb = inject(FormBuilder); 

  profile = signal<VolunteerProfile | null>(null);
  loading = signal(true);
  edit = signal(false); 
  save = signal(false); 
  
  errorMsg = signal(''); 
  errorMessage = signal<string | null>(null); 
  successMessage = signal<string | null>(null);

  EditPassword = signal(false);
  
  form: FormGroup;
  passwordForm: FormGroup;

  constructor() {
    this.form = this.fb.group({
      name: ['', [Validators.required]], 
      email: ['', [Validators.required, Validators.email]], 
      phoneNumber: ['', [Validators.required]],
      cep: ['', [Validators.required]],
      number: ['', [Validators.required]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });

    this.loadProfile();
  }

  private async loadProfile() {
    try {
      const profileData = await firstValueFrom(
        this.http.get<VolunteerProfile>(`${environment.apiUrl}/api/user/me`)
      )
      
      this.profile.set(profileData)
      this.loading.set(false)
    } catch (error: any) {
      console.error('Erro ao carregar perfil:', error)
      this.errorMsg.set('Erro ao carregar perfil. Tente novamente.')
      this.loading.set(false)
    }
  }

  toggleEdit() {
    this.edit.update(val => !val); 

    if (this.edit() && this.profile()) {
      const p = this.profile()!;
      this.form.patchValue({
        name: p.name,
        email: p.email,
        phoneNumber: p.phoneNumber,
        cep: p.cep,
        number: p.number
      });
    }
  }

  async saveProfile() {
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (this.form.invalid) return;

    this.save.set(true); 
    try {
      await firstValueFrom(
        this.http.put(`${environment.apiUrl}/api/user/me`, this.form.value)
      );

      this.profile.update(current => ({ ...current!, ...this.form.value }));
      
      this.edit.set(false); 
      
      this.successMessage.set('Perfil atualizado com sucesso!');
      setTimeout(() => this.successMessage.set(null), 3000); 

    } catch (error) {
      console.error('Erro ao salvar', error);
      this.errorMessage.set('Erro ao atualizar perfil. Tente novamente.');
      setTimeout(() => this.errorMessage.set(null), 5000);
    } finally {
      this.save.set(false); 
    }
  }  

  togglePasswordMode() {
    this.EditPassword.update(val => !val);
    if (!this.EditPassword()) {
      this.passwordForm.reset(); 
    }
  }

  async submitPasswordChange() {
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (this.passwordForm.invalid) return;
    
    const { newPassword, confirmPassword, currentPassword } = this.passwordForm.value;
    
    if (newPassword !== confirmPassword) {
      this.errorMessage.set('A confirmação da senha não confere.');
      setTimeout(() => this.errorMessage.set(null), 3000);
      return;
    }

    this.save.set(true); 
    try {
      await firstValueFrom(
        this.http.patch(`${environment.apiUrl}/api/user/me/password`, {
          oldPassword: currentPassword, 
          newPassword: newPassword
        })
      );
      
      this.togglePasswordMode(); 

      this.successMessage.set('Senha alterada com sucesso!');
      setTimeout(() => this.successMessage.set(null), 3000);

    } catch (error) {
      console.error('Erro ao mudar senha', error);
      this.errorMessage.set('Erro ao alterar senha. Verifique sua senha atual.');
      setTimeout(() => this.errorMessage.set(null), 5000);
    } finally {
      this.save.set(false);
    }
  }

  formatCnpj(cnpj: string): string {
    if (!cnpj || cnpj.length !== 14) return cnpj
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
  }

  formatCep(cep: string): string {
    if (!cep || cep.length !== 8) return cep
    return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2')
  }

  formatPhone(phone: string | undefined): string {
    if (!phone) return '-'
    if (phone.length === 11) {
      return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
    }
    if (phone.length === 10) {
      return phone.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
    }
    return phone
  }
}