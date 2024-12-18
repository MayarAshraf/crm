import { ChangeDetectionStrategy, Component } from "@angular/core";
import { BaseIndexComponent, TableWrapperComponent } from "@shared";

@Component({
  selector: "app-detailed",
  standalone: true,
  imports: [TableWrapperComponent],
  templateUrl: "./detailed.component.html",
  styleUrl: "./detailed.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DetailedComponent extends BaseIndexComponent<any> {
  ngOnInit() {
    this.permissions.set({
      index: true,
      create: true,
      update: true,
      delete: true,
    });

    this.indexMeta = {
      ...this.indexMeta,
      indexTitle: "Users",
      indexIcon: "fas fa-users",
      createBtnLabel: "Add User",
      indexTableKey: "MEETINGS_OVERALL_KEY",
      columns: [
        { name: "id", title: "#ID", searchable: false, orderable: true },
        { name: "full_name", title: "Name", searchable: true, orderable: true },
        { name: "group.name", title: "Group", searchable: true, orderable: true },
        {
          name: "created_at",
          title: "Created At",
          searchable: false,
          orderable: false,
        },
        { name: "creator.full_name", title: "Created By", searchable: false, orderable: false },
        {
          name: "updated_at",
          title: "Updated At",
          searchable: false,
          orderable: false,
          format: "MMM D, YYYY | hh:mm A", // To be updated after response update
        },
      ],
    };
  }
}
