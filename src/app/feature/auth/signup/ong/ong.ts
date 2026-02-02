import { Component, inject, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { Auth } from '../../../../core/services/auth/auth'
import { CommonModule } from '@angular/common'
import { finalize } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'

@Component({
  selector: 'app-signup-ong',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './ong.html',
  styleUrl: './ong.css',
})
export class Ong {
  #fb = inject(FormBuilder)
  #auth = inject(Auth)
  #router = inject(Router)

  loading = signal(false)
  errorMessage = signal<string | null>(null)
  successMessage = signal<string | null>(null)
  submitted = signal(false)

  form = this.#fb.group({
    cnpj: [
      '',
      [
        Validators.required,
        Validators.minLength(14),
        Validators.maxLength(14),
        Validators.pattern(/^\d{14}$/),
      ],
    ],
    name: ['', [Validators.required, Validators.minLength(2)]],
    company_name: ['', [Validators.required, Validators.minLength(2)]],
    cause: ['', [Validators.required, Validators.minLength(10)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(20),
        Validators.pattern(/^\d+$/),
      ],
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\+\-=\{\}\[\]:"'<>,\.?\/\\|~`]).{8,}$/,
        ),
      ],
    ],
    cep: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
        Validators.pattern(/^\d{8}$/),
      ],
    ],
    number: ['', [Validators.required, Validators.maxLength(20)]],
    confirmPassword: ['', Validators.required],
  })

  getFieldError(fieldName: string): string | null {
    const field = this.form.get(fieldName)
    if (!field || !field.errors || (!field.touched && !this.submitted())) return null

    const errors = field.errors
    const fieldLabels: Record<string, string> = {
      cnpj: 'CNPJ',
      name: 'Nome Fantasia',
      company_name: 'Razão Social',
      cause: 'Causa Social',
      email: 'E-mail',
      phone: 'Telefone',
      password: 'Senha',
      cep: 'CEP',
      number: 'Número',
      confirmPassword: 'Confirmação de Senha',
    }

    const label = fieldLabels[fieldName] || fieldName

    if (errors['required']) return `${label} é obrigatório`
    if (errors['email']) return 'Digite um e-mail válido'
    if (errors['minlength']) {
      const min = errors['minlength'].requiredLength
      if (fieldName === 'cnpj') return 'CNPJ deve ter 14 dígitos'
      if (fieldName === 'cep') return 'CEP deve ter 8 dígitos'
      if (fieldName === 'password') return 'Senha deve ter no mínimo 6 caracteres'
      if (fieldName === 'cause') return 'Descreva a causa com pelo menos 10 caracteres'
      if (fieldName === 'phone') return 'Telefone deve ter no mínimo 10 dígitos'
      return `${label} deve ter no mínimo ${min} caracteres`
    }
    if (errors['maxlength']) {
      const max = errors['maxlength'].requiredLength
      return `${label} deve ter no máximo ${max} caracteres`
    }
    if (errors['pattern']) {
      if (fieldName === 'cnpj') return 'CNPJ deve conter apenas números (14 dígitos)'
      if (fieldName === 'cep') return 'CEP deve conter apenas números (8 dígitos)'
      if (fieldName === 'phone') return 'Telefone deve conter apenas números'
      return `${label} está em formato inválido`
    }

    return null
  }

  translateSupabaseError(errorMessage: string): string {
    const errorMap: Record<string, string> = {
      'User already registered': 'Este e-mail já está cadastrado',
      'Invalid login credentials': 'Credenciais inválidas',
      'Email not confirmed': 'E-mail não confirmado. Verifique sua caixa de entrada',
      'Password should be at least 6 characters': 'A senha deve ter no mínimo 6 caracteres',
      'Unable to validate email address: invalid format': 'Formato de e-mail inválido',
      'Signup requires a valid password': 'Senha inválida',
      'To signup, please provide your email': 'E-mail é obrigatório',
      'Email rate limit exceeded': 'Muitas tentativas. Aguarde alguns minutos',
      'For security purposes, you can only request this once every 60 seconds':
        'Aguarde 60 segundos antes de tentar novamente',
    }

    for (const [key, value] of Object.entries(errorMap)) {
      if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
        return value
      }
    }

    return 'Erro ao realizar cadastro. Tente novamente mais tarde.'
  }

  async onSubmit() {
    this.submitted.set(true)
    if (this.form.invalid) {
      const invalidFields = Object.keys(this.form.controls).filter(
        (key) => this.form.get(key)?.invalid,
      )

      if (invalidFields.length === 1) {
        this.errorMessage.set(this.getFieldError(invalidFields[0]))
      } else {
        this.errorMessage.set(
          `Corrija os ${invalidFields.length} campos com erro antes de continuar.`,
        )
      }
      return
    }

    const { confirmPassword, ...formData } = this.form.value

    if (formData.password !== confirmPassword) {
      this.errorMessage.set('As senhas não coincidem. Verifique e tente novamente.')
      return
    }

    this.loading.set(true)

    const observable = await this.#auth
      .signupOrganization({
        email: formData.email!,
        password: formData.password!,
        name: formData.name!,
        cnpj: formData.cnpj!,
        cause: formData.cause!,
        companyName: formData.company_name!,
        phoneNumber: formData.phone!,
        cep: formData.cep!,
        number: formData.number!,
      })

    observable
      .pipe(
        finalize(() => {
          this.loading.set(false)
        }),
      )
      .subscribe({
        next: (res: any) => {
          this.successMessage.set('Cadastro realizado com sucesso! Redirecionando...')
          setTimeout(() => {
            this.#router.navigate(['/login'])
          }, 2000)
        },
        error: (error: HttpErrorResponse) => {
          if (error) {
            this.errorMessage.set(error.message)
            return
          }
        },
      })
  }
}
