import ImageSelectCtrl from './image-select-ctrl';

export function link(scope, element, attr, ctrls) {
  let [imageSelectCtrl, ngModelCtrl] = ctrls;
  imageSelectCtrl.onLink(ngModelCtrl);
};

export default angular
    .module('pc.editor.ImageSelectModule', [])
    .directive('pcImageSelect', () => {
      return {
        controller: ImageSelectCtrl,
        controllerAs: 'ctrl',
        link: link,
        require: ['pcImageSelect', 'ngModel'],
        restrict: 'E',
        scope: {
          'images': '='
        },
        templateUrl: './editor/image-select.ng'
      };
    });
