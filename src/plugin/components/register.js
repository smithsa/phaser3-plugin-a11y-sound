import OptionsModal from "./options/OptionsModal";
import OpenOptionsButton from "./options/OpenOptionsButton";
import Toggle from "./options/Toggle";
import Slider from "./options/Slider";

export const registerCustomPluginComponents = () => {
  if(!customElements.get('options-button')) {
    customElements.define('options-button', OpenOptionsButton);
  }

  if(!customElements.get('options-modal')) {
    customElements.define('options-modal', OptionsModal);
  }

  if(!customElements.get('esg-slider')) {
    customElements.define('esg-slider', Slider);
  }

  if(!customElements.get('esg-toggle')) {
    customElements.define('esg-toggle', Toggle);
  }
}

