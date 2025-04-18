import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";

export const DesktopLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(!validateEmail(value));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(!value);
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  const handleLoginClick = (e) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = !!password;

    setEmailError(!isEmailValid);
    setPasswordError(!isPasswordValid);

    if (isEmailValid && isPasswordValid) {
      navigate("/desktop-dashboard");
    }
  };

  return (
    <div className="desktop-login">
      <div className="body-6">
        <div className="div-117">
          <div className="div-118">
            <div className="div-119">
              <div className="frame-36">
                <div className="logo-icon">🔥</div>
              </div>
              <div className="text-wrapper-81">BurnBook</div>
            </div>

            <div className="div-120">
              <div className="text-wrapper-82">Welcome back</div>

              <p className="text-wrapper-83">
                Please enter your details to Login
              </p>

              <div className="div-121">
                <div className="div-122">
                  <div className="label-5">
                    <label className="text-wrapper-84" htmlFor="input-1">
                      Email address
                    </label>
                  </div>

                  <div className="div-123">
                    <div className={`overlap-group-5 ${emailError ? 'error' : ''}`}>
                      <input
                        className="input-5"
                        id="input-1"
                        placeholder="Enter your email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                      />

                      <div className="frame-38">
                        <img
                          className="frame-39"
                          alt="Frame"
                          src="/img/frame-29.svg"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="div-124">
                  <div className="div-125">
                    <div className="label-6">
                      <div className="text-wrapper-85">Password</div>
                    </div>

                    <div className="text-wrapper-86">Forgot password?</div>
                  </div>

                  <div className="div-123">
                    <div className={`overlap-group-5 ${passwordError ? 'error' : ''}`}>
                      <input
                        className="input-6"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={handlePasswordChange}
                      />

                      <div className="frame-38">
                        <div className="frame-40">
                          <img
                            className="group-2"
                            alt="Group"
                            src="/img/group-1.png"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="div-126">
                  <input
                    type="checkbox"
                    className="input-7"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                  />
                  <div className="label-7">
                    <div className="text-wrapper-88">Remember me</div>
                  </div>
                </div>
              </div>

              <button className="button-20" onClick={handleLoginClick}>
                <div className="text-wrapper-89">Login</div>
              </button>

              <Link className="don-t-have-an-wrapper" to="/desktop-signup">
                <p className="don-t-have-an">
                  <span className="text-wrapper-90">
                    Don&#39;t have an account?
                  </span>

                  <span className="text-wrapper-91"> Sign up</span>
                </p>
              </Link>

              <div className="overlap-wrapper">
                <div className="overlap">
                  <div className="div-125">
                    <div className="div-61 left-line" />
                    <div className="span-5">
                      <div className="text-wrapper-92">Or continue with</div>
                    </div>
                    <div className="div-61 right-line" />
                  </div>
                </div>
              </div>

              <div className="div-128">
                <button className="button-21">
                  <div className="frame-41">
                    <img
                      className="frame-42"
                      alt="Frame"
                      src="/img/frame-30-2.svg"
                    />
                  </div>

                  <div className="text-wrapper-93">Google</div>
                </button>

                <button className="button-22">
                  <div className="frame-43">
                    <img
                      className="frame-44"
                      alt="Frame"
                      src="/img/frame-31.svg"
                    />
                  </div>

                  <div className="text-wrapper-94">Apple</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
