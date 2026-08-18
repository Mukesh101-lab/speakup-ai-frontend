
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./Settings.css";

function Settings() {

    const { user } = useAuth();

    const [notifications, setNotifications] = useState(
        () => localStorage.getItem("notifications") !== "false"
    );

    const [darkMode, setDarkMode] = useState(
        () => localStorage.getItem("darkMode") === "true"
    );


    // ==========================================
    // APPLY DARK MODE GLOBALLY
    // ==========================================

    useEffect(() => {

        if (darkMode) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }

        localStorage.setItem(
            "darkMode",
            darkMode
        );

    }, [darkMode]);


    // ==========================================
    // NOTIFICATION SETTING
    // ==========================================

    const handleNotifications = () => {

        const newValue = !notifications;

        setNotifications(newValue);

        localStorage.setItem(
            "notifications",
            newValue
        );

    };


    // ==========================================
    // DARK MODE
    // ==========================================

    const handleDarkMode = () => {

        setDarkMode((previous) => !previous);

    };


    // ==========================================
    // DELETE ACCOUNT
    // ==========================================

    const handleDeleteAccount = async () => {

        const confirmed = window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone."
        );

        if (!confirmed) {
            return;
        }


        try {

            const token =
                localStorage.getItem("token");


            if (!token) {

                alert("Please login again.");

                return;
            }


            const response = await fetch(
                "https://speakup-ai-backend.onrender.com/api/auth/account",
                {
                    method: "DELETE",

                    headers: {
                        "Content-Type": "application/json",

                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to delete account"
                );

            }


            // REMOVE LOGIN DATA

            localStorage.removeItem("token");
            localStorage.removeItem("user");


            // REMOVE DARK MODE

            localStorage.removeItem("darkMode");
            document.body.classList.remove(
                "dark-mode"
            );


            alert(
                "Your account has been deleted successfully."
            );


            window.location.href = "/login";


        } catch (error) {

            console.error(
                "Delete Account Error:",
                error
            );


            alert(
                error.message ||
                "Unable to delete account."
            );

        }

    };


    return (

        <main className="settings-page">

            {/* ==========================================
                HEADER
            ========================================== */}

            <section className="settings-header">

                <div>

                    <span className="settings-label">
                        ACCOUNT SETTINGS
                    </span>

                    <h1>
                        Settings ⚙️
                    </h1>

                    <p>
                        Manage your SpeakUpAI account and preferences.
                    </p>

                </div>

            </section>


            {/* ==========================================
                PROFILE
            ========================================== */}

            <section className="settings-card">

                <div className="settings-card-header">

                    <div className="settings-card-icon">
                        👤
                    </div>

                    <div>

                        <h2>
                            Profile
                        </h2>

                        <p>
                            Your account information
                        </p>

                    </div>

                </div>


                <div className="profile-box">

                    <div className="profile-avatar">

                        {user?.name
                            ? user.name
                                .charAt(0)
                                .toUpperCase()
                            : "U"
                        }

                    </div>


                    <div className="profile-info">

                        <h3>
                            {user?.name || "User"}
                        </h3>

                        <p>
                            {user?.email ||
                                "Email not available"
                            }
                        </p>

                    </div>


                    <Link
                        to="/edit-profile"
                        className="edit-profile-button"
                    >
                        ✏️ Edit Profile
                    </Link>

                </div>

            </section>


            {/* ==========================================
                PREFERENCES
            ========================================== */}

            <section className="settings-card">

                <div className="settings-card-header">

                    <div className="settings-card-icon">
                        🎛️
                    </div>

                    <div>

                        <h2>
                            Preferences
                        </h2>

                        <p>
                            Customize your learning experience
                        </p>

                    </div>

                </div>


                {/* NOTIFICATIONS */}

                <div className="setting-row">

                    <div className="setting-info">

                        <div className="setting-title">
                            🔔 Notifications
                        </div>

                        <div className="setting-description">
                            Receive reminders about your English practice.
                        </div>

                    </div>


                    <button
                        className={`toggle ${
                            notifications
                                ? "active"
                                : ""
                        }`}
                        onClick={
                            handleNotifications
                        }
                        type="button"
                        aria-label="Toggle notifications"
                    >

                        <span></span>

                    </button>

                </div>


                {/* DARK MODE */}

                <div className="setting-row">

                    <div className="setting-info">

                        <div className="setting-title">
                            🌙 Dark Mode
                        </div>

                        <div className="setting-description">
                            Use a darker appearance for the application.
                        </div>

                    </div>


                    <button
                        className={`toggle ${
                            darkMode
                                ? "active"
                                : ""
                        }`}
                        onClick={
                            handleDarkMode
                        }
                        type="button"
                        aria-label="Toggle dark mode"
                    >

                        <span></span>

                    </button>

                </div>

            </section>


            {/* ==========================================
                LEARNING
            ========================================== */}

            <section className="settings-card">

                <div className="settings-card-header">

                    <div className="settings-card-icon">
                        🎤
                    </div>

                    <div>

                        <h2>
                            Learning
                        </h2>

                        <p>
                            Continue improving your English
                        </p>

                    </div>

                </div>


                <Link
                    to="/speaking"
                    className="settings-action"
                >

                    <div>

                        <strong>
                            🎤 Speaking Practice
                        </strong>

                        <span>
                            Practice your English and get AI feedback.
                        </span>

                    </div>

                    <span>
                        →
                    </span>

                </Link>


                <Link
                    to="/conversation"
                    className="settings-action"
                >

                    <div>

                        <strong>
                            🤖 AI Conversation
                        </strong>

                        <span>
                            Practice English with your AI speaking partner.
                        </span>

                    </div>

                    <span>
                        →
                    </span>

                </Link>


                <Link
                    to="/dashboard"
                    className="settings-action"
                >

                    <div>

                        <strong>
                            📊 My Progress
                        </strong>

                        <span>
                            View your scores and learning progress.
                        </span>

                    </div>

                    <span>
                        →
                    </span>

                </Link>

            </section>


            {/* ==========================================
                ACCOUNT
            ========================================== */}

            <section className="settings-card">

                <div className="settings-card-header">

                    <div className="settings-card-icon">
                        🔐
                    </div>

                    <div>

                        <h2>
                            Account
                        </h2>

                        <p>
                            Manage your account
                        </p>

                    </div>

                </div>


                <div className="account-actions">

                    <Link
                        to="/change-password"
                        className="account-button"
                    >
                        🔒 Change Password
                    </Link>


                    <button
                        type="button"
                        className="account-button danger"
                        onClick={
                            handleDeleteAccount
                        }
                    >
                        🗑️ Delete Account
                    </button>

                </div>

            </section>


            {/* ==========================================
                FOOTER NOTE
            ========================================== */}

            <div className="settings-note">

                <span>
                    💡
                </span>

                <p>
                    Your progress is automatically saved while you practice.
                </p>

            </div>

        </main>

    );

}

export default Settings;

