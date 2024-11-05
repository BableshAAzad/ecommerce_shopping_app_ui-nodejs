import { useContext, useEffect, useRef, useState } from 'react'
import { Button, Modal } from "flowbite-react";
import OtpInput from 'react-otp-input';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../authprovider/AuthProvider';
import PopupWarn from '../popup/PopupWarn';
import { faArrowRight, faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BASE_URL } from "../appconstants/EcommerceUrl"

function OptVerification() {
    const [openModal, setOpenModal] = useState(true);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [popupOpen, setPopupOpen] = useState(false);
    const [isOtpExpired, setIsOtpExpired] = useState(false);
    const [errorOtpData, setErrorOtpData] = useState({});
    const [time, setTime] = useState(5 * 60); // 5 minutes in seconds
    const location = useLocation();
    const navigate = useNavigate()
    const { otpVerify, setProgress, isLoading, setIsLoading } = useContext(AuthContext);
    const timerRef = useRef(null);

    document.title = "OTP Verification - Ecommerce Shopping App"

    let formData = location.state;
    // console.log(formData)

    // useEffect(() => {
    //     console.log(otp.join(''))
    // }, [otp])
    // ^-------------------------------------------------------------------------------------------------------

    useEffect(() => {
        startTimer();

        return () => clearInterval(timerRef.current); // Cleanup interval on component unmount
    }, []);

    const startTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        setTime(5 * 60); // Reset the timer to 5 minutes

        timerRef.current = setInterval(() => {
            setTime((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timerRef.current);
                    setIsOtpExpired(true);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };
    // ^-------------------------------------------------------------------------------------------------------
    const submitOtp = async () => {
        try {
            setIsLoading(true)
            setProgress(70)
            // console.log({ email: formData.email, opt: otp.join('') })
            const response = await axios.post(`${BASE_URL}users/otp-verification`,
                { email: formData.email, otp: otp.join('') },
                {
                    headers: { "Content-Type": "application/json" },
                });
            setProgress(90)
            setOtp(["", "", "", "", "", ""])
            // console.log(response)
            if (response.status === 201) {
                setIsLoading(false)
                setProgress(100)
                otpVerify(true)
                navigate("/user-otp-verified-page", { state: response.data })
            }
        } catch (error) {
            otpVerify(true)
            console.log(error)
            let errorData = error.response.data;
            if (errorData.status === 400 || errorData.status === 403 || errorData.status === 500) {
                setErrorOtpData(errorData)
                setIsOtpExpired(true)
            }
        } finally {
            setProgress(100)
            setIsLoading(false)
        }
    }

    let handlePasswordReset = async () => {
        setProgress(30)
        try {
            setIsLoading(true)
            setProgress(70)
            // console.log({ email: formData.email, opt: otp.join('') })
            const response = await axios.post(`${BASE_URL}users/otp-verification`,
                { email: formData.email, otp: otp.join('') },
                {
                    headers: { "Content-Type": "application/json" },
                });
            setProgress(90)
            setOtp(["", "", "", "", "", ""])
            // console.log(response)
            if (response.status === 200) {
                otpVerify(true)
                setIsLoading(false)
                setProgress(100)
                navigate("/update-password-page", { state: response.data.data })
            }
        } catch (error) {
            console.log("catch block")
            otpVerify(true)
            console.log(error)
            let errorData = error.response.data;
            if (errorData.status === 400 || errorData.status === 403 ||  errorData.status === 500) {
                setErrorOtpData(errorData)
                setIsOtpExpired(true)
            }
        } finally {
            setIsLoading(false)
            setProgress(100)
        }
    }

    let handleSubmit = () => {
        if (formData.password !== "Ecommerce@123!") {
            setOpenModal(false)
            submitOtp()
        } else {
            handlePasswordReset()
        }
    }

    // ^-------------------------------------------------------------------------------------------------------
    const resentOtp = async () => {
        try {
            setProgress(30)
            setIsLoading(true)
            // console.log({ email: formData.email, opt: otp.join('') })/
            setProgress(70)
            const response = await axios.post(`${BASE_URL}users/resend-otp`,
                formData,
                {
                    headers: { "Content-Type": "application/json" },
                });
            setProgress(90)
            setIsLoading(false)
            // console.log(response)
            if (response.status === 202) {
                setPopupOpen(true)
                startTimer(); // Restart the timer when OTP is resent
            }
        } catch (error) {
            otpVerify(true)
            console.log(error)
            let errorData = error.response.data;
            if (errorData.status === 400 || errorData.status === 403 ||  errorData.status === 500) {
                setErrorOtpData(errorData)
                setIsOtpExpired(true)
            }
        } finally {
            setProgress(100)
            setIsLoading(false)
        }
    }
    // ^-------------------------------------------------------------------------------------------------------

    return (
        <>
            {isOtpExpired && <PopupWarn isOpen={isOtpExpired}
                setIsOpen={setIsOtpExpired} clr="warning" width="w-2/3"
                head={errorOtpData.message} msg={errorOtpData.rootCause} />}

            {/* <Button onClick={() => setOpenModal(true)}>Toggle modal</Button> */}
            <br /><br /><br />
            <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">

                        {popupOpen && <PopupWarn isOpen={popupOpen}
                            setIsOpen={setPopupOpen} clr="success" width="w-full"
                            head={`Otp re-sended`} msg={"Check Otp on your mail id"} />}
                        <PopupWarn isOpen={isOtpExpired}
                            setIsOpen={setIsOtpExpired} clr="warning" width="w-full"
                            head={errorOtpData.message} msg={errorOtpData.rootCause} />

                        <h2 className="text-3xl font-medium text-gray-900 dark:text-white">Email verification</h2>
                        <div className="countdown-timer text-green-600 dark:text-green-300">
                            <h2><FontAwesomeIcon icon={faClock} />&nbsp;{formatTime(time)}</h2>
                        </div>
                        <h3 className="mb-5 text-sm font-normal text-gray-500 dark:text-gray-400">
                            We have sent a code to your email : {formData.email}
                        </h3>
                        <section className='mt-4'>
                            {
                                <OtpInput
                                    value={otp.join('')}
                                    onChange={(value) => setOtp(value.split(''))}
                                    isInputNum
                                    inputStyle={{
                                        width: '3rem',
                                        height: '3rem',
                                        margin: '0 0.2rem',
                                        fontSize: '1.5rem',
                                        borderRadius: '4px',
                                        border: '1px solid #ced4da'
                                    }}
                                    numInputs={6}
                                    renderInput={(inputProps, index) => <input {...inputProps} key={index} />}
                                />
                            }
                        </section>
                        <div className="flex justify-center gap-4 m-3">
                            <Button color="success" onClick={() => {
                                handleSubmit()
                            }} disabled={formatTime(time) == `0:00` ? true : false}>
                                {"Verify Email"}
                            </Button>
                            <Button color="blue" onClick={() => {
                                setOpenModal(true), resentOtp()
                            }}>
                                Resend OTP
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {!openModal && <div className="text-center h-screen">
                {!isLoading && <section>
                    <h1 className="font-bold text-2xl mb-10 text-red-600">☹...Registration Failed...☹</h1>
                    <br />
                    <Link to="/seller-registration" className="bg-purple-600 w-fit ml-auto mr-auto text-white rounded p-3">
                        Seller Registration Page
                        <FontAwesomeIcon className="ml-3 m-auto" icon={faArrowRight} />
                    </Link>
                    <br /><br /><br />
                    <Link to="/customer-registration" className="bg-blue-600 w-fit ml-auto mr-auto text-white rounded p-3">
                        Customer Registration Page
                        <FontAwesomeIcon className="ml-3 m-auto" icon={faArrowRight} />
                    </Link>
                </section>}
            </div>
            }
        </>
    )
}

export default OptVerification
