// Import necessary libraries 
import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Select from 'react-select'

export default function TicketForm({ closeWin, setMessage, setShowToast, setError, render, setRender }) {

    // Using cookies to get the token
    const [cookies] = useCookies(['token']);

    // State variables for form fields
    const [subject, setSubject] = useState("");
    const [category, setCategory] = useState("");
    const [projectID, setProjectID] = useState("");
    const [description, setDescription] = useState("");

    // State variables for managing the project field's visibility
    const [showProjectField, setShowProjectField] = useState(false);

    //Set the baseURL
    const baseURL = process.env.NODE_ENV === 'production' ? 'https://3.108.23.98/API' : 'http://localhost:4000';

    // State variables for managing the form submission status
    const [formSubmitted, setFormSubmitted] = useState(false);

    // State variable for storing project options fetched from the server
    const [projectOptions, setProjectOptions] = useState([]);

    // Fetching all projects from the server when the component mounts
    useEffect(() => {
        axios({
            method: "get",
            url: baseURL + "/project/all",
            headers: {
                'Authorization': `Bearer ${cookies.token}`, // Setting the Authorization header with the token
            }
        }).then(function (response) {
            setProjectOptions(response.data.map((item) => {
                return ({
                    value: item._id,
                    label: item.id
                });
            }));
        }, function (error) {
            console.log("error: ", error);
        });
    }, []);

    // Event handler for the subject field
    const handleSubject = (e) => {
        setSubject(e.target.value);
    };

    // Event handler for the category field
    const handleCategory = (e) => {
        setCategory(e.target.value);
        // Show project field only if the category is "Projects Inquiries"
        if (e.target.value === "Projects Inquiries") {
            setShowProjectField(true);
        } else {
            setShowProjectField(false);
        }
    };

    // Event handler for the project ID field
    const handleProjectID = (option) => {
        setProjectID(option);
    };

    // Event handler for the description field
    const handleDescription = (e) => {
        setDescription(e.target.value);
    };

    // Event handler for form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        setError(false);
        setFormSubmitted(true);

        // Sending form data to the server
        axios({
            method: "post",
            url: baseURL + "/ticket/create",
            data: {
                subject,
                category,
                projectID: showProjectField ? projectID.value : null,
                description,
            },
            headers: {
                'Authorization': `Bearer ${cookies.token}`, // Setting the Authorization header with the token
            }
        }).then(function (response) {
            // Handling response and setting necessary states
            setMessage(response.data.message);
            setShowToast(true);

            if (setRender) {
                setRender(render + 1);
            }

            if (response.data.error) {
                setError(true);
            }

            closeWin(); // Assuming you have a closeWin function defined somewhere
        }, function (error) {
            setError(true);
            console.log("error: ", error);
        });
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className={`needs-validation ${formSubmitted ? 'was-validated' : ''}`} noValidate>
                <div className="mb-3 m-2">
                    <label htmlFor="subject" className="col-form-label">Subject</label>
                    <input
                        type="text"
                        className="form-control"
                        onChange={handleSubject}
                        id="subject"
                        required
                    />
                    <div className="invalid-feedback">Please provide a subject.</div>
                </div>
                <div className="mb-3 m-2">
                    <label htmlFor="category" className="col-form-label">Category</label>
                    <select
                        className="form-select"
                        onChange={handleCategory}
                        id="category"
                        value={category}
                        required
                    >
                        <option value="" disabled>Select Category</option>
                        <option value="Projects Inquiries">Projects Inquiries</option>
                        <option value="Technical Issue">Technical Issue</option>
                    </select>
                    <div className="invalid-feedback">Please select a category.</div>
                </div>
                {showProjectField && <div className="mb-3 m-2">
                    <label htmlFor="projectID">Project ID</label>
                    <Select
                        id="projectID"
                        name="projectID"
                        value={projectID}
                        onChange={handleProjectID}
                        options={projectOptions}
                        placeholder="Select Project ID"
                    />
                </div>}
                <div className="mb-3 m-2">
                    <label htmlFor="message-text" className="col-form-label">Message</label>
                    <textarea
                        className="form-control"
                        onChange={handleDescription}
                        id="message-text"
                        required
                    ></textarea>
                    <div className="invalid-feedback">Please provide a message.</div>
                </div>
                <div className="mb-3 m-2">
                    <button type="submit" className="btn btn-dark">Submit</button>
                </div>
            </form>
        </div>
    )
}
