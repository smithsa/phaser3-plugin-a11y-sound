import {registerCustomPluginComponents} from "./components/register";
import HTMLElementBuilder from "./utils/HTMLElementBuilder";
import {Sound, Plugins, Game} from "phaser";

export default class SoundA11yPlugin extends Plugins.ScenePlugin {
    constructor(scene, pluginManager) {
        super(scene, pluginManager);
        this.scene = scene;
        this.captions = {};
        this.activeCaptions = [];
        this.captionBottomOffset = 80;
        this.defaultModalX = 500;
        this.defaultModalY = 100;
    }

    init(configData={}) {
      const modalX = configData.modalX || 500;
      const modalY = configData.modalY || 100;
      const primaryColor = configData.primaryColor || "#0d68c2";
      this._addOptionsUIElements(modalX, modalY, primaryColor);
      this.captions = configData.captions || {};
      this.game.sound.music.setVolume(configData?.volume?.music || .2);
      this.game.sound.sfx.setVolume(configData?.volume?.sfx || .5);
      this.game.sound.voice.setVolume(configData?.volume?.voice || .5);
    }

    //  Called when the Plugin is booted by the PluginManager.
    //  If you need to reference other systems in the Scene (like the Loader or DisplayList) then set-up those references now, not in the constructor.
    boot() {
      registerCustomPluginComponents();
      this._registerSoundChannels();
      this._buildRegistry();
      this._injectCaptionCSS();
      /*
          List of unused eventEmitters to activate matching methods of this plugin
      */

     // eventEmitter.on('start', this.start, this);

      //eventEmitter.on('preupdate', this.preUpdate, this);
      //eventEmitter.on('postupdate', this.postUpdate, this);

      //eventEmitter.on('pause', this.pause, this);
      //eventEmitter.on('resume', this.resume, this);

      //eventEmitter.on('sleep', this.sleep, this);
      //eventEmitter.on('wake', this.wake, this);

      //eventEmitter.on('shutdown', this.shutdown, this);
      // eventEmitter.on('start', this.install, this);
    }

    //  Called when a Scene is started by the SceneManager. The Scene is now active, visible and running.
    start() {

    }

    //  Called every Scene step - phase 1
    preUpdate(time, delta) {}

    //  Called every Scene step - phase 2
    update(time, delta) {}

    //  Called every Scene step - phase 3
    postUpdate(time, delta) {}

    //  Called when a Scene is paused. A paused scene doesn't have its Step run, but still renders.
    pause() {}

    //  Called when a Scene is resumed from a paused state.
    resume() {}

    //  Called when a Scene is put to sleep. A sleeping scene doesn't update or render, but isn't destroyed or shutdown. preUpdate events still fire.
    sleep() {}

    //  Called when a Scene is woken from a sleeping state.
    wake() {}

    //  Called when a Scene shuts down, it may then come back again later (which will invoke the 'start' event) but should be considered dormant.
    shutdown() {}

    //  Called when a Scene is destroyed by the Scene Manager. There is no coming back from a destroyed Scene, so clear up all resources here.
    destroy() {
        this.shutdown();
        this.scene = undefined;
    }

    addVoiceSound(name) {
      return this.game.sound.voice.add(name);
    }

    addSFXSound(name) {
      return this.game.sound.sfx.add(name);
    }

    addMusicSound(name) {
      return this.game.sound.music.add(name);
    }

    stopVoice() {
      this.game.sound.voice.stopAll();
    }

    stopSFX() {
      this.game.sound.sfx.stopAll();
    }

    stopMusic() {
      this.game.sound.music.stopAll();
    }

    stopAll() {
      this.stopMusic();
      this.stopSFX();
      this.stopVoice();
      this._removeCaptions();
    }

    play(soundObject, marker=null, config={}) {
      return new Promise(function(resolve, reject) {
        try {
          if(this.game.registry.get("captionsOn")) {
            this._playCaptionedSound(soundObject, marker, config).then(() => {
              resolve(soundObject);
            }).catch((error) => {
              reject(error)
            });
          } else{
            this._playSound(soundObject, marker, config).then(() => {
              resolve(soundObject);
            }).catch((error) => {
              reject(error)
            });
          }
        } catch (error) {
          reject(error);
        }
      }.bind(this));
    }

    _playSound(soundObject, marker, config) {
      soundObject.manager.stopAll();
      return new Promise(function(resolve, reject) {
        try {
          let sound;
          if (marker) {
            soundObject.play(marker, config);
          } else {
            soundObject.play(config);
          }

          soundObject.on("complete", () => resolve(sound));
        } catch (error) {
          reject( error);
        }
      });
    }

