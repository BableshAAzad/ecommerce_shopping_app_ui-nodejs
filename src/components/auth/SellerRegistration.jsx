import Registration from "./Registration"

function SellerRegistration() {

    document.title = "Seller Registration - Ecommerce Shopping App"

    return (
        <>
            <Registration registrationType="sellers" pageTitle="Seller" />
        </>
    )
}

export default SellerRegistration
