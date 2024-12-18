import { inject, Injectable } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { FormlyFieldConfig, FormlyFieldProps } from "@ngx-formly/core";
import { TranslateService } from "@ngx-translate/core";
import { CachedListsService, ConfettiService, ListOption } from "@shared";
import { map, Observable, switchMap, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PipelinesFieldsService {
  // This service uses cascade select
  #cachedLists = inject(CachedListsService);
  #confettiService = inject(ConfettiService);
  #translate = inject(TranslateService);

  pipelinableSelectField(data: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: data.key,
      type: "select-field",
      className: data?.className,
      expressions: data.expressions,
      hide: data.hide,
      props: {
        label: data?.props?.label,
        placeholder: data?.props?.placeholder,
        required: data?.props?.required,
        filter: data?.props?.filter !== false,
        multiple: data?.props?.multiple,
        showHeader: data?.props?.showHeader !== false,
        showClear: data?.props?.showClear,
        options: [
          { label: this.#translate.instant(_("opportunity")), value: 1 },
          { label: this.#translate.instant(_("Lead")), value: 2 },
          { label: this.#translate.instant(_("Task")), value: 3 },
          { label: this.#translate.instant(_("Ticket")), value: 4 },
        ],
      },
    };
  }

  #getStagesOptions(field: FormlyFieldConfig | undefined, pipelineId: number) {
    (field?.props as FormlyFieldProps).options = this.#cachedLists
      .getLists()
      .pipe(map(o => o.get(`pipelines:pipeline_stages:id:${pipelineId}`) || []));
  }

  getPipelineField(data: FormlyFieldConfig, listKey: string): FormlyFieldConfig {
    return {
      key: "pipeline_id",
      type: "select-field",
      className: data?.className,
      expressions: data.expressions,
      hide: data.hide,
      props: {
        label: data?.props?.label,
        placeholder: data?.props?.placeholder,
        required: data?.props?.required,
        filter: data?.props?.filter !== false,
        multiple: data?.props?.multiple,
        showHeader: data?.props?.showHeader !== false,
        showClear: data?.props?.showClear,
        options: this.#cachedLists.getLists().pipe(map(o => o.get(`${listKey}`) || [])),
        change(field, event) {
          event.originalEvent.stopPropagation();
        },
      },
      hooks: {
        onInit: field => {
          const stagesField = field.parent?.get?.("pipeline_stage_id");
          this.#getStagesOptions(stagesField, field.model?.pipeline_id);

          return field.formControl?.valueChanges.pipe(
            tap(id => {
              if (id) {
                this.#cachedLists.updateLists([`pipelines:pipeline_stages:id:${id}`]);
                this.#getStagesOptions(stagesField, id);
              }
              stagesField?.formControl?.setValue(null);
            }),
          );
        },
      },
    };
  }

  getPipelineStageField(data: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: "pipeline_stage_id",
      type: "select-field",
      className: data?.className,
      expressions: {
        hide: field => !field.model?.pipeline_id,
      },
      hide: data.hide,
      props: {
        label: data?.props?.label,
        placeholder: data?.props?.placeholder,
        required: data?.props?.required,
        filter: data?.props?.filter !== false,
        multiple: data?.props?.multiple,
        showHeader: data?.props?.showHeader !== false,
        showClear: data?.props?.showClear,
        options: [],
        change(field, event) {
          event.originalEvent.stopPropagation();
        },
      },
      hooks: {
        onInit: field => {
          return field.formControl?.valueChanges.pipe(
            switchMap(value => {
              return (field.props?.options as Observable<any[]>)?.pipe(
                tap(stages => {
                  const opt = stages?.find(
                    (s: { value: number }) => s.value === value,
                  ) as Partial<ListOption> & { probability?: number };
                  if (opt?.probability !== 100) return;
                  this.#confettiService.playConfetti();
                }),
              );
            }),
          );
        },
      },
    };
  }
}
