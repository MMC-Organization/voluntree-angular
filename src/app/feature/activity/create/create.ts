import { Component, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterModule } from '@angular/router'
import { ActivityService } from '../../../core/services/activity'
import { CepValidator } from '../../../core/validators/cepValidator/cep-validator'
import { debounceTime } from 'rxjs'
import { LocationService } from '../../../core/services/location'
import { Auth } from '../../../core/services/auth/auth'
import { DateValidator } from "../../../core/validators/dateValidator/date-validator";

@Component({
  selector: 'app-create-activity',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CepValidator, DateValidator],
  templateUrl: './create.html',
  styleUrl: './create.css',
})
export class Create {
  private fb = inject(FormBuilder)
  private activityService = inject(ActivityService)
  private router = inject(Router)
  private locationService = inject(LocationService)
  private authService = inject(Auth)

  isLoading = signal(false)
  submitted = signal(false)
  errorMessage = signal<string | null>(null)

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    date: ['', Validators.required],
    cep: ['', [Validators.required, Validators.minLength(8)]],
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

    this.isLoading.set(true)

    const { city, state, ...formValue } = this.form.getRawValue()

    const organizationId = await this.authService.getUser().then(({ data, error }) => {
      if (data && !error) return data.user?.id

      if (error) {
        this.errorMessage.set(error.message)
      }

      return null
    })

    if (!organizationId) {
      return
    }

    this.activityService
      .createActivity({ ...formValue, organizationId })
      .then(({ data, error }) => {
        this.isLoading.set(false)

        if (error) {
          this.errorMessage.set(error.message)
          return
        }

        alert('Atividade criada')
        this.router.navigate(['/ong'])
      })

    this.form.get('city')?.setValue('')
    this.form.get('state')?.setValue('')
  }
}
