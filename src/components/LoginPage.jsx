import banner from "../images/landing.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import Navbar from "./Navbar";
import Toast from 'react-bootstrap/Toast';
import { MdInfoOutline } from "react-icons/md";
import starLogo from "../images/Logo.gif"

export default function LoginPage() {
  
  // State variable to manage whether the page is currently loading, initially set to false
  const [isLoading, setLoading] = useState(false);

  // State variable to manage any potential errors, initially set to an empty string
  const [error, setError] = useState("");

  // Extracting the 'token' cookie and related function using the useCookies hook
  const [cookies, setCookie] = useCookies(["token"]);

  // Function to navigate to different routes
  const navigation = useNavigate();

  //Set the baseURL
  const baseURL = process.env.NODE_ENV === 'production' ? 'https://3.108.23.98/API' : 'http://localhost:4000'; //window.location.host

  // State variable to manage user data, initially set to an empty email and password
  const [user, setUser] = useState({ email: '', password: '' });

  // State variable to manage the visibility of the toast
  const [showToast, setShowToast] = useState(false);

  // Function to toggle the state of the showToast variable
  const toggleShowToast = () => setShowToast(!showToast);

  // Function to handle changes in the email input field
  function handleEmailChange(e) {
    setUser({ ...user, email: e.target.value });
  }

  // Function to handle changes in the password input field
  function handlePasswordChange(e) {
    setUser({ ...user, password: e.target.value });
  }

  // Function to handle the login process
  function login() {
    setLoading(true);

    if (user.email == "" || user.password == "") {
      setError("Enter Credentials!");
      setShowToast(true);
      setLoading(false);
    } else {
      axios({
        method: "post",
        url: baseURL + "/user/login",
        data: user,
      }).then(
        function (response) {
          setLoading(false);

          if (response.data.token) {
            // Set the token cookie with an expiration time of 24 hours
            const expirationTime = new Date();
            expirationTime.setHours(expirationTime.getHours() + 24);
            setCookie("token", response.data.token, { path: "/", expires: expirationTime });

            // Navigate to the specified route upon successful login
            navigation("/");
            setError("");
          } else {
            setError("Invalid Credentials");
            // Reset the user data if the credentials are invalid
            setUser({ ...user, email: "", password: "" });
            setShowToast(true);
          }
        },
        function (error) {
          setLoading(false);
          // Set the error message and reset the user data on error
          setError(error.response);
          setShowToast(true);
          setUser({ ...user, email: "", password: "" });
          console.log("error: ", error);
        }
      );
    }
  }

  return (
    <>
      <Navbar />
      <div className="">
        <div className="row p-0">
          <div className="col-lg-6 p-6" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img className="loginbanner" style={{ width: "600px", height: "400px",marginTop: "55px", marginLeft:"115px" }} src={banner} alt="" />
          </div>
          <div className="col-lg-6 login-col">
            <div className="login-container">
              <div className="  loginform text-center">
                <div className=" my-3">
                  {/* <h4 className="heading">Welcome to Star App</h4> */}
                  <img src={starLogo} alt="" />
                </div>
                <div className="my-2">
                  <p className="subheading">Your ultimate shift companion</p>
                </div>
                <div className="my-3">
                  <input
                    className="login-input"
                    value={user.email}
                    type="email"
                    onChange={handleEmailChange}
                    placeholder="Email"
                  />
                </div>
                <div className="my-3 ">
                  <input
                    className="login-input"
                    value={user.password}
                    type="password"
                    onChange={handlePasswordChange}
                    placeholder="Password"
                  />
                </div>
                <div className="my-3">
                  {isLoading === false && (
                    <button type="button" onClick={login} className="button-primary">
                      Login
                    </button>
                  )}
                  {isLoading && (
                    <button type="button" disabled onClick={login} className="button-primary">
                      Please Wait
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Toast show={showToast} delay={5000} autohide onClose={toggleShowToast} style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
          <Toast.Body className="bg-danger text-white">
            <strong><MdInfoOutline size={25} /> {error}</strong>
            <button type="button" className="btn-close btn-close-white float-end" onClick={toggleShowToast}></button>
          </Toast.Body>
        </Toast>
      </div>
    </>
  );
}