import { Button, Checkbox, FileInput, HR, Label, Select, Textarea, TextInput } from "flowbite-react";
import React, { useContext, useId, useState } from "react";
import { materialTypesList } from "../MaterialTypes";
import { AuthContext } from "../../authprovider/AuthProvider";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { discounts } from "../DiscountTypes"
import { BASE_URL } from "../../appconstants/EcommerceUrl"

function AddProduct() {
    let id = useId();
    let { isLogin,
        setProgress,
        setIsLoading,
        setPreviousLocation,
        setModelMessage,
        setOpenModal } = useContext(AuthContext);
    let [formData, setFormData] = useState({
        sellerId: isLogin.userId,
        productTitle: "",
        lengthInMeters: "",
        breadthInMeters: "",
        heightInMeters: "",
        weightInKg: "",
        price: "",
        description: "",
        productImage: null,
        materialTypes: [],
        discountType: "",
        discount: "",
        stocks: ""
    })
    let [productImage, setProductImage] = useState(null);
    const location = useLocation();
    const previousLocation = location.state?.from || "/";

    document.title = "Add Product - Ecommerce Shopping App"

    let handleFormData = ({ target: { name, value, checked, files } }) => {
        if (name === "materialTypes") {
            if (checked) {
                setFormData(prevState => ({
                    ...prevState,
                    materialTypes: [...prevState.materialTypes, value]
                }));
            } else {
                setFormData(prevState => ({
                    ...prevState,
                    materialTypes: prevState.materialTypes.filter(type => type !== value)
                }));
            }
        } else if (name === "productImage") {
            setProductImage(files[0]);
            setFormData({ ...formData, [name]: URL.createObjectURL(files[0]) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        // console.log(formData)
    }

    let sendProductData = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        setProgress(50)
        try {
            if (productImage) {
                // console.log(productImage);
                formData = { ...formData, productImage: productImage }
            }
            setProgress(70)
            const response = await axios.post(`${BASE_URL}products`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true // Includes cookies with the request
                }
            );
            setProgress(90)
            // console.log(response);
            if (response.status === 201) {
                setPreviousLocation(previousLocation)
                setModelMessage(response.data.message)
                setOpenModal(true)
            } else if (response.status === 200) {
                setPreviousLocation(previousLocation)
                setModelMessage(response.data.message)
                setOpenModal(true)
            }
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data.message) {
                let errMessages = error.response.data.message;

                // let errorMessage = Object.keys(errMessages)
                //     .map(key => `${key} => ${errMessages[key]}`)
                //     .join("\n");

                alert(errMessages);
            } else {
                alert("An unknown error occurred.");
            }
        } finally {
            setIsLoading(false);
            setProgress(100)
        }
    }


    return (
        <>
            <h1 className="font-bold text-2xl text-center dark:text-white">Add Product Form</h1>
            <section className="flex items-center justify-center">
                <form className="flex max-w-md flex-col gap-4 p-4 border border-green-500 rounded-md m-2" onSubmit={sendProductData}>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor={`${id}sid`} color="success" value="Your Seller Id" />
                        </div>
                        <TextInput id={`${id}sid`} type="text" value={isLogin.userId} shadow disabled />
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor={`${id}pTitle`} value="Product Title" />
                        </div>
                        <TextInput id={`${id}pTitle`} name="productTitle" value={formData.productTitle} type="text" placeholder="eg. Realme 2 Pro" onChange={handleFormData} required shadow />
                    </div>

                    <section className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor={`${id}plength`} value="Length In Meters" />
                            </div>
                            <TextInput id={`${id}plength`} name="lengthInMeters" value={formData.lengthInMeters} type="number" placeholder="eg. 3.5" onChange={handleFormData} required shadow />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor={`${id}pbreadth`} value="Breadth In Meters" />
                            </div>
                            <TextInput id={`${id}pbreadth`} name="breadthInMeters" value={formData.breadthInMeters} type="number" placeholder="eg. 2.2" onChange={handleFormData} required shadow />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor={`${id}pheight`} value="Height In Meters" />
                            </div>
                            <TextInput id={`${id}pheight`} name="heightInMeters" value={formData.heightInMeters} type="number" placeholder="eg. 2.7" onChange={handleFormData} required shadow />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor={`${id}pweight`} value="Weight In KG" />
                            </div>
                            <TextInput id={`${id}pweight`} name="weightInKg" value={formData.weightInKg} type="number" placeholder="eg. 2.7" onChange={handleFormData} required shadow />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor={`${id}pprice`} value="Price in Rs/-" />
                            </div>
                            <TextInput id={`${id}pprice`} name="price" value={formData.price} type="number" placeholder="eg. 2.7" onChange={handleFormData} required shadow />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor={`${id}pquantity`} value="Stocks" />
                            </div>
                            <TextInput id={`${id}pquantity`} name="stocks" value={formData.stocks} type="number" placeholder="eg. 2" onChange={handleFormData} required shadow />
                        </div>
                    </section>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor={`${id}description`} value="Description about product" />
                        </div>
                        <Textarea id={`${id}description`} name="description" value={formData.description} type="text" placeholder="eg. It is a Realme pro model of 2nd edition Mobile phone " onChange={handleFormData} required shadow rows={4} />
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor={`${id}pimg`} value="Product Image" />
                        </div>
                        <FileInput id={`${id}pimg`} name="productImage" onChange={handleFormData} helperText="A product image is only jpeg, jpg, png format are allowed and size less than 2mb" required />

                        {productImage && <img src={formData.productImage} alt="product_Image" className="max-w-40 max-h-48 ml-auto mr-auto mt-2 rounded-lg" />}
                    </div>

                    <div className="mb-2 block">
                        <h3 className="text-purple-700 dark:text-purple-500">Material Types</h3>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {materialTypesList.map((type, index) => (
                                <React.Fragment key={index}>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`${id}${type}`}
                                            name="materialTypes"
                                            value={type}
                                            onChange={handleFormData}
                                            label={type}
                                            className="mr-2"
                                        />
                                        <Label htmlFor={`${id}${type}`}>{type}</Label>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <HR.Text text="Discount" className="mt-0 mb-0 bg-pink-600 dark:bg-pink-600" />
                    <section className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor={`${id}pdist`} value="Discount Type" />
                            </div>
                            <Select id={`${id}pdist`} name="discountType" onChange={handleFormData}>
                                {discounts.map((val, index) => {
                                    return <option key={index} value={val}>{val}</option>
                                })}
                            </Select>
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor={`${id}pdisv`} value="Discount in %" />
                            </div>
                            <TextInput id={`${id}pdisv`}
                                name="discount"
                                value={formData.discount}
                                type="number"
                                placeholder="eg. 25"
                                onChange={handleFormData}
                                required shadow />
                        </div>
                    </section>

                    <div className="flex flex-wrap gap-2 items-center justify-center mb-2">
                        <Button type="submit" gradientDuoTone="purpleToBlue">
                            Add Product
                        </Button>
                        <Button type="reset" gradientMonochrome="failure">
                            Clear
                        </Button>
                    </div>
                </form>
            </section >
        </>
    )
}

export default AddProduct;
