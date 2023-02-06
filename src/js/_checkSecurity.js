export default function checkSecurity(dirtyElement) {
  return DOMPurify.sanitize(
    dirtyElement.value /* , {
      USE_PROFILES: { html: true },
    } */
  );
}
