import { FormControl } from '@angular/forms';
import {
  FloatLabelType,
  MatFormFieldAppearance,
} from '@angular/material/form-field';

import { InputType } from './type';

export interface DropdownOption {
  name: string;
  value: any;
  disable?: boolean;
}

export interface DropdownInput {
  label?: string;
  placeholder: string;
  options: DropdownOption[];
  selected?: any;
  for?: string;
  default?: string;
  disabled?: any;
}

export interface NavMenuItem {
  title: string;
  value?: string;
}

export interface FilterItem {
  title: string;
  value?: string;
  isAdditionalFilter?: boolean;
}

export interface UpalParameter {
  id?: string;
  designation: string;
}
export interface MultifieldSubParameter {
  id?: string;
  upalParameter: FormControl<DropdownOption | any | null>;
  relevance: FormControl;
  cardinality: FormControl;
}

export interface DropdownSelected {
  for: string;
  value?: string;
}

export interface SearchableInputConfig {
  label?: string;
  placeholder: string;
  options: DropdownOption[];
  type?: InputType;
  appearance?: MatFormFieldAppearance;
  labelType?: FloatLabelType;
  action?: any;
  numCharSearch?: number;
}

export interface Operations {
  allow?: boolean;
  create?: boolean;
  read?: boolean;
  update?: boolean;
  delete?: boolean;
}

export interface ConfirmDialogConfig {
  action?: string;
  confirmationMessage?: string;
  confirmationAction?: any;
  errorMessage?: string;
  // responsePropName?: string;
  successMessage?: string;
  // isAlreadyExist?: any;
  // frontendElementTranslations?: any;
  logo?: string;
}

export interface NotificationDialogConfig {
  message?: string;
  errorMessage?: string;
}

export interface TableConfig {
  columnDef: string;
  header: string;
  cell: any;
  cellTooltip?: any;
  isToolTip?: boolean;
  truncateTextLength?: number;
}
