import { useEffect, useState } from "react";
import PageBanner from "../../components/ui/PageBanner";
import axios from "axios";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useAuth } from "../../contexts/AuthContext";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import { AppDispatch, RootState } from "../../store/store";
import { addToWishlist, fetchWishlist, removeFromWishlist } from "../../store/slice/wishlistSlice";
import { addToCartServer } from "../../store/slice/cartSlice";
import { useTranslation } from "react-i18next";
import ProductModal from "../../components/ui/ProductModal";
import { ProductProps } from "../../interfaces/product";

function ProductList() {
    const { t } = useTranslation();

    const [products, setProducts] = useState<ProductProps[]>([]);
    const API = process.env.REACT_APP_API_URL;
    const { user } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const wishlist = useSelector((state: RootState) => state.wishlist.items);
    const [showModal, setShowModal] = useState({ state: false, product_id: 1 })
    const [quantity, setQuantity] = useState<number>(1)
    useEffect(() => {
        axios.get(`${API}/product`)
            .then(res => setProducts(res.data))
            .catch(err => console.log(err));
    }, [API]);

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchWishlist(user.id));
        }
    }, [dispatch, user]);

    const handleAddWishList = (id: number) => {
        if (user?.id) {
            dispatch(addToWishlist({ userId: user?.id, productId: id }));
            toast.success(`${t('addWish')}`, {
                icon: <i className="fa-solid fa-heart"></i>,
                className: "text-[#F45D96]",
                progressClassName: "bg-[#F45D96]",
            });
        }
    };

    const handleRemoveWishList = (id: number) => {
        if (user?.id) {
            dispatch(removeFromWishlist({ userId: user?.id, productId: id }));
            toast.success(`${t('removeWish')}`, {
                icon: <i className="fa-solid fa-heart-crack"></i>,
                className: "text-[red]",
                progressClassName: "bg-[red]",
            });
        }
    };

    const handleAddToCart = async (id: any) => {
        if (!user?.id) return;
        try {
            await dispatch(addToCartServer({ user_id: user.id, product_id: id, quantity: quantity }));
            setQuantity(1)
            setShowModal({ state: false, product_id: 1 })
            toast.success(`${t("addCart")}`);
        } catch (err) {
            console.error(err);
            toast.error(`${t("errorOccurred")}`);
        }
    };

    return (
        <div className="mt-[100px]">
            <PageBanner name="Product List" />
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
                                wishlist={wishlist.includes(product.id)}
                                id={product.id}
                                removeWishlist={() => handleRemoveWishList(product.id)}
                                addWishList={() => handleAddWishList(product.id)}
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

export default ProductList;
