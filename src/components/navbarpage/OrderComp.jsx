import { Button, Table } from "flowbite-react"
import giftbox from "../../images/giftbox.png";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../authprovider/AuthProvider";
import empty_bag from "../../images/empty_bag.png"
import { BASE_URL } from "../appconstants/EcommerceUrl"

function OrderComp() {
    let [orders, setOrders] = useState([]);
    let { isLogin, setProgress, setIsLoading } = useContext(AuthContext);

    document.title = "Orders - Ecommerce Shopping App"

    let handleOrders = async () => {
        setProgress(40)
        setIsLoading(true);
        try {
            setProgress(70)
            const responseOrders = await axios.get(`${BASE_URL}customers/${isLogin.userId}/purchase-orders`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            setProgress(90)
            if (responseOrders.status === 200) {
                setOrders(responseOrders.data.data)
            }
            // console.log(responseOrders)
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            setProgress(100)
        }
    }

    useEffect(() => {
        handleOrders();
    }, []);

    let downloadInvoice = async (orderId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}customers/purchase-orders/${orderId}`, {
                headers: { "Content-Type": "application/json" },
                responseType: 'blob', // This is important for handling binary data
                withCredentials: true,
            });

            // Create a URL for the PDF and open it in a new tab
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            window.open(url, '_blank');
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="text-center">
                <h1 className="font-bold text-2xl dark:text-white m-2">OrderComp page</h1>

                <div className="overflow-x-auto w-full">
                    <Table className="min-w-full table-auto">
                        <Table.Head>
                            <Table.HeadCell className="px-3">Order Id</Table.HeadCell>
                            <Table.HeadCell className="px-1">Product Title</Table.HeadCell>
                            <Table.HeadCell className="px-1">Invoice Date</Table.HeadCell>
                            <Table.HeadCell className="px-1">Product Image</Table.HeadCell>
                            <Table.HeadCell>
                                <span className="sr-only">invoice</span>
                            </Table.HeadCell>
                        </Table.Head>

                        <Table.Body className="divide-y">
                            {orders.map(({ orderId, inventoryTitle, invoiceDate, inventoryImage }) => {
                                return <Table.Row key={orderId} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="px-3 py-1">{orderId}</Table.Cell>
                                    <Table.Cell className="px-1 py-1 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {inventoryTitle}
                                    </Table.Cell>
                                    <Table.Cell className="px-1 py-1">{invoiceDate}</Table.Cell>
                                    <Table.Cell className="px-1 py-1">
                                        <img src={inventoryImage ? inventoryImage : giftbox} alt="Product" className="w-16 h-16 object-cover" />
                                    </Table.Cell>
                                    <Table.Cell className="px-1 py-1">
                                        <Button onClick={() => downloadInvoice(orderId)} outline gradientDuoTone="greenToBlue">
                                            View Invoice
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            })}
                        </Table.Body>
                    </Table>
                </div>
                {orders.length > 0 ? "" : <div className="max-w-64 mt-5 ml-auto mr-auto">
                    <img src={empty_bag} alt="No_Products" />
                    <h2 className="text-xl mt-5 text-red-600 dark:text-red-700">Your Cart is Empty....😌</h2>
                </div>}
            </div>
            <br />
            <br />
        </>
    )
}

export default OrderComp
