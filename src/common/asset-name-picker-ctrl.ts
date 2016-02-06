/**
 * @fileoverview Controller for searching for asset names.
 */
import AssetPipelineService from '../pipeline/asset-pipeline-service';
import LabelNode from '../pipeline/label-node';

export default class {
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

  private onBlur_() {
    if (!!this.onBlurHandler_) {
      this.onBlurHandler_();
    }
  }

  private onFocus_() {
    if (!!this.onFocusHandler_) {
      this.onFocusHandler_();
    }
  }

  onLink(element: HTMLElement, ngModelCtrl: angular.INgModelController) {
    window.setTimeout(() => {
      let inputEl = element.querySelector('input');
      inputEl.addEventListener('focus', this.onFocus_.bind(this));
      inputEl.addEventListener('blur', this.onBlur_.bind(this));
    }, 0);
    this.ngModelCtrl_ = ngModelCtrl;
  }

  get searchResults(): Promise<string[]> {
    return this.labelNode_.result
        .then(result => {
          return result.index.search(this.searchText)
              .map(searchResult => {
                return searchResult['label'];
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
