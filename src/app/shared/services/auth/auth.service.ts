import { computed, effect, inject, Injectable } from "@angular/core";
import localForage from "localforage";
import { NgxPermissionsService } from "ngx-permissions";
import { map, tap } from "rxjs";
import { constants } from "../../config";
import { localStorageSignal } from "../../helpers";
import { ApiService } from "../global-services/api.service";
import { AppData, LoginData, User } from "./service-types";

@Injectable({ providedIn: "root" })
export class AuthService {
  #api = inject(ApiService);
  #permissionsService = inject(NgxPermissionsService);

  // data needed for refresh token request
  clientId!: number | null;
  clientSecret!: string | null;

  /*****************************************/

  #idleTime = localStorageSignal(constants.IDLE_TIME, "idle-time"); // in milliseconds (2 hours). private to this service.

  idleTime = this.#idleTime.asReadonly(); // exposed publicly.

  updateIdleTime(time: number) {
    this.#idleTime.set(time);
  }

  /*****************************************/

  // current user
  #CURRENT_USER_KEY = "current-user-key";

  #currentUser = localStorageSignal<User | null>(null, this.#CURRENT_USER_KEY); // private to this service.

  currentUser = this.#currentUser.asReadonly(); // exposed publicly.

  updateCurrentUser(user: User | null) {
    this.#currentUser.set(user);
  }

  /*****************************************/

  // app data
  #APP_DATA_KEY = "app-data-key";

  #appData = localStorageSignal<AppData | null>(null, this.#APP_DATA_KEY); // private to this service.

  appData = this.#appData.asReadonly(); // exposed publicly.

  updateAppData(data: AppData | null) {
    this.#appData.set(data);
  }

  /*****************************************/

  // access token
  #ACCESS_TOKEN_KEY = "access-token-key";

  #accessToken = localStorageSignal<string | null>(null, this.#ACCESS_TOKEN_KEY); // private to this service.

  accessToken = this.#accessToken.asReadonly(); // exposed publicly.

  updateAccessToken(token: string | null) {
    this.#accessToken.set(token);
  }

  /*****************************************/

  isLoggedIn = computed<boolean>(() => !!this.accessToken());

  /*****************************************/

  // refresh token
  #REFRESH_TOKEN_KEY = "refresh-token-key";

  #refreshToken = localStorageSignal<string | null>(null, this.#REFRESH_TOKEN_KEY); // private to this service.

  refreshToken = this.#refreshToken.asReadonly(); // exposed publicly.

  updateRefreshToken(token: string | null) {
    this.#refreshToken.set(token);
  }

  /*****************************************/

  // permissions
  #PERMISSIONS_KEY = "permissions-key";

  #userPermissions = localStorageSignal<string[] | null>(null, this.#PERMISSIONS_KEY); // private to this service.

  userPermissions = this.#userPermissions.asReadonly(); // exposed publicly.

  updateUserPermissions(permissions: string[] | null) {
    this.#userPermissions.set(permissions);
  }

  updatePermissions = effect(() => {
    this.userPermissions() && this.userPermissions()?.length
      ? this.#permissionsService.loadPermissions(this.userPermissions() as string[])
      : this.#permissionsService.flushPermissions();
  });

  /*****************************************/

  getUserPermissions() {
    return this.#api
      .request("post", "users/userPermissionsArray", {})
      .pipe(map(({ data }) => data));
  }

  /*****************************************/

  login(credentials: any) {
    return this.#api
      .request("post", "auth/login", credentials)
      .pipe(tap(({ data }) => this.doLogin(data)));
  }

  logout() {
    return this.#api.request("post", "auth/logout", {}).pipe(tap(() => this.doLogout()));
  }

  doLogin(data: LoginData) {
    this.clientId = data.client_id;
    this.clientSecret = data.client_secret;
    this.updateCurrentUser(data.user);
    this.updateAppData(data.app_data);
    this.updateAccessToken(data.token);
    this.updateRefreshToken(data.refresh_token);
    this.updateUserPermissions(data.app_data?.permissions);
  }

  doLogout() {
    this.clientId = null;
    this.clientSecret = null;
    this.updateCurrentUser(null);
    this.updateAppData(null);
    this.updateAccessToken(null);
    this.updateRefreshToken(null);
    this.updateUserPermissions(null);
    localForage.clear();
  }

  refreshAccessToken() {
    const requestBody = {
      grant_type: "refresh_token",
      refresh_token: this.refreshToken(),
      client_id: this.clientId,
      client_secret: this.clientSecret,
      scope: "*",
    } as const;

    return this.#api.request<typeof requestBody, { access_token: string; refresh_token: string }>(
      "post",
      "oauth/token",
      requestBody,
    );
  }
}
