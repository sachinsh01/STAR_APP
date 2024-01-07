// Import necessary libraries 
import React, { useState } from 'react';
import axios from 'axios';

export default function CreateAccount({ closeWin, setMessage, setShowToast }) {
    // State variable to manage whether the page is currently loading, initially set to false
    const [isLoading, setIsLoading] = useState(false);

    //Set the baseURL
    const baseURL = process.env.NODE_ENV === 'production' ? 'https://3.108.23.98/API' : 'http://localhost:4000';

    // State variable to manage user data, with initial fields set to empty strings
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        designation: '',
        shift: '',
        location: ''
    });

    // Function to handle changes in the input fields
    function handleChange(e) {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    }

    // Function to handle form submission
    function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);

        // Send a POST request to the server for user signup
        axios({
            method: "post",
            url: baseURL + "/user/signup",
            data: userData,
        })
            .then((response) => {
                // Display the response message and show a toast
                setMessage(response.data.message);
                setShowToast(true);
                closeWin(); // Assuming this closes the window
                setIsLoading(false);
            })
            .catch((error) => {
                // Log any errors and set isLoading to false
                console.error(error);
                setIsLoading(false);
            });
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Name:</label>
                    <input
                        className="form-control"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Designation:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="designation"
                        value={userData.designation}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Location:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="location"
                        value={userData.location}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3 d-flex justify-content-between">
                    <label className="form-label">Shift:</label>
                    <div class="form-check">
                        <input className="form-check-input" type="radio" name="shift" id="day" checked onChange={handleChange} value="day"/>
                            <label className="form-check-label" htmlFor="day">
                                Day
                            </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="shift" id="night" onChange={handleChange} value="night"/>
                            <label className="form-check-label" for="night">
                                Night
                            </label>
                    </div>
                </div>
                <button type="submit" className="btn btn-outline-primary">
                    Sign Up
                </button>
            </form>
        </div>
    );
}
