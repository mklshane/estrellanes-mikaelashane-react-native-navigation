import React, { createContext, useContext, useMemo, useReducer, ReactNode, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Product, CartItem, CartState } from "../types";

type CartAction =
	| { type: "ADD"; product: Product; quantity: number }
	| { type: "REMOVE"; productId: string }
	| { type: "SET_QUANTITY"; productId: string; quantity: number }
	| { type: "CLEAR" }
	| { type: "HYDRATE"; state: CartState }
	| { type: "TOGGLE_SELECT"; productId: string }
	| { type: "SELECT_ALL" }
	| { type: "DESELECT_ALL" };

const initialState: CartState = { items: {}, selectedItems: new Set() };

const cartReducer = (state: CartState, action: CartAction): CartState => {
	switch (action.type) {
		case "ADD": {
			// Merge quantities and mark the item as selected on add.
			const existing = state.items[action.product.id];
			const nextQty = Math.max(1, (existing?.quantity ?? 0) + action.quantity);
			const newSelected = new Set(state.selectedItems);
			newSelected.add(action.product.id);
			return {
				...state,
				items: {
					...state.items,
					[action.product.id]: {
						product: action.product,
						quantity: nextQty,
						addedAt: Date.now(),
						isSelected: true,
					},
				},
				selectedItems: newSelected,
			};
		}
		case "REMOVE": {
			const next = { ...state.items };
			delete next[action.productId];
			const newSelected = new Set(state.selectedItems);
			newSelected.delete(action.productId);
			return { items: next, selectedItems: newSelected };
		}
		case "SET_QUANTITY": {
			// Remove item if quantity is zero or less.
			if (action.quantity <= 0) {
				const next = { ...state.items };
				delete next[action.productId];
				const newSelected = new Set(state.selectedItems);
				newSelected.delete(action.productId);
				return { items: next, selectedItems: newSelected };
			}
			const existing = state.items[action.productId];
			if (!existing) return state;
			return {
				...state,
				items: {
					...state.items,
					[action.productId]: { ...existing, quantity: action.quantity },
				},
			};
		}
		case "CLEAR":
			return initialState;
		case "HYDRATE":
			// Restore from storage and ensure selectedItems is a Set.
			return {
				items: action.state.items,
				selectedItems: action.state.selectedItems instanceof Set 
					? action.state.selectedItems 
					: new Set(Array.isArray(action.state.selectedItems) ? action.state.selectedItems : []),
			};
		case "TOGGLE_SELECT": {
			const newSelected = new Set(state.selectedItems);
			if (newSelected.has(action.productId)) {
				newSelected.delete(action.productId);
			} else {
				newSelected.add(action.productId);
			}
			return { ...state, selectedItems: newSelected };
		}
		case "SELECT_ALL": {
			// Select every item currently in the cart.
			const newSelected = new Set(Object.keys(state.items));
			return { ...state, selectedItems: newSelected };
		}
		case "DESELECT_ALL": {
			// Clear all selections.
			return { ...state, selectedItems: new Set() };
		}
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
	toggleSelectItem: (productId: string) => void;
	selectAllItems: () => void;
	deselectAllItems: () => void;
	isItemSelected: (productId: string) => boolean;
	selectedItems: CartItem[];
	selectedCount: number;
	selectedTotalPrice: number;
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
	toggleSelectItem: () => {},
	selectAllItems: () => {},
	deselectAllItems: () => {},
	isItemSelected: () => false,
	selectedItems: [],
	selectedCount: 0,
	selectedTotalPrice: 0,
	totalItems: 0,
	totalPrice: 0,
	getItemQuantity: () => 0,
	isInCart: () => false,
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(cartReducer, initialState);
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		// Hydrate cart state from storage on first load.
		const load = async () => {
			try {
				const raw = await AsyncStorage.getItem("cart-items");
				if (raw) {
					const parsed = JSON.parse(raw);
					if (parsed && parsed.items) {
						// Reconstruct selectedItems Set from array if it was serialized
						const selectedItems = new Set<string>(Array.isArray(parsed.selectedItems) ? parsed.selectedItems : []);
						dispatch({
							type: "HYDRATE",
							state: { items: parsed.items, selectedItems },
						});
					}
				}
			} finally {
				setHydrated(true);
			}
		};
		load();
	}, []);

	// Sort items by recency for consistent UI ordering.
	const items = useMemo(
		() =>
			Object.values(state.items).sort(
				(a, b) => (b.addedAt ?? 0) - (a.addedAt ?? 0)
			),
		[state.items]
	);

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
		// Convert Set to array for JSON serialization.
		const stateToSave = {
			items: state.items,
			selectedItems: Array.from(state.selectedItems),
		};
		AsyncStorage.setItem("cart-items", JSON.stringify(stateToSave)).catch(() => {});
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

	const toggleSelectItem = (productId: string) => {
		dispatch({ type: "TOGGLE_SELECT", productId });
	};

	const selectAllItems = () => {
		dispatch({ type: "SELECT_ALL" });
	};

	const deselectAllItems = () => {
		dispatch({ type: "DESELECT_ALL" });
	};

	const getItemQuantity = (productId: string) => state.items[productId]?.quantity ?? 0;

	const isInCart = (productId: string) => Boolean(state.items[productId]);

	const isItemSelected = (productId: string) => state.selectedItems.has(productId);

	// Derived collections for selection-based totals.
	const selectedItems = useMemo(
		() => items.filter((item) => state.selectedItems.has(item.product.id)),
		[items, state.selectedItems]
	);

	const selectedCount = useMemo(
		() => selectedItems.reduce((sum, item) => sum + item.quantity, 0),
		[selectedItems]
	);

	const selectedTotalPrice = useMemo(
		() => selectedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
		[selectedItems]
	);

	const value = useMemo(
		() => ({
			items,
			addToCart,
			removeFromCart,
			increment,
			decrement,
			setQuantity,
			clearCart,
			toggleSelectItem,
			selectAllItems,
			deselectAllItems,
			isItemSelected,
			selectedItems,
			selectedCount,
			selectedTotalPrice,
			totalItems,
			totalPrice,
			getItemQuantity,
			isInCart,
		}),
		[items, totalItems, totalPrice, selectedItems, selectedCount, selectedTotalPrice, state.selectedItems]
	);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);

export type { CartItem };
