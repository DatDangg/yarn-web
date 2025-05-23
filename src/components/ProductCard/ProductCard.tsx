import { toast } from 'react-toastify';
import { useAppDispatch } from '../../hooks/useStore';
import { addToCart, addToCartServer } from '../../store/slice/cartSlice';
import styles from './ProductCard.module.css'
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

interface ProductCardProps {
    img: string,
    name: string,
    price: number,
    discount?: number,
    id: number
}

const ProductCard: React.FC<ProductCardProps> = ({
    img,
    name,
    price,
    discount,
    id
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
                <i className="fa-solid fa-magnifying-glass"></i>
                {/* <i className="fa-solid fa-cart-shopping"></i> */}
                <i className="fa-regular fa-heart"></i>
            </div>
        </div>
    )
}
export default ProductCard;
