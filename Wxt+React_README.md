# Steps to Create and enject the Linkdin_AI_Extension

*Step1*: Create the Wxt React file by writing the command in the cmd npx wxt@latest init Linkdin-Ai_Extension
*Step2*: Choose the required templete as i choosed React
*Step3*: Add the Tailwind Css, PostCss and autoprefixer by running the command npm install -D tailwindcss postcss autoprefixer 

# Note: postcss and autoprefixer are necessary tools for processing Tailwind CSS files and converting them into standard CSS with appropriate vendor prefixes.

Explanation:

PostCSS: A tool that transforms CSS with JavaScript plugins, like Tailwind CSS.

Autoprefixer: A PostCSS plugin that adds vendor prefixes to CSS rules (e.g., -webkit-, -moz-) for cross-browser compatibility.

*Step4*: Do npx tailwindcss init to add the tailwind.config.js file
*Step5*: Add the required plugins in the tailwind.config.js file

# example:-> 
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./entrypoints/**/*.{js,jsx,ts,tsx}','./entrypoints/popup.{js,jsx,ts,tsx}','./entrypoints.{js,jsx,ts,tsx}'], // Tailwind Css to give access to the following folder
  theme: {
    extend: {},
  },
  plugins: [],
}

*Step6*: Add the postcss.config.cjs file in the root directory if not already added
 
 # example:->
 module.exports = {  //File to convert Tailwind Css to Css in content.css file
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  };

*Step7*: Add the necessary configurations for the manifest.json (use for web extensions) file in the wxt.config.ts

# example:->
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

*Step8*: Use the content.ts file in the entrypoints folder to add the necessary functionalities to your chrome extension 

# Note: create one content.ts file if not already present or change the name of the file extension as per need like .js .ts .tsx etc.

*Step9*: Render your react application in the content.tsx folder like how you do in main.tsx or index.tsx

# example:->
function createUi(ctx: ContentScriptContext) {
      return createShadowRootUi(ctx, {
        name: 'react-ui',
        position: 'inline',
        append: 'last',
        onMount(container) {
          const reactContainer = document.createElement('div');  // Create the container for the React app
          reactContainer.id = "message-generator-modal"
          container.appendChild(reactContainer);  // Append it directly to the container
    
          const root = ReactDOM.createRoot(reactContainer);  // Initialize React root
          root.render(
            <React.StrictMode>
              <App /> {/* Render the React app */}
            </React.StrictMode>
          );
    
          return root;
        },
      });
    }

*Step10*: import the css file where you have added the Tailwind css buldles in the root file i.e App.tsx or index.tsx

*Step11*: Now you are ready to use your extension do `npm run build` for build version or `npm run dev ` to run the entension in testing enviroment

*Step12*: Load your .output folder in the Load unpacked in chrom and Enjoy your Extension !!!




