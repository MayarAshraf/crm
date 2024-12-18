import { Routes } from "@angular/router";
import { ModuleGuard, constants } from "@shared";

export const calendarRoutes: Routes = [
  {
    path: "calendar",
    canActivate: [ModuleGuard],
    data: {
      enabledModule: [
        constants.modulesNames["Tasks Module"],
        constants.modulesNames["Events Module"],
      ],
      typeConditionModule: "any",
    },
    children: [
      {
        path: "",
        loadComponent: () => import("./calendar/calendar.component"),
      },
      {
        path: "todos",
        loadComponent: () => import("./todos/screens/todos.component"),
        data: {
          stateKeys: {
            storedChipsKey: "todos-chips-key",
          },
        },
      },
    ],
  },
];
