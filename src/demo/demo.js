import captions from './captions.json';

export default class Demo extends Phaser.Scene {
  constructor() {
    super({
      key: "DEMO"
    });

    this.titleSoundObject = null;
    this.introSoundObject = null;
    this.splatSoundObject = null;
  }
    preload() {
      this.load.audio('title', './assets/title.mp3');
      this.load.audio('intro', './assets/intro.mp3');
      this.load.audio('bgmusic', './assets/music.mp3');
      this.load.audio('splat', './assets/splat.wav');
      this.SoundA11yPlugin.init({captions});
    }

    create() {
      this.titleSoundObject = this.SoundA11yPlugin.addVoiceSound('title');
      this.introSoundObject = this.SoundA11yPlugin.addVoiceSound('intro');
      this.bgMusicSoundObject = this.SoundA11yPlugin.addMusicSound('bgmusic');
      this.splatSoundObject = this.SoundA11yPlugin.addSFXSound('splat');

      this.introSoundObject.addMarker({name: "intro_start", start: 0, duration: 3});
      this.introSoundObject.addMarker({name: "intro_beakers_exploded", start: 3, duration: 2});
      this.introSoundObject.addMarker({name: "intro_slime_everywhere", start: 5, duration: 2.9});
      this.introSoundObject.addMarker({name: "intro_slime_expanding", start: 7.9, duration: 5.3});
      this.introSoundObject.addMarker({name: "intro_end", start: 13.2, duration: 2});

      this.SoundA11yPlugin.play(this.bgMusicSoundObject);

      this.add.text(100, 200, "Phaser3 Sound A11y Demo", {
        fontFamily: 'Arial',
        fontSize: 64,
        color: '#ffffff'
      });

      new Button(800, 400, 'Play sound object on voice channel, no markers', this, () => {
        this.SoundA11yPlugin.play(this.titleSoundObject)
      });

      new Button(800, 500, 'Play sound object on voice channel, with markers', this, () => {
        this.SoundA11yPlugin.play(this.introSoundObject)
      });

      new Button(800, 600, 'Play sound object on sfx channel', this, () => {
        this.SoundA11yPlugin.play(this.splatSoundObject)
      });

      new Button(800, 700, 'Stop all sound', this, () => {
        this.SoundA11yPlugin.stopAll();
      });
    }

}

class Button {
  constructor(x, y, label, scene, callback) {
    const button = scene.add.text(x, y, label)
      .setOrigin(0.5)
      .setPadding(10)
      .setDepth(-1)
      .setStyle({ backgroundColor: '#218c74', fontSize: "38px" })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => callback())
      .on('pointerover', () => button.setStyle({ backgroundColor: "#fff", fill: "#218c74" }))
      .on('pointerout', () => button.setStyle({ backgroundColor: "#218c74", fill: '#FFF' }));
  }
}
