import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { TimeoutError, catchError, filter, tap, throwError } from "rxjs";
import { AlertService, GlobalApiResponse, SoundsService } from "../services";

const isExcludedRequest = (request: HttpRequest<unknown>) => {
  const excludedEndpoints = ["assets/i18n/"];
  return excludedEndpoints.some(segment => request.url.includes(segment));
};

export const HttpResponseInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const alertService = inject(AlertService);
  const soundsService = inject(SoundsService);

  if (isExcludedRequest(request)) return next(request);

  return next(request).pipe(
    filter((event): event is HttpResponse<GlobalApiResponse> => event instanceof HttpResponse),
    // `event is HttpResponse<GlobalApiResponse>` syntax is not a return type, but rather a `type predicate`. the purpose of the `type predicate` is to tell TypeScript that if the predicate function returns true, the type of event inside the `tap` should be narrowed down to HttpResponse<GlobalApiResponse>. This allows you to access properties and methods of HttpResponse<GlobalApiResponse> (like body.status, body.message) without TypeScript raising a type error.
    tap(response => {
      if (response.body) {
        alertService.setMessage({
          severity: response.body.status ? "success" : "warn",
          detail: response.body.message,
        });
      }
    }),
    // retry must comes before the catchError().
    /* retry({
      count: 1, // retry 1 times on failed requests before throwing an error.
      delay: (_, retryCount) => timer(retryCount * 1000)
    }), */
    /* we can provide a static value for delay like 1000 (one second), but also we can Implement Progressive retry strategies. so the interval between calls will be always increasing. */

    catchError((error: HttpErrorResponse) => {
      let errorMessage = "";

      // If error status is 401 we want to skip it and handle it in token interceptor.
      if (error.status === 401) return throwError(() => error);

      if (!navigator.onLine) {
        // Handle connection error due to losing internet connection
        errorMessage = "No internet connection. Please check your network and try again.";
      } else if (error.error instanceof ErrorEvent) {
        // client side error
        errorMessage = error.error.message;
      } else {
        // server-side error
        switch (error.status) {
          case 422:
            // validation error
            let allErrorMessages = "";
            error.error.errors.forEach((err: HttpErrorResponse) => {
              allErrorMessages += err.message;
            });
            errorMessage = allErrorMessages;
            break;
          case 403:
            errorMessage = "(403) You do not have permission to access this resource.";
            break;
          case 404:
            errorMessage = "(404) The requested resource could not be found.";
            break;
          case 400: // Bad Request: the server is unable to understand.
          case 500: // Internal Server Error
          case 503: //  Service Unavailable
            errorMessage = "We have been notified of this mistake and we are looking to fix it.";
            break;
          default:
            // Other server-side errors
            errorMessage = "An unknown error occurred 💥💥";
            break;
        }

        if (error instanceof TimeoutError) {
          // Timeout error
          errorMessage = "Connection timed out.";
        }
      }

      alertService.setMessage({ severity: "error", detail: errorMessage });
      soundsService.playSound("error");
      return throwError(() => error); // Re-throw the error
    }),
  );
};
