import { Component, input, inject, signal } from '@angular/core';
import { ActivityDetail } from '../../../../core/models/activity.model';
import { ActivityService } from '../../../../core/services/activity';
import { Auth } from '../../../../core/services/auth/auth';

@Component({
  selector: 'app-activity',
  imports: [],
  templateUrl: './activity.html',
  styleUrl: './activity.css',
})
export class Activity {
  activity = input.required<ActivityDetail>()
  organization = input.required<boolean>()

  private activityService = inject(ActivityService)
  private auth = inject(Auth)

  loading = signal(false)

  formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  async signup() {
    if (this.organization()) return
    if (this.loading()) return
    this.loading.set(true)

    try {
      const { data: userData, error: userError } = await this.auth.getUser()
      const userId = userData?.user?.id

      if (userError || !userId) {
        alert('Erro ao obter usuário. Faça login novamente.')
        this.loading.set(false)
        return
      }
      const activityId = this.activity().id
      const {   error } = await this.activityService.signupToActivity(activityId, userId)

      if (error) {
        alert(error?.message || 'Erro ao se inscrever na atividade.')
        this.loading.set(false)
        return
      }
      alert('Inscrição realizada com sucesso!')
    } 
    catch (err) {
      console.error(err)
      alert('Erro inesperado. Tente novamente.')
    } finally {
      this.loading.set(false)
    }
  }}