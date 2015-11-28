import { Types as FileTypes } from '../../data/file';
import Extract from '../../convert/extract';
import Generator from '../../generate/generator';
import Utils from '../../utils';

/**
 * @class asset.render.RenderCtrl
 */
export default class {
  /**
   * @constructor
   */
  constructor($scope, RenderService) {
    let asset = $scope['asset'];
    let dataFile = asset.data;
    let writer = null;
    switch (dataFile.type) {
      case FileTypes.TSV:
        writer = Extract.fromTsv(dataFile.content);
        break;
      default:
        throw Error(`Unhandled file type: ${dataFile.type}`);
    }
    let data = writer.write(asset.dataProcessor.asFunction());

    // TODO(gs): Make Handlebars a third party module.
    // TODO(gs): Make some helpers built in
    // TODO(gs): Add Partials to asset
    // TODO(gs): Add name to asset
    let generator = new Generator(Handlebars, {
      globals: asset.globals,
      helpers: Utils.mapValue(asset.helpers, helper => helper.asFunction()),
      partials: {}
    });
    let generatedHtml = generator.generate(
        asset.templateString,
        '{{lowercase _.name}}',
        data);

    RenderService.render(generatedHtml['bot'], 825, 1125);
  }
}
