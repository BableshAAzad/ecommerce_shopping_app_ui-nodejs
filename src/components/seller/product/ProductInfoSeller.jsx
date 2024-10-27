import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import productImg from "../../../images/giftbox.png"
import { Badge, Button } from "flowbite-react";
import { HiArrowRight, HiClock, HiTrash } from "react-icons/hi";
import { AuthContext } from "../../authprovider/AuthProvider";
import { BASE_URL } from "../../appconstants/EcommerceUrl"

function ProductInfoSeller() {
    let { productId } = useParams();
    let [product, setProduct] = useState({});
    let [stocks, setStocks] = useState(0);
    let navigate = useNavigate();
    let location = useLocation();
    let { setProgress, setIsLoading } = useContext(AuthContext);

    document.title = "Product Info Seller - Ecommerce Shopping App"

    let getProduct = async () => {
        try {
            setProgress(40)
            setIsLoading(true)
            setProgress(60)
            let response = await axios.get(`${BASE_URL}products/${productId}`);
            setProgress(90)
            response = response.data.data;
            setProduct(response);
            // console.log(response);
            setStocks(response.stocks);
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
            setProgress(100)
        }
    }

    useEffect(() => {
        getProduct();
    }, [productId]);

    return (
        <>
            <div className="flex items-center justify-center">
                <div className="flex flex-col md:flex-row items-center justify-center m-4 border border-green-500 rounded-md w-full md:w-1/2 p-4 cardShadow">
                    <section className="w-full md:w-1/2 text-center">
                        <img
                            className="w-full max-w-sm mx-auto m-2 object-cover"
                            alt="ProductImage"
                            src={product.productImage ? product.productImage : productImg}
                        />
                        <div className="flex flex-wrap gap-2 items-center justify-center mb-2">
                            <Button onClick={() => navigate(`/sellers/products/update-product/${productId}`,
                                { state: { productData: product, from: location.pathname } })} gradientMonochrome="lime">
                                <HiArrowRight className="mr-2 h-5 w-5" />
                                Edit Product
                            </Button>
                            <Button gradientMonochrome="failure" disabled>
                                <HiTrash className="mr-2 h-5 w-5" />
                                Delete Product
                            </Button>
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


export default ProductInfoSeller
