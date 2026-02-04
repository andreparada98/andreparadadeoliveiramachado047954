import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const idadeRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const min = control.get('faixaIdadeInicial')?.value;
    const max = control.get('faixaIdadeFinal')?.value;

    if (min != null && max != null && min > max) {
        return { idadeRange: 'A idade mínima não pode ser maior que a idade máxima' };
    }

    return null;
};
