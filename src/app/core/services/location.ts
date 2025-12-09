import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'

export interface ViaCepResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  erro?: 'true'
}

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private http = inject(HttpClient)

  getAddressByCep(cep: string): Observable<ViaCepResponse> {
    const cleanCep = String(cep).replace(/\D/g, '')
    return this.http.get<ViaCepResponse>(`https://viacep.com.br/ws/${cleanCep}/json/`)
  }
}
