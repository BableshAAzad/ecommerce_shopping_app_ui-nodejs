import { useContext, useState } from 'react';
import { faBoxOpen, faCartShopping, faSearch, faWarehouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navbar } from "flowbite-react";
import DarkModeOption from "../darkmode/DarkModeOption";
import "./HeaderComp.css"
import "./UserData.css"
import UserData from './UserData';
import shopping_bags from "../../images/shopping-bags.png"
import { NavLink, useLocation } from 'react-router-dom';
import MoreOptionNav from './MoreOptionNav';
import { AuthContext } from '../authprovider/AuthProvider';
import NetworkStatus from "../network/NetworkStatus"
import SearchProductModal from '../navbarpage/searchproduct/SearchProductModal';

function HeaderComp() {
    const { isLogin } = useContext(AuthContext);
    const [openModal, setOpenModal] = useState(false);
    const location = useLocation();

    const handleSearchClick = () => {
        setOpenModal(true);
    };

    return (
        <>
            <Navbar fluid className='bg-slate-300 dark:bg-gray-800 fixed w-full z-20 top-0 start-0 bg-opacity-75 dark:bg-opacity-70'>
                <NavLink to='/' className='flex items-center navlogo'>
                    {/* <Navbar.Link active={location.pathname === "/"} as="div"> */}
                    <img src={shopping_bags} alt="EcommerceShoppingApp" width="47" height="40" title="EcommerceShoppingApp" />
                    <span className="self-center sitename dark:text-white text-xl font-semibold break-words md:whitespace-normal">Ecommerce Shopping App <NetworkStatus /> </span>
                    {/* </Navbar.Link> */}
                </NavLink>
                <div className="flex md:order-1 md:w-1/4">
                    <Navbar.Toggle />
                    <button onClick={handleSearchClick} className="md:hidden p-2 dark:text-white">
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                    {/* <div className={`w-full ${isSearchVisible ? 'block' : 'hidden'} md:block`}>
                        <TextInput className="w-full" placeholder="Search Products"  />
                    </div> */}
                    <div className={`w-full hidden md:block`}>
                        <div
                            className="w-full cursor-pointer rounded-md p-2 bg-white dark:bg-slate-700
                             text-gray-700 dark:text-slate-300 flex items-center"
                            onClick={handleSearchClick}
                        >
                            <FontAwesomeIcon icon={faSearch} className="mr-2" />
                            <span className="flex-grow">Search Products</span>
                        </div>
                        <SearchProductModal
                            openModal={openModal}
                            setOpenModal={setOpenModal}
                        />
                    </div>
                </div>
                <Navbar.Collapse className="md:order-2">
                    <UserData />

                    <NavLink to="/cart" className="text-base">
                        <Navbar.Link active={location.pathname === "/cart"} as="div">
                            <FontAwesomeIcon icon={faCartShopping} />
                            &nbsp;Cart
                        </Navbar.Link>
                    </NavLink>

                    <NavLink to={(isLogin === null || isLogin.userRole === 'CUSTOMER') ? "/become-a-seller" : "/sellers"} className='text-base'>
                        <Navbar.Link active={location.pathname === "/become-a-seller"} as="div">
                            {(isLogin === null || isLogin.userRole === 'CUSTOMER') ?
                                <><FontAwesomeIcon icon={faBoxOpen} /> Become a Seller</> :
                                <><FontAwesomeIcon icon={faWarehouse} /> Storage</>}
                        </Navbar.Link>
                    </NavLink>

                    <div className='navbtn mt-auto mb-auto dark:text-slate-400 hover:dark:text-slate-100'>
                        <Navbar.Link className='ml-[-12px]' as="div">
                            <DarkModeOption />
                        </Navbar.Link>
                    </div>

                    <MoreOptionNav />
                </Navbar.Collapse>
            </Navbar>

        </>
    );
}

export default HeaderComp;
