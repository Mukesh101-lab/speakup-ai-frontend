import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    return (
        <nav className="navbar">

            {/* =========================
                LOGO
            ========================= */}

            <Link to="/" className="logo">
                SpeakUp<span>AI</span> 🎤
            </Link>


            {/* =========================
                NAV LINKS
            ========================= */}

            <div className="nav-links">

                <Link to="/">
                    Home
                </Link>

                <Link to="/dashboard">
                    Dashboard
                </Link>

                <Link to="/speaking">
                    🎤 Practice
                </Link>

                <Link to="/conversation">
                    🤖 AI Chat
                </Link>

                <Link to="/conversation-history">
                    📜 History
                </Link>

                <Link
                    to="/settings"
                    className="navbar-link"
                >
                    ⚙️ Settings
                </Link>

            </div>


            {/* =========================
                ACTIONS
            ========================= */}

            <div className="nav-actions">

                <Link
                    to="/login"
                    className="login-btn"
                >
                    Login
                </Link>

                <Link
                    to="/register"
                    className="signup-btn"
                >
                    Get Started
                </Link>

            </div>

        </nav>
    );
}

export default Navbar;