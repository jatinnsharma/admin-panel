import React from "react";

const ProfileImageModel = ({ isOpen, closeModal, imageUrl }) => {
  return (
    <div className={`modal ${isOpen ? "block" : "hidden"}`}>
      <div className="modal-overlay" onClick={closeModal}></div>
      <div className="modal-container">
        <div className="modal-content bg-red-100 ">
          <img src={imageUrl} alt="User Avatar" className="w-96 h-56" />
        </div>
        <button className="modal-close" onClick={closeModal}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ProfileImageModel;
