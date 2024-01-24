import React from "react";

const DeleteConfirmationModal = ({ isOpen, onClose, onDelete,username="this" }) => {
  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center">
        <div className="bg-white p-4 rounded shadow">
          <p>Are you sure you want to delete {username}?</p>
          <div className="flex justify-end mt-2">
            <button
              className="mr-2 px-4 py-2 bg-red-500 text-white rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-1 bg-green-500 text-white rounded"
              onClick={onDelete}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default DeleteConfirmationModal;
