import { Component, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterModule } from '@angular/router'
import { ActivityService } from '../../../core/services/activity'
import { debounceTime } from 'rxjs'
import { LocationService } from '../../../core/services/location'
import { Auth } from '../../../core/services/auth/auth'

@Component({
  selector: 'app-create-activity',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create.html',
  styleUrl: './create.css',
})

export class Create {
  private fb = inject(FormBuilder)
  private activityService = inject(ActivityService)
  private router = inject(Router)
  private locationService = inject(LocationService)
  private authService = inject(Auth)

  loading = signal(false)
  submitted = signal(false)
  errorMessage = signal<string | null>(null)

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

  ngOnInit() {
    this.form
      .get('cep')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe((value) => {
        const cep = this.form.get('cep')
        if (cep?.valid && value) {
          const address = this.locationService.getAddressByCep(value).subscribe({
            next: (res) => {
              this.form.get('city')?.setValue(res.localidade)
              this.form.get('state')?.setValue(res.uf)
            },
          })
        }
      })
    
    this.form.get('spots')
  }

  async onSubmit() {
    this.submitted.set(true)
    this.errorMessage.set(null)

    if (this.form.invalid) {
      return
    }

    this.loading.set(true)

    const { city, state, activityDate, ...formValue } = this.form.getRawValue()
    
    // Adiciona hora padrão (09:00) à data para criar LocalDateTime
    const activityDateTime = activityDate ? `${activityDate}T09:00:00` : ''

    try {
      const res: any = await this.activityService.createActivity({ 
        ...formValue, 
        activityDate: activityDateTime 
      })
      this.loading.set(false)

      if (res.error) {
        this.errorMessage.set(res.error.message || 'Erro ao criar atividade')
        return
      }

      alert('Atividade criada com sucesso!')
      this.router.navigate(['/ong'])
    } catch (err: any) {
      this.loading.set(false)
      this.errorMessage.set(err?.message || 'Erro inesperado ao criar atividade')
    }
  }
}
