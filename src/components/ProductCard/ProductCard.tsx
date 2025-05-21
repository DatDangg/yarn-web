import styles from './ProductCard.module.css'

interface ProductCardProps {
    img: string,
    name: string,
    price: number,
    discount?: number
}

const ProductCard: React.FC<ProductCardProps> = ({
    img,
    name,
    price,
    discount
}) => {
    return (
        <>
        <div className={`${styles.productItem} ${styles.col_lg_2_4}`}>
            <img src={img} alt=""/>
            {discount && <div className={styles.productItem__noti}>{discount}% off</div>}
            <div className={styles.productItem__name}>
                <a href="#">
                    {name}
                </a>
            </div>
            <div className={styles.productItem__price}>{price.toLocaleString()}đ</div>
            <a href="#" className={styles.productItem__addCart}>
                Add to Cart
            </a>
            <div className={styles.productItem__action}>
                <i className="fa-solid fa-magnifying-glass"></i>
                <i className="fa-regular fa-clipboard"></i>
                <i className="fa-regular fa-heart"></i>
            </div>
        </div>
        </>
    )
}

export default ProductCard