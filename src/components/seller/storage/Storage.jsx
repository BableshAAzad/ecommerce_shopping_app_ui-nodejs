import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import storageImg from "../../../images/storageImg.png";
import { AuthContext } from "../../authprovider/AuthProvider";
import "../../navbarpage/HomePage.css";
import searchImg from "../../../images/search.png";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "../../loader/Spinner";
import { TextInput } from "flowbite-react";
import { HiSearch } from "react-icons/hi";
import { BASE_URL } from "../../appconstants/EcommerceUrl"

function Storage() {
    let [storages, setStorages] = useState([]);
    let [filteredStorages, setFilteredStorages] = useState([]);
    let [page, setPage] = useState(0);
    let [totalResults, setTotalResults] = useState(0);
    let [searchStorage, setSearchStorage] = useState({ storageQuery: "" });
    let { isLogin, setIsLoading, setProgress } = useContext(AuthContext);
    let navigate = useNavigate();

    let getStorages = async () => {
        try {
            setProgress(30);
            setIsLoading(true);
            setProgress(70);
            let response = await axios.get(`${BASE_URL}sellers/${isLogin.userId}/storages?page=0&size=10`,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true // Includes cookies with the request
                }
            );
            setProgress(90);
            // console.log(response);
            setStorages(response.data.data.content);
            setFilteredStorages(response.data.data.content);
            setTotalResults(response.data.data.page.totalElements);
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
            setProgress(100);
        }
    };

    useEffect(() => {
        getStorages();
    }, []);

    let fetchMoreStorages = async () => {
        try {
            let response = await axios.get(`${BASE_URL}sellers/${isLogin.userId}/storages?page=${page + 1}&size=10`,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true // Includes cookies with the request
                }
            );
            setStorages(prevStorages => prevStorages.concat(response.data.data.content));
            setFilteredStorages(prevFilteredStorages => prevFilteredStorages.concat(response.data.data.content));
            setTotalResults(response.data.data.page.totalElements);
            setPage(page + 1);
        } catch (error) {
            console.log(error)
        }
    };

    let handleNavigate = (storageId, materialTypes) => {
        navigate(`/sellers/products/add-product/${storageId}`,
            { state: { storageData: materialTypes, from: location.pathname } });
    };

    let handleInputData = ({ target: { name, value } }) => {
        setSearchStorage({ ...searchStorage, [name]: value });
        filterData(value);
    };

    let filterData = (query) => {
        if (!query.trim()) {
            setFilteredStorages(storages);
            return;
        }
        let filtered = storages.filter(storage =>
            storage.blockName.toLowerCase().includes(query.toLowerCase()) ||
            storage.section.toLowerCase().includes(query.toLowerCase()) ||
            storage.materialTypes.some(type => type.toLowerCase().includes(query.toLowerCase()))
        );
        setFilteredStorages(filtered);
    };

    return (
        <>
            <h1 className="font-bold text-center text-2xl dark:text-slate-400 mb-1">
                Your Total Storages : {filteredStorages.length}
            </h1>
            <div className="lg:w-1/2 sm:w-[70%] ml-auto mr-auto">
                <TextInput
                    icon={HiSearch}
                    value={searchStorage.storageQuery}
                    name="storageQuery"
                    onChange={handleInputData}
                    className="ml-2 mr-2"
                    placeholder="Search Storage..."
                />
            </div>
            <InfiniteScroll
                dataLength={filteredStorages.length}
                next={fetchMoreStorages}
                hasMore={storages.length !== totalResults}
                loader={<Spinner />}
                scrollableTarget="row"
            >
                <section className="flex flex-wrap m-2">
                    {filteredStorages.length > 0 ? filteredStorages.map(({ storageId, section, maxAdditionalWeightInKg,
                        blockName, availableArea, materialTypes, storeHouseId }) => {
                        return <section key={storageId} className="rounded-md m-2 max-w-60 cardShadow">
                            <img
                                className="max-w-sm w-40 m-2 rounded-md"
                                alt="ProductImage"
                                src={storageImg}
                            />
                            <div className="p-2">
                                <h5 className="text-xl font-bold tracking-tight text-gray-700 dark:text-slate-300">
                                    Block Name : {blockName}
                                </h5>
                                <h5 className="text-sm font-bold tracking-tight dark:text-slate-400" >
                                    Storage Id : <span className="text-green-700 dark:text-green-300">
                                        {storageId}
                                    </span>
                                </h5>
                                <h5 className="text-sm font-bold tracking-tight dark:text-slate-400" >
                                    Section : <span className="text-green-700 dark:text-green-300">
                                        {section}
                                    </span>
                                </h5>
                                <h5 className="text-sm font-bold tracking-tight dark:text-slate-400" >
                                    Max Additional Weight: <span className="text-green-700 dark:text-green-300">
                                        {maxAdditionalWeightInKg.toFixed(2)} Kg
                                    </span>
                                </h5>
                                <h5 className="text-sm font-bold tracking-tight dark:text-slate-400" >
                                    Available Area : <span className="text-green-700 dark:text-green-300">
                                        {availableArea.toFixed(2)}
                                    </span>
                                </h5>
                                <h5 className="text-sm font-bold tracking-tight dark:text-slate-400" >
                                    Material Types : <span className="text-green-700 font-mono dark:text-green-300">
                                        {materialTypes ? materialTypes.join(", ") : "No Material Types"}
                                    </span>
                                </h5>
                                <h5 className="text-sm font-bold tracking-tight dark:text-slate-400 mb-1" >
                                    WareHouse Id : <span className="text-green-700 dark:text-green-300">
                                        {storeHouseId}
                                    </span>
                                </h5>
                            </div>
                            <hr />
                            <button className="text-blue-800 dark:text-blue-300 bg-yellow-400 dark:bg-yellow-800 block w-full text-center"
                                onClick={() => handleNavigate(storageId, materialTypes)}>
                                Add Products
                            </button>
                        </section>
                    }) :
                        <div className="max-w-64 mt-5 ml-auto mr-auto">
                            <img src={searchImg} alt="No_Storages" />
                            <h2 className="text-xl mt-5 text-red-600 dark:text-red-700">There Are No Storages....😌</h2>
                        </div>
                    }
                </section>
            </InfiniteScroll>
        </>
    );
}

export default Storage;
