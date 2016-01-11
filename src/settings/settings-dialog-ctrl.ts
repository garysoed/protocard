import Asset from '../model/asset';
import AssetService from '../asset/asset-service';
import DownloadService from '../common/download-service';
import NavigateService from '../navigate/navigate-service';
import Serializer from '../model/serializable';

export default class {
  private $mdDialog_: angular.material.IDialogService;
  private asset_: Asset;
  private assetService_: AssetService;
  private downloadService_: DownloadService;
  private navigateService_: NavigateService;

  constructor(
      $mdDialog: angular.material.IDialogService,
      asset: Asset,
      AssetService: AssetService,
      DownloadService: DownloadService,
      NavigateService: NavigateService) {
    this.$mdDialog_ = $mdDialog;
    this.asset_ = asset;
    this.assetService_ = AssetService;
    this.downloadService_ = DownloadService;
    this.navigateService_ = NavigateService;
  }

  get assetName(): string {
    return this.asset_.name;
  }
  set assetName(name: string) {
    this.asset_.name = name;
    this.assetService_.saveAsset(this.asset_);
  }

  onDeleteClick() {
    // TODO(gs): Confirmation dialog
    this.assetService_.deleteAsset(this.asset_);
    this.$mdDialog_.hide();
    this.navigateService_.toHome();
  }

  onDownloadClick() {
    let jsonString = JSON.stringify(Serializer.toJSON(this.asset_));
    // TODO(gs): Polyfill Blob for testing? Move to karma?
    let blob = new Blob(
        [JSON.stringify(Serializer.toJSON(this.asset_), null, 2)],
        { type: 'application/json' });
    this.downloadService_.download(blob, `${this.asset_.name}.json`);
  }

  onOkClick() {
    this.$mdDialog_.hide();
  }
}
