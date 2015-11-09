import Utils from '../../utils';

/**
 * @enum {string}
 */
export const Events = {
  CHANGED: Utils.getUniqueId('changed')
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
  }

  /**
   * @property name
   * @type {string}
   */
  get name() {
    return this.helper_.name;
  }
  set name(newValue) {
    this.helper_.name = newValue;
    this.$scope_.$emit(Events.CHANGED);
  }
}
