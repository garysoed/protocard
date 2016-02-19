import FileUploadCtrl from './file-upload-ctrl';

function link(
    scope: angular.IScope,
    element: angular.IAugmentedJQuery,
    attr: angular.IAttributes,
    ctrls: any[],
    transclude: angular.ITranscludeFunction): void {
  let [fileUploadCtrl, ngModelCtrl] = ctrls;
  fileUploadCtrl.onLink(element[0].querySelector('input[type="file"]'), ngModelCtrl);

  transclude((clone: JQuery) => {
    element.find('ng-transclude').replaceWith(clone);
  });
}

export default angular
    .module('pc.editor.FileUploadModule', [])
    .directive('pcFileUpload', () => {
      return {
        controller: FileUploadCtrl,
        controllerAs: 'ctrl',
        link: link,
        require: ['pcFileUpload', 'ngModel'],
        restrict: 'E',
        scope: {
          'classes': '@',
          'extensions': '@',
        },
        templateUrl: 'src/editor/file-upload.ng',
        transclude: true,
      };
    });
