import Utils from '../utils';

export const Events = {
  CHANGED: Utils.getUniqueId('changed'),
  DELETED: Utils.getUniqueId('deleted'),
  EDITED: Utils.getUniqueId('edited')
};

/**
 * @class asset.subview.HelperItemCtrl
 */
export default class HelperItemCtrl {
  private $scope_: angular.IScope;
  private name_: string;

  /**
   * @param {ng.$scope} $scope
   */
  constructor($scope: angular.IScope) {
    this.$scope_ = $scope;
    this.name_ = $scope['name'];
  }

  get name(): string {
    return this.name_;
  }
  set name(newValue: string) {
    let oldName = this.name_;
    this.name_ = newValue;
    this.$scope_.$emit(Events.CHANGED, oldName, newValue);
  }

  /**
   * Handler called when the delete button is clicked.
   */
  onDeleteClick() {
    this.$scope_.$emit(Events.DELETED, this.name_);
  }

  /**
   * Handler called when the edit button is clicked.
   */
  onEditClick() {
    this.$scope_.$emit(Events.EDITED, this.name_);
  }
}