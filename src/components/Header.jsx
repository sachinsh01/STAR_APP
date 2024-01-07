// Import necessary libraries 
import React, { useState } from 'react';
import Modal from 'react-modal';
import TicketForm from './TicketForm';
import Toast from 'react-bootstrap/Toast';
import { MdInfoOutline } from "react-icons/md";

export default function Header({ isManager, render, setRender }) {

    // State variable to manage the modal's open/close state, initially set to false
    const [modalIsOpen, setModalIsOpen] = useState(false);

    // State variable for managing a message, initially set to an empty string
    let [message, setMessage] = useState("");

    // State variable for managing an error, initially set to false
    let [error, setError] = useState(false);


    //Set the baseURL
    const baseURL = process.env.NODE_ENV === 'production' ? 'https://3.108.23.98/API' : 'http://localhost:4000';


    // State variable to manage the visibility of the toast, initially set to false
    const [showToast, setShowToast] = useState(false);

    // Function to toggle the state of the showToast variable
    const toggleShowToast = () => setShowToast(!showToast);

    // Function to open the modal
    const openModal = () => {
        setModalIsOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <>
            <div className="header d-flex w-full justify-content-between">
                <h2 className="h2 m-2" style={{ fontWeight: "350", verticalAlign: 'middle' }}>{isManager ? "Tickets Received" : "Tickets"}</h2>
                <div>
                    <button onClick={openModal} className="btn btn-outline-dark m-2">Raise a ticket</button>
                    <Modal
                    id='profile-modal'
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        style={{
                            overlay: {
                                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background overlay color
                            },
                            content: {
                                width: '50%', // Width of the modal
                                left: '25%', // Position from the left
                                top: '15%',
                                bottom: '5%'
                            },
                        }}
                    >
                        <div className='d-flex justify-content-between'>
                            <span className='h2 mb-2' style={{ fontWeight: "350", verticalAlign: 'middle' }}>Raise a ticket</span>
                            <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
                        </div>
                        <TicketForm setMessage={setMessage} setShowToast={setShowToast} closeWin={closeModal} setError={setError} render={render} setRender={setRender} />
                    </Modal>
                </div>
                <Toast show={showToast} delay={5000} autohide onClose={toggleShowToast} style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
                    <Toast.Body className={error ? "bg-danger text-white" : "bg-success text-white"}>
                        <strong><MdInfoOutline size={25} /> {message}</strong>
                        <button type="button" className="btn-close btn-close-white float-end" onClick={toggleShowToast}></button>
                    </Toast.Body>
                </Toast>
            </div>
        </>
    );
}