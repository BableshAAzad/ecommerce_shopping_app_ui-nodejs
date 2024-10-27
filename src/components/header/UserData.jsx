import { useContext } from 'react'
import { Dropdown, Navbar } from "flowbite-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faChevronDown, faCoins, faCreditCard, faGift, faHeart, faMoneyBills, faUser, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import "./UserData.css"
import AppNavLink from './AppNavLink';
import { NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../authprovider/AuthProvider';

function UserData() {
    const location = useLocation();
    const { isLogin, setOpenLogoutAlertModal } = useContext(AuthContext);

    let loginText = (<><FontAwesomeIcon icon={faUser} />&nbsp;Login&nbsp;<FontAwesomeIcon icon={faChevronDown} /></>);
    let username = ""
    if (isLogin) {
        username = <><FontAwesomeIcon icon={faUser} />&nbsp; {isLogin.username}&nbsp;<FontAwesomeIcon icon={faChevronDown} /> </>
    }
    const handleLogoutClick = () => {
        setOpenLogoutAlertModal(true)
    };

    return (
        <>
            <div className="navbtn text-base dark:text-slate-400 hover:dark:text-slate-100">
                <Dropdown
                    arrowIcon={false}
                    inline id='optbutton'
                    label={!isLogin ? loginText : username} >

                    {!isLogin ? <Dropdown.Item>
                        <div className="flex items-center justify-between">
                            <span className="text-sm mr-2">New Customer?</span>
                            <NavLink to="/customer-registration">
                                <Navbar.Link className="text-base font-medium text-blue-600 dark:text-blue-500" active={location.pathname === "/customer-registration"} as="div">
                                    Sing Up
                                </Navbar.Link>
                            </NavLink>
                        </div>
                    </Dropdown.Item> : <></>}

                    {!isLogin && <Dropdown.Divider />}

                    <AppNavLink path={!isLogin ? "/login-form" : "/profile-page"} icon={<FontAwesomeIcon icon={faUser} />} text="My Profile" />

                    {isLogin && <Dropdown.Divider />}

                    {!isLogin ? <></> : <AppNavLink path="/super-coin-zone" icon={<FontAwesomeIcon icon={faCoins} />} text="Super Coin Zone" />}

                    <AppNavLink path="/orders" icon={<FontAwesomeIcon icon={faCartShopping} />} text="Orders" />

                    <AppNavLink path="/wish-list" icon={<FontAwesomeIcon icon={faHeart} />} text="Wishlist" />

                    <AppNavLink path="/rewards" icon={<FontAwesomeIcon icon={faGift} />} text="Rewards" />

                    <AppNavLink path="/gift-cards" icon={<FontAwesomeIcon icon={faCreditCard} />} text="Gift Cards" />

                    {isLogin && <Dropdown.Divider />}

                    {!isLogin ?
                        <AppNavLink path="/gift-cards" icon={<FontAwesomeIcon icon={faMoneyBills} />} text="Gift Cards" />
                        : <button type="button"
                            className="logoutbtn text-slate-600 dark:text-slate-400 font-bold"
                            onClick={handleLogoutClick} >
                            <FontAwesomeIcon icon={faRightToBracket} />
                            &nbsp; Logout
                        </button>}

                </Dropdown>
            </div>
        </>
    )
}

export default UserData