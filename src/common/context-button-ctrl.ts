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

  onFabMouseEnter(): void {
    this.isOpen_ = true;
  }

  onFabMouseLeave(): void {
    this.isOpen_ = false;
  }
}
