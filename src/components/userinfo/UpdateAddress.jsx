import { Button, Label, Radio, Textarea, TextInput } from "flowbite-react"
import React, { useContext, useId, useState } from "react";
import axios from "axios";
import { addressType } from "./AddressTypes"
import { useLocation } from "react-router-dom";
import { AuthContext } from "../authprovider/AuthProvider";
import { BASE_URL } from "../appconstants/EcommerceUrl"

function UpdateAddress() {
    let id = useId();
    const location = useLocation();
    let { setProgress,
        setIsLoading,
        setPreviousLocation,
        setModelMessage,
        setOpenModal } = useContext(AuthContext);

    document.title = "Update Address - Ecommerce Shopping App"

    const previousLocation = location.state?.from || "/";
    // console.log(location.state)

    let [addressData, setAddressData] = useState({
        streetAddress: location.state.data?.streetAddress ?? "",
        streetAddressAdditional: location.state.data?.streetAddressAdditional ?? "",
        city: location.state.data?.city ?? "",
        state: location.state.data?.state ?? "",
        country: location.state.data?.country ?? "India",
        pincode: location.state.data?.pincode ?? "",
        addressType: location.state.data?.addressType ?? "",
    });

    let handleaddressData = ({ target: { name, value, type } }) => {
        setAddressData((prevData) => ({
            ...prevData, [name]: type === "number" ? Number(value) : value,
        }));
        // console.log(addressData);
    }

    let sendProductData = async (e) => {
        setProgress(30)
        setIsLoading(true);
        e.preventDefault();
        // console.log(addressData);
        setProgress(70)
        try {
            const response = await axios.put(`${BASE_URL}users/addresses/${location.state.data._id}`,
                addressData,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true // Includes cookies with the request
                }
            );
            setProgress(90)
            if (response.status === 200) {
                setIsLoading(false);
                setProgress(100)
                // alert(response.data.message)
                // navigate("/profile-page")
                handleSuccessResponse(response.data.message)
            }
            // console.log(response);
        } catch (error) {
            console.log(error);
        } finally {
            setProgress(100)
            setIsLoading(false);
        }
    }

    let handleSuccessResponse = (msg) => {
        setPreviousLocation(previousLocation)
        setModelMessage(msg)
        setOpenModal(true)
    }

    return (
        <div>
            <h1 className="font-bold text-2xl text-center dark:text-white">Update Address Form</h1>
            <section className="flex items-center justify-center">
                <form className="flex max-w-md flex-col gap-4 p-4 border border-green-500 rounded-md m-2"
                    onSubmit={sendProductData}>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor={`${id}streetAddress`} value="Street or HNO, or Plot NO" />
                        </div>
                        <Textarea id={`${id}streetAddress`} name="streetAddress"
                            value={addressData.streetAddress} type="text" placeholder="eg. Hno 20 School road"
                            onChange={handleaddressData} required shadow rows={2} />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor={`${id}streetAddressAdditional`} value="Street Address or Area" />
                        </div>
                        <Textarea id={`${id}streetAddressAdditional`} name="streetAddressAdditional"
                            value={addressData.streetAddressAdditional} type="text" placeholder="eg. Raja ji nagar"
                            onChange={handleaddressData} required shadow rows={2} />
                    </div>

                    <section className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor={`${id}city`} value="City" />
                            </div>
                            <TextInput id={`${id}city`} name="city" value={addressData.city} type="text"
                                placeholder="eg. Banglore" onChange={handleaddressData} required shadow />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor={`${id}state`} value="State" />
                            </div>
                            <TextInput id={`${id}state`} name="state" value={addressData.state} type="text"
                                placeholder="eg. Karnataka" onChange={handleaddressData} required shadow />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor={`${id}pweight`} value="Country" />
                            </div>
                            <TextInput id={`${id}pweight`} name="country" value={addressData.country}
                                type="text" onChange={handleaddressData} required shadow />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor={`${id}pincode`} value="Pincode" />
                            </div>
                            <TextInput
                                id={`${id}pincode`}
                                name="pincode"
                                value={addressData.pincode}
                                type="number"
                                placeholder="eg. 560001"
                                onChange={handleaddressData}
                                required
                                shadow
                            />
                        </div>
                    </section>

                    <div className="mb-2 block">
                        <legend className="mb-4 text-purple-700 dark:text-purple-500">Choose Address Type : </legend>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {addressType.map((type, index) => (
                                <React.Fragment key={index}>
                                    <fieldset className="flex max-w-md flex-col gap-4">
                                        <div className="flex items-center gap-2">
                                            <Radio id={`${id}${type}`} name="addressType" value={type}
                                                onChange={handleaddressData} required />
                                            <Label htmlFor={`${id}${type}`}>{type}</Label>
                                        </div>
                                    </fieldset>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center justify-center mb-2">
                        <Button type="submit" gradientDuoTone="purpleToBlue">
                            Update Address
                        </Button>
                        <Button type="reset" gradientMonochrome="failure">
                            Clear
                        </Button>
                    </div>
                </form>
            </section >
        </div >
    )
}

export default UpdateAddress
