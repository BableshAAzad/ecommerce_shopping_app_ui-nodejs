import { Dropdown, Navbar } from "flowbite-react"
import { NavLink } from "react-router-dom"

// eslint-disable-next-line react/prop-types
function AppNavLink({ path, icon, text }) {
    return (
        <>
            <Dropdown.Item>
                <NavLink to={path} className="text-base block w-full text-left">
                    <Navbar.Link active={location.pathname == {path}} as="div">
                        {icon} {text}
                    </Navbar.Link>
                </NavLink >
            </Dropdown.Item>
        </>
    )
}

export default AppNavLink
