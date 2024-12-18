import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from "@angular/router";
import { ModuleGuard, constants } from "@shared";
import { ngxPermissionsGuard } from "ngx-permissions";

const activitiesRoutes = [
  {
    path: "overall",
    loadComponent: () => import("./screens/activities/overall/overall.component"),
    data: {
      title: "Overall Activity Report",
      icon: "fas fa-dashboard",
      breadcrumbs: [{ label: "reports", url: "/reports" }, { label: "Overall" }],
    },
  },
  {
    path: "agents",
    loadComponent: () => import("./screens/activities/agents/agents.component"),
    data: {
      title: "Agents Report",
      icon: "fa fa-users",
      breadcrumbs: [{ label: "reports", url: "/reports" }, { label: "Agents" }],
    },
  },
  {
    path: "calls",
    children: [
      {
        path: "logs",
        loadComponent: () => import("./screens/activities/calls/logs/logs.component"),
        data: {
          title: "Call Logs Report",
          icon: "fas fa-phone",
          breadcrumbs: [{ label: "reports", url: "/reports" }, { label: "Logs" }],
        },
      },
      {
        path: "durations",
        loadComponent: () => import("./screens/activities/calls/durations/durations.component"),
        data: {
          title: "Call Durations Report",
          icon: "fas fa-clock",
          breadcrumbs: [{ label: "reports", url: "/reports" }, { label: "Durations" }],
        },
      },
    ],
  },
  {
    path: "day-work",
    loadComponent: () => import("./screens/activities/day-work/day-work.component"),
    data: {
      title: "Day Work Report",
      icon: "fas fa-user-clock",
      breadcrumbs: [{ label: "reports", url: "/reports" }, { label: "DayWork" }],
    },
  },
  {
    path: "performance",
    loadComponent: () => import("./screens/activities/performance/performance.component"),
    data: {
      title: "Performance Report",
      icon: "fas fa-rocket",
      breadcrumbs: [{ label: "reports", url: "/reports" }, { label: "Performance" }],
    },
  },
  {
    path: "performance/:id",
    loadComponent: () => import("./screens/activities/performance-user/performance-user.component"),
    data: {
      title: "Performance User Report",
      icon: "fas fa-rocket",
      breadcrumbs: [
        { label: "reports", url: "/reports" },
        { label: "performance", url: "/performance" },
        { label: "Performance User" },
      ],
    },
    canActivate: [
      (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        const srcImage = route.queryParams["srcImage"];
        const fullName = route.queryParams["fullName"];
        const jobTitle = route.queryParams["jobTitle"];
        const joinData = route.queryParams["joinData"];
        const lastLogin = route.queryParams["lastLogin"];
        const group = route.queryParams["group"];

        if (
          !srcImage ||
          !fullName ||
          !jobTitle ||
          !joinData ||
          !lastLogin ||
          !group
        ) {
          inject(Router).navigate(["/reports/activities/performance"]);
          return false;
        }
        return true;
      },
    ],
  },
];

const eventsRoutes = [
  {
    path: "overall",
    loadComponent: () => import("./screens/events/overall/overall.component"),
    data: {
      title: "Overall Events Report",
      icon: "fas fa-dashboard",
      breadcrumbs: [{ label: "reports", url: "/reports" }, { label: "overall" }],
    },
  },
  {
    path: "done-events",
    loadComponent: () => import("./screens/events/done-meetings/done-meetings.component"),
    data: {
      title: "Overall Events Report",
      icon: constants.icons.meeting,
      breadcrumbs: [{ label: "reports", url: "/reports" }, { label: "done events" }],
    },
  },
  {
    path: "scheduled",
    loadComponent: () => import("./screens/events/scheduled-meetings/scheduled-meetings.component"),
    data: {
      title: "Scheduled Meetings Report",
      icon: constants.icons.calendar,
      breadcrumbs: [{ label: "reports", url: "/reports" }, { label: "scheduled" }],
    },
  },
  {
    path: "detailed",
    loadComponent: () => import("./screens/events/detailed/detailed.component"),
    data: {
      title: "Detailed Report",
      icon: "fas fa-list",
      breadcrumbs: [{ label: "reports", url: "/reports" }, { label: "scheduled" }],
    },
  },
];

