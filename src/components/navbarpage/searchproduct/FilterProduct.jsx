import { Button, Checkbox, Drawer, FloatingLabel, Label, Radio } from "flowbite-react";
import { HiOutlineFilter } from "react-icons/hi";
import { materialTypesList } from "../../seller/MaterialTypes";
import { useId, useState } from "react";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// eslint-disable-next-line react/prop-types
export default function FilterProduct({ isOpen, setIsOpen, handleFilterProducts }) {
    const handleClose = () => setIsOpen(false);
    const id = useId();
    const [filterData, setFilterData] = useState({
        productTitle: "",
        minPrice: "",
        maxPrice: "",
        description: "",
        sortOrder: "newToOld",
        materialTypes: []
    });

    const handleFilterData = ({ target: { name, value, checked, type } }) => {
        setFilterData((prev) => {
            if (type === 'checkbox') {
                if (checked) {
                    return { ...prev, materialTypes: [...prev.materialTypes, value] };
                } else {
                    return { ...prev, materialTypes: prev.materialTypes.filter((type) => type !== value) };
                }
            }
            return { ...prev, [name]: value };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Filter Data: ", filterData);
        handleFilterProducts(filterData, false);
        handleClose();
    };

    const handleReset = () => {filterData
        setFilterData({
            productTitle: "",
            minPrice: "",
            maxPrice: "",
            description: "",
            sortOrder: "newToOld",
            materialTypes: []
        });
        handleFilterProducts({}, true);
        handleClose();
    };

    return (
        <>
            <Drawer open={isOpen} onClose={handleClose}>
                <Drawer.Header titleIcon={HiOutlineFilter} title="Filter" />
                <Drawer.Items>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                        Filter Products and find exactly what you want according to your requirements
                    </p>
                    <form onSubmit={handleSubmit}>
                        <FloatingLabel
                            type="text"
                            name="productTitle"
                            variant="outlined"
                            label="Product Name"
                            value={filterData.productTitle}
                            onChange={handleFilterData}
                        />
                        <div className="flex justify-around gap-2">
                            <FloatingLabel
                                name="minPrice"
                                type="number"
                                variant="outlined"
                                label="Min Price"
                                value={filterData.minPrice}
                                onChange={handleFilterData}
                            />
                            <FloatingLabel
                                name="maxPrice"
                                type="number"
                                variant="outlined"
                                label="Max Price"
                                value={filterData.maxPrice}
                                onChange={handleFilterData}
                            />
                        </div>
                        <div className="flex flex-wrap items-center justify-around gap-1 m-1">
                            <div className="flex items-center gap-2">
                                <Radio
                                    id={`${id}new`}
                                    name="sortOrder"
                                    value="newToOld"
                                    checked={filterData.sortOrder === "newToOld"}
                                    onChange={handleFilterData}
                                />
                                <Label className="dark:text-slate-400 text-slate-600" htmlFor={`${id}new`}>New To Old</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Radio
                                    id={`${id}old`}
                                    name="sortOrder"
                                    value="oldToNew"
                                    checked={filterData.sortOrder === "oldToNew"}
                                    onChange={handleFilterData}
                                />
                                <Label className="dark:text-slate-400 text-slate-600" htmlFor={`${id}old`}>Old To New</Label>
                            </div>
                        </div>
                        <FloatingLabel
                            type="text"
                            name="description"
                            variant="outlined"
                            label="Product Details"
                            value={filterData.description}
                            onChange={handleFilterData}
                        />
                        <div className="flex flex-wrap items-center justify-around gap-1">
                            {materialTypesList.map((type, index) => {
                                return (
                                    <div key={index} className="flex gap-2">
                                        <Checkbox
                                            id={`${id}${type}`}
                                            name="materialTypes"
                                            value={type}
                                            checked={filterData.materialTypes.includes(type)}
                                            onChange={handleFilterData}
                                        />
                                        <Label className="dark:text-slate-400 text-slate-600" htmlFor={`${id}${type}`}>
                                            {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                                        </Label>
                                    </div>
                                );
                            })}
                        </div>
                        <br />
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Button type="reset" outline gradientDuoTone="pinkToOrange" onClick={handleReset}>
                                Clear Filter
                            </Button>
                            <Button gradientDuoTone="purpleToPink" type="submit">
                                Apply
                                <FontAwesomeIcon className="ml-3 m-auto" icon={faArrowRight} />
                            </Button>
                        </div>
                    </form>
                </Drawer.Items>
            </Drawer>
        </>
    );
}