    _playCaptionedSound(soundObject, marker=null, config={}) {
      return new Promise(function (resolve, reject) {
      try {
        const markers = Object.keys(soundObject.markers);
        if(markers.length === 0) {
          this._startCaptionedAudio(soundObject, marker, config);

          soundObject.on('complete', (function() {
            this._removeCaptions();
            soundObject.removeAllListeners();
            resolve(soundObject);
          }).bind(this));

          return soundObject;
        }

        // setting up the generator to play subsequent markers after the
        // sound object has completed playing.
        const soundMarkerGenerator = this._SoundMarkerIterator(markers);
        soundObject.on("complete", () => {
          const currentMarker = soundMarkerGenerator.next();
          if (currentMarker.done) {
            this._removeCaptions();
            soundObject.removeAllListeners();
            resolve(soundObject);
          } else {
            this._startCaptionedAudio(soundObject, currentMarker.value, config);
          }
        });

        this._startCaptionedAudio(soundObject, markers[0], config);
      } catch(error) {
        reject(error);
      }
    }.bind(this));
    }

    _startCaptionedAudio(soundObject, marker=null, config={}) {
      this._removeCaptions();

      soundObject.on('play', (function() {
        const captionElement = this._addCaptions(marker || soundObject.key)
        this.activeCaptions.push(captionElement);
      }).bind(this));


      this._playSound(soundObject, marker, config);

      return soundObject;
    }

    _removeCaptions() {
      this.activeCaptions.forEach((caption) => {
        caption.remove();
      });
    }

    _addCaptions(captionKey) {
      this._removeCaptions();
      const captionHtmlElement = new HTMLElementBuilder("div");
      captionHtmlElement.addClasses("captions");
      if(captionKey in this.captions) {
        captionHtmlElement.appendElements(this._createCaptionCueElement(this.captions[captionKey]));
      } else {
        console.warn(`caption key: ${captionKey} was not found in captions`);
      }

      this.scene.add.dom(this.game.config.width/2, this.game.config.height-this.captionBottomOffset,
        captionHtmlElement.element).setOrigin(.5, 1);

      return captionHtmlElement.element;
    }

    _createCaptionCueElement(cueText) {
      const captionCueElement = new HTMLElementBuilder("p", cueText);
      captionCueElement.addClasses("cue");

      return captionCueElement.element;
    }

    * _SoundMarkerIterator(markers) {
      for(let i=1; i < markers.length; i++) {
        yield markers[i];
      }

      return;
    }

    _buildRegistry() {
      if(!window.hasOwnProperty("esparkGame")) {
        window.esparkGame = this.game;
        window.esparkGame.registry.set({
          backgroundMusicOn: true,
          captionsOn: true
        });
      }
    }

    _registerSoundChannels () {
      if(this.game.sound && !this.game.sound.hasOwnProperty("sfx")) {
        this.game.sound.sfx = Sound.SoundManagerCreator.create(this.game)
      }

      if(this.game.sound && !this.game.sound.hasOwnProperty("voice")) {
        this.game.sound.voice = Sound.SoundManagerCreator.create(this.game)
      }

      if(this.game.sound && !this.game.sound.hasOwnProperty("music")) {
        this.game.sound.music = Sound.SoundManagerCreator.create(this.game)
      }
    }

    _addOptionsUIElements(modalX, modalY, primaryColor) {
      const optionsModalBuilder = new HTMLElementBuilder("options-modal")
        .addAttributes({"open": false, "id": "options-modal", "color": primaryColor});

      this.scene.add.dom(modalX, modalY, optionsModalBuilder.element).setDepth(1000);

      const optionsButtonBuilder = new HTMLElementBuilder("options-button")
        .addAttributes({"modal-id": "options-modal", color: primaryColor});
      this.scene.add.dom(this.game.config.width - 100, 100, optionsButtonBuilder.element).setDepth(1000);
    }

    _injectCaptionCSS() {
      if(!window.esparkGame.hasOwnProperty("cssInjected")) {
        const cssStyles = `
        .captions {
            z-index: 100;
            max-width: 75%;
          }

        .captions .cue {
            color: white;
            font-size: 48px;
            background: rgba(0,0,0, .8);
            padding:5px 10px;
            width: fit-content;
            margin: 0 auto;
            text-align: center;
            font-family: Arial, Helvetica, sans-serif;
          }
        `;
        const css = document.createElement("style");
        css.textContent = cssStyles;
        document.body.appendChild(css);
        window.esparkGame.cssInjected = true;
      }
    }
}
