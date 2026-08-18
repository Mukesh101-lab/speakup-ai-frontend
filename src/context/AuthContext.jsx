import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    loginUser,
    registerUser,
    getProfile
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadUser = async () => {

            if (!token) {
                setLoading(false);
                return;
            }

            try {

                const data = await getProfile(token);

                if (data.success) {
                    setUser(data.user);
                }

            } catch (error) {

                localStorage.removeItem("token");
                setToken(null);
                setUser(null);

            } finally {

                setLoading(false);

            }
        };

        loadUser();

    }, [token]);


    const register = async (userData) => {

        const data = await registerUser(userData);

        if (data.success) {

            localStorage.setItem(
                "token",
                data.token
            );

            setToken(data.token);
            setUser(data.user);

        }

        return data;
    };


    const login = async (userData) => {

        const data = await loginUser(userData);

        if (data.success) {

            localStorage.setItem(
                "token",
                data.token
            );

            setToken(data.token);
            setUser(data.user);

        }

        return data;
    };


    const logout = () => {

        localStorage.removeItem("token");

        setToken(null);
        setUser(null);

    };


    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                register,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    return useContext(AuthContext);
};