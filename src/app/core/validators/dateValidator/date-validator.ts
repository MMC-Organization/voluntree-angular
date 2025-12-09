import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[dateValidator]',
  providers: [{provide: NG_VALIDATORS, useExisting: DateValidator, multi: true}]
})
export class DateValidator {
  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null

    const currentDate = new Date()
    currentDate.setHours(0)
    currentDate.setMinutes(0)
    currentDate.setSeconds(0)

    const controlDate = new Date(control.value)

    if (Number.isNaN(controlDate.valueOf())) {
      return {invalidDate: true}
    }

    if (controlDate < currentDate) {
      return {invalidDate: true}
    }

    return null
  }
}
