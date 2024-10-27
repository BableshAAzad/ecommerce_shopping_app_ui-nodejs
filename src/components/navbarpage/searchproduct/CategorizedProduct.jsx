import "./CategorizedProduct.css"
import "../HomePage.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTv, faShirt, faUserTie, faCouch, faBagShopping, faCartFlatbedSuitcase } from "@fortawesome/free-solid-svg-icons";

// eslint-disable-next-line react/prop-types
export default function CategorizedProduct({ handleFilterProducts, setIsCategoryApplied }) {
    let productTypes = [
        {
            productType: "Electronics",
            typeIcon: faTv,
            text_color: "cyan",
            query: "ELECTRONIC"
        },
        {
            productType: "Fashion",
            typeIcon: faShirt,
            text_color: "blue",
            query: "PLASTIC LEATHER RUBBER FABRIC SYNTHETIC CLOTH"
        },
        {
            productType: "Beauty",
            typeIcon: faUserTie,
            text_color: "pink",
            query: "PAPER LEATHER RUBBER BIODEGRADABLE SYNTHETIC"
        },
        {
            productType: "Furniture",
            typeIcon: faCouch,
            text_color: "purple",
            query: "WOOD SOLID GLASS STONE BIODEGRADABLE"
        },
        {
            productType: "Grocery",
            typeIcon: faBagShopping,
            text_color: "red",
            query: "BIODEGRADABLE LIQUID PAPER PLASTIC FIBER RUBBER COMPOSITE BIODEGRADABLE SYNTHETIC ORGANIC"
        },
        {
            productType: "Home & Kitchen",
            typeIcon: faCartFlatbedSuitcase,
            text_color: "green",
            query: "SOLID PLASTIC FIBER PAPER CERAMIC GLASS METAL RUBBER STONE COMPOSITE BIODEGRADABLE SYNTHETIC ORGANIC WOOD"
        }
    ];

    const handleCategoryClick = (category) => {
        const filterData = {
            productTitle: "",
            minPrice: "",
            maxPrice: "",
            description: "",
            sortOrder: "newToOld",
            materialTypes: category.split(" ")
        }
        handleFilterProducts(filterData);
        setIsCategoryApplied(true);
    }

    return (
        <>
            <div className="p-2 filter-product-main">
                <div className="mb-1 pb-1 border-b border-gray-200 dark:border-gray-700">
                    <ul className="flex flex-wrap justify-around -mb-px text-sm font-medium text-center" >

                        {productTypes.map(({ productType, typeIcon, text_color, query }, index) => {
                            return <li key={index} className="me-2">
                                <button className={`inline-block p-1 text-sm m-1 ${window.innerWidth < 409 ? 'responsive-margin' : ''}
        rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:bg-slate-950 bg-slate-200
         dark:hover:text-gray-300 text-${text_color}-600`}
                                    type="button" onClick={() => handleCategoryClick(query)}>
                                    <FontAwesomeIcon icon={typeIcon} className="pr-2 lg:size-5 sm:size-4" />
                                    {productType}
                                </button>
                            </li>
                        })}
                    </ul>
                </div>
            </div>
        </>
    );
}
