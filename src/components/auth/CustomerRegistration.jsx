import Registration from "./Registration"

function CustomerRegistration() {
    document.title = "Customer Registration - Ecommerce Shopping App"
    return (
        <>
            <Registration registrationType="customers" pageTitle="User" />
        </>
    )
}

export default CustomerRegistration
