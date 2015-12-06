// import TestBase from '../testbase';
//
// import EditGlobalsDialogCtrl from './edit-globals-dialog-ctrl';
// import Field from '../model/field';
//
// describe('settings.EditGlobalsDialogCtrl', () => {
//   let mock$mdDialog;
//   let ctrl;
//
//   beforeEach(() => {
//     mock$mdDialog = jasmine.createSpyObj('$mdDialog', ['cancel', 'hide']);
//     ctrl = new EditGlobalsDialogCtrl(mock$mdDialog, {});
//   });
//
//   describe('getGlobals', () => {
//     it('should return a copy of the input globals', () => {
//       let globals = {
//         a: new Field('a', 'aValue'),
//         b: new Field('b', 'bValue')
//       };
//
//       let ctrl = new EditGlobalsDialogCtrl(mock$mdDialog, globals);
//       expect(ctrl.getGlobals()).not.toBe(globals);
//       expect(ctrl.getGlobals()).toEqual(globals);
//     });
//   });
//
//   describe('onSaveClick', () => {
//     it('should hide the dialog', () => {
//       ctrl.onSaveClick();
//       expect(mock$mdDialog.hide).toHaveBeenCalledWith(ctrl.getGlobals());
//     });
//   });
//
//   describe('onCancelClick', () => {
//     it('should cancel the dialog', () => {
//       ctrl.onCancelClick();
//       expect(mock$mdDialog.cancel).toHaveBeenCalledWith();
//     });
//   });
// });
