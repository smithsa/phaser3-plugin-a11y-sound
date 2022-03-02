export default class Toggle extends HTMLElement{
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        button {
            cursor: pointer;
            background: #fff;
            box-shadow: none;
            border:none;
            font-size: 36px;
            padding: 0;
            letter-spacing: 2px;
            border: 3px solid #555555;
            border-radius: 30px;
            overflow: hidden;
        }
        .esg-toggle-state {
            padding: 8px 15px;
        }

        button span.on{
            color: #555555;
        }

        button span.off{
            background: #555555;
            color: #fff;
        }

        button[aria-pressed="true"] {
            border-color: var(--primary-color);
        }

        button[aria-pressed="true"] span.off {
            background: none;
            color: #555555;
            opacity: 1;
        }
        button[aria-pressed="true"] span.on{
            background: var(--primary-color);
            color: #fff;
        }
        .es-label {
          width: 210px;
          font-size: 32px;
          display: inline-block;
          letter-spacing: 1px;
        }
      </style>
      <div class="esg-toggle esg-component">
        <span class="es-label">${this.label}</span>
        <button type="button" role="switch" aria-label="${this.label}" id="${this.id}">
            <span class="esg-toggle-state on">On</span><span class="esg-toggle-state off">Off</span>
        </button>
      </div>
    `;

    this.shadowtoggleButton = this.shadowRoot.querySelector("button");
    this.shadowtoggleButtonLabel = this.shadowRoot.querySelector(".es-label");
    this.handleToggle = this.handleToggle.bind(this);
    this.toggleEvent = new CustomEvent("toggle", {
      detail: {
        on: this.toggleOn
      }
    });
  }

  handleToggle () {
    this.shadowtoggleButton.toggleAttribute("aria-pressed");
    this.toggleOn = this.toggleOn.toLowerCase() === 'true' ? false : true;
    this.toggleEvent.detail.on = this.toggleOn;
    this.dispatchEvent(this.toggleEvent);
  }

  connectedCallback() {
    this.shadowtoggleButton.addEventListener("click", this.handleToggle);
  }

  disconnectedCallback() {
    this.shadowtoggleButton.removeEventListener("click", this.handleToggle);
  }

  static get observedAttributes() {
    return ["id", "label", "toggle-on"];
  }

  get id() {
    return this.getAttribute("id");
  }

  get label() {
    return this.getAttribute("label");
  }

  get toggleOn() {
    return this.getAttribute("toggle-on");
  }

  set id(id) {
    this.setAttribute("id", id);
  }

  set label(label) {
    this.setAttribute("label", label);
  }

  set toggleOn(toggleOnVal) {
    this.setAttribute("toggle-on", toggleOnVal);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch(name) {
      case "label":
        this.shadowtoggleButtonLabel.innerHTML = newValue;
        this.shadowtoggleButton.setAttribute("aria-label", newValue);
        break;
      case "id":
        this.shadowtoggleButton.id = newValue;
        break;
      case "toggle-on":
        this.shadowtoggleButton.setAttribute("aria-pressed", newValue);
        break;
      default:
        break;
    }
  }
}
