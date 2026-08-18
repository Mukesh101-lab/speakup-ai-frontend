import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ConversationHistory.css";

const ConversationHistory = () => {

    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const navigate = useNavigate();


    // ==========================================
    // LOAD HISTORY
    // ==========================================

    useEffect(() => {

        const fetchHistory = async () => {

            try {

                const token =
                    localStorage.getItem("token");

                if (!token) {
                    navigate("/login");
                    return;
                }


                const response = await fetch(
                    "https://speakup-ai-backend.onrender.com/api/ai/conversations",
                    {
                        method: "GET",

                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        }
                    }
                );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to load history"
                    );

                }


                setConversations(
                    data.conversations || []
                );


            } catch (error) {

                console.error(
                    "History Error:",
                    error
                );

                setError(
                    error.message ||
                    "Unable to load conversation history"
                );


            } finally {

                setLoading(false);

            }

        };


        fetchHistory();

    }, [navigate]);


    // ==========================================
    // DELETE CONVERSATION
    // ==========================================

    const deleteConversation = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this conversation?"
        );


        if (!confirmDelete) {
            return;
        }


        try {

            setDeletingId(id);


            const token =
                localStorage.getItem("token");


            if (!token) {

                navigate("/login");
                return;

            }


            const response = await fetch(
                `https://speakup-ai-backend.onrender.com/api/ai/conversation/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to delete conversation"
                );

            }


            // Remove deleted conversation
            // immediately from UI

            setConversations((prev) =>
                prev.filter(
                    (conversation) =>
                        conversation._id !== id
                )
            );


        } catch (error) {

            console.error(
                "Delete Conversation Error:",
                error
            );


            alert(
                error.message ||
                "Failed to delete conversation"
            );


        } finally {

            setDeletingId(null);

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="history-page">

                <div className="history-loading">

                    <div className="history-spinner">
                        ⏳
                    </div>

                    <p>
                        Loading conversations...
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

            <div className="history-page">

                <div className="history-error">

                    <div>
                        ⚠️
                    </div>

                    <h2>
                        Something went wrong
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={() =>
                            window.location.reload()
                        }
                    >
                        Try Again
                    </button>

                </div>

            </div>

        );

    }


    // ==========================================
    // EMPTY
    // ==========================================

    if (conversations.length === 0) {

        return (

            <div className="history-page">

                <div className="history-container">

                    <div className="history-header">

                        <div className="history-icon">
                            💬
                        </div>

                        <div>

                            <h1>
                                Conversation History
                            </h1>

                            <p>
                                Your previous English conversations
                            </p>

                        </div>

                    </div>


                    <div className="empty-history">

                        <div className="empty-icon">
                            💬
                        </div>

                        <h2>
                            No conversations yet
                        </h2>

                        <p>
                            Start an AI conversation to see
                            your history here.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/conversation")
                            }
                        >
                            🎤 Start Conversation
                        </button>

                    </div>

                </div>

            </div>

        );

    }


    // ==========================================
    // HISTORY
    // ==========================================

    return (

        <div className="history-page">

            <div className="history-container">


                {/* HEADER */}

                <div className="history-header">

                    <div className="history-icon">
                        💬
                    </div>

                    <div>

                        <h1>
                            Conversation History
                        </h1>

                        <p>
                            Review your English practice
                            conversations
                        </p>

                    </div>

                </div>


                {/* CONVERSATIONS */}

                <div className="history-list">

                    {conversations.map(
                        (conversation) => {

                            const messages =
                                conversation.messages || [];


                            const firstUserMessage =
                                messages.find(
                                    (message) =>
                                        message.role === "user"
                                );


                            const messageCount =
                                messages.length;


                            return (

                                <div
                                    className="history-card"
                                    key={conversation._id}
                                >


                                    {/* CARD TOP */}

                                    <div className="history-card-top">

                                        <div className="conversation-card-icon">
                                            🤖
                                        </div>


                                        <div className="conversation-card-info">

                                            <h3>

                                                {firstUserMessage
                                                    ? firstUserMessage.text
                                                    : "English Conversation"}

                                            </h3>


                                            <span>

                                                {conversation.updatedAt
                                                    ? new Date(
                                                        conversation.updatedAt
                                                    ).toLocaleString()
                                                    : "Recently"}

                                            </span>

                                        </div>

                                    </div>


                                    {/* PREVIEW */}

                                    <div className="history-preview">

                                        {messages
                                            .slice(0, 2)
                                            .map(
                                                (
                                                    message,
                                                    index
                                                ) => (

                                                    <p
                                                        key={index}
                                                        className={
                                                            message.role ===
                                                            "user"
                                                                ? "preview-user"
                                                                : "preview-ai"
                                                        }
                                                    >

                                                        <strong>

                                                            {message.role ===
                                                            "user"
                                                                ? "You:"
                                                                : "AI:"}

                                                        </strong>

                                                        {" "}

                                                        {message.text}

                                                    </p>

                                                )
                                            )}

                                    </div>


                                    {/* CARD BOTTOM */}

                                    <div className="history-card-bottom">


                                        <span>
                                            💬 {messageCount} messages
                                        </span>


                                        <div className="history-card-actions">


                                            {/* VIEW */}

                                            <button
                                                type="button"
                                                className="view-button"
                                                onClick={() =>
                                                    navigate(
                                                        `/conversation/${conversation._id}`
                                                    )
                                                }
                                            >
                                                View Conversation →
                                            </button>


                                            {/* DELETE */}

                                            <button
                                                type="button"
                                                className="delete-button"
                                                disabled={
                                                    deletingId ===
                                                    conversation._id
                                                }
                                                onClick={() =>
                                                    deleteConversation(
                                                        conversation._id
                                                    )
                                                }
                                            >

                                                {deletingId ===
                                                conversation._id
                                                    ? "⏳ Deleting..."
                                                    : "🗑️ Delete"}

                                            </button>


                                        </div>

                                    </div>

                                </div>

                            );

                        }
                    )}

                </div>


                {/* START NEW */}

                <div className="new-conversation">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/conversation")
                        }
                    >
                        🎤 Start New Conversation
                    </button>

                </div>

            </div>

        </div>

    );

};


export default ConversationHistory;