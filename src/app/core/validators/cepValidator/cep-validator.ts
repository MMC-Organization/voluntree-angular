import { Directive, inject } from '@angular/core'
import { LocationService } from '../../services/location'
import { catchError, map, Observable, of, timeout } from 'rxjs'
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
  ValidationErrors,
} from '@angular/forms'

@Directive({
  selector: '[cepValidator]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: CepValidator, multi: true }],
})
export class CepValidator implements AsyncValidator {
  #locationService = inject(LocationService)

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const cep = control.value

    if (!cep) return of(null)
    
    // Remove caracteres não numéricos
    const cleanCep = String(cep).replace(/\D/g, '')
    
    // Verifica se tem 8 dígitos
    if (cleanCep.length !== 8) return of({ invalid: true })

    return this.#locationService.getAddressByCep(cleanCep).pipe(
      timeout(5000), // Timeout de 5 segundos
      map((value) => {
        // ViaCEP retorna { erro: true } quando o CEP não existe
        if (value.erro === 'true' || !value.cep) {
          return { invalid: true }
        }
        return null
      }),
      catchError((error) => {
        console.error('Erro ao validar CEP:', error)
        // Em caso de erro de rede, não bloqueia o formulário
        return of(null)
      })
    )
  }
}
