require('babel/polyfill');
let path = require('path');

import { _provider } from './generate';

describe('generate', () => {
  const TEMPLATE_PATH = 'TEMPLATE_PATH';
  const TEMPLATE_TEXT = 'TEMPLATE_TEXT';
  const OUT_NAME = 'OUT_NAME';

  let fakeFs;
  let fakeHandleBars;
  let generate;

  beforeEach(() => {
    fakeFs = jasmine.createSpyObj('fs', [
      'linkSync',
      'mkdirSync',
      'readFileSync',
      'statSync',
      'unlink',
      'writeFileSync'
    ]);
    fakeHandleBars = jasmine.createSpyObj('handlebars', ['compile', 'registerHelper']);
    generate = _provider.bind(null, fakeFs, fakeHandleBars, path);
  });

  it('should return all the cards', () => {
    let localDataList = [
      {
        a: 1
      },
      {
        b: 2
      }
    ];
    let outName1 = 'outName1';
    let outName2 = 'outName2';
    let rendered1 = 'rendered1';
    let rendered2 = 'rendered2';

    let fileTemplate = jasmine.createSpy('fileTemplate').and
        .callFake(data => (data._local.a === 1) ? rendered1 : rendered2);
    let nameTemplate = jasmine.createSpy('nameTemplate').and
        .callFake(data => (data._local.a === 1) ? outName1 : outName2);

    fakeFs.statSync.and.throwError('Expected');
    fakeFs.readFileSync.and.returnValue(TEMPLATE_TEXT);

    fakeHandleBars.compile.and
        .callFake(name => (name === TEMPLATE_TEXT) ? fileTemplate : nameTemplate);

    expect(generate(TEMPLATE_PATH, OUT_NAME, localDataList)).toEqual({
      [outName1]: rendered1,
      [outName2]: rendered2
    });

    expect(fileTemplate)
        .toHaveBeenCalledWith(jasmine.objectContaining({ _local: localDataList[0] }));
    expect(fileTemplate)
        .toHaveBeenCalledWith(jasmine.objectContaining({ _local: localDataList[1] }));
    expect(nameTemplate)
        .toHaveBeenCalledWith(jasmine.objectContaining({ _local: localDataList[0] }));
    expect(nameTemplate)
        .toHaveBeenCalledWith(jasmine.objectContaining({ _local: localDataList[1] }));
  });

  it('should register all the given helpers', () => {
    let helpers = {
      helper1: () => {},
      helper2: () => {}
    };

    generate(TEMPLATE_PATH, OUT_NAME, [], {}, helpers);
    expect(fakeHandleBars.registerHelper).toHaveBeenCalledWith('helper1', helpers.helper1);
    expect(fakeHandleBars.registerHelper).toHaveBeenCalledWith('helper2', helpers.helper2);
  });

  it('should mixin the globals in the data', () => {
    let localDataList = [{ a: 1 }];
    let globals = { global: 1 };
    let outName = 'outName';
    let rendered = 'rendered';

    let fileTemplate = jasmine.createSpy('fileTemplate').and.returnValue(rendered);
    let nameTemplate = jasmine.createSpy('nameTemplate').and.returnValue(outName);

    fakeFs.readFileSync.and.returnValue(TEMPLATE_TEXT);

    fakeHandleBars.compile.and
        .callFake(name => (name === TEMPLATE_TEXT) ? fileTemplate : nameTemplate);

    generate(TEMPLATE_PATH, OUT_NAME, localDataList, globals);

    expect(fileTemplate).toHaveBeenCalledWith(jasmine.objectContaining(globals));
    expect(nameTemplate).toHaveBeenCalledWith(jasmine.objectContaining(globals));
  });

  it('should recursively resolve local data', () => {
    let localDataList = [{ a: '{{a}}' }];
    let globals = { a: 1 };
    let outName = 'outName';
    let rendered = 'rendered';

    let fileTemplate = jasmine.createSpy('fileTemplate').and.returnValue(rendered);
    let localTemplate = jasmine.createSpy('localTemplate').and.returnValue(globals.a);
    let nameTemplate = jasmine.createSpy('nameTemplate').and.returnValue(outName);

    fakeFs.statSync.and.throwError('Expected');
    fakeFs.readFileSync.and.returnValue(TEMPLATE_TEXT);

    fakeHandleBars.compile.and.callFake(name => {
      switch(name) {
        case TEMPLATE_TEXT:
          return fileTemplate;
        case localDataList[0].a:
          return localTemplate;
        default:
          return nameTemplate;
      }
    });

    generate(TEMPLATE_PATH, OUT_NAME, localDataList, globals);

    expect(localTemplate).toHaveBeenCalledWith(jasmine.objectContaining(globals));
    expect(fileTemplate)
        .toHaveBeenCalledWith(jasmine.objectContaining({ _local: { a: 1 } }));
  });

  it('should not crash if local data value is non string', () => {
    let localDataList = [{ a: 1 }];
    let globals = { a: 1 };
    let outName = 'outName';
    let rendered = 'rendered';

    let fileTemplate = jasmine.createSpy('fileTemplate').and.returnValue(rendered);
    let localTemplate = jasmine.createSpy('localTemplate').and.returnValue(globals.a);
    let nameTemplate = jasmine.createSpy('nameTemplate').and.returnValue(outName);

    fakeFs.statSync.and.throwError('Expected');
    fakeFs.readFileSync.and.returnValue(TEMPLATE_TEXT);

    fakeHandleBars.compile.and
        .callFake(name => (name === TEMPLATE_TEXT) ? fileTemplate : nameTemplate);

    generate(TEMPLATE_PATH, OUT_NAME, localDataList, globals);

    expect(localTemplate).not.toHaveBeenCalled();
    expect(fileTemplate)
        .toHaveBeenCalledWith(jasmine.objectContaining({ _local: localDataList[0] }));
  });

  it('should resolve local data with object value', () => {
    let localDataList = [{
      a: {
        b: '{{a}}'
      }
    }];
    let globals = { a: 1 };
    let outName = 'outName';
    let rendered = 'rendered';

    let fileTemplate = jasmine.createSpy('fileTemplate').and.returnValue(rendered);
    let localTemplate = jasmine.createSpy('localTemplate').and.returnValue(globals.a);
    let nameTemplate = jasmine.createSpy('nameTemplate').and.returnValue(outName);

    fakeFs.statSync.and.throwError('Expected');
    fakeFs.readFileSync.and.returnValue(TEMPLATE_TEXT);

    fakeHandleBars.compile.and.callFake(name => {
      switch(name) {
        case TEMPLATE_TEXT:
          return fileTemplate;
        case localDataList[0].a.b:
          return localTemplate;
        default:
          return nameTemplate;
      }
    });

    generate(TEMPLATE_PATH, OUT_NAME, localDataList, globals);

    expect(localTemplate).toHaveBeenCalledWith(jasmine.objectContaining(globals));
    expect(fileTemplate)
        .toHaveBeenCalledWith(jasmine.objectContaining({ _local: { a: { b: 1 } } }));
  });
});
