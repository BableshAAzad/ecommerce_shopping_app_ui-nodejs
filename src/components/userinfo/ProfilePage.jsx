import { useContext, useEffect } from "react";
import { useState } from "react";
import { AuthContext } from "../authprovider/AuthProvider"
import { Button, Card } from "flowbite-react";
import user from "../../images/user.png"
import LogoutOperation from "./LogoutOperation";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faMobileRetro } from "@fortawesome/free-solid-svg-icons";
import { BASE_URL } from "../appconstants/EcommerceUrl"

function ProfilePage() {
    let { isLogin, setProgress, setIsLoading } = useContext(AuthContext);
    let [openModal, setOpenModal] = useState({ openStatus: false, val: "" });
    let [addressData, setAddressData] = useState([]);
    let [userData, setUserData] = useState({})
    let navigate = useNavigate();
    let location = useLocation();

    document.title = "Profile - Ecommerce Shopping App"

    const handleLogout = (val) => {
        setOpenModal({ openStatus: true, val });
    };

    let handleUserData = async () => {
        setProgress(30)
        setIsLoading(true);
        try {
            setProgress(50)
            const responseUser = await axios.get(`${BASE_URL}users/${isLogin.userId}`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            setProgress(70)
            // console.log(responseUser.data)
            setUserData(responseUser.data.data)
            const responseAddress = await axios.get(`${BASE_URL}users/${isLogin.userId}/addresses`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            setProgress(90)
            // console.log(responseAddress.data);
            if (responseAddress.status === 200) {
                setAddressData(responseAddress.data.data)
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            setProgress(100)
        }
    }

    useEffect(() => {
        handleUserData();
    }, [])

    let handleUpdateAddress = (data) => {
        console.log(data)
        navigate("/profile-page/update-address",
            { state: { data: data, from: location.pathname } })
    }

    let handleUserUpdate = () => {
        navigate("/profile-page/update-profile", { state: userData })
    }

    return (
        <>
            {openModal.openStatus && <LogoutOperation modelData={openModal} handleModel={setOpenModal} />}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="row-span-1 md:row-span-3">
                    <div className="p-2">
                        <img src={user} className=" ml-auto mr-auto" style={{ width: "18rem" }} alt="user" />
                        <div className="flex flex-col items-center">
                            <Button onClick={() => handleLogout("logoutFromAllDevices")}
                                className="m-2" outline gradientDuoTone="redToYellow" disabled>
                                Logout from All Devices
                            </Button>
                            <Button onClick={() => handleLogout("logoutFromOtherDevices")}
                                className="m-2" outline gradientDuoTone="purpleToBlue" disabled>
                                Logout From Other Devices
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="col-span-1 md:col-span-2">
                    <section className="p-2">
                        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-slate-500">
                            Username : <span className="dark:text-slate-200">{isLogin.username}</span>
                        </h5>
                        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-slate-500">
                            Role : <span className="dark:text-slate-200">{isLogin.userRole}</span>
                        </h5>
                        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-slate-500">
                            UserId : <span className="dark:text-slate-200">{isLogin.userId}</span>
                        </h5>
                        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-slate-500">
                            Email : <span className="dark:text-slate-200">{userData.email}</span>
                        </h5>
                        <Button onClick={handleUserUpdate} className="mt-2" outline pill>
                            Edit Email or Password
                        </Button>
                    </section>
                </div>

                <div className="flex items-center text-2xl text-purple-700">
                    <span>Address ({`${isLogin.userRole === "SELLER" ? "max-1" : "max-4"}`}) :</span>
                    <Button
                        className="ml-2"
                        outline
                        gradientDuoTone="purpleToPink"
                        onClick={() => navigate("add-address", { state: { from: location.pathname } })}
                        disabled={(isLogin.userRole === "SELLER" && addressData.length >= 1) ||
                            (isLogin.userRole === "CUSTOMER" && addressData.length >= 4)}
                    >
                        Add Address
                    </Button>
                </div>
                <div className="row-span-1 md:row-span-2 col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 m-2">
                    {addressData.map((address) => {
                        return <Card key={address._id} className="max-w-sm">
                            <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                                Address : {address.addressType}
                            </h5>
                            <p className="font-mono text-gray-700 dark:text-gray-400">
                                <span className="font-bold">Street and HNO : </span> {address.streetAddress}
                            </p>
                            <p className="font-mono text-gray-700 dark:text-gray-400">
                                <span className="font-bold">Area : </span> {address.streetAddressAdditional}
                            </p>
                            <p className="font-mono text-gray-700 dark:text-gray-400">
                                <span className="font-bold">City : </span>  {address.city}
                            </p>
                            <p className="font-mono text-gray-700 dark:text-gray-400">
                                <span className="font-bold">State : </span> {address.state}
                            </p>
                            <p className="font-mono text-gray-700 dark:text-gray-400">
                                <span className="font-bold">Country : </span> {address.country} - {address.pincode}
                            </p>
                            <Button onClick={() => handleUpdateAddress(address)}
                                outline gradientDuoTone="pinkToOrange">
                                Edit Address
                            </Button>
                            <hr />

                            <section>
                                <h5 className="text-base font-bold tracking-tight text-gray-900 dark:text-white mb-1">
                                    <FontAwesomeIcon icon={faMobileRetro} /> Contact :&nbsp;
                                    {address.contacts.length >= 2 ?
                                        <span className="text-slate-500">Max-2</span> :
                                        <Link className="text-sm text-blue-600 hover:underline"
                                            to={`/profile-page/addresses/add-contact/${address._id}`}
                                            state={{ from: location.pathname }}>
                                            Add Contact
                                        </Link>}
                                </h5>
                                {address.contacts.map((contact) => {
                                    return <div key={contact._id} className="flex justify-around">
                                        <span className="text-sm text-slate-500 dark:text-slate-400">{contact.priority}</span>
                                        <span className="text-slate-700 dark:text-slate-300 mr-1">{contact.contactNumber}</span>
                                        <Link to="/profile-page/addresses/update-contact"
                                            state={{
                                                addressId: address._id,
                                                contactId: contact._id,
                                                contactNumber: contact.contactNumber,
                                                priority: contact.priority,
                                                from: location.pathname
                                            }} >
                                            <FontAwesomeIcon className="text-blue-600" icon={faPenToSquare} />
                                        </Link>
                                    </div>
                                })}

                            </section>
                        </Card>
                    })}
                </div>
            </div>

        </>
    )
}

export default ProfilePage
