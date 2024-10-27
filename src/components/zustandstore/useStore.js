import { create } from 'zustand';

const useStore = create((set) => ({
    filteredProducts: [],

    //& Product Operations
    addProduct: (newProducts) => set((state) => {
        const existingProductIds = new Set(state.filteredProducts.map(product => product.inventoryId));

        const filteredNewProducts = newProducts.filter(product => !existingProductIds.has(product.inventoryId));
        return {
            filteredProducts: [...state.filteredProducts, ...filteredNewProducts]
        };
    }),
}));

export default useStore;