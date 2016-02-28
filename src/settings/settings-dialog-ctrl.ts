import Asset from '../model/asset';
import AssetPipelineService from '../pipeline/asset-pipeline-service';
import AssetService from '../asset/asset-service';
import Cache from '../../node_modules/gs-tools/src/data/a-cache';
import DownloadService from '../common/download-service';
import GlobalNode from '../pipeline/global-node';
import NavigateService from '../navigate/navigate-service';
import Preset, { Origin } from '../model/preset';
import Serializer from '../model/serializable';

const CUSTOM_PRESET = new Preset(Origin.CUSTOM, '', 0, 0);
export const PRESETS = [
  new Preset(Origin.GAME_CRAFTER, 'Poker Deck', 825, 1125),
  CUSTOM_PRESET,
];

export default class {
  private $mdDialog_: angular.material.IDialogService;
  private asset_: Asset;
  private assetService_: AssetService;
  private downloadService_: DownloadService;
  private globalNode_: GlobalNode;
  private navigateService_: NavigateService;
  private selectedPresetId_: number;

  constructor(
      $mdDialog: angular.material.IDialogService,
      asset: Asset,
      AssetPipelineService: AssetPipelineService,
      AssetService: AssetService,
      DownloadService: DownloadService,
      NavigateService: NavigateService) {
    this.$mdDialog_ = $mdDialog;
    this.asset_ = asset;
    this.assetService_ = AssetService;
    this.downloadService_ = DownloadService;
    this.globalNode_ = AssetPipelineService.getPipeline(asset.id).globalNode;
    this.navigateService_ = NavigateService;
    this.selectedPresetId_ = PRESETS.length - 1;
  }

  get assetName(): string {
    return this.asset_.name;
  }
  set assetName(name: string) {
    this.asset_.name = name;
    this.assetService_.saveAsset(this.asset_);
  }

  get assetHeight(): number {
    return this.asset_.height;
  }
  set assetHeight(height: number) {
    this.asset_.height = height;
    this.selectedPresetId_ = PRESETS.length - 1;
    this.assetService_.saveAsset(this.asset_);
    this.globalNode_.refresh();
  }

  get assetWidth(): number {
    return this.asset_.width;
  }
  set assetWidth(width: number) {
    this.asset_.width = width;
    this.selectedPresetId_ = PRESETS.length - 1;
    this.assetService_.saveAsset(this.asset_);
    this.globalNode_.refresh();
  }

  get selectedPresetId(): number {
    return this.selectedPresetId_;
  }
  set selectedPresetId(presetId: number) {
    let preset = PRESETS[presetId];
    this.asset_.height = preset.height;
    this.asset_.width = preset.width;
    this.selectedPresetId_ = presetId;
    this.assetService_.saveAsset(this.asset_);
    this.globalNode_.refresh();
  }

  @Cache()
  get presets(): string[] {
    return PRESETS.map((preset: Preset) => preset.fullDescription);
  }

  onDeleteClick(): void {
    // TODO(gs): Confirmation dialog
    this.assetService_.deleteAsset(this.asset_);
    this.$mdDialog_.hide();
    this.navigateService_.toHome();
  }

  onDownloadClick(): void {
    let blob = new Blob(
        [JSON.stringify(Serializer.toJSON(this.asset_), null, 2)],
        { type: 'application/json' });
    this.downloadService_.download(blob, `${this.asset_.name}.json`);
  }

  onOkClick(): void {
    this.$mdDialog_.hide();
  }
}
