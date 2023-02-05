export default class FormAuth_JS {
  constructor(place, errMessages) {
    this.place = place;
    this.form = document.querySelector(place);
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
      badInput: "Write a number",
      patternMismatch: "The written value doesn't meet the requirements",
      stepMismatch: "Choose proper value",
      tooLong: "Written data is too high",
      tooShort: "Written data is too low",
      valueMissing: "Please fill the input",
      typeMismatch: "Write proper data type",
      lastWarming: "Please check the errors above",
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

  _validateElement(el) {}
  _lastCheck() {}
}
