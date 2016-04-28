import Cache from '../../node_modules/gs-tools/src/data/a-cache';
import BaseDisposable from '../../node_modules/gs-tools/src/dispose/base-disposable';
import DisposableFunction from '../../node_modules/gs-tools/src/dispose/disposable-function';
import { NavigateService } from './navigate-service';


// TODO(gs): Base ctrl.
export class NavigateButtonCtrl extends BaseDisposable {
  private disabled_: boolean;
  private icon_: string;
  private navigateService_: NavigateService;
  private subview_: string;
  private text_: string;

  constructor($scope: angular.IScope, NavigateService: NavigateService) {
    super();
    this.navigateService_ = NavigateService;

    this.addDisposable(
        new DisposableFunction(
            $scope.$on('$routeChangeSuccess', this.onRouteUpdate_.bind(this))),
        new DisposableFunction(
            $scope.$on('$routeUpdate', this.onRouteUpdate_.bind(this))));
  }

  private onRouteUpdate_(): void {
    Cache.clear(this);
  }

  get disabled(): boolean {
    return this.disabled_;
  }
  set disabled(disabled: boolean) {
    this.disabled_ = disabled;
  }

  get icon(): string {
    return this.icon_;
  }
  set icon(icon: string) {
    this.icon_ = icon;
  }

  @Cache()
  get selectedCss(): string {
    let subview = this.navigateService_.getSubview();
    if (!subview) {
      return '';
    }

    let viewHierarchy = subview.split('.');
    let currentViewHierarchy = [];
    while (viewHierarchy.length > 0) {
      currentViewHierarchy.push(viewHierarchy.splice(0, 1));
      if (currentViewHierarchy.join('.') === this.subview_) {
        return 'selected';
      }
    }

    return '';
  }

  get subview(): string {
    return this.subview_;
  }
  set subview(subview: string) {
    this.subview_ = subview;
  }

  get text(): string {
    return this.text_;
  }
  set text(text: string) {
    this.text_ = text;
  }

  onClick(): void {
    if (!this.disabled) {
      this.navigateService_.toSubview(this.subview_);
    }
  }
}

export default angular
    .module('navigate.NavigateButtonModule', [])
    .component('pcNavigateButton', {
      bindings: {
        'disabled': '<',
        'icon': '@',
        'subview': '@',
        'text': '@',
      },
      controller: NavigateButtonCtrl,
      templateUrl: 'src/navigate/navigate-button.ng',
    });
