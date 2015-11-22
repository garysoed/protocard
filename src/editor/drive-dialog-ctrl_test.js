import TestBase from '../testbase';

import DriveDialogCtrl from './drive-dialog-ctrl';
import FakeScope from '../testing/fake-scope';

describe('editor.DriveDialogCtrl', () => {
  let fake$scope;
  let mock$mdDialog;
  let mockGapiService;
  let mockDriveClient;
  let ctrl;

  beforeEach(() => {
    fake$scope = new FakeScope();
    mock$mdDialog = jasmine.createSpyObj('$mdDialog', ['cancel', 'hide']);
    mockDriveClient = {};
    mockGapiService = jasmine.createSpyObj(
        'GapiService', ['authenticate', 'getClientPromise', 'newBatch']);
    mockGapiService.getClientPromise.and.returnValue(Promise.resolve(mockDriveClient));
    ctrl = new DriveDialogCtrl(mock$mdDialog, fake$scope, mockGapiService);
  });

  it('should get the correct version of drive client', () => {
    expect(mockGapiService.getClientPromise).toHaveBeenCalledWith('drive', 'v2');
  });

  describe('updateResources_', () => {
    it('should authenticate and resolve with the correct ImageResources', done => {
      let resourceUrl = 'resourceUrl';
      let webViewLink = 'webViewLink';
      let listResponse = {
        result: {
          items: [
            { id: 'id1' },
            { id: 'id2' }
          ]
        }
      };
      let batchResponse = {
        result: {
          '1': {
            result: { title: 'title1', thumbnailLink: 'thumbnailLink1' }
          },
          '2': {
            result: { title: 'title2', thumbnailLink: 'thumbnailLink2' }
          }
        }
      };
      let batch = Promise.resolve(batchResponse);
      batch.add = jasmine.createSpy('batch.add');

      mockGapiService.authenticate.and.returnValue(Promise.resolve());
      mockGapiService.newBatch.and.returnValue(batch);

      mockDriveClient.children = {
        list: jasmine.createSpy('children.list').and.returnValue(Promise.resolve(listResponse))
      };

      let getResponses = {
        id1: Promise.resolve(),
        id2: Promise.resolve()
      };
      let folderResponse = {
        result: { webViewLink: webViewLink }
      };
      mockDriveClient.files = {
        get: jasmine.createSpy('files.get').and.callFake(payload => {
          let rv = getResponses[payload.fileId] || Promise.resolve(folderResponse);
          return rv;
        })
      };

      spyOn(fake$scope, '$apply');

      ctrl.updateResources_(resourceUrl)
          .then(() => {
            expect(mockGapiService.authenticate).toHaveBeenCalledWith(['drive.readonly']);
            expect(mockDriveClient.children.list).toHaveBeenCalledWith({ folderId: resourceUrl });

            expect(ctrl.resources[0].alias).toEqual('title1');
            expect(ctrl.resources[0].url).toEqual(`${webViewLink}title1`);
            expect(ctrl.resources[0].previewUrl).toEqual('thumbnailLink1');

            expect(ctrl.resources[1].alias).toEqual('title2');
            expect(ctrl.resources[1].url).toEqual(`${webViewLink}title2`);
            expect(ctrl.resources[1].previewUrl).toEqual('thumbnailLink2');

            expect(fake$scope.$apply).toHaveBeenCalledWith(jasmine.any(Function));
            done();
          }, done.fail);
    });
  });

  describe('hasSelected', () => {
    it('should return true if there are images selected', () => {
      let images = ['image1', 'image2'];
      ctrl.selectedImages = images;
      expect(ctrl.hasSelected()).toEqual(true);
    });

    it('should return false if there are no images selected', () => {
      ctrl.selectedImages = [];
      expect(ctrl.hasSelected()).toEqual(false);
    });
  });

  describe('onDeleteClick', () => {
    it('should delete the selected image resources and clears the selected images', () => {
      ctrl.resources_ = ['image1', 'image2', 'image3'];
      ctrl.selectedImages = ['image1', 'image3'];

      ctrl.onDeleteClick();
      expect(ctrl.resources).toEqual(['image2']);
      expect(ctrl.selectedImages).toEqual([]);
    });
  });

  describe('onOkClick', () => {
    it('should hide the dialog with the resources', () => {
      let resources = ['image1', 'image2'];
      ctrl.resources_ = resources;
      ctrl.onOkClick();

      expect(mock$mdDialog.hide).toHaveBeenCalledWith(resources);
    });
  });

  describe('onCancelClick', () => {
    it('should cancel the dialog', () => {
      ctrl.onCancelClick();
      expect(mock$mdDialog.cancel).toHaveBeenCalledWith();
    });
  });
});
