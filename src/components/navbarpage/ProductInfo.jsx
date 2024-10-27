import axios from "axios";
import { Badge, Button } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import productImg from "../../images/logo.png"
import { HiShoppingBag, HiShoppingCart, HiBell, HiExclamation, HiClock, HiCheck } from "react-icons/hi";
import "./HomePage.css"
import { AuthContext } from "../authprovider/AuthProvider";
import PopupWarn from "../popup/PopupWarn";
import { BASE_URL } from "../appconstants/EcommerceUrl"

function ProductInfo() {
    let { isLogin,
        setProgress,
        isLoading,
        setIsLoading,
        setPreviousLocation,
        setModelMessage,
        setOpenModal } = useContext(AuthContext);
    let { pid } = useParams()
    let [product, setProduct] = useState({});
    let [stocks, setStocks] = useState(0);
    let [orderQuantity, setOrderQuantity] = useState(1);
    let navigate = useNavigate();
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupData, setPopupData] = useState({});
    const [responseSuccessButton, setResponseSuccessButton] = useState(false);

    let getProduct = async () => {
        try {
            setProgress(30)
            setIsLoading(true)
            setProgress(70)
            let response = await axios.get(`${BASE_URL}products/${pid}`);
            response = response.data.data
            setProduct(response)
            setProgress(90)
            // console.log(response)
            setStocks(response.stocks[0].quantity)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
            setProgress(100)
        }
    }

    document.title = "Product Info - Ecommerce Shopping App"

    useEffect(() => {
        getProduct();
    }, [pid]);

    let handleOrderQuantity = (action) => {
        if (action === "increase" && orderQuantity < stocks) {
            setOrderQuantity(orderQuantity + 1);
        } else if (action === "decrease" && orderQuantity > 1) {
            setOrderQuantity(orderQuantity - 1);
        }
    };


    let handleCartProduct = async (product) => {
        if (!isLogin) {
            navigate("/login-form");
        }
        setIsLoading(true);
        setProgress(40)
        // product.preventDefault();
        let tempProduct = {
            "selectedQuantity": orderQuantity,
            "product": {
                "productId": product.inventoryId,
                "productTitle": product.productTitle,
                "productDescription": product.description,
                "productPrice": product.price,
                "productQuantity": product.stocks[0].quantity,
                "availabilityStatus": "YES"
            }
        }
        try {
            setProgress(70)
            const response = await axios.post(`${BASE_URL}customers/${isLogin.userId}/cart-products`,
                tempProduct,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true // Includes cookies with the request
                }
            );
            setProgress(90)
            // console.log(response);
            if (response.status === 201) {
                setTimeout(() => {
                    setPopupData(response.data);
                    setPopupOpen(true);
                    setResponseSuccessButton(true)
                }, 0);
            }
        } catch (error) {
            console.log(error);
            setTimeout(() => {
                setPopupData(error.response.data);
                setPopupOpen(true);
            }, 0);
        } finally {
            setProgress(100)
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (responseSuccessButton) {
            const timer = setTimeout(() => {
                setResponseSuccessButton(false);
            }, 60000);
            return () => clearTimeout(timer);
        }
    }, [responseSuccessButton, setResponseSuccessButton]);

    let handleAddToWishList = () => {
        setPreviousLocation("/")
        setModelMessage("This feature is not activated until")
        setOpenModal(true)
    }


    const renderAddToWishlistButton = () => (
        <Button onClick={handleAddToWishList} gradientDuoTone="purpleToBlue">
            <HiBell className="mr-2 h-5 w-5" />
            Add to Wishlist
        </Button>
    );

    const renderProcessingButton = () => (
        <Button isProcessing gradientDuoTone="greenToBlue">
            Processing!
        </Button>
    );

    const renderAddToCartButton = () => (
        <Button
            onClick={() => handleCartProduct(product)}
            gradientDuoTone="purpleToBlue"
            disabled={isLogin && isLogin.userRole === "SELLER"}
        >
            {responseSuccessButton ? (
                <>
                    <HiCheck className="mr-2 h-5 w-5" />
                    Added in Cart
                </>
            ) : (
                <>
                    <HiShoppingCart className="mr-2 h-5 w-5" />
                    Add To Cart
                </>
            )}
        </Button>
    );

    const renderOutOfStockButton = () => (
        <Button gradientMonochrome="failure">
            <HiExclamation className="mr-2 h-5 w-5" />
            Out Of Stocks
        </Button>
    );

    const renderBuyNowButton = () => (
        <Button
            onClick={() => {
                handleCartProduct(product);
                !isLogin
                    ? navigate("/login-form")
                    : navigate("/cart/addresses", {
                        state: { product: product, quantity: orderQuantity },
                    });
            }}
            gradientDuoTone="purpleToPink"
            disabled={isLogin && isLogin.userRole === "SELLER"}
        >
            <HiShoppingBag className="mr-2 h-5 w-5" />
            Buy Now
        </Button>
    );

    return (
        <>
            {popupOpen && <PopupWarn isOpen={popupOpen} width="w-[90%]"
                setIsOpen={setPopupOpen} clr="green"
                head={popupData.message} />}

            <div className="flex items-center justify-center">
                <div className="flex flex-col md:flex-row items-center justify-center m-4 border border-green-500 rounded-md w-full md:w-1/2 p-4 cardShadow">
                    <section className="w-full md:w-1/2 text-center">
                        <img
                            className="w-full max-w-sm mx-auto m-2 object-cover"
                            alt="ProductImage"
                            src={product.productImage ? product.productImage : productImg}
                        />
                        <div className="flex flex-wrap gap-2 items-center justify-center mb-2">
                            {stocks === 0 ? renderAddToWishlistButton() : isLoading ? renderProcessingButton() : renderAddToCartButton()}
                            {stocks === 0 ? renderOutOfStockButton() : renderBuyNowButton()}
                        </div>
                    </section>

                    <section className="w-full md:w-1/2 m-2 overflow-auto">
                        <h5 className="text-xl md:text-2xl font-bold mb-2 tracking-tight text-gray-900 dark:text-white">
                            {product.productTitle}
                        </h5>

                        <div className="text-lg font-bold tracking-tight dark:text-slate-400 mb-2" >
                            <span className="text-green-700 dark:text-green-300 mr-2">
                                &#8377;&nbsp;{product.price !== 0.0 ? (product.discount !== 0.0 ? (product.price - ((product.price * product.discount) / 100)) : product.price) : 0.00 + " Rs"}
                            </span>
                            {product.discount === 0.0 ? "" : <span className="font-normal leading-tight text-gray-500 line-through text-md">&#8377;&nbsp;{product.price}</span>}
                        </div>

                        <div className="w-fit">
                            <Badge color="pink" icon={HiClock}>
                                {product.discountType} Offer &nbsp;{product.discount === 0.0 ? "" : <span className="text-pink-500 text-sm">{product.discount}% off</span>}
                            </Badge>
                        </div>

                        <p className="font-normal text-gray-700 dark:text-gray-400 mb-2">
                            <span className="font-semibold">Description:</span> {product.description ? product.description : "It is a demo product"}
                        </p>

                        <p className="font-normal text-gray-700 dark:text-gray-400 mb-2">
                            <span className="font-semibold">Categories: </span>
                            {product.materialTypes ? product.materialTypes.map((ele) => ele + ", ") : "No Material Types"}
                        </p>

                        <section className="flex items-center mb-2">
                            <p className="font-normal text-gray-700 dark:text-gray-400 mr-3">
                                <span className="font-semibold">Order Quantity:</span>
                            </p>
                            <Button.Group>
                                <Button outline pill size="xs"
                                    onClick={() => handleOrderQuantity("decrease")}
                                    disabled={isLogin && isLogin.userRole === "SELLER" ? true : false} >
                                    -
                                </Button>
                                <Button outline pill size="xs" disabled>
                                    {orderQuantity}
                                </Button>
                                <Button outline pill size="xs"
                                    onClick={() => handleOrderQuantity("increase")}
                                    disabled={isLogin && isLogin.userRole === "SELLER" ? true : false} >
                                    +
                                </Button>
                            </Button.Group>
                        </section>

                        <p className="font-normal text-gray-700 dark:text-gray-400 mb-2">
                            <span className="font-semibold">Total Stocks:</span> {stocks}
                        </p>

                        <p className="font-normal text-gray-700 dark:text-gray-400 mb-2">
                            <span className="font-semibold">Manufacture Date:</span> {product.restockedAt}
                        </p>

                        <p className="font-normal text-gray-700 dark:text-gray-400 mb-2">
                            <span className="font-semibold">Size - <br /> Height:</span> {product.heightInMeters} Meters
                            <br />
                            Length: {product.lengthInMeters} Meters
                            <br />
                            Weight: {product.weightInKg} kg
                        </p>
                    </section>
                </div>
            </div>
        </>
    )
}

export default ProductInfo
