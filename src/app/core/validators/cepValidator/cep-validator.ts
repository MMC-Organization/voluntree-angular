import { Directive, inject } from '@angular/core'
import { LocationService } from '../../services/location'
import { catchError, map, Observable, of } from 'rxjs'
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
    let error = false
    const cep = control.value

    if (!cep) return of(null)
    if (!/^\d{8}$/.test(cep)) return of({ invalid: true })

    return this.#locationService.getAddressByCep(cep).pipe(
      map((value) => {
        if (value.erro) return { invalid: true }
        return null
      }),
      catchError(() => of({ invalid: true }))
    )
  }
}
