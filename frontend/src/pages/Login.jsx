import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/api/login`, { email, password });
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            alert(response.data.message);
            navigate("/dashboard");
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="page-wrapper">
            <header className="main-header">
                <div className="header-left">
                   
                    <h1 className="header-title " style={{ textAlign:"center"}}>Digital Knowledge Center</h1>
                </div>
            </header>
            <div className="page-layout">
                <div className="layout-left">
                    <img 
                        src="images/ChatGPT Image Jun 17, 2026, 12_24_50 PM.png" 
                        alt="Digital Library Dashboard Concept" 
                        className="hero-image" 
                    />
                </div>
                <div className="layout-right">
                    <div className="login-box">
                        <h2 className="login-subtitle">Welcome Back</h2>
                        <p className="login-tagline">Please enter your details to sign in.</p>
                        
                        <form onSubmit={handleLogin} className="login-form">
                            <input 
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="login-input"
                                required
                            />
                            <input 
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="login-input"
                                required
                            />
                            <button type="submit" className="login-button">Login</button>
                        </form>

                        <p className="login-footer">
                            Don't have an account?{" "}
                            <Link to="/register" className="login-link">Register Here</Link>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Login;