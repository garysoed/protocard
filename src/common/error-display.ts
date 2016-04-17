export class ErrorDisplayCtrl {
  private error_: Error;

  get error(): Error {
    return this.error_ ;
  }
  set error(error: Error) {
    this.error_ = error;
  }

  get lastError(): any {
    return this.error_.message;
  }
}

export default angular
    .module('common.ErrorDisplayModule', [])
    .component('pcErrorDisplay', {
      bindings: {
        'error': '<',
      },
      controller: ErrorDisplayCtrl,
      templateUrl: 'src/common/error-display.ng',
    });
