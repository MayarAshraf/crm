import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { GroupService } from "@modules/Groups/services/group.service";
import { GroupScope } from "@modules/Groups/services/service-types";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { BaseCreateUpdateComponent, DynamicDialogComponent, FormComponent } from "@shared";
import { TreeNode } from "primeng/api";
import { TreeFilterEvent } from "primeng/tree";
import { map, shareReplay, take, tap } from "rxjs";

interface CustomTreeNode extends TreeNode {
  checked?: boolean;
}

@Component({
  selector: "app-group-scopes-dialog",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  imports: [FormComponent, DynamicDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupScopesDialogComponent extends BaseCreateUpdateComponent<any> {
  #groupService = inject(GroupService);

  nodeOptions = signal<TreeNode[]>([]);
  flattenNodeOptions = signal<TreeNode[]>([]);
  selection = signal<TreeNode[]>([]);
  filteredNodes = signal<TreeNode[]>([]);

  groupScopes$ = this.#groupService.updateGropuScopes(this.editData.id).pipe(shareReplay(1));

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      dialogData$: this.groupScopes$,
      dialogTitle: this.translate.instant(_("update_group_access_scopes")),
      submitButtonLabel: this.translate.instant(_("update_group_access_scopes")),
      showResetButton: false,
      endpoints: {
        update: "groups/updateGroupAccessScopesGroups",
      },
    };

    this.#subscribeToGroupScopes();
  }

  #flattenNodes(ndoes: TreeNode[] | undefined | null) {
    return ndoes?.flatMap(node => [node, ...(node.children || [])]) || [];
  }

  #subscribeToGroupScopes() {
    this.groupScopes$
      .pipe(
        take(1),
        map((groupScopes: GroupScope[]) => this.#transformScopes(groupScopes)),
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

  #transformScopes(groupAccessScopes: GroupScope[]): TreeNode[] {
    const transformedNodes: TreeNode[] = [];

    groupAccessScopes?.forEach(groupScope => {
      const children = groupScope.groups
        .filter(group => !group.is_hidden)
        .map(group => {
          const childNode: CustomTreeNode = {
            key: `${groupScope.id}_${group.id}`,
            label: group.name,
            checked: group.checked,
          };

          group.checked && this.selection.update(selection => [...selection, childNode]);

          return childNode;
        });

      const areAllChildrenChecked = children.every(child => child.checked);
      const areAllChildrenUnchecked = children.every(child => !child.checked);

      const node: TreeNode = {
        key: groupScope.id + "",
        label: groupScope.name,
        partialSelected: !(areAllChildrenChecked || areAllChildrenUnchecked),
        children: children,
      };

      // If all children are checked, add the node to the selection
      areAllChildrenChecked && this.selection.update(selection => [...selection, node]);

      transformedNodes.push(node);
    });

    return transformedNodes;
  }

  #updateModel() {
    const childNodes = this.selection().filter(item => !item.children && item.key?.includes("_"));

    // Create dictionary with 'group_access_scope_id' as keys and 'groups' as values
    const dict = childNodes.reduce<{ [key: string]: string[] }>((acc, item) => {
      if (item.key) {
        const [group_access_scope_id, group] = item.key.split("_");
        if (!acc[group_access_scope_id]) {
          acc[group_access_scope_id] = [];
        }
        if (group) {
          acc[group_access_scope_id].push(group);
        }
      }
      return acc;
    }, {});

    // Add entries with empty groups array for missing group_access_scope_id values
    const allGroupAccessScopeIds = this.nodeOptions().map(node => node.key);
    allGroupAccessScopeIds.forEach(group_access_scope_id => {
      if (!dict[group_access_scope_id as string]) {
        dict[group_access_scope_id as string] = [];
      }
    });

    // Convert the dictionary into the required format
    const access_scopes_groups = Object.entries(dict).map(([group_access_scope_id, groups]) => ({
      group_access_scope_id: Number(group_access_scope_id),
      groups: groups.map(Number),
    }));

    this.model = { id: this.editData.id, access_scopes_groups };
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
}
