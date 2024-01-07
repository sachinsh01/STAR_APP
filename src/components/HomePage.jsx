// Import necessary libraries 
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import SideNav from "./SideNav";
import axios from "axios";
import moment from 'moment';
import Modal from 'react-bootstrap/Modal';
import Toast from 'react-bootstrap/Toast';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Navbar from "./Navbar";
import Card from 'react-bootstrap/Card';
import { BsMoonFill } from "react-icons/bs";

export default function HomePage() {

  // State variable to manage the selected timesheet, initially set to null
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);

  // State variable to manage a message, initially set to an empty string
  const [message, setMessage] = useState("");

  // State variable to manage the level, initially set to 1
  const [level, setLevel] = useState(1);

  // Determine steps based on whether a timesheet is selected
  const steps = selectedTimesheet
    ? [`Submitted on ${moment(selectedTimesheet.submissionDate).format('MMM D, YYYY')}`, `Project Manager\n${selectedTimesheet.status}`, 'Approved']
    : ['Manager Approval', 'Approved'];

  // State variable to manage the modal's open/close state, initially set to false
  const [show, setShow] = useState(false);

  // State variable to manage the visibility of the toast, initially set to false
  const [showToast, setShowToast] = useState(false);

  // Function to toggle the state of the showToast variable
  const toggleShowToast = () => setShowToast(!showToast);

  // Function to handle the modal close
  const handleClose = () => setShow(false);

  // Function to handle the modal open
  const handleShow = () => setShow(true);

  // Function to handle row click and set the submission date
  const handleRowClick = (timesheet) => {
    setSelectedTimesheet(timesheet);

    if (timesheet.status == "Accepted" || timesheet.status == "Auto-Approved" || timesheet.status == "Rejected") {
      setLevel(3);
    } else {
      setLevel(1);
    }

    handleShow(); // Open the modal
  };

  // State variable to manage whether the page is currently loading, initially set to true
  let [isLoading, setIsLoading] = useState(true);

  //Set the baseURL
  const baseURL = process.env.NODE_ENV === 'production' ? 'https://3.108.23.98/API' : 'http://localhost:4000';

  // State variable to manage the number of timesheets that have been deleted, initially set to 0
  let [isDeleted, setIsDeleted] = useState(0);

  // Extracting the 'token' cookie using the useCookies hook
  const [cookies] = useCookies(['token']);

  // State variable to manage an array of timesheets, initially set to an empty array
  const [timesheets, setTimesheets] = useState([]);

  // useEffect hook to fetch timesheets from the server
  useEffect(() => {
    setIsLoading(true);
    axios({
      method: "get",
      url: baseURL + "/timesheet/",
      headers: {
        'Authorization': `Bearer ${cookies.token}`,
      }
    }).then((response) => {
      setTimesheets(response.data.timesheets);
      setIsLoading(false);
    });
  }, [isDeleted]);

  // Function to handle the deletion of a timesheet
  function handleDelete(timesheetID) {
    setIsLoading(true);
    axios({
      method: "delete",
      url: baseURL + "/timesheet/",
      data: {
        _id: timesheetID
      },
      headers: {
        'Authorization': `Bearer ${cookies.token}`,
      }
    }).then((response) => {
      setMessage(response.data.message);
      setShowToast(true);
      setIsDeleted(isDeleted + 1);
      setIsLoading(false);
    });
  }

  return (
    <>
      <Modal id="profile-modal" className="modal" show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Activity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Box sx={{ width: '100%' }}>
            <Stepper activeStep={level} alternativeLabel>
              {steps.map((label, index) => {
                if (selectedTimesheet && (selectedTimesheet.status == "Accepted" || selectedTimesheet.status == "Auto-Approved") && (index == 1 || index == 2)) {
                  if (selectedTimesheet.status == "Auto-Approved" && index == 2) {
                    label = "Auto-Approved"
                  }
                  else if (selectedTimesheet.status == "Accepted" && index == 2) {
                    label = "Accepted on\n" + moment(selectedTimesheet.approvalDate).format("MMM DD, YYYY");
                  }
                  return (
                    <Step key={label}>
                      <StepLabel StepIconProps={{
                        style: {
                          color: "green", // Change the color based on the active step
                        }
                      }}>{label}</StepLabel>
                    </Step>
                  )
                } else if (selectedTimesheet && selectedTimesheet.status == "Rejected" && (index == 1 || index == 2)) {
                  if (index == 2) {
                    label = "Rejected on\n" + moment(selectedTimesheet.approvalDate).format("MMM DD, YYYY");
                  }
                  return (
                    <Step key={label}>
                      <StepLabel
                        error="true"
                        StepIconProps={{
                          style: {
                            color: "red", // Change the color based on the active step
                          }
                        }}>{label}</StepLabel>
                    </Step>
                  )
                } else {
                  return (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  )
                }
              })}
            </Stepper>
          </Box>
        </Modal.Body>
        <Modal.Footer>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col" style={{ textAlign: "center" }}>Day</th>
                <th scope="col" style={{ textAlign: "center" }}>Date</th>
                <th scope="col" style={{ textAlign: "center" }}>Hours</th>
              </tr>
            </thead>
            <tbody>
              {selectedTimesheet && selectedTimesheet.totalHours.map((item, index) => (
                <tr key={selectedTimesheet._id}>
                  <td style={{ textAlign: "center" }}>{moment(selectedTimesheet.startDate).clone().add(index, 'days').format('dddd')}</td>
                  <td style={{ textAlign: "center" }}>{moment(selectedTimesheet.startDate).clone().add(index, 'days').format('MMM DD, YYYY')}</td>
                  <td style={{ textAlign: "center" }}>{item}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Footer>
        {selectedTimesheet && <div className="d-flex justify-content-around m-2 p-2">
          <span>
            <strong>Total Hours:</strong> {selectedTimesheet.totalHours.reduce((accumulator, currentValue) => {
              return accumulator + currentValue;
            }, 0)}
          </span>
          <br />
          <span>
            <strong>Shift:</strong> {selectedTimesheet.shift.charAt(0).toUpperCase() + selectedTimesheet.shift.slice(1)}
          </span>
        </div>}
        {selectedTimesheet && selectedTimesheet.comment && (<div>
          <Card
            style={{ borderColor: "#043365", width: '18rem', borderWidth: '3px' }}
            className="mx-4 mb-3"
          >
            <Card.Header>Comment:</Card.Header>
            <Card.Body className="p-3">
              <Card.Text>
                {selectedTimesheet && selectedTimesheet.comment && (selectedTimesheet.comment)}
                {selectedTimesheet && !selectedTimesheet.comment && "NA"}
              </Card.Text>
            </Card.Body>
          </Card>
        </div>)}
        {selectedTimesheet && selectedTimesheet.remarks && (<div className="d-flex justify-content-end">
          <Card
            style={{ borderColor: "#e06e02", width: '18rem', borderWidth: '3px' }}
            className="mx-4 mb-3"
          >
            <Card.Header>Manager's Remark:</Card.Header>
            <Card.Body className="p-3">
              <Card.Text>
                {
                  selectedTimesheet && selectedTimesheet.status !== "Auto-Approved" && selectedTimesheet.remarks && (
                    <div>{selectedTimesheet.remarks}</div>
                  )
                }
                {selectedTimesheet && selectedTimesheet.status !== "Auto-Approved" && !selectedTimesheet.remarks && "NA"}

              </Card.Text>
            </Card.Body>
          </Card>
        </div>)}
      </Modal>

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
      <div className="row homePage">
        <div className="col-lg-1 mt-6">
          <SideNav />
        </div>
        <div className="col-lg-11 mt-6">
          <div className="table-container">
            <div className="timesheet-header d-flex justify-content-between">
              <h3 className="h2 m-2" style={{ fontWeight: "350", verticalAlign: 'middle' }}>My Timesheets</h3>
              <Link to="/create-timesheet">
                <button className="btn btn-outline-dark m-2">Create Timesheet</button>
              </Link>
            </div>
            <table className="table">
              <thead>
                <tr style={{ fontWeight: "600" }}>
                  <th scope="col" style={{ textAlign: "center" }}></th>
                  <th scope="col" style={{ textAlign: "center" }}>Time Period</th>
                  <th scope="col" style={{ textAlign: "center" }}>Project</th>
                  <th scope="col" style={{ textAlign: "center" }}>Total Hours</th>
                  <th scope="col" style={{ textAlign: "center" }}>Status</th>
                  <th scope="col" style={{ textAlign: "center" }}> </th>
                </tr>
              </thead>
              <tbody className="timesheetTable">
                {
                  timesheets.map((timesheet) => {

                    let statusClass = "primary"

                    if (timesheet.status == "Pending") {
                      statusClass = "warning"
                    } else if (timesheet.status == "Rejected") {
                      statusClass = "danger"
                    } else if (timesheet.status == "Accepted") {
                      statusClass = "success"
                    }

                    const hours = timesheet.totalHours.reduce((accumulator, currentValue) => {
                      return accumulator + currentValue;
                    }, 0);

                    return (

                      <tr style={{ fontWeight: "350", verticalAlign: 'middle' }} key={timesheet._id}>
                        <td scope=" d-flex" style={{ textAlign: "center" }}>{timesheet.shift == "night" ? <BsMoonFill /> : ""}</td>
                        <td scope=" d-flex" style={{ textAlign: "center" }}>{moment(timesheet.startDate).format("MMM D")} - {moment(timesheet.endDate).format("MMM D, YY")}</td>
                        <td style={{ textAlign: "center" }}>{timesheet.projectName}</td>
                        <td style={{ textAlign: "center" }}>{hours}</td>
                        <td style={{ textAlign: "center" }}><span className={`badge bg-${statusClass} text-light`}>{timesheet.status}</span></td>
                        <td>
                          <div className="dropdown">
                            <button
                              className="btn"
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                              </svg>
                            </button>
                            <ul
                              className="dropdown-menu"
                              aria-labelledby={`dropdownMenuButton${timesheet.projectID}`}
                            >
                              <li>
                                <a onClick={() => handleRowClick(timesheet)}
                                  className={`dropdown-item`} href="#">
                                  View Details
                                </a>
                              </li>
                              <li>
                                <a onClick={(e) => {
                                  handleDelete(timesheet._id)
                                }} className={`dropdown-item${(timesheet.status !== 'Pending' && timesheet.status !== 'Auto-Approved') ? ' disabled' : ''}`} href="#">
                                  Delete
                                </a>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
            {
              timesheets.length == 0 && (
                <div className="fs-5 d-flex justify-content-center" style={{ color: "grey" }}>Looks like there are no timesheets to show right now!</div>
              )
            }
            <div
              style={{
                position: 'fixed',
                bottom: 0,
                end: 0,
                padding: '1rem',
              }}
            >
              <Toast show={showToast} delay={5000} autohide onClose={toggleShowToast} style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
                <Toast.Body className="bg-success text-white">
                  <strong>{message}</strong>
                  <button type="button" className="btn-close btn-close-white float-end" onClick={toggleShowToast}></button>
                </Toast.Body>
              </Toast>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}