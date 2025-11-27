import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/auth/auth';

@Component({
  selector: 'app-ong',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './ong.html',
  styleUrl: './ong.css',
})
export class Ong {
  #fb = inject(FormBuilder);
  #auth = inject(Auth);
  #router = inject(Router);

  loading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  form = this.#fb.group({
    cnpj: ['', Validators.required],
    name: ['', Validators.required],
    nomeFantasia: [''],
    cause: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    cep: ['', Validators.required],
    number: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  });

  async onSubmit() {
    if (this.form.invalid) {
      this.errorMessage.set('Preencha todos os campos obrigatórios.');
      return;
    }

    const { confirmPassword, nomeFantasia, telefone, cep, ...formData } = this.form.value;

    if (formData.password !== confirmPassword) {
      this.errorMessage.set('As senhas não coincidem.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const response = await this.#auth.signup({
      email: formData.email!,
      password: formData.password!,
      name: formData.name!,
      cnpj: formData.cnpj!,
      cause: formData.cause!,
      location: {
        nomeFantasia,
        telefone,
        cep,
        number: formData.number!, 
      },
    });

    this.loading.set(false);

    if (response.error) {
      this.errorMessage.set(response.error.message);
      return;
    }

    this.successMessage.set('Cadastro realizado com sucesso! Redirecionando...');
    setTimeout(() => {
      this.#router.navigate(['/login']);
    }, 2000);
  }
}
