import TestBase from '../testbase';
TestBase.init();

import FakeScope from '../../node_modules/gs-tools/src/ng/fake-scope';
import { FileTypes } from '../model/file';
import { FileUploadCtrl } from './file-upload';
import ListenableElement, { EventType as DomEventType }
    from '../../node_modules/gs-tools/src/event/listenable-element';
import Mocks from '../../node_modules/gs-tools/src/mock/mocks';
import TestDispose from '../../node_modules/gs-tools/src/testing/test-dispose';


describe('editor.FileUploadCtrl', () => {
  let mock$window;
  let mock$element;
  let ctrl;

  beforeEach(() => {
    mock$element = jasmine.createSpyObj('$element', ['querySelector']);

    mock$window = <Window> {};
    ctrl = new FileUploadCtrl(<any> [mock$element], FakeScope.create(), mock$window);
    TestDispose.add(ctrl);
  });

  describe('$onInit', () => {
    it('should listen to change event', () => {
      let mockInputEl = Mocks.object('InputEl');
      mock$element.querySelector.and.returnValue(mockInputEl);

      let mockListenableElement = Mocks.listenable('ListenableElement');
      spyOn(ListenableElement, 'of').and.returnValue(mockListenableElement);
      spyOn(mockListenableElement, 'on');
      spyOn(ctrl, 'onFileChange_');

      ctrl.$onInit();

      expect(mock$element.querySelector).toHaveBeenCalledWith('input[type="file"]');
      expect(ListenableElement.of).toHaveBeenCalledWith(mockInputEl);
      expect(ctrl['inputEl_']).toEqual(mockListenableElement);

      expect(mockListenableElement.on)
          .toHaveBeenCalledWith(DomEventType.CHANGE, jasmine.any(Function));
      mockListenableElement.on.calls.argsFor(0)[1]();
      expect(ctrl['onFileChange_']).toHaveBeenCalledWith();
    });
  });

  describe('onFileChange_', () => {
    it('should set the ngModelCtrl view value to the file object with the correct data', () => {
      let fileReaderResult = 'fileReaderResult';
      let file = { name: 'filename.tsv' };
      let mockFileReader = jasmine.createSpyObj('FileReader', ['addEventListener', 'readAsText']);
      mockFileReader.result = fileReaderResult;

      let mockFileReaderCtor = jasmine.createSpy('FileReader');
      mockFileReaderCtor.and.returnValue(mockFileReader);
      mock$window['FileReader'] = mockFileReaderCtor;

      let mockNgModel = jasmine.createSpyObj('NgModel', ['$setViewValue']);
      let mockInputEl = jasmine.createSpyObj('input', ['addEventListener']);

      mockInputEl.files = [file];
      ctrl.ngModel = mockNgModel;
      ctrl['inputEl_'] = { element: mockInputEl };
      ctrl['onFileChange_']();

      expect(mockFileReader.readAsText).toHaveBeenCalledWith(file);
      expect(mockFileReader.addEventListener)
          .toHaveBeenCalledWith('loadend', jasmine.any(Function));

      mockFileReader.addEventListener.calls.argsFor(0)[1]();

      let fileObj = mockNgModel.$setViewValue.calls.argsFor(0)[0];
      expect(fileObj.type).toEqual(FileTypes.TSV);
      expect(fileObj.content).toEqual(fileReaderResult);
    });
  });

  describe('onUploadClick', () => {
    it('should click the input element', () => {
      let mockInputEl = jasmine.createSpyObj('input', ['click']);
      ctrl['inputEl_'] = { element: mockInputEl };
      ctrl.onUploadClick();
      expect(mockInputEl.click).toHaveBeenCalledWith();
    });
  });
});
