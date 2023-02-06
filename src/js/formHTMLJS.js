import _buttonShaking from "./_buttonshaking";
import _checkSecurity from "./_checkSecurity";

export default class FormAuth_HTMLJS {
  constructor(place, errValues) {
    this.place = place;
    this.form = document.querySelector(place);
    // elements
    this._email = this.form.querySelector("input[type=email]");
    this._subject = this.form.querySelector("input[type=text]");
    this._textarea = this.form.querySelector("textarea");
    this._inputs = [this._email, this._subject, this._textarea];
    this._button = this.form.querySelector("[type=submit]");
    // error flag
    this._hasError = false;

    this.form.setAttribute("novalidate", true);

    this.createErrorValues(errValues);
    this.bindEvents();
  }

  createErrorValues(errValues = {}) {
    const defaultErrorCodes = {
      badInput: "Write a number",
      patternMismatch: "The written value doesn't meet the requirements",
      rangeOverflow: "Please decrease the number",
      rangeUnderflow: "Please increase the number",
      stepMismatch: "Choose proper value",
      tooLong: "Written data is too high",
      tooShort: "Written data is too low",
      valueMissing: "Please fill the input",
      typeMismatch: "Write proper data type",
      lastWarming: "Please check the errors above",
    };

    this.errorCodes = { ...defaultErrorCodes, ...errValues };
  }

  bindEvents() {
    this.validateElement = this.validateElement.bind(this);
    this.lastCheck = this.lastCheck.bind(this);

    for (const input of this._inputs) {
      input.addEventListener("blur", (e) => {
        e.preventDefault();
        this.validateElement(input);
      });
    }

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.lastCheck(e);
    });
  }

  toggleError(element, display, message) {
    const brotherElement = element?.nextElementSibling;
    const hasErrElement = brotherElement?.classList.contains("error");

    if (hasErrElement) {
      brotherElement.style.display = display ? "block" : "none";
      brotherElement.setAttribute("aria-hidden", !display);
    } else if (display) {
      const errorElement = document.createElement("p");
      errorElement.classList.add("error");
      errorElement.innerHTML = message || "Write the label properly";
      errorElement.style.display = "block";
      errorElement.setAttribute("aria-hidden", false);

      element.after(errorElement);
    } else {
      return;
    }
  }

  createErrMessage(validityObj) {
    const errMessages = [];
    if (validityObj.badInput) {
      errMessages.push(this.errorCodes.badInput);
    }
    if (validityObj.patternMismatch) {
      errMessages.push(this.errorCodes.patternMismatch);
    }
    if (validityObj.rangeOverflow) {
      errMessages.push(this.errorCodes.rangeOverflow);
    }
    if (validityObj.rangeUnderflow) {
      errMessages.push(this.errorCodes.rangeUnderflow);
    }
    if (validityObj.stepMismatch) {
      errMessages.push(this.errorCodes.stepMismatch);
    }
    if (validityObj.tooLong) {
      errMessages.push(this.errorCodes.tooLong);
    }
    if (validityObj.tooShort) {
      errMessages.push(this.errorCodes.tooShort);
    }
    if (validityObj.valueMissing) {
      errMessages.push(this.errorCodes.valueMissing);
    }
    if (validityObj.typeMismatch) {
      errMessages.push(this.errorCodes.typeMismatch);
    }
    if (validityObj.lastWarming) {
      errMessages.push(this.errorCodes.lastWarming);
    }

    return errMessages.join(", <br>");
  }

  validateElement(el) {
    const localErrFlag = !el.checkValidity(),
      validity = el.validity;

    this.toggleError(el, localErrFlag, this.createErrMessage(validity));
    return localErrFlag;
  }

  lastCheck(e) {
    for (let input of this._inputs) {
      input.textContent = _checkSecurity(input);
      // checks if the element is ok, if the function returns true, the global error flag also turns true, and then it blocks submit
      if (this.validateElement(input)) {
        this._hasError = true;
      }
    }

    const lastWarn = this.errorCodes.lastWarming;
    this.toggleError(this._button, this._hasError, lastWarn);

    // if OK
    if (!this._hasError) {
      e.target.submit();
    } else {
      _buttonShaking(this._button);
      this._hasError = false;
    }
  }
}
