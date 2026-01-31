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
