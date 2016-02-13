export const TRACKED_DISPOSABLES = [];
export const Flags = {
  enableTracking: false
};

export default class Disposable {
  private disposables_: Disposable[];

  constructor() {
    this.disposables_ = [];
    if (Flags.enableTracking) {
      TRACKED_DISPOSABLES.push(this);
    }
  }

  addDisposable(...disposables: Disposable[]) {
    disposables.forEach(disposable => {
      this.disposables_.push(disposable);
    });
  }

  disposeInternal() { }

  dispose() {
    this.disposeInternal();
    this.disposables_.forEach(disposable => disposable.dispose());

    if (Flags.enableTracking) {
      let index = TRACKED_DISPOSABLES.indexOf(this);
      if (index >= 0) {
        TRACKED_DISPOSABLES.splice(index, 1);
      }
    }
  }
};
