!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("SoundA11yPlugin",[],t):"object"==typeof exports?exports.SoundA11yPlugin=t():e.SoundA11yPlugin=t()}(self,(function(){return function(){"use strict";var e={d:function(t,n){for(var s in n)e.o(n,s)&&!e.o(t,s)&&Object.defineProperty(t,s,{enumerable:!0,get:n[s]})},o:function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r:function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};e.r(t),e.d(t,{default:function(){return l}});class n extends HTMLElement{constructor(){super(),this.CAPTIONS_KEY="captionsOn",this.VOICE_SOUND_MANAGER_ID="voice",this.MUSIC_SOUND_MANAGER_ID="music",this.SFX_SOUND_MANAGER_ID="sfx",this._captionToggleHandler=this._captionToggleHandler.bind(this),this._voiceVolumeChangeHandler=this._voiceVolumeChangeHandler.bind(this),this._musicVolumeChangeHandler=this._musicVolumeChangeHandler.bind(this),this._sfxVolumeChangeHandler=this._sfxVolumeChangeHandler.bind(this),this._closeClickHandler=this._closeClickHandler.bind(this),this._soundChannelVolumeChange=this._soundChannelVolumeChange.bind(this),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML='\n      <style>\n        .sr-only {\n          position:absolute;\n          left:-10000px;\n          top:auto;\n          width:1px;\n          height:1px;\n          overflow:hidden;\n         }\n\n         .esg-modal {\n            width: 600px;\n            height: 630px;\n            font-family: Arial, Helvetica, sans-serif;\n            display: flex;\n            flex-direction: column;\n            align-content: start;\n            --primary-color: #000000;\n         }\n\n         .esg-modal__content {\n            background: #ffffff;\n            border-radius: 20px;\n            border: 5px solid var(--primary-color);\n            padding: 60px;\n            display: flex;\n            flex-direction: column;\n            justify-content: space-between;\n            align-content: center;\n         }\n\n         .esg-modal h2 {\n            font-size: 60px;\n            margin: 0 0 30px 0;\n            text-align: center;\n            letter-spacing: 1px;\n            background-color: var(--primary-color);\n            color: #ffffff;\n            width: 60%;\n            padding: 10px 20px;\n            border-radius: 50px;\n            margin: 0 auto -40px auto;\n            z-index: 1000;\n         }\n\n         .esg-modal__item {\n            margin-bottom: 30px;\n            margin-top: 30px;\n         }\n\n         .esg-modal__close {\n            cursor:pointer;\n            font-size: 32px;\n            max-width: 50%;\n            align-self: center;\n            border-radius: 10px;\n            padding: 10px 30px;\n            background: var(--primary-color);\n            color: #fff;\n            border: 5px solid var(--primary-color);\n            box-shadow: none;\n            letter-spacing: 1px;\n            font-weight: bold;\n            transition: .2s background ease-in;\n         }\n         .esg-modal__close:hover,\n         .esg-modal__close:focus {\n            background: #ffffff;\n            color: var(--primary-color);\n         }\n\n         .esg-modal[aria-hidden="false"] {\n            display: flex;\n         }\n\n         .esg-modal[aria-hidden="true"] {\n            display: none;\n         }\n      </style>\n      <div class="esg-modal" role="dialog"\n        aria-hidden="true"\n        aria-label="game options"\n        aria-describedby="esg-modal__desc">\n            <h2>Options</h2>\n            <div class="esg-modal__content">\n              <p id="esg-modal__desc" class="sr-only">Turn captioning on or off, or adjust the volume of music and voice.</p>\n              <div class="esg-modal__items">\n                  <div class="esg-modal__item">\n                    <esg-toggle id="captions-toggle" label="Captions"></esg-toggle>\n                  </div>\n                  <div class="esg-modal__item">\n                    <esg-slider id="voice-slider" class="esg-modal__item" label="Voice"></esg-slider>\n                  </div>\n                  <div class="esg-modal__item">\n                    <esg-slider id="sfx-slider" class="esg-modal__item" label="SFX"></esg-slider>\n                  </div>\n                  <div class="esg-modal__item">\n                    <esg-slider id="music-slider" class="esg-modal__item" label="Music"></esg-slider>\n                  </div>\n              </div>\n              <button class="esg-modal__close" aria-label="close">Close</button>\n            </div>\n      </div>\n    ',this.captionsToggleElement=this.shadowRoot.getElementById("captions-toggle"),this.voiceSliderElement=this.shadowRoot.getElementById("voice-slider"),this.musicSliderElement=this.shadowRoot.getElementById("music-slider"),this.sfxSliderElement=this.shadowRoot.getElementById("sfx-slider"),this.modalElement=this.shadowRoot.querySelector(".esg-modal"),this.closeButton=this.modalElement.querySelector(".esg-modal__close"),this.header=this.modalElement.querySelector("h2"),this.modalContent=this.modalElement.querySelector(".esg-modal__content")}_captionToggleHandler(e){"true"===e.detail.on?window.esparkGame.registry.set(this.CAPTIONS_KEY,!0):window.esparkGame.registry.set(this.CAPTIONS_KEY,!1)}_changeSoundManagerVolume(e,t){window.esparkGame.sound[t].volume=e.detail.value}_voiceVolumeChangeHandler(e){this._changeSoundManagerVolume(e,this.VOICE_SOUND_MANAGER_ID)}_musicVolumeChangeHandler(e){this._changeSoundManagerVolume(e,this.MUSIC_SOUND_MANAGER_ID)}_sfxVolumeChangeHandler(e){this._changeSoundManagerVolume(e,this.SFX_SOUND_MANAGER_ID)}_closeClickHandler(e){this.open=this._getOppositeValueOfValueAttr(this.open),this.modalElement.setAttribute("aria-hidden",this._getOppositeValueOfValueAttr(this.open)),window.esparkGame.scene.getScenes(!0).forEach((e=>{e.input.mouse.enabled=!0}))}_getOppositeValueOfValueAttr(e){return"true"===e?"false":"true"}_soundChannelVolumeChange(e,t){window.esparkGame.sound[e].on("volume",(()=>{const n=setTimeout((()=>{const s=window.esparkGame.sound[e].volume;t.setAttribute("value",s),clearTimeout(n)}),1e3)}))}connectedCallback(){this.captionsToggleElement.addEventListener("toggle",this._captionToggleHandler),this.voiceSliderElement.addEventListener("volumechange",this._voiceVolumeChangeHandler),this.musicSliderElement.addEventListener("volumechange",this._musicVolumeChangeHandler),this.sfxSliderElement.addEventListener("volumechange",this._sfxVolumeChangeHandler),this.closeButton.addEventListener("click",this._closeClickHandler,!0),this.modalElement.setAttribute("aria-hidden",this._getOppositeValueOfValueAttr(this.open)),this.captionsToggleElement.setAttribute("toggle-on",window.esparkGame.registry.get(this.CAPTIONS_KEY)),this._soundChannelVolumeChange(this.MUSIC_SOUND_MANAGER_ID,this.musicSliderElement),this._soundChannelVolumeChange(this.VOICE_SOUND_MANAGER_ID,this.voiceSliderElement),this._soundChannelVolumeChange(this.SFX_SOUND_MANAGER_ID,this.sfxSliderElement)}disconnectedCallback(){this.captionsToggleElement.removeEventListener("toggle",this._captionToggleHandler),this.voiceSliderElement.removeEventListener("volumechange",this._voiceVolumeChangeHandler),this.musicSliderElement.removeEventListener("volumechange",this._musicVolumeChangeHandler),this.sfxSliderElement.removeEventListener("volumechange",this._sfxVolumeChangeHandler)}static get observedAttributes(){return["open","color"]}get open(){return this.getAttribute("open")}set open(e){this.setAttribute("open",e)}get color(){return this.getAttribute("color")}set color(e){this.icon.setAttribute("color",e)}attributeChangedCallback(e,t,n){switch(e){case"open":this.modalElement.setAttribute("aria-hidden",this._getOppositeValueOfValueAttr(n));break;case"color":this.modalElement.style.setProperty("--primary-color",n)}}}class s extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML='\n      <style>\n        button {\n            --button-primary-color: "darkgray";\n            --button-size: 90px;\n            font-size: 90px;\n            font-weight: bold;\n            cursor: pointer;\n            background: #ffffff;\n            width: var(--button-size);\n            height: var(--button-size);\n            line-height: 87px;\n            border-radius: 50%;\n            border-width: 1px;\n            border-color: rgba(0, 0, 0, .55);\n            justify-content: center;\n            align-content: center;\n            transition: .1s background-color ease-in-out;\n        }\n\n        svg {\n            fill: var(--button-primary-color);\n            transition: .1s fill ease-in-out;\n        }\n\n        button:hover {\n            background-color: var(--button-primary-color);\n        }\n\n        button:hover svg{\n            fill: #ffffff;\n        }\n      </style>\n      <button aria-label="Game Options">\n        <svg fill="#000000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="65px" height="65px">    <path d="M47.16,21.221l-5.91-0.966c-0.346-1.186-0.819-2.326-1.411-3.405l3.45-4.917c0.279-0.397,0.231-0.938-0.112-1.282 l-3.889-3.887c-0.347-0.346-0.893-0.391-1.291-0.104l-4.843,3.481c-1.089-0.602-2.239-1.08-3.432-1.427l-1.031-5.886 C28.607,2.35,28.192,2,27.706,2h-5.5c-0.49,0-0.908,0.355-0.987,0.839l-0.956,5.854c-1.2,0.345-2.352,0.818-3.437,1.412l-4.83-3.45 c-0.399-0.285-0.942-0.239-1.289,0.106L6.82,10.648c-0.343,0.343-0.391,0.883-0.112,1.28l3.399,4.863 c-0.605,1.095-1.087,2.254-1.438,3.46l-5.831,0.971c-0.482,0.08-0.836,0.498-0.836,0.986v5.5c0,0.485,0.348,0.9,0.825,0.985 l5.831,1.034c0.349,1.203,0.831,2.362,1.438,3.46l-3.441,4.813c-0.284,0.397-0.239,0.942,0.106,1.289l3.888,3.891 c0.343,0.343,0.884,0.391,1.281,0.112l4.87-3.411c1.093,0.601,2.248,1.078,3.445,1.424l0.976,5.861C21.3,47.647,21.717,48,22.206,48 h5.5c0.485,0,0.9-0.348,0.984-0.825l1.045-5.89c1.199-0.353,2.348-0.833,3.43-1.435l4.905,3.441 c0.398,0.281,0.938,0.232,1.282-0.111l3.888-3.891c0.346-0.347,0.391-0.894,0.104-1.292l-3.498-4.857 c0.593-1.08,1.064-2.222,1.407-3.408l5.918-1.039c0.479-0.084,0.827-0.5,0.827-0.985v-5.5C47.999,21.718,47.644,21.3,47.16,21.221z M25,32c-3.866,0-7-3.134-7-7c0-3.866,3.134-7,7-7s7,3.134,7,7C32,28.866,28.866,32,25,32z"/></svg>\n      </button>\n    ',this._handleOnClick=this._handleOnClick.bind(this),this.buttonElement=this.shadowRoot.querySelector("button"),this.icon=this.buttonElement.querySelector("svg"),this.modal=null}_handleOnClick(){if(null==this.modal)return void console.warn("Unable to find specified options modal.");this.modal.setAttribute("open",!0),this.modal.focus(),window.esparkGame.scene.getScenes(!0).forEach((e=>{e.input.mouse.enabled=!1}))}connectedCallback(){this.modal=document.getElementById(this.modalId),this.buttonElement.addEventListener("click",this._handleOnClick)}disconnectedCallback(){this.buttonElement.removeEventListener("click",this._handleOnClick)}get modalId(){return this.getAttribute("modal-id")}set modalId(e){this.setAttribute("modal-id",e)}get color(){return this.getAttribute("modal-id")}set color(e){this.icon.setAttribute("modal-id",e)}static get observedAttributes(){return["modal-id","color"]}attributeChangedCallback(e,t,n){switch(e){case"modal-id":this.modal=document.getElementById(n);break;case"color":this.buttonElement.style.setProperty("--button-primary-color",n)}}}class i extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML=`\n      <style>\n        button {\n            cursor: pointer;\n            background: #fff;\n            box-shadow: none;\n            border:none;\n            font-size: 36px;\n            padding: 0;\n            letter-spacing: 2px;\n            border: 3px solid #555555;\n            border-radius: 30px;\n            overflow: hidden;\n        }\n        .esg-toggle-state {\n            padding: 8px 15px;\n        }\n\n        button span.on{\n            color: #555555;\n        }\n\n        button span.off{\n            background: #555555;\n            color: #fff;\n        }\n\n        button[aria-pressed="true"] {\n            border-color: var(--primary-color);\n        }\n\n        button[aria-pressed="true"] span.off {\n            background: none;\n            color: #555555;\n            opacity: 1;\n        }\n        button[aria-pressed="true"] span.on{\n            background: var(--primary-color);\n            color: #fff;\n        }\n        .es-label {\n          width: 210px;\n          font-size: 32px;\n          display: inline-block;\n          letter-spacing: 1px;\n        }\n      </style>\n      <div class="esg-toggle esg-component">\n        <span class="es-label">${this.label}</span>\n        <button type="button" role="switch" aria-label="${this.label}" id="${this.id}">\n            <span class="esg-toggle-state on">On</span><span class="esg-toggle-state off">Off</span>\n        </button>\n      </div>\n    `,this.shadowtoggleButton=this.shadowRoot.querySelector("button"),this.shadowtoggleButtonLabel=this.shadowRoot.querySelector(".es-label"),this.handleToggle=this.handleToggle.bind(this),this.toggleEvent=new CustomEvent("toggle",{detail:{on:this.toggleOn}})}handleToggle(){this.shadowtoggleButton.toggleAttribute("aria-pressed"),this.toggleOn="true"!==this.toggleOn.toLowerCase(),this.toggleEvent.detail.on=this.toggleOn,this.dispatchEvent(this.toggleEvent)}connectedCallback(){this.shadowtoggleButton.addEventListener("click",this.handleToggle)}disconnectedCallback(){this.shadowtoggleButton.removeEventListener("click",this.handleToggle)}static get observedAttributes(){return["id","label","toggle-on"]}get id(){return this.getAttribute("id")}get label(){return this.getAttribute("label")}get toggleOn(){return this.getAttribute("toggle-on")}set id(e){this.setAttribute("id",e)}set label(e){this.setAttribute("label",e)}set toggleOn(e){this.setAttribute("toggle-on",e)}attributeChangedCallback(e,t,n){switch(e){case"label":this.shadowtoggleButtonLabel.innerHTML=n,this.shadowtoggleButton.setAttribute("aria-label",n);break;case"id":this.shadowtoggleButton.id=n;break;case"toggle-on":this.shadowtoggleButton.setAttribute("aria-pressed",n)}}}class o extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML=`\n      <style>\n        .esg-slider {\n            display: flex;\n            justify-content: space-between;\n            align-content: center;\n        }\n\n        .esg-slider__input {\n            flex-grow: 1;\n            cursor: pointer;\n            height: 25px;\n        }\n\n        .esg-slider__input::-moz-range-thumb,\n        .esg-slider__input::-webkit-slider-thumb {\n            -webkit-appearance: none;\n            appearance: none;\n            width: 25px;\n            height: 25px;\n            background: var(--primary-color);\n            cursor: pointer;\n        }\n\n        label {\n          display: inline-block;\n          font-size: 32px;\n          width: 210px;\n          letter-spacing: 1px;\n        }\n\n        input[type=range] {\n          height: 34px;\n          -webkit-appearance: none;\n          margin: 10px 0;\n          background: none;\n        }\n\n        input[type=range]::-webkit-slider-runnable-track {\n          width: 100%;\n          height: 15px;\n          cursor: pointer;\n          animate: 0.2s;\n          background: var(--primary-color);\n          border-radius: 25px;\n        }\n\n        input[type=range]::-webkit-slider-thumb {\n          box-shadow: 1px 1px 1px #000031;\n          border: 1px solid rgba(0,0,0, .9);\n          height: 38px;\n          width: 38px;\n          border-radius: 50%;\n          background: #FFFFFF;\n          cursor: pointer;\n          -webkit-appearance: none;\n          margin-top: -13px;\n        }\n        input[type=range]:focus::-webkit-slider-runnable-track {\n          background: var(--primary-color);\n        }\n        input[type=range]::-moz-range-track {\n          width: 100%;\n          height: 11px;\n          cursor: pointer;\n          animate: 0.2s;\n          box-shadow: 1px 1px 1px #000000;\n          background: #0f4863;\n          border: 0px solid #010101;\n        }\n        input[type=range]::-moz-range-thumb {\n          box-shadow: 1px 1px 1px #000031;\n          border: 1px solid rgba(0,0,0, .9);\n          height: 38px;\n          width: 38px;\n          border-radius: 50%;\n          background: #FFFFFF;\n          cursor: pointer;\n          -webkit-appearance: none;\n          margin-top: -13px;\n        }\n      </style>\n      <div class="esg-slider esg-element">\n        <label for="${this.id}">${this.label}</label>\n        <input type="range" step="0.1" min="0" max="1" value="${this.value}" id="${this.id}" class="esg-slider__input">\n      </div>\n    `,this.labelElement=this.shadowRoot.querySelector(".esg-slider label"),this.inputElement=this.shadowRoot.querySelector(".esg-slider input"),this.handleChange=this.handleChange.bind(this),this.volumeChangeEvent=new CustomEvent("volumechange",{detail:{value:this.value}})}handleChange(){this.value=this.inputElement.value,this.volumeChangeEvent.detail.value=this.inputElement.value,this.dispatchEvent(this.volumeChangeEvent)}connectedCallback(){this.inputElement.addEventListener("change",this.handleChange)}disconnectedCallback(){this.inputElement.removeEventListener("change",this.handleChange)}static get observedAttributes(){return["id","label","value"]}get id(){return this.getAttribute("id")}get label(){return this.getAttribute("label")}get value(){return this.getAttribute("value")}set id(e){this.setAttribute("id",e)}set label(e){this.setAttribute("label",e)}set value(e){this.setAttribute("value",e)}attributeChangedCallback(e,t,n){switch(e){case"label":this.labelElement.textContent=n;break;case"id":this.labelElement.setAttribute("for",n),this.inputElement.id=n;break;case"value":this.inputElement.setAttribute("value",n)}}}class a{constructor(e,t=""){return this.element=document.createElement(e),this.element.textContent=t,this}addAttributes(e={}){if(!e||e.constructor!==Object)return new Error('Parameter for addAriaAttributes should be an object. Example: {aria-label: "Play"');for(let t in e){let n=e[t];this.element.setAttribute(t,n)}return this}addClasses(...e){return e.forEach((e=>{this.element.classList.add(e)})),this}appendElements(e){return[].concat(e||[]).forEach((e=>{this.element.appendChild(e)})),this}setInnerHtml(e){return this.element.innerHTML=e,this}}class l extends Phaser.Plugins.ScenePlugin{constructor(e,t){super(e,t),this.scene=e,this.captionBottomOffset=80,this.defaultModalX=500,this.defaultModalY=100}init(e={}){const t=e.modalX||500,n=e.modalY||100,s=e.primaryColor||"#0d68c2";this._addOptionsUIElements(t,n,s);const i=e.captionsOn||!1,o=e.captions||{};this.game.registry.set("captions",o),this.game.registry.set("activeCaptions",[]),this.game.registry.set("captionsOn",i),this.game.sound.music.setVolume(e?.volume?.music||.2),this.game.sound.sfx.setVolume(e?.volume?.sfx||.5),this.game.sound.voice.setVolume(e?.volume?.voice||1)}boot(){customElements.get("options-button")||customElements.define("options-button",s),customElements.get("options-modal")||customElements.define("options-modal",n),customElements.get("esg-slider")||customElements.define("esg-slider",o),customElements.get("esg-toggle")||customElements.define("esg-toggle",i),this._registerSoundChannels(),this._buildRegistry(),this._injectCaptionCSS()}destroy(){this.shutdown(),this.scene=void 0}add(e,t,n={}){return this.game.sound[e].add(t,n)}stop(e=null){null!=e?(this.game.sound[e].stopAll(),"music"!=e&&this._removeCaptions()):(this.game.sound.music.stopAll(),this.game.sound.sfx.stopAll(),this.game.sound.voice.stopAll(),this._removeCaptions())}play(e,t=null,n={}){return new Promise(function(s,i){try{this.game.registry.get("captionsOn")?this._playCaptionedSound(e,t,n).then((()=>{s(e)})).catch((e=>{i(e)})):this._playSound(e,t,n).then((()=>{s(e)})).catch((e=>{i(e)}))}catch(e){i(e)}}.bind(this))}_playSound(e,t,n){return e.manager.stopAll(),new Promise((function(s,i){try{let i;t?e.play(t,n):e.play(n),e.on("complete",(()=>s(i)))}catch(e){i(e)}}))}_playCaptionedSound(e,t=null,n={}){return new Promise(function(s,i){try{const i=Object.keys(e.markers);if(0===i.length)return this._startCaptionedAudio(e,t,n),e.on("complete",function(){this._removeCaptions(),e.removeAllListeners(),s(e)}.bind(this)),e;const o=this._SoundMarkerIterator(i);e.on("complete",(()=>{const t=o.next();t.done?(this._removeCaptions(),e.removeAllListeners(),s(e)):this._startCaptionedAudio(e,t.value,n)})),this._startCaptionedAudio(e,i[0],n)}catch(e){i(e)}}.bind(this))}_startCaptionedAudio(e,t=null,n={}){return this._removeCaptions(),e.on("play",function(){if(this.game.registry.get("captionsOn")){const n=this._addCaptions(t||e.key);let s=this.game.registry.get("activeCaptions");s.push(n),this.game.registry.set("activeCaptions",s)}}.bind(this)),this._playSound(e,t,n),e}_removeCaptions(){this.game.registry.get("activeCaptions").forEach((e=>{e.remove()}))}_addCaptions(e){this._removeCaptions();const t=new a("div");t.addClasses("captions");const n=this.game.registry.get("captions");return e in n?t.appendElements(this._createCaptionCueElement(n[e])):console.warn(`caption key: ${e} was not found in captions`),this.scene.add.dom(this.game.config.width/2,this.game.config.height-this.captionBottomOffset,t.element).setOrigin(.5,1).setDepth(900),t.element}_createCaptionCueElement(e){const t=new a("p",e);return t.addClasses("cue"),t.element}*_SoundMarkerIterator(e){for(let t=1;t<e.length;t++)yield e[t]}_buildRegistry(){window.hasOwnProperty("esparkGame")||(this.game.registry.set({backgroundMusicOn:!0,captionsOn:!0,cssInjected:!1,captions:{},activeCaptions:[]}),window.esparkGame=this.game)}_registerSoundChannels(){this.game.sound&&!this.game.sound.hasOwnProperty("sfx")&&(this.game.sound.sfx=Phaser.Sound.SoundManagerCreator.create(this.game)),this.game.sound&&!this.game.sound.hasOwnProperty("voice")&&(this.game.sound.voice=Phaser.Sound.SoundManagerCreator.create(this.game)),this.game.sound&&!this.game.sound.hasOwnProperty("music")&&(this.game.sound.music=Phaser.Sound.SoundManagerCreator.create(this.game))}_addOptionsUIElements(e,t,n){const s=new a("options-modal").addAttributes({open:!1,id:"options-modal",color:n});this.scene.add.dom(e,t,s.element).setDepth(1e3);const i=new a("options-button").addAttributes({"modal-id":"options-modal",color:n});this.scene.add.dom(this.game.config.width-100,100,i.element).setDepth(1e3)}_injectCaptionCSS(){if(!this.game.registry.get("cssInjected")){const e="\n        .captions {\n            z-index: 100;\n            max-width: 75%;\n          }\n\n        .captions .cue {\n            color: white;\n            font-size: 48px;\n            background: rgba(0,0,0, .8);\n            padding:5px 10px;\n            width: fit-content;\n            margin: 0 auto;\n            text-align: center;\n            font-family: Arial, Helvetica, sans-serif;\n          }\n        ",t=document.createElement("style");t.textContent=e,document.body.appendChild(t),this.game.registry.set("cssInjected",!0)}}}return t}()}));
//# sourceMappingURL=SoundA11yPlugin.js.map