const leadsRoutes = [
  {
    path: "overall",
    loadComponent: () => import("./screens/leads/overall/overall.component"),
    data: {
      title: "Overall Leads Report",
      icon: "fas fa-dashboard",
      breadcrumbs: [{ label: "reports", url: "/reports" }, { label: "overall" }],
    },
  },
  {
    path: "over-stages",
    loadComponent: () => import("./screens/leads/lead-over-stages/lead-over-stages.component"),
    data: {
      title: "Over Stages Leads Report",
      icon: "fas fa-stream",
      breadcrumbs: [{ label: "reports", url: "/reports" }, { label: "over stages" }],
    },
  },
  {
    path: "over-sources",
    loadComponent: () => import("./screens/leads/lead-over-sources/lead-over-sources.component"),
    data: {
      title: "Over Sources Leads Report",
      icon: "fas fa-dot-circle",
      breadcrumbs: [{ label: "reports", url: "/reports" }, { label: "Over Sources" }],
    },
  },
  {
    path: "sources-over-Interests",
    loadComponent: () =>
      import("./screens/leads/source-over-interests/source-over-interests.component"),
    data: {
      title: "Sources Over Interests Leads Report",
      icon: "fas fa-dot-circle",
      breadcrumbs: [{ label: "reports", url: "/reports" }, { label: "Sources Over Interests" }],
    },
  },
  {
    path: "over-interests",
    loadComponent: () =>
      import("./screens/leads/lead-over-interests/lead-over-interests.component"),
    data: {
      title: "Over Interests Leads Report",
      icon: constants.icons.heart,
      breadcrumbs: [{ label: "reports", url: "/reports" }, { label: "Over Interests" }],
    },
  },
  {
    path: "over-tags",
    loadComponent: () => import("./screens/leads/lead-over-tag/lead-over-tag.component"),
    data: {
      title: "Over Tags Leads Report",
      icon: constants.icons.tags,
      breadcrumbs: [{ label: "reports", url: "/reports" }, { label: "Over Tags" }],
    },
  },
  {
    path: "over-ratings",
    loadComponent: () => import("./screens/leads/lead-over-ratings/lead-over-ratings.component"),
    data: {
      title: "Over Ratings Leads Report",
      icon: "fas fa-star",
      breadcrumbs: [{ label: "reports", url: "/reports" }, { label: "Over Ratings" }],
    },
  },
  {
    path: "demographics",
    loadComponent: () => import("./screens/leads/demographics/demographics.component"),
    data: {
      title: "Demographics Leads Report",
      icon: "fas fa-user-circle",
      breadcrumbs: [{ label: "reports", url: "/reports" }, { label: "Demographics" }],
    },
  },
  {
    path: "classified",
    loadComponent: () => import("./screens/leads/classified/classified.component"),
    data: {
      title: "Classified Leads Report",
      icon: "fas fa-th",
      breadcrumbs: [{ label: "reports", url: "/reports" }, { label: "Classified" }],
    },
  },
  {
    path: "conversions",
    loadComponent: () => import("./screens/leads/conversions/conversions.component"),
    data: {
      title: "Conversions Leads Report",
      icon: "fas fa-user-tie",
      breadcrumbs: [{ label: "reports", url: "/reports" }, { label: "Conversions" }],
    },
  },
  {
    path: "birthdays",
    loadComponent: () => import("./screens/leads/birthdays/birthdays.component"),
    data: {
      title: "Birthdays Leads Report",
      icon: "fas fa-birthday-cake",
      breadcrumbs: [{ label: "reports", url: "/reports" }, { label: "Birthdays" }],
    },
  },
];

const smartRoutes = [
  {
    path: "siga",
    loadComponent: () => import("@abort503"),
    data: {
      title: "S.I.G.A",
      icon: "fas fa-file-contract",
      breadcrumbs: [{ label: "reports", url: "/reports" }, { label: "S.I.G.A" }],
    },
  },
];

export const reportsRoutes: Routes = [
  {
    path: "reports",
    canActivate: [ModuleGuard],
    data: {
      enabledModule: constants.modulesNames["Reports Module"],
    },
    loadComponent: () => import("./reports.component"),
    children: [
      { path: "activities", children: activitiesRoutes },
      { path: "events", children: eventsRoutes },
      { path: "leads", children: leadsRoutes },
      { path: "smart", children: smartRoutes },
      {
        path: "reports-scheduler",
        canActivate: [ModuleGuard, ngxPermissionsGuard],
        loadComponent: () => import("./screens/reports-scheduler/reports-scheduler.component"),
        title: "Reports Scheduler",
        data: {
          enabledModule: constants.modulesNames["Reports Scheduler Module"],
          breadcrumbs: [{ label: "Settings", url: "/settings" }, { label: "Reports Scheduler" }],
          permissions: {
            only: [constants.permissions["index-scheduled-reports"]],
            redirectTo: "403",
          },
        },
      },
    ],
  },
];
