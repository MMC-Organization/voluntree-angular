import { Component, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router'
import { ActivityDetail } from '../../../core/models/activity.model'
import { ActivityService } from '../../../core/services/activity'
import { Auth } from '../../../core/services/auth/auth'

@Component({
  selector: 'app-volunteer-subscriptions',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './subscriptions.html',
  styleUrl: './subscriptions.css',
})
export class VolunteerSubscriptions {
  private activityService = inject(ActivityService)
  private auth = inject(Auth)

  loading = signal(true)
  errorMsg = signal<string | null>(null)
  activities = signal<ActivityDetail[]>([])

  constructor() {
    this.load()
  }

  private async load() {
    this.errorMsg.set(null)
    this.loading.set(true)
    try {
      const { data: userData, error: userError } = await this.auth.getUser()
      const userId = userData?.user?.id

      if (userError || !userId) {
        this.errorMsg.set('Erro ao obter usuário. Faça login novamente.')
        this.loading.set(false)
        return
      }

      const { data, error } = await this.activityService.getVolunteerActivities(userId)
      if (error || !data) {
        this.errorMsg.set(error?.message || 'Erro ao carregar inscrições.')
        this.loading.set(false)
        return
      }

      this.activities.set(data)
    } catch (err) {
      console.error(err)
      this.errorMsg.set('Erro inesperado ao carregar inscrições.')
    } finally {
      this.loading.set(false)
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  async unsubscribe(activityId: string | number) {
    if (!confirm('Deseja realmente se desinscrever desta atividade?')) return

    this.loading.set(true)
    try {
      const { data: userData, error: userError } = await this.auth.getUser()
      const userId = userData?.user?.id

      if (userError || !userId) {
        alert('Erro ao obter usuário. Faça login novamente.')
        this.loading.set(false)
        return
      }

      const { error } = await this.activityService.unsubscribeFromActivity(activityId, userId)
      if (error) {
        alert(error?.message || 'Erro ao se desinscrever.')
        this.loading.set(false)
        return
      }

      this.activities.update((curr) => curr.filter((a) => String(a.id) !== String(activityId)))
      alert('Desinscrição realizada com sucesso!')
    } catch (err) {
      console.error(err)
      alert('Erro inesperado. Tente novamente.')
    } finally {
      this.loading.set(false)
    }
  }
}