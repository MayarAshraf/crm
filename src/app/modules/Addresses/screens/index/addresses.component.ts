import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { AddressModel } from "@modules/Addresses/services/service-type";
import { TranslateModule } from "@ngx-translate/core";
import {
  BaseIndexComponent,
  CachedLabelsService,
  constants,
  CopyButtonComponent,
  DateFormatterPipe,
  EnabledModuleService,
  RangePipe,
  TableWrapperComponent,
} from "@shared";
import { MenuItem } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { MenuModule } from "primeng/menu";
import { SkeletonModule } from "primeng/skeleton";
import { TooltipModule } from "primeng/tooltip";
import { AddressCuComponent } from "./address-cu.component";

@Component({
  selector: "app-index-addresses",
  standalone: true,
  templateUrl: "./addresses.component.html",
  imports: [
    TableWrapperComponent,
    RangePipe,
    SkeletonModule,
    MenuModule,
    ButtonModule,
    TooltipModule,
    DateFormatterPipe,
    CopyButtonComponent,
    TranslateModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexAddressesComponent extends BaseIndexComponent<
  AddressModel,
  ComponentType<AddressCuComponent>
> {
  #enabledModule = inject(EnabledModuleService);
  #cachedLabels = inject(CachedLabelsService);

  addressableType = input.required<string>();
  addressableId = input.required<number>();
  withTableTitle = input(true);

  getLabelById(listKey: string, id: number | null) {
    return this.#cachedLabels.getLabelById(listKey, id as number);
  }

  ngOnInit() {
    this.filtersData.update(filters => ({
      ...filters,
      addressable_type: this.addressableType(),
      addressable_id: this.addressableId(),
    }));
    this.moduleName = this.#enabledModule.hasModule(constants.modulesNames["Addresses Module"]);
    this.dialogComponent = AddressCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: { index: "addresses/addresses", delete: "addresses/addresses/delete" },
      indexTitle: this.withTableTitle() ? "addresses" : "",
      indexApiVersion: "v2",
      deleteApiVersion: "v2",
      indexIcon: this.withTableTitle() ? "fas fa-map-marker-alt" : "",
      createBtnLabel: this.translate.instant(_("create_address")),
      indexTableKey: "ADDRESSES_KEY",
      columns: [
        {
          name: "address_line_1",
          searchable: true,
        },
        {
          name: "address_line_2",
          searchable: true,
        },
        {
          name: "address_name",
          searchable: true,
        },
        {
          name: "building_number",
          searchable: true,
        },
        {
          name: "floor_number",
          searchable: true,
        },
        {
          name: "landmark",
          searchable: true,
        },
        {
          name: "postal_code",
          searchable: true,
        },
        {
          name: "phone_number",
          searchable: true,
        },
        {
          name: "created_by",
          searchable: false,
        },
        {
          name: "created_at",
          searchable: false,
        },
      ],
    };
  }

  override openCreateRecordDialog() {
    const model = {
      addressable_type: this.addressableType(),
      addressable_id: this.addressableId(),
      method: "create",
    };
    this.dialogConfig = { ...this.dialogConfig, data: model };
    super.openCreateRecordDialog();
  }

  getActions: MenuItem[] = [
    {
      label: this.translate.instant(_("update_address")),
      icon: constants.icons.pencil,
      slug: "update",
    },
    {
      label: this.translate.instant(_("delete_address")),
      icon: "fas fa-trash",
      slug: "delete",
    },
  ];
}
