import { CurrencyPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { IOpportunity } from "@modules/Opportunities/services/service-types";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import {
  AvatarListComponent,
  CachedLabelsService,
  CachedListsService,
  EntitySelectComponent,
  GlobalActionService,
  InplaceDescComponent,
  TimelineCardComponent,
  TruncateTextPipe,
  constants,
} from "@shared";
import { AvatarModule } from "primeng/avatar";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { TooltipModule } from "primeng/tooltip";
import { OpportunityCloseDateComponent } from "../opportunity-fields/opportunity-close-date.component";
import { OpportunityClosedAtComponent } from "../opportunity-fields/opportunity-closed-at.component";
import { OpportunityInterestsComponent } from "../opportunity-fields/opportunity-interests.component";
import { OpportunityTagsComponent } from "../opportunity-fields/opportunity-tags.component";
import { UpdateOpportunityFormComponent } from "../update-opportunity-form/update-opportunity-form.component";

@Component({
  selector: "app-opportunity-card",
  standalone: true,
  template: `
    <div class="relative" [id]="'scroll-target-' + opportunity().id">
      <div #deleteTarget class="confirm-target"></div>

      <app-timeline-card [value]="opportunity()" [moreOptions]="moreOptions">
        <div header class="flex flex-wrap gap-3 align-items-center">
          @if (displayUpdateForm()) {
            <button
              pButton
              type="button"
              icon="pi pi-chevron-left text-xs"
              class="p-button-link text-sm p-0"
              [label]="'back' | translate"
              (click)="displayUpdateForm.set(false)"
            ></button>
          } @else {
            <app-inplace-input
              [(entity)]="opportunity"
              updateType="name"
              inputType="input"
              [enterBtnLabel]="'enter_name' | translate"
              [editBtnLabel]="'edit_name' | translate"
              [endpoint]="constants.API_ENDPOINTS.updateOpportunitiesData"
            />
            <app-inplace-input
              [(entity)]="opportunity"
              [btnLabel]="btnLabel()"
              btnStyleClass="text-green"
              updateType="amount"
              inputType="input"
              [enterBtnLabel]="'enter_amount' | translate"
              [editBtnLabel]="'edit_amount' | translate"
              [endpoint]="constants.API_ENDPOINTS.updateOpportunitiesData"
            />

            <div class="flex align-items-center gap-2">
              <span class="item-label capitalize text-700 font-medium mb-0">
                {{
                  probability() === 0
                    ? ("lost_at" | translate)
                    : probability() === 100
                      ? ("won_at" | translate)
                      : ("expected_at" | translate)
                }}
              </span>

              @if (probability() === 0 || probability() === 100) {
                <app-opportunity-closed-at [(opportunity)]="opportunity" />
              } @else {
                <app-opportunity-close-date [(opportunity)]="opportunity" />
              }
            </div>
          }
        </div>

        <div content>
          @if (displayUpdateForm()) {
            <div class="py-4 px-3 bg-white border-round border-300 border-1">
              <app-update-opportunity-form
                [(data)]="opportunity"
                (onOpportunityAdded)="onUpdate($event)"
              />
            </div>
          } @else {
            <app-inplace-input
              [(entity)]="opportunity"
              [endpoint]="constants.API_ENDPOINTS.updateOpportunitiesData"
            />

            <p-divider styleClass="my-2"></p-divider>

            <div class="flex md:flex-wrap align-items-center justify-content-between gap-2">
              <div class="flex-1 flex flex-wrap align-items-center gap-2">
                <app-opportunity-tags [(opportunity)]="opportunity" />
                <app-opportunity-interests [(opportunity)]="opportunity" />

                <!-- @if (opportunity().bi_unit_id) {
                  <span
                    class="text-sm"
                    [pTooltip]="'Unit: ' + opportunity().bi_unit_id"
                    tooltipPosition="top"
                  >
                    <i [class]="constants.icons.bed"></i>
                    {{ opportunity().bi_unit_id | truncateText: 10 }}
                  </span>
                } -->

                @if (opportunity().broker_id) {
                  <span class="text-sm" [pTooltip]="'Broker: ' + broker()" tooltipPosition="top">
                    <i [class]="constants.icons.userSecret"></i>
                    {{ broker() | truncateText: 10 }}
                  </span>
                }
              </div>

              <div class="flex-1 flex flex-wrap align-items-center md:justify-content-end gap-2">
                @if ((opportunity().closed_by && probability() === 0) || probability() === 100) {
                  <p-avatar
                    image="assets/media/icons/avatar.jpg"
                    [pTooltip]="closedByTemp"
                    tooltipPosition="top"
                    shape="circle"
                  ></p-avatar>
                  <ng-template #closedByTemp>
                    <span>
                      {{ probability() === 100 ? ("won_at" | translate) : ("lost_at" | translate) }}
                      {{ closedBy() }}
                    </span>
                  </ng-template>
                }

                <app-entity-select
                  [(entity)]="opportunity"
                  [endpoint]="constants.API_ENDPOINTS.updateOpportunitiesData"
                  apiVersion="v2"
                  [group]="true"
                  listModule="pipelines"
                  listName="deal_pipeline_stages"
                  updateType="pipeline_stage_id"
                  placeholder="pipeline_stage"
                  (onChange)="opportunity.set($event)"
                />

                @if (
                  getLabelsByIds("assignments:all_users_info", opportunity().assignees_ids);
                  as assignees
                ) {
                  <app-avatar-list [items]="assignees" />
                }
              </div>
            </div>
          }
        </div>
      </app-timeline-card>
    </div>
  `,
  styles: `
    .confirm-target {
      position: absolute;
      top: 1rem;
      left: calc(50% - 95px);
      transform: translateX(-50%);
      pointer-events: none;
    }
  `,
  imports: [
    ButtonModule,
    DividerModule,
    AvatarModule,
    TooltipModule,
    TimelineCardComponent,
    OpportunityTagsComponent,
    OpportunityInterestsComponent,
    OpportunityCloseDateComponent,
    AvatarListComponent,
    TruncateTextPipe,
    OpportunityClosedAtComponent,
    UpdateOpportunityFormComponent,
    EntitySelectComponent,
    InplaceDescComponent,
    TranslateModule,
  ],
  providers: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpportunityCardComponent extends GlobalActionService {
  #cachedLists = inject(CachedListsService);
  #cachedLabels = inject(CachedLabelsService);
  #currencyPipe = inject(CurrencyPipe);
  #el = inject(ElementRef);
  #translate = inject(TranslateService);

  opportunity = model.required<IOpportunity>();
  endpoint = input<string>("");
  onDelete = output<any>();

  probability = computed(() => {
    return this.#cachedLists
      .loadLists()
      .get("pipelines:deal_pipeline_stages")
      ?.find((s: { value: number }) => s.value === this.opportunity().pipeline_id)
      ?.items?.find((s: { value: number }) => s.value === this.opportunity().pipeline_stage_id)
      ?.probability;
  });

  btnLabel = computed(
    () =>
      this.#currencyPipe.transform(this.opportunity()?.amount, this.opportunity()?.currency_code) +
      "",
  );

  deleteTarget = viewChild.required<ElementRef>("deleteTarget");

  displayUpdateForm = signal(false);
  constants = constants;

  getLabelsByIds(listKey: string, ids: number[]) {
    return this.#cachedLabels.getLabelsByIds(listKey, ids);
  }

  broker = computed(() => {
    const brokers = this.#cachedLists.loadLists().get("brokers:brokers");
    return brokers?.find((b: { value: number }) => this.opportunity()?.broker_id === b.value)
      ?.label;
  });

  closedBy = computed(() => {
    const users = this.#cachedLists.loadLists().get("assignments:all_users_info");
    return users?.find((u: { value: number }) => this.opportunity()?.closed_by === u.value)?.label;
  });

  moreOptions = [
    {
      label: this.#translate.instant(_("update_deal")),
      icon: constants.icons.pencil,
      command: () => this.displayUpdateForm.set(true),
    },
    {
      label: this.#translate.instant(_("delete")),
      icon: "fas fa-trash-alt",
      command: () => {
        const target = this.deleteTarget().nativeElement;
        this.deleteAction(this.endpoint(), target, this.opportunity().id);
      },
    },
  ];

  protected updateUi(): void {
    this.onDelete.emit(this.opportunity().id);
  }

  onUpdate(opportunity: IOpportunity) {
    this.opportunity.set(opportunity);
    this.displayUpdateForm.set(false);
    this.scrollToTarget();
  }

  scrollToTarget() {
    const id = `#scroll-target-${this.opportunity().id}`;
    const targetElement = this.#el.nativeElement.querySelector(id);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  }
}
