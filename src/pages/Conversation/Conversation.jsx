import { useState, useRef, useEffect } from "react";
import "./Conversation.css";

const INITIAL_MESSAGE = {
    role: "ai",
    text: "Hello! 👋 I'm your English conversation partner. Let's practice English together."
};

const Conversation = () => {

    // ==========================================
    // STATES
    // ==========================================

    const [messages, setMessages] = useState([
        INITIAL_MESSAGE
    ]);

    const [input, setInput] = useState("");

    const [loading, setLoading] = useState(false);

    const [isListening, setIsListening] = useState(false);

    const [isSpeaking, setIsSpeaking] = useState(false);

    const [speakingMessageIndex, setSpeakingMessageIndex] =
        useState(null);


    // ==========================================
    // REFS
    // ==========================================

    const recognitionRef = useRef(null);

    const finalTranscriptRef = useRef("");

    const startingTextRef = useRef("");


    // ==========================================
    // CLEANUP
    // ==========================================

    useEffect(() => {

        return () => {

            // Stop microphone
            if (recognitionRef.current) {

                try {
                    recognitionRef.current.abort();
                } catch (error) {
                    console.error(error);
                }

                recognitionRef.current = null;
            }


            // Stop AI voice
            if (
                "speechSynthesis" in window
            ) {

                window.speechSynthesis.cancel();

            }

        };

    }, []);


    // ==========================================
    // TEXT TO SPEECH
    // ==========================================

    const speakAI = (text, messageIndex = null) => {

        if (!text) {
            return;
        }


        if (
            !("speechSynthesis" in window)
        ) {

            alert(
                "Text-to-Speech is not supported in this browser."
            );

            return;
        }


        // Stop current speech
        window.speechSynthesis.cancel();


        const speech =
            new SpeechSynthesisUtterance(text);


        speech.lang = "en-US";

        speech.rate = 0.95;

        speech.pitch = 1;

        speech.volume = 1;


        speech.onstart = () => {

            setIsSpeaking(true);

            setSpeakingMessageIndex(
                messageIndex
            );

        };


        speech.onend = () => {

            setIsSpeaking(false);

            setSpeakingMessageIndex(null);

        };


        speech.onerror = () => {

            setIsSpeaking(false);

            setSpeakingMessageIndex(null);

        };


        window.speechSynthesis.speak(
            speech
        );

    };


    // ==========================================
    // STOP AI SPEAKING
    // ==========================================

    const stopSpeaking = () => {

        if (
            "speechSynthesis" in window
        ) {

            window.speechSynthesis.cancel();

        }

        setIsSpeaking(false);

        setSpeakingMessageIndex(null);

    };


    // ==========================================
    // SEND MESSAGE
    // ==========================================

    const sendMessage = async () => {

        if (
            !input.trim() ||
            loading
        ) {
            return;
        }


        // Stop microphone
        if (recognitionRef.current) {

            try {
                recognitionRef.current.stop();
            } catch (error) {
                console.error(error);
            }

            recognitionRef.current = null;

            setIsListening(false);

        }


        // Stop previous AI voice
        stopSpeaking();


        const userMessage =
            input.trim();


        // Add user message
        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                text: userMessage
            }
        ]);


        // Clear input
        setInput("");


        finalTranscriptRef.current = "";

        startingTextRef.current = "";


        setLoading(true);


        try {

            // ==================================
            // TOKEN
            // ==================================

            const token =
                localStorage.getItem(
                    "token"
                );


            if (!token) {

                throw new Error(
                    "Authentication token not found"
                );

            }


            // ==================================
            // API
            // ==================================

            const response =
                await fetch(
                    "https://speakup-ai-backend.onrender.com/api/ai/conversation",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            message: userMessage
                        })
                    }
                );


            const data =
                await response.json();


            // ==================================
            // ERROR
            // ==================================

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Conversation failed"
                );

            }


            // ==================================
            // AI REPLY
            // ==================================

            const aiReply =
                data.reply ||
                "I couldn't generate a response.";


            setMessages((prev) => {

                const newMessages = [
                    ...prev,
                    {
                        role: "ai",
                        text: aiReply
                    }
                ];


                // Speak newly added AI message
                const newIndex =
                    newMessages.length - 1;


                setTimeout(() => {

                    speakAI(
                        aiReply,
                        newIndex
                    );

                }, 100);


                return newMessages;

            });


        } catch (error) {

            console.error(
                "Conversation Error:",
                error
            );


            const errorMessage =
                error.message ===
                    "Authentication token not found"
                    ? "Please login again to continue."
                    : error.message ||
                    "Sorry, I couldn't respond right now. Please try again.";


            setMessages((prev) => [
                ...prev,
                {
                    role: "ai",
                    text: errorMessage
                }
            ]);


        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // START SPEAKING
    // ==========================================

    const startListening = () => {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;


        // Browser support
        if (!SpeechRecognition) {

            alert(
                "Speech recognition is not supported in this browser. Please use Google Chrome."
            );

            return;
        }


        // Already listening
        if (recognitionRef.current) {

            return;

        }


        // Stop AI speech
        stopSpeaking();


        const recognition =
            new SpeechRecognition();


        // ======================================
        // SETTINGS
        // ======================================

        recognition.continuous = false;

        recognition.interimResults = true;

        recognition.lang = "en-US";

        recognition.maxAlternatives = 1;


        // ======================================
        // EXISTING INPUT
        // ======================================

        startingTextRef.current =
            input.trim();


        finalTranscriptRef.current =
            "";


        // ======================================
        // START
        // ======================================

        recognition.onstart = () => {

            setIsListening(true);

        };


        // ======================================
        // RESULT
        // ======================================

        recognition.onresult =
            (event) => {

                let finalText = "";

                let interimText = "";


                for (
                    let i = event.resultIndex;
                    i < event.results.length;
                    i++
                ) {

                    const result =
                        event.results[i];


                    const transcript =
                        result[0]
                            .transcript;


                    if (
                        result.isFinal
                    ) {

                        finalText +=
                            transcript;

                    } else {

                        interimText +=
                            transcript;

                    }

                }


                // ==================================
                // FINAL TEXT
                // ==================================

                if (
                    finalText.trim()
                ) {

                    finalTranscriptRef.current =
                        `${finalTranscriptRef.current} ${finalText}`
                            .replace(
                                /\s+/g,
                                " "
                            )
                            .trim();

                }


                // ==================================
                // DISPLAY
                // ==================================

                const combinedText =
                    `${startingTextRef.current} ${finalTranscriptRef.current} ${interimText}`
                        .replace(
                            /\s+/g,
                            " "
                        )
                        .trim();


                setInput(
                    combinedText
                );

            };


        // ======================================
        // ERROR
        // ======================================

        recognition.onerror =
            (event) => {

                console.error(
                    "Speech Recognition Error:",
                    event.error
                );


                if (
                    event.error ===
                    "not-allowed"
                ) {

                    alert(
                        "Microphone permission denied. Please allow microphone access in Chrome."
                    );

                }


                if (
                    event.error ===
                    "service-not-allowed"
                ) {

                    alert(
                        "Speech recognition service is not available."
                    );

                }


                setIsListening(false);

                recognitionRef.current =
                    null;

            };


        // ======================================
        // END
        // ======================================

        recognition.onend = () => {

            setIsListening(false);

            recognitionRef.current =
                null;


            // Keep only final text
            const finalText =
                `${startingTextRef.current} ${finalTranscriptRef.current}`
                    .replace(
                        /\s+/g,
                        " "
                    )
                    .trim();


            if (finalText) {

                setInput(
                    finalText
                );

            }

        };


        // ======================================
        // SAVE
        // ======================================

        recognitionRef.current =
            recognition;


        // ======================================
        // START MIC
        // ======================================

        try {

            recognition.start();

        } catch (error) {

            console.error(
                "Microphone Start Error:",
                error
            );


            setIsListening(false);

            recognitionRef.current =
                null;

        }

    };


    // ==========================================
    // STOP LISTENING
    // ==========================================

    const stopListening = () => {

        if (
            recognitionRef.current
        ) {

            try {

                recognitionRef.current.stop();

            } catch (error) {

                console.error(error);

            }

        }


        setIsListening(false);

    };


    // ==========================================
    // TOGGLE MICROPHONE
    // ==========================================

    const toggleListening = () => {

        if (loading) {
            return;
        }


        if (isListening) {

            stopListening();

        } else {

            startListening();

        }

    };


    // ==========================================
    // KEYBOARD
    // ==========================================

    const handleKeyDown = (e) => {

        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {

            e.preventDefault();

            sendMessage();

        }

    };


    // ==========================================
    // CLEAR CONVERSATION
    // ==========================================

    const clearConversation = () => {

        // Stop microphone
        if (
            recognitionRef.current
        ) {

            try {

                recognitionRef.current.abort();

            } catch (error) {

                console.error(error);

            }

            recognitionRef.current =
                null;

        }


        // Stop AI speech
        stopSpeaking();


        setIsListening(false);

        setLoading(false);

        setInput("");


        finalTranscriptRef.current =
            "";

        startingTextRef.current =
            "";


        setMessages([
            INITIAL_MESSAGE
        ]);

    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="conversation-page">

            <div className="conversation-container">


                {/* ==================================
                    HEADER
                ================================== */}

                <div className="conversation-header">

                    <div className="ai-avatar">
                        🤖
                    </div>

                    <div>

                        <h1>
                            AI Conversation
                        </h1>

                        <p>
                            Practice English with your AI partner
                        </p>

                    </div>

                </div>


                {/* ==================================
                    CHAT
                ================================== */}

                <div className="chat-box">

                    {messages.map(
                        (message, index) => (

                            <div
                                key={index}
                                className={
                                    message.role === "user"
                                        ? "message user-message"
                                        : "message ai-message"
                                }
                            >

                                {/* Avatar */}

                                <div className="message-avatar">

                                    {message.role === "user"
                                        ? "👤"
                                        : "🤖"
                                    }

                                </div>


                                {/* Content */}

                                <div className="message-content">

                                    <span className="message-name">

                                        {message.role === "user"
                                            ? "You"
                                            : "SpeakUp AI"
                                        }

                                    </span>


                                    <div className="message-text-row">

                                        <p>
                                            {message.text}
                                        </p>


                                        {/* AI SPEAK BUTTON */}

                                        {message.role === "ai" && (

                                            <button
                                                type="button"
                                                className={
                                                    speakingMessageIndex === index
                                                        ? "speak-button speaking"
                                                        : "speak-button"
                                                }
                                                onClick={() => {

                                                    if (
                                                        speakingMessageIndex ===
                                                        index
                                                    ) {

                                                        stopSpeaking();

                                                    } else {

                                                        speakAI(
                                                            message.text,
                                                            index
                                                        );

                                                    }

                                                }}
                                                title={
                                                    speakingMessageIndex === index
                                                        ? "Stop"
                                                        : "Listen"
                                                }
                                            >

                                                {speakingMessageIndex === index
                                                    ? "🔇"
                                                    : "🔊"
                                                }

                                            </button>

                                        )}

                                    </div>

                                </div>

                            </div>

                        )
                    )}


                    {/* ==================================
                        TYPING
                    ================================== */}

                    {loading && (

                        <div className="message ai-message">

                            <div className="message-avatar">
                                🤖
                            </div>

                            <div className="typing">

                                <span></span>

                                <span></span>

                                <span></span>

                            </div>

                        </div>

                    )}

                </div>


                {/* ==================================
                    INPUT
                ================================== */}

                <div className="conversation-input">


                    {/* ==================================
                        MICROPHONE
                    ================================== */}

                    <button
                        type="button"
                        className={
                            isListening
                                ? "conversation-mic listening"
                                : "conversation-mic"
                        }
                        onClick={
                            toggleListening
                        }
                        disabled={loading}
                        title={
                            isListening
                                ? "Stop speaking"
                                : "Start speaking"
                        }
                    >

                        {isListening
                            ? "⏹️"
                            : "🎤"
                        }

                    </button>


                    {/* ==================================
                        TEXTAREA
                    ================================== */}

                    <textarea
                        value={input}
                        onChange={(e) =>
                            setInput(
                                e.target.value
                            )
                        }
                        onKeyDown={
                            handleKeyDown
                        }
                        placeholder={
                            isListening
                                ? "Listening... speak in English"
                                : "Type or speak in English..."
                        }
                        rows="2"
                    />


                    {/* ==================================
                        SEND
                    ================================== */}

                    <button
                        type="button"
                        onClick={
                            sendMessage
                        }
                        disabled={
                            loading ||
                            !input.trim()
                        }
                        title="Send message"
                    >

                        {loading
                            ? "⏳"
                            : "➤"
                        }

                    </button>

                </div>


                {/* ==================================
                    LISTENING STATUS
                ================================== */}

                {isListening && (

                    <div className="listening-status">

                        <span className="pulse-dot"></span>

                        Listening...
                        Speak in English

                    </div>

                )}


                {/* ==================================
                    AI SPEAKING STATUS
                ================================== */}

                {isSpeaking && (

                    <div className="ai-speaking-status">

                        <span className="speaking-dot"></span>

                        🔊 SpeakUp AI is speaking...

                        <button
                            type="button"
                            onClick={
                                stopSpeaking
                            }
                        >
                            🔇 Stop
                        </button>

                    </div>

                )}


                {/* ==================================
                    FOOTER
                ================================== */}

                <div className="conversation-footer">

                    <span>

                        💡 Tip: Try speaking in complete
                        English sentences.

                    </span>


                    <button
                        type="button"
                        onClick={
                            clearConversation
                        }
                    >

                        🗑️ Clear

                    </button>

                </div>

            </div>

        </div>

    );

};


export default Conversation;