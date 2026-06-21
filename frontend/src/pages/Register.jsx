import { useState } from "react";
import axios from "axios";
import "./Register.css";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;


function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!terms) {
      alert("Please accept the Terms and Conditions");
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/api/register`, {
        fullName,
        email,
        password,
      });
      alert(response.data.message || "Account Created Successfully");
      setFullName("");
      setEmail("");
      setPassword("");
      setTerms(false);
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="full">
      <div className="content">
        <h1>Create Account</h1>
        <h4 className="subtitle">Fill in the details to get started</h4>
        <form onSubmit={handleRegister} className="register-form">
          <label htmlFor="name">Full name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="terms"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
            />
            <label htmlFor="terms">
              I agree to the <a href="#">Terms and Conditions</a> and{" "}
              <a href="#">Privacy Policy</a>
            </label>
          </div>
          <button type="submit">Register</button>
        </form>
        <h3 className="login-redirect">
          Already have an account? <Link to="/login">Login Here</Link>
        </h3>
      </div>
      <div className="image-panel">
        <img
          src="\Gemini_Generated_Image_ughiaeughiaeughi.png"
          alt="Aesthetic Bright Library Loft"
        />
      </div>
    </div>
  );
}

export default Register;