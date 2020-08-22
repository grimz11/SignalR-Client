//import * as path from "path";
const {ipcRenderer} = require("electron");
//import Cookies from 'universal-cookie';

window.addEventListener('DOMContentLoaded', async () => {
  //window.process = process;
  //const cookies = new Cookies(req.headers.cookie);
  // console.log('sessionStorage',await sessionStorage.get("badgeCount"));
  // ipcRenderer.
  //ipcRenderer.sendSync("update-badge", cookies.get("badgeCount"));
  window.ipcRenderer = require('electron').ipcRenderer;
})