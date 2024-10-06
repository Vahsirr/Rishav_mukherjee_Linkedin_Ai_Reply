import React, { useState, useEffect } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'

interface ModalProps {
  onClose: () => void;
  isOpen: boolean
}
const Modal: React.FC<ModalProps> = ({ onClose, isOpen }) => {

  const [input, setInput] = useState('');
  const [isGenerate, setIsGenerate] = useState(false);
  const [chat, setChat] =  useState<string[]>([])
  const [errorMessage, setErrorMessage] = useState<string>('')

  // Function to handle the generation of the response based on the input
  const handleGenerate=()=>{
    if(input.length>0){
      setIsGenerate(true); 
      setChat([...chat,input,"Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask."]); // Adds the input and reply to the chat array
      setInput('') // Resets the input field after the chat has successfully generated
    }else{
      setErrorMessage('Please Enter Your Prompt'); //If the user tries to gererate message without typing in the input field 
    }
  }

  // Function to insert the generated message into LinkedIn's message box
  const onInsertClick =()=>{
    let inputBox = document.getElementsByClassName("msg-form__contenteditable")[0] as HTMLElement
    if(inputBox){
      inputBox.focus(); //This will make sure the input box is focused when inserting text 
      document.execCommand('insertText', false, chat[chat.length-1]); //Insert the last element of the array this will make the code expandable
      onClose() // Close the modal after insersion
    }
  }

  // Resets the state when the modal is closed or re-opened (this will ensure there are no previous chats)
  useEffect(()=>{
    if(isGenerate){
      setTimeout(()=>{ // Clear chat, input, and error messages after 1 second when generation is triggered (this will ensure smooth functionality)
        setIsGenerate(false); 
        setChat([]);
        setInput('');
        setErrorMessage('');
        console.log(chat[chat.length-1]);
      },1000)
    }
  },[isOpen])

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      {/* Modal backdrop with animation */}
      <DialogBackdrop 
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      {/* Main modal content */}
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center items-center p-0">
          {/* This is the Modal container */}
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-2xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-gray-100 px-4 pb-2 pt-3">
              <div className="items-start">
                <div className="mt-3">
                  {/* Display generated chat messages */}
                  {isGenerate && chat.map((messages,index)=>(
                    <div key={index} className='space-y-5 mb-5'>
                      <div className={`flex ${index%2===0?"justify-end":"justify-start" }`}>
                        <div className={`max-w-xs sm:max-w-lg text-start ${index%2===0?"bg-gray-300" : "bg-blue-100"} p-3 rounded-lg shadow-md overflow-hidden text-xl`}>{messages}</div>
                      </div>
                    </div>
                  ))}
                  <input
                    className='border border-gray-300 p-2 w-full rounded bg-white text-xl focus:outline-none focus:ring-0 focus:border-teal !shadow-none hover:!shadow-none'
                    placeholder='your prompt'
                    value={input}
                    onChange={(e) => {setInput(e.target.value); setErrorMessage('')}}
                  />
                </div>
                {/* Display error message if the input field is empty */}
                {errorMessage.length>0? <div className='ms-1 text-red-500 text-xs'>{errorMessage}</div>:<div className='mt-4'>{errorMessage}</div>}
              </div>
            </div>
            <div className="bg-gray-100 px-4 py-1 pb-3 sm:flex sm:flex-row-reverse sm:px-6">
              {/* Conditionally render 'Generate' or 'Insert' button based on isGenerate */}
              {!isGenerate ?
                <button
                  type="button"
                  onClick={() => handleGenerate()}
                  className="inline-flex items-center w-full justify-center rounded-md bg-blue-500 px-3 py-2 font-semibold text-white shadow-sm hover:bg-blue-400 sm:ml-3 sm:w-auto text-xl"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#FFFFFF" height="18px" width="15px" version="1.1" id="Capa_1" viewBox="0 0 492.013 492.013" xmlSpace="preserve">
                    <g>
                      <g>
                        <path d="M119.8,62.761l-41.4-17.5l-10.3-4.4l-0.6-0.3l-0.3-0.1l-1.8-0.7l-1.4-0.4l-2.7-0.9c-3.2-0.8-7.7-1.7-10.9-1.8    c-6.5-0.3-13.1,0.8-19.1,3.1c-5.9,2.4-11.5,5.7-16,10.2c-9.3,8.5-14.9,21.1-15.3,34.2c0.1,6.5,1.1,13.1,3.6,18.8l0.9,2.2    c0.3,0.8,0.6,1.5,0.8,1.8l1.2,2.5l2.5,5l19.8,40.2c13.4,26.8,26.7,53.5,40,80.2l0.2,0.3c2.9,5.8,8.8,10,15.7,10.5    c47.3,3.4,94.4,6.4,141.5,9.1c47.2,2.7,86.8,1.3,84.1-8c-2.5-8.5-35.5-17.3-83.8-22.3c-43.1-4.3-86.4-8.7-129.8-13    c-16.3-34.4-32.8-68.9-49.7-103.1l-5.8-11.8l-2.9-5.9c-0.3-0.6-0.3-0.7-0.4-1l-0.3-0.7c-0.2-0.5-0.5-0.9-0.5-1.4    c-0.6-1.8-0.4-3.5-0.1-5.2c0.3-1.7,1.2-3.5,2.4-4.9c2.4-3.1,6.2-4.7,9.6-4.6c0.4,0,0.3,0.1,0.6,0c0.1,0,0.1-0.1,0.3-0.1l1.6,0.5    l1.6,0.5l0.8,0.3l0,0l2.6,1.1l12.2,5l97.8,39.8l195.7,79.2c28.6,13.5,57.3,26.7,86.2,39.7c0.4,0.2,1,0.4,1.2,0.6l0.6,0.4    c0.4,0.2,0.8,0.4,1.2,0.6c0.5,0.6,1.4,0.9,1.7,1.6c1.1,1.1,1.7,2.5,2.3,3.9c1,3,0.6,6.6-0.9,9.1c-0.5,1.3-1.9,2.3-2.6,3    c-0.1,0-0.1,0-0.1,0.1c0,0,0.1,0-0.1,0.1l-0.7,0.3l-1.3,0.6l-1.1,0.5l0,0l-0.3,0.1l-2.8,1.1l-22.2,8.8    c-59.2,23.5-118.2,47.8-177.3,72.4c-59,24.7-118.1,49.5-177.2,74.2l-11.1,4.6l-5.5,2.3c-0.9,0.3-0.8,0.2-1.3,0.4    c-0.3,0.1-0.7,0.4-1,0.3c-1.2,0.3-2.3,0.2-3.4,0c-1.1-0.4-2.2-0.8-3.3-1.6c-2.1-1.6-3.5-4.2-3.5-6.3c-0.2-0.5,0.1-1.2,0-1.6    c0.1,0,0,0.1-0.1,0.1h-0.1c0,0-0.1,0,0-0.3l0.6-1.4l0.6-1.4l0.2-0.6l1-2.1l2.7-5.4c14.2-28.6,28.5-57.2,42.7-85.8    c5.1-10.2,9.8-27.7,10.1-33.8c0.5-12.1-9.6-1-21.9,17c-10.2,14.9-20.4,30.7-30.7,47.4c-5.1,8.3-10.3,16.9-15.5,25.6    c-2.6,4.4-5.1,8.8-7.7,13.2l-3.9,6.7l-1.9,3.4l-1,1.7l-1.1,2.4l-0.8,1.8l-0.4,0.9l-0.4,1.4c-0.5,1.8-1.2,3.8-1.4,5.7    c-0.2,1.8-0.4,3.5-0.5,5.3c0.1,1.8,0.2,3.6,0.3,5.4c0.9,7.2,4,14,8.7,19.6c4.6,5.6,11,10,18.2,12.4c7.3,2.4,15.4,2.4,22.7,0.3    c4.1-1.2,6.2-2.1,8.8-3.1l7.6-2.9c5.1-2,10.2-3.9,15.3-5.9c10.2-4,20.4-8.1,30.6-12.1c98.3-39.4,196.6-78.9,295.1-118.4l36.9-15    l4.6-1.9l2.3-0.9l1.2-0.5l0.3-0.1l1.6-0.7l0.6-0.3l2.2-1.1l1.1-0.6c0.4-0.2,1.3-0.8,1.9-1.2c2.7-1.8,5.7-3.9,7.4-5.7    c8.1-7.7,13.3-18.4,14.2-29.3c1-10.8-1.5-22.2-8-31.4c-1.6-2.3-3.3-4.5-5.4-6.5c-1.9-2.1-4.1-3.8-6.4-5.3    c-2.2-1.7-4.7-2.8-7.1-4.1l-1.8-0.8l-1.1-0.5l-2.3-1l-36.8-15.4c-49.1-20.5-98.3-40.6-147.8-60.4c-24.2-10.5-48.4-20.9-72.6-31.4    L119.8,62.761z" />
                      </g>
                    </g>
                  </svg>
                  <span className='ms-2'>Generate</span>
                </button>
                :
                <>
                  <button
                    type="button"
                    className="inline-flex items-center w-full justify-center rounded-md bg-blue-500 px-3 py-2 font-semibold text-white shadow-sm hover:bg-blue-400 sm:ml-3 sm:w-auto text-xl mb-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#FFFFFF" height="18px" width="15px" version="1.1" id="Capa_1" viewBox="0 0 489.711 489.711" xmlSpace="preserve">
                      <g>
                        <g>
                          <path d="M112.156,97.111c72.3-65.4,180.5-66.4,253.8-6.7l-58.1,2.2c-7.5,0.3-13.3,6.5-13,14c0.3,7.3,6.3,13,13.5,13    c0.2,0,0.3,0,0.5,0l89.2-3.3c7.3-0.3,13-6.2,13-13.5v-1c0-0.2,0-0.3,0-0.5v-0.1l0,0l-3.3-88.2c-0.3-7.5-6.6-13.3-14-13    c-7.5,0.3-13.3,6.5-13,14l2.1,55.3c-36.3-29.7-81-46.9-128.8-49.3c-59.2-3-116.1,17.3-160,57.1c-60.4,54.7-86,137.9-66.8,217.1    c1.5,6.2,7,10.3,13.1,10.3c1.1,0,2.1-0.1,3.2-0.4c7.2-1.8,11.7-9.1,9.9-16.3C36.656,218.211,59.056,145.111,112.156,97.111z"/>
                          <path d="M462.456,195.511c-1.8-7.2-9.1-11.7-16.3-9.9c-7.2,1.8-11.7,9.1-9.9,16.3c16.9,69.6-5.6,142.7-58.7,190.7    c-37.3,33.7-84.1,50.3-130.7,50.3c-44.5,0-88.9-15.1-124.7-44.9l58.8-5.3c7.4-0.7,12.9-7.2,12.2-14.7s-7.2-12.9-14.7-12.2l-88.9,8    c-7.4,0.7-12.9,7.2-12.2,14.7l8,88.9c0.6,7,6.5,12.3,13.4,12.3c0.4,0,0.8,0,1.2-0.1c7.4-0.7,12.9-7.2,12.2-14.7l-4.8-54.1    c36.3,29.4,80.8,46.5,128.3,48.9c3.8,0.2,7.6,0.3,11.3,0.3c55.1,0,107.5-20.2,148.7-57.4    C456.056,357.911,481.656,274.811,462.456,195.511z"/>
                        </g>
                      </g>
                    </svg>
                    <span className='ms-2'>Regenerate</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onInsertClick()}
                    className="inline-flex items-center w-full justify-center rounded-md bg-gray-100 border-solid border-2 border-gray-500 px-3 py-2 font-semibold text-gray-500 shadow-sm hover:bg-gray-300 sm:ml-3 sm:w-auto text-xl"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="15px" viewBox="0 0 20 22" fill="#6b7280">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C12.5523 3 13 3.44772 13 4V17.5858L18.2929 12.2929C18.6834 11.9024 19.3166 11.9024 19.7071 12.2929C20.0976 12.6834 20.0976 13.3166 19.7071 13.7071L12.7071 20.7071C12.3166 21.0976 11.6834 21.0976 11.2929 20.7071L4.29289 13.7071C3.90237 13.3166 3.90237 12.6834 4.29289 12.2929C4.68342 11.9024 5.31658 11.9024 5.70711 12.2929L11 17.5858V4C11 3.44772 11.4477 3 12 3Z" fill="#6b7280" />
                    </svg>
                    <span className='ms-1'>Insert</span>
                  </button>
                </>
              }
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default Modal 