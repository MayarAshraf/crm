import { inject, Injectable } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { TranslateService } from "@ngx-translate/core";
import { MenuItem } from "primeng/api";
import { constants } from "../../config";
import { PermissionsService } from "./permissions.service";

@Injectable({
  providedIn: "root",
})
export class StaticDataService {
  #translate = inject(TranslateService);
  #userPermissions = inject(PermissionsService);

  havePermissionsToAssign = this.#userPermissions.hasAnyPermissions([
    constants.permissions["assign-to-assignment-rule"],
    constants.permissions["assign-to-users"],
    constants.permissions["assign-to-groups"],
  ]);

  public languages = [
    { value: 1, label: "EN", selected: true },
    { value: 2, label: "AR", selected: false },
  ];

  public colors = [
    "122, 117, 182",
    "213, 54, 119",
    "88, 190, 141",
    "253, 215, 55",
    "2, 188, 226",
    "47, 84, 163",
    "53, 118, 212",
    "3, 164, 223",
    "119, 119, 122",
    "67, 69, 77",
  ];

  public operationType = [
    { value: 1, label: this.#translate.instant(_("add_balance")) },
    { value: 2, label: this.#translate.instant(_("subtract_balance")) },
  ];

  public usersType = [
    { value: "all", label: this.#translate.instant(_("all_users")) },
    { value: "active", label: this.#translate.instant(_("active_users")) },
    { value: "suspended", label: this.#translate.instant(_("suspended_users")) },
  ];

  public workspaceSettings = [
    { label: this.#translate.instant(_("lead_id")), name: "lead_id", value: true },
    { label: this.#translate.instant(_("created_at")), name: "created_at", value: true },
    { label: this.#translate.instant(_("creator")), name: "creator", value: true },
    { label: this.#translate.instant(_("interests")), name: "interests", value: true },
    { label: this.#translate.instant(_("tags")), name: "tags", value: true },
    { label: this.#translate.instant(_("source")), name: "source", value: false },
    { label: this.#translate.instant(_("assignees")), name: "assignees", value: true },
    // { label: "phones", name: "phones", value: true },
    { label: this.#translate.instant(_("rating")), name: "rating_id", value: true },
    { label: this.#translate.instant(_("quality")), name: "lead_quality_id", value: true },
    {
      label: this.#translate.instant(_("classification")),
      name: "lead_classification_id",
      value: true,
    },
    { label: this.#translate.instant(_("lead_list")), name: "lead_list_id", value: true },
  ];

  public dealsSettings = [
    { label: this.#translate.instant(_("title")), name: "title", value: false },
    { label: this.#translate.instant(_("company")), name: "company", value: false },
    { label: this.#translate.instant(_("latest_feedback")), name: "last_activity", value: true },
    { label: this.#translate.instant(_("interests")), name: "interests", value: true },
    { label: this.#translate.instant(_("tags")), name: "tags", value: true },
    { label: this.#translate.instant(_("assignees")), name: "assignees", value: false },
  ];

  leadsBulkActions: MenuItem[] = [
    {
      label: this.#translate.instant(_("re_assign")),
      icon: "fa fa-user-tie",
      key: "re-assign",
      withSubmitAction: true,
      visible: this.havePermissionsToAssign,
    },
    {
      label: this.#translate.instant(_("change_stage")),
      icon: "fa fa-th",
      key: "stage",
      withSubmitAction: true,
      visible: true,
    },
    {
      label: this.#translate.instant(_("add_interests")),
      icon: "fa fa-heart",
      key: "interests",
      withSubmitAction: true,
      visible: true,
    },
    {
      label: this.#translate.instant(_("add_tags")),
      icon: "fas fa-tags",
      key: "tags",
      withSubmitAction: true,
      visible: true,
    },
    {
      label: this.#translate.instant(_("add_task")),
      icon: "fa fa-check",
      key: "task",
      withSubmitAction: true,
      visible: true,
    },
    {
      label: this.#translate.instant(_("attach_campaign")),
      icon: "fas fa-ad",
      key: "campaign",
      withSubmitAction: true,
      visible: true,
    },
    {
      label: this.#translate.instant(_("change_rating")),
      icon: "fa fa-fire",
      key: "rating",
      withSubmitAction: true,
      visible: true,
    },
    {
      label: this.#translate.instant(_("change_source")),
      icon: "fa fa-dot-circle",
      key: "source",
      withSubmitAction: true,
      visible: true,
    },
    {
      label: this.#translate.instant(_("change_wallet")),
      icon: "fas fa-wallet",
      key: "wallet",
      withSubmitAction: true,
      visible: true,
    },
    {
      label: this.#translate.instant(_("change_lead_list")),
      icon: "fa fa-list",
      key: "list",
      withSubmitAction: true,
      visible: true,
    },
    {
      label: this.#translate.instant(_("change_type")),
      icon: "fa fa-database",
      key: "type",
      withSubmitAction: true,
      visible: true,
    },
    {
      label: this.#translate.instant(_("add_note")),
      icon: "fas fa-wallet",
      key: "note",
      withSubmitAction: true,
      visible: true,
    },
    {
      label: this.#translate.instant(_("change_cold_calls_flag")),
      icon: "fas fa-circle",
      key: "cold-calls",
      withSubmitAction: true,
      visible: true,
    },
    {
      label: this.#translate.instant(_("send_sms")),
      icon: "fas fa-sms",
      key: "sms",
      withSubmitAction: true,
      visible: true,
    },
    {
      label: this.#translate.instant(_("restore_leads")),
      icon: "fas fa-undo",
      key: "restore-leads",
      withSubmitAction: false,
      visible: true,
    },
    {
      label: this.#translate.instant(_("merge")),
      icon: "fa fa-object-group",
      key: "merge",
      withSubmitAction: true,
      visible: true,
    },
    {
      label: this.#translate.instant(_("bulk_delete")),
      icon: "fa fas fa-trash",
      key: "delete",
      withSubmitAction: false,
      visible: true,
    },
  ];

  duplicatesBulkActions: MenuItem[] = [
    {
      label: this.#translate.instant(_("re_assign")),
      icon: "fa fa-user-tie",
      key: "re-assign",
      withSubmitAction: true,
      visible: this.havePermissionsToAssign,
    },
    {
      label: this.#translate.instant(_("merge")),
      icon: "fa fa-object-group",
      key: "merge",
      withSubmitAction: true,
      visible: true,
    },
    {
      label: this.#translate.instant(_("add_as_new")),
      icon: "pi pi-plus-circle",
      key: "add-as-new",
      withSubmitAction: true,
      visible: true,
    },
    {
      label: this.#translate.instant(_("bulk_delete")),
      icon: "fa fas fa-trash",
      key: "delete",
      withSubmitAction: false,
      visible: true,
    },
  ];

  public activityLinks = [
    {
      label: this.#translate.instant(_("overall")),
      icon: "fas fa-dashboard",
      routerLink: "/reports/activities/overall",
      routerLinkActiveOptions: { exact: true },
      styleCard: {
        "background-color": "rgb(0 31 63 / 4%)",
        color: "#001f3f",
        "border-radius": "10px",
      },
    },
    {
      label: this.#translate.instant(_("agents_report")),
      icon: "fas fa-user-tie",
      routerLink: "/reports/activities/agents",
      routerLinkActiveOptions: { exact: true },
      styleCard: {
        "background-color": "rgb(85 120 235 / 4%)",
        color: "#5578eb",
        "border-radius": "10px",
      },
    },
    {
      label: this.#translate.instant(_("call_logs")),
      icon: constants.icons.call,
      routerLink: "/reports/activities/calls/logs",
      routerLinkActiveOptions: { exact: true },
      styleCard: {
        "background-color": "rgb(255 184 34 / 4%)",
        color: "#ffb822",
        "border-radius": "10px",
      },
    },
    {
      label: this.#translate.instant(_("calls_durations")),
      icon: "fas fa-clock",
      routerLink: "/reports/activities/calls/durations",
      routerLinkActiveOptions: { exact: true },
      styleCard: {
        "background-color": "rgb(253 57 122 / 4%)",
        color: "#fd397a",
        "border-radius": "10px",
      },
    },
    {
      label: this.#translate.instant(_("day_work")),
      icon: "fas fa-user-clock",
      routerLink: "/reports/activities/day-work",
      routerLinkActiveOptions: { exact: true },
      styleCard: {
        "background-color": "rgb(128 63 123 / 4%)",
        color: "#803f7b",
        "border-radius": "10px",
      },
    },
    {
      label: this.#translate.instant(_("performance")),
      icon: "fas fa-rocket",
      routerLink: "/reports/activities/performance",
      routerLinkActiveOptions: { exact: true },
      styleCard: {
        "background-color": "rgb(130 90 44 / 4%)",
        color: "#825a2c",
        "border-radius": "10px",
      },
    },
  ];

  public meetingLinks = [
    {
      label: this.#translate.instant(_("overall")),
      icon: "fas fa-dashboard",
      routerLink: "/reports/events/overall",
      routerLinkActiveOptions: { exact: true },
    },
    {
      label: this.#translate.instant(_("done_scheduled_meetings")),
      icon: constants.icons.meeting,
      routerLink: "/reports/events/done-events",
      routerLinkActiveOptions: { exact: true },
    },
    {
      label: this.#translate.instant(_("scheduled_meetings")),
      icon: constants.icons.calendar,
      routerLink: "/reports/events/scheduled",
      routerLinkActiveOptions: { exact: true },
    },
    {
      label: this.#translate.instant(_("detailed")),
      icon: "fas fa-list",
      routerLink: "/reports/events/detailed",
      routerLinkActiveOptions: { exact: true },
    },
  ];

  public leadLinks = [
    {
      label: this.#translate.instant(_("overall")),
      icon: "fas fa-dashboard",
      routerLink: "/reports/leads/overall",
      routerLinkActiveOptions: { exact: true },
    },
    {
      label: this.#translate.instant(_("leads_over_stages")),
      icon: "fas fa-stream",
      routerLink: "/reports/leads/over-stages",
      routerLinkActiveOptions: { exact: true },
    },
    {
      label: this.#translate.instant(_("leads_over_sources")),
      icon: "fas fa-dot-circle",
      routerLink: "/reports/leads/over-sources",
      routerLinkActiveOptions: { exact: true },
    },
    {
      label: this.#translate.instant(_("sources_over_interests")),
      icon: "fas fa-dot-circle",
      routerLink: "/reports/leads/sources-over-Interests",
      routerLinkActiveOptions: { exact: true },
    },
    {
      label: this.#translate.instant(_("leads_over_interests")),
      icon: constants.icons.heart,
      routerLink: "/reports/leads/over-interests",
      routerLinkActiveOptions: { exact: true },
    },
    {
      label: this.#translate.instant(_("leads_over_tags")),
      icon: constants.icons.tags,
      routerLink: "/reports/leads/over-tags",
      routerLinkActiveOptions: { exact: true },
    },
    {
      label: this.#translate.instant(_("leads_over_ratings")),
      icon: "fas fa-star",
      routerLink: "/reports/leads/over-ratings",
      routerLinkActiveOptions: { exact: true },
    },
    {
      label: this.#translate.instant(_("demographics")),
      icon: "fas fa-user-circle",
      routerLink: "/reports/leads/demographics",
      routerLinkActiveOptions: { exact: true },
    },
    {
      label: this.#translate.instant(_("classified")),
      icon: "fas fa-th",
      routerLink: "/reports/leads/classified",
      routerLinkActiveOptions: { exact: true },
    },
    {
      label: this.#translate.instant(_("conversions")),
      icon: "fas fa-user-tie",
      routerLink: "/reports/leads/conversions",
      routerLinkActiveOptions: { exact: true },
    },
    {
      label: this.#translate.instant(_("birthdays")),
      icon: "fas fa-birthday-cake",
      routerLink: "/reports/leads/birthdays",
      routerLinkActiveOptions: { exact: true },
    },
  ];

  public smartReportsLinks = [
    {
      icon: "fas fa-file-contract",
      label: "S.I.G.A",
      routerLink: "/reports/smart/siga",
      routerLinkActiveOptions: { exact: true },
    },
  ];

  public menuItemReport = [
    {
      label: this.#translate.instant(_("activities")),
      expanded: true,
      icon: "fas fa-clipboard-check",
      items: this.activityLinks,
    },
    {
      label: this.#translate.instant(_("meetings")),
      expanded: true,
      icon: constants.icons.meeting,
      items: this.meetingLinks,
    },
    {
      label: this.#translate.instant(_("leads")),
      expanded: true,
      icon: "fas fa-database",
      items: this.leadLinks,
    },
    {
      label: this.#translate.instant(_("smart_reports")),
      expanded: true,
      icon: "fas fa-file-contract",
      items: this.smartReportsLinks,
    },
  ];
}
