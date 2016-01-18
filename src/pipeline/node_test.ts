import TestBase from '../testbase';
TestBase.init();

import Node from './node';


class TestNode extends Node<string> {
  result_: {result: Promise<string>};

  constructor(dependencies: Node<string>[], result: {result: Promise<string>}) {
    super(dependencies);
    this.result_ = result;
  }

  runHandler_(dependencyResults: any[]): Promise<string> {
    return this.result_.result;
  }
}

describe('pipeline.Node', () => {
  let dependency;
  let dependencyResult;
  let result;
  let node;

  beforeEach(() => {
    dependencyResult = {};
    dependency = new TestNode([], dependencyResult);

    spyOn(dependency, 'addChangeListener');

    result = {};
    node = new TestNode([dependency], result);
  });

  it('should refresh when the dependency is changed', () => {
    expect(dependency.addChangeListener).toHaveBeenCalledWith(jasmine.any(Function));

    spyOn(node, 'refresh');
    dependency.addChangeListener.calls.argsFor(0)[0]();

    expect(node.refresh).toHaveBeenCalledWith();
  });

  describe('addChangeListener', () => {
    it('should call the listener when it is ran', done => {
      let listener = jasmine.createSpy('listener');
      node.addChangeListener(listener);

      dependencyResult.result = Promise.resolve(null);
      result.result = Promise.resolve(null);
      node.result
          .then(() => {
            expect(listener).toHaveBeenCalledWith();
            done();
          }, done.fail);
    });

    it('should return a function that stops listening when called', done => {
      let listener = jasmine.createSpy('listener');
      let deregister = node.addChangeListener(listener);
      deregister();

      dependencyResult.result = Promise.resolve(null);
      result.result = Promise.resolve(null);
      node.result
          .then(() => {
            expect(listener).not.toHaveBeenCalled();
            done();
          }, done.fail);
    });
  });

  describe('get isDependenciesDone', () => {
    let dependency1;
    let dependency2;
    let node;

    beforeEach(() => {
      dependency1 = jasmine.createSpyObj('dependency1', ['addChangeListener']);
      dependency2 = jasmine.createSpyObj('dependency2', ['addChangeListener']);
      node = new TestNode([dependency1, dependency2], { result: Promise.resolve(null) });
    });

    it('should return true if all of the dependencies are done', () => {
      dependency1.isDone = true;
      dependency2.isDone = true;
      expect(node.isDependenciesDone).toEqual(true);
    });

    it('should return false if one of the dependencies is not done', () => {
      dependency1.isDone = false;
      dependency2.isDone = true;
      expect(node.isDependenciesDone).toEqual(false);
    });

    it('should run the handler when called', () => {
      spyOn(node, 'run_').and.callThrough();

      node.isDependenciesDone;
      expect(node.run_).toHaveBeenCalledWith();
    });
  });

  describe('isDone', () => {
    beforeEach(() => {
      dependencyResult.result = Promise.resolve(null);
      result.result = Promise.resolve(null);
    })

    it('should return true if the result has finished running', done => {
      node.result
          .then(() => {
            expect(node.isDone).toEqual(true);
            done();
          }, done.fail);
    });

    it('should return false if the result has not finished running', () => {
      node.result;
      expect(node.isDone).toEqual(false);
    });

    it('should run the handler when called', () => {
      spyOn(node, 'run_').and.callThrough();

      node.isDone;
      expect(node.run_).toHaveBeenCalledWith();
    });
  });

  describe('refresh', () => {
    it('should clear the cache and set to undone', done => {
      dependencyResult.result = Promise.resolve(null);
      result.result = Promise.resolve(null);

      node.result
          .then(() => {
            spyOn(node, 'run_').and.callThrough();
            node.refresh();

            expect(node.run_).toHaveBeenCalledWith();
            expect(node.isDone).toEqual(false);

            spyOn(node, 'runHandler_').and.returnValue(Promise.resolve('value'));

            return node.result;
          }, done.fail)
          .then(() => {
            expect(node.runHandler_).toHaveBeenCalledWith([null]);
            done();
          }, done.fail);
    });
  });

  describe('result', () => {
    it('should return the correct promise', done => {
      let dependencyValue = 'dependencyValue';
      let nodeValue = 'nodeValue';

      dependencyResult.result = dependencyValue;

      spyOn(node, 'runHandler_').and.returnValue(Promise.resolve(nodeValue));

      node.result
          .then(value => {
            expect(value).toEqual(nodeValue);
            expect(node.runHandler_).toHaveBeenCalledWith([dependencyValue]);
            expect(node.isDone).toEqual(true);
            done();
          });
    });

    it('should cache the data', done => {
      let nodeValue = 'nodeValue';

      dependencyResult.result = 'value';

      spyOn(node, 'runHandler_').and.returnValue(Promise.resolve(nodeValue));

      node.result
          .then(() => {
            node.runHandler_.calls.reset();
            return node.result;
          }, done.fail)
          .then(value => {
            expect(value).toEqual(nodeValue);
            expect(node.runHandler_).not.toHaveBeenCalled();
            done();
          }, done.fail);
    });
  });
});
