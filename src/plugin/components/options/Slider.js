export default class Slider extends HTMLElement{
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .esg-slider {
            display: flex;
            justify-content: space-between;
            align-content: center;
        }

        .esg-slider__input {
            flex-grow: 1;
            cursor: pointer;
            height: 25px;
        }

        .esg-slider__input::-moz-range-thumb,
        .esg-slider__input::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 25px;
            height: 25px;
            background: var(--primary-color);
            cursor: pointer;
        }

        label {
          display: inline-block;
          font-size: 32px;
          width: 210px;
          letter-spacing: 1px;
        }

        input[type=range] {
          height: 34px;
          -webkit-appearance: none;
          margin: 10px 0;
          background: none;
        }

        input[type=range]::-webkit-slider-runnable-track {
          width: 100%;
          height: 15px;
          cursor: pointer;
          animate: 0.2s;
          background: var(--primary-color);
          border-radius: 25px;
        }

        input[type=range]::-webkit-slider-thumb {
          box-shadow: 1px 1px 1px #000031;
          border: 1px solid rgba(0,0,0, .9);
          height: 38px;
          width: 38px;
          border-radius: 50%;
          background: #FFFFFF;
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: -13px;
        }
        input[type=range]:focus::-webkit-slider-runnable-track {
          background: var(--primary-color);
        }
        input[type=range]::-moz-range-track {
          width: 100%;
          height: 11px;
          cursor: pointer;
          animate: 0.2s;
          box-shadow: 1px 1px 1px #000000;
          background: #0f4863;
          border: 0px solid #010101;
        }
        input[type=range]::-moz-range-thumb {
          box-shadow: 1px 1px 1px #000031;
          border: 1px solid rgba(0,0,0, .9);
          height: 38px;
          width: 38px;
          border-radius: 50%;
          background: #FFFFFF;
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: -13px;
        }
      </style>
      <div class="esg-slider esg-element">
        <label for="${this.id}">${this.label}</label>
        <input type="range" step="0.1" min="0" max="1" value="${this.value}" id="${this.id}" class="esg-slider__input">
      </div>
    `;

    this.labelElement = this.shadowRoot.querySelector(".esg-slider label");
    this.inputElement = this.shadowRoot.querySelector(".esg-slider input");
    this.handleChange = this.handleChange.bind(this);
    this.volumeChangeEvent = new CustomEvent("volumechange", {
      detail: {
        value: this.value
      }
    });
  }


  handleChange () {
    this.value = this.inputElement.value;
    this.volumeChangeEvent.detail.value = this.inputElement.value;
    this.dispatchEvent(this.volumeChangeEvent);
  }

  connectedCallback() {
    this.inputElement.addEventListener("change", this.handleChange);
  }

  disconnectedCallback() {
    this.inputElement.removeEventListener("change", this.handleChange);
  }

  static get observedAttributes() {
    return ["id", "label", "value"];
  }

  get id() {
    return this.getAttribute("id");
  }

  get label() {
    return this.getAttribute("label");
  }

  get value() {
    return this.getAttribute("value");
  }

  set id(id) {
    this.setAttribute("id", id);
  }

  set label(label) {
    this.setAttribute("label", label);
  }

  set value(value) {
    this.setAttribute("value", value);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch(name) {
      case "label":
        this.labelElement.textContent = newValue;
        break;
      case "id":
        this.labelElement.setAttribute("for", newValue);
        this.inputElement.id = newValue;
        break;
      case "value":
        this.inputElement.setAttribute("value", newValue);
        break;
      default:
        break;
    }
  }
}
