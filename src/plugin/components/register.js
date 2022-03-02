import OptionsModal from "./options/OptionsModal";
import OpenOptionsButton from "./options/OpenOptionsButton";
import Toggle from "./options/Toggle";
import Slider from "./options/Slider";

export const registerCustomPluginComponents = () => {
  customElements.define('options-button', OpenOptionsButton);
  customElements.define('options-modal', OptionsModal);
  customElements.define('esg-slider', Slider);
  customElements.define('esg-toggle', Toggle);
}

