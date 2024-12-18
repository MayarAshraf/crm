import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { LangService } from "@shared";
import { finalize } from "rxjs";

let totalRequests = 0;
let completedRequests = 0;

const isExcludedRequest = (request: HttpRequest<unknown>) => {
  const excludedEndpoints = ["assets/i18n/", "auth/login", "users/import"];
  return excludedEndpoints.some(segment => request.url.includes(segment));
};

export const HttpRequestInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const currentLang = inject(LangService).currentLanguage;

  const startTime = Date.now();

  totalRequests++;

  if (isExcludedRequest(request)) return next(request);

  const headers: { [key: string]: string | string[] } = {
    Accept: "application/json",
    "X-localization": currentLang(),
  };

  if (!(request.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // If we send FormData, we shouldn't set the Content-Type header, because the browser sets this header to "multipart/form-data". The FormData object does this automatically.

  // Modify all outgoing requests
  request = request.clone({ setHeaders: headers });

  return next(request).pipe(
    finalize(() => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      completedRequests++;
      console.log(`${completedRequests} of ${totalRequests} ${request.url} - (${duration}ms)`);
      if (completedRequests === totalRequests) {
        completedRequests = 0;
        totalRequests = 0;
      }
    }),
  );
};
