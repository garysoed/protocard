/**
 * @fileoverview Controller for searching for asset names.
 */
import AssetPipelineService from '../pipeline/asset-pipeline-service';
import AssetPipelineServiceModule from '../pipeline/asset-pipeline-service-module';
import LabelNode from '../pipeline/label-node';


export class AssetNamePickerCtrl {
  private labelNode_: LabelNode;
  private ngModelCtrl_: angular.INgModelController;
  private onBlurHandler_: Function;
  private onFocusHandler_: Function;
  private searchText_: string;

  constructor($scope: angular.IScope, AssetPipelineService: AssetPipelineService) {
    this.labelNode_ = AssetPipelineService.getPipeline($scope['asset'].id).labelNode;
    this.ngModelCtrl_ = null;
    this.onBlurHandler_ = $scope['onBlur'];
    this.onFocusHandler_ = $scope['onFocus'];
    this.searchText_ = '';
  }

  private onBlur_(): void {
    if (!!this.onBlurHandler_) {
      this.onBlurHandler_();
    }
  }

  private onFocus_(): void {
    if (!!this.onFocusHandler_) {
      this.onFocusHandler_();
    }
  }

  onLink(element: HTMLElement, ngModelCtrl: angular.INgModelController): void {
    window.setTimeout(() => {
      let inputEl = element.querySelector('input');
      inputEl.addEventListener('focus', this.onFocus_.bind(this));
      inputEl.addEventListener('blur', this.onBlur_.bind(this));
    }, 0);
    this.ngModelCtrl_ = ngModelCtrl;
  }

  get searchResults(): Promise<string[]> {
    return this.labelNode_.result
        .then((result: { index: Fuse }) => {
          return result.index.search(this.searchText)
              .map((searchResult: { label: string }) => {
                return searchResult.label;
              });
        });
  }

  get searchText(): string {
    return this.searchText_;
  }
  set searchText(text: string) {
    this.searchText_ = text;
  }

  get selectedKey(): string {
    return this.ngModelCtrl_ === null ? '' : this.ngModelCtrl_.$viewValue;
  }
  set selectedKey(key: string) {
    this.ngModelCtrl_.$setViewValue(key);
  }
};

function link(
    scope: angular.IScope,
    element: angular.IAugmentedJQuery,
    attr: angular.IAttributes,
    ctrls: any[]): void {
  let [assetNamePickerCtrl, ngModelCtrl] = ctrls;
  assetNamePickerCtrl.onLink(element[0], ngModelCtrl);
}

export default angular
    .module('common.AssetNamePickerModule', [
      AssetPipelineServiceModule.name
    ])
    .directive('pcAssetNamePicker', () => {
      return {
        controller: AssetNamePickerCtrl,
        controllerAs: 'ctrl',
        link: link,
        require: ['pcAssetNamePicker', 'ngModel'],
        restrict: 'E',
        scope: {
          'asset': '=',
          'onFocus': '&',
          'onBlur': '&',
        },
        templateUrl: 'src/common/asset-name-picker.ng',
      };
    });
