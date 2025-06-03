export interface ProductProps {
    id: number;
    name: string;
    image: string[];
    price: number;
    discount: number;
    description: string,
    stock: number,
    quantity?:number
}

export interface ProductModalProps {
    show: boolean;
    product: ProductProps | null;
    quantity: string;
    setQuantity: (val: string) => void;
    onClose: () => void;
    onAddToCart?: () => void;
    onAddToCartSuccess?: () => void
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
    quantity?: string;
    setQuantity?: React.Dispatch<React.SetStateAction<string>>;
    onAddToCartSuccess?: () => void;
}