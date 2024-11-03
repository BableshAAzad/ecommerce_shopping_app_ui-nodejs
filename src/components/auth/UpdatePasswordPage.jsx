import axios from 'axios';
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { useContext, useId, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../authprovider/AuthProvider';
import PopupWarn from '../popup/PopupWarn';
import "../auth/Registration.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { HiMail, HiLockClosed } from 'react-icons/hi';
import { BASE_URL } from "../appconstants/EcommerceUrl"

function UpdatePasswordPage() {
    const location = useLocation();
    const [credential, setCredential] = useState({
        email: location.state?.email ?? "", password: "",
        password_confirmation: "", termAndCondition: false, secrete: ""
    });
    const [formData, setFormData] = useState({ email: location.state?.email ?? "", password: "" });
    const [isWrongFormData, setIsWrongFormData] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupData, setPopupData] = useState({});
    const [showPassword, setShowPassword] = useState(false)
    const [passwordClass, setPasswordClass] = useState("");
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const navigate = useNavigate();
    const { otpVerify, setProgress, setIsLoading } = useContext(AuthContext);
    const id = useId();

    document.title = "Update Profile - Ecommerce Shopping App"

    const updateData = (e) => {
        const { name, value, type, checked } = e.target;
        setCredential((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (name !== "secrete") {
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
        if (name === "secrete") {
            setCredential({ ...credential, [name]: value })
        }

        if (name === 'password_confirmation') {
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
        e.preventDefault();
        setProgress(30)
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
            setIsLoading(true);
            console.log(credential)
            setProgress(70)
            const response = await axios.put(`${BASE_URL}users/update?secrete=` + credential.secrete,
                formData,
                {
                    headers: { "Content-Type": "application/json" },
                });
            setProgress(90)
            setCredential({ email: "", password: "", password_confirmation: "", termAndCondition: false, secrete: "" });
            setFormData({ email: "", password: "" });
            console.log(response)
            if (response.status === 200) {
                otpVerify(true)
                setIsLoading(false);
                setProgress(100)
                navigate("/user-otp-verified-page", { state: response.data.data })
            }
        } catch (error) {
            otpVerify(false);
            console.log(error)
            console.log(error.response.data);
            let errorData = error.response.data;
            if (errorData.status === 400 || errorData.status === 404) {
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

            <h1 className='dark:text-white text-center text-2xl font-bold mt-4'>Update Profile Data</h1>
            <div className='flex justify-center m-4'>
                <form className="flex max-w-md flex-col gap-4 p-8 bg-blue-300 dark:bg-slate-800 rounded" onSubmit={submitFormData}>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor={`${id}pre`} value="Your email" />
                        </div>
                        <TextInput id={`${id}pre`} type="email" value={credential.email} name="email" icon={HiMail}
                            onChange={updateData} placeholder="example@gmail.com" autoComplete='true' disabled shadow />
                    </div>
                    <div>
                        <div className="mb-2 flex justify-between">
                            <Label htmlFor={`${id}prp`} value="New Password" />
                            <button type='button' className="dark:text-slate-400 text-xs"
                                onClick={handleShowPassword}>{!showPassword ?
                                    <><FontAwesomeIcon icon={faEye} className='mr-1' />Show Password</> :
                                    <><FontAwesomeIcon icon={faEyeSlash} className='mr-1' />Hide Password</>}
                            </button>
                        </div>
                        <TextInput id={`${id}prp`} type={!showPassword ? "password" : "text"} value={credential.password}
                            name="password" onChange={updateData} placeholder='Abc@123xyz'
                            icon={HiLockClosed} autoComplete='true' required shadow />
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor={`${id}prr`} value="Repeat password" />
                        </div>
                        <TextInput id={`${id}prr`} type="password" className={passwordClass} name="password_confirmation" value={credential.password_confirmation}
                            onChange={updateData} placeholder='Abc@123xyz' icon={HiLockClosed} autoComplete='true' required shadow />
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor={`${id}prs`} value="Secrete key" />
                        </div>
                        <TextInput id={`${id}prs`} type="number" name="secrete" value={credential.secrete}
                            onChange={updateData} placeholder='1234' icon={HiLockClosed} autoComplete='true' required shadow />
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
                    <Button type="submit" disabled={isSubmitDisabled}>Reset Password</Button>
                </form>
            </div>
        </>
    );
}

export default UpdatePasswordPage
