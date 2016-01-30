export enum Origin {
  CUSTOM,
  GAME_CRAFTER
}

export default class Preset {
  private description_: string;
  private height_: number;
  private origin_: Origin;
  private width_: number;

  constructor(origin: Origin, description: string, width: number, height: number) {
    this.description_ = description;
    this.height_ = height;
    this.origin_ = origin;
    this.width_ = width;
  }

  get height(): number {
    return this.height_;
  }

  get width(): number {
    return this.width_;
  }

  get fullDescription(): string {
    let originString;
    switch (this.origin_) {
      case Origin.CUSTOM:
        return 'Custom';
      case Origin.GAME_CRAFTER:
        originString = 'The Game Crafter';
        break;
    }

    return `${originString} ${this.description_} (${this.width_} × ${this.height_})`;
  }
}
