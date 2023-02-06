export default function _buttonShaking(element) {
  element.classList.add("form__button--error-shaking");
  setTimeout(() => {
    element.classList.remove("form__button--error-shaking");
  }, 2000);
}
