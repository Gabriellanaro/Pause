/* eslint-disable no-unused-vars */

import React from 'react';
import PropTypes from 'prop-types';

const ErrorPopup = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="error-popup">
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

ErrorPopup.propTypes = {
  message: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default ErrorPopup;