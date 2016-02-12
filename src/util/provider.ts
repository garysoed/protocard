/**
 * @fileoverview Wraps a promise to provide its value.
 */
import Cache from '../decorator/cache';
import Disposable from '../util/disposable';


export default class Provider<T> extends Disposable {
  private promise_: Promise<T>;
  private value_: T;

  constructor($scope: angular.IScope, promise: Promise<T>, defaultValue: T) {
    super();
    this.value_ = defaultValue;
    this.promise_ = promise
        .then(result => {
          this.value_ = result;
          Cache.clear(this);
          $scope.$apply(() => {});
          return result;
        });
  }

  get promise(): Promise<T> {
    return this.promise_;
  }

  @Cache
  get value(): T {
    return this.value_;
  }
}
