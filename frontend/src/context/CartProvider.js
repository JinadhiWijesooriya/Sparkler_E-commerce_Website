"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { CartAPI } from "../api/cartApi";
import { CartContext } from "./CartContext";
export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [countries, setCountries] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    // ------------------------- FETCH CART -------------------------
    const fetchCart = async () => {
        setLoading(true);
        try {
            const cart = await CartAPI.getCart();
            setItems(cart.items.map((item) => ({
                ...item,
                product_images: item.product_images ?? [],
            })));
        }
        catch (err) {
            console.error(err);
            toast.error("Failed to fetch cart");
        }
        finally {
            setLoading(false);
        }
    };
    // ------------------------- FETCH COUNTRIES -------------------------
    const fetchCountries = async () => {
        try {
            const data = await CartAPI.getCountries();
            setCountries(data);
        }
        catch (err) {
            console.error(err);
            toast.error("Failed to load countries");
        }
    };
    // ------------------------- FETCH ALL ORDERS -------------------------
    const fetchAllOrders = async () => {
        setLoading(true);
        try {
            const data = await CartAPI.getAllOrders();
            setOrders(data);
        }
        catch (err) {
            console.error(err);
            toast.error("Failed to load orders");
        }
        finally {
            setLoading(false);
        }
    };
    // ------------------------- FETCH SINGLE ORDER -------------------------
    const fetchOrderById = async (order_id) => {
        try {
            return await CartAPI.getOrder(order_id);
        }
        catch (err) {
            console.error(err);
            toast.error("Failed to fetch order");
            return undefined;
        }
    };
    // ------------------------- ADD / UPDATE / REMOVE CART ITEMS -------------------------
    const addToCart = async (product_id, product_type, quantity = 1) => {
        try {
            const cart = await CartAPI.addToCart(product_id, product_type, quantity);
            setItems(cart.items.map((item) => ({ ...item, product_images: item.product_images ?? [] })));
            toast.success("Item added to cart");
        }
        catch (err) {
            console.error(err);
            toast.error("Failed to add item");
        }
    };
    const updateCartItem = async (id, quantity) => {
        try {
            const cart = await CartAPI.updateCartItem(id, quantity);
            setItems(cart.items.map((item) => ({ ...item, product_images: item.product_images ?? [] })));
            toast.success("Cart updated");
        }
        catch (err) {
            console.error(err);
            toast.error("Failed to update item");
        }
    };
    const removeCartItem = async (id) => {
        try {
            const cart = await CartAPI.removeCartItem(id);
            setItems(cart.items.map((item) => ({ ...item, product_images: item.product_images ?? [] })));
            toast.success("Item removed");
        }
        catch (err) {
            console.error(err);
            toast.error("Failed to remove item");
        }
    };
    // ------------------------- CART SUBTOTAL & TOTAL -------------------------
    const getCartSubtotal = () => items.reduce((sum, item) => sum + item.total_price, 0);
    const getCountrySettings = (countryName) => {
        const country = countries.find((c) => c.name === countryName);
        return {
            shipping_cost: country?.order_settings?.shipping_cost ?? 0,
            tax_rate: country?.order_settings?.tax_rate ?? 0.07,
            vat_rate: country?.order_settings?.vat_rate ?? 0,
        };
    };
    const getCartTotal = (countryName) => {
        const subtotal = getCartSubtotal();
        const { shipping_cost, tax_rate, vat_rate } = getCountrySettings(countryName);
        const tax = subtotal * tax_rate;
        const vat = subtotal * vat_rate;
        return subtotal + shipping_cost + tax + vat;
    };
    // ------------------------- CHECKOUT -------------------------
    const checkout = async (orderData) => {
        try {
            const res = await CartAPI.checkout(orderData);
            toast.success(`Redirecting to payment gateway...`);
            fetchAllOrders(); // refresh orders
            return res;
        }
        catch (err) {
            console.error(err);
            toast.error("Failed to generate payment link");
            return undefined;
        }
    };
    // ------------------------- INIT -------------------------
    useEffect(() => {
        fetchCart();
        fetchCountries();
        fetchAllOrders();
    }, []);
    // ------------------------- PROVIDER -------------------------
    return (_jsx(CartContext.Provider, { value: {
            items,
            countries,
            orders,
            loading,
            fetchCart,
            fetchAllOrders,
            fetchOrderById,
            addToCart,
            updateCartItem,
            removeCartItem,
            getCartSubtotal,
            getCountrySettings,
            getCartTotal,
            checkout,
        }, children: children }));
};
