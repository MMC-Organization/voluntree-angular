import { Component, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router, RouterLink } from '@angular/router'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Auth } from '../../../../core/services/auth/auth'
import { finalize, switchMap } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'

@Component({
  selector: 'app-signup-volunteer',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './volunteer.html',
  styleUrl: './volunteer.css',
})
export class Volunteer {
  #fb = inject(FormBuilder)
  #router = inject(Router)
  #auth = inject(Auth)

  loading = signal(false)
  errorMessage = signal<string | null>(null)
  successMessage = signal<string | null>(null)
  submitted = signal(false)

  form = this.#fb.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.maxLength(20)]],
    senha: [
      '',
      [
        Validators.maxLength(20),
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\+\-=\{\}\[\]:"'<>,\.?\/\\|~`]).{8,}$/,
        ),
      ],
    ],
    cep: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
    numero: ['', [Validators.required, Validators.maxLength(20)]],
    cpf: [
      '',
      [
        Validators.required,
        Validators.maxLength(11),
        Validators.minLength(11),
        Validators.pattern(/^\d+$/),
      ],
    ],
  })

  async onSubmit() {
    this.errorMessage.set(null)
    this.successMessage.set(null)
    this.submitted.set(true)

    if (this.form.invalid) {
      this.errorMessage.set('Preencha todos os campos obrigatórios.')
      console.error(this.form.get('senha')?.errors)
      return
    }

    this.loading.set(true)

    const formData = this.form.getRawValue()

    this.#auth
      .signupVolunteer({
        email: formData.email!,
        password: formData.senha!,
        name: formData.nome!,
        phoneNumber: formData.phone!,
        cep: formData.cep!,
        number: formData.numero!,
        cpf: formData.cpf!,
      })
      .pipe(
        finalize(() => {
          this.loading.set(false)
        }),
      )
      .subscribe({
        next: () => {
          this.successMessage.set('Cadastro realizado com sucesso!')

          setTimeout(() => {
            this.#router.navigate(['/login'])
          }, 2000)
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 0) {
            this.errorMessage.set('Erro desconhecido, tente novamente!')
            this.loading.set(false)

            return
          }

          this.errorMessage.set(error.message)
          this.loading.set(false)
        },
      })
  }
}
