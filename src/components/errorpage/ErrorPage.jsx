import { Link } from "react-router-dom";
import error404img from "../../images/error404img.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

function ErrorPage() {
    document.title = "Not found - Ecommerce Shopping App"
    return (
        <div className="flex flex-col justify-center items-center h-screen text-center">
            <img src={error404img} alt="error" className="w-32 mb-4" />
            <h5 className="text-2xl font-bold tracking-tight text-red-600 mb-2">
                Unfortunately the page you are looking for has been moved or deleted
            </h5>
            <Link to="/" className="bg-blue-500 w-fit ml-auto mr-auto text-white rounded mt-5 p-3">
                Home Page
                <FontAwesomeIcon className="ml-3 m-auto" icon={faArrowRight} />
            </Link>
        </div>
    );
}

export default ErrorPage;
