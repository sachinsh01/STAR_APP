// Import necessary libraries 
import { Link } from "react-router-dom";
import SideNav from "./SideNav";
import Header from "./Header";
import TicketCard from "./TicketCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import Navbar from "./Navbar";

export default function Tickets() {

    // State variable for managing the loading state
    const [isLoading, setIsLoading] = useState(false);

    // Using cookies to get the token
    const [cookies] = useCookies(['token']);

    // State variable for managing ticket data
    const [ticketsData, setTicketsData] = useState([]);

    //Set the baseURL
    const baseURL = process.env.NODE_ENV === 'production' ? 'https://3.108.23.98/API' : 'http://localhost:4000';

    // State variable for managing a re-render trigger
    const [render, setRender] = useState(0);

    // This useEffect hook fetches the raised tickets from the server.
    useEffect(() => {
        axios({
            method: "get",
            url: baseURL + "/ticket/raised",
            headers: {
                'Authorization': `Bearer ${cookies.token}`, // Setting the Authorization header with the token
            }
        }).then((response) => {
            setTicketsData(response.data.tickets); // Set the fetched tickets in the state
            setIsLoading(false); // Set loading to false after fetching the tickets
        });
    });

    return (
        <>
            {isLoading && (
                <div className="loader-overlay">
                    <div className="bouncing-loader">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            )}
            <Navbar />
            <div className="row">
                <div className="col-lg-1 mt-6">
                    <SideNav />
                </div>
                <div className="col-lg-11 mt-6">
                    <div className="ticketsContainer ">
                        <Header render={render} setRender={setRender} />
                        <div className="d-flex p-3">
                            <div className="recentTickets">
                                <div>
                                    {
                                        ticketsData.map((ticket) => {
                                            return (
                                                <TicketCard key={ticket._id} ticket={ticket} />
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    ticketsData.length == 0 && (
                        <div className="fs-5 d-flex justify-content-center" style={{ color: "grey" }}>Looks like there are no tickets to show right now!</div>
                    )
                }
            </div>
        </>
    );
}