import { Button, Table } from "flowbite-react";
import giftbox from "../../images/giftbox.png";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../authprovider/AuthProvider";
import { useNavigate } from "react-router-dom";
import empty_bag from "../../images/empty_bag.png"
import { BASE_URL } from "../appconstants/EcommerceUrl"

function CartComp() {
    let { isLogin,
        setProgress,
        setIsLoading,
        setPreviousLocation,
        setModelMessage,
        setOpenModal } = useContext(AuthContext);
    let [cartProduct, setCartProduct] = useState([])
    let [totalItemAndPrice, setTotalItemAndPrice] = useState({
        totalItem: 0,
        totalPrice: 0,
        totalDiscountPrice: 0,
        totalPayAblePrice: 0
    });
    let navigate = useNavigate();

    document.title = "Cart - Ecommerce Shopping App"

    let handleOrderQuantity = (action, cartProductId, selectedQuantity, productQuantity) => {
        if (action === "increase" && selectedQuantity < productQuantity) {
            handleIncreatAndDecreaseCartProduct(cartProductId, selectedQuantity + 1);
        } else if (action === "decrease" && selectedQuantity > 1) {
            handleIncreatAndDecreaseCartProduct(cartProductId, selectedQuantity - 1);
        }
    };

    let handleCartProduct = async () => {
        setIsLoading(true);
        setProgress(30)
        try {
            setProgress(70)
            const responseCartProducts = await axios.get(`${BASE_URL}customers/${isLogin.userId}/cart-products`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            setProgress(90)
            // console.log(responseCartProducts.data.data)
            setCartProduct(responseCartProducts.data.data)
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            setProgress(100)
        }
    }
    useEffect(() => {
        handleCartProduct();
    }, []);

    useEffect(() => {
        let totalItem = 0;
        let totalPrice = 0;
        let totalDiscountPrice = 0;
        let totalPayAblePrice = 0;

        cartProduct.forEach(product => {
            totalItem += product.selectedQuantity;
            const productTotalPrice = product.selectedQuantity * product.product.price;
            totalPrice += productTotalPrice;

            const discountAmount = (product.product.discount / 100) * productTotalPrice;
            totalDiscountPrice += discountAmount;

            totalPayAblePrice += productTotalPrice - discountAmount;
        });

        setTotalItemAndPrice({
            totalItem,
            totalPrice,
            totalDiscountPrice,
            totalPayAblePrice
        });
    }, [cartProduct]);

    let handleRemoveCartProduct = async (cartProductId) => {
        setProgress(30)
        setIsLoading(true);
        try {
            setProgress(60)
            const responseCartProducts = await axios.delete(`${BASE_URL}customers/${isLogin.userId}/cart-products/${cartProductId}`,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                });
            setProgress(80)
            // console.log(responseCartProducts)
            setProgress(90)
            if (responseCartProducts.status === 200) {
                setCartProduct(cartProduct.filter(product => product.cartProductId !== cartProductId));
                setPreviousLocation("/cart")
                setModelMessage(responseCartProducts.data.message)
                setOpenModal(true)
                await handleCartProduct();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            setProgress(100)
        }
    }

    let handleRemoveAllCartProduct = async () => {
        setProgress(30)
        setIsLoading(true);
        try {
            setProgress(60)
            const responseCartProducts = await axios.delete(`${BASE_URL}customers/${isLogin.userId}/cart-products`,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                });
            setProgress(90)
            // console.log(responseCartProducts)
            if (responseCartProducts.status === 200) {
                setCartProduct([])
                setPreviousLocation("/cart")
                setModelMessage(responseCartProducts.data.message)
                setOpenModal(true)
                await handleCartProduct();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setProgress(100)
            setIsLoading(false);
        }
    }

    let handleIncreatAndDecreaseCartProduct = async (cartProductId, selectedQuantity) => {
        setProgress(30)
        setIsLoading(true);
        try {
            setProgress(60)
            const responseCartProducts = await axios.put(`${BASE_URL}customers/cart-products/${cartProductId}?selectedQuantity=${selectedQuantity}`,
                {}, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            setProgress(90)
            await handleCartProduct();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            setProgress(100)
        }
    }

    let handleOrderAll = () => {
        setPreviousLocation("/cart")
        setModelMessage("This feature is not activated until")
        setOpenModal(true)
    }

    return (
        <div className="px-1">
            <div className="flex justify-center">
                <h1 className="font-bold text-2xl dark:text-white mb-4">Cart Comp page</h1>
            </div>
            <div className="overflow-x-auto w-full">
                <Table className="min-w-full table-auto">
                    <Table.Head>
                        <Table.HeadCell>Product Title</Table.HeadCell>
                        <Table.HeadCell>Price</Table.HeadCell>
                        <Table.HeadCell>Discount</Table.HeadCell>
                        <Table.HeadCell>Quantity</Table.HeadCell>
                        <Table.HeadCell>Available Stock</Table.HeadCell>
                        <Table.HeadCell>Description</Table.HeadCell>
                        <Table.HeadCell>Product Image</Table.HeadCell>
                        <Table.HeadCell>
                            <span className="sr-only">Edit</span>
                        </Table.HeadCell>
                        <Table.HeadCell>
                            <span className="sr-only">Remove</span>
                        </Table.HeadCell>
                    </Table.Head>

                    <Table.Body className="divide-y">
                        {cartProduct.map(({ _id, selectedQuantity, product }) => {
                            return <Table.Row key={_id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {product.productTitle}
                                </Table.Cell>
                                <Table.Cell>{product.price}</Table.Cell>
                                <Table.Cell>{product.discount}%</Table.Cell>
                                <Table.Cell>
                                    <Button.Group>
                                        <Button outline pill size="xs"
                                            onClick={() => handleOrderQuantity("decrease", _id, selectedQuantity, product.stocks)}>
                                            -
                                        </Button>
                                        <Button outline pill size="xs" disabled>
                                            {selectedQuantity}
                                        </Button>
                                        <Button outline pill size="xs"
                                            onClick={() => handleOrderQuantity("increase", _id, selectedQuantity, product.stocks)}>
                                            +
                                        </Button>
                                    </Button.Group>
                                </Table.Cell>
                                <Table.Cell>{product.stocks}</Table.Cell>
                                <Table.Cell>{product.description}</Table.Cell>
                                <Table.Cell>
                                    <img src={product.productImage ? product.productImage : giftbox} alt="Product" className="w-16 h-16 object-cover" />
                                </Table.Cell>
                                <Table.Cell>
                                    <Button onClick={() => navigate("/cart/addresses",
                                        { state: { product: product, quantity: selectedQuantity } })}
                                        outline gradientDuoTone="greenToBlue">
                                        Order
                                    </Button>
                                </Table.Cell>
                                <Table.Cell>
                                    <Button onClick={() => { handleRemoveCartProduct(_id) }} outline gradientDuoTone="pinkToOrange">
                                        Remove
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        })}
                    </Table.Body>
                </Table>
            </div>

            {cartProduct.length > 0 ? "" : <div className="max-w-64 mt-5 ml-auto mr-auto">
                <img src={empty_bag} alt="No_Products" />
                <h2 className="text-xl mt-5 text-red-600 dark:text-red-700">Your Cart is Empty....😌</h2>
            </div>}

            <footer className={`flex flex-wrap justify-between px-4 py-2 bg-gray-300
                   dark:bg-gray-800 text-gray-800 dark:text-white mt-4 rounded-b-lg`}>
                <div className="text-sm dark:text-slate-400 text-slate-700 bg-slate-50 dark:bg-slate-900 p-1 rounded-lg m-1">
                    Total Items:
                    <span className="text-lime-800 dark:text-lime-400 font-bold ml-1">{totalItemAndPrice.totalItem.toFixed(2)}</span>
                </div>
                <div className="text-sm dark:text-slate-400 text-slate-700 bg-slate-50 dark:bg-slate-900 p-1 rounded-lg m-1">
                    Total Price :
                    <span className="text-pink-800 dark:text-pink-500 font-bold ml-1">{totalItemAndPrice.totalPrice.toFixed(2)} </span>
                    Rs/-
                </div>
                <div className="text-sm dark:text-slate-400 text-slate-700 bg-slate-50 dark:bg-slate-900 p-1 rounded-lg m-1">
                    Total Discounted price :
                    <span className="text-yellow-800 dark:text-yellow-400 font-bold ml-1">{totalItemAndPrice.totalDiscountPrice.toFixed(2)} </span>
                    Rs/-
                </div>
                <div className="text-sm dark:text-slate-400 text-slate-700 bg-slate-50 dark:bg-slate-900 p-1 rounded-lg m-1">
                    Total Payable Price :
                    <span className="text-green-800 dark:text-green-400 font-bold ml-1">{totalItemAndPrice.totalPayAblePrice.toFixed(2)} </span>
                    Rs/-
                </div>

                <div className="flex flex-wrap gap-3">
                    <div>
                        <Button outline onClick={handleOrderAll} gradientDuoTone="greenToBlue" disabled={cartProduct.length === 0 ? true : false}>
                            Order All
                        </Button>
                    </div>
                    <div>
                        <Button onClick={handleRemoveAllCartProduct} outline gradientDuoTone="purpleToBlue"
                            disabled={cartProduct.length === 0 ? true : false}>
                            Remove All
                        </Button>
                    </div>
                </div>
            </footer>

            <br />
            <br />
            <br />
        </div>
    )
}

export default CartComp
