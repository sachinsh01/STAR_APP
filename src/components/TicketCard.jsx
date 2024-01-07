// Import necessary libraries 
import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export default function TicketCard({ ticket }) {

    // State variable to manage the image data
    const [image, setImage] = useState({});

    // Extracting the 'token' cookie using the useCookies hook
    const [cookies] = useCookies(['token']);

    // Variable to determine the CSS class based on the ticket status
    let statusClass;

    // Checking the status of the ticket to determine the corresponding class
    if (ticket.status == "Pending") {
        statusClass = "primary";
    } else if (ticket.status == "Rejected") {
        statusClass = "danger";
    } else if (ticket.status == "Approved") {
        statusClass = "success";
    } else {
        statusClass = "info";
    }

    // useEffect hook to fetch the user's profile image from the server
    useEffect(() => {
        // Check if the 'token' cookie exists
        if (cookies.token) {
            axios({
                method: "get",
                url: "http://localhost:4000/user/profile",
                headers: {
                    'Authorization': `Bearer ${cookies.token}`,
                }
            }).then((response) => {
                // Set the image data based on the response
                setImage(response.data.image);
            });
        }
    }, []);

    return (
        <div className="m-6" style={{ width: '83vw' }}>
            <ul>
                <li>
                    <div className="shadow-lg p-3 ticketcard">
                        <div className="d-flex">
                            <div><img src={image.url} alt="User" className="user-image mb-3" style={{ width: "70px", height: "70px", borderRadius: "50%" }} /></div>
                            <div className="p-3"> <span className="h3 p-0" style={{ fontWeight: "500" }}>{ticket.subject} </span><span className={`badge text-bg-${statusClass} text-white`}>{ticket.status}</span></div>
                        </div>
                        <div className="mb-3">
                            <div><strong>Category: </strong>{ticket.category}</div>
                            {
                                ticket.category == "Projects Inquiries" && (
                                    <div><strong>Project Code: </strong>{ticket.projectCode}</div>
                                )
                            }
                        </div>
                        <p>{ticket.description}</p>
                        {ticket.remarks !== "" && (
                            <p className="my-2"><strong>Remarks:</strong> {ticket.remarks}</p>
                        )}
                    </div>
                </li>
            </ul>
        </div>
    );
}