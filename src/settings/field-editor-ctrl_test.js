// import TestBase from '../testbase';
//
// import Field from '../model/field';
// import FieldEditorCtrl from './field-editor-ctrl';
//
// describe('settings.FieldEditorCtrl', () => {
//   let $scope;
//   let field;
//   let ctrl;
//
//   beforeEach(() => {
//     field = new Field('name', 'value');
//     $scope = { field: field };
//     ctrl = new FieldEditorCtrl($scope);
//   });
//
//   describe('constructor', () => {
//     it('should initialize the scope values', () => {
//       expect($scope['name']).toEqual(field.name);
//       expect($scope['value']).toEqual(field.value);
//     });
//   });
//
//   describe('onNameChange', () => {
//     it('should update the field name', () => {
//       let newName = 'newName';
//       ctrl.onNameChange(newName);
//       expect(field.name).toEqual(newName);
//     });
//   });
//
//   describe('onValueChange', () => {
//     it('should update the field value', () => {
//       let newValue = 'newValue';
//       ctrl.onValueChange(newValue);
//       expect(field.value).toEqual(newValue);
//     });
//   });
// });
