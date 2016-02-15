import Generator from './generator';

describe('Generator', () => {
  const TEMPLATE_TEXT = 'TEMPLATE_TEXT';
  const OUT_NAME = 'OUT_NAME';

  let fakeHandleBars;
  let generator;

  beforeEach(() => {
    fakeHandleBars = jasmine
        .createSpyObj('handlebars', ['compile', 'registerHelper', 'registerPartial']);
    generator = new Generator(fakeHandleBars);
  });

  describe('generate', () => {
    it('should return all the cards', () => {
      let localDataList = [
        { a: 1 },
        { b: 2 },
      ];
      let outName1 = 'outName1';
      let outName2 = 'outName2';
      let rendered1 = 'rendered1';
      let rendered2 = 'rendered2';

      let fileTemplate = jasmine.createSpy('fileTemplate').and
          .callFake((data: any) => (data._.a === 1) ? rendered1 : rendered2);
      let nameTemplate = jasmine.createSpy('nameTemplate').and
          .callFake((data: any) => (data._.a === 1) ? outName1 : outName2);

      fakeHandleBars.compile.and
          .callFake((name: string) => (name === TEMPLATE_TEXT) ? fileTemplate : nameTemplate);

      expect(generator.generate(TEMPLATE_TEXT, OUT_NAME, localDataList)).toEqual({
        [outName1]: rendered1,
        [outName2]: rendered2,
      });

      expect(fileTemplate)
          .toHaveBeenCalledWith(jasmine.objectContaining({ _: localDataList[0] }));
      expect(fileTemplate)
          .toHaveBeenCalledWith(jasmine.objectContaining({ _: localDataList[1] }));
      expect(nameTemplate)
          .toHaveBeenCalledWith(jasmine.objectContaining({ _: localDataList[0] }));
      expect(nameTemplate)
          .toHaveBeenCalledWith(jasmine.objectContaining({ _: localDataList[1] }));
    });

    it('should register all the given helpers', () => {
      let helpers = <{ [index: string]: Function }>{};
      helpers['helper1'] = () => undefined;
      helpers['helper2'] = () => undefined;

      new Generator(fakeHandleBars, { helpers: helpers });
      expect(fakeHandleBars.registerHelper).toHaveBeenCalledWith('helper1', helpers['helper1']);
      expect(fakeHandleBars.registerHelper).toHaveBeenCalledWith('helper2', helpers['helper2']);
    });

    it('should register all the given partials', () => {
      let partials = <{ [index: string]: string }>{};
      partials['partial1'] = 'partial1';
      partials['partial2'] = 'partial2';

      new Generator(fakeHandleBars, { partials: partials });
      expect(fakeHandleBars.registerPartial).toHaveBeenCalledWith('partial1', partials['partial1']);
      expect(fakeHandleBars.registerPartial).toHaveBeenCalledWith('partial2', partials['partial2']);
    });

    it('should mixin the globals in the data', () => {
      let localDataList = [{ a: 1 }];
      let globals = { global: 1 };
      let outName = 'outName';
      let rendered = 'rendered';

      let fileTemplate = jasmine.createSpy('fileTemplate').and.returnValue(rendered);
      let nameTemplate = jasmine.createSpy('nameTemplate').and.returnValue(outName);

      fakeHandleBars.compile.and
          .callFake((name: string) => (name === TEMPLATE_TEXT) ? fileTemplate : nameTemplate);

      let generator = new Generator(fakeHandleBars, { globals: globals });
      generator.generate(TEMPLATE_TEXT, OUT_NAME, localDataList);

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

      fakeHandleBars.compile.and.callFake((name: string) => {
        switch(name) {
          case TEMPLATE_TEXT:
            return fileTemplate;
          case localDataList[0].a:
            return localTemplate;
          default:
            return nameTemplate;
        }
      });

      let generator = new Generator(fakeHandleBars, { globals: globals });
      generator.generate(TEMPLATE_TEXT, OUT_NAME, localDataList);

      expect(localTemplate).toHaveBeenCalledWith(jasmine.objectContaining(globals));
      expect(fileTemplate)
          .toHaveBeenCalledWith(jasmine.objectContaining({ _: { a: 1 } }));
    });

    it('should not crash if local data value is non string', () => {
      let localDataList = [{ a: 1 }];
      let globals = { a: 1 };
      let outName = 'outName';
      let rendered = 'rendered';

      let fileTemplate = jasmine.createSpy('fileTemplate').and.returnValue(rendered);
      let localTemplate = jasmine.createSpy('localTemplate').and.returnValue(globals.a);
      let nameTemplate = jasmine.createSpy('nameTemplate').and.returnValue(outName);

      fakeHandleBars.compile.and
          .callFake((name: string) => (name === TEMPLATE_TEXT) ? fileTemplate : nameTemplate);

      let generator = new Generator(fakeHandleBars, { globals: globals });
      generator.generate(TEMPLATE_TEXT, OUT_NAME, localDataList);

      expect(localTemplate).not.toHaveBeenCalled();
      expect(fileTemplate)
          .toHaveBeenCalledWith(jasmine.objectContaining({ _: localDataList[0] }));
    });

    it('should resolve local data with object value', () => {
      let localDataList = [
        {
          a: {
            b: '{{a}}'
          },
        },
      ];
      let globals = { a: 1 };
      let outName = 'outName';
      let rendered = 'rendered';

      let fileTemplate = jasmine.createSpy('fileTemplate').and.returnValue(rendered);
      let localTemplate = jasmine.createSpy('localTemplate').and.returnValue(globals.a);
      let nameTemplate = jasmine.createSpy('nameTemplate').and.returnValue(outName);

      fakeHandleBars.compile.and.callFake((name: string) => {
        switch(name) {
          case TEMPLATE_TEXT:
            return fileTemplate;
          case localDataList[0].a.b:
            return localTemplate;
          default:
            return nameTemplate;
        }
      });

      let generator = new Generator(fakeHandleBars, { globals: globals });
      generator.generate(TEMPLATE_TEXT, OUT_NAME, localDataList);

      expect(localTemplate).toHaveBeenCalledWith(jasmine.objectContaining(globals));
      expect(fileTemplate)
          .toHaveBeenCalledWith(jasmine.objectContaining({ _: { a: { b: 1 } } }));
    });
  });

  describe('resolve', () => {
    it('should resolve the given template string', () => {
      let globals = { a: 1 };
      let templateString = 'templateString';
      let resolvedTemplate = 'resolvedTemplate';
      let fakeTemplate = jasmine.createSpy('template').and.returnValue(resolvedTemplate);

      fakeHandleBars.compile.and.returnValue(fakeTemplate);
      let generator = new Generator(fakeHandleBars, { globals: globals });

      expect(generator.resolve(templateString)).toEqual(resolvedTemplate);
      expect(fakeTemplate).toHaveBeenCalledWith(jasmine.objectContaining(globals));
    });
  });
});
