import { Component, inject, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { Auth } from '@/app/core/services/auth/auth'

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  formBuilder = inject(FormBuilder)
  authService = inject(Auth)
  router = inject(Router)
  isLoading = signal(false)
  submitted = signal(false)
  authError = signal<string | null>(null)

  loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  })

  handleSubmit(event: SubmitEvent) {
    event.preventDefault()

    this.authError.set(null)
    this.submitted.set(true)
    this.loginForm.markAllAsTouched()
    this.loginForm.markAllAsDirty()

    if (this.loginForm.invalid) {
      // console.log(this.password?.errors)
      return
    }

    this.isLoading.set(true)

    const data = this.loginForm.getRawValue()

    // Primeiro, faz logout silencioso para limpar qualquer sessão anterior
    this.authService.logout().subscribe({
      complete: () => {
        // Depois de fazer logout (ou se falhar), tenta fazer login
        this.performLogin(data)
      },
      error: () => {
        // Mesmo se o logout falhar, tenta fazer login
        this.performLogin(data)
      }
    })
  }

  private performLogin(data: { email: string; password: string }) {
    this.authService.login(data).subscribe({
      next: (res) => {
        if (!res.body?.authenticated) {
          this.authError.set(res.body?.message ?? 'Erro na autenticação. Tente novamente.')
          this.isLoading.set(false)
          return
        }

        this.router.navigate(['/home'])
      },
      error: (err) => {
        this.authError.set('Erro na autenticação. Tente novamente.')
        this.isLoading.set(false)
      },
    })
  }

  get email() {
    return this.loginForm.get('email')
  }

  get password() {
    return this.loginForm.get('password')
  }
}
