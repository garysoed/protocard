import Utils from '../utils';

/**
 * @enum {string}
 */
export const Events = {
  CHANGED: Utils.getUniqueId('changed'),
  DELETED: Utils.getUniqueId('deleted'),
  EDITED: Utils.getUniqueId('edited')
};

/**
 * @class asset.subview.HelperItemCtrl
 */
export default class {
  /**
   * @constructor
   * @param {ng.$scope} $scope
   */
  constructor($scope) {
    this.$scope_ = $scope;
    this.helper_ = $scope['helper'];
    this.name_ = $scope['name'];
  }

  /**
   * @property name
   * @type {string}
   */
  get name() {
    return this.name_;
  }
  set name(newValue) {
    let oldName = this.name_;
    this.name_ = newValue;
    this.$scope_.$emit(Events.CHANGED, oldName, newValue);
  }

  /**
   * Handler called when the delete button is clicked.
   *
   * @method onDeleteClick
   */
  onDeleteClick() {
    this.$scope_.$emit(Events.DELETED, this.name_);
  }

  /**
   * Handler called when the edit button is clicked.
   *
   * @method onEditClick
   */
  onEditClick() {
    this.$scope_.$emit(Events.EDITED, this.name_);
  }
}
