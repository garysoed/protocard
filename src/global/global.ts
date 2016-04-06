import Asset from '../model/asset';
import AssetPipelineServiceModule, { AssetPipelineService }
    from '../pipeline/asset-pipeline-service';
import AssetServiceModule, { AssetService } from '../asset/asset-service';
import CodeEditorModule from '../editor/code-editor';
import GlobalNode from '../pipeline/global-node';

/**
 * @class global.GlobalCtrl
 */
export class GlobalCtrl {
  private asset_: Asset;
  private assetService_: AssetService;
  private globalNode_: GlobalNode;
  private globalsString_: string;

  constructor(
      $scope: angular.IScope,
      AssetPipelineService: AssetPipelineService,
      AssetService: AssetService) {
    this.asset_ = $scope['asset'];
    this.assetService_ = AssetService;
    this.globalNode_ = AssetPipelineService.getPipeline(this.asset_.id).globalNode;
    this.globalsString_ = this.asset_.globalsString;
  }

  /**
   * @return True iff the globals string is non null.
   */
  isValid(): boolean {
    return this.globalsString !== null;
  }

  /**
   * String representation of the globals value.
   */
  get globalsString(): string {
    return this.globalsString_;
  }
  set globalsString(newValue: string) {
    this.globalsString_ = newValue;
    if (newValue !== null) {
      this.asset_.globalsString = newValue;
      this.assetService_.saveAsset(this.asset_);
      this.globalNode_.refresh();
    }
  }
}

export default angular
    .module('global.GlobalModule', [
      AssetPipelineServiceModule.name,
      AssetServiceModule.name,
      CodeEditorModule.name,
    ])
    .directive('pcGlobal', () => {
      return {
        controller: GlobalCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'asset': '='
        },
        templateUrl: 'src/global/global.ng',
      };
    });
