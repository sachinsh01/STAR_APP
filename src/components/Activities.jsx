// Import necessary libraries 
import { FcInfo } from "react-icons/fc"
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Modal from 'react-bootstrap/Modal';
import SideNav from "./SideNav";
import Navbar from "./Navbar";
import axios from "axios";
import moment from 'moment';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Card from 'react-bootstrap/Card';
import Toast from 'react-bootstrap/Toast';
import { MdInfoOutline } from "react-icons/md";
import { BsMoonFill } from "react-icons/bs";

export default function Activities() {

    // State variable to manage the selected timesheet, initially set to null
    const [selectedTimesheet, setSelectedTimesheet] = useState(null);

    // State variable to manage the level, initially set to 1
    const [level, setLevel] = useState(1);

    // Determine steps based on the selected timesheet
    const steps = selectedTimesheet
        ? [`Submitted on ${moment(selectedTimesheet.submissionDate).format('MMM D, YYYY')}`, `Project Manager\n${selectedTimesheet.status}`, 'Approved']
        : ['Manager Approval', 'Approved'];

    // State variable to manage the modal's open/close state, initially set to false
    const [show, setShow] = useState(false);

    // State variable for managing remarks, initially set to an empty string
    const [remarks, setRemarks] = useState("");

    // State variable to manage whether the page is currently loading, initially set to true
    let [isLoading, setIsLoading] = useState(true);

    // State variable to manage the number of renders, initially set to 0
    let [render, setRender] = useState(0);

    // Extracting the 'token' cookie using the useCookies hook
    const [cookies] = useCookies(['token']);

    //Set the baseURL
    const baseURL = process.env.NODE_ENV === 'production' ? 'https://3.108.23.98/API' : 'http://localhost:4000';

    // State variable to manage an array of timesheets, initially set to an empty array
    const [timesheets, setTimesheets] = useState([]);

    const [message, setMessage] = useState(""); // State variable for managing a message

    // This state variable manages the visibility of the toast. 
    const [showToast, setShowToast] = useState(false);

    // This function is responsible for toggling the state of the showToast variable.
    const toggleShowToast = () => setShowToast(!showToast);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Function to handle row click and set submission date
    const handleRowClick = (timesheet) => {
        setSelectedTimesheet(timesheet);

        if (timesheet.status == "Accepted" || timesheet.status == "Auto-Approved" || timesheet.status == "Rejected") {
            setLevel(3);
        } else {
            setLevel(1);
        }

        handleShow(); // Open the modal
    };

    function handleRemarks(event) {
        setRemarks(event.target.value);
    }

    const nonPendingTimesheets = timesheets.filter((timesheet) => {
        return timesheet.status !== "Pending";
    });

    useEffect(() => {
        setIsLoading(true)
        axios({
            method: "get",
            url: baseURL + "/timesheet/manager",
            headers: {
                'Authorization': `Bearer ${cookies.token}`,
            }
        }).then((response) => {
            setTimesheets(response.data.timesheets)
            console.log(response.data.timesheets)
            setIsLoading(false)
        })
    }, [render])

    function handleAccept(timesheetID) {
        axios({
            method: "post",
            url: baseURL + "/timesheet/status",
            data: {
                ID: timesheetID,
                sheet: selectedTimesheet,
                remarks: remarks,
                status: "Accepted"
            },
            headers: {
                'Authorization': `Bearer ${cookies.token}`,
            }
        }).then((response) => {
            setMessage(response.data.message);
            setShowToast(true);
            setShow(false);
            setRender(render + 1);
        })
    }

    function handleReject(timesheetID) {
        axios({
            method: "post",
            url: baseURL + "/timesheet/status",
            data: {
                ID: timesheetID,
                sheet: selectedTimesheet,
                remarks: remarks,
                status: "Rejected"
            },
            headers: {
                'Authorization': `Bearer ${cookies.token}`,
            }
        }).then((response) => {
            setMessage(response.data.message);
            setShowToast(true);
            setShow(false);
            setRender(render + 1);
        })
    }

    return (
        <>
            <Modal id="profile-modal" show={show} onHide={handleClose} animation={false}>
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
                        <strong>Expected Hours:</strong> {selectedTimesheet.expectedHours}
                    </span>
                    <br />
                    <span>
                        <strong>Shift:</strong> {selectedTimesheet.shift.charAt(0).toUpperCase() + selectedTimesheet.shift.slice(1)}
                    </span>
                </div>}
                <div>
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
                </div>
                <div className="d-flex justify-content-end">
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
                                {selectedTimesheet && selectedTimesheet.status == "Auto-Approved" && (
                                    <input type="text" onChange={(e) => handleRemarks(e)} placeholder="Add Remarks Here" className="form-control" />

                                )}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
                {
                    selectedTimesheet && selectedTimesheet.status == "Auto-Approved" && (
                        <div className="d-flex justify-content-center mb-4">
                            <button
                                className="btn btn-outline-success mx-1"
                                onClick={() => handleAccept(selectedTimesheet._id)}
                            >
                                Accept
                            </button>
                            <button
                                className="btn btn-outline-danger mx-1"
                                onClick={() => handleReject(selectedTimesheet._id)}
                            >
                                Reject
                            </button>
                        </div>
                    )
                }
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
            <div className="row">
                <div className="col-lg-1 mt-6">
                    <SideNav />
                </div>
                <div className="col-lg-11 mt-6">
                    <div className="table-container">
                        <div className="timesheet-header d-flex justify-content-between">
                            <h3 className="h2 m-2" style={{ fontWeight: "350", verticalAlign: 'middle' }}>Activities</h3>
                        </div>
                        <table className="table">
                            <thead>
                                <tr style={{ fontWeight: "600" }}>
                                    <th scope="col" style={{ textAlign: "center" }}></th>
                                    <th scope="col" style={{ textAlign: "center" }}>Time Period</th>
                                    <th scope="col" style={{ textAlign: "center" }}>Project</th>
                                    <th scope="col" style={{ textAlign: "center" }}>Member</th>
                                    <th scope="col" style={{ textAlign: "center" }}>Total Hours</th>
                                    <th scope="col" style={{ textAlign: "center" }}>Status</th>
                                    <th scope="col" style={{ textAlign: "center" }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    nonPendingTimesheets.map((timesheet) => {

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
                                                <td style={{ textAlign: "center" }}>{timesheet.name}</td>
                                                <td style={{ textAlign: "center" }}>{hours}</td>
                                                <td style={{ textAlign: "center" }}><span className={`badge bg-${statusClass} text-light`}>{timesheet.status}</span></td>
                                                <td className="clickable-cell" onClick={() => handleRowClick(timesheet)} style={{ textAlign: "center" }}><span><FcInfo size={24} /></span></td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        {
                            nonPendingTimesheets.length == 0 && (
                                <div className="fs-5 d-flex justify-content-center" style={{ color: "grey" }}>Looks like there are no timesheets to show right now!</div>
                            )
                        }
                    </div>
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