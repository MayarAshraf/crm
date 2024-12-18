import { AbstractControl } from "@angular/forms";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { FormlyExtension, FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateService } from "@ngx-translate/core";
import {
  AutocompleteComponent,
  BooleanComponent,
  ButtonFieldComponent,
  ColorComponent,
  DatePickerComponent,
  EditorComponent,
  FileFieldComponent,
  InputComponent,
  FormAccordionComponent,
  InputGroupComponent,
  InputMaskComponent,
  InputNumberComponent,
  MapComponent,
  MultiFilesFieldComponent,
  NgSelectFieldComponent,
  PasswordComponent,
  RadioComponent,
  RatingComponent,
  RepeatArrayTypeComponent,
  RepeatTypeComponent,
  SelectComponent,
  SeparatorComponent,
  SwitchComponent,
  TextareaComponent,
  TreeComponent,
} from "../components";
import { FormStepsComponent } from "../components/fields/form-steps.component";

export class FormlyTranslateExtension implements FormlyExtension {
  constructor(private translate: TranslateService) {}

  prePopulate(field: FormlyFieldConfig) {
    const props = field.props || {};
    field.expressions = field.expressions || {};

    if (props.label) {
      field.expressions["props.label"] = this.translate.stream(props.label);
    }

    if (props.placeholder) {
      field.expressions["props.placeholder"] = this.translate.stream(props.placeholder);
    }
  }
}

export function EmailValidator(control: AbstractControl) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(control.value)
    ? null
    : { email: true };
}

export function fieldMatchValidator(control: AbstractControl) {
  const { password, password_confirmation } = control.value;
  return password_confirmation === password ? null : { fieldMatch: true };
}

export function onlyNumbersValidator(control: AbstractControl) {
  if (!control.value) return true; // Allow empty values since the field is optional
  const isValid = /^\d+$/.test(control.value);
  return isValid ? null : { onlyNumbers: true };
}

export function urlValidator(control: AbstractControl) {
  const isValidUrl = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(control.value);
  return isValidUrl ? null : { invalidUrl: true };
}

export function customFormlyConfig(translate: TranslateService) {
  return {
    validators: [
      { name: "email", validation: EmailValidator },
      { name: "onlyNumbers", validation: onlyNumbersValidator },
      { name: "invalidUrl", validation: urlValidator },
      { name: "fieldMatch", validation: fieldMatchValidator },
    ],
    validationMessages: [
      {
        name: "required",
        message(error: any, field: FormlyFieldConfig) {
          return translate.stream(_("shared.required"));
        },
      },
      {
        name: "minLength",
        message(error: any, field: FormlyFieldConfig) {
          return translate.stream(_("GLOBAL.FORM_VALIDATION.MIN_LENGTH"), {
            minLength: field.props?.minLength,
          });
        },
      },
      {
        name: "maxLength",
        message(error: any, field: FormlyFieldConfig) {
          return translate.stream(_("GLOBAL.FORM_VALIDATION.MAX_LENGTH"), {
            maxLength: field.props?.maxLength,
          });
        },
      },
      {
        name: "min",
        message: (error: any, field: FormlyFieldConfig) => {
          return translate.stream(_("GLOBAL.FORM_VALIDATION.MIN"), { min: field.props?.min });
        },
      },
      {
        name: "max",
        message: (error: any, field: FormlyFieldConfig) => {
          return translate.stream(_("GLOBAL.FORM_VALIDATION.MAX"), { max: field.props?.max });
        },
      },
      {
        name: "email",
        message() {
          return translate.stream(_("GLOBAL.FORM_VALIDATION.VALID_EMAIL"));
        },
      },
      {
        name: "onlyNumbers",
        message() {
          return translate.stream(_("GLOBAL.FORM_VALIDATION.VALID_NUMBER"));
        },
      },
      {
        name: "invalidUrl",
        message() {
          return translate.stream(_("GLOBAL.FORM_VALIDATION.invalid_url"));
        },
      },
      {
        name: "fieldMatch",
        message() {
          return translate.stream(_("GLOBAL.FORM_VALIDATION.COMPARE_PASSWORD_ERROR"));
        },
      },
    ],
    presets: [],
    extensions: [
      {
        name: "translate",
        extension: new FormlyTranslateExtension(translate),
        priority: 3,
      },
    ],
    types: [
      { name: "separator-field", component: SeparatorComponent },
      { name: "select-field", component: SelectComponent },
      { name: "ng-select-field", component: NgSelectFieldComponent },
      { name: "input-field", component: InputComponent },
      { name: "textarea-field", component: TextareaComponent },
      { name: "tree-field", component: TreeComponent },
      { name: "button-field", component: ButtonFieldComponent },
      { name: "switch-field", component: SwitchComponent },
      { name: "boolean-field", component: BooleanComponent },
      { name: "radio-field", component: RadioComponent },
      { name: "rating-field", component: RatingComponent },
      { name: "map-field", component: MapComponent },
      { name: "mask-field", component: InputMaskComponent },
      { name: "number-field", component: InputNumberComponent },
      { name: "repeat-field", component: RepeatTypeComponent },
      { name: "repeat-array-field", component: RepeatArrayTypeComponent },
      { name: "password-field", component: PasswordComponent },
      { name: "autocomplete-field", component: AutocompleteComponent },
      { name: "file-field", component: FileFieldComponent },
      { name: "multi-files-field", component: MultiFilesFieldComponent },
      { name: "input-group-field", component: InputGroupComponent },
      { name: "accordion-field", component: FormAccordionComponent },
      { name: "color-field", component: ColorComponent },
      { name: "date-field", component: DatePickerComponent },
      { name: "editor-field", component: EditorComponent },
      { name: "steps-field", component: FormStepsComponent },
    ],
  };
}
