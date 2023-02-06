import _buttonShaking from "./_buttonshaking";
import _checkSecurity from "./_checkSecurity";

export default class FormAuth_JS {
  constructor(place, errMessages) {
    this.place = place;
    this.form = document.querySelector(place);
    this.form.setAttribute("novalidate", true);
    this._inputs = this._removeSubmitElements([
      ...this.form.querySelectorAll("input"),
    ]);
    this._inputs.push(document.querySelector("textarea"));
    this._button = document.querySelector("[type=submit]");
    this.errCodes = this._createErrMessages(errMessages);
    this._formError = false;

    this._connectEvents();
  }

  _removeSubmitElements(inputs) {
    return inputs.filter((el) => el.type !== "submit");
  }

  _createErrMessages(userMessages) {
    const defaultValues = {
      lastWarming: "Please check the errors above",
      patternMismatch: "The written value doesn't meet the requirements",
      badInput: "Write a proper data",
      valueMissing: "Please fill the input",
      typeMismatch: "Write proper data type",
      tooShort: "Written data is too short",
      tooLong: "Written data is too long",
    };
    return Object.assign({}, defaultValues, userMessages);
  }

  _connectEvents() {
    this._validateElement = this._validateElement.bind(this);
    this._lastCheck = this._lastCheck.bind(this);

    for (const input of this._inputs) {
      input.addEventListener("blur", (e) => {
        e.preventDefault();
        this._validateElement(input);
      });
    }
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this._lastCheck();
    });
  }

  _validateElement(el) {
    let localErrorFlag = false;
    if (!el.required) return localErrorFlag;

    // has minLength attr
    if (el.minLength !== -1) {
      localErrorFlag = el.value.length < el.minLength;
      this._toggleErrText(el, localErrorFlag, this.errCodes.tooShort);
    }
    if (localErrorFlag) return localErrorFlag;
    // has maxLength attr
    if (el.maxLength !== -1) {
      localErrorFlag = el.value.length > el.maxLength;
      this._toggleErrText(el, localErrorFlag, this.errCodes.tooLong);
    }
    if (localErrorFlag) return localErrorFlag;
    // is email type
    if (el.type === "email") {
      const properValue = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/g;
      localErrorFlag = !properValue.test(el.value);
      this._toggleErrText(el, localErrorFlag, this.errCodes.patternMismatch);
    }

    return localErrorFlag;
  }

  _lastCheck() {
    for (const input of this._inputs) {
      input.textContent = _checkSecurity(input);

      if (this._validateElement(input)) {
        console.log(input);
        // if validation returns true (an error exists) only then change _formError flag to true
        this._toggleErrText(this._button, true, this.errCodes.lastWarming);
        this._formError = true;
      }
    }

    if (!this._formError) {
      this.form.submit();
    } else {
      _buttonShaking(this._button);
      this._formError = false;
    }
  }

  _toggleErrText(element, toggle, message) {
    const noMessage = "No error message declared",
      brotherElement = element.nextElementSibling || null;
    if (brotherElement?.classList.contains("error")) {
      brotherElement.innerHTML = message || noMessage;
      brotherElement.style.display = toggle ? "block" : "none";
    } else if (toggle) {
      const errorElement = document.createElement("p");
      errorElement.classList.add("error");
      errorElement.innerHTML = message || noMessage;
      element.after(errorElement);
    }
  }
}
