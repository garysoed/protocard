import DownloadServiceModule from '../../common/download-service-module';
import ErrorDisplayModule from '../../common/error-display-module';
import GeneratorServiceModule from '../../generate/generator-service-module';
import ImageSelectModule from '../../editor/image-select-module';
import JszipServiceModule from '../../thirdparty/jszip-service-module';
import RenderCtrl from './render-ctrl';
import RenderServiceModule from './render-service-module';

export default angular
    .module('pc.asset.render.RenderModule', [
      DownloadServiceModule.name,
      ErrorDisplayModule.name,
      JszipServiceModule.name,
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
