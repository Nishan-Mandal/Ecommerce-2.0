import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem('cart')) ?? [];

// Helper to determine if two selectedVariant attribute sets match
const areVariantsEqual = (v1, v2) => {
    if (!v1 && !v2) return true;
    if (!v1 || !v2) return false;
    const keys1 = Object.keys(v1);
    const keys2 = Object.keys(v2);
    if (keys1.length !== keys2.length) return false;
    return keys1.every(key => v1[key] === v2[key]);
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers : {
        addToCart(state, action){
            const newItem = action.payload;
            const existingIndex = state.findIndex(item => 
                item.id === newItem.id && 
                areVariantsEqual(item.selectedVariant, newItem.selectedVariant)
            );
            if (existingIndex >= 0) {
                state[existingIndex].quantity += Number(newItem.quantity || 1);
            } else {
                state.push({
                    ...newItem,
                    quantity: Number(newItem.quantity || 1)
                });
            }
        },
        updateCartQuantity(state, action) {
            const { id, selectedVariant, quantity } = action.payload;
            const index = state.findIndex(item => 
                item.id === id && 
                areVariantsEqual(item.selectedVariant, selectedVariant)
            );
            if (index >= 0) {
                state[index].quantity = Math.max(1, quantity);
            }
        },
        deleteFromCart(state, action){
            const target = action.payload;
            return state.filter(item => 
                !(item.id === target.id && areVariantsEqual(item.selectedVariant, target.selectedVariant))
            );
        },
        clearCart(state){
            state.length = 0;
            localStorage.removeItem('cart');
        }
    }
});

export const { addToCart, updateCartQuantity, deleteFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;