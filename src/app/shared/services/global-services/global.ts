import { TemplateRef } from "@angular/core";
import { environment } from "@env";
import { Observable, of } from "rxjs";
import { constants } from "../../config";
import { RequestHeaders, RequestParams } from "./api.service";

/* In TypeScript, interfaces only define the shape of an object but do not allow us to assign default values directly. This is because interfaces do not exist at runtime; they are a compile-time construct used for type checking. To assign default values, we can consider using a class to generate an instance with default values */

// Global types (models/entities)
export interface GlobalApiResponse {
  message: string;
  status: boolean;
  data: any;
}

export type EditData<T> = T & {
  [key: string]: any;
};

export interface BreadcrumbItem {
  label?: string;
  url?: string;
  icon?: string;
}

export interface DataTableColumn {
  title?: string | null;
  name?: string | null;
  searchable?: boolean | null;
  orderable?: boolean | null;
  search?: {
    value?: string | null;
    regex?: boolean | null;
  };
  format?: string;
  render?: TemplateRef<any> | null;
}

export interface FiltersData {
  [key: string]: any;
}

export interface Charts {
  date_range: string[];
  charts: string[];
}

export class BaseCrudIndexMeta {
  rows: number;
  endpoints: { [key: string]: string };
  columns: DataTableColumn[];
  indexIcon: string;
  indexTitle: string;
  createBtnLabel: string;
  indexTableKey: string | undefined;
  reorderableColumns?: boolean;
  reorderableRows?: boolean;
  reorderEndpoint?: string | null;
  headers?: RequestHeaders;
  params?: RequestParams;
  indexApiVersion?: string;
  deleteApiVersion?: string;

  constructor() {
    this.rows = constants.TABLE_ROWS_LENGTH;
    this.endpoints = {} as { [key: string]: string };
    this.columns = [];
    this.indexIcon = constants.icons.info;
    this.indexTitle = "Index";
    this.createBtnLabel = "Create New Item";
    this.indexTableKey = undefined;
    this.reorderableColumns = false;
    this.reorderableRows = false;
    this.reorderEndpoint = null;
    this.headers = undefined;
    this.params = undefined;
    this.indexApiVersion = environment.API_VERSION;
    this.deleteApiVersion = environment.API_VERSION;
  }
}

export class BaseCrudDialogMeta {
  endpoints: { [key: string]: string };
  showDialogHeader: boolean;
  dialogData$: Observable<any>;
  isTitleRenderedAsBtn: boolean;
  dialogTitle: string;
  dialogSubtitle: string;
  titleIcon: string;
  dialogTitleClass: string;
  submitButtonLabel: string;
  isHeaderSticky: boolean;
  showResetButton: boolean;
  showFormActions: boolean;
  showSubmitButton: boolean;
  headers?: RequestHeaders;
  params?: RequestParams;
  createApiVersion?: string;
  updateApiVersion?: string;

  constructor() {
    this.endpoints = {} as { [key: string]: string };
    this.showDialogHeader = true;
    this.dialogData$ = of(1);
    this.isTitleRenderedAsBtn = false;
    this.dialogTitle = "";
    this.dialogSubtitle = "";
    this.titleIcon = "";
    this.dialogTitleClass = "";
    this.submitButtonLabel = "";
    this.isHeaderSticky = true;
    this.showResetButton = true;
    this.showFormActions = true;
    this.showSubmitButton = true;
    this.headers = undefined;
    this.params = undefined;
    this.createApiVersion = environment.API_VERSION;
    this.updateApiVersion = environment.API_VERSION;
  }
}

export type PartialBaseCrudDialogMeta = Partial<BaseCrudDialogMeta>;
// To define a partial of data from the BaseCrudDialogMeta class, we can use the Partial<T> utility type provided by TypeScript. Partial<T> allows us to create a new type that has all the properties of T, but with each property marked as optional.

// Note that when using a partial instance, the properties that are not assigned will have their default values as defined in the BaseCrudDialogMeta class constructor.
