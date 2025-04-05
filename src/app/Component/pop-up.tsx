import React from "react";
import "./pop-up.css"

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>×</button>
        {title && <h2>{title}</h2>}
        <div className="popup-body">{children}</div>
      </div>
      <div className="popup-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default Popup;
