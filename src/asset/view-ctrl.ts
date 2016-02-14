import Asset from '../model/asset';
import AssetService, { EventType as AssetServiceEventType } from './asset-service';
import Disposable from '../util/disposable';
import DisposableFunction from '../util/disposable-function';
import FunctionObject from '../model/function-object';
import NavigateService from '../navigate/navigate-service';
import SettingsDialogService from '../settings/settings-dialog-service';

/**
 * Controller for the create page view.
 */
export default class ViewCtrl extends Disposable {
  private $location_: angular.ILocationService;
  private $scope_: angular.IScope;
  private asset_: Asset;
  private currentHelper_: FunctionObject;
  private currentPartialName_: string;
  private isAssetSaved_: boolean;
  private isSidebarOpen_: boolean;
  private lastAssetSaveTime_: string;
  private navigateService_: NavigateService;
  private settingsDialogService_: SettingsDialogService;
  private subview_: string;

  constructor(
      $location: angular.ILocationService,
      $scope: angular.IScope,
      $routeParams: any,
      AssetService: AssetService,
      NavigateService: NavigateService,
      SettingsDialogService: SettingsDialogService) {
    super();
    this.$location_ = $location;
    this.$scope_ = $scope;
    this.asset_ = AssetService.getAsset($routeParams['assetId']);
    this.currentHelper_ = null;
    this.currentPartialName_ = null;
    this.isAssetSaved_ = false;
    this.isSidebarOpen_ = false;
    this.navigateService_ = NavigateService;
    this.settingsDialogService_ = SettingsDialogService;
    this.subview_ = null;

    this.addDisposable(
        new DisposableFunction(
            $scope.$on('$routeUpdate', this.onRouteUpdate_.bind(this))),
        new DisposableFunction(
            $scope.$on('$routeChangeSuccess', this.onRouteUpdate_.bind(this))),
        AssetService.on(AssetServiceEventType.SAVED, this.onAssetSaved_.bind(this)));
  }

  private onAssetSaved_() {
    this.isAssetSaved_ = true;
    this.lastAssetSaveTime_ = (new Date()).toLocaleTimeString();
    window.setTimeout(() => {
      this.isAssetSaved_ = false;
      this.$scope_.$apply(() => undefined);
    }, 3000);
  }

  private onRouteUpdate_() {
    this.currentHelper_ = null;
    this.currentPartialName_ = null;

    let subitemId = this.$location_.search()['subitem'];
    switch (this.subview) {
      case 'helper.editor':
        this.currentHelper_ = this.asset_.helpers[subitemId];
        break;
      case 'partial.editor':
        this.currentPartialName_ = subitemId;
        break;
    }
  }

  /**
   * The asset viewed.
   */
  get asset(): Asset {
    return this.asset_;
  }

  get assetId(): string {
    return this.asset_.id;
  }

  /**
   * Name of the asset viewed.
   */
  get assetName(): string {
    return this.asset_ && this.asset_.name;
  }

  /**
   * Current helper associated with the view, if any.
   */
  get currentHelper(): FunctionObject {
    return this.currentHelper_;
  }

  get currentPartialName(): string {
    return this.currentPartialName_;
  }

  /**
   * Name of the current subview, if any.
   */
  get subview(): string {
    return this.navigateService_.getSubview() || null;
  }

  get isAssetSaved(): boolean {
    return this.isAssetSaved_;
  }

  /**
   * True iff the sidebar should be opened.
   */
  get isSidebarOpen(): boolean {
    return this.isSidebarOpen_;
  }
  set isSidebarOpen(open: boolean) {
    this.isSidebarOpen_ = open;
  }

  get lastAssetSaveTime(): string {
    return this.lastAssetSaveTime_;
  }

  /**
   * Handler called when the back button is clicked.
   */
  onBackClick() {
    this.navigateService_.toHome();
  }

  /**
   * Handler called when the menu button is clicked.
   */
  onMenuClick() {
    this.isSidebarOpen_ = !this.isSidebarOpen_;
  }

  /**
   * Handler called when the settings button is clicked.
   */
  onSettingsClick(event: MouseEvent) {
    this.settingsDialogService_.show(event, this.asset_);
  }
};
