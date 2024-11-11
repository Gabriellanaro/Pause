/* eslint-disable react/prop-types */
// components/LoginConfirmPopup.js
import '../App.css';

const DeleteConfirmPopup = ({ onConfirm, onCancel }) => {
  return (
    <div className="logout-confirm-popup">
      <div className="popup-content">
        <h3>Delete?</h3>
        <p>Are you sure you want to delete your event?</p>
        <button className="confirm-button" onClick={onConfirm}>Yes, delete</button>
        <button className="cancel-button" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default DeleteConfirmPopup;