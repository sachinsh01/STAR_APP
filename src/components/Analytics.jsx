
// Import necessary libraries 
import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import SideNav from "./SideNav";
import Navbar from "./Navbar";
import Toast from "react-bootstrap/Toast";
import { MdInfoOutline } from "react-icons/md";
import TimesheetsFilled from "./graphs/TimesheetsFilled";
import TicketsStat from "./graphs/TicketsStat";
import VerticalWorkTime from "./graphs/VerticalWorkTime";
import BillableChart from "./graphs/BillableChart";
import ProjectsChart from "./graphs/ProjectsChart";
import VerticalsChart from "./graphs/VerticalsChart";
import ManagersChart from "./graphs/ManagersChart";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "./analytics.css";

export default function Analytics({ closeWin }) {

  // State variable to manage whether the page is currently loading, initially set to true
  const [isLoading, setIsLoading] = useState(true);

  // Extracting the 'token' cookie using the useCookies hook
  const [cookies, setCookie] = useCookies(["token"]);

  // State variable for managing a message
  let [message, setMessage] = useState("");

  //Set the baseURL
  const baseURL = process.env.NODE_ENV === 'production' ? 'https://3.108.23.98/API' : 'http://localhost:4000';

  // This state variable manages the visibility of the toast.
  const [showToast, setShowToast] = useState(false);

  // This function is responsible for toggling the state of the showToast variable.
  const toggleShowToast = () => setShowToast(!showToast);

  useEffect(() => {
    setIsLoading(false);
    axios({
      method: "get",
      url: baseURL + "/project/all",
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    }).then(
      function (response) { },
      function (error) {
        console.log("error: ", error);
      }
    );
  }, []);

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
      <div className="timesheet-header d-flex justify-content-between">
        <h3
          className="h3 m-2"
          style={{
            paddingTop: "50px",
            fontWeight: "350",
            verticalAlign: "middle",
          }}
        >
          Analytics
        </h3>
      </div>
      <div className="row">
        <div className="col-2 pt-0" style={{ marginTop: "-70px" }}>
          <SideNav />
        </div>
        <div className="col-10">
          <div className="col-11 mt-3">
            {/* divide the activities and business analytics */}
            <Tabs>
              <TabList>
                <Tab>Overall Analytics</Tab>
                <Tab>Business Analytics</Tab>
              </TabList>
              <TabPanel>
                {/* Activities Analytics Component */}
                <div className="table-container">
                  <div className="card m-3">
                    <div className="card-body">
                      <div className="pb-4" style={{ textAlign: "center" }}>
                        <h5 className="card-title">Overall Insights</h5>
                      </div>
                      <div className="row mb-4">
                        <div className="col-md-6 mb-3 mb-sm-0">
                          <div className="card" style={{ height: "312px" }}>
                            <div className="card-body">
                              <h6 className="card-title d-flex justify-content-center">
                                Timesheets Filled On-Time vs Not On-Time
                              </h6>
                              <div>
                                <TimesheetsFilled />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 mb-3 mb-sm-0">
                          <div className="card">
                            <div className="card-body d-flex flex-column align-items-center">
                              <h6 className="card-title text-center">
                                Tickets Status Overview
                              </h6>
                              <div style={{ width: "250px", height: "250px" }}>
                                <TicketsStat />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className="col-md-6 mb-3 mb-sm-0">
                          <div className="card">
                            <div className="card-body">
                              <h6 className="card-title d-flex justify-content-center">
                                Overtime vs. Undertime by Verticals
                              </h6>
                              <div>
                                <VerticalWorkTime />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                {/* Buisness Analytics component */}
                <div className="container">
                  <h3
                    style={{
                      marginTop: "20px",
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    Data Insights
                  </h3>
                  <div className="row">
                    <div className="col-12 py-3">
                      <div className="row my-1">
                        <ProjectsChart />
                      </div>
                      <hr style={{ marginRight: "-40px" }} />
                      <div className="row my-3 pt-5">
                        <div className="col-lg-7">
                          <ManagersChart />
                        </div>
                        <div className="col-lg-5">
                          <BillableChart />
                        </div>
                      </div>
                      <hr style={{ marginRight: "-40px" }} />
                      <div className="row my-3 pt-5">
                        <div className="col-12">
                          <VerticalsChart />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>
            </Tabs>
          </div>
        </div>
        <Toast
          show={showToast}
          delay={5000}
          autohide
          onClose={toggleShowToast}
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Toast.Body className="bg-success text-white">
            <strong>
              <MdInfoOutline size={25} /> {message}
            </strong>
            <button
              type="button"
              className="btn-close btn-close-white float-end"
              onClick={toggleShowToast}
            ></button>
          </Toast.Body>
        </Toast>
      </div>
    </>
  );
}
