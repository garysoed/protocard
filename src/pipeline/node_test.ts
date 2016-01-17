import TestBase from '../testbase';
TestBase.init();

import Node from './node';


class TestNode extends Node<string> {
  result_: {result: Promise<string>};

  constructor(dependencies: Node<string>[], result: {result: Promise<string>}) {
    super(dependencies);
    this.result_ = result;
  }

  runHandler(dependencyResults: any[]): Promise<string> {
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
  });

  describe('refresh', () => {
    it('should clear the cache and set to undone', done => {
      dependencyResult.result = Promise.resolve(null);
      result.result = Promise.resolve(null);

      node.result
          .then(() => {
            node.refresh();
            expect(node.isDone).toEqual(false);

            spyOn(node, 'runHandler').and.returnValue(Promise.resolve('value'));

            return node.result;
          }, done.fail)
          .then(() => {
            expect(node.runHandler).toHaveBeenCalledWith([null]);
            done();
          }, done.fail);
    });
  });

  describe('result', () => {
    it('should return the correct promise', done => {
      let dependencyValue = 'dependencyValue';
      let nodeValue = 'nodeValue';

      dependencyResult.result = dependencyValue;

      spyOn(node, 'runHandler').and.returnValue(Promise.resolve(nodeValue));

      node.result
          .then(value => {
            expect(value).toEqual(nodeValue);
            expect(node.runHandler).toHaveBeenCalledWith([dependencyValue]);
            expect(node.isDone).toEqual(true);
            done();
          });
    });

    it('should cache the data', done => {
      let nodeValue = 'nodeValue';

      dependencyResult.result = 'value';

      spyOn(node, 'runHandler').and.returnValue(Promise.resolve(nodeValue));

      node.result
          .then(() => {
            node.runHandler.calls.reset();
            return node.result;
          }, done.fail)
          .then(value => {
            expect(value).toEqual(nodeValue);
            expect(node.runHandler).not.toHaveBeenCalled();
            done();
          }, done.fail);
    });
  });
});
