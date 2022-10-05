import "../css/style.css";
import "../css/style.less";

function cssLoader() {
  const cssLoader = document.createElement("h4");
  cssLoader.innerHTML = "css_loader";
  cssLoader.className = "fontColor";

  return cssLoader;
}

document.body.appendChild(cssLoader());
