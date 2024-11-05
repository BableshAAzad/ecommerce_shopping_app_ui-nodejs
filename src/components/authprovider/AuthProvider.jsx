import axios from 'axios';
import { createContext, useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../appconstants/EcommerceUrl";
import LogoutAlert from "../auth/LogoutAlert";
import Loading from "../loader/Loading";
import "../navbarpage/HomePage.css";
import { ModelAlert } from "../popup/ModelAlert";

export let AuthContext = createContext();

// eslint-disable-next-line react/prop-types
function AuthProvider({ children }) {
    let [isLogin, setIsLogin] = useState(null);
    let navigate = useNavigate();
    let refreshCancelSource = useRef(axios.CancelToken.source());
    let refreshTokenCalled = useRef(false); // Ref to track if refresh token function has been called
    let [isLoading, setIsLoading] = useState(false);
    let [isOtp, setIsOtp] = useState(false);
    let [progress, setProgress] = useState(0);
    let [openModal, setOpenModal] = useState(false);
    let [modelMessage, setModelMessage] = useState("")
    let [previousLocation, setPreviousLocation] = useState("");
    let [openLogoutAlertModal, setOpenLogoutAlertModal] = useState(false);
    const [responsiveClass, setResponsiveClass] = useState('');

    let login = (userData) => {
        setIsLogin(userData);
        localStorage.setItem("userData", JSON.stringify(userData));
    };

    let logout = () => {
        setIsLogin(null);
        localStorage.removeItem("userData");
        localStorage.removeItem("atExpiredTime");
        localStorage.removeItem("rtExpiredTime");
    };

    let otpVerify = (otpGen) => {
        setIsOtp(otpGen)
    }

    let handleRefreshToken = async () => {
        try {
            setIsLoading(true)
            refreshCancelSource.current.cancel('Cancelling previous refresh request');
            refreshCancelSource.current = axios.CancelToken.source();
            let response = await axios.post(`${BASE_URL}refresh-login`, {}, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
                cancelToken: refreshCancelSource.current.token,
            });
            if (response.status === 200) {
                let userData = response.data.data;
                let nowDate = new Date().getTime();
                localStorage.setItem("atExpiredTime", new Date(nowDate + (userData.accessExpiration * 1000)).toString());
                login(userData);
                console.log("RT regenerated successfully done");
                refreshTokenCalled.current = false; // Reset the ref after successful refresh
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 401) {
                logout();
                navigate("/login-form");
            }
            refreshTokenCalled.current = false; // Reset the ref in case of error
        } finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        let currentTime = new Date();
        let atExpiredTime = new Date(localStorage.getItem("atExpiredTime"));
        let rtExpiredTime = new Date(localStorage.getItem("rtExpiredTime"));
        let userData = localStorage.getItem("userData");
        if (userData)
            userData = JSON.parse(userData);

        if (userData) {
            if (atExpiredTime > currentTime && currentTime < rtExpiredTime) {
                if (!isLogin) {
                    setIsLogin(userData);
                }
            } else if (atExpiredTime < currentTime && currentTime < rtExpiredTime) {
                if (!refreshTokenCalled.current) {
                    refreshTokenCalled.current = true;
                    handleRefreshToken();
                }
            } else {
                logout();
                navigate("/login-form");
            }
        }
    }, [isLogin, navigate]);

    useEffect(() => {
        const updateResponsiveClass = () => {
            if (window.innerWidth < 337) {
                setResponsiveClass('responsive-margin-337');
            } else if (window.innerWidth < 409) {
                setResponsiveClass('responsive-margin-409');
            }else if (window.innerWidth < 1005) {
                setResponsiveClass('responsive-margin-1005');
            } else {
                setResponsiveClass('');
            }
        };

        updateResponsiveClass();

        window.addEventListener('resize', updateResponsiveClass);

        // Cleanup event listener on unmount
        return () => window.removeEventListener('resize', updateResponsiveClass);
    }, []);

    return (
        <AuthContext.Provider value={{
            isLogin,
            login,
            logout,
            isOtp,
            otpVerify,
            progress,
            setProgress,
            isLoading,
            setIsLoading,
            setModelMessage,
            setPreviousLocation,
            setOpenModal,
            openLogoutAlertModal,
            setOpenLogoutAlertModal
        }}>
            <div className={`sm:pt-[1px] md:pt-[23px] lg:pt-[1px] ${responsiveClass} dark:bg-slate-900`}>
                {isLoading && < Loading />}

                <ModelAlert openModal={openModal}
                    setOpenModal={setOpenModal}
                    modelMessage={modelMessage}
                    previousLocation={previousLocation} />

                {children}

                <LogoutAlert openLogoutAlertModal={openLogoutAlertModal}
                    setOpenLogoutAlertModal={setOpenLogoutAlertModal} />
            </div>
        </AuthContext.Provider>
    );
}

export default AuthProvider;
