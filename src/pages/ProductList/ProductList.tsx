import { useEffect, useMemo, useState } from "react";
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
import useDebounce from "../../hooks/useDebounce";
import CustomPagination from "../../components/ui/CustomPagination";
import { Empty } from "antd";

function ProductList() {
    const { t } = useTranslation();
    const API = process.env.REACT_APP_API_URL;
    const { user } = useAuth();
    const dispatch = useDispatch<AppDispatch>();

    const wishlist = useSelector((state: RootState) => state.wishlist.items);
    const [products, setProducts] = useState<ProductProps[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<ProductProps[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const debouncedSearchValue = useDebounce(searchValue, 1000);

    const [showModal, setShowModal] = useState({ state: false, product_id: 1 });
    const [quantity, setQuantity] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12;

    useEffect(() => {
        axios.get(`${API}/product`)
            .then(res => {
                setProducts(res.data);
                setFilteredProducts(res.data);
            })
            .catch(err => {
                console.log(err)
                setProducts([])
                setFilteredProducts([])
            });
    }, [API]);

    useEffect(() => {
        const keyword = debouncedSearchValue.toLowerCase().trim();
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(keyword)
        );
        setCurrentPage(1);
        setFilteredProducts(filtered);
    }, [debouncedSearchValue, products]);

    const handleToggleWishlist = (id: number) => {
        if (!user?.id) return;
        if (wishlist.includes(id)) {
            dispatch(removeFromWishlist({ userId: user.id, productId: id }));
            toast.success(`${t('removeWish')}`, {
                icon: <i className="fa-solid fa-heart-crack"></i>,
                className: "text-[red]",
                progressClassName: "bg-[red]",
            });
        } else {
            dispatch(addToWishlist({ userId: user.id, productId: id }));
            toast.success(`${t('addWish')}`, {
                icon: <i className="fa-solid fa-heart"></i>,
                className: "text-[#F45D96]",
                progressClassName: "bg-[#F45D96]",
            });
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


    const currentProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredProducts.slice(startIndex, startIndex + pageSize);
    }, [filteredProducts, currentPage]);


    return (
        <div className="mt-[100px] mb-[24px]">
            <PageBanner name="Product List" />
            <div className="relative pt-[28px]">
                <img className="absolute" src='/line.png' alt="" />
                <img className="absolute" src='/line1.png' alt="" />
            </div>

            <div className="container mt-[32px]">
                <div className="row pb-[32px]">
                    <div className="flex flex-col justify-end items-end">
                        <div className="relative w-[450px]">
                            <input
                                id="search"
                                placeholder=" "
                                value={searchValue}
                                className="peer w-full text-[20px] border-[1px] border-[var(--border-color)] rounded px-[12px] py-[8px] placeholder-transparent focus:outline-none focus:border-[1px] focus:border-[var(--outline-color)]"
                                onChange={e => setSearchValue(e.target.value)}
                            />
                            <label
                                htmlFor="search"
                                className="absolute left-3 top-[-18px] text-[20px] text-gray-500 transition-all duration-200 font-[family-name:var(--font-Gentium)] bg-white px-1 pointer-events-none
                                           peer-placeholder-shown:top-[18%] peer-placeholder-shown:text-[22px] peer-placeholder-shown:text-[24px] peer-placeholder-shown:text-[var(--text-color)] peer-placeholder-shown:font-[family-name:var(--font-Dancing)]
                                           peer-focus:font-[family-name:var(--font-Gentium)] peer-focus:top-[-11px] peer-focus:leading-[20px] peer-focus:font-[500] peer-focus:text-[20px] peer-focus:text-[var(--active-color)] "
                            >
                                {t("productFind")}
                            </label >
                        </div>

                    </div>
                </div>

                <div className="row">
                    {currentProducts.length > 0 ?
                        (
                            <>
                                {currentProducts.map(product => (
                                    <div key={product.id} className="col-lg-3 text-center">
                                        <ProductCard
                                            img={product.image[0]}
                                            name={product.name}
                                            price={product.price}
                                            discount={product.discount}
                                            wishlist={wishlist.includes(product.id)}
                                            id={product.id}
                                            addWishList={() => handleToggleWishlist(product.id)}
                                            removeWishlist={() => handleToggleWishlist(product.id)}
                                            open={() => setShowModal({ state: true, product_id: product.id })}
                                        />
                                    </div>
                                ))}
                                <div className="text-center flex justify-center mt-6">
                                    <CustomPagination
                                        currentPage={currentPage}
                                        pageSize={pageSize}
                                        total={filteredProducts.length}
                                        onChange={page => setCurrentPage(page)}
                                    />
                                </div>
                            </>
                        )
                        :
                        <div className="mt-[36px] w-full text-center">
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        </div>
                    }
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
