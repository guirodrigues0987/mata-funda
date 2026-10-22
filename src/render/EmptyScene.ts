import Phaser from "phaser";
import { PALETTE } from "../data/palette";

export class EmptyScene extends Phaser.Scene {
  constructor() {
    super("empty");
  }

  create(): void {
    this.cameras.main.setBackgroundColor(PALETTE.noite);
  }
}
