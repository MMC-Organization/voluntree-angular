import { CommonModule } from '@angular/common'
import { Component, inject, input, signal } from '@angular/core'
import { Router } from '@angular/router'
import { ActivityDetail } from '../../../core/models/activity.model'
import { ActivityService } from '../../../core/services/activity'

@Component({
  selector: 'app-activity-volunteer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-volunteer.html',
  styleUrl: './activity-volunteer.css',
})
export class ActivityVolunteer {
  activity = input.required<ActivityDetail>()

  private router = inject(Router)
  private activityService = inject(ActivityService)

  loading = signal(false)

  formatDate(dateString?: string): string {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  viewDetails() {
    const activityId = this.activity().id
    this.router.navigate(['/volunteer/activity', activityId])
  }

  async signup() {
    if (this.loading()) return

    this.loading.set(true)

    try {
      const activityId = this.activity().id
      const { data, error } = await this.activityService.signupToActivity(activityId)

      if (error) {
        const msg = typeof error.error === 'string' ? error.error : 'Erro ao se inscrever.'
        alert(msg)
      } else {
        alert(data || 'Inscrição realizada com sucesso!')
      }
    } catch (err) {
      console.error(err)
      alert('Erro inesperado. Tente novamente.')
    } finally {
      this.loading.set(false)
    }
  }
}
