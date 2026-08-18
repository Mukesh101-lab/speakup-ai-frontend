import { useState, useRef } from "react";
import "./Speaking.css";

const Speaking = () => {

    // ==========================================
    // STATES
    // ==========================================

    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState("");
    const [isListening, setIsListening] = useState(false);

    const recognitionRef = useRef(null);


    // ==========================================
    // START SPEAKING
    // ==========================================

    const startListening = () => {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {

            setError(
                "Speech recognition is not supported in this browser. Please use Google Chrome."
            );

            return;
        }

        try {

            const recognition = new SpeechRecognition();

            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = "en-US";


            recognition.onstart = () => {

                setIsListening(true);
                setError("");

            };


            recognition.onresult = (event) => {

                let finalTranscript = "";

                for (
                    let i = event.resultIndex;
                    i < event.results.length;
                    i++
                ) {

                    const transcriptPart =
                        event.results[i][0].transcript;

                    if (event.results[i].isFinal) {

                        finalTranscript +=
                            transcriptPart + " ";

                    }

                }


                if (finalTranscript.trim()) {

                    setText((previousText) => {

                        const updatedText =
                            `${previousText} ${finalTranscript}`
                                .replace(/\s+/g, " ")
                                .trim();

                        return updatedText;

                    });

                }

            };


            recognition.onerror = (event) => {

                console.error(
                    "Speech Recognition Error:",
                    event.error
                );

                setIsListening(false);

                if (event.error === "not-allowed") {

                    setError(
                        "Microphone permission was denied. Please allow microphone access."
                    );

                } else if (event.error === "no-speech") {

                    setError(
                        "No speech detected. Please try speaking again."
                    );

                } else {

                    setError(
                        `Microphone error: ${event.error}`
                    );

                }

            };


            recognition.onend = () => {

                setIsListening(false);
                recognitionRef.current = null;

            };


            recognitionRef.current = recognition;

            recognition.start();

        } catch (err) {

            console.error(
                "Microphone Error:",
                err
            );

            setError(
                "Unable to start microphone."
            );

            setIsListening(false);

        }

    };


    // ==========================================
    // STOP SPEAKING
    // ==========================================

    const stopListening = () => {

        if (recognitionRef.current) {

            recognitionRef.current.stop();
            recognitionRef.current = null;

        }

        setIsListening(false);

    };


    // ==========================================
    // CLEAR SPEECH
    // ==========================================

    const clearSpeech = () => {

        if (isListening) {
            stopListening();
        }

        setText("");
        setAnalysis(null);
        setError("");

    };


    // ==========================================
    // CHECK MY ENGLISH
    // ==========================================

    const checkMyEnglish = async () => {

        if (!text.trim()) {

            setError(
                "Please speak something first."
            );

            return;

        }


        try {

            setLoading(true);
            setError("");
            setAnalysis(null);


            const token =
                localStorage.getItem("token");


            if (!token) {

                setError(
                    "Please login first."
                );

                return;

            }


            const response = await fetch(
                "https://speakup-ai-backend.onrender.com/api/ai/analyze",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        text: text.trim()
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "AI analysis failed"
                );

            }


            setAnalysis(
                data.analysis
            );


        } catch (err) {

            console.error(
                "AI Analysis Error:",
                err
            );

            setError(
                err.message ||
                "Something went wrong."
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="speaking-page">

            <div className="speaking-container">


                {/* ================================= */}
                {/* HEADER */}
                {/* ================================= */}

                <div className="speaking-header">

                    <h1>
                        🎤 English Speaking Practice
                    </h1>

                    <p>
                        Speak naturally and check
                        your English performance.
                    </p>

                </div>


                {/* ================================= */}
                {/* SPEAKING CARD */}
                {/* ================================= */}

                <div className="speaking-card">


                    {/* ================================= */}
                    {/* PROFESSIONAL MICROPHONE */}
                    {/* ================================= */}

                    <div className="mic-wrapper">

                        <button
                            type="button"
                            className={
                                isListening
                                    ? "mic-button listening"
                                    : "mic-button"
                            }
                            onClick={
                                isListening
                                    ? stopListening
                                    : startListening
                            }
                            aria-label={
                                isListening
                                    ? "Stop speaking"
                                    : "Start speaking"
                            }
                        >

                            <span className="mic-icon">
                                🎤
                            </span>

                        </button>


                        <p className="mic-status">

                            {isListening
                                ? "Listening..."
                                : "Tap to speak"
                            }

                        </p>

                    </div>


                    {/* ================================= */}
                    {/* TRANSCRIPT */}
                    {/* ================================= */}

                    <textarea
                        value={text}
                        onChange={(e) =>
                            setText(e.target.value)
                        }
                        placeholder={
                            isListening
                                ? "Listening... speak in English"
                                : "Click the microphone and speak in English..."
                        }
                        rows="8"
                    />


                    {/* ================================= */}
                    {/* ACTION BUTTONS */}
                    {/* ================================= */}

                    <div className="speaking-actions">

                        <button
                            type="button"
                            className="clear-button"
                            onClick={clearSpeech}
                            disabled={
                                loading ||
                                isListening ||
                                !text
                            }
                        >

                            🗑️ Clear

                        </button>


                        <button
                            type="button"
                            className="check-button"
                            onClick={checkMyEnglish}
                            disabled={
                                loading ||
                                !text.trim()
                            }
                        >

                            {loading
                                ? "⏳ Analyzing..."
                                : "✨ Check My English"
                            }

                        </button>

                    </div>

                </div>


                {/* ================================= */}
                {/* ERROR */}
                {/* ================================= */}

                {error && (

                    <div className="error-message">

                        ⚠️ {error}

                    </div>

                )}


                {/* ================================= */}
                {/* ANALYSIS RESULT */}
                {/* ================================= */}

                {analysis && (

                    <div className="analysis-result">

                        <h2>
                            🎯 Your English Score
                        </h2>


                        {/* Overall Score */}

                        <div className="overall-score">

                            <strong>
                                {analysis.overallScore}
                            </strong>

                            <span>
                                /100
                            </span>

                        </div>


                        {/* Score Cards */}

                        <div className="score-grid">


                            <div className="score-card">

                                <h3>
                                    📝 Grammar
                                </h3>

                                <strong>
                                    {analysis.grammarScore}
                                </strong>

                                <span>
                                    /100
                                </span>

                            </div>


                            <div className="score-card">

                                <h3>
                                    🗣️ Fluency
                                </h3>

                                <strong>
                                    {analysis.fluencyScore}
                                </strong>

                                <span>
                                    /100
                                </span>

                            </div>


                            <div className="score-card">

                                <h3>
                                    📚 Vocabulary
                                </h3>

                                <strong>
                                    {analysis.vocabularyScore}
                                </strong>

                                <span>
                                    /100
                                </span>

                            </div>

                        </div>


                        {/* Corrected Version */}

                        <div className="result-section">

                            <h3>
                                ✨ Corrected Version
                            </h3>

                            <p>
                                {analysis.correctedText}
                            </p>

                        </div>


                        {/* Grammar Mistakes */}

                        <div className="result-section">

                            <h3>
                                ❌ Grammar Mistakes
                            </h3>


                            {!analysis.mistakes ||
                            analysis.mistakes.length === 0 ? (

                                <p>
                                    🎉 No major mistakes found!
                                </p>

                            ) : (

                                analysis.mistakes.map(
                                    (mistake, index) => (

                                        <div
                                            className="mistake"
                                            key={index}
                                        >

                                            <p>
                                                ❌{" "}
                                                <strong>
                                                    {mistake.original}
                                                </strong>
                                            </p>

                                            <p>
                                                ✅{" "}
                                                <strong>
                                                    {mistake.correction}
                                                </strong>
                                            </p>

                                            <small>
                                                {
                                                    mistake.explanation
                                                }
                                            </small>

                                        </div>

                                    )
                                )

                            )}

                        </div>


                        {/* Better Vocabulary */}

                        {analysis.betterVocabulary &&
                        analysis.betterVocabulary.length > 0 && (

                            <div className="result-section">

                                <h3>
                                    📚 Better Vocabulary
                                </h3>


                                {analysis.betterVocabulary.map(
                                    (item, index) => (

                                        <div
                                            className="vocabulary-item"
                                            key={index}
                                        >

                                            <strong>
                                                {item.word}
                                            </strong>

                                            <span>
                                                {item.meaning}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        )}


                        {/* Feedback */}

                        <div className="feedback">

                            <h3>
                                💡 AI Feedback
                            </h3>

                            <p>
                                {analysis.feedback}
                            </p>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

};


export default Speaking;