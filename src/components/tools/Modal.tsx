import React, { ReactNode } from "react";
import { FC } from "react";
import "../../css/modal.css";

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal: FC<Props> = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }
  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="modal">{children}</div>
    </>
  );
};
