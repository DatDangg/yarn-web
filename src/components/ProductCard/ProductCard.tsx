import { toast } from 'react-toastify';
import { useAppDispatch } from '../../hooks/useStore';
import { addToCartServer } from '../../store/slice/cartSlice';
import styles from './ProductCard.module.css'
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { ProductCardProps } from '../../interfaces/product';

const ProductCard: React.FC<ProductCardProps> = ({
    img,
    name,
    price,
    discount,
    wishlist,
    id,
    removeWishlist,
    addWishList,
    open
}) => {
    const dispatch = useAppDispatch();
    const { user } = useAuth()
    const { t } = useTranslation()
    const API = process.env.REACT_APP_API_URL;

    const handleAddToCart = async () => {
        if (!user?.id) return;
        try {
            await dispatch(addToCartServer({ user_id: user.id, product_id: id }));
            toast.success(`${t("addCart")}`);
        } catch (err) {
            console.error(err);
            toast.error(`${t("errorOccurred")}`);
        }
    };

    return (
        <div className={`${styles.productItem} ${styles.col_lg_2_4}`}>
            <img src={img} alt={name} />
            {discount && <div className={styles.productItem__noti}>{discount}% off</div>}
            <div className={styles.productItem__name}>
                <a href="#">{name}</a>
            </div>
            <div className={styles.productItem__price}>{price.toLocaleString()}đ</div>
            <div
                onClick={handleAddToCart}
                className={styles.productItem__addCart}
            >
                Add to Cart
            </div>
            <div className={styles.productItem__action}>
                <i className="fa-solid fa-magnifying-glass" onClick={open}></i>
                {/* <i className="fa-solid fa-cart-shopping"></i> */}
                {wishlist ?
                    <i 
                        className="fa-solid fa-heart text-[#F45D96]"
                        onClick={() => removeWishlist(id)}
                    ></i>
                    : 
                    <i
                        className="fa-regular fa-heart"
                        onClick={() => addWishList?.(id)}
                    ></i>
                }


            </div>
        </div>
    )
}
export default ProductCard;
