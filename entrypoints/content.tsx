import React from 'react';
import { ContentScriptContext, createShadowRootUi } from 'wxt/client';
import ReactDOM from 'react-dom/client';
import App from './popup/App';

export default defineContentScript({
  matches: ['*://*.linkedin.com/*'], // Match all LinkedIn URLs
  async main(ctx) {

    let messageBox: HTMLDivElement | null = null;
    let button: HTMLButtonElement;

    // Function to create the custom button that will appear in input message box
    function createButton() {
      button = document.createElement('button');
      button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="svg-icon" style="width: 18px; height: 15px;vertical-align: middle;fill: blue;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1"><path d="M716.571429 332l167.428571-167.428571-61.142857-61.142858-167.428572 167.428572z m255.428571-167.428571q0 15.428571-10.285714 25.714285L226.857143 925.142857q-10.285714 10.285714-25.714286 10.285714t-25.714286-10.285714L62.285714 812q-10.285714-10.285714-10.285714-25.714286t10.285714-25.714285L797.142857 25.714286q10.285714-10.285714 25.714286-10.285715t25.714286 10.285715l113.142857 113.142857q10.285714 10.285714 10.285714 25.714286zM200 56l56 17.142857-56 17.142857-17.142857 56-17.142857-56-56-17.142857 56-17.142857 17.142857-56z m200 92.571429l112 34.285714-112 34.285714-34.285714 112-34.285715-112-112-34.285714 112-34.285714 34.285715-112z m531.428571 273.142857l56 17.142857-56 17.142857-17.142857 56-17.142857-56-56-17.142857 56-17.142857 17.142857-56zM565.714286 56l56 17.142857-56 17.142857-17.142857 56-17.142858-56-56-17.142857 56-17.142857 17.142858-56z"/></svg>`;
      button.classList.add(
        'bg-white', 
        'right-0', 
        'bottom-0', 
        'text-black', 
        'p-1', 
        'rounded-full', 
        'absolute', 
        'mr-2.5', 
        'mb-2.5', 
        'z-[9999]'
      );

      // Event handler for button click
      button.onclick = () => {
        const shadowHost = document.querySelector('react-ui[data-wxt-shadow-root]'); // Locate the shadow DOM where the modal button exists
        const shadowRoot = shadowHost?.shadowRoot;

        if (shadowRoot) {
          const modalButton = shadowRoot.querySelector<HTMLButtonElement>('#modal-open-button');
          if (modalButton) {
            modalButton.click();  // Trigger the modal button click event 
            console.log("Modal button clicked");
          } else {
            console.log("Modal button not found in the Shadow DOM");
          }
        } else {
          console.log("Shadow root not found");
        }
      };
    }

    // Function to inject the Tailwind CSS for styling
    function injectTailwind() {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = chrome.runtime.getURL('content-scripts/content.css'); // Path to Tailwind CSS file
      document.head.appendChild(link);
    }

    // Function to create the React UI inside the shadow DOM(Html component inside custom tag react-ui)
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

    // Handle focus event for LinkedIn's message input box
    function handleFocus() {
      if (!button) createButton();
      if (messageBox && messageBox.parentNode) {
        messageBox.parentNode.insertBefore(button, messageBox.nextSibling);
      }
    }

    // Handle blur event for LinkedIn's message input box
    function handleBlur() {
      if (button && button.parentNode) {
        setTimeout(() => { // Remove the button after a short delay when focus is lost this will make sure the onClick function works efficiently
          button.parentNode?.removeChild(button);
        }, 300)
      }
    }

    // MutationObserver to detect changes in the LinkedIn DOM, particularly for the message input box
    function observeLinkedInMessages() {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            const inputBox = document.querySelector<HTMLDivElement>('div.msg-form__contenteditable'); // Look for the LinkedIn message input box
            if (inputBox && inputBox !== messageBox) {
              messageBox = inputBox;
              // Add event listeners for focus and blur
              messageBox.addEventListener('focus', handleFocus);
              messageBox.addEventListener('blur', handleBlur);
            }
          }
        });
      });

      observer.observe(document.body, { childList: true, subtree: true }); // Observe DOM changes
    }

    //First we will inject the tailwindCss file than create the react UI and mount it 
    injectTailwind()
    const ui = await createUi(ctx);
    ui.mount();
    observeLinkedInMessages();

  },

});
