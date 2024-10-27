import { Link, useLocation } from "react-router-dom";
import { Card } from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../authprovider/AuthProvider";
import { useContext, useEffect } from "react";

function UserOtpVerifiedPage() {
  const location = useLocation();
  const { otpVerify } = useContext(AuthContext);
  let formData = location.state.data || location.state
    || {
    userId: 777,
    username: "aazadbablesh",
    email: "aazadbablesh@mail.com",
    userRole: "CUSTOMER"
  };
  document.title = "Registration successful - Ecommerce Shopping App"

  useEffect(() => {
    setTimeout(() => {
      otpVerify(false)
    }, 180000)
  }, [])

  return (
    <div className="flex justify-center items-center mb-20 mt-20">
      {formData !== null ?
        <Card className="max-w-sm bg-blue-200">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Operation Successfully done
          </h5>
          <h6 className="text-xl font-normal text-gray-700 dark:text-gray-400">
            Your username is : <span className="text-green-800 dark:text-slate-300 font-bold">{formData.username}</span>
          </h6>
          <h6 className="text-xl font-normal text-gray-700 dark:text-gray-400">
            Your UserId is : <span className="text-green-800 dark:text-slate-300 font-bold">{formData.userId}</span>
          </h6>
          <h6 className="text-xl font-normal text-gray-700 dark:text-gray-400">
            Your User Email is : <span className="text-green-800 dark:text-slate-300 font-bold">{formData.email}</span>
          </h6>
          <h6 className="text-xl font-normal text-gray-700 dark:text-gray-400">
            Your User Role is : <span className="text-green-800 dark:text-slate-300 font-bold">{formData.userRole}</span>
          </h6>
          <Link to="/login-form" className="bg-blue-600 w-fit ml-auto mr-auto text-white rounded p-3">
            Login Page
            <FontAwesomeIcon className="ml-3 m-auto" icon={faArrowRight} />
          </Link>
        </Card>
        : <h1 className="dark:text-white text-2xl text-red-600">Please Login first...</h1>
      }
    </div>
  );
}

export default UserOtpVerifiedPage;
