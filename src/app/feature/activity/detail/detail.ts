import { Component, inject, OnInit, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { ActivityService } from '../../../core/services/activity'
import { ActivityDetail } from '../../../core/models/activity.model'

@Component({
  selector: 'app-activity-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class ActivityDetailComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private activityService = inject(ActivityService)

  activity = signal<ActivityDetail | null>(null)
  loading = signal(true)
  errorMessage = signal<string | null>(null)
  activityId: string | null = null

  async ngOnInit() {
    this.activityId = this.route.snapshot.paramMap.get('id')
    
    if (!this.activityId) {
      this.errorMessage.set('ID da atividade não encontrado')
      this.loading.set(false)
      return
    }

    await this.loadActivity()
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

  formatDate(dateString: string): string {
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

    if (!confirm('Tem certeza que deseja excluir esta atividade?')) {
      return
    }

    this.loading.set(true)
    const result = await this.activityService.deleteActivity(this.activityId)

    if (result.error) {
      alert('Erro ao excluir atividade')
      this.loading.set(false)
      return
    }

    alert('Atividade excluída com sucesso!')
    this.router.navigate(['/ong'])
  }
}
