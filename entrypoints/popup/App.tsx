import React, { useState } from 'react';
import './App.css';
import './style.css'
import Modal from './components/Modal';

function App() {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  return (
    <div className="App">
      <button // Hidden Button to trigger the modal
        onClick={handleModalOpen}
        id="modal-open-button"
        className="text-white bg-blue-700 hover:bg-blue-800 hidden"
        type="button"
        style={{ display: 'none' }} // Inline Style to ensure that the button os hidden
      >
        Open Modal
      </button>

      {/* Modal component that is displayed and close based on the `isModalOpen` and `handleModalClose function` */}
      <Modal onClose={handleModalClose} isOpen={isModalOpen} />
    </div>
  );
}

export default App;
