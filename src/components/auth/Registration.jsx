import axios from 'axios';
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../authprovider/AuthProvider';
import PopupWarn from '../popup/PopupWarn';
import "./Registration.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { HiMail, HiLockClosed } from 'react-icons/hi';
import { BASE_URL } from "../appconstants/EcommerceUrl"
// import CryptoJS from 'crypto-js';

// eslint-disable-next-line react/prop-types
function Registration({ registrationType, pageTitle }) {
    const [credential, setCredential] = useState({ email: "", password: "", password_confirmation: "", termAndCondition: false });
    const [isWrongFormData, setIsWrongFormData] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupData, setPopupData] = useState({});
    const [showPassword, setShowPassword] = useState(false)
    const [passwordClass, setPasswordClass] = useState("");
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const navigate = useNavigate();
    const { otpVerify, setProgress, setIsLoading } = useContext(AuthContext);

    // const encryptionKey = import.meta.env.VITE_PASSWORD_ENCRYPTION_KEY;

    const updateData = (e) => {
        const { name, value, type, checked } = e.target;
        setCredential((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
   
        // Validate password match and length only if password_confirmation field is changed
        if (name === 'password_confirmation') {
            if (value === "") {
                setPasswordClass("");
                setIsSubmitDisabled(true);
            } else if (value !== credential.password || value.length < 8) {
                setPasswordClass("warningD");
                setIsSubmitDisabled(true);
            } else {
                setPasswordClass("successD");
                // setIsSubmitDisabled(false);
            }
        }

        // Check terms and conditions if password_confirmation field is valid
        if (name === 'termAndCondition') {
            const passwordValid = credential.password_confirmation.length >= 8 && credential.password_confirmation === credential.password;
            if (checked && passwordValid) {
                setIsSubmitDisabled(false);
            } else {
                setIsSubmitDisabled(true);
            }
        }
    };

    const submitFormData = async (e) => {
        setProgress(30)
        e.preventDefault();
        if (!credential.termAndCondition || credential.password !== credential.password_confirmation) {
            setIsWrongFormData(false)
            setPopupOpen(false);
            setTimeout(() => {
                setIsWrongFormData(true)
            }, 0);
            setProgress(100)
            return;
        }
        try {
            // TODO needed to apply client side encrypt the password
            // const encryptedPassword = CryptoJS.AES.encrypt(credential.password, encryptionKey).toString();
            // const encryptedPasswordConfirmation = CryptoJS.AES.encrypt(credential.password_confirmation, encryptionKey).toString();

            setIsLoading(true);
            setProgress(70)
            // console.log(credential)
            const response = await axios.post(`${BASE_URL}${registrationType}/register`,
                // { ...credential, password: encryptedPassword, password_confirmation: encryptedPasswordConfirmation },
                credential,
                {
                    headers: { "Content-Type": "application/json" }
                });
            setProgress(90)
            setCredential({ email: "", password: "", password_confirmation: "", termAndCondition: false });
            if (response.status === 202) {
                otpVerify(true);
                setIsLoading(false);
                setProgress(100)
                navigate("/opt-verification", { state: credential });
            }
        } catch (error) {
            otpVerify(false);
            console.log(error)
            // console.log(error.response.rootCause);
            if (error.response.status === 500 || error.response.status === 400 || error.response.status === 409) {
                setPopupOpen(false);
                setTimeout(() => {
                    setPopupData(error.response.data);
                    setPopupOpen(true);
                }, 0);
            }
        } finally {
            setProgress(100)
            setIsLoading(false);
        }
    };

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }
    return (
        <>
            {popupOpen && <PopupWarn isOpen={popupOpen}
                setIsOpen={setPopupOpen} clr="warning" width="w-[90%]"
                head={popupData.message} msg={ popupData.rootCause} />}

            {isWrongFormData && <PopupWarn isOpen={isWrongFormData}
                setIsOpen={setIsWrongFormData} clr="warning" width="w-[90%]"
                head={`Invalid data`} msg={`Please fill proper data`} />}

            <h1 className='dark:text-white text-center text-2xl font-bold mt-4'>{pageTitle} Registration Page</h1>
            <h4 className='text-slate-600 text-center text-base font-bold mt-1'>You Have already Account?
                <Link className='text-blue-700 underline' to="/login-form"> SIGN IN</Link>
            </h4>
            <div className='flex justify-center m-4'>
                <form className="flex max-w-md flex-col gap-4 p-8 bg-blue-300 dark:bg-slate-800 rounded" onSubmit={submitFormData}>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="email2" value="Your email" />
                        </div>
                        <TextInput id="email2" type="email" value={credential.email} name="email" icon={HiMail}
                            onChange={updateData} placeholder="name@flowbite.com" autoComplete='true' required shadow />
                    </div>
                    <div>
                        <div className="mb-2 flex justify-between">
                            <Label htmlFor="password2" value="Password" />
                            <button type='button' className="dark:text-slate-400 text-xs"
                                onClick={handleShowPassword}>{!showPassword ?
                                    <><FontAwesomeIcon icon={faEye} className='mr-1' />Show Password</> :
                                    <><FontAwesomeIcon icon={faEyeSlash} className='mr-1' />Hide Password</>}
                            </button>
                        </div>
                        <TextInput id="password2" type={!showPassword ? "password" : "text"} value={credential.password}
                            name="password" onChange={updateData} placeholder='Abc@123xyz'
                            icon={HiLockClosed} autoComplete='true' required shadow />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="repeat-password" value="Repeat password" />
                        </div>
                        <TextInput id="repeat-password" type="password" className={passwordClass} name="password_confirmation" value={credential.password_confirmation}
                            onChange={updateData} placeholder='Abc@123xyz' icon={HiLockClosed} autoComplete='true' required shadow />
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id="agree" name="termAndCondition" checked={credential.termAndCondition} onChange={updateData} />
                        <Label htmlFor="agree" className="flex">
                            I agree with the&nbsp;
                            <Link to="#" className="text-cyan-600 hover:underline dark:text-cyan-500">
                                terms and conditions
                            </Link>
                        </Label>
                    </div>
                    <Button type="submit" disabled={isSubmitDisabled}>Register new account</Button>
                    <span className='dark:text-slate-400 text-slate-800 text-xs'>
                        Note : If Register button is still disabled then re-enter details.
                    </span>
                </form>
            </div>
        </>
    );
}

export default Registration
