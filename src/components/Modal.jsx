import React from 'react';

export default function Modal({ isOpen, setIsOpen, children }) {
  if (!isOpen) return null;

  return (
    <div  className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
      <div style={{backgroundColor:"#C0C0C0"}} className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg">
        {children}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => setIsOpen(false)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
