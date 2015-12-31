import Asset from '../model/asset';
import AssetService from '../asset/asset-service';
import CreateAssetDialogService from './create-asset-dialog-service';
import NavigateService from '../common/navigate-service';

/**
 * Controller for the home view.
 */
export default class {
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
    return this.assetService_.getAssets();
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
  onCreateClick($event: MouseEvent) {
    return this.createAssetDialogService_.show($event)
        .then(asset => {
          this.assetService_.saveAsset(asset);
          this.navigateService_.toAsset(asset.id);
        });
  }

  /**
   * Handler called when the select element is closed.
   *
   * @param selectedAssetId ID of the selected asset.
   */
  onSelectClosed(selectedAssetId: string) {
    if (selectedAssetId) {
      this.navigateService_.toAsset(selectedAssetId);
    }
  }
};
