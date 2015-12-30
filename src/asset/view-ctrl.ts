import Asset from '../model/asset'
import AssetService from './asset-service';
import FunctionObject from '../model/function-object';
import NavigateService from '../common/navigate-service';

/**
 * Controller for the create page view.
 */
export default class ViewCtrl {
  private $scope_: angular.IScope;
  private $routeParams_: any;
  private asset_: Asset;
  private assetService_: AssetService;
  private currentHelper_: FunctionObject;
  private currentPartialName_: string;
  private isSidebarOpen_: boolean;
  private navigateService_: NavigateService;
  private subview_: string;

  constructor(
      $scope: angular.IScope,
      $routeParams: any,
      AssetService: AssetService,
      NavigateService: NavigateService) {
    this.$scope_ = $scope;
    this.$routeParams_ = $routeParams;
    this.assetService_ = AssetService;
    this.navigateService_ = NavigateService;
    this.asset_ = null;
    this.subview_ = null;
    this.currentHelper_ = null;
    this.currentPartialName_ = null;
    this.isSidebarOpen_ = false;
  }

  /**
   * The asset viewed.
   */
  get asset(): Asset {
    return this.asset_;
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
    return this.subview_;
  }
  set subview(subview) {
    this.subview_ = subview;
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
   * Handler called when the controller is initialized
   */
  onInit() {
    this.asset_ = this.assetService_.getAsset(this.$routeParams_['assetId']);
    if (!this.asset_) {
      this.navigateService_.toHome();
    } else {
      this.subview_ = this.$routeParams_['section'];
      this.currentHelper_ = null;
      this.currentPartialName_ = null;
      switch (this.subview_) {
        case 'helper-editor':
          this.currentHelper_ = this.asset_.helpers[this.$routeParams_['subitemId']];
          break;
        case 'partial-editor':
          this.currentPartialName_ = this.$routeParams_['subitemId'];
          break;
      }
    }
  }

  /**
   * Handler called when the navigation button is clicked.
   * @param value Name of subview to navigate to.
   */
  onNavigateClick(value: string) {
    this.subview_ = value;
    this.navigateService_.toAsset(this.asset_.id, value);
  }
};
