import GeneratorServiceModule from '../../generate/generator-service-module';
import ImageSelectModule from '../../editor/image-select-module';
import RenderCtrl from './render-ctrl';
import RenderServiceModule from './render-service-module';

export default angular
    .module('pc.asset.render.RenderModule', [
      GeneratorServiceModule.name,
      RenderServiceModule.name
    ])
    .directive('pcAssetRender', () => {
      return {
        controller: RenderCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'asset': '='
        },
        templateUrl: './asset/render/render.ng'
      };
    });
