
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">

            {/* ==========================================
                FOOTER MAIN
            ========================================== */}

            <div className="footer-container">

                {/* BRAND */}
                <div className="footer-brand">

                    <Link to="/" className="footer-logo">
                        <span className="footer-logo-icon">
                            🎤
                        </span>

                        <span>
                            SpeakUp<span>AI</span>
                        </span>
                    </Link>

                    <p className="footer-description">
                        Improve your English speaking skills with
                        AI-powered practice, real-time conversations,
                        and personalized feedback.
                    </p>

                    <div className="footer-socials">

                        <a
                            href="https://www.linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                        >
                            in
                        </a>

                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                        >
                            Git
                        </a>

                        <a
                            href="https://www.youtube.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="YouTube"
                        >
                            ▶
                        </a>

                    </div>

                </div>


                {/* QUICK LINKS */}
                <div className="footer-column">

                    <h3>
                        Quick Links
                    </h3>

                    <Link to="/">
                        Home
                    </Link>

                    <Link to="/dashboard">
                        Dashboard
                    </Link>

                    <Link to="/speaking">
                        Practice
                    </Link>

                    <Link to="/conversation">
                        AI Chat
                    </Link>

                    <Link to="/conversation-history">
                        History
                    </Link>

                </div>


                {/* LEARNING */}
                <div className="footer-column">

                    <h3>
                        Learning
                    </h3>

                    <Link to="/speaking">
                        Speaking Practice
                    </Link>

                    <Link to="/conversation">
                        AI Conversation
                    </Link>

                    <Link to="/dashboard">
                        Your Progress
                    </Link>

                    <Link to="/speaking">
                        Daily Challenge
                    </Link>

                </div>


                {/* ACCOUNT */}
                <div className="footer-column">

                    <h3>
                        Account
                    </h3>

                    <Link to="/login">
                        Login
                    </Link>

                    <Link to="/register">
                        Get Started
                    </Link>

                    <Link to="/dashboard">
                        My Dashboard
                    </Link>

                    <Link to="/conversation-history">
                        My History
                    </Link>

                </div>

            </div>


            {/* ==========================================
                FOOTER BOTTOM
            ========================================== */}

            <div className="footer-bottom">

                <div className="footer-bottom-container">

                    <p>
                        © {currentYear} SpeakUpAI. All rights reserved.
                    </p>

                    <div className="footer-bottom-links">

                        <Link to="/">
                            Privacy Policy
                        </Link>

                        <span>
                            •
                        </span>

                        <Link to="/">
                            Terms of Service
                        </Link>

                    </div>

                </div>

            </div>

        </footer>
    );
}

export default Footer;

