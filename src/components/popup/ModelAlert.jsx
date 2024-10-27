import { Button, Modal } from "flowbite-react";
// import { HiCheckCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export function ModelAlert({ openModal, setOpenModal, modelMessage, previousLocation }) {
    let navigate = useNavigate();
    return (
        <>
            {/* <Button onClick={() => setOpenModal(true)}>Toggle modal</Button> */}
            <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        {/* <HiCheckCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" /> */}
                        <p className="mx-auto mb-4 h-14 w-14 text-6xl">
                            {"👍"}
                        </p>
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            {modelMessage}
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button onClick={() => { setOpenModal(false), navigate(previousLocation) }}
                                outline gradientDuoTone="purpleToPink">
                                {"Previous Page"}
                            </Button>
                            <Button onClick={() => setOpenModal(false)}
                                outline gradientDuoTone="tealToLime">
                                Ok
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
