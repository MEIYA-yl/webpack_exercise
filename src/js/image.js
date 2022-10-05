// 主题：提供 file-loader 使用场景：将img当作模块来使用
import imge from "../img/33.jpg";
import "../css/style.css";

function packImg() {
  const imgEle = document.createElement("div");
  const img = document.createElement("img");
  const bgImg = document.createElement("div");

  // img.src = require("../img/32.jpg").default;
  // img.src = require("../img/33.jpg");
  img.src = imge;
  bgImg.className = "bgimg";
  imgEle.appendChild(img);
  imgEle.appendChild(bgImg);

  return imgEle;
}

document.body.appendChild(packImg());
