import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Button, Label, TextInput } from "flowbite-react";
import { useContext, useState } from "react";
import { HiMail } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../appconstants/EcommerceUrl";
import { AuthContext } from "../authprovider/AuthProvider";
import PopupWarn from "../popup/PopupWarn";

function ForgotPassword() {
    let [emailData, setEmailData] = useState({ email: "", password: "Ecommerce@123!" })
    let [popupOpen, setPopupOpen] = useState(false);
    let [popupData, setPopupData] = useState("");
    let { otpVerify, setProgress, setIsLoading } = useContext(AuthContext);
    let navigate = useNavigate();

    document.title = "Forgot Password - Ecommerce Shopping App"

    let updateEmail = ({ target: { name, value } }) => {
        setEmailData({ ...emailData, [name]: value })
    }

    let submitFormData = async (e) => {
        setProgress(30)
        setIsLoading(true)
        // console.log(emailData)
        e.preventDefault();
        try {
            setProgress(70)
            const response = await axios.put(`${BASE_URL}users/update/` + emailData.email, "",
                {
                    headers: { "Content-Type": "application/json" },
                }
            )
            // console.log(response)
            setProgress(90)
            if (response.status === 200) {
                otpVerify(true);
                setIsLoading(false)
                setProgress(100)
                navigate("/opt-verification", { state: emailData });
            }
        } catch (error) {
            console.log(error)
            setPopupData(error.response.data.message)
            setPopupOpen(true)
        } finally {
            setProgress(100)
            setIsLoading(false)
        }
    }

    return (
        <section className='mb-20 mt-10'>
            {popupOpen && <PopupWarn isOpen={popupOpen}
                setIsOpen={setPopupOpen} clr="warning" width="w-2/3"
                head={popupData} msg={""} />}


            <h1 className='dark:text-slate-400 text-center text-2xl font-bold mt-4'>Reset Password Page</h1>
            <p className='text-yellow-700 dark:text-yellow-500 text-center text-lg mt-4'>
                Enter email id associated with your account to recieve an email to reset your password
            </p>
            <div className='flex justify-center m-4'>
                <form className="flex max-w-md flex-col gap-4 p-8 bg-blue-300 dark:bg-slate-800 rounded" onSubmit={submitFormData}>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="email2" value="Your email" />
                        </div>
                        <TextInput id="email2" type="email" value={emailData.email} name="email" icon={HiMail}
                            onChange={updateEmail} placeholder="example@gmail.com" autoComplete='true' required shadow />
                    </div>

                    <Button type="submit">Reset Password</Button>
                </form>
            </div>
            <div className="flex justify-center">
                <Link to="/" className='text-blue-400 text-center text-xl font-bold mt-4 underline'>
                    Home Page &nbsp;
                    <FontAwesomeIcon icon={faArrowRight} />
                </Link>
            </div>
        </section>
    )
}

export default ForgotPassword
