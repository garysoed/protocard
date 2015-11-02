// import TestBase from '../testbase';
//
// import ObjectEditorCtrl from './object-editor-ctrl';
//
// describe('settings.ObjectEditorCtrl', () => {
//   let object;
//   let ctrl;
//
//   beforeEach(() => {
//     object = {};
//     ctrl = new ObjectEditorCtrl({ object: object });
//   });
//
//   describe('getFields', () => {
//     it('should return the input object', () => {
//       expect(ctrl.getFields()).toBe(object);
//     });
//   });
//
//   describe('onAddClick', () => {
//     it('should add a new field to the object', () => {
//       let timestamp = 1239;
//       jasmine.clock().mockDate(new Date(timestamp));
//
//       ctrl.onAddClick();
//       let newField = object[`Field ${timestamp}`];
//       expect(newField.name).toEqual(`Field ${timestamp}`);
//     });
//   });
// });
