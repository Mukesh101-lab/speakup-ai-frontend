import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ChangePassword.css";

function ChangePassword() {

    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [success, setSuccess] =
        useState("");

    const [error, setError] =
        useState("");


    // ==========================================
    // CHANGE PASSWORD
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // ==========================================
        // VALIDATION
        // ==========================================

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {

            setError(
                "Please fill in all password fields."
            );

            return;
        }


        if (newPassword.length < 6) {

            setError(
                "New password must be at least 6 characters."
            );

            return;
        }


        if (newPassword !== confirmPassword) {

            setError(
                "New password and confirm password do not match."
            );

            return;
        }


        if (currentPassword === newPassword) {

            setError(
                "New password must be different from your current password."
            );

            return;
        }


        // ==========================================
        // TOKEN
        // ==========================================

        const token =
            localStorage.getItem("token");


        if (!token) {

            setError(
                "Please login again."
            );

            return;
        }


        try {

            setLoading(true);


            // ==========================================
            // API REQUEST
            // ==========================================

            const response =
                await fetch(
                    "https://speakup-ai-backend.onrender.com/api/auth/change-password",
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({

                            currentPassword,

                            newPassword,

                            confirmPassword

                        })
                    }
                );


            const data =
                await response.json();


            // ==========================================
            // API ERROR
            // ==========================================

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to change password"
                );

            }


            // ==========================================
            // SUCCESS
            // ==========================================

            setSuccess(
                data.message ||
                "Password changed successfully!"
            );


            // CLEAR FORM

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");


            // ==========================================
            // GO BACK TO SETTINGS
            // ==========================================

            setTimeout(() => {

                navigate("/settings");

            }, 1500);


        } catch (error) {

            console.error(
                "Change Password Error:",
                error
            );

            setError(
                error.message ||
                "Unable to change password."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <main className="change-password-page">

            <div className="change-password-container">


                {/* ==================================
                    HEADER
                ================================== */}

                <div className="change-password-header">

                    <Link
                        to="/settings"
                        className="back-link"
                    >
                        ← Back to Settings
                    </Link>


                    <div className="password-icon">
                        🔐
                    </div>


                    <h1>
                        Change Password
                    </h1>


                    <p>
                        Keep your account secure with a
                        strong password.
                    </p>

                </div>


                {/* ==================================
                    CARD
                ================================== */}

                <div className="change-password-card">

                    <form
                        onSubmit={handleSubmit}
                        className="change-password-form"
                    >


                        {/* CURRENT PASSWORD */}

                        <div className="form-group">

                            <label htmlFor="currentPassword">
                                Current Password
                            </label>

                            <input
                                id="currentPassword"
                                type="password"
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter current password"
                                disabled={loading}
                            />

                        </div>


                        {/* NEW PASSWORD */}

                        <div className="form-group">

                            <label htmlFor="newPassword">
                                New Password
                            </label>

                            <input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter new password"
                                minLength={6}
                                disabled={loading}
                            />

                            <span className="input-hint">
                                Password must contain at least
                                6 characters.
                            </span>

                        </div>


                        {/* CONFIRM PASSWORD */}

                        <div className="form-group">

                            <label htmlFor="confirmPassword">
                                Confirm New Password
                            </label>

                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Confirm new password"
                                minLength={6}
                                disabled={loading}
                            />

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="password-message error-message">

                                <span>
                                    ⚠️
                                </span>

                                {error}

                            </div>

                        )}


                        {/* SUCCESS */}

                        {success && (

                            <div className="password-message success-message">

                                <span>
                                    ✅
                                </span>

                                {success}

                            </div>

                        )}


                        {/* BUTTONS */}

                        <div className="form-actions">

                            <Link
                                to="/settings"
                                className="cancel-btn"
                            >
                                Cancel
                            </Link>


                            <button
                                type="submit"
                                className="change-password-btn"
                                disabled={loading}
                            >

                                {loading
                                    ? "Changing..."
                                    : "Change Password"
                                }

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </main>

    );

}

export default ChangePassword;