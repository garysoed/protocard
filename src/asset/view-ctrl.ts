import Asset from '../model/asset'
import AssetService from './asset-service';
import FunctionObject from '../model/function-object';
import NavigateService from '../navigate/navigate-service';

/**
 * Controller for the create page view.
 */
export default class ViewCtrl {
  private $location_: angular.ILocationService;
  private $scope_: angular.IScope;
  private asset_: Asset;
  private currentHelper_: FunctionObject;
  private currentPartialName_: string;
  private isSidebarOpen_: boolean;
  private navigateService_: NavigateService;
  private subview_: string;

  constructor(
      $location: angular.ILocationService,
      $scope: angular.IScope,
      $routeParams: any,
      AssetService: AssetService,
      NavigateService: NavigateService) {
    this.$location_ = $location;
    this.$scope_ = $scope;
    this.asset_ = AssetService.getAsset($routeParams['assetId']);
    this.navigateService_ = NavigateService;
    this.subview_ = null;
    this.currentHelper_ = null;
    this.currentPartialName_ = null;
    this.isSidebarOpen_ = true;

    $scope.$on('$routeUpdate', this.onRouteUpdate_.bind(this));
    $scope.$on('$routeChangeSuccess', this.onRouteUpdate_.bind(this));
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

  get canEditPartial(): boolean {
    return this.isLabelReady;
  }

  get canEditTemplate(): boolean {
    return this.canEditPartial;
  }

  get canProcessData(): boolean {
    return this.isDataReady;
  }

  get canPublish(): boolean {
    return this.isTemplateReady;
  }

  get canSetLabel(): boolean {
    return this.isProcessDataReady;
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

  get isDataReady(): boolean {
    return !!this.asset_.data;
  }

  get isPartialReady(): boolean {
    return this.canEditPartial;
  }

  get isProcessDataReady(): boolean {
    return this.canProcessData && !!this.asset_.dataProcessor;
  }

  get isLabelReady(): boolean {
    return this.canSetLabel && !!this.asset_.templateName;
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

  get isTemplateReady(): boolean {
    return this.canEditTemplate && !!this.asset_.templateString;
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
};
