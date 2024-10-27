import axios from 'axios';
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../authprovider/AuthProvider';
import PopupWarn from '../popup/PopupWarn';
import "../auth/Registration.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { HiMail, HiLockClosed } from 'react-icons/hi';
import { BASE_URL } from "../appconstants/EcommerceUrl"

function UpdateUser() {
    const location = useLocation();
    const [credential, setCredential] = useState({
        email: location.state?.email ?? "", password: "",
        password1: "", termAndCondition: false
    });
    const [formData, setFormData] = useState({ email: location.state?.email ?? "", password: "" });
    const [isWrongFormData, setIsWrongFormData] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupData, setPopupData] = useState({});
    const [showPassword, setShowPassword] = useState(false)
    const [passwordClass, setPasswordClass] = useState("");
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const navigate = useNavigate();
    const { otpVerify, login, setProgress, setIsLoading } = useContext(AuthContext);

    document.title = "Update Profile - Ecommerce Shopping App"

    const updateData = (e) => {
        const { name, value, type, checked } = e.target;
        setCredential((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (name !== 'password1' && name !== 'termAndCondition') {
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
        if (name === 'password1') {
            if (value === "") {
                setPasswordClass("");
                setIsSubmitDisabled(true);
            } else if (value !== credential.password || value.length < 8) {
                setPasswordClass("warningD");
                setIsSubmitDisabled(true);
            } else {
                setPasswordClass("successD");
            }
        }

        // Check terms and conditions if password1 field is valid
        if (name === 'termAndCondition') {
            const passwordValid = credential.password1.length >= 8 && credential.password1 === credential.password;
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
        if (!credential.termAndCondition || credential.password !== credential.password1) {
            setIsWrongFormData(false)
            setPopupOpen(false);
            setTimeout(() => {
                setIsWrongFormData(true)
            }, 0);
            setProgress(100)
            return;
        }
        try {
            setProgress(70)
            setIsLoading(true);
            const response = await axios.put(`${BASE_URL}users/${location.state.userId}`,
                formData,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                });
            setProgress(90)
            setCredential({ email: "", password: "", password1: "", termAndCondition: false });
            setFormData({ email: "", password: "" });
            console.log(response)
            if (response.status === 200) {
                localStorage.setItem("userData", "")
                localStorage.setItem("atExpiredTime", "");
                localStorage.setItem("rtExpiredTime", "");
                login(null)
                otpVerify(true);
                setIsLoading(false);
                setProgress(100)
                navigate("/opt-verification", { state: formData });
            }
        } catch (error) {
            otpVerify(false);
            console.log(error)
            console.log(error.response.data);
            let errorData = error.response.data;
            if (errorData.status === 404 || errorData.status === 400) {
                setPopupOpen(false);
                setTimeout(() => {
                    setPopupData(errorData);
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
                setIsOpen={setPopupOpen} clr="warning" width="w-2/3"
                head={popupData.message} msg={popupData.rootCause.password || popupData.rootCause} />}

            {isWrongFormData && <PopupWarn isOpen={isWrongFormData}
                setIsOpen={setIsWrongFormData} clr="warning" width="w-2/3"
                head={`Invalid data`} msg={`Please fill proper data`} />}

            <h1 className='dark:text-white text-center text-2xl font-bold mt-4'>Update Profile</h1>
            <div className='flex justify-center m-4'>
                <form className="flex max-w-md flex-col gap-4 p-8 bg-blue-300 dark:bg-slate-800 rounded" onSubmit={submitFormData}>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="email2" value="Your email" />
                        </div>
                        <TextInput id="email2" type="email" value={credential.email} name="email" icon={HiMail}
                            onChange={updateData} placeholder="example@gmail.com" autoComplete='true' required shadow />
                    </div>
                    <div>
                        <div className="mb-2 flex justify-between">
                            <Label htmlFor="password2" value="New Password" />
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
                        <TextInput id="repeat-password" type="password" className={passwordClass} name="password1" value={credential.password1}
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
                    <Button type="submit" disabled={isSubmitDisabled}>Update Data</Button>
                </form>
            </div>
        </>
    );
}

export default UpdateUser
