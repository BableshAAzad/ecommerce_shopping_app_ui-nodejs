import React, { Suspense } from "react";
import Spinner from "../loader/Spinner";
import HomePage from "../navbarpage/HomePage";
import Dashboard from "../seller/Dashboard";

const CustomerRegistration = React.lazy(() => import("../auth/CustomerRegistration"));
const LoginForm = React.lazy(() => import("../auth/LoginForm"));
const SellerRegistration = React.lazy(() => import("../auth/SellerRegistration"));
const CustomerComp = React.lazy(() => import("../customer/CustomerComp"));
const ErrorPage = React.lazy(() => import("../errorpage/ErrorPage"));
const BecomeASeller = React.lazy(() => import("../navbarpage/BecomeASeller"));
const GiftCardComp = React.lazy(() => import("../navbarpage/GiftCardComp"));
const OrderComp = React.lazy(() => import("../navbarpage/OrderComp"));
const ProductInfo = React.lazy(() => import("../navbarpage/ProductInfo"));
const RewardComp = React.lazy(() => import("../navbarpage/RewardComp"));
const SuperCoinZone = React.lazy(() => import("../navbarpage/SuperCoinZone"));
const WishListComp = React.lazy(() => import("../navbarpage/WishListComp"));
const AddProduct = React.lazy(() => import("../seller/product/AddProduct"));
const ProductBySeller = React.lazy(() => import("../seller/product/ProductBySeller"));
const SellerComp = React.lazy(() => import("../seller/SellerComp"));
const Storage = React.lazy(() => import("../seller/storage/Storage"));
const ProfilePage = React.lazy(() => import("../userinfo/ProfilePage"));
const StoragesByWareHouses = React.lazy(() => import("../seller/storage/StoragesByWareHouses"));
const ProductInfoSeller = React.lazy(() => import("../seller/product/ProductInfoSeller"));
const UpdateProduct = React.lazy(() => import("../seller/product/ProductUpdate"));
const AddAddress = React.lazy(() => import("../userinfo/AddAddress"));
const UpdateAddress = React.lazy(() => import("../userinfo/UpdateAddress"));
const UpdateUser = React.lazy(() => import("../userinfo/UpdateUser"));
const AddContact = React.lazy(() => import("../userinfo/AddContact"));
const UpdateContact = React.lazy(() => import("../userinfo/UpdateContact"));
const OrderAddress = React.lazy(() => import("../cart/OrderAddress"));
const OrderPreview = React.lazy(() => import("../cart/OrderPreview"));
const ForgotPassword = React.lazy(() => import("../auth/ForgotPassword"));
const CustomerCare = React.lazy(() => import("../header/moreoption/CustomerCare"));
const CartComp = React.lazy(() => import("../navbarpage/CartComp"));
const UpdatePasswordPage = React.lazy(() => import("../auth/UpdatePasswordPage"));



