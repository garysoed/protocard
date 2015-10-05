require('babel/polyfill');
let path = require('path');

import { _provider } from './generate';

describe('generate', () => {
  const TEMPLATE_PATH = 'TEMPLATE_PATH';
  const TEMPLATE_TEXT = 'TEMPLATE_TEXT';
  const OUT_DIR = 'OUT_DIR';
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

  it('should generate all the cards at the specified output directory', () => {
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

    generate(TEMPLATE_PATH, OUT_DIR, OUT_NAME, localDataList);

    expect(fakeFs.mkdirSync).toHaveBeenCalledWith(OUT_DIR);
    expect(fakeFs.writeFileSync).toHaveBeenCalledWith(`${OUT_DIR}/${outName1}`, rendered1);
    expect(fakeFs.writeFileSync).toHaveBeenCalledWith(`${OUT_DIR}/${outName2}`, rendered2);

    expect(fileTemplate)
        .toHaveBeenCalledWith(jasmine.objectContaining({ _local: localDataList[0] }));
    expect(fileTemplate)
        .toHaveBeenCalledWith(jasmine.objectContaining({ _local: localDataList[1] }));
    expect(nameTemplate)
        .toHaveBeenCalledWith(jasmine.objectContaining({ _local: localDataList[0] }));
    expect(nameTemplate)
        .toHaveBeenCalledWith(jasmine.objectContaining({ _local: localDataList[1] }));
  });

  it('should copy the assets if given', () => {
    const ASSETS_NAME = 'ASSETS_NAME';
    const ASSETS_DIR = `ASSETS_DIR/${ASSETS_NAME}`;
    let expectedOutDir = `${OUT_DIR}/${ASSETS_NAME}`;

    fakeFs.statSync.and.callFake(dir => {
      if (dir === expectedOutDir) {
        throw Error('Expected');
      }
    });

    generate(TEMPLATE_PATH, OUT_DIR, OUT_NAME, [], undefined, undefined, ASSETS_DIR);
    expect(fakeFs.linkSync).toHaveBeenCalled();
    expect(fakeFs.linkSync).toHaveBeenCalledWith(ASSETS_DIR, expectedOutDir);
    expect(fakeFs.statSync).toHaveBeenCalledWith(expectedOutDir);
    expect(fakeFs.unlink).not.toHaveBeenCalled();
  });

  it('should delete the assets directory if it exists', () => {
    const ASSETS_NAME = 'ASSETS_NAME';
    const ASSETS_DIR = `ASSETS_DIR/${ASSETS_NAME}`;

    fakeFs.statSync.and.returnValue({});

    generate(TEMPLATE_PATH, OUT_DIR, OUT_NAME, [], undefined, undefined, ASSETS_DIR);
    expect(fakeFs.unlink).toHaveBeenCalledWith(`${OUT_DIR}/${ASSETS_NAME}`);
  });

  it('should not make the output directory if it exists', () => {
    fakeFs.statSync.and.returnValue({});

    generate(TEMPLATE_PATH, OUT_DIR, OUT_NAME, []);
    expect(fakeFs.statSync).toHaveBeenCalledWith(OUT_DIR);
    expect(fakeFs.mkdirSync).not.toHaveBeenCalled();
  });

  it('should register all the given helpers', () => {
    let helpers = {
      helper1: () => {},
      helper2: () => {}
    };

    generate(TEMPLATE_PATH, OUT_DIR, OUT_NAME, [], {}, helpers);
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

    generate(TEMPLATE_PATH, OUT_DIR, OUT_NAME, localDataList, globals);

    expect(fileTemplate).toHaveBeenCalledWith(jasmine.objectContaining(globals));
    expect(nameTemplate).toHaveBeenCalledWith(jasmine.objectContaining(globals));
  });
});
