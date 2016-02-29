import GeneratorService from './generator-service';
import HandlebarsServiceModule from '../thirdparty/handlebars-service-module';

export default angular
    .module('generator.GeneratorServiceModule', [
      HandlebarsServiceModule.name
    ])
    .service('GeneratorService', GeneratorService);
