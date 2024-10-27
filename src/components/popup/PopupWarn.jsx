import { Alert } from "flowbite-react";
import { useEffect } from "react";
import { HiInformationCircle } from "react-icons/hi";

// eslint-disable-next-line react/prop-types
function PopupWarn({ clr, head, msg, width, isOpen, setIsOpen }) {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                setIsOpen(false);
            }, 60000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, setIsOpen]);

    return (
        <>
            {isOpen && (
                <Alert
                    className={`${width} ml-auto mr-auto mt-4`} //w-2/3
                    icon={HiInformationCircle}
                    color={clr}
                    onDismiss={() => setIsOpen(false)}
                    withBorderAccent
                >
                    <span className="font-medium">{head}</span> {msg}
                </Alert>
            )}
        </>
    );
}

export default PopupWarn;
