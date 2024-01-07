// Import necessary libraries 
import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";

export default function CreateProject({ closeWin, setMessage, setShowToast }) {
    // Extracting the 'token' cookie using the useCookies hook
    const [cookies] = useCookies(["token"]);

    // State variable to manage the project data, with initial fields set to empty strings
    const [project, setProject] = useState({
        projectName: "",
        description: "",
        vertical: "",
        horizontal: "",
        subHorizontal: "",
        managerID: "",
        customerName: "",
        customerID: "",
    });

    // Function to handle changes in the input fields
    function handleChange(e) {
        const { name, value } = e.target;
        setProject({ ...project, [name]: value });
    }

    //Set the baseURL
    const baseURL = process.env.NODE_ENV === 'production' ? 'https://3.108.23.98/API' : 'http://localhost:4000';


    // Function to handle form submission
    function handleSubmit(e) {
        e.preventDefault();

        // Check if the provided manager's email is valid
        axios({
            method: "post",
            url: baseURL + "/user/CheckManager",
            data: {
                email: project.managerID
            },
            headers: {
                Authorization: `Bearer ${cookies.token}`,
            },
        }).then((response) => {
            // If the manager's email is valid, create the project
            if (response.data.manager) {
                axios({
                    method: "post",
                    url: baseURL + "/project/create",
                    data: project,
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                })
                    .then((response) => {
                        setMessage(response.data.message);
                        setShowToast(true);
                        closeWin(); // Assuming this closes the window
                    })
                    .catch((error) => {
                        console.log("error: ", error);
                    });
            } else {
                // If the manager's email is invalid, display an error message
                setMessage("Project Not Created. Invalid Manager's Email Provided!");
                setShowToast(true);
                closeWin(); // Assuming this closes the window
            }
        });
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Project Name</label>
                    <input
                        className="form-control"
                        name="projectName"
                        value={project.projectName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Project Code</label>
                    <input
                        className="form-control"
                        name="id"
                        value={project.id}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <input
                        className="form-control"
                        name="description"
                        value={project.description}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Vertical</label>
                    <input
                        className="form-control"
                        name="vertical"
                        value={project.vertical}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Horizontal</label>
                    <input
                        className="form-control"
                        name="horizontal"
                        value={project.horizontal}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Sub-Horizontal</label>
                    <input
                        className="form-control"
                        name="subHorizontal"
                        value={project.subHorizontal}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Manager's Email</label>
                    <input
                        className="form-control"
                        name="managerID"
                        value={project.managerID}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Customer Name</label>
                    <input
                        className="form-control"
                        name="customerName"
                        value={project.customerName}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Customer ID</label>
                    <input
                        className="form-control"
                        name="customerID"
                        value={project.customerID}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-outline-primary">
                    Add Project
                </button>
            </form>
        </div>
    );
}
