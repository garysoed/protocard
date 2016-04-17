/**
 * @fileoverview Controller for searching for asset names.
 */
import Asserts from '../../node_modules/gs-tools/src/assert/asserts';
import Asset from '../model/asset';
import AssetPipelineServiceModule, { AssetPipelineService }
    from '../pipeline/asset-pipeline-service';
import BaseComponent from '../../node_modules/gs-tools/src/ng/base-component';
import LabelNode from '../pipeline/label-node';
import ListenableElement, { EventType as DomEventType }
    from '../../node_modules/gs-tools/src/event/listenable-element';
import Log from '../../node_modules/gs-tools/src/log';
import Records from '../../node_modules/gs-tools/src/collection/records';
import WaitUntil from '../../node_modules/gs-tools/src/async/wait-until';

const LOG = new Log('asset.AssetNamePickerCtrl');


export class AssetNamePickerCtrl extends BaseComponent {
  private asset_: Asset;
  private assetPipelineService_: AssetPipelineService;
  private element_: HTMLElement;
  private labelNode_: LabelNode;
  private ngModel_: angular.INgModelController;
  private onBlurHandler_: () => void;
  private onFocusHandler_: () => void;
  private searchText_: string;

  constructor(
      $element: angular.IAugmentedJQuery,
      $scope: angular.IScope,
      AssetPipelineService: AssetPipelineService) {
    super($scope);
    this.assetPipelineService_ = AssetPipelineService;
    this.element_ = $element[0];
    this.labelNode_ = undefined;
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

  $onChanges(changes: { [key: string]: any }): void {
    Records.of(changes).forEach((value: any, key: string) => {
      if (key === 'asset') {
        this.asset = value.currentValue;
        this.labelNode_ = this.assetPipelineService_.getPipeline(this.asset.id).labelNode;
      }
    });
  }

  $onInit(): Promise<void> {
    Asserts.any(this.asset_).to.beDefined().orThrows('Required asset not given');

    this.labelNode_ = this.assetPipelineService_.getPipeline(this.asset.id).labelNode;

    let waitUntil = WaitUntil.newInstance(() => {
      return !!this.element_.querySelector('input');
    });
    this.addDisposable(waitUntil);
    return waitUntil.promise
        .then(
            () => {
              let inputEl = ListenableElement.of(this.element_.querySelector('input'));
              this.addDisposable(
                  inputEl.on(DomEventType.FOCUS, this.onFocus_.bind(this)),
                  inputEl.on(DomEventType.BLUR, this.onBlur_.bind(this)),
                  inputEl);
            },
            () => {
              Log.error(LOG, 'Timed out waiting for input element to exist');
            });
  }

  private get asset(): Asset {
    return this.asset_ ;
  }
  private set asset(asset: Asset) {
    this.asset_ = asset;
  }

  private get ngModel(): angular.INgModelController {
    return this.ngModel_;
  }
  private set ngModel(ngModel: angular.INgModelController) {
    this.ngModel_ = ngModel;
  }

  private get onBlur(): () => void {
    return this.onBlurHandler_;
  }
  private set onBlur(onBlur: () => void) {
    this.onBlurHandler_ = onBlur;
  }

  private get onFocus(): () => void {
    return this.onFocusHandler_;
  }
  private set onFocus(onFocus: () => void) {
    this.onFocusHandler_ = onFocus;
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
    return this.ngModel === null ? '' : this.ngModel.$viewValue;
  }
  set selectedKey(key: string) {
    this.ngModel.$setViewValue(key);
  }
};

export default angular
    .module('common.AssetNamePickerModule', [
      AssetPipelineServiceModule.name,
    ])
    .component('pcAssetNamePicker', {
      bindings: {
        'asset': '<',
        'onFocus': '&',
        'onBlur': '&',
      },
      controller: AssetNamePickerCtrl,
      require: {
        'ngModel': 'ngModel',
      },
      templateUrl: 'src/common/asset-name-picker.ng',
    });
