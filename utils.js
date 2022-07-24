import html2canvas from "html2canvas";
import { STATE_DIVIDER_STR, notFoundImage } from "./constants";

export const replaceDoubleBraces = (str, objectToPassString) => {
  return objectToPassString
    ? str.replace(/{{ (.+?) }}/g, (_, g1) => objectToPassString[g1] || g1)
    : str;
};

export const generatePage = (project) => {
  const html = replaceDoubleBraces(project.html, project);
  const css = replaceDoubleBraces(project.css, project);
  const js = replaceDoubleBraces(project.js, project);

  let stateObject;
  let jsCode = "";
  const state = {};

  if (js && js.includes(STATE_DIVIDER_STR)) {
    const [stateStr, restJSCode] = js.split(STATE_DIVIDER_STR);
    jsCode = restJSCode;

    stateStr
      .trim()
      .split(";")
      .filter((x) => x !== "")
      .forEach((el) => {
        const [kkey, val] = el.trim().split(":");
        let transferValue;

        // Booleans
        if (val === "true") {
          transferValue = true;
        } else if (val === "false") {
          transferValue = false;
        }
        // means type is str
        else if (val[0] === '"' && val[val.length - 1] === '"') {
          transferValue = val.substring(1, val.length - 1);
          // numbers
        } else if (!isNaN(val)) {
          transferValue = Number(val);
        }

        // Todo: add arrays and sub objects.
        state[String(kkey)] = transferValue;
      });
  }

  const document = `
  ${replaceDoubleBraces(project.html, state)}
  <style>
    ${replaceDoubleBraces(project.css, state)}
  </style>
  <script>
    ${replaceDoubleBraces(jsCode, state)}
  </script>
  `;
  return document;
};

export function capture(htmlString, cb) {
  let imgData;
  const temp = document.createElement("div");

  temp.innerHTML = htmlString;
  temp.id = "temp";
  document.body.querySelector("#app").append(temp);

  html2canvas(document.querySelector("#temp"), {
    useCORS: true,
  }).then((canvas) => {
    document.body.querySelector("#app").appendChild(canvas);
    temp.remove();
    imgData = canvas.toDataURL();
    cb(imgData);
    canvas.remove();

    return imgData;
  });
}

export function generateProjectImages(
  projects,
  imageContainerElement,
  clickHandler
) {
  imageContainerElement.innerHTML = "";
  projects.forEach((project) => {
    const imageContainer = document.createElement("div");
    const image = new Image();
    const projectTitle = document.createElement("h3");

    projectTitle.textContent = project.name;
    image.src = project?.img || notFoundImage;

    imageContainer.append(image);
    imageContainer.append(projectTitle);
    
    imageContainer.addEventListener("click", function (e) {
      clickHandler(e, project.name);
    });
    imageContainerElement.appendChild(imageContainer);
  });
}
