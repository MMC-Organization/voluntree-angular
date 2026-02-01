import { Component, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Auth } from '../../../core/services/auth/auth'

interface OrganizationProfile {
  id: string
  cnpj: string
  name: string
  company_name: string
  cep: string
  number: string | null
  cause: string
  email?: string
  phone?: string
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

  profile = signal<OrganizationProfile | null>(null)
  loading = signal(true)
  errorMsg = signal('')

  constructor() {
    this.loadProfile()
  }

  private async loadProfile() {
    try {
      const { data: userData } = await this.authService.getUser()
      if (!userData?.user?.id) {
        this.errorMsg.set('Usuário não encontrado')
        this.loading.set(false)
        return
      }

      // TODO: Implementar busca de perfil via API REST
      // Por enquanto, apenas mostra mensagem
      this.errorMsg.set('Funcionalidade de perfil será implementada com a API REST')
      this.loading.set(false)
    } catch (error) {
      this.errorMsg.set('Erro ao carregar perfil')
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
