export default class OptionsModal extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: "open"});
    this.shadowRoot.innerHTML = `
      <style>
        button {
            --button-primary-color: "darkgray";
            --button-size: 90px;
            font-size: 90px;
            font-weight: bold;
            cursor: pointer;
            background: #ffffff;
            width: var(--button-size);
            height: var(--button-size);
            line-height: 87px;
            border-radius: 50%;
            border-width: 1px;
            border-color: rgba(0, 0, 0, .55);
            justify-content: center;
            align-content: center;
            transition: .1s background-color ease-in-out;
        }

        svg {
            fill: var(--button-primary-color);
            transition: .1s fill ease-in-out;
        }

        button:hover {
            background-color: var(--button-primary-color);
        }

        button:hover svg{
            fill: #ffffff;
        }
      </style>
      <button aria-label="Game Options">
        <svg fill="#000000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="65px" height="65px">    <path d="M47.16,21.221l-5.91-0.966c-0.346-1.186-0.819-2.326-1.411-3.405l3.45-4.917c0.279-0.397,0.231-0.938-0.112-1.282 l-3.889-3.887c-0.347-0.346-0.893-0.391-1.291-0.104l-4.843,3.481c-1.089-0.602-2.239-1.08-3.432-1.427l-1.031-5.886 C28.607,2.35,28.192,2,27.706,2h-5.5c-0.49,0-0.908,0.355-0.987,0.839l-0.956,5.854c-1.2,0.345-2.352,0.818-3.437,1.412l-4.83-3.45 c-0.399-0.285-0.942-0.239-1.289,0.106L6.82,10.648c-0.343,0.343-0.391,0.883-0.112,1.28l3.399,4.863 c-0.605,1.095-1.087,2.254-1.438,3.46l-5.831,0.971c-0.482,0.08-0.836,0.498-0.836,0.986v5.5c0,0.485,0.348,0.9,0.825,0.985 l5.831,1.034c0.349,1.203,0.831,2.362,1.438,3.46l-3.441,4.813c-0.284,0.397-0.239,0.942,0.106,1.289l3.888,3.891 c0.343,0.343,0.884,0.391,1.281,0.112l4.87-3.411c1.093,0.601,2.248,1.078,3.445,1.424l0.976,5.861C21.3,47.647,21.717,48,22.206,48 h5.5c0.485,0,0.9-0.348,0.984-0.825l1.045-5.89c1.199-0.353,2.348-0.833,3.43-1.435l4.905,3.441 c0.398,0.281,0.938,0.232,1.282-0.111l3.888-3.891c0.346-0.347,0.391-0.894,0.104-1.292l-3.498-4.857 c0.593-1.08,1.064-2.222,1.407-3.408l5.918-1.039c0.479-0.084,0.827-0.5,0.827-0.985v-5.5C47.999,21.718,47.644,21.3,47.16,21.221z M25,32c-3.866,0-7-3.134-7-7c0-3.866,3.134-7,7-7s7,3.134,7,7C32,28.866,28.866,32,25,32z"/></svg>
      </button>
    `;

    this._handleOnClick = this._handleOnClick.bind(this);
    this.buttonElement = this.shadowRoot.querySelector('button');
    this.icon = this.buttonElement.querySelector('svg');
    this.modal = null;
  }

  _handleOnClick () {
    if(this.modal == null) {
      console.warn("Unable to find specified options modal.");
      return;
    }
    this.modal.setAttribute("open", true);
    this.modal.focus();
    let activeScenes = window.esparkGame.scene.getScenes(true);
    activeScenes.forEach((scene) => {
      scene.input.mouse.enabled = false;
    });
  }

  connectedCallback() {
    this.modal = document.getElementById(this.modalId);
    this.buttonElement.addEventListener("click", this._handleOnClick);
  }

  disconnectedCallback() {
    this.buttonElement.removeEventListener("click", this._handleOnClick);
  }

  get modalId() {
    return this.getAttribute('modal-id');
  }

  set modalId(modalId) {
    this.setAttribute("modal-id", modalId);
  }

  get color() {
    return this.getAttribute('modal-id');
  }

  set color(color) {
    this.icon.setAttribute("modal-id", color);
  }

  static get observedAttributes() {
    return ["modal-id", "color"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch(name) {
      case "modal-id":
        this.modal = document.getElementById(newValue);
        break;
      case "color":
        // this.icon.setAttribute("fill", newValue);
        this.buttonElement.style.setProperty("--button-primary-color", newValue);
        break;
      default:
        break;
    }
  }
}
