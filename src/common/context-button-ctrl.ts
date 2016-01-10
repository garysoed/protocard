export default class {
  private isOpen_: boolean;

  constructor() {
    this.isOpen_ = false;
  }

  get isOpen(): boolean {
    return this.isOpen_;
  }

  set isOpen(open: boolean) {
    this.isOpen_ = open;
  }

  onFabMouseEnter() {
    this.isOpen_ = true;
  }

  onFabMouseLeave() {
    this.isOpen_ = false;
  }
}
