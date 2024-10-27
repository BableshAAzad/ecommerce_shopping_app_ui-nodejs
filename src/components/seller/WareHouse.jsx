import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom"
import "../navbarpage/HomePage.css"
import wareHouseImg from "../../images/warehouseImg.png"
import { AuthContext } from "../authprovider/AuthProvider";
import { TextInput } from "flowbite-react";
import { HiSearch } from "react-icons/hi";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "../loader/Spinner";
import warehouse_empty from "../../images/warehouse_empty.png"
import { BASE_URL } from "../appconstants/EcommerceUrl"

function WareHouse() {
    let [wareHouses, setWareHouses] = useState([])
    let [initialWareHouses, setInitialWareHouses] = useState([]);
    let [page, setPage] = useState(0);
    let [totalResults, setTotalResults] = useState(0);
    let { setProgress, setIsLoading } = useContext(AuthContext);
    let [searchCity, setSearchCity] = useState({ searchWarehouse: "" })

    document.title = "Warehouses - Ecommerce Shopping App"

    let getWareHouses = async () => {
        try {
            setIsLoading(true);
            setProgress(40)
            setProgress(70)
            const response = await axios.get(`${BASE_URL}wareHouses-with-address?page=0&size=10`,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true // Includes cookies with the request
                }
            );
            setProgress(90)
            setWareHouses(response.data.data.content)
            setInitialWareHouses(response.data.data.content)
            setTotalResults(response.data.data.page.totalElements)
            // console.log(response)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
            setProgress(100)
        }
    }
    useEffect(() => {
        getWareHouses();
    }, [])

    let fetchMoreWareHouses = async () => {
        try {
            const response = await axios.get(`${BASE_URL}wareHouses-with-address?page=${page + 1}&size=10`,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true // Includes cookies with the request
                }
            );
            wareHouses(prevWareHouse => prevWareHouse.concat(response.data.data.content))
            setTotalResults(response.data.data.page.totalElements);
            setPage(page + 1);
        } catch (error) {
            console.log(error)
        }
    }

    let fetchWareHousesByCity = async () => {
        if (!searchCity.searchWarehouse.trim()) {
            setWareHouses(initialWareHouses);
            setTotalResults(initialWareHouses.length)
            return;
        }
        try {
            setIsLoading(true);
            const response = await axios.get(`${BASE_URL}addresses/${searchCity.searchWarehouse}/wareHouses?page=0&size=10`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true // Includes cookies with the request
            });
            setWareHouses(response.data.data.content);
            setTotalResults(response.data.data.page.totalElements);
            // console.log(response);
        } catch (error) {
            console.error("Error fetching warehouses by city:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWareHousesByCity()
    }, [searchCity])

    let handleInputData = ({ target: { name, value } }) => {
        setSearchCity({ ...searchCity, [name]: value })
    }

    return (
        <>
            <h1 className="font-bold text-center text-2xl text-yellow-400 dark:text-yellow-600 mb-1">
                Search WareHouses By City Name Enter Your Nearest City Name
            </h1>
            <div className="lg:w-1/2 sm:w-[70%] ml-auto mr-auto">
                <TextInput
                    icon={HiSearch}
                    value={searchCity.searchWarehouse}
                    name="searchWarehouse"
                    onChange={handleInputData}
                    className="ml-2 mr-2"
                    placeholder="Search Warehouses... Enter City Name"
                />
            </div>
            <InfiniteScroll
                dataLength={wareHouses.length}
                next={fetchMoreWareHouses}
                hasMore={wareHouses.length !== totalResults}
                loader={<Spinner />}
                scrollableTarget="row"
            >
                <section className="flex flex-wrap m-2">
                    {wareHouses.length > 0 ? wareHouses.map(({ StoreHouseId, Name, TotalCapacityInKg, Address:
                        { addressId, addressLine, city, country, latitude, longitude, pincode, state } }) => {
                        return <section key={StoreHouseId} className="rounded-md m-2 cardShadow">
                            <img
                                className="max-w-sm w-40 m-2 rounded-md"
                                alt="ProductImage"
                                src={wareHouseImg}
                            />
                            <div className="p-2">
                                <h5 className="text-xl font-bold tracking-tight text-gray-700 dark:text-slate-300">
                                    {Name}
                                </h5>
                                <h5 className="text-sm font-bold tracking-tight text-slate-600 dark:text-slate-500" >
                                    Total Capacity In KG : <span className="text-green-700 dark:text-green-400">{TotalCapacityInKg.toFixed(2)}</span>
                                </h5>
                                <p className="tracking-tight mb-1 text-slate-500" >
                                    WareHouse ID : {StoreHouseId}
                                </p>
                                <hr />
                                <h5 className="text-sm font-bold tracking-tight text-slate-600 dark:text-slate-400" >Address : </h5>
                                <p className="text-slate-500">AddressLine - {addressLine}</p>
                                <p className="text-slate-700 dark:text-slate-400">city -
                                    <span className="font-bold">{city}</span>
                                </p>
                                <p className="text-slate-500">country - {country}</p>
                                <p className="text-slate-500">latitude - {latitude}</p>
                                <p className="text-slate-500">longitude - {longitude}</p>
                                <p className="text-slate-500">pincode - {pincode}</p>
                                <p className="text-slate-500">state - {state}</p>
                                <p className="text-slate-500">addressId - {addressId}</p>
                            </div>
                            <hr />
                            <Link to={`/sellers/warehouses/${StoreHouseId}/storages`}
                                className="text-blue-800 dark:text-blue-300 bg-yellow-400 dark:bg-yellow-800 block text-center">
                                Add Products
                            </Link>
                        </section>
                    }) : <div className="max-w-60 mt-5 ml-auto mr-auto">
                        <img src={warehouse_empty} alt="No_WareHouse" />
                        <h2 className="text-xl mt-5 text-red-600 dark:text-red-700">No WareHouse there....😌</h2>
                    </div>}
                </section>
            </InfiniteScroll>
        </>
    )
}

export default WareHouse
