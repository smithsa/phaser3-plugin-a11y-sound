export default class OptionsModal extends HTMLElement {
  constructor() {
    super();

    this.CAPTIONS_KEY = "captionsOn";
    this.VOICE_SOUND_MANAGER_ID = "voice";
    this.MUSIC_SOUND_MANAGER_ID = "music";
    this.SFX_SOUND_MANAGER_ID = "sfx";

    this._captionToggleHandler = this._captionToggleHandler.bind(this);
    this._voiceVolumeChangeHandler = this._voiceVolumeChangeHandler.bind(this);
    this._musicVolumeChangeHandler = this._musicVolumeChangeHandler.bind(this);
    this._sfxVolumeChangeHandler = this._sfxVolumeChangeHandler.bind(this);
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._soundChannelVolumeChange = this._soundChannelVolumeChange.bind(this);
    this._removeActiveCaptions = this._removeActiveCaptions.bind(this);

    this.attachShadow({mode: "open"});

    this.shadowRoot.innerHTML = `
      <style>
        .sr-only {
          position:absolute;
          left:-10000px;
          top:auto;
          width:1px;
          height:1px;
          overflow:hidden;
         }

         .esg-modal {
            width: 600px;
            height: 630px;
            font-family: Arial, Helvetica, sans-serif;
            display: flex;
            flex-direction: column;
            align-content: start;
            --primary-color: #000000;
         }

         .esg-modal__content {
            background: #ffffff;
            border-radius: 20px;
            border: 5px solid var(--primary-color);
            padding: 60px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-content: center;
         }

         .esg-modal h2 {
            font-size: 60px;
            margin: 0 0 30px 0;
            text-align: center;
            letter-spacing: 1px;
            background-color: var(--primary-color);
            color: #ffffff;
            width: 60%;
            padding: 10px 20px;
            border-radius: 50px;
            margin: 0 auto -40px auto;
            z-index: 1000;
         }

         .esg-modal__item {
            margin-bottom: 30px;
            margin-top: 30px;
         }

         .esg-modal__close {
            cursor:pointer;
            font-size: 32px;
            max-width: 50%;
            align-self: center;
            border-radius: 10px;
            padding: 10px 30px;
            background: var(--primary-color);
            color: #fff;
            border: 5px solid var(--primary-color);
            box-shadow: none;
            letter-spacing: 1px;
            font-weight: bold;
            transition: .2s background ease-in;
         }
         .esg-modal__close:hover,
         .esg-modal__close:focus {
            background: #ffffff;
            color: var(--primary-color);
         }

         .esg-modal[aria-hidden="false"] {
            display: flex;
         }

         .esg-modal[aria-hidden="true"] {
            display: none;
         }
      </style>
      <div class="esg-modal" role="dialog"
        aria-hidden="true"
        aria-label="game options"
        aria-describedby="esg-modal__desc">
            <h2>Options</h2>
            <div class="esg-modal__content">
              <p id="esg-modal__desc" class="sr-only">Turn captioning on or off, or adjust the volume of music and voice.</p>
              <div class="esg-modal__items">
                  <div class="esg-modal__item">
                    <esg-toggle id="captions-toggle" label="Captions"></esg-toggle>
                  </div>
                  <div class="esg-modal__item">
                    <esg-slider id="voice-slider" class="esg-modal__item" label="Voice"></esg-slider>
                  </div>
                  <div class="esg-modal__item">
                    <esg-slider id="sfx-slider" class="esg-modal__item" label="SFX"></esg-slider>
                  </div>
                  <div class="esg-modal__item">
                    <esg-slider id="music-slider" class="esg-modal__item" label="Music"></esg-slider>
                  </div>
              </div>
              <button class="esg-modal__close" aria-label="close">Close</button>
            </div>
      </div>
    `;

    this.captionsToggleElement = this.shadowRoot.getElementById("captions-toggle");
    this.voiceSliderElement = this.shadowRoot.getElementById("voice-slider");
    this.musicSliderElement = this.shadowRoot.getElementById("music-slider");
    this.sfxSliderElement = this.shadowRoot.getElementById("sfx-slider");
    this.modalElement = this.shadowRoot.querySelector(".esg-modal");
    this.closeButton = this.modalElement.querySelector(".esg-modal__close");
    this.header = this.modalElement.querySelector("h2");
    this.modalContent = this.modalElement.querySelector(".esg-modal__content");
  }

  _captionToggleHandler(event) {
    if(event.detail.on === 'true') {
      window.esparkGame.registry.set(this.CAPTIONS_KEY, true);
    } else {
      this._removeActiveCaptions();
      window.esparkGame.registry.set(this.CAPTIONS_KEY, false);
    }
  }

  _changeSoundManagerVolume(event, soundManagerKey) {
    window.esparkGame.sound[soundManagerKey].volume = event.detail.value;
  }

  _voiceVolumeChangeHandler(event) {
    this._changeSoundManagerVolume(event, this.VOICE_SOUND_MANAGER_ID);
  }

  _musicVolumeChangeHandler(event) {
    this._changeSoundManagerVolume(event, this.MUSIC_SOUND_MANAGER_ID);
  }

  _sfxVolumeChangeHandler(event) {
    this._changeSoundManagerVolume(event, this.SFX_SOUND_MANAGER_ID);
  }

  _closeClickHandler(event) {
    this.open = this._getOppositeValueOfValueAttr(this.open);
    this.modalElement.setAttribute("aria-hidden", this._getOppositeValueOfValueAttr(this.open));
    let activeScenes = window.esparkGame.scene.getScenes(true);
    activeScenes.forEach((scene) => {
      scene.input.mouse.enabled = true;
    });
  }

  _getOppositeValueOfValueAttr(isOpen) {
    return isOpen === 'true' ? 'false' : 'true';
  }

  _soundChannelVolumeChange(channel, slider) {
    window.esparkGame.sound[channel].on('volume', () => {
      const delay = setTimeout(() => {
        const newVolume = window.esparkGame.sound[channel].volume;
        slider.setAttribute("value", newVolume);
        clearTimeout(delay);
      }, 2000);
    });
  }

  _removeActiveCaptions() {
    const activeCaptions = window.esparkGame.registry.get("activeCaptions");
    activeCaptions.forEach((caption) => {
      caption.remove();
    });
  }

  connectedCallback() {
    this.captionsToggleElement.addEventListener("toggle", this._captionToggleHandler);
    this.voiceSliderElement.addEventListener("volumechange", this._voiceVolumeChangeHandler);
    this.musicSliderElement.addEventListener("volumechange", this._musicVolumeChangeHandler);
    this.sfxSliderElement.addEventListener("volumechange", this._sfxVolumeChangeHandler);
    this.closeButton.addEventListener("click", this._closeClickHandler, true);
    this.modalElement.setAttribute("aria-hidden",
      this._getOppositeValueOfValueAttr(this.open));
    this.captionsToggleElement.setAttribute("toggle-on", window.esparkGame.registry.get(this.CAPTIONS_KEY));
    this._soundChannelVolumeChange(this.MUSIC_SOUND_MANAGER_ID, this.musicSliderElement);
    this._soundChannelVolumeChange(this.VOICE_SOUND_MANAGER_ID, this.voiceSliderElement);
    this._soundChannelVolumeChange(this.SFX_SOUND_MANAGER_ID, this.sfxSliderElement);
  }

  disconnectedCallback() {
    this.captionsToggleElement.removeEventListener("toggle", this._captionToggleHandler);
    this.voiceSliderElement.removeEventListener("volumechange", this._voiceVolumeChangeHandler);
    this.musicSliderElement.removeEventListener("volumechange", this._musicVolumeChangeHandler);
    this.sfxSliderElement.removeEventListener("volumechange", this._sfxVolumeChangeHandler);
  }

  static get observedAttributes() {
    return ["open", "color"];
  }

  get open() {
    return this.getAttribute("open");
  }

  set open(isOpen) {
    this.setAttribute("open", isOpen);
  }

  get color() {
    return this.getAttribute("color");
  }

  set color(color) {
    this.icon.setAttribute("color", color);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch(name) {
      case "open":
        this.modalElement.setAttribute("aria-hidden",
          this._getOppositeValueOfValueAttr(newValue));
        break;
      case "color":
        this.modalElement.style.setProperty("--primary-color", newValue);
        break;
      default:
        break;
    }
  }
}
