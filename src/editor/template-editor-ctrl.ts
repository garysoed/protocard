import Asset from '../model/asset';
import GeneratorService from '../generate/generator-service';

export default class TemplateEditorCtrl {
  private $scope_: angular.IScope;
  private asset_: Asset;
  private generatorService_: GeneratorService;
  private iframeEl_: HTMLIFrameElement;
  private ngModelCtrl_: angular.INgModelController;

  constructor($scope: angular.IScope, GeneratorService: GeneratorService) {
    this.$scope_ = $scope;
    this.asset_ = $scope['asset'];
    this.generatorService_ = GeneratorService;
    this.iframeEl_ = null;
    this.ngModelCtrl_ = null;

    $scope.$watch('sampleData', this.updatePreview_.bind(this));
  }

  updatePreview_() {
    if (!!this.templateString) {
      let data = this.generatorService_
          .generate(this.asset_, [this.$scope_['sampleData']], this.templateString, 'sample');
      for (let key in data) {
        this.iframeEl_.srcdoc = data[key];
      }
    }
  }

  onLink(iframeEl, ngModelCtrl) {
    this.iframeEl_ = iframeEl;
    this.ngModelCtrl_ = ngModelCtrl;
    this.updatePreview_();
  }

  get templateString() {
    return this.ngModelCtrl_.$viewValue;
  }
  set templateString(newString) {
    this.ngModelCtrl_.$setViewValue(newString);
    if (newString !== null) {
      this.updatePreview_();
    }
  }
}
