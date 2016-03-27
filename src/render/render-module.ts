import ContextButtonModule from '../common/context-button';
import DownloadServiceModule from '../common/download-service';
import ErrorDisplayModule from '../common/error-display';
import GeneratorServiceModule from '../generate/generator-service';
import JszipServiceModule from '../thirdparty/jszip-service-module';
import RenderCtrl from './render-ctrl';
import RenderServiceModule from './render-service-module';

export default angular
    .module('render.RenderModule', [
      ContextButtonModule.name,
      DownloadServiceModule.name,
      ErrorDisplayModule.name,
      JszipServiceModule.name,
      GeneratorServiceModule.name,
      RenderServiceModule.name,
    ])
    .directive('pcRender', () => {
      return {
        controller: RenderCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'asset': '='
        },
        templateUrl: 'src/render/render.ng',
      };
    });
