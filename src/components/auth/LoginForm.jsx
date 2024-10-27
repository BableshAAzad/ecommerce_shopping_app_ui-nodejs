import { useContext, useState } from 'react'
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../authprovider/AuthProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import PopupWarn from '../popup/PopupWarn';
import "./Registration.css";
import { HiUser, HiKey } from 'react-icons/hi';
import { BASE_URL } from "../appconstants/EcommerceUrl"

function LoginForm() {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [showPassword, setShowPassword] = useState(false)
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupData, setPopupData] = useState({});
    const [passwordClass, setPasswordClass] = useState("");
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const navigate = useNavigate();
    const { login, setProgress, setIsLoading } = useContext(AuthContext);

    document.title = "Login - Ecommerce Shopping App"

    const updateData = ({ target: { name, value } }) => {
        setFormData({ ...formData, [name]: value });
        if (name === 'password') {
            if (value === "") {
                setPasswordClass("");
                setIsSubmitDisabled(true);
            } else if (value.length < 8) {
                setPasswordClass("warningD");
                setIsSubmitDisabled(true);
            } else {
                setPasswordClass("successD");
                setIsSubmitDisabled(false);
            }
        }
    }

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const submitFormData = async (e) => {
        setProgress(30)
        setIsLoading(true)
        e.preventDefault();
        // console.log(formData)
        try {
            setProgress(70)
            const response = await axios.post(`${BASE_URL}login`,
                formData,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true // Includes cookies with the request
                }
            );
            setProgress(90)
            setFormData({ username: "", password: "" })
            // console.log(response.data)
            if (response.status === 200) {
                let userData = response.data.data;
                // console.log(userData)
                let nowDate = new Date().getTime()
                localStorage.setItem("userData", JSON.stringify(userData))
                localStorage.setItem("atExpiredTime", new Date(nowDate + (userData.accessExpiration * 1000)).toString());
                localStorage.setItem("rtExpiredTime", new Date(nowDate + (userData.refreshExpiration * 1000)).toString());
                login(userData);
                setIsLoading(false)
                setProgress(100)
                navigate("/")
            }
        } catch (error) {
            console.log(error)
            let errorData = error.response.data;
            if (errorData.status === 401 || errorData.status === 400) {
                setPopupOpen(false);
                setTimeout(() => {
                    setPopupData(errorData);
                    setPopupOpen(true);
                }, 0);
            }
        } finally {
            setProgress(100)
            setIsLoading(false)
        }
    }

    return (
        <>
            {popupOpen && <PopupWarn isOpen={popupOpen} width="w-[90%]"
                setIsOpen={setPopupOpen} clr="warning"
                head={popupData.message} msg={popupData.rootCause.password || popupData.rootCause} />}

            <h1 className='dark:text-slate-300 text-center text-2xl font-bold mt-4'>Sign In To Your Account</h1>
            <h4 className='text-slate-600 text-center text-base font-bold mt-1'>Don{`'`}t Have an Account?
                <Link className='text-blue-700 underline' to="/customer-registration"> SIGN UP</Link>
            </h4>
            <div className='flex justify-center m-4 '>
                <form className="flex max-w-md flex-col gap-4 p-8 bg-blue-300  dark:bg-slate-800 rounded" onSubmit={submitFormData}>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="usernamelogin" value="Your Username" />
                        </div>
                        <TextInput id="usernamelogin" type="text" value={formData.username} onChange={updateData}
                            name="username" placeholder="abcd012" icon={HiUser} autoComplete='true' required />
                    </div>
                    <div>
                        <div className="mb-2 flex justify-between">
                            <Label htmlFor="passwordlogin" value="Password" />
                            <button type='button' className="dark:text-slate-400 text-xs"
                                onClick={handleShowPassword}>{!showPassword ?
                                    <><FontAwesomeIcon icon={faEye} className='mr-1' />Show Password</> :
                                    <><FontAwesomeIcon icon={faEyeSlash} className='mr-1' />Hide Password</>}
                            </button>
                        </div>
                        <TextInput id="passwordlogin" type={!showPassword ? "password" : "text"}
                            className={passwordClass} value={formData.password} onChange={updateData}
                            name="password" placeholder='Abc@123xyz' icon={HiKey} autoComplete='true' required />
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id="remember" />
                        <Label htmlFor="remember">Remember me</Label>
                    </div>
                    <Button type="submit" disabled={isSubmitDisabled}>Submit</Button>
                    <span className='dark:text-slate-400 text-slate-800 text-xs'>
                        Note : If submit button is still disabled then re-enter details.
                    </span>
                </form>
            </div>
            <div className='text-center ml-auto mr-auto'>
                <Link to="/forgot-password" className='text-blue-800 dark:text-blue-700 font-bold mt-1 underline'>FORGOT PASSWORD?</Link>
            </div>

            <div className="social-button-container w-96 ml-auto mr-auto flex justify-center items-center flex-col space-y-4 mt-2 mb-4">

                <Link className="px-3 py-2 w-full border flex justify-center items-center font-bold gap-2 bg-gray-300
                 dark:bg-gray-600 border-slate-200 hover:bg-gray-400 dark:border-slate-700 rounded-lg
                  text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500
                   hover:text-slate-900 dark:hover:text-slate-300 dark:hover:bg-gray-800 hover:shadow 
                   transition duration-150"
                    to='http://localhost:8080/oauth2/authorization/google'>
                    <img className="w-5 h-5" src="https://www.svgrepo.com/show/475656/google-color.svg"
                        loading="lazy" alt="google logo" />
                    <span>Login with Google</span>
                </Link>

                <Link className="py-2 px-3 w-full flex justify-center items-center bg-gray-600 hover:bg-gray-800
                 focus:ring-gray-500 focus:ring-offset-gray-200 text-white transition ease-in duration-200 
                 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2
                  rounded-lg"
                    to='http://localhost:8080/oauth2/authorization/github'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                        className="mr-2" viewBox="0 0 1792 1792">
                        <path
                            d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z">
                        </path>
                    </svg>
                    Login with GitHub
                </Link>

            </div>
        </>
    )
}

export default LoginForm
// test commit
