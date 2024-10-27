import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import giftBox from "../../../images/giftbox.png"
import axios from "axios";
import { AuthContext } from "../../authprovider/AuthProvider";
import "../../navbarpage/HomePage.css"
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "../../loader/Spinner";
import openBox from "../../../images/open-box.png"
import { TextInput } from "flowbite-react";
import { HiSearch } from "react-icons/hi";
import { BASE_URL } from "../../appconstants/EcommerceUrl"

function ProductBySeller() {
  let [products, setProducts] = useState([]);
  let [filteredProducts, setFilteredProducts] = useState([]);
  let [totalResults, setTotalResults] = useState(0);
  let [page, setPage] = useState(0);
  let [searchProduct, setSearchProduct] = useState({ storageQuery: "" });
  let { isLogin, setProgress, setIsLoading } = useContext(AuthContext);

  document.title = "Your Products - Ecommerce Shopping App"

  let getAllProducts = async () => {
    setIsLoading(true);
    setProgress(40)
    try {
      setProgress(70)
      let response = await axios.get(`${BASE_URL}sellers/${isLogin.userId}/products?page=${page}&size=10`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true // Includes cookies with the request
        }
      );
      setProgress(90)
      response = response.data;
      // console.log(response);
      setProducts(response.data.content);
      setFilteredProducts(response.data.content)
      setTotalResults(response.data.page.totalElements);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
      setProgress(100)
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  let determineFetchMore = async () => {
    let nextPage = page + 1;
    try {
      let response = await axios.get(`${BASE_URL}sellers/${isLogin.userId}/products?page=${nextPage}&size=10`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true // Includes cookies with the request
        }
      );
      response = response.data;
      // console.log(response);
      setProducts(prevProduct => prevProduct.concat(response.data.content));
      setFilteredProducts(prevProduct => prevProduct.concat(response.data.content))
      setTotalResults(response.data.page.totalElements);
      setPage(nextPage);
    } catch (error) {
      console.error("Error fetching more products:", error);
    }
  };

  let handleInputData = ({ target: { name, value } }) => {
    setSearchProduct({ ...searchProduct, [name]: value });
    filterData(value);
  };

  let filterData = (query) => {
    if (!query.trim()) {
      setFilteredProducts(products);
      return;
    }

    let filtered = products.filter(product =>
      product.productTitle.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.materialTypes.some(type => type.toLowerCase().includes(query.toLowerCase())) ||
      (product.restockedAt && new Date(product.restockedAt).toLocaleDateString().includes(query)) ||
      (product.updatedInventoryAt && new Date(product.updatedInventoryAt).toLocaleDateString().includes(query)) ||
      (product.price && product.price.toString().includes(query))
    );

    setFilteredProducts(filtered);
  };

  return (
    <>
      <h1 className="font-bold text-center text-2xl dark:text-white mb-1">Your Products</h1>
      <div className="lg:w-1/2 sm:w-[70%] ml-auto mr-auto">
        <TextInput
          icon={HiSearch}
          value={searchProduct.storageQuery}
          name="storageQuery"
          onChange={handleInputData}
          className="ml-2 mr-2"
          placeholder="Search Your Products..."
        />
      </div>
      <InfiniteScroll
        dataLength={filteredProducts.length}
        next={determineFetchMore}
        hasMore={products.length !== totalResults}
        loader={<Spinner />}
        scrollableTarget="row"
      >
        <section className="flex flex-wrap m-1 justify-around">
          {filteredProducts.length > 0 ? filteredProducts.map(({ _id, productTitle, price, productImage, description, discount }) => {
            return (
              <Link to={`/sellers/products/product-info/${_id}`}
                key={_id}
                className="rounded-md m-2 w-44 cardShadow product-link"
                title={productTitle}>
                <img
                  className="max-w-sm w-40 m-2 product-picture"
                  alt="ProductImage"
                  src={productImage ? productImage : giftBox}
                />
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
            );
          }) :
            <div className="max-w-64 mt-5 ml-auto mr-auto">
              <img src={openBox} alt="No_Products" />
              <h2 className="text-xl mt-5 text-red-600 dark:text-red-700">There Are No Products...😌</h2>
            </div>
          }
        </section>
      </InfiniteScroll>
    </>
  );
}

export default ProductBySeller;
