import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

export function objectValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      return null; // Validation passed
    } else {
      return { objectError: true }; // Validation failed
    }
  };
}

export function domainTypeValidator(domainType: string): ValidatorFn {
  const patternValidator =
    domainType === 'integer'
      ? Validators.pattern(/^-?\d+$/)
      : Validators.pattern(/^-?[0-9]*[.][0-9]+$/);

  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || isNaN(control.value)) {
      return null;
    }
    const patternValidationResult = patternValidator(control);

    if (patternValidationResult && domainType === 'integer') {
      return { pattern: 'Value should be integer.' };
    }

    if (patternValidationResult && domainType === 'float') {
      return { pattern: 'Value should be float.' };
    }

    return null;
  };
}

export function numericRangeValidator(
  ranges: {
    minValue: number;
    maxValue: number;
    minInclusive: boolean;
    maxInclusive: boolean;
  }[]
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || isNaN(control.value)) {
      return null;
    }

    const value = control.value;
    let invalidRange: any = [];

    for (const range of ranges) {
      const { minValue, maxValue, minInclusive, maxInclusive } = range;

      const minCheck = minInclusive ? value >= minValue : value > minValue;
      const maxCheck = maxInclusive ? value <= maxValue : value < maxValue;

      if (!(minCheck && maxCheck)) {
        invalidRange.push(range);
      } else {
        invalidRange = [];
        break;
      }
    }

    if (invalidRange.length) {
      let error = 'Ranges: ';

      invalidRange.map((range: any, idx: number) => {
        error += `[${range.minValue}, ${range.maxValue}]`;

        if (idx < invalidRange.length - 1) {
          error += ', ';
        }
      });

      return { rangeError: error };
    }

    return null;
  };
}
