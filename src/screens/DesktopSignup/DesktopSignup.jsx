import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";

export const DesktopSignup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    number: false,
    symbol: false
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      number: /\d/.test(password),
      symbol: /[!@#$%^&*]/.test(password)
    };
    setPasswordRequirements(requirements);
    return Object.values(requirements).every(Boolean);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(!validateEmail(value));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
    setPasswordError(!validatePassword(value));
  };

  const handleSignupClick = (e) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    setEmailError(!isEmailValid);
    setPasswordError(!isPasswordValid);

    if (isEmailValid && isPasswordValid) {
      navigate("/desktop-login");
    }
  };

  return (
    <div className="desktop-signup">
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
              <div className="text-wrapper-82">Create Account</div>
              <p className="text-wrapper-83">
                Please enter your details to Sign up
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
                      <div className="text-wrapper-85">Create Password</div>
                    </div>
                  </div>

                  <div className="div-123">
                    <div className={`overlap-group-5 ${passwordError ? 'error' : ''}`}>
                      <input
                        className="input-6"
                        type="password"
                        placeholder="Create your password"
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
                    <div className="password-requirements">
                      <div className="requirement">
                        <input
                          type="checkbox"
                          checked={passwordRequirements.length}
                          readOnly
                        />
                        <span>Contains at least 8 characters</span>
                      </div>
                      <div className="requirement">
                        <input
                          type="checkbox"
                          checked={passwordRequirements.number}
                          readOnly
                        />
                        <span>Contains at least one number</span>
                      </div>
                      <div className="requirement">
                        <input
                          type="checkbox"
                          checked={passwordRequirements.symbol}
                          readOnly
                        />
                        <span>Contains a symbol (!@#$%^&*, etc.)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button className="button-20" onClick={handleSignupClick}>
                <div className="text-wrapper-89">Sign up</div>
              </button>

              <Link className="don-t-have-an-wrapper" to="/desktop-login">
                <p className="don-t-have-an">
                  <span className="text-wrapper-90">
                    Already have an account?
                  </span>
                  <span className="text-wrapper-91"> Login</span>
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
