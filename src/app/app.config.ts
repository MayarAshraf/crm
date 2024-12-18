import { HttpClient, provideHttpClient, withInterceptors } from "@angular/common/http";
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, inject } from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions,
} from "@angular/router";
import { FORMLY_CONFIG, FormlyModule } from "@ngx-formly/core";
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader"; // loads the json file for the chosen language
import {
  CustomPageTitleProvider,
  HttpRequestInterceptor,
  HttpResponseInterceptor,
  LangService,
  LoadModulesService,
  RefreshTokenInterceptor,
  customFormlyConfig,
} from "@shared";
import { DROPZONE_CONFIG, DropzoneConfigInterface } from "ngx-dropzone-wrapper";
import { provideLottieOptions } from "ngx-lottie";
import { NgxPermissionsModule } from "ngx-permissions";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { routes } from "./app.routes";

export function initializeLangFactory() {
  const langService = inject(LangService);
  const lang = langService.currentLanguage();
  return () => langService.switchLanguage(lang);
}

// AoT requires an exported loader function for factories.
export function translateLoaderFactory(http: HttpClient) {
  // The TranslateHttpLoader will import the translations
  // stored in json files ("en.json", "ar.json").
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
  // "./assets/i18n/" is a prefix, and ".json" is a suffix.
  // If you have a "JIT" compilation, you don't need to configure prefix and suffix,
  // you will only need to configure them if you have an "AOT" compilation.
}

export function enabledModulesFactory(loadModulesService: LoadModulesService) {
  // Factory Functions in Angular can return either finite or infinite Observables. If the factory function performs an asynchronous operation that completes, such as fetching data from a server, it would return a finite Observable.
  // So, we don't need to subscribe to getEnabledModules() manually. Angular will take care of subscribing to it and waiting for its completion before initializing the application.
  return () => loadModulesService.getEnabledModules();
}

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  createImageThumbnails: true,
  method: "post",
  paramName: "files",
  uploadMultiple: true,
  addRemoveLinks: true,
  clickable: true,
  autoProcessQueue: true,
};

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    ConfirmationService,
    CustomPageTitleProvider,
    DynamicDialogConfig,
    DynamicDialogRef,
    DialogService,
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([HttpResponseInterceptor, RefreshTokenInterceptor, HttpRequestInterceptor]),
    ),
    provideLottieOptions({
      player: () => import(/* webpackChunkName: 'lottie-web' */ "lottie-web"),
    }),
    provideRouter(
      routes,
      withViewTransitions(),
      withComponentInputBinding(),
      withRouterConfig({
        onSameUrlNavigation: "ignore", // "ignore" (The default), "reload"
        paramsInheritanceStrategy: "always", // 'always' (The default), 'emptyOnly'
      }),
      // preload all the lazy loaded modules except those guarded with canLoad guard.
      // Note: this will preload the lazy loaded modules those guarded with canActivate guard.
      // withPreloading(PreloadAllModules),
      // withDebugTracing(),
      withInMemoryScrolling({
        // Enable scrolling to anchors
        anchorScrolling: "enabled",
        // Configures if the scroll position needs to be restored when navigating back.
        scrollPositionRestoration: "enabled",
      }),
    ),
    importProvidersFrom(
      LoadingBarHttpClientModule,
      NgxPermissionsModule.forRoot(),
      FormlyModule.forRoot(),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: translateLoaderFactory,
          deps: [HttpClient],
          // deps tells "angular dependency injection" what dependencies are needed to inject translateLoaderFactory()
        },
      }),
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeLangFactory,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: enabledModulesFactory,
      deps: [LoadModulesService],
      multi: true,
    },
    {
      provide: FORMLY_CONFIG,
      useFactory: customFormlyConfig,
      deps: [TranslateService],
      multi: true,
    },
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG,
    },
  ],
};
