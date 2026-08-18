import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ConversationDetail.css";

const ConversationDetail = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [conversation, setConversation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // LOAD SINGLE CONVERSATION
    // ==========================================

    useEffect(() => {

        const fetchConversation = async () => {

            try {

                setLoading(true);
                setError("");

                // ==========================================
                // CHECK TOKEN
                // ==========================================

                const token =
                    localStorage.getItem("token");

                if (!token) {

                    navigate("/login");
                    return;

                }


                // ==========================================
                // CHECK CONVERSATION ID
                // ==========================================

                if (!id) {

                    throw new Error(
                        "Conversation ID is missing"
                    );

                }


                console.log(
                    "Loading conversation:",
                    id
                );


                // ==========================================
                // API REQUEST
                // IMPORTANT:
                // singular /conversation/:id
                // ==========================================

                const response = await fetch(
                    `https://speakup-ai-backend.onrender.com/api/ai/conversation/${id}`,
                    {
                        method: "GET",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


                // ==========================================
                // RESPONSE
                // ==========================================

                const data =
                    await response.json();


                console.log(
                    "Conversation API:",
                    data
                );


                // ==========================================
                // ERROR
                // ==========================================

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to load conversation"
                    );

                }


                // ==========================================
                // SAVE DATA
                // ==========================================

                if (!data.conversation) {

                    throw new Error(
                        "Conversation data not found"
                    );

                }


                setConversation(
                    data.conversation
                );


            } catch (error) {

                console.error(
                    "Conversation Detail Error:",
                    error
                );

                setError(
                    error.message ||
                    "Unable to load conversation"
                );


            } finally {

                setLoading(false);

            }

        };


        fetchConversation();

    }, [id, navigate]);


    // ==========================================
    // BACK TO HISTORY
    // ==========================================

    const goToHistory = () => {

        navigate(
            "/conversation-history"
        );

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="conversation-detail-page">

                <div className="detail-loading">

                    <div className="detail-spinner">
                        ⏳
                    </div>

                    <p>
                        Loading conversation...
                    </p>

                </div>

            </div>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (

            <div className="conversation-detail-page">

                <div className="detail-error">

                    <div className="detail-error-icon">
                        ⚠️
                    </div>

                    <h2>
                        Conversation not found
                    </h2>

                    <p>
                        {error}
                    </p>

                    <div className="detail-error-actions">

                        <button
                            type="button"
                            onClick={goToHistory}
                        >
                            ← Back to History
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                window.location.reload()
                            }
                        >
                            🔄 Try Again
                        </button>

                    </div>

                </div>

            </div>

        );

    }


    // ==========================================
    // NO CONVERSATION
    // ==========================================

    if (!conversation) {

        return (

            <div className="conversation-detail-page">

                <div className="detail-error">

                    <div className="detail-error-icon">
                        💬
                    </div>

                    <h2>
                        Conversation not found
                    </h2>

                    <p>
                        This conversation does not exist
                        or may have been deleted.
                    </p>

                    <button
                        type="button"
                        onClick={goToHistory}
                    >
                        ← Back to History
                    </button>

                </div>

            </div>

        );

    }


    // ==========================================
    // MESSAGES
    // ==========================================

    const messages =
        conversation.messages || [];


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="conversation-detail-page">

            <div className="conversation-detail-container">


                {/* ==================================
                    HEADER
                ================================== */}

                <div className="detail-header">

                    <button
                        type="button"
                        className="back-button"
                        onClick={goToHistory}
                        title="Back to History"
                    >
                        ←
                    </button>


                    <div className="detail-header-icon">
                        🤖
                    </div>


                    <div>

                        <h1>
                            Conversation
                        </h1>

                        <p>
                            English Practice
                        </p>

                    </div>

                </div>


                {/* ==================================
                    DATE
                ================================== */}

                <div className="conversation-date">

                    📅{" "}

                    {conversation.updatedAt
                        ? new Date(
                            conversation.updatedAt
                        ).toLocaleString()
                        : "Unknown date"}

                </div>


                {/* ==================================
                    CONVERSATION ID
                ================================== */}

                <div className="conversation-id">

                    Conversation ID:{" "}

                    <span>
                        {conversation._id}
                    </span>

                </div>


                {/* ==================================
                    MESSAGES
                ================================== */}

                <div className="detail-chat">

                    {messages.length === 0 ? (

                        <div className="empty-detail">

                            <div>
                                💬
                            </div>

                            <h3>
                                No messages
                            </h3>

                            <p>
                                This conversation does not
                                contain any messages.
                            </p>

                        </div>

                    ) : (

                        messages.map(
                            (message, index) => (

                                <div
                                    key={index}
                                    className={
                                        message.role === "user"
                                            ? "detail-message user-detail-message"
                                            : "detail-message ai-detail-message"
                                    }
                                >

                                    {/* Avatar */}

                                    <div className="detail-avatar">

                                        {message.role === "user"
                                            ? "👤"
                                            : "🤖"}

                                    </div>


                                    {/* Message */}

                                    <div className="detail-message-content">

                                        <span>

                                            {message.role === "user"
                                                ? "You"
                                                : "SpeakUp AI"}

                                        </span>


                                        <p>
                                            {message.text}
                                        </p>

                                    </div>

                                </div>

                            )
                        )

                    )}

                </div>


                {/* ==================================
                    FOOTER
                ================================== */}

                <div className="detail-footer">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/conversation"
                            )
                        }
                    >
                        🎤 Start New Conversation
                    </button>


                    <button
                        type="button"
                        className="history-footer-button"
                        onClick={goToHistory}
                    >
                        💬 View All History
                    </button>

                </div>

            </div>

        </div>

    );

};


export default ConversationDetail;