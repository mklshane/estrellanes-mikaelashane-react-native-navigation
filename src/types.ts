export interface Product {
	id: string;
	name: string;
	price: number;
	description: string;
	images: string[];
	badges?: string[];
	averageRating?: number;
	reviewCount?: number;
}

export type CartItem = {
	product: Product;
	quantity: number;
};

export type CartState = {
	items: Record<string, CartItem>;
};
