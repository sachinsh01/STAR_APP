// Import necessary libraries 
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Modal from 'react-modal';
import axios from "axios";
import SideNav from "./SideNav";
import CreateProject from "./CreateProject";
import CreateAccount from "./CreateAccount";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import Toast from 'react-bootstrap/Toast';
import { MdInfoOutline } from "react-icons/md";

export default function AdminDashboard() {

    // State variable to manage whether the page is currently loading, initially set to true
    let [isLoading, setIsLoading] = useState(true);

    // Extracting the 'token' cookie using the useCookies hook
    const [cookies, setCookie] = useCookies(['token']);

    // State variable to store all users
    const [users, setUsers] = useState([]);

    // State variable to manage the project modal's open/close state, initially set to false
    const [projectModal, setProjectModal] = useState(false);

    // State variable to manage a message, initially set to an empty string
    let [message, setMessage] = useState("");

    // State variable to manage the visibility of the toast, initially set to false
    const [showToast, setShowToast] = useState(false);

    // Function to toggle the state of the showToast variable
    const toggleShowToast = () => setShowToast(!showToast);

    // Function to open the project modal
    const openProjectModal = () => {
        setProjectModal(true);
    };

    //Set the baseURL
    const baseURL = process.env.NODE_ENV === 'production' ? 'https://3.108.23.98/API' : 'http://localhost:4000';

    // Function to close the project modal
    const closeProjectModal = () => {
        setProjectModal(false);
    };

    function handleShiftChange(shift, id) {
        setShiftChange(shiftChange + 1);
        let newShift = shift == "day" ? "night" : "day";
        axios({
            method: "post",
            url: baseURL + "/user/shift",
            data: {
                id: id,
                shift: newShift
            },
            headers: {
                Authorization: `Bearer ${cookies.token}`,
            },
        }).then((response) => {
            /* console.log(response.data) */
        })
    }

    // State variable to manage the user modal's open/close state, initially set to false
    const [userModal, setUserModal] = useState(false);

    // Function to open the user modal
    const openUserModal = () => {
        setUserModal(true);
    };

    // Function to close the user modal
    const closeUserModal = () => {
        setUserModal(false);
    };

    let [shiftChange, setShiftChange] = useState(0);

    useEffect(() => {
        axios({
            method: "get",
            url: baseURL + "/user/get",
            headers: {
                'Authorization': `Bearer ${cookies.token}`,
            }
        }).then((response) => {
            setUsers(response.data);
        })
        setIsLoading(false);
    }, [shiftChange])

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
            <div className="d-flex">
                <div className="row">
                    <div className="col-lg-1 mt-6">
                        <SideNav />
                    </div>
                    <div className="col-lg-11 mt-6">
                        <div className="table-container">
                            <div className="timesheet-header d-flex justify-content-between">
                                <h3 className="h2 m-2" style={{ fontWeight: "350", verticalAlign: 'middle' }}>Admin's Desk</h3>
                            </div>
                            <div className="row p-4">
                                <div className="col-sm-12">
                                    <div className="card mb-3">
                                        <div className="card-body">
                                            <div className="pb-4" style={{ textAlign: "center" }}>
                                                <h5 className="card-title">User Management</h5>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6 mb-3 mb-sm-0">
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <h5 className="card-title">Create an Account</h5>
                                                            <p className="card-text">Create new user accounts to streamline access and collaboration within the organization.</p>
                                                            <a onClick={openUserModal} className="btn btn-outline-primary">Create Account</a>
                                                            <Modal

                                                                id="profile-modal"
                                                                isOpen={userModal}
                                                                onRequestClose={closeUserModal}
                                                                style={{
                                                                    overlay: {
                                                                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background overlay color
                                                                    },
                                                                    content: {
                                                                        width: '50%', // Width of the modal
                                                                        left: '25%', // Position from the left
                                                                        top: '12%',
                                                                        bottom: '2%'
                                                                    },
                                                                }}
                                                            >
                                                                <div className='d-flex justify-content-between'>
                                                                    <span className='h2 mb-4' style={{ fontWeight: "350", verticalAlign: 'middle' }}>Create Account</span>
                                                                    <button type="button" className="btn-close" aria-label="Close" onClick={closeUserModal}></button>
                                                                </div>
                                                                <CreateAccount setMessage={setMessage} setShowToast={setShowToast} closeWin={closeUserModal} />
                                                            </Modal>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6 mb-3 mb-sm-0">
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <h5 className="card-title">Manage Profiles</h5>
                                                            <p className="card-text">Manage and Update user accounts registered within the organization.</p>
                                                            <a onClick={openUserModal} className="btn btn-outline-primary">Manage Profiles</a>
                                                            <Modal
                                                                id="profile-modal2"
                                                                isOpen={userModal}
                                                                onRequestClose={closeUserModal}
                                                                style={{
                                                                    overlay: {
                                                                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background overlay color
                                                                    },
                                                                    content: {
                                                                        width: '50%', // Width of the modal
                                                                        left: '25%', // Position from the left
                                                                        top: '12%',
                                                                        bottom: '2%'
                                                                    },
                                                                }}
                                                            >

                                                                <div className='d-flex justify-content-between'>
                                                                    <span className='h2 mb-4' style={{ fontWeight: "350", verticalAlign: 'middle' }}>User Profiles</span>
                                                                    <button type="button" className="btn-close" aria-label="Close" onClick={closeUserModal}></button>
                                                                </div>
                                                                <table className="table table-striped">
                                                                    <thead>
                                                                        <tr>
                                                                            <th scope="col" style={{ textAlign: "center" }}>Name</th>
                                                                            <th scope="col" style={{ textAlign: "center" }}>Email</th>
                                                                            <th scope="col" style={{ textAlign: "center" }}>Shift</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {users && users.map((user, index) => (
                                                                            <tr key={user._id}>
                                                                                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                                                                                    <img className="modal-icon rounded-circle mb-3" src={user.image.url} alt="" />
                                                                                </td>
                                                                                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                                                                                    {user.name}
                                                                                </td>
                                                                                <td style={{ textAlign: "center", verticalAlign: "middle", }}>
                                                                                    <label className="switch">
                                                                                        <input type="checkbox" checked={user.shift == "night" ? true : false} onClick={() => handleShiftChange(user.shift, user._id)} />
                                                                                        <span className="slider round">
                                                                                            <span className="slider-text">{user.shift[0].toUpperCase() + user.shift.slice(1)}</span>
                                                                                        </span>
                                                                                    </label>
                                                                                </td>

                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>


                                                            </Modal>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card mb-3">
                                        <div className="card-body">
                                            <div className="pb-4" style={{ textAlign: "center" }}>
                                                <h5 className="card-title">Project Management</h5>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-sm-6 mb-3 mb-sm-0">
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <h5 className="card-title">Add Project</h5>
                                                            <p className="card-text">Drive progress and innovation!  Create projects and assign resources to steer your team towards achieving greatness.</p>
                                                            <a onClick={openProjectModal} className="btn btn-outline-primary">Add Project</a>
                                                            <Modal
                                                                isOpen={projectModal}
                                                                onRequestClose={closeProjectModal}
                                                                style={{
                                                                    overlay: {
                                                                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background overlay color
                                                                    },
                                                                    content: {
                                                                        width: '50%', // Width of the modal
                                                                        left: '25%', // Position from the left
                                                                        top: '12%',
                                                                        bottom: '2%'
                                                                    },
                                                                }}
                                                            >
                                                                <div className='d-flex justify-content-between'>
                                                                    <span className='h2 mb-3' style={{ fontWeight: "350", verticalAlign: 'middle' }}>Add Project</span>
                                                                    <button type="button" className="btn-close" aria-label="Close" onClick={closeProjectModal}></button>
                                                                </div>
                                                                <CreateProject setMessage={setMessage} setShowToast={setShowToast} closeWin={closeProjectModal} />
                                                            </Modal>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6 mb-3 mb-sm-0">
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <h5 className="card-title">Add Employees</h5>
                                                            <p className="card-text">Effective Employees allocation is the cornerstone of project success. Add or remove employees from the projects.</p>
                                                            <Link to="/projects"><a className="btn btn-outline-primary">Add Employees</a></Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6 mb-3 mb-sm-0">
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <h5 className="card-title">Manage Holidays</h5>
                                                            <p className="card-text">Effortlessly manage company holidays with the admin's option to add or remove specific dates from the system's holiday calendar.</p>
                                                            <Link to="/holidays"><a className="btn btn-outline-primary">Manage Holidays</a></Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card mb-3">
                                        <div className="card-body">
                                            <div className="pb-4" style={{ textAlign: "center" }}>
                                                <h5 className="card-title">Ticket Management</h5>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6 mb-3 mb-sm-0">
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <h5 className="card-title">Ticket Center</h5>
                                                            <p className="card-text">Review tickets to ensure timely resolutions and effective user support.</p>
                                                            <Link to="/ticket-center"><button className="btn btn-outline-primary">Visit Ticket Center</button></Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Toast className="p-0" show={showToast} delay={5000} autohide onClose={toggleShowToast} style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '500px', maxWidth: '90%' }}>
                        <Toast.Body className="bg-success text-white">
                            <strong><MdInfoOutline size={25} /> {message}</strong>
                            <button type="button" className="btn-close btn-close-white float-end" onClick={toggleShowToast}></button>
                        </Toast.Body>
                    </Toast>
                </div>
            </div>
        </>
    )
}