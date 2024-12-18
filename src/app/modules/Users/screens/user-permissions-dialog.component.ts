import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { Permission } from "@modules/Groups/services/service-types";
import { UsersService } from "@modules/Users/services/users.service";
import { FormlyFieldConfig } from "@ngx-formly/core";
import {
  AuthService,
  BaseCreateUpdateComponent,
  DynamicDialogComponent,
  FormComponent,
} from "@shared";
import { TreeNode } from "primeng/api";
import { TreeFilterEvent } from "primeng/tree";
import { map, shareReplay, take, tap } from "rxjs";

interface CustomTreeNode extends TreeNode {
  checked?: boolean;
}

@Component({
  selector: "app-user-permissions-dialog",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  imports: [FormComponent, DynamicDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPermissionsDialogComponent extends BaseCreateUpdateComponent<any> {
  #usersService = inject(UsersService);
  #authService = inject(AuthService);

  nodeOptions = signal<TreeNode[]>([]);
  flattenNodeOptions = signal<TreeNode[]>([]);
  selection = signal<TreeNode[]>([]);
  filteredNodes = signal<TreeNode[]>([]);

  userPermissions$ = this.#usersService
    .updateUserPermissions(this.editData.id)
    .pipe(shareReplay(1));

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      dialogData$: this.userPermissions$,
      dialogTitle: this.translate.instant(_("update_user_permissions")),
      submitButtonLabel: this.translate.instant(_("update_user_permissions")),
      showResetButton: false,
      endpoints: {
        update: "users/updateUserPermissions",
      },
    };

    this.#subscribeToUserPermissions();
  }

  #flattenNodes(ndoes: TreeNode[] | undefined | null) {
    return ndoes?.flatMap(node => [node, ...(node.children || [])]) || [];
  }

  #subscribeToUserPermissions() {
    this.userPermissions$
      .pipe(
        take(1),
        map((permission: Permission[]) => this.#transformPermissions(permission)),
        tap(options => {
          this.nodeOptions.set(options);
          this.flattenNodeOptions.set(this.#flattenNodes(this.nodeOptions()));
          this.#updateModel();
          this.fields = this.configureFields();
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  #transformPermissions(permissions: Permission[]): TreeNode[] {
    const transformedNodes: TreeNode[] = [];

    permissions?.forEach(permission => {
      if (!permission.is_hidden) {
        const children = permission?.children
          .filter(child => !child.is_hidden)
          .map(child => {
            const childNode: CustomTreeNode = {
              key: child.id + "",
              label: child.name,
              checked: child.checked,
            };

            child.checked && this.selection.update(selection => [...selection, childNode]);

            return childNode;
          });

        const areAllChildrenChecked = children.every(child => child.checked);
        const areAllChildrenUnchecked = children.every(child => !child.checked);
        const isParentShouldBeChecked =
          children.length > 0 ? areAllChildrenChecked : permission.checked;

        const node: CustomTreeNode = {
          key: permission.id + "",
          label: permission.name,
          partialSelected: !(areAllChildrenChecked || areAllChildrenUnchecked),
          checked: permission.checked,
          children: children || [],
        };

        isParentShouldBeChecked && this.selection.update(selection => [...selection, node]);

        transformedNodes.push(node);
      }
    });

    return transformedNodes;
  }

  #updateModel() {
    const permissionsIds = this.selection().map(i => Number(i.key));
    this.model = { id: this.editData.id, permissions: permissionsIds };
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      {
        template: `
          <h2 class="text-base font-medium mt-0 mb-3">
            <i class="fas fa-user-shield mr-2"></i> ${this.editData.name}
          </h2>
        `,
      },
      {
        type: "tree-field",
        props: {
          filter: true,
          filterPlaceholder: this.translate.instant(_("filter_selections")),
          scrollHeight: "350px",
          withSelectionToggler: true,
          withCollapseToggler: true,
          isAllSelected: false,
          isNoFilterResult: false,
          selection: this.selection,
          options: this.nodeOptions(),
          toggleSelection: (field: FormlyFieldConfig) => {
            this.#toggleSelection(field);
            field.props && (field.props.isAllSelected = !field.props.isAllSelected);
          },
          selectionChange: (field: FormlyFieldConfig, value: TreeNode[]) => {
            this.selection.set(value);
            this.#updateModel();
          },
          onFilter: (field: FormlyFieldConfig, event: TreeFilterEvent) => {
            this.filteredNodes.set(this.#flattenNodes(event.filteredValue));

            const allFilteredNodesSelected =
              this.filteredNodes().length > 0 &&
              this.filteredNodes().every(filteredNode =>
                this.selection().some(selectedNode => selectedNode.key === filteredNode.key),
              );

            field.props && (field.props.isAllSelected = allFilteredNodesSelected);
            field.props && (field.props.isNoFilterResult = event.filteredValue?.length === 0);
          },
        },
        hooks: {
          onInit: field => {
            const allNodesSelected = this.selection().length === this.flattenNodeOptions().length;

            field.props && (field.props.isAllSelected = allNodesSelected);
          },
        },
      },
    ];
  }

  #toggleSelection(field: FormlyFieldConfig) {
    // Use filtered nodes if they exist; otherwise, use all nodes
    const nodesToConsider = this.filteredNodes().length
      ? this.filteredNodes()
      : this.flattenNodeOptions();

    if (field.props?.isAllSelected) {
      // Deselect all
      // Filter out the nodes to be deselected from the current selection
      const newSelection = this.selection().filter(
        selectedNode => !nodesToConsider.some(node => node.key === selectedNode.key),
      );
      this.selection.set(newSelection);
    } else {
      // Select all
      // Add the nodes to be selected to the current selection, avoiding duplicates
      this.selection.update(selection => [...new Set([...selection, ...nodesToConsider])]);
      this.selection().forEach(node => (node.partialSelected = false));
    }

    this.#updateModel();
  }

  protected override updateUi() {
    return this.#authService
      .getUserPermissions()
      .pipe(tap(permissions => this.#authService.updateUserPermissions(permissions)));
  }
}
