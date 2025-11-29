import { Component, inject, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Auth } from '../../../core/services/auth/auth'
import { Router, RouterLink } from '@angular/router'

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

    this.submitted.set(true)
    this.loginForm.markAllAsTouched()
    this.loginForm.markAllAsDirty()

    if (this.loginForm.invalid) {
      console.log(this.password?.errors)
      return
    }

    this.isLoading.set(true)

    const data = this.loginForm.getRawValue()

    this.authService.login(data).then(({ data, error }) => {
      if (error) {
        this.authError.set(error.message)
        this.isLoading.set(false)
      }

      this.router.navigate(['/home'])
    })
  }

  get email() {
    return this.loginForm.get('email')
  }

  get password() {
    return this.loginForm.get('password')
  }
}
