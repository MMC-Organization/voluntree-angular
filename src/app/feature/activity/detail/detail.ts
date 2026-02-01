import { Component, inject, OnInit, signal, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { ActivityService } from '../../../core/services/activity'
import { ActivityDetail } from '../../../core/models/activity.model'
import { Auth } from '../../../core/services/auth/auth'
import { firstValueFrom } from 'rxjs'

@Component({
  selector: 'app-activity-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class ActivityDetailComponent implements OnInit {
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
  userType = signal<'VOLUNTEER' | 'ORGANIZATION' | null>(null)
  isOwner = signal(false)

  async ngOnInit() {
    this.activityId = this.route.snapshot.paramMap.get('id')
    
    if (!this.activityId) {
      this.errorMessage.set('ID da atividade não encontrado')
      this.loading.set(false)
      return
    }

    try {
      const authState = await firstValueFrom(this.authService.isAuthenticated)
      console.log('🔍 AuthState:', authState)
      
      if (authState.status) {
        this.userType.set(authState.userType)
        
        // Se for organização, verifica se é dona da atividade
        if (authState.userType === 'ORGANIZATION') {
          await this.checkOwnership()
        }
      }
    } catch (error) {
      console.error('❌ Error getting auth state:', error)
    }

    await this.loadActivity()
  }

  async checkOwnership() {
    if (!this.activityId) return
    
    try {
      const result = await this.activityService.getMyActivities()
      if (result.data) {
        const owns = result.data.some(act => act.id.toString() === this.activityId)
        this.isOwner.set(owns)
        console.log('✅ Is owner:', owns)
      }
    } catch (error) {
      console.error('❌ Error checking ownership:', error)
    }
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

  formatDate(dateString?: string): string {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  formatCep(cep: string): string {
    if (!cep || cep.length !== 8) return cep
    return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2')
  }

  goToEdit() {
    if (this.activityId) {
      this.router.navigate(['/ong/activity/edit', this.activityId])
    }
  }

  async deleteActivity() {
    if (!this.activityId) return

    if (!confirm('⚠️ Tem certeza que deseja excluir esta atividade?\n\nEsta ação não pode ser desfeita.')) {
      return
    }

    this.loading.set(true)
    const result = await this.activityService.deleteActivity(this.activityId)

    if (result.error) {
      this.loading.set(false)
      this.showToastNotification('Erro ao excluir atividade. Tente novamente.', 'error')
      return
    }

    this.showToastNotification('Atividade excluída com sucesso! Redirecionando...', 'success')
    
    setTimeout(() => {
      this.router.navigate(['/ong'])
    }, 2000)
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
    this.router.navigate(['/ong'])
  }
}
