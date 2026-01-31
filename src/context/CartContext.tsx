import React, { createContext, useContext, useMemo, useReducer, ReactNode, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Product, CartItem, CartState } from "../types";

type CartAction =
	| { type: "ADD"; product: Product; quantity: number }
	| { type: "REMOVE"; productId: string }
	| { type: "SET_QUANTITY"; productId: string; quantity: number }
	| { type: "CLEAR" }
	| { type: "HYDRATE"; state: CartState };

const initialState: CartState = { items: {} };

const cartReducer = (state: CartState, action: CartAction): CartState => {
	switch (action.type) {
		case "ADD": {
			const existing = state.items[action.product.id];
			const nextQty = Math.max(1, (existing?.quantity ?? 0) + action.quantity);
			return {
				items: {
					...state.items,
					[action.product.id]: { product: action.product, quantity: nextQty },
				},
			};
		}
		case "REMOVE": {
			const next = { ...state.items };
			delete next[action.productId];
			return { items: next };
		}
		case "SET_QUANTITY": {
			if (action.quantity <= 0) {
				const next = { ...state.items };
				delete next[action.productId];
				return { items: next };
			}
			const existing = state.items[action.productId];
			if (!existing) return state;
			return {
				items: {
					...state.items,
					[action.productId]: { ...existing, quantity: action.quantity },
				},
			};
		}
		case "CLEAR":
			return initialState;
		case "HYDRATE":
			return action.state;
		default:
			return state;
	}
};

type CartContextValue = {
	items: CartItem[];
	addToCart: (product: Product, quantity?: number) => void;
	removeFromCart: (productId: string) => void;
	increment: (productId: string) => void;
	decrement: (productId: string) => void;
	setQuantity: (productId: string, quantity: number) => void;
	clearCart: () => void;
	totalItems: number;
	totalPrice: number;
	getItemQuantity: (productId: string) => number;
	isInCart: (productId: string) => boolean;
};

const CartContext = createContext<CartContextValue>({
	items: [],
	addToCart: () => {},
	removeFromCart: () => {},
	increment: () => {},
	decrement: () => {},
	setQuantity: () => {},
	clearCart: () => {},
	totalItems: 0,
	totalPrice: 0,
	getItemQuantity: () => 0,
	isInCart: () => false,
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(cartReducer, initialState);
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		const load = async () => {
			try {
				const raw = await AsyncStorage.getItem("cart-items");
				if (raw) {
					const parsed = JSON.parse(raw) as CartState;
					if (parsed && parsed.items) {
						dispatch({ type: "HYDRATE", state: parsed });
					}
				}
			} finally {
				setHydrated(true);
			}
		};
		load();
	}, []);

	const items = useMemo(() => Object.values(state.items), [state.items]);

	const totalItems = useMemo(
		() => items.reduce((sum, item) => sum + item.quantity, 0),
		[items]
	);

	const totalPrice = useMemo(
		() => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
		[items]
	);

	useEffect(() => {
		if (!hydrated) return;
		AsyncStorage.setItem("cart-items", JSON.stringify(state)).catch(() => {});
	}, [state, hydrated]);

	const addToCart = (product: Product, quantity = 1) => {
		dispatch({ type: "ADD", product, quantity });
	};

	const removeFromCart = (productId: string) => {
		dispatch({ type: "REMOVE", productId });
	};

	const increment = (productId: string) => {
		const current = state.items[productId];
		if (!current) return;
		addToCart(current.product, 1);
	};

	const decrement = (productId: string) => {
		const current = state.items[productId];
		if (!current) return;
		const nextQty = current.quantity - 1;
		if (nextQty <= 0) {
			removeFromCart(productId);
		} else {
			dispatch({ type: "SET_QUANTITY", productId, quantity: nextQty });
		}
	};

	const setQuantity = (productId: string, quantity: number) => {
		dispatch({ type: "SET_QUANTITY", productId, quantity });
	};

	const clearCart = () => dispatch({ type: "CLEAR" });

	const getItemQuantity = (productId: string) => state.items[productId]?.quantity ?? 0;

	const isInCart = (productId: string) => Boolean(state.items[productId]);

	const value = useMemo(
		() => ({
			items,
			addToCart,
			removeFromCart,
			increment,
			decrement,
			setQuantity,
			clearCart,
			totalItems,
			totalPrice,
			getItemQuantity,
			isInCart,
		}),
		[items, totalItems, totalPrice]
	);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);

export type { CartItem };
