import { Component, inject, signal } from '@angular/core'
import { Router } from '@angular/router'
import { CommonModule } from '@angular/common'
import { Auth } from '../../../core/services/auth/auth'
import { ActivityService } from '../../../core/services/activity'
import { ActivityDetail } from '../../../core/models/activity.model'
import { Activity } from "../../../shared/components/activity/activity/activity";

@Component({
  selector: 'app-ong-dashboard',
  standalone: true,
  imports: [CommonModule, Activity],
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
    const { data, error } = await this.activityService.getMyActivities()
    
    this.loading.set(false)
    
    if (error) {
      this.errorMsg.set(error?.message || 'Erro ao carregar atividades')
      return
    }

    this.activities.set(data ?? [])
  }

  navigateToCreate() {
    this.router.navigate(['/ong/activity/create'])
  }

}
