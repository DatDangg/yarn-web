import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ProductCard from "../../components/ProductCard/ProductCard";
import ImageSlider from "./ImageSlider";
import BlogCard from "../../components/BlogCard/BlogCard";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { addToWishlist, fetchWishlist, removeFromWishlist } from "../../store/slice/wishlistSlice";
import { useNavigate } from "react-router-dom";
import { addToCartServer } from "../../store/slice/cartSlice";
import ProductModal from "../../components/ui/ProductModal";
import { ProductProps } from "../../interfaces/product";
import { BlogProps } from "../../interfaces/blog";


function Home() {
    const { t } = useTranslation();
    const API = process.env.REACT_APP_API_URL;
    const [products, setProducts] = useState<ProductProps[]>([]);
    const [blogs, setBlogs] = useState<BlogProps[]>([]);
    const { user } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const wishlist = useSelector((state: RootState) => state.wishlist.items);
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState({ state: false, product_id: 1 })
    const [quantity, setQuantity] = useState<number>(1)

    const [startIndex, setStartIndex] = useState(0);
    const maxVisible = 4;

    const handlePrev = () => {
        setStartIndex((prev) => Math.max(prev - 1, 0));
    };

    const handleNext = () => {
        setStartIndex((prev) => Math.min(prev + 1, products.length - maxVisible));
    };

    useEffect(() => {
        axios
            .get(`${API}/product`)
            .then((res) => setProducts(res.data))
            .catch((err) => console.log(err));

        axios
            .get(`${API}/blog?_sort=id&_order=desc&_limit=4`)
            .then((res) => setBlogs(res.data))
            .catch((err) => console.log(err));
    }, [API]);

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchWishlist(user.id));
        }
    }, [dispatch, user]);

    const handleAddWishList = (id: number) => {
        if (user?.id) {
            dispatch(addToWishlist({ userId: user.id, productId: id }));
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
        <div id="home" className="mt-[100px] relative">
            <ImageSlider images={["/bg1.jpg", "/bg2.jpg", "/bg3.jpg"]} />

            <div className="relative pt-[28px]">
                <img className="absolute" src="/line.png" alt="" />
                <img className="absolute" src="/line1.png" alt="" />
            </div>

            <div className="container relative">
                <div className="text-center text-[var(--primary2-color)] font-[family-name:var(--font-Dancing)] pt-1 my-4 text-[32px]">
                    {t("input")}
                </div>
                <input
                    className="text-[18px] text-[var(--primary1-color)] border-1 outline-[var(--outline-color)] w-full px-[12px] py-[8px] rounded-[5px] border-[var(--border-color)]"
                    placeholder={t("placeholder")}
                />
            </div>

            {/* Intro Section */}
            <div className="container mt-5 mb-[42px]">
                <div className="mx-[240px] text-center">
                    <div className="text-[36px] text-[var(--text-color)] font-[family-name:var(--font-IMFell)] font-bold mt-[24px]">
                        {t("welcome")}
                    </div>
                    <div className="mt-[8px] font-[family-name:var(--font-Gentium)] text-[22px]">
                        {t("intro.line1")}<br />
                        {t("intro.line2")}<br />
                        {t("intro.line3")}
                    </div>
                </div>
            </div>

            {/* Latest Products */}
            <div className="bg-[var(--pink-color)] mt-[24px] pb-[19px] text-center">
                <div className="flex items-center justify-center pt-[48px] pb-[5px] leading-none">
                    <div
                        onClick={handlePrev}
                        className={`group ${startIndex === 0 ? "" : "cursor-pointer"}`}
                        style={{ padding: "5px", display: "inline-block" }}
                    >
                        {/* left arrow */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="10.5" height="18" viewBox="0 0 7 12" fill="none">
                            <path
                                d="M2.7998 6.00078L6.6998 9.90078C6.88314 10.0841 6.9748 10.3174 6.9748 10.6008C6.9748 10.8841 6.88314 11.1174 6.6998 11.3008C6.51647 11.4841 6.28314 11.5758 5.9998 11.5758C5.71647 11.5758 5.48314 11.4841 5.2998 11.3008L0.699805 6.70078C0.599805 6.60078 0.528971 6.49245 0.487305 6.37578C0.445638 6.25911 0.424805 6.13411 0.424805 6.00078C0.424805 5.86745 0.445638 5.74245 0.487305 5.62578C0.528971 5.50911 0.599805 5.40078 0.699805 5.30078L5.2998 0.700781C5.48314 0.517448 5.71647 0.425781 5.9998 0.425781C6.28314 0.425781 6.51647 0.517448 6.6998 0.700781C6.88314 0.884115 6.9748 1.11745 6.9748 1.40078C6.9748 1.68411 6.88314 1.91745 6.6998 2.10078L2.7998 6.00078Z"
                                className={startIndex === 0 ? `fill-[#ccc]` : `fill-[var(--primary2-color)] group-hover:fill-[#D32884]`}
                            />
                        </svg>
                    </div>

                    <div className="text-[32px] text-[var(--primary2-color)] font-[family-name:var(--font-IMFell)] px-3">Latest Product</div>

                    <div
                        onClick={handleNext}
                        className={`group ${startIndex === products.length - maxVisible ? `` : `cursor-pointer`}`}
                        style={{ padding: "5px", display: "inline-block" }}
                    >
                        {/* right arrow */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="10.5" height="18" viewBox="0 0 7 12" fill="none">
                            <path
                                d="M4.5998 6.00078L0.699805 2.10078C0.516471 1.91745 0.424805 1.68411 0.424805 1.40078C0.424805 1.11745 0.516471 0.884115 0.699805 0.700781C0.883138 0.517448 1.11647 0.425781 1.3998 0.425781C1.68314 0.425781 1.91647 0.517448 2.0998 0.700781L6.6998 5.30078C6.7998 5.40078 6.87064 5.50911 6.9123 5.62578C6.95397 5.74245 6.9748 5.86745 6.9748 6.00078C6.9748 6.13411 6.95397 6.25911 6.9123 6.37578C6.87064 6.49245 6.7998 6.60078 6.6998 6.70078L2.0998 11.3008C1.91647 11.4841 1.68314 11.5758 1.3998 11.5758C1.11647 11.5758 0.883138 11.4841 0.699805 11.3008C0.516471 11.1174 0.424805 10.8841 0.424805 10.6008C0.424805 10.3174 0.516471 10.0841 0.699805 9.90078L4.5998 6.00078Z"
                                className={startIndex === products.length - maxVisible ? `fill-[#ccc]` : `fill-[var(--primary2-color)] group-hover:fill-[#D32884]`}
                            />
                        </svg>
                    </div>
                </div>

                <div
                    className="text-[12px] font-[600] w-fit uppercase text-center m-auto pb-[24px] text-[#D32884] cursor-pointer decoration-solid underline hover:text-[var(--primary1-color)]"
                    onClick={() => navigate('/product')}
                >
                    {t("view")}
                </div>
                {/* Product Cards */}
                <div className="container">
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{
                                width: `${products.length * 25}%`,
                                transform: `translateX(-${(100 / products.length) * startIndex}%)`
                            }}
                        >
                            {products.map(product => (
                                <div key={product.id} className="w-1/4 p-2 box-border">
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
                </div>
            </div>

            {/* Blog Section */}
            <div className="text-center mb-[48px]">
                <div className="flex-col items-center justify-center pt-[48px] mb-[5px] pb-[24px] leading-none">
                    <div className="text-[var(--primary2-color)] text-[18px] font-[family-name:var(--font-Homemade)] pb-[12px]">latest from</div>
                    <div className="text-[var(--primary2-color)] uppercase text-[32px] font-[family-name:var(--font-IMFell)] px-4">The Blog</div>
                </div>

                {/* Blog Cards */}
                <div className="container">
                    <div className="row">
                        {blogs.map(blog => (
                            <div key={blog.id} className="col-lg-3 flex-col items-center justify-center mx-0">
                                <BlogCard title={blog.title} category={blog.category} image={blog.image} />
                            </div>
                        ))}
                    </div>
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

export default Home;
