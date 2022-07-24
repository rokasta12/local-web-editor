
# Easy HTML CSS JS Editor

This project is a basic code editor written in vanilla javascript.

https://easywebeditor.netlify.app/

## Demo

Demo: https://easywebeditor.netlify.app/


## Installation

Install my-project with npm 

```bash
  git clone https://github.com/rokasta12/easy-HTML-CSS-JS-Editor.git
  npm install
  npm run dev
```

if you dont have pnpm installed

```bash
    npm i pnpm -g
```
install with pnpm
```bash
  git clone https://github.com/rokasta12/easy-HTML-CSS-JS-Editor.git
  pnpm install
  pnp mdev
```
    
## Features

- Save your project to localstorage.
- Saves with thumbnail images.
- Import saved projects to editor 
- Global templating.


#### Global templating:

On top of your js code add your variables like:
```bash
  title:"Welcome to editor";
  isVisible:false;
  width:"223px";
```

Then use it on your HTML/CSS/JS code

```html
    <div>
        {{ title }}
    <div/>
```
CSS
```css
    div {
        width:{{ width }}
    }
```

## Screenshots

![App Screenshot](./docs/images/1.png)
![App Screenshot](./docs/images/2.png)


