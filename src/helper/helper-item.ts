/**
 * @class helper.HelperItemCtrl
 */
export class HelperItemCtrl {
  private name_: string;
  private oldName_: string;
  private onChange_: (locals: { newName: string, oldName: string }) => void;
  private onDelete_: (locals: { name: string }) => void;
  private onEdit_: (locals: { name: string }) => void;

  $onInit(): void {
    this.oldName_ = this.name;
  }

  get name(): string {
    return this.name_;
  }
  set name(name: string) {
    this.name_ = name;
  }

  get onChange(): (locals: { newName: string, oldName: string }) => void {
    return this.onChange_;
  }
  set onChange(onChange: (locals: { newName: string, oldName: string }) => void) {
    this.onChange_ = onChange;
  }

  get onDelete(): (locals: { name: string }) => void {
    return this.onDelete_;
  }
  set onDelete(onDelete: (locals: { name: string }) => void) {
    this.onDelete_ = onDelete;
  }

  get onEdit(): (locals: { name: string }) => void {
    return this.onEdit_;
  }
  set onEdit(onEdit: (locals: { name: string }) => void) {
    this.onEdit_ = onEdit;
  }

  onInputChange(): void {
    this.onChange_({ newName: this.name, oldName: this.oldName_ });
    this.oldName_ = this.name;
  }

  /**
   * Handler called when the delete button is clicked.
   */
  onDeleteClick(): void {
    this.onDelete_({ name: this.name_ });
  }

  /**
   * Handler called when the edit button is clicked.
   */
  onEditClick(): void {
    this.onEdit_({ name: this.name_ });
  }
}


export default angular
    .module('helper.HelperItemModule', [])
    .component('pcHelperItem', {
      bindings: {
        name: '<',
        onChange: '&',
        onDelete: '&',
        onEdit: '&',
      },
      controller: HelperItemCtrl,
      templateUrl: 'src/helper/helper-item.ng',
    });
