import React, { useState } from "react";
import { Button, FormControl, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./modal.css";
import Form from "../formDisplay/Formik";

function ModalForm({ closeModal }) {
  const [update, setUpdate] = useState({
    fullname: "",
    nik: "",
    address: "",
    email: "",
    Dob: "",
    Mob: "",
  });
  return (
    <div>
      <div className="bungkos">
        <Modal.Header closeButton onClick={() => closeModal(false)}>
          <Modal.Title className="modal-title">Form Data Nasabah</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary">Save</Button>
        </Modal.Footer>
      </div>
    </div>
  );
}

export default ModalForm;
