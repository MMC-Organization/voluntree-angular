import { Component, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Auth } from '../../../core/services/auth/auth'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'
import { firstValueFrom } from 'rxjs'

interface OrganizationProfile {
  id: string
  cnpj: string
  name: string
  companyName: string
  cep: string
  number: string | null
  cause: string
  email?: string
  phoneNumber?: string
}

@Component({
  selector: 'app-ong-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class OngProfile {
  private authService = inject(Auth)
  private http = inject(HttpClient)

  profile = signal<OrganizationProfile | null>(null)
  loading = signal(true)
  errorMsg = signal('')

  constructor() {
    this.loadProfile()
  }

  private async loadProfile() {
    try {
      const profileData = await firstValueFrom(
        this.http.get<OrganizationProfile>(`${environment.apiUrl}/api/user/me`)
      )
      
      this.profile.set(profileData)
      this.loading.set(false)
    } catch (error: any) {
      console.error('Erro ao carregar perfil:', error)
      this.errorMsg.set('Erro ao carregar perfil. Tente novamente.')
      this.loading.set(false)
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
