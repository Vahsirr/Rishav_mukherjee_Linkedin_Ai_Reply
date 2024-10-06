import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    manifest_version: 3,
    name: "Linkdin Ai Reply",
    version: "1.0",
    description: "Adds a button to LinkedIn input boxes to insert a predefined message",
    icons: {
      16: "icon/16.png",
      32: "icon/32.png",
      48: "icon/48.png",
      96: "icon/96.png",
      128: "icon/128.png"
    },
    permissions: [
      "activeTab",
      "scripting"
    ],
    background: {
      service_worker: "background.js"
    },
    action: {
      default_title: "Default Popup Title",
      default_popup: "popup.html"
    },
    content_scripts: [
      {
        matches: ["https://www.linkedin.com/*"], //This will ensure only Linkdin is affected with the extension 
        js: ["content-scripts/content.js"], //This will add all the Functionality to the extension
        css: ["content-scripts/content.css"] //This will add all the styling
      }
    ],
  }
});
