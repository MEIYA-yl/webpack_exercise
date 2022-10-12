import "regenerator-runtime/runtime";
import "core-js/stable";
import "./js/image";
import "./js/font.js";
import "./js/css_loader";

const res = (a, b) => {
  return a + b;
};
let webpack_Res = res(1, 2);

const promise = async function () {
  const payload = () => {
    return 1;
  };
  const n = await payload();
  console.log("promise:", n);
};
promise();

console.log(webpack_Res);
console.log(promise());
