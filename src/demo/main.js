import Demo from './demo.js';
import SoundA11yPlugin from "../plugin/main";
import {Scale, CANVAS, Game} from "phaser";

const config = {
    type: CANVAS,
    width: 1600,
    height: 900,
    scene: [
        Demo
    ],
    parent: "game-container",
    backgroundColor: '#2c3e50',
    dom: {
      createContainer: true
    },
    scale: {
      mode: Scale.FIT,
      autoCenter: Scale.CENTER_BOTH
    },
    plugins: {
      scene: [
        { key: 'SoundA11yPlugin',
          plugin: SoundA11yPlugin,
          start: true,
          mapping: 'SoundA11yPlugin'
        }
      ]
    }
};

const game = new Game(config);
