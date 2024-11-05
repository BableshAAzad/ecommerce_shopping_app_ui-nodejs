import { Button, Card, Modal } from "flowbite-react";
import { useNavigate, useParams } from "react-router-dom"
import { useContext, useEffect, useState } from "react";
import PopupWarn from "../popup/PopupWarn";
import axios from "axios";
import { AuthContext } from "../authprovider/AuthProvider";
import { HiOutlineArrowRight, HiOutlineShoppingBag } from "react-icons/hi";
import { BASE_URL } from "../appconstants/EcommerceUrl"

function OrderPreview() {
    let [popupOpen, setPopupOpen] = useState(false);
    let [openModal, setOpenModal] = useState(false);
    let [popupData, setPopupData] = useState("");
    let { isLogin, setProgress, setIsLoading } = useContext(AuthContext);
    let navigate = useNavigate();
    let { productId, selectedQuantity, addressId } = useParams();
    let [previewData, setPreviewData] = useState({ product: {}, address: {} })
    selectedQuantity = parseInt(selectedQuantity)

    document.title = "Order Preview - Ecommerce Shopping App"

    useEffect(() => {
        const fetchPreviewData = async () => {
            try {
                setIsLoading(true);
                const productResponse = await axios.get(`${BASE_URL}products/${productId}`);
                const addressResponse = await axios.get(`${BASE_URL}users/addresses/${addressId}`, {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                });

                setPreviewData({
                    product: productResponse.data.data,
                    address: addressResponse.data.data
                });
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPreviewData();
    }, [productId, addressId, setIsLoading]);


    const productEle = [
        {
            title: "Description:",
            value: previewData.product.description
        },
    ];

    const AddressEle = [
        {
            title: "Address:",
            value: `${previewData.address.streetAddress || ''}, 
                    ${previewData.address.streetAddressAdditional || ''}, 
                    ${previewData.address.city || ''}, ${previewData.address.state || ''}, 
                    ${previewData.address.country || ''}, Pincode : ${previewData.address.pincode || ''}`
        },
        {
            title: `${previewData.address.contacts?.[0]?.priority || 'Primary'} contact:`,
            value: previewData.address.contacts?.[0]?.contactNumber || 'N/A'
        },
        {
            title: `${previewData.address.contacts?.[1]?.priority || 'Secondary'} contact:`,
            value: previewData.address.contacts?.[1]?.contactNumber || 'N/A'
        },
    ];

    const PriceEle = [
        {
            title: "Product Price:",
            value: previewData.product.price ? previewData.product.price.toFixed(2) : 0 + " Rs/-"
        },
        {
            title: "Quantity:",
            value: selectedQuantity
        },
        {
            title: "Discount:",
            value: previewData.product.discount + "%"
        },
        {
            title: "GST:",
            value: 0.00
        },
        {
            title: "Total Discount Price:",
            value: (selectedQuantity * previewData.product.price * (previewData.product.discount / 100)).toFixed(2) + " Rs/-"
        },
        {
            title: "Total Price:",
            value: (selectedQuantity * previewData.product.price).toFixed(2) + " Rs/-"
        },
    ];

    let handleOrder = async (e) => {
        setProgress(30)
        setIsLoading(true);
        e.preventDefault();
        setProgress(70)
        try {
            const response = await axios.post(`${BASE_URL}customers/${isLogin.userId}/addresses/${addressId}/products/${productId}/purchase-orders`,
                {
                    totalQuantity: selectedQuantity,
                    totalPrice: (selectedQuantity * previewData.product.price).toFixed(2),
                    discount: previewData.product.discount,
                    discountPrice: (selectedQuantity * previewData.product.price * (previewData.product.discount / 100)).toFixed(2),
                    totalPayableAmount: ((selectedQuantity * previewData.product.price) - (selectedQuantity * previewData.product.price * (previewData.product.discount / 100))).toFixed(2)
                },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true // Includes cookies with the request
                }
            );
            setProgress(90)
            // console.log(response);
            setIsLoading(false);
            if (response.status === 201) {
                setTimeout(() => {
                    setPopupData(response.data.message);
                    setPopupOpen(true);
                    setOpenModal(true)
                }, 0);
            } else if (response.status === 200) {
                setTimeout(() => {
                    setPopupData(response.data.message);
                    setPopupOpen(true);
                    setOpenModal(true)
                }, 0);
            }
        } catch (error) {
            console.log(error);
            setTimeout(() => {
                setPopupData(error.response.data.message);
                setPopupOpen(true);
            }, 0);
        } finally {
            setProgress(100);
            setIsLoading(false);
        }
    }
    return (
        <>
            {popupOpen && <PopupWarn isOpen={popupOpen} width="w-[90%]"
                setIsOpen={setPopupOpen} clr="warning"
                head={popupData.message} msg={popupData} />}

            <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineShoppingBag className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            {popupData}
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button onClick={() => setOpenModal(false)} outline pill>
                                OK
                            </Button>
                            <Button onClick={() => { setOpenModal(false), navigate("/orders") }} outline gradientDuoTone="tealToLime">
                                Check Orders
                                <HiOutlineArrowRight className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>



            <h1 className="font-bold text-3xl m-2 text-pink-600 text-center">Preview Order : </h1>
            <Card className='max-w-sm ml-auto mr-auto mb-7'>
                <ul className="space-y-4">

                    <li className="flex justify-between space-x-3">
                        <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                            Product Name :
                        </span>
                        <span className="font-bold dark:text-white text-sm">{previewData.product.productTitle}</span>
                    </li>

                    {productEle.map((ele, index) => {
                        return <li key={index} className="flex justify-between space-x-3 ">
                            <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                                {ele.title}
                            </span>
                            <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                                {ele.value}
                            </span>
                        </li>
                    })}
                    <hr />
                    <li className="flex justify-between space-x-3">
                        <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                            Address Type:
                        </span>
                        <span className="font-bold dark:text-white text-sm">{previewData.address.addressType}</span>
                    </li>
                    {AddressEle.map((ele, index) => {
                        return <li key={index} className="flex justify-between space-x-3 ">
                            <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                                {ele.title}
                            </span>
                            <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                                {ele.value}
                            </span>
                        </li>
                    })}
                    <hr />
                    {PriceEle.map((ele, index) => {
                        return <li key={index} className="flex justify-between space-x-3 ">
                            <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                                {ele.title}
                            </span>
                            <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                                {ele.value}
                            </span>
                        </li>
                    })}

                    <li className="flex justify-between space-x-3">
                        <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                            Total Payable Amount :
                        </span>
                        <span className="font-bold dark:text-white text-lg">{((selectedQuantity * previewData.product.price) - (selectedQuantity * previewData.product.price * (previewData.product.discount / 100))).toFixed(2)} Rs/-</span>
                    </li>

                </ul>
                <div className="flex flex-wrap gap-3 justify-center">
                    <div>
                        <Button onClick={handleOrder} outline gradientDuoTone="greenToBlue" >
                            Order
                        </Button>
                    </div>
                    <div>
                        <Button outline gradientDuoTone="pinkToOrange" onClick={() => navigate("/")} >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Card>
        </>
    )
}

export default OrderPreview
