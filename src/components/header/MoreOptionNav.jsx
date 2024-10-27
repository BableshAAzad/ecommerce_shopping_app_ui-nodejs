import { Dropdown } from "flowbite-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp, faBell, faDownload, faEllipsisVertical, faHeadset } from '@fortawesome/free-solid-svg-icons';
import "./UserData.css"
import AppNavLink from "./AppNavLink";

function MoreOptionNav() {
    return (
        <>
            <div className="navbtn mt-auto mb-auto dark:text-slate-400 hover:dark:text-slate-100">
                <Dropdown
                    arrowIcon={false}
                    inline
                    label={<FontAwesomeIcon icon={faEllipsisVertical} />}>

                    <AppNavLink path="/notification-preferences" icon={<FontAwesomeIcon icon={faBell} />} text="Notification Preferences" />

                    <AppNavLink path="/customer-care" icon={<FontAwesomeIcon icon={faHeadset} />} text="24x7 Customer Care" />

                    <AppNavLink path="/advertise" icon={<FontAwesomeIcon icon={faArrowTrendUp} />} text="Advertise" />

                    <AppNavLink path="/download-app" icon={<FontAwesomeIcon icon={faDownload} />} text="Download App" />

                </Dropdown>
            </div>
        </>
    )
}

export default MoreOptionNav
