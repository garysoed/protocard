import { Events as CodeEditorEvents } from '../../editor/code-editor-ctrl';

/**
 * @class asset.subview.GlobalCtrl
 */
export default class {
  /**
   * @constructor
   * @param {ng.$scope} $scope
   * @param {data.AssetService} AssetService
   */
  constructor($scope, AssetService) {
    this.$scope_ = $scope;
    this.asset_ = $scope['asset'];
    this.assetService_ = AssetService;

    // TODO(gs): off when $destroy
    $scope.$on(CodeEditorEvents.SAVE, this.onSave_.bind(this))
  }

  /**
   * Handler called when the controller is initialized.
   *
   * @method onInit
   */
  onInit() {
    this.$scope_['globalsString'] = this.asset_.globalsString;
  }

  /**
   * Handler called when a save event is received.
   *
   * @method onSave_
   */
  onSave_() {
    this.asset_.globalsString = this.$scope_['globalsString'];
    this.assetService_.saveAsset(this.asset_);
  }
}
