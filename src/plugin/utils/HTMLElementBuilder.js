export default class HTMLElementBuilder {
  constructor(tagName, textContent = "") {
    this.element = document.createElement(tagName);
    this.element.textContent = textContent;

    return this;
  }

  addAttributes(attributes = {}) {
    if(!attributes || attributes.constructor !== Object) {
      return new Error("Parameter for addAriaAttributes should be an object. Example: {aria-label: \"Play\"");
    }

    for (let attribute in attributes) {
      let ariaAttributeValue = attributes[attribute];
      this.element.setAttribute(attribute, ariaAttributeValue);
    }

    return this;
  }

  addClasses(...classNames) {
    classNames.forEach((className) => {
      this.element.classList.add(className);
    });

    return this;
  }

  appendElements(elements) {
    const domElements = [].concat(elements || []);

    domElements.forEach((element) => {
      this.element.appendChild(element);
    });

    return this;
  }

  setInnerHtml(htmlString) {
    this.element.innerHTML = htmlString;

    return this;
  }
}
