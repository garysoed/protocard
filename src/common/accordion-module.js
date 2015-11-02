import AccordionCtrl from './accordion-ctrl';

export function link(scope, element, attr, ctrl) {
  ctrl.onLink(element[0].querySelector('.content'));
};

export default angular
    .module('pc.common.AccordionModule', [])
    .directive('pcAccordion', () => {
      return {
        controller: AccordionCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'title': '@'
        },
        link: link,
        templateUrl: './common/accordion.ng',
        transclude: true
      };
    });
