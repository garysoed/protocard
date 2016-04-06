import Asset from '../model/asset';
import AssetServiceModule, { AssetService } from '../asset/asset-service';
import ContextButtonModule from '../common/context-button';
import CreateAssetDialogModule, { CreateAssetDialogService } from './create-asset-dialog';
import File from '../model/file';
import FileUploadModule from '../editor/file-upload';
import NavigateServiceModule, { NavigateService } from '../navigate/navigate-service';
import Serializer from '../../node_modules/gs-tools/src/data/a-serializable';


/**
 * Controller for the home view.
 */
export class HomeViewCtrl {
  private assetService_: AssetService;
  private createAssetDialogService_: CreateAssetDialogService;
  private navigateService_: NavigateService;

  constructor(
      AssetService: AssetService,
      CreateAssetDialogService: CreateAssetDialogService,
      NavigateService: NavigateService) {
    this.assetService_ = AssetService;
    this.createAssetDialogService_ = CreateAssetDialogService;
    this.navigateService_ = NavigateService;
  }

  getAssets(): { [id: string]: Asset } {
    return this.assetService_.assets;
  }

  /**
   * @return True iff there are assets in the storage.
   */
  hasAssets(): boolean {
    return this.assetService_.hasAssets();
  }

  /**
   * Handler called when the create button is clicked.
   *
   * @param $event Angular event object that triggered this.
   */
  onCreateClick($event: MouseEvent): angular.IPromise<void> {
    return this.createAssetDialogService_
        .show($event)
        .then((asset: Asset) => {
          this.assetService_.saveAsset(asset);
          this.navigateService_.toAsset(asset.id);
        });
  }

  /**
   * Handler called when the select element is closed.
   *
   * @param selectedAssetId ID of the selected asset.
   */
  set loadedAsset(selectedAssetId: string) {
    if (selectedAssetId) {
      this.navigateService_.toAsset(selectedAssetId);
    }
  }

  set newAsset(file: File) {
    let assetJson = JSON.parse(file.content);
    delete assetJson['id'];
    let asset = Serializer.fromJSON(assetJson);
    if (!!asset) {
      this.assetService_.saveAsset(asset);
      this.navigateService_.toAsset(asset.id);
    }
  }
};

export default angular
    .module('home.ViewModule', [
      'ngRoute',
      AssetServiceModule.name,
      ContextButtonModule.name,
      CreateAssetDialogModule.name,
      FileUploadModule.name,
      NavigateServiceModule.name,
    ])
    .component('homeView', {
      controller: HomeViewCtrl,
      templateUrl: 'src/home/home-view.ng',
    });
