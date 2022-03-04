import {registerCustomPluginComponents} from "./components/register";
import HTMLElementBuilder from "./utils/HTMLElementBuilder";

export default class SoundA11yPlugin extends Phaser.Plugins.ScenePlugin {
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
      this.game.sound.voice.setVolume(configData?.volume?.voice || 1);
    }

    //  Called when the Plugin is booted by the PluginManager.
    //  If you need to reference other systems in the Scene (like the Loader or DisplayList) then set-up those references now, not in the constructor.
    boot() {
      registerCustomPluginComponents();
      this._registerSoundChannels();
      this._buildRegistry();
      this._injectCaptionCSS();
    }

    //  Called when a Scene is destroyed by the Scene Manager. There is no coming back from a destroyed Scene, so clear up all resources here.
    destroy() {
        this.shutdown();
        this.scene = undefined;
    }

    addSound(channel, name, config={}) {
      return this.game.sound[channel].add(name, config);
    }

    stop(channel=null) {
      if(channel != null) {
        this.game.sound[channel].stopAll();

        if(channel != "music") this._removeCaptions();

      } else {
        this.game.sound.music.stopAll();
        this.game.sound.sfx.stopAll();
        this.game.sound.voice.stopAll();
        this._removeCaptions();
      }
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
        if(this.game.registry.get("captionsOn")) {
          const captionElement = this._addCaptions(marker || soundObject.key)
          this.activeCaptions.push(captionElement);
        }
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
        captionHtmlElement.element).setOrigin(.5, 1).setDepth(900);

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
        this.game.sound.sfx = Phaser.Sound.SoundManagerCreator.create(this.game)
      }

      if(this.game.sound && !this.game.sound.hasOwnProperty("voice")) {
        this.game.sound.voice = Phaser.Sound.SoundManagerCreator.create(this.game)
      }

      if(this.game.sound && !this.game.sound.hasOwnProperty("music")) {
        this.game.sound.music = Phaser.Sound.SoundManagerCreator.create(this.game)
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
