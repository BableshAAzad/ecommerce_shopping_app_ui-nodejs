import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { useContext } from "react";

// eslint-disable-next-line react/prop-types
function ProtectOtpRoute({ children }) {
    const { isOtp } = useContext(AuthContext);

    if (!isOtp) {
        return <Navigate to="*" />
    }
    return (<>{children}</>)
}

export default ProtectOtpRoute
