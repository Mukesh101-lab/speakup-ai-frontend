import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Speaking from "./pages/Speaking/Speaking";
import Conversation from "./pages/Conversation/Conversation";

import ConversationHistory
    from "./pages/ConversationHistory/ConversationHistory";

import ConversationDetail
    from "./pages/ConversationDetail/ConversationDetail";

import Settings
    from "./pages/Settings/Settings";

import EditProfile
    from "./pages/EditProfile/EditProfile";

import ChangePassword
    from "./pages/ChangePassword/ChangePassword";


function App() {

    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                {/* =========================
                    PUBLIC ROUTES
                ========================= */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* =========================
                    PROTECTED ROUTES
                ========================= */}

                <Route element={<ProtectedRoute />}>

                    {/* DASHBOARD */}

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />


                    {/* SETTINGS */}

                    <Route
                        path="/settings"
                        element={<Settings />}
                    />


                    {/* EDIT PROFILE */}

                    <Route
                        path="/edit-profile"
                        element={<EditProfile />}
                    />

                    <Route
                        path="/change-password"
                        element={<ChangePassword />}
                    />

                    {/* SPEAKING */}

                    <Route
                        path="/speaking"
                        element={<Speaking />}
                    />


                    {/* AI CONVERSATION */}

                    <Route
                        path="/conversation"
                        element={<Conversation />}
                    />


                    {/* CONVERSATION HISTORY */}

                    <Route
                        path="/conversation-history"
                        element={<ConversationHistory />}
                    />


                    {/* CONVERSATION DETAIL */}

                    <Route
                        path="/conversation/:id"
                        element={<ConversationDetail />}
                    />

                </Route>

            </Routes>


            {/* =========================
                FOOTER
            ========================= */}

            <Footer />

        </BrowserRouter>
    );
}


export default App;