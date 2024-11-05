import axios from "axios";
import { Button, Modal } from "flowbite-react";
import { useContext } from "react";
import { HiOutlineLogout } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../appconstants/EcommerceUrl";
import { AuthContext } from "../authprovider/AuthProvider";

// eslint-disable-next-line react/prop-types
function LogoutAlert({ openLogoutAlertModal, setOpenLogoutAlertModal }) {
    const navigate = useNavigate();
    const { login, logout, setProgress, setIsLoading } = useContext(AuthContext);

    const handleLogout = async () => {
        setIsLoading(true)
        setProgress(40)
        try {
            setProgress(70)
            const response = await axios.post(`${BASE_URL}logout`, {},
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true // Includes cookies with the request
                }
            );
            // console.log(response.data)
            setProgress(90)
            if (response.status === 200) {
                login(null)
                logout();
                setProgress(100)
                setIsLoading(false)
                navigate("/login-form")
            }
        } catch (error) {
            console.log(error)
            if (error.response.data.status === 401) {
                console.log(error.response.data)
            }
        } finally {
            setIsLoading(false)
            setProgress(100)
        }
    }

    return (
        <>
            {/* <Button onClick={() => setOpenLogoutAlertModal(true)}>Toggle modal</Button> */}
            <br /><br /><br />
            <Modal show={openLogoutAlertModal} size="md" onClose={() => {
                setOpenLogoutAlertModal(false);
            }} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineLogout className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure want to Logout?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={() => {
                                setOpenLogoutAlertModal(false);
                                handleLogout();
                            }}>
                                {"Logout"}
                            </Button>
                            <Button color="gray" onClick={() => {
                                setOpenLogoutAlertModal(false);
                            }}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}


export default LogoutAlert
