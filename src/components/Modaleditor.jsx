// ModalEditor Component
import React from 'react';

export default function ModalEditor({ isOpen, setIsOpen, children, onSave, onCopyAsNew }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
      <div className="relative p-8 bg-white w-full h-full max-w-full max-h-full m-auto flex-col flex rounded-lg">
        <div className="flex flex-col w-full h-full">
          {/* Children là nơi Editor sẽ được hiển thị */}
          <div className="flex-grow">
            {children}
          </div>
          {/* Nút Save và Copy as New File */}
          <div className="flex justify-end items-center mt-4 space-x-2">
            <button
              onClick={onCopyAsNew}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Copy as New File
            </button>
            <button
              onClick={onSave}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
