import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ActivitiesService } from '../../core/services/activities.service';
import { LocationService } from '../../core/services/location.service';

@Component({
  selector: 'app-create-activity',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-activity.html',
  styleUrl: './create-activity.css'
})
export class CreateActivity {
  private fb = inject(FormBuilder);
  private activitiesService = inject(ActivitiesService);
  private locationService = inject(LocationService);
  private router = inject(Router);

  isLoading = signal(false);
  submitted = signal(false);

  form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    date: ['', Validators.required],
    cep: ['', [Validators.required, Validators.minLength(8)]],
    city: ['', Validators.required],
    state: ['', Validators.required]
  });

  buscarCep() {
    const cepDigitado = this.form.get('cep')?.value;
    
    if (cepDigitado && cepDigitado.length === 8) {
      this.isLoading.set(true);
      
      this.locationService.getAddressByCep(cepDigitado).subscribe({
        next: (res) => {
          if (!res.erro) {
            this.form.patchValue({
              city: res.localidade,
              state: res.uf
            });
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
    }
  }

  onSubmit() {
    this.submitted.set(true);

    if (this.form.invalid) {
      return;
    }

    this.isLoading.set(true);

    this.activitiesService.createActivity(this.form.value).subscribe({
      next: () => {
        alert('Atividade criada com sucesso!');
        this.router.navigate(['/busca']);
      },
      error: (erro) => {
        console.error(erro);
        alert('Erro ao salvar atividade.');
        this.isLoading.set(false);
      }
    });
  }
}