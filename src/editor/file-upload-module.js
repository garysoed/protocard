import FileUploadCtrl from './file-upload-ctrl';

function link(scope, element, attr, ctrls) {
  let [fileUploadCtrl, ngModelCtrl] = ctrls;
  fileUploadCtrl.onLink(element[0].querySelector('input[type="file"]'), ngModelCtrl);
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
        link: link
      };
    });
