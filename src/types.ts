export type ProductVariation = {
	name: string;
	options: string[];
};

export interface Product {
	id: string;
	name: string;
	price: number;
	description: string;
	images: string[];
	type?: string;
	variations?: ProductVariation[];
	badges?: string[];
	averageRating?: number;
	reviewCount?: number;
}

export type CartItem = {
	product: Product;
	quantity: number;
	addedAt?: number;
	isSelected?: boolean;
};

export type CartState = {
	items: Record<string, CartItem>;
	selectedItems: Set<string>;
};
