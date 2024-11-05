/* eslint-disable react/prop-types */
// components/LoginConfirmPopup.js
import '../App.css';

const LoginConfirmPopup = ({ onConfirm, onCancel }) => {
  return (
    <div className="logout-confirm-popup">
      <div className="popup-content">
        <h3>Login Required</h3>
        <p>You need to be logged in to add an event. Would you like to log in now?</p>
        <button className="confirm-button" onClick={onConfirm}>Yes, Log In</button>
        <button className="cancel-button" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default LoginConfirmPopup;