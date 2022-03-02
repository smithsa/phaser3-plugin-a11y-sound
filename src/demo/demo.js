import A11ySoundPlugin from "../plugin/main";
import datGuiSetup from './dat.gui.setup.js';

export default class Demo extends Phaser.Scene {

    preload() {
        this.load.scenePlugin('customPlugin', A11ySoundPlugin);
    }

    create() {
        new datGuiSetup(this.customPlugin);
    }

}
