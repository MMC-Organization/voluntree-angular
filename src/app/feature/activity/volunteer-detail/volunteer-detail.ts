import { CommonModule } from '@angular/common'
import { Component, inject, OnInit, signal } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ActivityDetail } from '../../../core/models/activity.model'
import { ActivityService } from '../../../core/services/activity'
import { Auth } from '../../../core/services/auth/auth'

@Component({
  selector: 'app-activity-volunteer-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './volunteer-detail.html',
  styleUrl: './volunteer-detail.css',
})
export class ActivityVolunteerDetailComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private activityService = inject(ActivityService)
  private authService = inject(Auth)

  activity = signal<ActivityDetail | null>(null)
  loading = signal(true)
  errorMessage = signal<string | null>(null)
  activityId: string | null = null
  showToast = signal(false)
  toastMessage = signal('')
  toastType = signal<'success' | 'error'>('success')
  signupLoading = signal(false)
  hasSignedUp = signal(false)

  async ngOnInit() {
    this.activityId = this.route.snapshot.paramMap.get('id')

    if (!this.activityId) {
      this.errorMessage.set('ID da atividade não encontrado')
      this.loading.set(false)
      return
    }

    await this.loadActivity()
    await this.checkSignupStatus()
  }

  async loadActivity() {
    if (!this.activityId) return

    this.loading.set(true)
    const result = await this.activityService.getActivityById(this.activityId)

    if (result.error || !result.data) {
      this.errorMessage.set('Erro ao carregar atividade')
      this.loading.set(false)
      return
    }

    this.activity.set(result.data)
    this.loading.set(false)
  }

  async checkSignupStatus() {
    if (!this.activityId) return

    try {
      const result = await this.activityService.getMyActivities()
      if (result.data) {
        const hasSignedUp = result.data.some((act) => act.id.toString() === this.activityId)
        this.hasSignedUp.set(hasSignedUp)
      }
    } catch (error) {
      console.error('Error checking signup status:', error)
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  formatCep(cep: string): string {
    if (!cep || cep.length !== 8) return cep
    return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2')
  }

  async signup() {
    if (this.signupLoading() || !this.activityId) return

    this.signupLoading.set(true)

    try {
      const { data, error } = await this.activityService.signupToActivity(this.activityId)

      if (error) {
        const msg = typeof error.error === 'string' ? error.error : 'Erro ao se inscrever.'
        this.showToastNotification(msg, 'error')
      } else {
        const successMsg = typeof data === 'string' ? data : 'Inscrição realizada com sucesso!'
        this.showToastNotification(successMsg, 'success')
        this.hasSignedUp.set(true)
      }
    } catch (err) {
      console.error(err)
      this.showToastNotification('Erro inesperado. Tente novamente.', 'error')
    } finally {
      this.signupLoading.set(false)
    }
  }

  async removeSignup() {
    if (!this.activityId || !confirm('Tem certeza que deseja remover sua inscrição?')) {
      return
    }

    this.signupLoading.set(true)

    try {
      // Implement the removal endpoint when available
      // For now, we'll just show a message
      this.showToastNotification('Função de cancelamento ainda não está disponível', 'error')
    } finally {
      this.signupLoading.set(false)
    }
  }

  showToastNotification(message: string, type: 'success' | 'error') {
    this.toastMessage.set(message)
    this.toastType.set(type)
    this.showToast.set(true)

    setTimeout(() => {
      this.showToast.set(false)
    }, 4000)
  }

  goBack() {
    this.router.navigate(['/volunteer'])
  }
}
