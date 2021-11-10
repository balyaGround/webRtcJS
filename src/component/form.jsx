import React from "react";
import ModalForm from "./modal";
import { Modal } from "react-bootstrap";
import { useState } from "react";
export default function Form() {
  const [show, SetShow] = useState(false);
  const handleOpen = () => {
    SetShow(true);
  };
  return (
    <div>
      <button onClick={handleOpen}>Form </button>
      <Modal show={show}>
        <ModalForm showModal={show} closeModal={SetShow} />
      </Modal>
    </div>
  );
}
