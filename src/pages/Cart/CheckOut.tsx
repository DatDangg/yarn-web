import PageBanner from "../../components/ui/PageBanner"
import { useTranslation } from "react-i18next"
import { useEffect, useMemo, useState, useCallback } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { ProductProps } from "../../interfaces/product"
import { useAuth } from "../../contexts/AuthContext"
import { getCoordinates, useDistanceCalculator } from "../../components/useDistanceCalculator"
import { Shipping } from "../../interfaces/user"
import { formatDate_ } from "../../utils/formatDate"
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from "../../hooks/useStore"
import formatPrice from "../../utils/formatPrice"
import { removeFromCart } from "../../store/slice/cartSlice"
import { LoadingOutlined } from "@ant-design/icons"
import { Spin, Tag } from "antd"


interface SelectedProduct {
    product_id: number,
    quantity: number,
    price?: number
    discount?: number
}

interface Payment {
    totalPrice: number,
    shippingFee: number,
    payment_method: string,
    couponDiscount: number,
    totalProduct: number,
    status: string,
    cf_payment_at?: string
}


export interface Order {
    id?: number,
    products: SelectedProduct[],
    user_id: number,
    order_status: 'Pending' | 'Shipping' | 'Delivered' | 'Canceled',
    created_at: string,
    shipping_at: string,
    finished_at: string,
    payment: Payment,
    address: Shipping
}

