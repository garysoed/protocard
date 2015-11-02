// import TestBase from '../testbase';
//
// import EditGlobalsDialogService from './edit-globals-dialog-service';
//
// describe('settings.EditGlobalsDialogService', () => {
//   let mock$mdDialog;
//   let service;
//
//   beforeEach(() => {
//     mock$mdDialog = jasmine.createSpyObj('$mdDialog', ['show']);
//     service = new EditGlobalsDialogService(mock$mdDialog);
//   });
//
//   describe('show', () => {
//     it('should show the dialog', () => {
//       let globals = {};
//       let $event = {};
//       service.show($event, globals);
//       expect(mock$mdDialog.show).toHaveBeenCalledWith(jasmine.objectContaining({
//         locals: {
//           globals: globals
//         },
//         targetEvent: $event
//       }));
//     });
//   });
// });
