
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./EditProfile.css";

function EditProfile() {

    const { user } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");


    // ==========================================
    // LOAD USER DATA
    // ==========================================

    useEffect(() => {

        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
        }

    }, [user]);


    // ==========================================
    // UPDATE PROFILE
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setSuccess("");
        setError("");


        // ==========================================
        // VALIDATE NAME
        // ==========================================

        const trimmedName = name.trim();

        if (!trimmedName) {

            setError("Name is required.");
            return;

        }

        if (trimmedName.length < 2) {

            setError(
                "Name must be at least 2 characters."
            );

            return;

        }

        if (trimmedName.length > 50) {

            setError(
                "Name cannot exceed 50 characters."
            );

            return;

        }


        // ==========================================
        // GET TOKEN
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

            const response = await fetch(
                "https://speakup-ai-backend.onrender.com/api/auth/profile",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        name: trimmedName
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
                    "Failed to update profile"
                );

            }


            // ==========================================
            // SUCCESS
            // ==========================================

            setSuccess(
                data.message ||
                "Profile updated successfully!"
            );


            // ==========================================
            // UPDATE LOCAL STORAGE
            // ==========================================

            if (data.user) {

                const storedUser =
                    localStorage.getItem("user");

                let currentUser = {};

                try {

                    currentUser =
                        storedUser
                            ? JSON.parse(storedUser)
                            : {};

                } catch {

                    currentUser = {};

                }


                const updatedUser = {
                    ...currentUser,
                    ...data.user
                };


                localStorage.setItem(
                    "user",
                    JSON.stringify(updatedUser)
                );

            }


            // ==========================================
            // REDIRECT
            // ==========================================

            setTimeout(() => {

                navigate("/dashboard");

                window.location.reload();

            }, 1000);


        } catch (error) {

            console.error(
                "Update Profile Error:",
                error
            );


            setError(
                error.message ||
                "Unable to update profile."
            );


        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <main className="edit-profile-page">

            <div className="edit-profile-container">


                {/* ==================================
                    HEADER
                ================================== */}

                <div className="edit-profile-header">

                    <Link
                        to="/settings"
                        className="back-link"
                    >
                        ← Back to Settings
                    </Link>


                    <div className="profile-avatar">

                        {name
                            ? name
                                .trim()
                                .charAt(0)
                                .toUpperCase()
                            : "U"
                        }

                    </div>


                    <h1>
                        Edit Profile
                    </h1>


                    <p>
                        Update your profile information
                    </p>

                </div>


                {/* ==================================
                    PROFILE CARD
                ================================== */}

                <div className="edit-profile-card">


                    <form
                        onSubmit={handleSubmit}
                        className="edit-profile-form"
                    >


                        {/* ==================================
                            NAME
                        ================================== */}

                        <div className="form-group">

                            <label htmlFor="name">
                                Full Name
                            </label>


                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                placeholder="Enter your full name"
                                maxLength={50}
                                disabled={loading}
                                autoComplete="name"
                            />


                            <span className="input-hint">
                                Your name will appear on your dashboard.
                            </span>

                        </div>


                        {/* ==================================
                            EMAIL
                        ================================== */}

                        <div className="form-group">

                            <label htmlFor="email">
                                Email Address
                            </label>


                            <input
                                id="email"
                                type="email"
                                value={email}
                                disabled
                                className="disabled-input"
                                autoComplete="email"
                            />


                            <span className="input-hint">
                                Email cannot be changed from this page.
                            </span>

                        </div>


                        {/* ==================================
                            ERROR MESSAGE
                        ================================== */}

                        {error && (

                            <div className="profile-message error-message">

                                <span className="message-icon">
                                    ⚠️
                                </span>

                                <span>
                                    {error}
                                </span>

                            </div>

                        )}


                        {/* ==================================
                            SUCCESS MESSAGE
                        ================================== */}

                        {success && (

                            <div className="profile-message success-message">

                                <span className="message-icon">
                                    ✅
                                </span>

                                <span>
                                    {success}
                                </span>

                            </div>

                        )}


                        {/* ==================================
                            ACTION BUTTONS
                        ================================== */}

                        <div className="form-actions">


                            <Link
                                to="/settings"
                                className="cancel-btn"
                            >
                                Cancel
                            </Link>


                            <button
                                type="submit"
                                className="update-profile-btn"
                                disabled={loading}
                            >

                                {loading
                                    ? "Updating..."
                                    : "Update Profile"
                                }

                            </button>


                        </div>

                    </form>

                </div>


                {/* ==================================
                    FOOTER NOTE
                ================================== */}

                <p className="profile-security-note">
                    🔒 Your profile information is securely stored.
                </p>


            </div>

        </main>

    );

}

export default EditProfile;

