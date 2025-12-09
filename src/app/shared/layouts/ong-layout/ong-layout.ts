import { Component, inject, signal } from '@angular/core'
import { Router, RouterModule } from '@angular/router'
import { Auth } from '../../../core/services/auth/auth'
import { ActivityService } from '../../../core/services/activity'
import { ActivityDetail } from '../../../core/models/activity.model'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-ong-layout',
  imports: [RouterModule, CommonModule],
  templateUrl: './ong-layout.html',
  styleUrl: './ong-layout.css',
})
export class OngLayout {
  authService = inject(Auth)
  activityService = inject(ActivityService)
  router = inject(Router)
  
  userInitial = signal('O')
  activities = signal<ActivityDetail[]>([])
  loading = signal(true)
  errorMsg = signal('')

  constructor() {
    this.loadUserData()
    this.loadActivities()
  }

  private async loadUserData() {
    const { data, error } = await this.authService.getClaims()
    if (error || !data) return

    const name = data.claims.user_metadata?.['name'] as string
    if (name) {
      this.userInitial.set(name[0].toUpperCase())
    }
  }

  private async loadActivities() {
    const { data: userData } = await this.authService.getUser()
    if (!userData?.user?.id) {
      this.loading.set(false)
      this.errorMsg.set('Erro ao carregar usuário')
      return
    }

    const { data, error } = await this.activityService.getActivitiesByOrganization(userData.user.id)
    
    this.loading.set(false)
    
    if (error) {
      this.errorMsg.set(error.message)
      return
    }

    this.activities.set(data ?? [])
  }

  logout() {
    this.authService.logout()
    this.router.navigate(['/login'])
  }

  navigateToCreate() {
    this.router.navigate(['/activity/create'])
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }
}
