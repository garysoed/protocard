import FileUploadCtrl from './file-upload-ctrl';

function link(scope, element, attr, ctrls, transclude) {
  let [fileUploadCtrl, ngModelCtrl] = ctrls;
  fileUploadCtrl.onLink(element[0].querySelector('input[type="file"]'), ngModelCtrl);

  transclude(clone => {
    element.find('ng-transclude').replaceWith(clone);
  });
}

export default angular
    .module('pc.editor.FileUploadModule', [])
    .directive('pcFileUpload', () => {
      return {
        controller: FileUploadCtrl,
        controllerAs: 'ctrl',
        require: ['pcFileUpload', 'ngModel'],
        restrict: 'E',
        scope: {
          'classes': '@',
          'extensions': '@'
        },
        templateUrl: './editor/file-upload.ng',
        transclude: true,
        link: link
      };
    });
