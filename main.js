import "./style.css";
import "./main.scss";
import CodeProject from "./CodeProject";
import { DOM_SELECTORS } from "./constants";

const project = new CodeProject(document.getElementById("live-preview"));

const switchViewButtonElement = document.querySelector("#switch-view");
const projectImagesElement = document.querySelector("#show-project-images");

projectImagesElement.addEventListener("click", function () {
  project.drawProjectImages();
  document.querySelector("#my-project-images").classList.toggle("show");
});

switchViewButtonElement.addEventListener("click", () => {
  document.querySelector("iframe").classList.toggle("large");
});

// increase width of focused  editor.
const editorSelectorIds = Object.values(DOM_SELECTORS.editors).map(
  (idSelector) => idSelector.substring(1)
);

editorSelectorIds.forEach((editor) => {
  document.querySelector(`#${editor}`).addEventListener("focus", (e) => {
    const minimizeOthers = (idOfFocused) => {
      editorSelectorIds.forEach((element) => {
        idOfFocused !== element
          ? document
              .getElementById(element)
              .parentElement.classList.remove("large-editor")
          : null;
      });
    };

    const editor = e.target;
    minimizeOthers(editor.id);

    editor.parentElement.classList.add("large-editor");
  });
});

/* 
Todo: add editor

var editor = ace.edit("editor-js");

editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");
console.dir(editor); 
*/
