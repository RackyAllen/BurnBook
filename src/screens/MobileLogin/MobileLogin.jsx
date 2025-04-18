import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";

export const MobileLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    if (showErrors) {
      if (newEmail && !validateEmail(newEmail)) {
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError("");
      }
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    if (showErrors && !newPassword) {
      setPasswordError("Please enter your password");
    } else {
      setPasswordError("");
    }
  };

  const handleLoginClick = () => {
    setShowErrors(true);
    let hasError = false;

    if (!email || !validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Please enter your password");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (!hasError) {
      navigate('/mobile-dashboard');
    }
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <div className="mobile-login">
      <div className="body-2">
        <div className="overlap-wrapper">
          <div className="overlap-2">
            <div className="main-2">
              <div className="logo-section">
                <div className="logo-container">
                  <div className="logo-icon">🔥</div>
                  <div className="logo-text">BurnBook</div>
                </div>
              </div>
              <div className="div-30">
                <div className="div-31">
                  <div className="text-wrapper-24">Welcome back</div>

                  <p className="text-wrapper-25">
                    Please enter your details to Login
                  </p>
                </div>

                <div className="div-32">
                  <div className="div-33">
                    <div className="label-6">
                      <label className="text-wrapper-26" htmlFor="input-1">
                        Email address
                      </label>
                    </div>

                    <div className="overlap-group-wrapper">
                      <div className="overlap-group-2">
                        <input
                          className={`input-4 ${emailError ? 'input-error' : ''}`}
                          id="input-1"
                          placeholder="Enter your email"
                          type="email"
                          value={email}
                          onChange={handleEmailChange}
                        />

                        <div className="frame-10">
                          <img
                            className="frame-11"
                            alt="Frame"
                            src="https://cdn.animaapp.com/projects/67fae6296f09967e7d39453d/releases/67faeae60a551ff812c6d97f/img/frame-29.svg"
                          />
                        </div>
                      </div>
                      {emailError && <div className="error-message">{emailError}</div>}
                    </div>
                  </div>

                  <div className="div-34">
                    <div className="div-35">
                      <div className="label-7">
                        <label className="text-wrapper-27" htmlFor="input-2">
                          Password
                        </label>
                      </div>

                      <div className="text-wrapper-28">Forgot password?</div>
                    </div>

                    <div className="overlap-group-wrapper">
                      <div className="overlap-group-2">
                        <input
                          className={`input-5 ${passwordError ? 'input-error' : ''}`}
                          id="input-2"
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={handlePasswordChange}
                        />

                        <div className="frame-10">
                          <div className="group-wrapper">
                            <img
                              className="group"
                              alt="Group"
                              src="https://cdn.animaapp.com/projects/67fae6296f09967e7d39453d/releases/67faeae60a551ff812c6d97f/img/group-1@2x.png"
                            />
                          </div>
                        </div>
                      </div>
                      {passwordError && <div className="error-message">{passwordError}</div>}
                    </div>
                  </div>

                  <div className="div-36">
                    <input
                      type="checkbox"
                      className="input-6"
                      checked={rememberMe}
                      onChange={handleRememberMeChange}
                    />

                    <div className="text-wrapper-30">Remember me</div>
                  </div>

                  <button className="button-4" onClick={handleLoginClick}>
                    <div className="text-wrapper-31">Login</div>
                  </button>

                  <div className="div-37">
                    <div className="don-t-have-an">
                      Don&#39;t have an account?
                    </div>

                    <Link className="text-wrapper-32" to="/mobile-signup">
                      Sign up
                    </Link>
                  </div>

                  <div className="div-38">
                    <div className="overlap-3">
                      <div className="div-35">
                        <div className="span" />
                      </div>

                      <div className="div-35">
                        <div className="overlap-group-3">
                          <div className="div-39" />
                          <div className="div-39 right-line" />
                          <div className="text-wrapper-33">
                            Or continue with
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="div-40">
                    <button className="button-5">
                      <div className="frame-12">
                        <img
                          className="frame-13"
                          alt="Frame"
                          src="https://cdn.animaapp.com/projects/67fae6296f09967e7d39453d/releases/67faeae60a551ff812c6d97f/img/frame-30.svg"
                        />
                      </div>

                      <div className="text-wrapper-34">Google</div>
                    </button>

                    <button className="button-6">
                      <div className="frame-14">
                        <img
                          className="frame-15"
                          alt="Frame"
                          src="https://cdn.animaapp.com/projects/67fae6296f09967e7d39453d/releases/67faeae60a551ff812c6d97f/img/frame-31.svg"
                        />
                      </div>

                      <div className="text-wrapper-35">Apple</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
