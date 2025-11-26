import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Activity } from '../models/activity.model';



// TESTE ENQUANTO NAO TEM O SUPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA


@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {
  
  private mockActivities: Activity[] = [
    {
      id: '1',
      title: 'Doação de Sangue',
      description: 'Campanha no centro da cidade',
      cep: '01001000',
      city: 'São Paulo',
      state: 'SP',
      date: '2025-12-01',
      ngo_id: '123'
    },
    {
      id: '2',
      title: 'Limpeza da Praia',
      description: 'Ajuda para recolher lixo na orla',
      cep: '20040002',
      city: 'Rio de Janeiro',
      state: 'RJ',
      date: '2025-12-05',
      ngo_id: '456'
    }
  ];

  getAllActivities(): Observable<Activity[]> {
    return of(this.mockActivities);
  }
}