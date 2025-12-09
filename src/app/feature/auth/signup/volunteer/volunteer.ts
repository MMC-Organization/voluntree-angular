import { Component, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router, RouterLink } from '@angular/router'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Auth } from '../../../../core/services/auth/auth'

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

  form = this.#fb.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.maxLength(20)]],
    senha: ['', [Validators.required, Validators.minLength(8),Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
    cep: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
    numero: ['', [Validators.required, Validators.maxLength(20)]],
  })

submitted = signal(false)
  async onSubmit() {
    this.errorMessage.set(null)
    this.successMessage.set(null)
    this.submitted.set(true)

    if (this.form.invalid) {
      this.errorMessage.set('Preencha todos os campos obrigatórios.')
      return
    }

    this.loading.set(true)

    const formData = this.form.getRawValue()

    try {
      const response = await this.#auth.signup({
        email: formData.email!,
        password: formData.senha!,
        name: formData.nome!,
        phone: formData.phone!,
        cep: formData.cep!,
        number: formData.numero!,
      })

      if (response.error) {
        this.errorMessage.set(response.error.message)
        this.loading.set(false)
        return
      }

      this.successMessage.set('Cadastro realizado com sucesso!')

      setTimeout(() => {
        this.#router.navigate(['/login'])
      }, 2000)
    } catch (error) {
      console.error(error)
      this.errorMessage.set('Erro inesperado. Tente novamente.')
    } finally {
      this.loading.set(false)
    }
  }
}
