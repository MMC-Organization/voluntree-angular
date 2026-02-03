import { Component, input, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ActivityDetail } from '../../../../core/models/activity.model';
import { ActivityService } from '../../../../core/services/activity';
import { Auth } from '../../../../core/services/auth/auth';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-activity',
  imports: [],
  templateUrl: './activity.html',
  styleUrl: './activity.css',
})
export class Activity {
  activity = input.required<ActivityDetail>()
  organization = input.required<boolean>()

  private router = inject(Router)
  private activityService = inject(ActivityService)
  

  loading = signal(false)
  isOwner = signal(false)

  async ngOnInit() {
    if (this.organization()) {
      await this.checkOwnership()
    }
  }

  async checkOwnership() {
    try {
      const result = await this.activityService.getMyActivities()
      if (result.data) {
        const owns = result.data.some(act => act.id.toString() === this.activity().id.toString())
        this.isOwner.set(owns)
      }
    } catch (error) {
      console.error('Error checking ownership:', error)
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  viewDetails() {
    const activityId = this.activity().id
    this.router.navigate(['/ong/activity', activityId])
  }

  editActivity() {
    const activityId = this.activity().id
    this.router.navigate(['/ong/activity/edit', activityId])
  }

  async signup() {
    if (this.organization()) return
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
    } 
    catch (err) {
      console.error(err)
      alert('Erro inesperado. Tente novamente.')
    } finally {
      this.loading.set(false)
    }
  }
}