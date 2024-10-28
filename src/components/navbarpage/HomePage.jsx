import axios from "axios";
import { useEffect, useState, useContext } from "react";
import productPic from "../../images/logo.png";
import empty_bag from "../../images/empty_bag.png";
import { Link } from "react-router-dom";
import "./HomePage.css";
import Spinner from "../loader/Spinner";
import { Button } from "flowbite-react";
import CategorizedProduct from "./searchproduct/CategorizedProduct";
import FilterProduct from "./searchproduct/FilterProduct";
import { HiOutlineFilter } from "react-icons/hi";
import InfiniteScroll from 'react-infinite-scroll-component';
import CarouselHome from "./carousel/CarouselHome";
import { AuthContext } from "../authprovider/AuthProvider";
import { BASE_URL } from "../appconstants/EcommerceUrl"

function HomePage() {
    let { setProgress, setIsLoading } = useContext(AuthContext);
    let [products, setProducts] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    let [page, setPage] = useState(0);
    let [totalResults, setTotalResults] = useState(0);
    let [isFilterApplied, setIsFilterApplied] = useState(false);
    let [filterData, setFilterData] = useState({});
    let [isCategoryApplied, setIsCategoryApplied] = useState(false);

    document.title = "Ecommerce Shopping Application"

    let getAllProducts = async () => {
        setIsLoading(true);
        setProgress(30)
        setProgress(70)
        try {
            let response = await axios.get(`${BASE_URL}products?page=${page}&size=10`);
            setProgress(90)
            response = response.data;
            // console.log(response);
            setProducts(response.data.content);
            setTotalResults(response.data.page.totalElements);
        } catch (error) {
            console.log(error)
        } finally {
            setProgress(100)
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getAllProducts();
    }, []);

    let fetchMoreProducts = async () => {
        try {
            let response = await axios.get(`${BASE_URL}products?page=${page + 1}&size=10`);
            response = response.data;
            // console.log(response);
            setPage(page + 1);
            setProducts([...products, ...response.data.content]);
            setTotalResults(response.data.page.totalElements);
        } catch (error) {
            console.log(error)
        }
    };
// 
    const handleFilterProducts = async (filterData, reset = false) => {
        setIsLoading(true)
        if (reset) {
            setPage(0);
            setIsFilterApplied(false);
            setFilterData({});
            getAllProducts();
        } else {
            try {
                setProgress(30)
                setFilterData(filterData);
                setProgress(70)
                let response = await axios.post(`${BASE_URL}products/filter?page=0&size=10`,
                    filterData, {
                    headers: { "Content-Type": "application/json" },
                });
                response = response.data;
                setProgress(90)
                // console.log(response);
                setPage(0);
                setProducts(response.data.content);
                setTotalResults(response.data.page.totalElements);
                setIsFilterApplied(true);
            } catch (error) {
                console.log(error)
            } finally {
                setProgress(100)
                setIsLoading(false)
            }
        }
    };

    let fetchMoreFilteredProducts = async () => {
        try {
            let response = await axios.post(`${BASE_URL}products/filter?page=${page + 1}&size=10`,
                filterData, {
                headers: { "Content-Type": "application/json" },
            });
            response = response.data;
            // console.log(response);
            setPage(page + 1);
            setProducts(products.concat(response.data.content));
            setTotalResults(response.data.page.totalElements);
        } catch (error) {
            console.log(error)
        }
    };

    const handleCategoryProducts = async (filterData, reset = false) => {
        setProgress(30)
        setIsLoading(true)
        if (reset) {
            setPage(0);
            setIsCategoryApplied(false);
            setFilterData({});
            getAllProducts();
        } else {
            try {
                setProgress(30)
                setFilterData(filterData);
                setProgress(70)
                let response = await axios.post(`${BASE_URL}products/filter?page=0&size=10`,
                    filterData, {
                    headers: { "Content-Type": "application/json" },
                });
                response = response.data;
                setProgress(90)
                // console.log(response);
                setPage(0);
                setProducts(response.data.content);
                setTotalResults(response.data.page.totalElements);
                setIsCategoryApplied(true);
            } catch (error) {
                console.log(error)
            } finally {
                setProgress(100)
                setIsLoading(false)
            }
        }
    };

    let fetchMoreCategoryProducts = async () => {
        try {
            let response = await axios.post(`${BASE_URL}products/filter?page=${page + 1}&size=10`,
                filterData, {
                headers: { "Content-Type": "application/json" },
            });
            response = response.data;
            // console.log(response);
            setPage(page + 1);
            setProducts(products.concat(response.data.content));
            setTotalResults(response.data.page.totalElements);
        } catch (error) {
            console.log(error)
        }
    };

    const determineFetchMore = () => {
        if (isFilterApplied) {
            return fetchMoreFilteredProducts;
        } else if (isCategoryApplied) {
            return fetchMoreCategoryProducts;
        } else {
            return fetchMoreProducts;
        }
    };

    return (
        <>
            <FilterProduct isOpen={isOpen} setIsOpen={setIsOpen} handleFilterProducts={handleFilterProducts} />

            <CategorizedProduct handleFilterProducts={handleCategoryProducts} setIsCategoryApplied={setIsCategoryApplied} />

            <CarouselHome />
            <br />
            <section className="flex justify-start gap-4">
                <Button className="ml-1" onClick={() => setIsOpen(true)} outline gradientDuoTone="cyanToBlue">
                    <HiOutlineFilter className="size-6 pr-2" />
                    Filter Products
                </Button>
                <p className="dark:text-cyan-300 text-cyan-600 text-xl pt-2">Filter Products here 👈</p>
            </section>

            <InfiniteScroll
                dataLength={products.length}
                next={determineFetchMore()}
                hasMore={products.length !== totalResults}
                loader={<Spinner />}
                scrollableTarget="row"
            >
                <section className="flex flex-wrap m-1 justify-around">
                    {products.length > 0 ?
                        products.map(({ _id, productTitle, price, productImage, description, discount }) => {
                            return <Link to={`/products/${_id}`}
                                key={_id + productTitle}
                                className="rounded-md m-2 w-44 cardShadow product-link overflow-auto"
                                title={productTitle}>
                                <div>
                                    <img
                                        alt="ProductImage"
                                        src={productImage ? productImage : productPic}
                                        className="max-w-sm w-40 m-2 product-picture"
                                    />
                                </div>
                                <div className="p-2">
                                    <h5 className="text-xl font-bold tracking-tight text-gray-700 dark:text-slate-300">
                                        {productTitle}
                                    </h5>
                                    <div className="text-sm font-bold tracking-tight dark:text-slate-400" >
                                        <span className="text-green-700 dark:text-green-300 mr-2">
                                            &#8377;&nbsp;{price !== 0.0 ? (discount !== 0.0 ? (price - ((price * discount) / 100)) : price) : 0.00 + " Rs"}
                                        </span>
                                        {discount === 0.0 ? "" : <span className="font-normal leading-tight text-gray-500 line-through text-xs">&#8377;&nbsp;{price}</span>}
                                        &nbsp;{discount === 0.0 ? "" : <span className="text-pink-500 text-xs">{discount}% off</span>}
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-400">
                                        {description !== null ? description : "N/A"}
                                    </p>
                                </div>
                            </Link>
                        }) : <img src={empty_bag} alt="No_Products" />}
                </section>
            </InfiniteScroll>
            <br />
        </>
    );
}

export default HomePage;
