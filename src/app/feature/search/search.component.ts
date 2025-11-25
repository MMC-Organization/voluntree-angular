import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocationService, ViaCepResponse } from '../../core/services/location.service';
import { ActivitiesService } from '../../core/services/activities.service';
import { Activity } from '../../core/models/activity.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './search.component.html',
})
export class SearchComponent {
  private locationService = inject(LocationService);
  private activitiesService = inject(ActivitiesService);
  cepInput = signal('');
  userAddress = signal<ViaCepResponse | null>(null);
  loading = signal(false);
  errorMsg = signal('');
  allActivities = signal<Activity[]>([]);

  constructor() {
    this.activitiesService.getAllActivities().subscribe(data => {
      this.allActivities.set(data);
    });
  }

  searchCep() {
    const cep = this.cepInput();
    if (cep.length < 8) {
      this.errorMsg.set('CEP inválido (digite 8 números)'); 
      return; 
    }

    this.loading.set(true);
    this.errorMsg.set('');
    this.locationService.getAddressByCep(cep).subscribe({
      next: (res) => {
        if (res.erro) {
          this.errorMsg.set('CEP não encontrado!');
          this.userAddress.set(null);
        } else {
          this.userAddress.set(res);
        }
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Erro ao buscar CEP. Verifique sua internet.');
        this.loading.set(false);
      }
    });
  }
 
  filteredActivities = computed(() => {
    const address = this.userAddress();
    const activities = this.allActivities();
    if (!address) return activities;

    return activities.filter(act => act.city === address.localidade);
  });
}