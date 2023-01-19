export default class FormAuth_HTMLJS {
  constructor(place, errValues) {
    this.place = place;
    this.form = document.querySelector(place);
    // elements
    this.email = this.form.querySelector("input[type=email]");
    this.subject = this.form.querySelector("input[type=text]");
    this.textarea = this.form.querySelector("textarea");
    this.button = this.form.querySelector("input[type=submit]");
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
    const inputs = [this.email, this.subject, this.textarea];
    this.validateElement = this.validateElement.bind(this);
    this.lastCheck = this.lastCheck.bind(this);

    for (const input of inputs) {
      input.addEventListener("blur", (e) => {
        this.validateElement(e);
      });
    }

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();

      this.lastCheck(e);
    });
  }

  checkSecurity(dirtyElement) {
    return DOMPurify.sanitize(dirtyElement, {
      USE_PROFILES: { html: true },
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
      this.validateForm;
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

  validateElement(e) {
    e.preventDefault();
    this._hasError = !e.target.checkValidity();
    const validity = e.target.validity;

    this.toggleError(e.target, this._hasError, this.createErrMessage(validity));
  }

  lastCheck(e) {
    e.preventDefault();

    this.email = this.checkSecurity(this.email);
    this.subject = this.checkSecurity(this.subject);
    this.textarea = this.checkSecurity(this.textarea);

    const lastWarn = this.errorCodes.lastWarming;
    this.toggleError(this.button, this._hasError, lastWarn);

    // if OK
    if (!this._hasError) {
      e.target.submit();
    }
  }
}
