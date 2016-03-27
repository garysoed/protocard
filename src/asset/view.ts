import Asset from '../model/asset';
import { AssetService, EventType as AssetServiceEventType } from './asset-service';
import AssetServiceModule from './asset-service';
import BaseDisposable from '../../node_modules/gs-tools/src/dispose/base-disposable';
import DataModule from '../data/data';
import DisposableFunction from '../../node_modules/gs-tools/src/dispose/disposable-function';
import FunctionObject from '../model/function-object';
import GlobalModule from '../global/global';
import HelperEditorModule from '../helper/helper-editor';
import HelperModule from '../helper/helper';
import ImageModule from '../image/image';
import LabelModule from '../label/label';
import NavGraphModule from './nav-graph';
import NavigateButtonModule from '../navigate/navigate-button';
import NavigateServiceModule, { NavigateService } from '../navigate/navigate-service';
import PartialEditorModule from '../partial/partial-editor';
import PartialModule from '../partial/partial';
import RenderModule from '../render/render';
import SettingsDialogModule, { SettingsDialogService } from '../settings/settings-dialog';
import TemplateModule from '../template/template';
import TextModule from '../text/text';


/**
 * Controller for the create page view.
 */
export class ViewCtrl extends BaseDisposable {
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

  private onAssetSaved_(): void {
    this.isAssetSaved_ = true;
    this.lastAssetSaveTime_ = (new Date()).toLocaleTimeString();
    window.setTimeout(() => {
      this.isAssetSaved_ = false;
      this.$scope_.$apply(() => undefined);
    }, 3000);
  }

  private onRouteUpdate_(): void {
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
  onBackClick(): void {
    this.navigateService_.toHome();
  }

  /**
   * Handler called when the menu button is clicked.
   */
  onMenuClick(): void {
    this.isSidebarOpen_ = !this.isSidebarOpen_;
  }

  /**
   * Handler called when the settings button is clicked.
   */
  onSettingsClick(event: MouseEvent): void {
    this.settingsDialogService_.show(event, this.asset_);
  }
};

export default angular
    .module('asset.ViewModule', [
      'ngRoute',
      AssetServiceModule.name,
      DataModule.name,
      GlobalModule.name,
      HelperEditorModule.name,
      HelperModule.name,
      ImageModule.name,
      LabelModule.name,
      NavGraphModule.name,
      NavigateButtonModule.name,
      NavigateServiceModule.name,
      PartialModule.name,
      PartialEditorModule.name,
      RenderModule.name,
      SettingsDialogModule.name,
      TemplateModule.name,
      TextModule.name,
    ])
    .config(($routeProvider: angular.ui.IUrlRouterProvider) => {
      $routeProvider.when(
          '/asset/:assetId',
          {
            controller: ViewCtrl,
            controllerAs: 'ctrl',
            reloadOnSearch: false,
            templateUrl: 'src/asset/view.ng',
          });
    });
