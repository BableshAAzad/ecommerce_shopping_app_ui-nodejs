import { Button } from 'flowbite-react';
import useStore from './useStore';

const ProductManager = () => {
    const { products, addProduct, removeProduct, removeAllProducts } = useStore();

    const newProduct = {
        breadthInMeters: 2,
        description: null,
        heightInMeters: 1,
        inventoryId: 2,
        lengthInMeters: 1,
        materialTypes: ['ELECTRONIC'],
        price: 0,
        productImage: null,
        productTitle: "Laptop",
        restockedAt: "2024-07-15",
        sellerId: 2
    };

    return (
        <div>
            <h1 className='text-2xl dark:text-slate-300'>Product Manager</h1>
            <Button onClick={() => addProduct(newProduct)}>Add Product</Button>
            <br />
            <Button onClick={() => removeProduct(newProduct.inventoryId)}>Remove Product</Button>
            <br />
            <Button onClick={() => removeAllProducts()}>Remove All Products</Button>
            <br />

            <h2 className='text-2xl dark:text-slate-300'>Products:</h2>
            <ul>
                {products.map((product, index) => (
                    <li className='text-lg dark:text-slate-400' key={index}>
                        {product.productTitle} - ID: {product.inventoryId}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductManager;
