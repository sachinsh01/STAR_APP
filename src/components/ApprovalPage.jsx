// Import necessary libraries 
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Modal from 'react-bootstrap/Modal';
import SideNav from "./SideNav";
import axios from "axios";
import Navbar from "./Navbar";
import moment from 'moment';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Link } from "react-router-dom";
import Toast from 'react-bootstrap/Toast';
import { MdInfoOutline } from "react-icons/md";
import Card from 'react-bootstrap/Card';
import { BsMoonFill } from "react-icons/bs";

export default function ApprovalPage() {

    // State variable to manage the selected timesheet, initially set to null
    const [selectedTimesheet, setSelectedTimesheet] = useState(null);

    // State variable to manage the level, initially set to 1
    const [level, setLevel] = useState(1);

    // State variable to manage whether the page is currently loading, initially set to true
    let [isLoading, setIsLoading] = useState(true);

    //Set the baseURL
    const baseURL = process.env.NODE_ENV === 'production' ? 'https://3.108.23.98/API' : 'http://localhost:4000';

    // State variable to manage the number of renders, initially set to 0
    let [render, setRender] = useState(0);

    // Extracting the 'token' cookie using the useCookies hook
    const [cookies] = useCookies(['token']);

    // State variable to manage an array of timesheets, initially set to an empty array
    const [timesheets, setTimesheets] = useState([]);

    // Determine steps based on the selected timesheet
    const steps = selectedTimesheet
        ? [`Submitted on ${moment(selectedTimesheet.submissionDate).format('MMM D, YYYY')}`, `Project Manager\n${selectedTimesheet.status}`, 'Approved']
        : ['Manager Approval', 'Approved'];

    // State variable to manage the modal's open/close state, initially set to false
    const [show, setShow] = useState(false);

    // Function to handle the closing of the modal
    const handleClose = () => setShow(false);

    // Function to handle the opening of the modal
    const handleShow = () => setShow(true);


    const [message, setMessage] = useState(""); // State variable for managing a message
    const [remarks, setRemarks] = useState(""); // State variable for managing remarks added by the manager

    // This state variable manages the visibility of the toast. 
    const [showToast, setShowToast] = useState(false);

    // This function is responsible for toggling the state of the showToast variable.
    const toggleShowToast = () => setShowToast(!showToast);

    // State variable to manage the selected timesheet IDs
    const [selectedTimesheetIds, setSelectedTimesheetIds] = useState([]);

    // Function to handle checkbox change
    const handleCheckboxChange = (timesheetId) => {
        // Check if the timesheetId is already selected
        if (selectedTimesheetIds.includes(timesheetId)) {
            // If selected, remove it from the array
            setSelectedTimesheetIds((prevIds) =>
                prevIds.filter((id) => id !== timesheetId)
            );

            // Uncheck the header checkbox when any timesheet is unchecked
            setSelectAllChecked(false);
        } else {
            // If not selected, add it to the array
            setSelectedTimesheetIds((prevIds) => [...prevIds, timesheetId]);

            if(selectedTimesheetIds.length + 1 == pendingTimesheets.length) {
                setSelectAllChecked(true);
            }
        }
    };

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

    const pendingTimesheets = timesheets.filter((timesheet) => {
        return timesheet.status === "Pending";
    });

    // State variable to manage the checked state of the header checkbox
    const [selectAllChecked, setSelectAllChecked] = useState(false);

    // Function to handle checkbox change in the table header
    const handleSelectAllChange = () => {
        // Toggle the state of selectAllChecked
        setSelectAllChecked(!selectAllChecked);

        // If selectAllChecked is false, unselect all timesheets; otherwise, select all timesheets
        if (!selectAllChecked) {
            const allTimesheetIds = pendingTimesheets.map((timesheet) => timesheet._id);
            setSelectedTimesheetIds(allTimesheetIds);
        } else {
            setSelectedTimesheetIds([]);
        }
    };

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

    function handleAcceptAll() {
        axios({
            method: "post",
            url: baseURL + "/timesheet/updateAll",
            data: {
                sheets: selectedTimesheetIds,
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

    function handleRejectAll() {
        axios({
            method: "post",
            url: baseURL + "/timesheet/updateAll",
            data: {
                sheets: selectedTimesheetIds,
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
            <Modal id='profile-modal' show={show} onHide={handleClose} animation={false}>
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
                                        label = "Rejected"
                                    }
                                    return (
                                        <Step key={label}>
                                            <StepLabel StepIconProps={{
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
                                    selectedTimesheet && selectedTimesheet.remarks && (
                                        <div>{selectedTimesheet.remarks}</div>
                                    )
                                }
                                {
                                    selectedTimesheet && !selectedTimesheet.remarks && (
                                        <input type="text" onChange={(e) => handleRemarks(e)} placeholder="Add Remarks Here" className="form-control" />
                                    )
                                }
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
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
                            <h3 className="h2 m-2" style={{ fontWeight: "350", verticalAlign: 'middle' }}>Manager's Desk</h3>
                            <div className="d-flex justify-content-center">
                                {selectedTimesheetIds && selectedTimesheetIds.length > 0 && <div>
                                    <button className="btn btn-outline-success m-2" onClick={handleAcceptAll}>Accept</button>
                                    <button className="btn btn-outline-danger m-2" onClick={handleRejectAll}>Reject</button>
                                </div>}
                                <Link to="/manager-activities">
                                    <button className="btn btn-outline-dark m-2 mx-4">Activities</button>
                                </Link>
                            </div>
                        </div>
                        <table className="table">
                            <thead>
                                <tr style={{ fontWeight: "600" }}>
                                    <th scope="col" style={{ textAlign: "center" }}>{pendingTimesheets && pendingTimesheets.length > 0 && <input type="checkbox" checked={selectAllChecked} onChange={handleSelectAllChange} />}</th>
                                    <th scope="col" style={{ textAlign: "center" }}></th>
                                    <th scope="col" style={{ textAlign: "center" }}>Time Period</th>
                                    <th scope="col" style={{ textAlign: "center" }}>Project</th>
                                    <th scope="col" style={{ textAlign: "center" }}>Member</th>
                                    <th scope="col" style={{ textAlign: "center" }}>Total Hours</th>
                                    <th scope="col" style={{ textAlign: "center" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    pendingTimesheets.map((timesheet) => {

                                        const hours = timesheet.totalHours.reduce((accumulator, currentValue) => {
                                            return accumulator + currentValue;
                                        }, 0);

                                        return (
                                            <tr style={{ fontWeight: "350", verticalAlign: 'middle' }} key={timesheet._id}>
                                                <td scope=" d-flex" style={{ textAlign: "center" }}><input type="checkbox" checked={selectedTimesheetIds.includes(timesheet._id)} onChange={() => handleCheckboxChange(timesheet._id)} /></td>
                                                <td scope=" d-flex" style={{ textAlign: "center" }}>{timesheet.shift == "night" ? <BsMoonFill /> : ""}</td>
                                                <td scope=" d-flex" style={{ textAlign: "center" }}>{moment(timesheet.startDate).format("MMM D")} - {moment(timesheet.endDate).format("MMM D, YY")}</td>
                                                <td style={{ textAlign: "center" }}>{timesheet.projectName}</td>
                                                <td style={{ textAlign: "center" }}>{timesheet.name}</td>
                                                <td style={{ textAlign: "center" }}>{hours}</td>
                                                <td style={{ textAlign: "center" }}>
                                                    <button onClick={() => handleRowClick(timesheet)} className="btn btn-outline-primary">Take Action</button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        {
                            pendingTimesheets.length == 0 && (
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