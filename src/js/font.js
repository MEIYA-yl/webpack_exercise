// 提供 asset 处理图标字体环境
import "../css/style.css";

function packFont() {
  const oEle = document.createElement("div");

  const ofont = document.createElement("span");
  ofont.className = "iconfont icon-haizhe";
  oEle.appendChild(ofont);

  return oEle;
}

document.body.appendChild(packFont());
