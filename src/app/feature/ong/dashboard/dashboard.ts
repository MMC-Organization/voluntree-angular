import { Component, inject, signal } from '@angular/core'
import { Router } from '@angular/router'
import { CommonModule } from '@angular/common'
import { Auth } from '../../../core/services/auth/auth'
import { ActivityService } from '../../../core/services/activity'
import { ActivityDetail } from '../../../core/models/activity.model'

@Component({
  selector: 'app-ong-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class OngDashboard {
  private authService = inject(Auth)
  private activityService = inject(ActivityService)
  private router = inject(Router)

  activities = signal<ActivityDetail[]>([])
  loading = signal(true)
  errorMsg = signal('')

  constructor() {
    this.loadActivities()
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

  navigateToCreate() {
    this.router.navigate(['/ong/activity/create'])
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }
}
