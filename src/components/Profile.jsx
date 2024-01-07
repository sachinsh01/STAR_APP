// Import necessary libraries 
import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { TfiPencil } from "react-icons/tfi";
import Toast from 'react-bootstrap/Toast';
import { MdInfoOutline } from "react-icons/md";

export default function Profile({ closeWin }) {

    // Extracting the 'token' cookie using the useCookies hook
    const [cookies] = useCookies(['token']);

    // State variable to manage user data, initially set to null
    const [user, setUser] = useState(null);

    //Set the baseURL
    const baseURL = process.env.NODE_ENV === 'production' ? 'https://3.108.23.98/API' : 'http://localhost:4000';

    // State variable to manage whether the password is being edited, initially set to false
    const [isEditingPassword, setIsEditingPassword] = useState(false);

    // State variable to manage the new password
    const [newPassword, setNewPassword] = useState("");

    // State variable to manage the hovering state, initially set to false
    const [isHovered, setIsHovered] = useState(false);

    // State variable to manage the image edit state, initially set to false
    const [imageEdit, setImageEdit] = useState(false);

    // State variable to manage the selected image, initially set to null
    const [selectedImage, setSelectedImage] = useState(null);

    // State variable for managing a message
    let [message, setMessage] = useState("");

    // State variable for managing an error
    let [error, setError] = useState(false);

    // State variable to manage the visibility of the toast
    const [showToast, setShowToast] = useState(false);

    // Function to toggle the state of the showToast variable
    const toggleShowToast = () => setShowToast(!showToast);

    // useEffect hook to fetch the user's profile data from the server
    useEffect(() => {
        axios({
            method: "get",
            url: baseURL + "/user/profile",
            headers: {
                'Authorization': `Bearer ${cookies.token}`,
            }
        })
            .then(function (response) {
                // Update the user state with the data from the API response
                setUser(response.data);
            })
            .catch(function (error) {
                console.log("error: ", error);
            });
    }, [cookies.token, imageEdit]); // Add cookies.token as a dependency to re-fetch data when the token changes

    // Function to handle the password editing process
    function handlePasswordEdit() {
        setIsEditingPassword(true);
    }

    // Function to handle changes in the password input field
    function handlePasswordChange(e) {
        setNewPassword(e.target.value);
    }

    // Function to handle the password submission
    function handlePasswordSubmit() {
        if (newPassword === "") {
            setShowToast(true);
            setMessage("Enter a Value!");
            setError(true);
        } else {
            axios({
                method: "post",
                url: baseURL + "/user/password",
                data: {
                    password: newPassword
                },
                headers: {
                    'Authorization': `Bearer ${cookies.token}`,
                }
            }).then((response) => {
                setError(false);
                setMessage(response.data.message);
                setShowToast(true);
                setIsEditingPassword(false);
            });
        }
    }

    // Function to handle changes in the selected file
    const handleFileChange = (e) => {
        setSelectedImage(e.target.files[0]);
    };

    // Function to handle the form submission for updating the image
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (selectedImage === null) {
            setShowToast(true);
            setMessage("Select an Image!");
            setError(true);
        } else {
            const formData = new FormData();
            formData.append('photo', selectedImage);

            try {
                const response = await axios.post(baseURL + '/user/image', formData, {
                    headers: {
                        'Authorization': `Bearer ${cookies.token}`,
                        'Content-Type': 'multipart/form-data', // Important for file upload
                    },
                });

                setMessage(response.data.message);
                setShowToast(true);
                setImageEdit(false);
            } catch (error) {
                console.error('Image upload failed:', error);
            }
        }
    };


    return (
        <div className="profile-modal">
            {user && (
                <div className="text-center">
                    {!isHovered && <img
                        src={user.image.url}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        alt="User"
                        className="user-image mb-3"
                        style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                    />}
                    {isHovered &&
                        <div>
                            <img
                                src="https://res.cloudinary.com/djtkzefmk/image/upload/v1696966182/Untitled_design_xayf52.png"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                onClick={() => { setImageEdit(true) }}
                                alt="User"
                                className="user-image mb-3 clickable-cell"
                                style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                            />
                        </div>
                    }

                    <h4 className="fs-3 mb-1">{user.name}</h4>
                    <p className="fs-6">{user.designation} | {user.location[0].toUpperCase() + user.location.slice(1)}</p>
                    {user && user.shift == "night" && <span className={`badge bg-primary text-light mx-2`}>Night Shift</span>}
                    {user && user.shift == "day" && <span className={`badge bg-primary text-light mx-2`}>Day Shift</span>}
                </div>
            )}
            <hr style={{ margin: "30px" }} />
            {user && !imageEdit && (
                <div style={{ margin: "20px" }} className="fs-6">
                    <div><p><strong>Email:</strong> {user.email}</p></div>
                    {!isEditingPassword && <div>
                        <span><strong>Password:</strong> **********</span>
                        <button style={{ padding: "2px 12px 10px 12px" }} onClick={handlePasswordEdit} className="btn">
                            <TfiPencil />
                        </button>
                    </div>}
                    {isEditingPassword && <div>
                        <div className="row d-flex justify-content-start">
                            <label htmlFor="inputPassword2" className="form-label col-5"><strong>New Password:</strong></label>
                            <input onChange={handlePasswordChange} type="password" className="form-control col" id="inputPassword2" placeholder="Password" />
                        </div>
                        <div className="col-auto m-3 text-end">
                            <button type="button" onClick={handlePasswordSubmit} className="btn btn-outline-primary btn-sm mb-3">Change Password</button>
                        </div>
                    </div>
                    }
                </div>
            )}
            {imageEdit &&
                <form action={baseURL + "/user/image"} method="POST" encType="multipart/form-data" onSubmit={handleFormSubmit}>
                    <div className="mb-3">
                        <label htmlFor="formFile" className="form-label"><strong>Select Profile Picture:</strong></label>
                        <input name="photo" className="form-control" onChange={handleFileChange} type="file" id="formFile" accept=".jpg, .jpeg, .png, .gif" />
                    </div>
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-outline-primary">Upload</button>
                    </div>
                </form>
            }
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
                    width: "400px", // Adjust the width as per your requirement
                }}
            >
                <Toast.Body
                    className={error ? "bg-danger text-white" : "bg-success text-white"}
                >
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
    );
}
