import "./js/css_loader";
import "./js/image";
import "./js/font.js";
import "core-js/stable";
import "regenerator-runtime/runtime";

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
