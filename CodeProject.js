import {
  DOM_SELECTORS,
  INITAL_PROJECTNAME,
  MY_PROJECTS,
  notFoundImage,
} from "./constants";
import { initalProjects } from "./initalProjects";
import { capture, generatePage, generateProjectImages } from "./utils";

class CodeProject {
  constructor(livePreviewElement, selectors = DOM_SELECTORS) {
    this.projectsKey = MY_PROJECTS;

    this.contentDocument = livePreviewElement.contentWindow.document;
    this.dropdown = document.querySelector(selectors.dropdown);
    this.project = {
      html: "",
      css: "",
      js: "",
    };
    this.selectors = selectors;
    this.htmlEditorElement = document.querySelector(selectors.editors.html);
    this.cssEditorElement = document.querySelector(selectors.editors.css);
    this.jsEditorElement = document.querySelector(selectors.editors.js);
    this.imageContainerElement = document.querySelector(
      selectors.imageContainer
    );
    this.runButton = document.querySelector(selectors.runButton);
    this.dropdown = document.querySelector(selectors.dropdown);

    this.getMyProjectsAddToDropdown();
    this.listenButtonClickToSave();
    this.listenChangeToCompile();
    this.listenDropdownToLoad();
    this.drawProjectImages();
    this.listenForRun();
  }
  updateProject(newProject) {
    this.project = newProject;
  }
  saveProject() {
    let projectsName = prompt("What's your projects name?");
    if (!projectsName) {
      alert("You should enter a name");
      return;
    }
    const projects = this.getProjects();
    if (projects.some((project) => project.name === projectsName)) {
      alert("Project with this name already exists");
      return;
    }
    this.project.name = projectsName;
    this.getBase64Image();
  }
  getProjects() {
    const projects = JSON.parse(window.localStorage.getItem(this.projectsKey));
    if (!projects) {
      const emptyProjects = initalProjects;
      window.localStorage.setItem(
        this.projectsKey,
        JSON.stringify(emptyProjects)
      );
      return emptyProjects;
    }
    return projects;
  }
  getMyProjectsAddToDropdown() {
    let projects = this.getProjects();
    const isThereAnyProject = projects.length === 0;

    if (isThereAnyProject) {
      projects = initalProjects;
      debugger;

      window.localStorage.setItem(this.projectsKey, JSON.stringify(projects));
      this.setProject(INITAL_PROJECTNAME);
    }
    const dropdown = this.dropdown;
    dropdown.innerHTML = "<option>My projects</option>";
    projects = this.getProjects();

    projects.forEach((project) => {
      const option = document.createElement("option");
      option.value = project?.name || "";
      option.innerHTML = project?.name || "";
      dropdown.appendChild(option);
    });
    if (!isThereAnyProject) {
      this.setProject(INITAL_PROJECTNAME);
    }
  }
  setProject(projectNameToFind) {
    const projects = this.getProjects();
    const projectToLoad = projects.find(
      (project) => project.name == projectNameToFind
    );
    this.htmlEditorElement.value = projectToLoad?.html;
    this.cssEditorElement.value = projectToLoad?.css;
    this.jsEditorElement.value = projectToLoad?.js;

    this.dropdown.value = projectNameToFind;
    this.compileCode();
  }
  compileCode() {
    this.updateProject({
      html: this.htmlEditorElement.value,
      css: this.cssEditorElement.value,
      js: this.jsEditorElement.value,
    });

    const documentToWrite = this.contentDocument;
    documentToWrite.innerHTML = "";
    documentToWrite.open();
    documentToWrite.writeln(generatePage(this.project));
    documentToWrite.close();
  }
  listenChangeToCompile() {
    document.addEventListener("keypress", (e) => {
      if (e.ctrlKey && e.key === "s") {
        this.compileCode();
      }
    });
  }

  getBase64Image() {
    return capture(generatePage(this.project), (imgData) =>
      this.setProjectImage(imgData)
    );
  }

  setProjectImage(base64Image) {
    this.project.img = base64Image;
    const projectToSave = this.project;
    const projects = this.getProjects();
    projects.push(projectToSave);
    window.localStorage.setItem(this.projectsKey, JSON.stringify(projects));
    this.getMyProjectsAddToDropdown();
  }
  drawProjectImages() {
    const projects = this.getProjects();
    const that = this;
    function clickHandler(e, projectName) {
      const projectNameToFind = projectName;
      that.setProject(projectNameToFind);
    }
    generateProjectImages(projects, this.imageContainerElement, clickHandler);
  }

  listenButtonClickToSave() {
    const button = document.querySelector(this.selectors.button);
    button.addEventListener("click", this.saveProject.bind(this));
  }
  listenDropdownToLoad() {
    this.dropdown.addEventListener("change", (e) => {
      const projectNameToFind = e.target.value;
      this.setProject(projectNameToFind);
    });
  }
  listenForRun() {
    this.runButton.addEventListener("click", (e) => {
      this.compileCode();
    });
  }
}

export default CodeProject;