export const RouteComps = [
    {
        element: (
            <Suspense fallback={<Spinner />}>
                <CartComp />
            </Suspense>
        ),
        path: "cart",
        isPrivate: true,
        isVisibleAfterLogin: true,
        role: ["CUSTOMER"]
    },
    {
        element: (
            <Suspense fallback={<Spinner />}>
                <OrderAddress />
            </Suspense>
        ),
        path: "cart/addresses",
        isPrivate: true,
        isVisibleAfterLogin: true,
        role: ["CUSTOMER"]
    },
    {
        element: (
            <Suspense fallback={<Spinner />}>
                <OrderPreview />
            </Suspense>
        ),
        path: "cart/addresses/order-preview",
        isPrivate: true,
        isVisibleAfterLogin: true,
        role: ["CUSTOMER"]
    },
    {
        element: (
            <Suspense fallback={<Spinner />}>
                <ProfilePage />
            </Suspense>
        ),
        path: "profile-page",
        isPrivate: true,
        isVisibleAfterLogin: true,
        role: ["CUSTOMER", "SELLER"]
    },
    {
        element: (
            <Suspense fallback={<Spinner />}>
                <UpdateUser />
            </Suspense>
        ),
        path: "profile-page/update-profile",
        isPrivate: true,
        isVisibleAfterLogin: true,
        role: ["CUSTOMER", "SELLER"]
    },
    {
        element: (
            <Suspense fallback={<Spinner />}>
                <AddAddress />
            </Suspense>
        ),
        path: "profile-page/add-address",
        isPrivate: true,
        isVisibleAfterLogin: true,
        role: ["CUSTOMER", "SELLER"]
    },
    {
        element: (
            <Suspense fallback={<Spinner />}>
                <UpdateAddress />
            </Suspense>
        ),
        path: "profile-page/update-address",
        isPrivate: true,
        isVisibleAfterLogin: true,
        role: ["CUSTOMER", "SELLER"]
    },
    {
        element: (
            <Suspense fallback={<Spinner />}>
                <AddContact />
            </Suspense>
        ),
        path: "profile-page/addresses/add-contact/:addressId",
        isPrivate: true,
        isVisibleAfterLogin: true,
        role: ["CUSTOMER", "SELLER"]
    },
    {
        element: (
            <Suspense fallback={<Spinner />}>
                <UpdateContact />
            </Suspense>
        ),
        path: "profile-page/addresses/update-contact",
        isPrivate: true,
        isVisibleAfterLogin: true,
        role: ["CUSTOMER", "SELLER"]
    },
    {
        element: (
            <Suspense fallback={<Spinner />}>
                <SuperCoinZone />
            </Suspense>
        ),
        path: "super-coin-zone",
        isPrivate: true,
        isVisibleAfterLogin: true,
        role: ["CUSTOMER", "SELLER"]
    },
    {
        element: (
            <Suspense fallback={<Spinner />}>
                <OrderComp />
            </Suspense>
        ),
        path: "orders",
        isPrivate: true,
        isVisibleAfterLogin: true,
        role: ["CUSTOMER", "SELLER"]
    },
    {
        element: (
            <Suspense fallback={<Spinner />}>
                <WishListComp />
            </Suspense>
        ),
        path: "wish-list",
        isPrivate: true,
        isVisibleAfterLogin: true,
        role: ["CUSTOMER", "SELLER"]
    },
    {
        element: (
            <Suspense fallback={<Spinner />}>
                <RewardComp />
            </Suspense>
        ),
        path: "rewards",
        isPrivate: true,
        isVisibleAfterLogin: true,
        role: ["CUSTOMER", "SELLER"]
    },
    {
        element: (
            <Suspense fallback={<Spinner />}>
                <GiftCardComp />
            </Suspense>
        ),
        path: "gift-cards",
        isPrivate: true,
        isVisibleAfterLogin: true,
        role: ["CUSTOMER", "SELLER"]
    },
    {
        element: (
            <Suspense fallback={<Spinner />}>
                <CustomerComp />
            </Suspense>
        ),
        path: "customers",
        isPrivate: true,
        isVisibleAfterLogin: true,
        role: ["CUSTOMER"]
    },
    {
        element: (
            <Suspense fallback={<Spinner />}>
                <SellerComp />
            </Suspense>
        ),
        path: "sellers",
        isPrivate: true,
        isVisibleAfterLogin: true,
        role: ["SELLER"]
    },
    {
        element: (
            <Suspense fallback={<Spinner />}>
                <Storage />
            </Suspense>
        ),
        path: "sellers/storages",
        isPrivate: true,
        isVisibleAfterLogin: true,
        role: ["SELLER"]
    },
    {
        element: (
            <Suspense fallback={<Spinner />}>
                <StoragesByWareHouses />
            </Suspense>
        ),
        path: "sellers/warehouses/:wareHouseId/storages",
        isPrivate: true,
        isVisibleAfterLogin: true,
        role: ["SELLER"]
    },
    {
        element: (
            <Suspense fallback={<Spinner />}>
                <ProductBySeller />
            </Suspense>
        ),
        path: "sellers/products",
        isPrivate: true,
        isVisibleAfterLogin: true,
        role: ["SELLER"]
    },
    {
        element: (
            <Suspense fallback={<Spinner />}>
                <ProductInfoSeller />
            </Suspense>
        ),
        path: "sellers/products/product-info/:productId",
        isPrivate: true,
        isVisibleAfterLogin: true,
        role: ["SELLER"]
    },
    {
        element: (
            <Suspense fallback={<Spinner />}>
                <AddProduct />
            </Suspense>
        ),
        path: "sellers/products/add-product",
        isPrivate: true,
        isVisibleAfterLogin: true,
        role: ["SELLER"]
    },
    {
        element: (
            <Suspense fallback={<Spinner />}>
                <UpdateProduct />
            </Suspense>
        ),
        path: "sellers/products/update-product/:productId",
        isPrivate: true,
        isVisibleAfterLogin: true,
        role: ["SELLER"]
    },
    {
        element: (
            <Suspense fallback={<Spinner />}>
                <Dashboard />
            </Suspense>
        ),
        path: "sellers/dashboard",
        isPrivate: true,
        isVisibleAfterLogin: true,
        role: ["SELLER"]
    },










    {
        element: (
            <Suspense fallback={<Spinner />}>
                <BecomeASeller />
            </Suspense>
        ),
        path: "become-a-seller",
        isPrivate: false,
        isVisibleAfterLogin: true,
        role: ["CUSTOMER"]
    },
    {
        element: <HomePage />,
        path: "",
        isPrivate: false,
        isVisibleAfterLogin: true,
        role: []
    },
    {
        element: (
            <Suspense fallback={<Spinner />}>
                <CustomerRegistration />
            </Suspense>
        ),
        path: "customer-registration",
        isPrivate: false,
        isVisibleAfterLogin: false,
        role: []
    },
    {
        element: (
            <Suspense fallback={<Spinner />}>
                <SellerRegistration />
            </Suspense>
        ),
        path: "seller-registration",
        isPrivate: false,
        isVisibleAfterLogin: false,
        role: []
    },
    {
        element: (
            <Suspense fallback={<Spinner />}>
                <LoginForm />
            </Suspense>
        ),
        path: "login-form",
        isPrivate: false,
        isVisibleAfterLogin: false,
        role: []
    },
    {
        element: (
            <Suspense fallback={<Spinner />}>
                <ForgotPassword />
            </Suspense>
        ),
        path: "forgot-password",
        isPrivate: false,
        isVisibleAfterLogin: false,
        role: []
    },
    {
        element: (
            <Suspense fallback={<Spinner />}>
                <UpdatePasswordPage />
            </Suspense>
        ),
        path: "reset-password/:userId/:token",
        isPrivate: false,
        isVisibleAfterLogin: false,
        role: []
    },
    {
        element: (
            <Suspense fallback={<Spinner />}>
                <ProductInfo />
            </Suspense>
        ),
        path: "products/:pid",
        isPrivate: false,
        isVisibleAfterLogin: true,
        role: []
    },
    {
        element: (
            <Suspense fallback={<Spinner />}>
                <CustomerCare />
            </Suspense>
        ),
        path: "customer-care",
        isPrivate: false,
        isVisibleAfterLogin: true,
        role: []
    },







    {
        element: (
            <Suspense fallback={<Spinner />}>
                <ErrorPage />
            </Suspense>
        ),
        path: "*",
        isPrivate: false,
        isVisibleAfterLogin: true,
        role: []
    },

]