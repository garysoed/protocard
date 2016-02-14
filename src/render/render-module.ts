import ContextButtonModule from '../common/context-button-module';
import DownloadServiceModule from '../common/download-service-module';
import ErrorDisplayModule from '../common/error-display-module';
import GeneratorServiceModule from '../generate/generator-service-module';
import JszipServiceModule from '../thirdparty/jszip-service-module';
import RenderCtrl from './render-ctrl';
import RenderServiceModule from './render-service-module';

export default angular
    .module('pc.render.RenderModule', [
      ContextButtonModule.name,
      DownloadServiceModule.name,
      ErrorDisplayModule.name,
      JszipServiceModule.name,
      GeneratorServiceModule.name,
      RenderServiceModule.name
    ])
    .directive('pcRender', () => {
      return {
        controller: RenderCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'asset': '='
        },
        templateUrl: './render/render.ng'
      };
    });
