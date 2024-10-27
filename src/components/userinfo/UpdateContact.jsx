import { useContext, useId, useState } from 'react'
import { Button, Label, Radio, TextInput } from "flowbite-react";
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import PopupWarn from '../popup/PopupWarn';
import "../auth/Registration.css";
import { HiOutlinePhone } from 'react-icons/hi';
import { AuthContext } from '../authprovider/AuthProvider';
import { BASE_URL } from "../appconstants/EcommerceUrl"

function UpdateContact() {
    const location = useLocation()
    const [formData, setFormData] = useState({
        contactNumber: location.state?.contactNumber ?? "",
        priority: location.state?.priority ?? ""
    });
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupData, setPopupData] = useState({});
    const [contactValid, setContactValid] = useState("");
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const id = useId();
    let { setProgress,
        setIsLoading,
        setPreviousLocation,
        setModelMessage,
        setOpenModal } = useContext(AuthContext);

    let previousLocation = location.state?.from || "/";

    document.title = "Update Contact Number - Ecommerce Shopping App"


    const updateData = ({ target: { name, value } }) => {
        setFormData({ ...formData, [name]: value });
        if (name === 'contactNumber') {
            if (value === "") {
                setContactValid("");
                setIsSubmitDisabled(true);
            } else if ((value + "").length < 10 || (value + "").length > 10) {
                setContactValid("warningD");
                setIsSubmitDisabled(true);
            } else {
                setContactValid("successD");
                setIsSubmitDisabled(false);
            }
        }
    }

    const submitFormData = async (e) => {
        setProgress(20)
        setIsLoading(true)
        e.preventDefault();
        console.log(formData)
        setProgress(70)
        try {
            const response = await axios.put(`${BASE_URL}addresses/${location.state.addressId}/contacts/${location.state.contactId}`,
                formData,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true // Includes cookies with the request
                }
            );
            setProgress(90)
            setFormData({ contactNumber: "", priority: "" })
            // console.log(response)
            if (response.status === 200) {
                setProgress(100)
                setIsLoading(false)
                // alert(response.data.message)
                // navigate("/profile-page")
                handleSuccessResponse(response.data.message)
            }
        } catch (error) {
            console.log(error)
            // console.log(error.response.data);
            let errorData = error.response.data;
            if (errorData.status === 401 || errorData.status === 400 || errorData.status === 404) {
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

    let handleSuccessResponse = (msg) => {
        setPreviousLocation(previousLocation)
        setModelMessage(msg)
        setOpenModal(true)
    }

    return (
        <>
            {popupOpen && <PopupWarn isOpen={popupOpen}
                setIsOpen={setPopupOpen} clr="warning" width="w-[90%]"
                head={popupData.message} msg={popupData.rootCause} />}

            <h1 className='dark:text-white text-center text-2xl w-1/ font-bold mt-4'>Update Contact Form</h1>
            <div className='flex justify-center m-4 '>
                <form className="flex max-w-md flex-col gap-4 p-8 bg-blue-300  dark:bg-slate-800 rounded" onSubmit={submitFormData}>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor={`${id}cn`} value="Your Contact Number" />
                        </div>
                        <TextInput id={`${id}cn`} type="number" className={`${contactValid}`} value={formData.contactNumber} onChange={updateData}
                            name="contactNumber" placeholder="eg. 7898300817" icon={HiOutlinePhone} autoComplete='true' required />
                    </div>
                    <div>
                        <fieldset className="flex max-w-md flex-col gap-4">
                            <legend className="mb-4 dark:text-slate-200">Select Number Priority</legend>
                            <div className="flex items-center gap-2">
                                <Radio id={`${id}pr`} name="priority" value="PRIMARY" onChange={updateData} required />
                                <Label htmlFor={`${id}pr`}>PRIMARY</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Radio id={`${id}sd`} name="priority" value="SECONDARY" onChange={updateData} required />
                                <Label htmlFor={`${id}sd`}>SECONDARY</Label>
                            </div>
                        </fieldset>
                    </div>
                    <Button type="submit" disabled={isSubmitDisabled}>Update Contact</Button>
                    <span className='dark:text-slate-400 text-slate-800 text-xs'>
                        Note : If update button is still disabled then re-enter details.
                    </span>
                </form>
            </div>
        </>
    )
}

export default UpdateContact
