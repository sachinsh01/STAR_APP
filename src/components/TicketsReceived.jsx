// Import necessary libraries 
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import SideNav from "./SideNav";
import axios from "axios";
import Navbar from "./Navbar";
import Header from "./Header";
import Toast from 'react-bootstrap/Toast';
import { MdInfoOutline } from "react-icons/md";

export default function TicketsReceived() {

    const [isLoading, setIsLoading] = useState(true); // State variable for managing loading state
    const [cookies] = useCookies(['token']); // Using cookies to get the token
    const [tickets, setTickets] = useState([]); // State variable for managing ticket data

    let [message, setMessage] = useState(""); // State variable for managing a message

    //Set the baseURL
    const baseURL = process.env.NODE_ENV === 'production' ? 'https://3.108.23.98/API' : 'http://localhost:4000';

    // This state variable manages the visibility of the toast. 
    const [showToast, setShowToast] = useState(false);

    const [remarks, setRemarks] = useState(""); // State variable for managing remarks

    // This function is responsible for toggling the state of the showToast variable.
    const toggleShowToast = () => setShowToast(!showToast);

    // This useEffect hook fetches the tickets from the server when the message changes.
    useEffect(() => {
        setIsLoading(true); // Set loading to true before making the API call
        axios({
            method: "get",
            url: baseURL + "/ticket/received",
            headers: {
                'Authorization': `Bearer ${cookies.token}`, // Setting the Authorization header with the token
            }
        }).then((response) => {
            setTickets(response.data.tickets); // Set the fetched tickets in the state
            setIsLoading(false); // Set loading to false after fetching the tickets
        });
    }, [message]); // Run this effect when the message changes

    // This function handles the elevation of a ticket with the provided id.
    function handleElevate(id) {
        setIsLoading(true); // Set loading to true before making the API call
        axios({
            method: "patch",
            url: baseURL + "/ticket/elevate",
            data: {
                ticketID: id,
                elevate: true, // Set the elevate parameter to true
            },
            headers: {
                'Authorization': `Bearer ${cookies.token}`, // Setting the Authorization header with the token
            }
        }).then((response) => {
            setMessage(response.data.message); // Set the message from the response
            setShowToast(true); // Show the toast
            setIsLoading(false); // Set loading to false after the API call
        });
    }

    // This function handles the rejection of a ticket with the provided id.
    function handleReject(id) {
        setIsLoading(true); // Set loading to true before making the API call
        axios({
            method: "patch",
            url: baseURL + "/ticket/elevate",
            data: {
                ticketID: id,
                elevate: false, // Set the elevate parameter to false
                remarks: remarks, // Include the remarks in the data to be sent
            },
            headers: {
                'Authorization': `Bearer ${cookies.token}`, // Setting the Authorization header with the token
            }
        }).then((response) => {
            setMessage(response.data.message); // Set the message from the response
            setShowToast(true); // Show the toast
            setIsLoading(false); // Set loading to false after the API call
        });
    }


    return (
        <>
            <Navbar />
            {isLoading && (
                <div className="loader-overlay">
                    <div className="bouncing-loader">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            )}
            <div className="row">
                <div className="col-lg-1 mt-6">
                    <SideNav />
                </div>
                <div className="col-lg-11 mt-6">
                    <div className="ticketsContainer ">
                        <Header isManager={true} />
                        <div className="d-flex p-3">
                            <div className="recentTickets">
                                <div>
                                    {tickets.map((ticket) => {

                                        let statusClass;

                                        if (ticket.status == "Pending") {
                                            statusClass = "primary"
                                        } else if (ticket.status == "Rejected") {
                                            statusClass = "danger"
                                        } else if (ticket.status == "Approved") {
                                            statusClass = "success"
                                        } else {
                                            statusClass = "info"
                                        }

                                        return (
                                            <div key={ticket._id} className="m-6" style={{ width: '83vw' }}>
                                                <ul>
                                                    <li>
                                                        <div className="shadow-lg p-3 row ticketcard">
                                                           <div className="col-lg-4">
                                                            <div className="d-flex">
                                                                <div><img src={ticket.image.url} alt="User" className="user-image mb-3" style={{ width: "70px", height: "70px", borderRadius: "50%" }} /></div>
                                                                <div className="p-3"> <span className="h3 p-0" style={{ fontWeight: "500" }}>{ticket.name} </span><span className={`badge text-bg-${statusClass} text-white`}>{ticket.status}</span></div>
                                                            </div>
                                                            <div className="mb-3">
                                                                <div><strong>Subject: </strong>{ticket.subject}</div>
                                                                <div><strong>Category: </strong>{ticket.category}</div>
                                                                {
                                                                    ticket.category == "Projects Inquiries" && (
                                                                        <div><strong>Project Code: </strong>{ticket.projectID}</div>
                                                                    )
                                                                }
                                                            </div>
                                                            </div>
                                                            <div className="col-lg-8">
                                                            <p>{ticket.description}</p>
                                                            {ticket.status == "Pending" && <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                <input
                                                                    type="text"

                                                                    onChange={(e) => {setRemarks(e.target.value)}}
                                                                    className=" mb-4"

                                                                    style={{ width: '50%', margin: 'auto' }}
                                                                    placeholder="Write Your Remarks!"
                                                                />
                                                            </div>}
                                                            {ticket.status == "Pending" && <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                <button onClick={() => { handleElevate(ticket._id) }} className="btn btn-outline-success mx-1">
                                                                    Elevate
                                                                </button>
                                                                <button onClick={() => { handleReject(ticket._id) }} className="btn btn-outline-danger mx-1">
                                                                    Reject
                                                                </button>
                                                            </div>}
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        )
                                    })}

                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        tickets.length == 0 && (
                            <div className="fs-5 d-flex justify-content-center" style={{ color: "grey" }}>Looks like there are no tickets to show right now!</div>
                        )
                    }
                </div>
                <Toast className="p-0" delay={5000} autohide show={showToast} onClose={toggleShowToast} style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
                    <Toast.Body className="bg-success text-white">
                        <strong><MdInfoOutline size={25} /> {message}</strong>
                        <button type="button" className="btn-close btn-close-white float-end" onClick={toggleShowToast}></button>
                    </Toast.Body>
                </Toast>
            </div>
        </>
    )
}