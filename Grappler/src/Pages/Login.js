import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/esm/Container";
import { DoLogin } from "../Authentication";
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getLoginStatus } from "../Slices/loginSlice";
import { jwtDecode } from 'jwt-decode';
import Modal from 'react-bootstrap/Modal';
import { sendOtp } from "../Slices/otpSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginDetails, setLoginDetails] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false); // State variable to control password visibility
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loginDetails.password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
    } else {
      setPasswordError("");
    }
  };

  const notify2 = () => {
    toast.success("Login Success");
  };

  const notify = (msg) => toast(msg);

  const handleChange = (e, field) => {
    let actualValue = e.target.value;
    setLoginDetails({
      ...loginDetails,
      [field]: actualValue
    });

    // Clear the password error message when the user enters something in the password box
    if (field === 'password') {
      setPasswordError("");
    }
  };

  const [emailDetails, setemailDetails] = useState({
    email: '',
  });

  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [backendMessage, setBackendMessage] = useState('');
  const [isEmailEmpty, setIsEmailEmpty] = useState(false);

  const openForgotPasswordModal = () => {
    setemailDetails({
      email: ' ',
    });
    setIsForgotPasswordModalOpen(true);
  };

  const handleemailDetailsChange = (e, field) => {
    setIsEmailEmpty(false);
    const actualValue = e.target.value;
    setemailDetails({
      ...emailDetails,
      [field]: actualValue,
    });
  };

  const closeForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(false);
  };

  const loginForm = () => {
    if (loginDetails.email && loginDetails.password) {
      if (loginDetails.password.length < 8) {
        setPasswordError("Password must be at least 8 characters.");
      } else {
        dispatch(getLoginStatus(loginDetails))
          .then((data) => {
            if (data != undefined) {
              DoLogin(data, () => {
                console.log("Login details are saved to localStorage", data);
              });
              notify2();
              const data2 = localStorage.getItem('data');
              const parsedData = JSON.parse(data2);
              const decodedToken = jwtDecode(parsedData.jwtToken);
              const role = decodedToken.role;
              if (role === "ROLE_ADMIN") {
                navigate("/admin/dashboard");
              }
              else {
                navigate("/users/dashboard");
              }
            }
            else {
              toast.error("Login failed! Invalid Credentials.");
            }
          });
      }
    }
  };

  function validateEmail(email) {
    const emailPattern = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return emailPattern.test(email);
  }

  const handleFormSubmitForEmail = (e) => {
    e.preventDefault();
    if (emailDetails.email.trim() === '') {
      setIsEmailEmpty(true);
      return;
    }
    if (!validateEmail(emailDetails.email)) {
      notify('Invalid email format');
    }
    else {
      dispatch(sendOtp(emailDetails))
        .then((data) => {
          handleBackendMessage(data.message);
          setIsForgotPasswordModalOpen(false);
          notify(data.message);
        });
    }
  };

  const handleBackendMessage = (message) => {
    setBackendMessage(message);
  };

  return (
    <div className="formParent">
      <Container className="formParent-container" style={{ 'display': 'flex', 'justifyContent': 'center' }}>
        <Form style={{ width: "70%" }} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label className="text-center">Email address</Form.Label>
            <Form.Control
              type="email"
              id="email"
              value={loginDetails.email}
              onChange={(e) => handleChange(e, 'email')}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <div className="d-flex align-items-center"> {/* Use d-flex and align-items-center to align items horizontally */}
              <Form.Control
                type={showPassword ? "text" : "password"} // Toggle password visibility
                id="password"
                value={loginDetails.password}
                onChange={(e) => handleChange(e, 'password')}
                required
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                className="ml-2" // Add margin to the button for spacing
              >
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </Button>
            </div>
            {passwordError && (
              <p style={{ color: 'red' }}>{passwordError}</p>
            )}
          </Form.Group>
          <Button
            variant="danger"
            type="submit"
            style={{ margin: "20px" }}
            onClick={loginForm}
          >
            Login
          </Button>
          <button className="btn btn-secondary" onClick={openForgotPasswordModal}>
            Forgot Password
          </button>
          <Modal show={isForgotPasswordModalOpen} onHide={closeForgotPasswordModal}>
            <Modal.Header closeButton>
              <Modal.Title>Forgot Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div>
                  <label htmlFor="email">Enter Email: </label> &nbsp; &nbsp;
                  <input
                    type="email"
                    id="email"
                    value={emailDetails.email}
                    onChange={(e) => handleemailDetailsChange(e, 'email')}
                    placeholder="Enter your email"
                    aria-required="true"
                    required
                  />
                  {isEmailEmpty && <p style={{ color: 'red' }}>Please input your email!</p>}
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeForgotPasswordModal}>
                Close
              </Button>
              <Button variant="primary" onClick={handleFormSubmitForEmail}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
        </Form>
      </Container>
    </div>
  );
};

export default Login;
