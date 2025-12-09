import { Component, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Auth } from '../../../core/services/auth/auth'
import { Supabase } from '../../../core/services/database/supabase'

interface VolunteerProfile {
  id: string
  name: string
  cep: string
  number: string | null
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
export class VolProfile {
  private authService = inject(Auth)
  private supabase = inject(Supabase).client

  profile = signal<VolunteerProfile | null>(null)
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

      const { data: volData, error: volError } = await this.supabase
        .from('volunteer')
        .select('*')
        .eq('id', userData.user.id)
        .single()

      if (volError || !volData) {
        this.errorMsg.set('Erro ao carregar dados da organização')
        this.loading.set(false)
        return
      }

      const { data: emailData } = await this.supabase
        .from('email')
        .select('email')
        .eq('volunteer_id', userData.user.id)
        .single()

      const { data: phoneData } = await this.supabase
        .from('phone_number')
        .select('phone_number')
        .eq('volunteer_id', userData.user.id)
        .single()

      this.profile.set({
        ...volData,
        email: emailData?.email || userData.user.email,
        phone: phoneData?.phone_number,
      })

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
