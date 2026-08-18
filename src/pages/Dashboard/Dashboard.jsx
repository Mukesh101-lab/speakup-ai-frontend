import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Dashboard.css";

function Dashboard() {

    const { user } = useAuth();

    const [stats, setStats] = useState({
        totalPracticeSessions: 0,
        totalConversations: 0,
        averageOverallScore: 0,
        averageGrammarScore: 0,
        averageFluencyScore: 0,
        averageVocabularyScore: 0,
        dailyStreak: 0
    });

    const [recentConversations, setRecentConversations] =
        useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // LOAD DASHBOARD DATA
    // ==========================================

    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                const token =
                    localStorage.getItem("token");

                if (!token) {

                    setError(
                        "Please login to view your dashboard."
                    );

                    setLoading(false);

                    return;
                }


                const response = await fetch(
                    "https://speakup-ai-backend.onrender.com/api/dashboard",
                    {
                        method: "GET",

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
                        "Failed to load dashboard"
                    );

                }


                // ==================================
                // SET STATS
                // ==================================

                setStats({
                    totalPracticeSessions:
                        data.stats?.totalPracticeSessions || 0,

                    totalConversations:
                        data.stats?.totalConversations || 0,

                    averageOverallScore:
                        data.stats?.averageOverallScore || 0,

                    averageGrammarScore:
                        data.stats?.averageGrammarScore || 0,

                    averageFluencyScore:
                        data.stats?.averageFluencyScore || 0,

                    averageVocabularyScore:
                        data.stats?.averageVocabularyScore || 0,

                    dailyStreak:
                        data.stats?.dailyStreak || 0
                });


                // ==================================
                // SET RECENT CONVERSATIONS
                // ==================================

                setRecentConversations(
                    data.recentConversations || []
                );


            } catch (error) {

                console.error(
                    "Dashboard Error:",
                    error
                );

                setError(
                    error.message ||
                    "Unable to load dashboard."
                );


            } finally {

                setLoading(false);

            }

        };


        fetchDashboard();

    }, []);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <main className="dashboard">

                <div className="dashboard-loading">

                    <div>
                        ⏳
                    </div>

                    <p>
                        Loading your dashboard...
                    </p>

                </div>

            </main>
        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <main className="dashboard">

                <div className="dashboard-error">

                    <div>
                        ⚠️
                    </div>

                    <h2>
                        Unable to load dashboard
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

            </main>
        );

    }


    return (

        <main className="dashboard">

            {/* ==================================
                HEADER
            ================================== */}

            <section className="dashboard-header">

                <div>

                    <span className="dashboard-label">
                        YOUR LEARNING DASHBOARD
                    </span>

                    <h1>
                        Welcome back,{" "}
                        {user?.name || "Learner"} 👋
                    </h1>

                    <p>
                        Keep practicing and improve your
                        English every day.
                    </p>

                </div>


                <Link
                    to="/speaking"
                    className="start-speaking-btn"
                >
                    🎤 Start Speaking
                </Link>

            </section>


            {/* ==================================
                STATS
            ================================== */}

            <section className="stats-grid">


                {/* ==================================
                    PRACTICE SESSIONS
                ================================== */}

                <div className="stat-card">

                    <div className="stat-icon">
                        🎤
                    </div>

                    <div>

                        <span>
                            Practice Sessions
                        </span>

                        <strong>
                            {stats.totalPracticeSessions}
                        </strong>

                    </div>

                </div>


                {/* ==================================
                    SPEAKING SCORE
                ================================== */}

                <div className="stat-card">

                    <div className="stat-icon">
                        ⭐
                    </div>

                    <div>

                        <span>
                            Speaking Score
                        </span>

                        <strong>
                            {stats.averageOverallScore}/100
                        </strong>

                    </div>

                </div>


                {/* ==================================
                    CONVERSATIONS
                ================================== */}

                <div className="stat-card">

                    <div className="stat-icon">
                        💬
                    </div>

                    <div>

                        <span>
                            Conversations
                        </span>

                        <strong>
                            {stats.totalConversations}
                        </strong>

                    </div>

                </div>


                {/* ==================================
                    FLUENCY
                ================================== */}

                <div className="stat-card">

                    <div className="stat-icon">
                        🗣️
                    </div>

                    <div>

                        <span>
                            Fluency Score
                        </span>

                        <strong>
                            {stats.averageFluencyScore}/100
                        </strong>

                    </div>

                </div>


                {/* ==================================
                    DAILY STREAK
                ================================== */}

                <div className="stat-card">

                    <div className="stat-icon">
                        🔥
                    </div>

                    <div>

                        <span>
                            Daily Streak
                        </span>

                        <strong>
                            {stats.dailyStreak} Days
                        </strong>

                    </div>

                </div>

            </section>


            {/* ==================================
                MAIN GRID
            ================================== */}

            <section className="dashboard-grid">


                {/* ==================================
                    DAILY CHALLENGE
                ================================== */}

                <div className="dashboard-card challenge-card">

                    <div className="card-top">

                        <div>

                            <span className="small-label">
                                TODAY'S CHALLENGE
                            </span>

                            <h2>
                                Talk about yourself
                            </h2>

                        </div>

                        <span className="challenge-icon">
                            🎯
                        </span>

                    </div>


                    <p>
                        Speak for 2 minutes about yourself,
                        your goals and your daily routine.
                    </p>


                    <Link
                        to="/speaking"
                        className="card-btn"
                    >
                        Start Challenge →
                    </Link>

                </div>


                {/* ==================================
                    AI CONVERSATION
                ================================== */}

                <div className="dashboard-card ai-card">

                    <div className="card-top">

                        <div>

                            <span className="small-label">
                                AI PRACTICE
                            </span>

                            <h2>
                                Talk with AI 🤖
                            </h2>

                        </div>

                        <span className="challenge-icon">
                            💬
                        </span>

                    </div>


                    <p>
                        Have a real-time English conversation
                        with your personal AI speaking partner.
                    </p>


                    <Link
                        to="/conversation"
                        className="card-btn"
                    >
                        Start Conversation →
                    </Link>

                </div>

            </section>


            {/* ==================================
                SPEAKING PROGRESS
            ================================== */}

            <section className="progress-card">

                <div className="progress-heading">

                    <div>

                        <span className="small-label">
                            YOUR PROGRESS
                        </span>

                        <h2>
                            English Speaking Level
                        </h2>

                    </div>


                    <strong>
                        {stats.averageOverallScore}%
                    </strong>

                </div>


                <div className="progress-bar">

                    <div
                        className="progress-fill"
                        style={{
                            width:
                                `${Math.min(
                                    stats.averageOverallScore,
                                    100
                                )}%`
                        }}
                    ></div>

                </div>


                <div className="progress-footer">

                    <span>
                        Beginner
                    </span>

                    <span>
                        Intermediate
                    </span>

                    <span>
                        Advanced
                    </span>

                </div>

            </section>


            {/* ==================================
                SCORE BREAKDOWN
            ================================== */}

            <section className="dashboard-card score-breakdown">

                <div className="card-top">

                    <div>

                        <span className="small-label">
                            PERFORMANCE
                        </span>

                        <h2>
                            Your English Skills
                        </h2>

                    </div>

                    <span className="challenge-icon">
                        📊
                    </span>

                </div>


                <div className="score-list">


                    {/* GRAMMAR */}

                    <div className="score-row">

                        <span>
                            Grammar
                        </span>

                        <strong>
                            {stats.averageGrammarScore}/100
                        </strong>

                    </div>


                    {/* FLUENCY */}

                    <div className="score-row">

                        <span>
                            Fluency
                        </span>

                        <strong>
                            {stats.averageFluencyScore}/100
                        </strong>

                    </div>


                    {/* VOCABULARY */}

                    <div className="score-row">

                        <span>
                            Vocabulary
                        </span>

                        <strong>
                            {stats.averageVocabularyScore}/100
                        </strong>

                    </div>

                </div>

            </section>


            {/* ==================================
                RECENT CONVERSATIONS
            ================================== */}

            <section className="dashboard-card recent-conversations">

                <div className="card-top">

                    <div>

                        <span className="small-label">
                            RECENT ACTIVITY
                        </span>

                        <h2>
                            Recent Conversations
                        </h2>

                    </div>


                    <Link
                        to="/conversation-history"
                        className="view-history-link"
                    >
                        View All →
                    </Link>

                </div>


                {recentConversations.length === 0 ? (

                    <div className="no-recent-conversations">

                        <div>
                            💬
                        </div>

                        <p>
                            No conversations yet.
                        </p>

                        <Link
                            to="/conversation"
                        >
                            Start your first conversation →
                        </Link>

                    </div>

                ) : (

                    <div className="recent-list">

                        {recentConversations.map(
                            (conversation) => (

                                <Link
                                    key={conversation.id}
                                    to={
                                        `/conversation/${conversation.id}`
                                    }
                                    className="recent-conversation-item"
                                >

                                    <div className="recent-icon">
                                        🤖
                                    </div>


                                    <div className="recent-info">

                                        <h3>
                                            {
                                                conversation.title
                                            }
                                        </h3>

                                        <span>
                                            💬{" "}
                                            {
                                                conversation.messageCount
                                            }{" "}
                                            messages
                                        </span>

                                    </div>


                                    <span className="recent-arrow">
                                        →
                                    </span>

                                </Link>

                            )
                        )}

                    </div>

                )}

            </section>

        </main>
    );
}

export default Dashboard;