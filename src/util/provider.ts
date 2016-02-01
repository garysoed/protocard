/**
 * @fileoverview Wraps a promise to provide its value.
 */
import Cache from '../decorator/cache';

export default class Provider<T> {
  private promise_: Promise<T>;
  private value_: T;

  constructor($scope: angular.IScope, promise: Promise<T>, defaultValue: T) {
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
