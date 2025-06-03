import React from "react";
import GallerySwiper from "../ui/GallerySwiper";
import { ProductModalProps } from "../../interfaces/product";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { addToCartServer } from "../../store/slice/cartSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { toast } from "react-toastify";
import formatPrice from "../../utils/formatPrice";

const ProductModal: React.FC<ProductModalProps> = ({
    show,
    product,
    quantity,
    setQuantity,
    onClose,
    onAddToCartSuccess,
}) => {
    const { user } = useAuth();
    const { t } = useTranslation()
    const dispatch = useDispatch<AppDispatch>();
    if (!show || !product) return null;

    const discountedPrice = product.discount
        ? Number((product.price * (1 - product.discount / 100)).toFixed(0))
        : product.price;

    const onAddToCart = async (id: number) => {
        if (!user?.id) return;
        try {
            await dispatch(addToCartServer({ user_id: user.id, product_id: id, quantity, t }))
                .unwrap();

            setQuantity('1');
            if (onAddToCartSuccess) onAddToCartSuccess();
            toast.success(`${t("addCart")}`);
        } catch (err: any) {
            console.error(err);
            toast.error(err || t("errorOccurred"));
        }
    };

    return (
        <div
            className="fixed inset-0 z-[15] flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-[800px] relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-3 right-4 text-[var(--text-color)] border-1 border-[var(--text-color)] hover:text-white hover:bg-[var(--primary2-color)] hover:border-[var(--primary2-color)] w-[28px] h-[28px] rounded-full text-[12px]"
                    onClick={onClose}
                >
                    ✕
                </button>
                <div className="text-xl font-bold mb-4 uppercase font-[family-name:var(--font-IMFell)]">{t('detail')}</div>
                <div className="flex w-full overflow-hidden">
                    <GallerySwiper img={product.image} />
                    <div className="flex-1 ml-[24px]">
                        <div className="text-[26px] font-[600] font-[family-name:var(--font-IMFell)]">{product.name}</div>
                        <div className="w-full h-[1px] border border-[--border-color] my-[15px]"></div>
                        <div className="flex items-center font-[family-name:var(--font-Gentium)]">
                            {product.discount ? (
                                <>
                                    <div className="text-[24px]">{formatPrice(discountedPrice)}</div>
                                    <div className="text-[20px] line-through ml-[20px] text-[var(--text-color)]">
                                        {formatPrice(product.price)}
                                    </div>
                                </>
                            ) : (
                                <div className="text-[24px]">{formatPrice(product.price)}</div>
                            )}
                        </div>
                        <div className="w-full h-[1px] border border-[--border-color] my-[15px]"></div>
                        <div className="flex my-[20px] ">
                            <input
                                className="rounded-[5px] text-[20px] border w-[40px] h-[40px] text-center border-[var(--border-color)] outline-[var(--outline-color)]"
                                value={quantity}
                                type="number"
                                // min={1}
                                onChange={(e) => {
                                    if (e.target.value === '0' ) setQuantity('1')
                                    else if (Number(e.target.value) > product.stock) setQuantity(String(product.stock))
                                    else setQuantity(e.target.value)
                                }}
                                onBlur={(e) => {if (e.target.value === '' ) setQuantity('1')}}
                            />
                            <button
                                className=" rounded-[5px] border bg-[var(--border-color)] hover:border-[var(--primary2-color)] hover:bg-[var(--primary2-color)] uppercase px-[24px] ml-[12px] hover:text-white font-[600]"
                                onClick={() => onAddToCart(product.id)}
                            >
                                Add to cart
                            </button>
                        </div>
                        <div className="w-full h-[1px] border border-[--border-color] my-[15px]"></div>
                        <div className="text-[18px] text-[var(--text-color)]">{product.description}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