function CheckOut() {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const API = process.env.REACT_APP_API_URL
    const { user, update } = useAuth()
    const [products, setProducts] = useState<ProductProps[]>([])
    const [couponCode, setCouponCode] = useState('')
    const [couponDiscount, setCouponDiscount] = useState(0)
    const [couponErr, setCouponErr] = useState('')
    const stored = localStorage.getItem('selectedProducts');
    const selectedProducts: SelectedProduct[] = stored ? JSON.parse(stored) : [];
    const [shippingCharge, setShippingCharge] = useState<number>(0)
    const [shippingInfor, setShippingInfor] = useState<Shipping>({ id: user?.id!, receiver: user?.fullname!, phonenumber: user?.phonenumber!, address: '' })
    const [showModal, setShowModal] = useState(false)
    const [isEditing, setIsEditing] = useState({ action: "", state: false })
    const [data, setData] = useState({ id: 0, receiver: "", phonenumber: '', address: "" })
    const [defaultAddress, setDefaultAddress] = useState<Shipping>()
    const { distance } = useDistanceCalculator("Đại Lan, Duyên Hà, Thanh Trì, Hà Nội", defaultAddress?.address!);
    const grandTotal = useMemo(() => products.reduce((sum, item) => (sum + item.price * (item.discount ? (1 - item.discount / 100) : 1) * (item.quantity || 1)), 0), [products])
    const totalPayment = grandTotal + shippingCharge - couponDiscount

    const [paymentMethods, setPaymentMethods] = useState<any[]>()

    const [err, setErr] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const bankInfor = {
        acc: 4220112003,
        bank: "MBBank"
    }
    const cartItems = useAppSelector(state => state.cart.items)
    const [activeMethod, setActiveMethod] = useState<string | null>("qr");
    const transactionRef = `CR${uuidv4()}`;

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const productResponses = await Promise.all(
                selectedProducts.map(item => axios.get(`${API}/product?id=${item.product_id}`))
            );
            const product_ = productResponses.map((res, idx) => {
                const product = res.data[0];
                const quantity = selectedProducts[idx].quantity;
                return { ...product, quantity };
            });

            if (user?.shippingInfor?.length) {
                const defaultAddr = user.shippingInfor.find(info => info?.state === 'default');
                if (defaultAddr) {
                    setDefaultAddress(defaultAddr);
                    setShippingInfor(defaultAddr);
                }
            }

            setProducts(product_);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (!distance) return;
        const numDistance = Number(distance);
        if (numDistance < 5) setShippingCharge(0);
        else if (numDistance < 10) setShippingCharge(25000);
        else setShippingCharge(40000 + Math.floor((numDistance - 10) / 5) * 5000);
        setIsLoading(false)

    }, [distance]);

    const handleCouponSubmit = useCallback(async () => {
        setCouponErr('')
        try {
            const res = await axios.get(`${API}/coupon?code=${couponCode}`)
            const coupon = res.data[0]
            if (coupon) {
                setCouponCode('')
                const discount = coupon.discount
                const value = discount.includes('%')
                    ? Math.floor(Number(discount.replace('%', '')) * grandTotal / 100)
                    : Number(discount)
                setCouponDiscount(value)
            } else {
                setCouponErr(t('discountErr'))
            }
        } catch (err) {
            console.error("Coupon fetch error:", err)
        }
    }, [couponCode, grandTotal, API, t])

    const handleUpdateAddress = () => {
        const newInfor = user?.shippingInfor.map(value => {
            if (value.id === data.id) return { ...value, address: data.address, receiver: data.receiver, phonenumber: data.phonenumber };
            else return value
        })
        axios.patch(`${API}/users/${user?.id}`, {
            shipping_infor: newInfor
        })
            .then(() => {
                update()
            })
            .catch(err => console.log(err))
    }

    const handleAddAddress = async () => {
        if (!user) return;

        const newShippingInfor = [
            ...(user.shippingInfor || []),
            {
                id: Date.now(),
                receiver: data.receiver,
                phonenumber: data.phonenumber,
                address: data.address
            }
        ];

        try {
            await axios.patch(`${API}/users/${user.id}`, {
                shipping_infor: newShippingInfor
            });

            update();
        } catch (error) {
            console.error("Failed to add new shipping address:", error);
        }
    };

    const handleDefaultAddress = async () => {
        const newInfor = user?.shippingInfor.map(value => {
            if (value.state === "default") return { ...value, state: "" }
            else if (value.id === data.id) {
                setDefaultAddress(value)
                return { ...value, state: "default" }
            }
            else return value
        })

        axios.patch(`${API}/users/${user?.id}`, {
            shipping_infor: newInfor
        })
            .then(() => {
                update()
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        const check = [
            {
                id: "qr",
                label: `${t('checkout6')}`,
                content: (
                    <div className="flex justify-center flex-col items-center">
                        <div className="mb-[10px] text-md">{t('checkout9')}</div>
                        <img
                            src={`https://qr.sepay.vn/img?acc=${bankInfor.acc}&bank=${bankInfor.bank}&amount=${totalPayment}&des=CROCHET${transactionRef}`}
                            alt="QR Code"
                            className="w-[200px] h-[200px]"
                        />
                        <button
                            type="submit"
                            className="font-[600] mt-[10px] bg-[var(--primary2-color)] hover:bg-[var(--active-color)] text-white py-[10px] w-full rounded"
                            // onClick={() => paymentCheck()}
                            onClick={() => handlePayment()}
                        >
                            {t('checkout7')}
                        </button>
                    </div>
                )
            },
            {
                id: "cod",
                label: `${t('checkout5')}`,
                content: (
                    <div>
                        <p className="mb-[10px]">Bạn sẽ thanh toán bằng tiền mặt khi nhận hàng.</p>

                        <button
                            className="mt-[20px] w-full bg-[var(--primary2-color)] text-white py-[10px] rounded"
                            onClick={() => handlePayment()}
                        >
                            {t('checkout8')}
                        </button>
                    </div>

                )
            },
        ];
        setPaymentMethods(check)
    }, [totalPayment])

    const paymentCheck = async () => {
        try {
            const date = formatDate_(new Date())
            const data = await axios.get(`https://my.sepay.vn/userapi/transactions/list?transaction_date_min=${date}&amount_in=${transactionRef}`, {
                headers: {
                    'Authorization': 'Bearer BQTYVJWFCX0BKXAWHDJHRWPUSIH72T2P6VB9EDSZG8UOTROV8XGIKILTIXUUSEWC',
                    'Content-Type': 'application/json'
                }
            });
            const transaction = data.data.transactions
            if (transaction.length > 0) {
                transaction.map((data: any) => {
                    if (data.transaction_content.includes(transactionRef.split('-').join(''))) {
                        handlePayment()
                        return
                    }
                })
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handlePayment = async () => {
        try {
            let order = []
            order.push(...selectedProducts.map(data =>
                cartItems.filter(value => value.product_id === data.product_id)
            ))

            const orderProducts: SelectedProduct[] = products.map(item => ({
                product_id: item.id,
                quantity: typeof item.quantity === "string" ? parseInt(item.quantity) : item.quantity!,
                price: item.price,
                discount: item.discount ?? 0
            }));

            const payment: Payment = {
                totalPrice: totalPayment,
                shippingFee: shippingCharge,
                couponDiscount: couponDiscount,
                payment_method: activeMethod!,
                totalProduct: grandTotal,
                status: activeMethod === 'cod' ? "Unpaid" : "Paid",
                cf_payment_at: activeMethod === 'qr' ? new Date().toISOString() : '',
            }

            const newOrder: Order = {
                products: orderProducts,
                user_id: user?.id!,
                order_status: "Pending",
                created_at: new Date().toISOString(),
                shipping_at: "",
                finished_at: "",
                payment,
                address: defaultAddress!
            }

            await axios.post(`${API}/order`, { ...newOrder })

            await Promise.all(
                order.map(item => dispatch(removeFromCart(item[0].id!)))
            )

            localStorage.removeItem('selectedProducts')
            navigate("/user/order")
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            {isLoading &&
                <div className="fixed inset-0 z-[50] backdrop-blur-[2px] bg-white/30 flex items-center justify-center">
                    <Spin className="bg-white p-[20px] shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]" indicator={<LoadingOutlined style={{ fontSize: 82, color: 'var(--active-color)' }} spin />} />
                </div>}

            <div className="mb-[24px] mt-[100px] relative">
                <PageBanner name="Check out" />
                <div className="relative pt-[28px]">
                    <img className="absolute" src='/line.png' />
                    <img className="absolute" src='/line1.png' />
                </div>
                <div className="container mt-[24px]">
                    <div className="row mb-[48px] mx-0">
                        <div className="shadow-[0_7px_29px_0_rgba(100,100,111,0.2)] h-full p-[12px] flex flex-col">
                            <div className="flex justify-between items-center">
                                <div className="uppercase font-[700] text-[20px]">{t("checkout1")}</div>
                                <div
                                    className="font-[600] text-[20px] hover:border-1 hover:bg-[var(--active-color)] rounded-[8px] hover:border-[var(--active-color)] leading-[20px] px-[12px] py-[6px] text-[var(--text-color)] cursor-pointer hover:text-[white]"
                                    onClick={() => setShowModal(true)}
                                >
                                    {t('checkout3')}
                                </div>
                            </div>
                            <div className="w-[80px] border-1 border-[--border-color] mb-[7px]"></div>
                            <div className="w-full mb-[7px] mt-[8px] text-[20px]">
                                <div className="flex items-center">
                                    <i className="fa-solid fa-location-dot text-[35px] mr-[25px]"></i>
                                    <div>
                                        <span className="font-[700]">{defaultAddress?.receiver} {" "}</span>
                                        <span className="font-[700] mr-[24px]">{defaultAddress?.phonenumber}</span>
                                        <span>{defaultAddress?.address}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="row mb-[48px] mx-0">
                        <div className="shadow-[0_7px_29px_0_rgba(100,100,111,0.2)] pt-[24px]">
                            <table className="w-full table-auto text-[22px]">
                                <thead>
                                    <tr className="text-left border-b">
                                        <th className="pb-2">{t('checkoutTable1')}</th>
                                        <th className="pb-2">{t('checkoutTable2')}</th>
                                        <th className="pb-2">{t('checkoutTable3')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((item, idx) => (
                                        <tr key={idx} className="border-b">
                                            <td className="py-2 flex items-center">
                                                <img
                                                    src={item.image[0]}
                                                    alt="product"
                                                    className="rounded-[5px] w-[80px] h-[80px] mr-[10px]"
                                                />
                                                <span className="font-[600]">{item.name}</span>
                                            </td>
                                            <td className="py-2">
                                                {formatPrice(item.price)}
                                            </td>
                                            <td className="py-2">
                                                {formatPrice(item.discount
                                                    ? item.price * (1 - item.discount / 100) * item.quantity!
                                                    : item.price * item.quantity!
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-6">
                            <div className="row mb-[48px] mx-0">
                                <div className="shadow-[0_7px_29px_0_rgba(100,100,111,0.2)] h-full p-[12px] flex flex-col">
                                    <div className="uppercase font-[700] text-[20px]">{t('discount')}</div>
                                    <div className="w-[80px] border-1 border-[--border-color] mb-[7px]"></div>
                                    <div className="relative w-full">
                                        <input
                                            className="bg-[#eeeeee] px-[14px] py-[8px] outline-none text-[16px] w-full"
                                            value={couponCode}
                                            onChange={e => setCouponCode(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleCouponSubmit()
                                                }
                                            }}
                                            placeholder={t('discountPlaceholder')}
                                        />
                                        <button
                                            className="absolute right-[15px] top-[8px] font-[600] hover:text-[var(--active-color)] flex items-center justify-center"
                                            onClick={handleCouponSubmit}
                                        >
                                            <i className="fa-solid fa-ticket rotate-45 mr-[2px] text-[12px]"></i>
                                            {t('checkout4')}
                                        </button>
                                    </div>
                                    <div className="text-red-500">
                                        {couponErr}
                                    </div>
                                </div>
                            </div>
                            <div className="row mx-0">
                                <div className="shadow-[0_7px_29px_0_rgba(100,100,111,0.2)] h-full p-[40px] flex flex-col">
                                    <div className="uppercase font-[700] text-[20px]">{t('payment')}</div>
                                    <div className="w-[80px] border-1 border-[--border-color]"></div>
                                    <div className="mt-[10px] text-[18px]">
                                        <div className="flex justify-between py-[6px] px-[20px]">
                                            <div>{t("payment1")}</div>
                                            <div>{formatPrice(grandTotal)}</div>
                                        </div>
                                        <div className="w-full h-[1px] border-1 border-[--border-color] my-[5px]"></div>
                                        <div className="flex justify-between py-[6px] px-[20px]">
                                            <div>{t("payment2")}</div>
                                            <div>{shippingCharge > 0 ? formatPrice(shippingCharge) : 0}</div>
                                        </div>
                                        <div className="w-full h-[1px] border-1 border-[--border-color] my-[5px]"></div>
                                        <div className="flex justify-between py-[6px] px-[20px]">
                                            <div>{t("payment3")}</div>
                                            <div className=" text-red-500 flex"> <span className="mr-[4px]">-</span>{formatPrice(couponDiscount)}</div>
                                        </div>
                                        <div className="w-full h-[1px] border-1 border-[--border-color] my-[5px]"></div>
                                        <div className="flex justify-between py-[6px] px-[20px] flex items-center">
                                            <div>{t("payment4")}</div>
                                            <div className="text-[var(--primary2-color)] font-[700] text-[24px]">{formatPrice(totalPayment)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-hidden col-lg-5 offset-lg-1 shadow-[0_7px_29px_0_rgba(100,100,111,0.2)] pb-[20px] px-[20px]">
                            <div className="flex flex-col gap-[12px]">
                                {paymentMethods &&
                                    <>
                                        <div className="flex justify-between">
                                            {/* <div className="absolute z-10 left-0 right-0 border-b-[2px] border-b-[#e5e2e2] top-[53px]"></div> */}
                                            <div
                                                className={`
                                                    ${activeMethod === paymentMethods[0].id &&
                                                `relative h-fit
                                                before:content-[''] after:content-['']
                                                before:w-[100%] before:h-[14px] before:border-[2px] before:rounded-br-[8px] before:absolute before:left-[-100%] before:bottom-[-7px] before:border-l-0 before:border-t-0 before:border-b-[#e5e2e2] before:border-r-[#e5e2e2] before:border-l-[transparent] before:border-t-[transparent]
                                                after:w-[calc(100%+20px)] after:h-[14px] after:border-[2px] after:rounded-bl-[8px] after:absolute after:right-[calc(-100%-20px)] after:bottom-[-7px] after:border-r-0 after:border-t-0 after:border-b-[#e5e2e2] after:border-l-[#e5e2e2] after:border-r-[transparent] after:border-t-[transparent]
                                                border-[2px] border-b-[white] border-l-[#e5e2e2] border-r-[#e5e2e2] border-t-[#e5e2e2] rounded-tl-[8px] rounded-tr-[8px]` }
                                                w-full pl-[5px] cursor-pointer font-[600]  hover:text-[var(--primary2-color)]
                                                `}
                                                onClick={() => setActiveMethod(activeMethod === paymentMethods[0].id ? null : paymentMethods[0].id)}
                                            >
                                                <span className="text-[16px] leading-[20px] block mt-[2px]">{paymentMethods[0].label}</span>
                                            </div>
                                            <div
                                                className={`
                                                    ${activeMethod === paymentMethods[1].id &&
                                                `relative h-fit
                                                before:w-[calc(100%+20px)] before:h-[14px] before:border-[2px] before:rounded-br-[8px] before:absolute before:left-[calc(-100%-20px)] before:bottom-[-7px] before:border-l-0 before:border-t-0 before:border-b-[#e5e2e2] before:border-r-[#e5e2e2] before:border-l-[transparent] before:border-t-[transparent]
                                                after:w-[100%] after:h-[14px] after:border-[2px] after:rounded-bl-[8px] after:absolute after:right-[-100%] after:bottom-[-7px] after:border-r-0 after:border-t-0 after:border-b-[#e5e2e2] after:border-l-[#e5e2e2] after:border-r-[transparent] after:border-t-[transparent]
                                                border-[2px] border-b-[white] border-l-[#e5e2e2] border-r-[#e5e2e2] border-t-[#e5e2e2] rounded-tl-[8px] rounded-tr-[8px]` }
                                                w-full pl-[5px] cursor-pointer font-[600]  hover:text-[var(--primary2-color)]
                                                `}
                                                onClick={() => setActiveMethod(activeMethod === paymentMethods[1].id ? null : paymentMethods[1].id)}
                                            >
                                                <span className="text-[16px] leading-[20px] block mt-[2px]">{paymentMethods[1].label}</span>
                                            </div>
                                        </div>
                                        <div className="mt-[24px]">
                                            {activeMethod === paymentMethods[0].id && (
                                                <div className="mt-[8px] p-[10px] border border-[--border-color] rounded bg-[#f9f9f9] text-[16px]">
                                                    {paymentMethods[0].content}
                                                </div>
                                            )}
                                            {activeMethod === paymentMethods[1].id && (
                                                <div className="mt-[8px] p-[10px] border border-[--border-color] rounded bg-[#f9f9f9] text-[16px]">
                                                    {paymentMethods[1].content}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                {
                    showModal &&
                    <div className="fixed inset-0 z-[25] flex items-center justify-center bg-black bg-opacity-50" onClick={() => {
                        setShowModal(false)
                        setData({ id: 0, receiver: "", address: "", phonenumber: "" });
                        setIsEditing({ action: "", state: false });
                    }}>
                        <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] h-[600px] max-w-[750px] relative flex flex-col" onClick={(e) => e.stopPropagation()}>
                            <div className="capitalize text-[28px] font-[600] font-[family-name:var(--font-IMFell)]">{t('checkout2')}</div>
                            <i className="fa-solid fa-xmark absolute right-[14px] top-[12px] hover:scale-125 cursor-pointer text-[20px]"
                                onClick={() => {
                                    setShowModal(false)
                                    setData({ id: 0, receiver: "", address: "", phonenumber: "" });
                                    setIsEditing({ action: "", state: false });
                                }}></i>

                            {/* Nội dung chính chia 2 cột */}
                            <div className="flex flex-2 gap-[20px] overflow-hidden">
                                {/* Danh sách địa chỉ: có scroll */}
                                <div className="flex-1 overflow-y-auto pr-2 pl-3 custom-scroll">
                                    {user?.shippingInfor && user.shippingInfor.map(data => (
                                        <div key={data.id}>
                                            <label htmlFor={`address-${data.id}`} className="block flex items-start">
                                                <input
                                                    type="radio"
                                                    id={`address-${data.id}`}
                                                    name="selectedAddress"
                                                    value={data.id}
                                                    checked={shippingInfor.id === data.id}
                                                    onChange={() =>
                                                        setShippingInfor({
                                                            id: data?.id!,
                                                            receiver: data?.receiver!,
                                                            phonenumber: data?.phonenumber!,
                                                            address: data?.address!
                                                        })
                                                    }
                                                    className="mr-3 scale-[1.8] mt-5"
                                                />
                                                <div className="break-all text-[20px] w-full p-[20px] my-[18px] border-1 border-[var(--border-color)] rounded-[8px] flex items-center justify-between">
                                                    <div>
                                                        <div className="flex items-center">
                                                            {data.receiver}
                                                            {defaultAddress?.id === data.id &&
                                                                <Tag color='green' className='font-[500] ml-[5px]'>{t('checkoutModal7')}</Tag>
                                                            }
                                                        </div>
                                                        <div>{data.phonenumber}</div>
                                                        <div>{data.address}</div>
                                                    </div>
                                                    <div>
                                                        <i
                                                            className="fa-solid fa-pen text-[20px] hover:text-[var(--active-color)] cursor-pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setIsEditing({ action: "update", state: true });
                                                                setErr(false)

                                                                setData({
                                                                    id: data.id,
                                                                    receiver: data.receiver,
                                                                    address: data.address,
                                                                    phonenumber: data.phonenumber
                                                                });
                                                            }}
                                                        ></i>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                {/* Form chỉnh sửa/thêm địa chỉ: cố định */}
                                {isEditing.state && (
                                    <div className="flex-1 text-[20px] p-[20px] border-1 border-[var(--border-color)] flex flex-col rounded-[8px] relative h-fit">
                                        <i
                                            className="fa-solid fa-xmark absolute right-[14px] top-[12px] hover:scale-125 cursor-pointer text-[20px]"
                                            onClick={() => setIsEditing({ action: "", state: false })}
                                        ></i>
                                        <label htmlFor="Fullname">{t('checkoutModal2')}</label>
                                        <input
                                            value={data.receiver}
                                            onChange={(e) => setData((prev) => ({ ...prev, receiver: e.target.value }))}
                                            id="Fullname"
                                            className="border-2 border-[var(--border-color)] mb-[12px] px-[12px] py-[6px] outline-none rounded-[8px] focus:border-[var(--active-color)]"
                                        />
                                        <label htmlFor="Phone">{t('checkoutModal3')}</label>
                                        <input
                                            value={data.phonenumber}
                                            onChange={(e) => setData((prev) => ({ ...prev, phonenumber: e.target.value }))}
                                            id="Phone"
                                            className="border-2 border-[var(--border-color)] mb-[12px] px-[12px] py-[6px] outline-none rounded-[8px] focus:border-[var(--active-color)]"
                                        />
                                        <label htmlFor="Address">{t('checkoutModal4')}</label>
                                        <textarea
                                            value={data.address}
                                            onChange={(e) => setData((prev) => ({ ...prev, address: e.target.value }))}
                                            id="Address"
                                            className="border-2 border-[var(--border-color)]  px-[12px] py-[6px] outline-none rounded-[8px] focus:border-[var(--active-color)]"
                                        />
                                        {err ? <div className="mb-[12px] text-red-500 text-[14px]">{t('checkoutModal1')}</div> : <div className="mb-[12px] text-[14px] invisible">_</div>}
                                        <div className="flex justify-between mt-2">
                                            {isEditing.action === "update" && (
                                                <button
                                                    className="text-[20px] w-fit hover:text-[white] font-[600] border-1 border-[var(--border-color)] px-[12px] py-[6px] rounded-[8px] hover:border-[var(--active-color)] hover:bg-[var(--active-color)]"
                                                    onClick={async () => {
                                                        const res = await getCoordinates(data.address)
                                                        if (res.lat === 0 && res.lon === 0) {
                                                            setErr(true)
                                                        }
                                                        else {
                                                            setIsEditing({ action: "", state: false });
                                                            setData({ id: 0, receiver: "", address: "", phonenumber: "" });
                                                            handleUpdateAddress();
                                                            setErr(false)

                                                        }
                                                    }}
                                                >
                                                    {t('checkoutModal5')}
                                                </button>
                                            )}
                                            {isEditing.action === "edit" && (
                                                <button
                                                    className="text-[20px] w-fit hover:text-[white] font-[600] border-1 border-[var(--border-color)] px-[12px] py-[6px] rounded-[8px] hover:border-[var(--active-color)] hover:bg-[var(--active-color)]"
                                                    onClick={async () => {
                                                        const res = await getCoordinates(data.address)
                                                        if (res.lat === 0 && res.lon === 0) {
                                                            setErr(true)
                                                        }
                                                        else {
                                                            setIsEditing({ action: "", state: false });
                                                            setData({ id: 0, receiver: "", address: "", phonenumber: "" });
                                                            handleAddAddress();
                                                            setErr(false)

                                                        }
                                                    }}
                                                >
                                                    {t('checkoutModal6')}
                                                </button>
                                            )}

                                            {isEditing.action === "update" && (
                                                defaultAddress?.id === data.id ? (
                                                    <div className="text-[20px] cursor-default w-fit text-[white] font-[600] border-1 px-[12px] py-[6px] rounded-[8px] border-[var(--active-color)] bg-[var(--active-color)]">
                                                        {t('checkoutModal7')}
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="text-[20px] w-fit hover:text-[white] font-[600] border-1 border-[var(--border-color)] px-[12px] py-[6px] rounded-[8px] hover:border-[var(--active-color)] hover:bg-[var(--active-color)]"
                                                        onClick={() => {
                                                            setIsEditing({ action: "", state: false });
                                                            setData({ id: 0, receiver: "", address: "", phonenumber: "" });
                                                            handleDefaultAddress();
                                                        }}
                                                    >
                                                        {t('checkoutModal8')}
                                                    </button>
                                                ))
                                            }
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Nút cố định dưới */}
                            <div className="pt-4 border-t border-[var(--border-color)] flex justify-between">
                                <button
                                    className="text-[20px] hover:text-[white] font-[600] border-1 border-[var(--border-color)] px-[12px] py-[6px] rounded-[8px] hover:border-[var(--active-color)] hover:bg-[var(--active-color)]"
                                    onClick={() => {
                                        setIsEditing({ action: "edit", state: true })
                                        setData({ id: 0, receiver: "", address: "", phonenumber: "" });
                                        setErr(false)

                                    }
                                    }
                                >
                                    {t('checkoutModal9')}
                                </button>
                                <button
                                    className="text-[20px] hover:text-[white] font-[600] border-1 border-[var(--border-color)] px-[12px] py-[6px] rounded-[8px] hover:border-[var(--active-color)] hover:bg-[var(--active-color)]"
                                    onClick={() => {
                                        setData({ id: 0, receiver: "", address: "", phonenumber: "" });
                                        setIsEditing({ action: "", state: false });
                                        setDefaultAddress(shippingInfor);
                                        setShowModal(false);
                                        setIsLoading(true)
                                    }}
                                >
                                    {t('checkoutModal10')}
                                </button>
                            </div>
                        </div>
                    </div>
                }
            </div>


        </>
    )
}

export default CheckOut
