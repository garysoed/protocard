import Asset from '../model/asset';
import AssetServiceModule, { AssetService } from '../asset/asset-service';
import CodeEditorModule from '../editor/code-editor';
import FunctionObject from '../model/function-object';

export class HelperEditorCtrl {
  private assetService_: AssetService;
  private asset_: Asset;
  private helper_: FunctionObject;
  private helperString_: string;

  constructor(AssetService: AssetService) {
    this.assetService_ = AssetService;
  }

  $onInit(): void {
    this.helperString_ = this.helper.fnString;
  }

  get asset(): Asset {
    return this.asset_;
  }
  set asset(asset: Asset) {
    this.asset_ = asset;
  }

  get helper(): FunctionObject {
    return this.helper_;
  }
  set helper(helper: FunctionObject) {
    this.helper_ = helper;
  }

  get helperString(): string {
    return this.helperString_;
  }
  set helperString(newValue: string) {
    this.helperString_ = newValue;
  }

  onCodeChange(newValue: string): void {
    this.helperString_ = newValue;
    if (newValue !== null) {
      this.helper_.fnString = newValue;
      this.assetService_.saveAsset(this.asset_);
    }
  }
}


export default angular
    .module('helper.HelperEditorModule', [
      AssetServiceModule.name,
      CodeEditorModule.name,
    ])
    .component('pcHelperEditor', {
      bindings: {
        asset: '<',
        helper: '<',
      },
      controller: HelperEditorCtrl,
      templateUrl: 'src/helper/helper-editor.ng',
    });
