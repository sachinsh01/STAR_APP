// Import necessary libraries 
import SideNav from "./SideNav";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function PageNotFound() {
    
    // Extracting the 'token' cookie using the useCookies hook
    const [cookies] = useCookies(['token']);

    return (
        <>
            <Navbar />
            <div className="container-fluid mx-0">
                <div className="row">
                    {cookies.token && (
                        <div className="col-lg-1 mt-6 mx-0 px-0">
                            <SideNav />
                        </div>
                    )}
                    <div className={cookies.token ? "col-lg-11 mt-6 px-0" : "col-lg-12 mt-6 px-0"}>
                        <div className="table-container">
                            <div className="timesheet-header d-flex flex-column align-items-center">
                                <h3 className="h2 m-2" style={{ fontWeight: "350" }}>Page Not Found!</h3>
                                <Link to="/">
                                    <button className="btn btn-outline-dark btn-sm mt-2">Back To Home</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
