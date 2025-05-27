import { useEffect, useState } from "react";
import axios from "axios";
import PageBanner from "../../components/ui/PageBanner";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useAuth } from "../../contexts/AuthContext";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import { AppDispatch, RootState } from "../../store/store";
import { fetchWishlist, removeFromWishlist } from "../../store/slice/wishlistSlice";
import { ProductProps } from "../../interfaces/product";
import { useTranslation } from "react-i18next";
import ProductModal from "../../components/ui/ProductModal";
import { addToCartServer } from "../../store/slice/cartSlice";


function WishList() {
    const API = process.env.REACT_APP_API_URL;
    const { user } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const wishlist = useSelector((state: RootState) => state.wishlist.items);
    const [products, setProducts] = useState<ProductProps[]>([]);
    const [showModal, setShowModal] = useState({ state: false, product_id: 1 })
    const [quantity, setQuantity] = useState<number>(1)
    const { t } = useTranslation()

    const fetchProducts = async () => {
        try {
            const productRequests = wishlist.map(id =>
                axios.get(`${API}/product/${id}`).then(res => res.data)
            );
            const productsData = await Promise.all(productRequests);
            setProducts(productsData);
        } catch (err) {
            console.log(err);
        }
    };

    const handleAddToCart = async (id: number) => {
        if (!user?.id) return;
        try {
            await dispatch(addToCartServer({ user_id: user.id, product_id: id, quantity }))
                .unwrap(); 

            setQuantity(1);
            setShowModal({ state: false, product_id: 1 });
            toast.success(`${t("addCart")}`);
        } catch (err: any) {
            console.error(err);
            toast.error(err || t("errorOccurred")); 
        }
    };

    useEffect(() => {
        if (wishlist.length > 0) fetchProducts();
        else setProducts([]);
    }, [wishlist]);

    const handleToggleWishlist = (id: number) => {
        if (!user?.id) return;
        if (wishlist.includes(id)) {
            dispatch(removeFromWishlist({ userId: user.id, productId: id }));
            toast.success(`${t('removeWish')}`, {
                icon: <i className="fa-solid fa-heart-crack"></i>,
                className: "text-[red]",
                progressClassName: "bg-[red]",
            });
        }
    };


    return (
        <div className="mt-[100px]">
            <PageBanner name="Wishlist" />
            <div className="relative pt-[28px]">
                <img className="absolute" src='/line.png' alt="" />
                <img className="absolute" src='/line1.png' alt="" />
            </div>
            <div className="container mt-[24px]">
                <div className="row">
                    {products.map(product => (
                        <div key={product.id} className="col-lg-3 text-center">
                            <ProductCard
                                img={product.image[0]}
                                name={product.name}
                                price={product.price}
                                discount={product.discount}
                                wishlist={true}
                                id={product.id}
                                removeWishlist={() => handleToggleWishlist(product.id)}
                                open={() => setShowModal({ state: true, product_id: product.id })}
                            />
                        </div>
                    ))}
                </div>
            </div>
            {showModal.state && (
                <ProductModal
                    show={showModal.state}
                    product={products.find(p => p.id === showModal.product_id) || null}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    onClose={() => {
                        setQuantity(1);
                        setShowModal({ state: false, product_id: 1 });
                    }}
                    onAddToCart={() => handleAddToCart(showModal.product_id)}
                />

            )}
        </div>
    );
}

export default WishList;
