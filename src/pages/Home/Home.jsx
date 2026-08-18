import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
    return (
        <main>

            <section className="hero">

                <div className="hero-content">

                    <div className="badge">
                        🚀 AI-Powered English Practice
                    </div>

                    <h1>
                        Speak English
                        <span> Confidently.</span>
                    </h1>

                    <p>
                        Practice English with AI, improve your grammar,
                        build vocabulary and become a confident speaker.
                    </p>

                    <div className="hero-buttons">

                        <Link
                            to="/speaking"
                            className="primary-btn"
                        >
                            Start Speaking 🎤
                        </Link>

                        <Link
                            to="/conversation"
                            className="secondary-btn"
                        >
                            Talk with AI 🤖
                        </Link>

                    </div>

                    <div className="hero-stats">
                        <div>
                            <strong>10K+</strong>
                            <span>Learners</span>
                        </div>

                        <div>
                            <strong>50K+</strong>
                            <span>Conversations</span>
                        </div>

                        <div>
                            <strong>4.9/5</strong>
                            <span>User Rating</span>
                        </div>
                    </div>

                </div>

                <div className="hero-card">

                    <div className="ai-circle">
                        🎤
                    </div>

                    <h3>
                        Ready to practice?
                    </h3>

                    <p>
                        Start a conversation and improve
                        your English today.
                    </p>

                    <div className="voice-line">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    <div className="listening">
                        ● AI Listening
                    </div>

                </div>

            </section>

            <section className="features">

                <div className="section-heading">
                    <span>WHY SPEAKUP AI?</span>

                    <h2>
                        Everything you need to improve
                        your English.
                    </h2>
                </div>

                <div className="feature-grid">

                    <div className="feature-card">
                        <div>🎤</div>
                        <h3>Speaking Practice</h3>
                        <p>
                            Practice real English conversations
                            and improve your fluency.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div>🤖</div>
                        <h3>AI Conversation</h3>
                        <p>
                            Talk with an AI partner anytime
                            you want.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div>📝</div>
                        <h3>Grammar Correction</h3>
                        <p>
                            Get instant corrections and
                            understand your mistakes.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div>📊</div>
                        <h3>Track Progress</h3>
                        <p>
                            Monitor your speaking score and
                            improvement.
                        </p>
                    </div>

                </div>

            </section>

        </main>
    );
}

export default Home;