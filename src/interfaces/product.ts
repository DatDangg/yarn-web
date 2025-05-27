export interface ProductProps {
    id: number;
    name: string;
    image: string[];
    price: number;
    discount: number;
    description: string,
    stock: number,
}

export interface ProductModalProps {
    show: boolean;
    product: ProductProps | null;
    quantity: number;
    setQuantity: (val: number) => void;
    onClose: () => void;
    onAddToCart: () => void;
}

export interface ProductCardProps {
    img: string,
    name: string,
    price: number,
    discount?: number,
    id: number,
    wishlist: boolean,
    removeWishlist: (id: number) => void,
    addWishList?: (id: number) => void,
    open?: () => void
}