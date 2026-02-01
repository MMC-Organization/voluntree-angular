import { Component, inject, OnInit, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { ActivityService } from '../../../core/services/activity'
import { LocationService } from '../../../core/services/location'
import { debounceTime } from 'rxjs'

@Component({
  selector: 'app-edit-activity',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class EditActivityComponent implements OnInit {
  private fb = inject(FormBuilder)
  private route = inject(ActivatedRoute)
  private activityService = inject(ActivityService)
  private router = inject(Router)
  private locationService = inject(LocationService)

  isLoading = signal(false)
  submitted = signal(false)
  errorMessage = signal<string | null>(null)
  activityId: string | null = null
  loading = signal(false)
  submitting = signal(false)

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    activityDate: ['', Validators.required],
    cep: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
    number: ['', Validators.required],
    spots: [0, [Validators.required, Validators.min(1)]],
    city: [{ value: '', disabled: true }],
    state: [{ value: '', disabled: true }],
  })

  async ngOnInit() {
    this.activityId = this.route.snapshot.paramMap.get('id')
    
    if (!this.activityId) {
      this.errorMessage.set('ID da atividade não encontrado')
      return
    }

    await this.loadActivity()
    this.setupCepListener()
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

    const activity = result.data
    
    // Converte LocalDateTime para formato date (YYYY-MM-DD)
    let dateValue = ''
    if (activity.activityDate) {
      const date = new Date(activity.activityDate)
      dateValue = date.toISOString().split('T')[0]
    }

    this.form.patchValue({
      name: activity.name,
      description: activity.description || '',
      activityDate: dateValue,
      cep: activity.cep,
      number: activity.number || '',
      spots: activity.spots,
      city: activity.city || '',
      state: activity.state || '',
    })

    this.loading.set(false)
  }

  setupCepListener() {
    this.form
      .get('cep')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe((value) => {
        const cep = this.form.get('cep')
        if (cep?.valid && value) {
          this.locationService.getAddressByCep(value).subscribe({
            next: (res) => {
              this.form.get('city')?.setValue(res.localidade)
              this.form.get('state')?.setValue(res.uf)
            },
          })
        }
      })
  }

  async onSubmit() {
    this.submitted.set(true)
    this.errorMessage.set(null)

    if (this.form.invalid || !this.activityId) {
      return
    }

    this.isLoading.set(true)

    const { city, state, activityDate, ...formValue } = this.form.getRawValue()
    
    // Adiciona hora padrão (09:00) à data para criar LocalDateTime
    const activityDateTime = activityDate ? `${activityDate}T09:00:00` : ''

    try {
      this.submitting.set(true)
      const res: any = await this.activityService.updateActivity(this.activityId, { 
        ...formValue, 
        activityDate: activityDateTime 
      })
      this.submitting.set(false)

      if (res.error) {
        this.errorMessage.set(res.error.message || 'Erro ao atualizar atividade')
        return
      }

      alert('Atividade atualizada com sucesso!')
      this.router.navigate(['/ong/activity', this.activityId])
    } catch (err: any) {
      this.submitting.set(false)
      this.errorMessage.set(err?.message || 'Erro inesperado ao atualizar atividade')
    }
  }
}
