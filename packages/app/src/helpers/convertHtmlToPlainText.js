export default function convertHtmlToPlainText(source) {
  const $shadow = document.createElement("div");
  $shadow.innerHTML = source;

  return $shadow.innerText;
}
