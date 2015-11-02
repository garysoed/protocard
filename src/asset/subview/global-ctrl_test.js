import TestBase from '../../testbase';

import { Events as CodeEditorEvents } from '../../editor/code-editor-ctrl';
import GlobalCtrl from './global-ctrl';

describe('asset.subview.GlobalCtrl', () => {
  let mockAssetService;
  let mockAsset;
  let mock$scope;
  let ctrl;

  beforeEach(() => {
    mockAsset = {};
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    mock$scope = jasmine.createSpyObj('$scope', ['$on']);
    mock$scope['asset'] = mockAsset;

    ctrl = new GlobalCtrl(mock$scope, mockAssetService);
  });

  it('should update the value and save it on save event', () => {
    let globalsString = 'globalsString';
    mock$scope['globalsString'] = globalsString;

    expect(mock$scope.$on).toHaveBeenCalledWith(CodeEditorEvents.SAVE, jasmine.any(Function));

    mock$scope.$on.calls.argsFor(0)[1]();
    expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
    expect(mockAsset.globalsString).toEqual(globalsString);
  });

  describe('onInit', () => {
    it('should update the scope', () => {
      let globalsString = 'globalsString';
      mockAsset.globalsString = globalsString;

      ctrl.onInit();
      expect(mock$scope['globalsString']).toEqual(globalsString);
    });
  });
});
