import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../core/auth/auth'; 

@Component({
  selector: 'app-voluntario',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './voluntario.html',
  styleUrl: './voluntario.css',
})

export class Voluntario {
  #fb = inject(FormBuilder);
  #router = inject(Router);
  #auth = inject(Auth); 

  loading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  form = this.#fb.group({
    nome: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required], [ Validators.minLength(8)]],
    cep:['',[Validators.required],[Validators.minLength(8)]],
    numero:['',[Validators.required]]
  });

  async onSubmit() {
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage.set('Preencha todos os campos corretamente.');
      return;
    }

    this.loading.set(true);

    const { nome, email, senha } = this.form.getRawValue();

    try {
 
      
      const response = await this.#auth.signup({
        email: email!,     
        password: senha!,   
        
       
        name: nome!,      
      } as any); 

      if (response.error) {
        this.errorMessage.set(response.error.message);
        this.loading.set(false);
        return;
      }

      this.successMessage.set('Cadastro realizado com sucesso!');
      
      setTimeout(() => {
        this.#router.navigate(['/login']);
      }, 2000);

    } catch (error) {
      console.error(error);
      this.errorMessage.set('Erro inesperado. Tente novamente.');
    } finally {
      this.loading.set(false);
    }
  }
}