import PageBanner from "../../components/ui/PageBanner"
import { useTranslation } from "react-i18next"
import { useEffect, useMemo, useState, useCallback } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { ProductProps } from "../../interfaces/product"
import { useAuth } from "../../contexts/AuthContext"
import { useDistanceCalculator } from "../../components/useDistanceCalculator"
import { Shipping } from "../../interfaces/user"
import { formatDate_ } from "../../utils/formatDate"
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from "../../hooks/useStore"
import formatPrice from "../../utils/formatPrice"
import { removeFromCart } from "../../store/slice/cartSlice"


interface SelectedProduct {
    product_id: number,
    quantity: number,
    price?: number
    discount?: number
}

interface Payment {
    totalPrice: number,
    shippingFee: number,
    couponDiscount: number
    status: string,
}

export interface Order {
    id?: number,
    products: SelectedProduct[],
    user_id: number,
    order_status: 'Pending' | 'Shipping' | 'Delivered' | 'Canceled',
    created_at: string,
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
    const [shippingInfor, setShippingInfor] = useState<Shipping>({ id: user?.id!, receiver: user?.fullname!, phonenumber: user?.phonenumber!, address: user?.address! })
    const [showModal, setShowModal] = useState(false)
    const [isEditing, setIsEditing] = useState({ action: "", state: false })
    const [data, setData] = useState({ id: 0, receiver: "", phonenumber: '', address: "" })
    const [defaultAddress, setDefaultAddress] = useState<Shipping>()
    const { distance } = useDistanceCalculator("Đại Lan, Duyên Hà, Thanh Trì, Hà Nội", defaultAddress?.address!);
    const grandTotal = useMemo(() => products.reduce((sum, item) => (sum + item.price * (item.discount ? (1 - item.discount / 100) : 1) * (item.quantity || 1)), 0), [products])
    const totalPayment = grandTotal + shippingCharge - couponDiscount
    const bankInfor = {
        acc: 4220112003,
        bank: "MBBank"
    }
    const cartItems = useAppSelector(state => state.cart.items)
    const [activeMethod, setActiveMethod] = useState<string | null>(null);
    const [cardInfo, setCardInfo] = useState({
        cardNumber: "",
        cardHolder: "",
        expiry: "",
        cvv: "",
    });
    const transactionRef = `CR${uuidv4()}`;

    const fetchData = async () => {
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
        axios.patch(`${API}/userinfor/${user?.id}`, {
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
            await axios.patch(`${API}/userinfor/${user.id}`, {
                shipping_infor: newShippingInfor
            });

            update();
        } catch (error) {
            console.error("Failed to add new shipping address:", error);
        }
    };

    const handleDefaultAddress = async (value: number) => {
        const newInfor = user?.shippingInfor.map(value => {
            if (value.state === "default") return { ...value, state: "" };
            else if (value.id === data.id) return { ...value, state: "default" };
            else return value
        })
        axios.patch(`${API}/userinfor/${user?.id}`, {
            shipping_infor: newInfor
        })
            .then(() => {
                update()
            })
            .catch(err => console.log(err))
    }

    const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCardInfo(prev => ({ ...prev, [name]: value }));
    };

    const paymentMethods = [
        {
            id: "qr",
            label: "QR Code",
            content: (
                <div className="flex justify-center flex-col items-center">
                    <div className="mb-[10px] text-md">Quét mã QR để thanh toán</div>
                    <img
                        src={`https://qr.sepay.vn/img?acc=${bankInfor.acc}&bank=${bankInfor.bank}&amount=${totalPayment}&des=CROCHET${transactionRef}`}
                        alt="QR Code"
                        className="w-[200px] h-[200px]"
                    />
                    <button
                        type="submit"
                        className="font-[600] mt-[10px] bg-[var(--primary2-color)] hover:bg-[var(--active-color)] text-white py-[10px] w-full rounded"
                        onClick={() => paymentCheck()}
                    >
                        Hoàn tất thanh toán
                    </button>
                </div>
            )
        },
        {
            id: "cod",
            label: "Thanh toán khi nhận hàng (COD)",
            content: (
                <div>
                    <p className="mb-[10px]">Bạn sẽ thanh toán bằng tiền mặt khi nhận hàng.</p>

                    <button
                        className="mt-[20px] w-full bg-[var(--primary2-color)] text-white py-[10px] rounded"
                        onClick={() => handlePayment()}
                    >
                        Xác nhận thanh toán
                    </button>
                </div>

            )
        },
        {
            id: "card",
            label: "Thẻ tín dụng/Ghi nợ",
            content: (
                <form className="flex flex-col gap-[12px]" onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
                    <div>
                        <label className="block text-sm font-medium mb-[4px]">Số thẻ</label>
                        <input
                            type="text"
                            name="cardNumber"
                            value={cardInfo.cardNumber}
                            onChange={handleCardChange}
                            className="border p-[8px] w-full rounded"
                            placeholder="•••• •••• •••• ••••"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-[4px]">Tên chủ thẻ</label>
                        <input
                            type="text"
                            name="cardHolder"
                            value={cardInfo.cardHolder}
                            onChange={handleCardChange}
                            className="border p-[8px] w-full rounded"
                            placeholder="Nguyễn Văn A"
                        />
                    </div>
                    <div className="flex gap-[12px]">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-[4px]">Ngày hết hạn</label>
                            <input
                                type="text"
                                name="expiry"
                                value={cardInfo.expiry}
                                onChange={handleCardChange}
                                className="border p-[8px] w-full rounded"
                                placeholder="MM/YY"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-[4px]">CVV</label>
                            <input
                                type="password"
                                name="cvv"
                                value={cardInfo.cvv}
                                onChange={handleCardChange}
                                className="border p-[8px] w-full rounded"
                                placeholder="•••"
                            />
                        </div>
                    </div>

                    <button type="submit" className="font-[600] mt-[10px] bg-[var(--primary2-color)] text-white py-[10px] rounded">
                        Thanh toán
                    </button>
                </form>

            )
        },
    ];

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
                status: activeMethod === 'cod' ? "Unpaid" : "Paid"
            }

            console.log(activeMethod)

            const newOrder: Order = {
                products: orderProducts,
                user_id: user?.id!,
                order_status: "Pending",
                created_at: new Date().toISOString(),
                payment,
                address: defaultAddress!
            }
            console.log(newOrder)

            await axios.post(`${API}/order`, { ...newOrder })

            await Promise.all(
                order.map(item => dispatch(removeFromCart(item[0].id!)))
            )
            navigate("/cart")
        } catch (err) {
            console.log(err)
        }
    }

    return (
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
                            <div className="uppercase font-[700] text-[20px]">Shipping Address</div>
                            <div
                                className="font-[600] text-[18px] text-[var(--text-color)] cursor-pointer hover:text-[var(--active-color)]"
                                onClick={() => setShowModal(true)}
                            >
                                Edit
                            </div>
                        </div>
                        <div className="w-[80px] border-1 border-[--border-color] mb-[7px]"></div>
                        <div className="w-full mb-[7px] text-[20px]">
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
                                    <th className="pb-2">Name</th>
                                    <th className="pb-2">Quantity</th>
                                    <th className="pb-2">Price</th>
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
                                        placeholder={t('discountPlaceholder')}
                                    />
                                    <button
                                        className="absolute right-[15px] top-[8px] font-[600] hover:text-[var(--active-color)] flex items-center justify-center"
                                        onClick={handleCouponSubmit}
                                    >
                                        <i className="fa-solid fa-ticket rotate-45 mr-[2px] text-[12px]"></i>
                                        Apply
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
                                        <div>{shippingCharge > 0 ? formatPrice(shippingCharge): 0}</div>
                                    </div>
                                    <div className="w-full h-[1px] border-1 border-[--border-color] my-[5px]"></div>
                                    <div className="flex justify-between py-[6px] px-[20px]">
                                        <div>{t("payment3")}</div>
                                        <div className=" text-red-500"> -{' '}{formatPrice(couponDiscount)}</div>
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
                    <div className="col-lg-5 offset-lg-1 shadow-[0_7px_29px_0_rgba(100,100,111,0.2)] pt-[24px] pb-[20px] px-[20px]">
                        <div className="flex flex-col gap-[12px]">
                            {paymentMethods.map((method) => (
                                <div key={method.id}>
                                    <div
                                        className="cursor-pointer font-[600] text-[18px] hover:text-[var(--primary2-color)]"
                                        onClick={() => setActiveMethod(activeMethod === method.id ? null : method.id)}
                                    >
                                        {method.label}
                                    </div>
                                    {activeMethod === method.id && (
                                        <div className="mt-[8px] p-[10px] border border-[--border-color] rounded bg-[#f9f9f9] text-[16px]">
                                            {method.content}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {
                showModal &&
                <div className="fixed inset-0 z-[25] flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowModal(false)}>
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] h-[600px] overflow-y-scroll max-w-[800px] relative" onClick={(e) => e.stopPropagation()}>
                        <i className="fa-solid fa-xmark absolute right-[14px] top-[12px] hover:scale-125 cursor-pointer text-[20px]" onClick={() => setShowModal(false)}></i>
                        <div className={`${isEditing.state ? `flex w-full gap-[20px]` : ``}`}>
                            <div className="flex-1">
                                {user?.shippingInfor && user.shippingInfor.map(data => (
                                    <div key={data.id}>
                                        <label htmlFor={`address-${data.id}`} className="block flex">
                                            <input
                                                type="radio"
                                                id={`address-${data.id}`}
                                                name="selectedAddress"
                                                value={data.id}
                                                checked={shippingInfor.id === data.id}
                                                onChange={() => setShippingInfor(
                                                    { id: data?.id!, receiver: data?.receiver!, phonenumber: data?.phonenumber!, address: data?.address! }
                                                )}
                                                className="mr-3 scale-[2]"
                                            />
                                            <div className="text-[20px] w-full p-[20px] my-[18px] border-1 border-[var(--border-color)] rounded-[8px] flex items-center justify-between">
                                                <div>
                                                    <div>{data.receiver}</div>
                                                    <div>{data.phonenumber}</div>
                                                    <div>{data.address}</div>
                                                </div>
                                                <div>
                                                    <i
                                                        className="fa-solid fa-pen text-[20px] hover:text-[var(--active-color)] cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setIsEditing({ action: "update", state: true });
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
                            {isEditing.state &&
                                <div className="flex-1 text-[20px] p-[20px] my-[18px] border-1 border-[var(--border-color)] flex flex-col rounded-[8px] relative">
                                    <i
                                        className="fa-solid fa-xmark absolute right-[14px] top-[12px] hover:scale-125 cursor-pointer text-[20px]"
                                        onClick={() => setIsEditing({ action: "", state: false })}
                                    ></i>
                                    <label htmlFor="Fullname">Fullname</label>
                                    <input
                                        value={data.receiver}
                                        onChange={(e) => setData(prev => ({ ...prev, receiver: e.target.value }))}
                                        id="Fullname"
                                        className="border-2 border-[var(--border-color)] mb-[12px] px-[12px] py-[6px] outline-none rounded-[8px] focus:border-[var(--active-color)]"></input>
                                    <label htmlFor="Phone">Phone</label>
                                    <input
                                        value={data.phonenumber}
                                        onChange={(e) => setData(prev => ({ ...prev, phonenumber: e.target.value }))}
                                        id="Phone"
                                        className="border-2 border-[var(--border-color)] mb-[12px] px-[12px] py-[6px] outline-none rounded-[8px] focus:border-[var(--active-color)]"></input>
                                    <label htmlFor="Address">Address</label>
                                    <input
                                        value={data.address}
                                        onChange={(e) => setData(prev => ({ ...prev, address: e.target.value }))}
                                        id="Address"
                                        className="border-2 border-[var(--border-color)] mb-[12px] px-[12px] py-[6px] outline-none rounded-[8px] focus:border-[var(--active-color)]"></input>
                                    <div className="flex justify-between">
                                        {isEditing.action === "update" &&
                                            <button
                                                className="text-[20px] mt-[12px] w-fit hover:text-[white] font-[600] border-1 border-[var(--border-color)] px-[12px] py-[6px] rounded-[8px] hover:border-[var(--active-color)] hover:bg-[var(--active-color)]"
                                                onClick={() => {
                                                    setIsEditing({ action: "", state: false })
                                                    setData({
                                                        id: 0,
                                                        receiver: '',
                                                        address: '',
                                                        phonenumber: ''
                                                    })
                                                    handleUpdateAddress()
                                                }}
                                            >
                                                Sửa
                                            </button>
                                        }

                                        {isEditing.action === "edit" &&
                                            <button
                                                className="text-[20px] mt-[12px] w-fit hover:text-[white] font-[600] border-1 border-[var(--border-color)] px-[12px] py-[6px] rounded-[8px] hover:border-[var(--active-color)] hover:bg-[var(--active-color)]"
                                                onClick={() => {
                                                    setIsEditing({ action: "", state: false })
                                                    setData({
                                                        id: 0,
                                                        receiver: '',
                                                        address: '',
                                                        phonenumber: ''
                                                    })
                                                    handleAddAddress()
                                                }}
                                            >
                                                Thêm
                                            </button>
                                        }
                                        {defaultAddress?.id === data.id ?
                                            <div
                                                className="text-[20px] mt-[12px] cursor-default w-fit text-[white] font-[600] border-1 px-[12px] py-[6px] rounded-[8px] border-[var(--active-color)] bg-[var(--active-color)]"
                                            >
                                                Mặc định
                                            </div>
                                            :
                                            <button
                                                className="text-[20px] mt-[12px] w-fit hover:text-[white] font-[600] border-1 border-[var(--border-color)] px-[12px] py-[6px] rounded-[8px] hover:border-[var(--active-color)] hover:bg-[var(--active-color)]"
                                                onClick={() => {
                                                    setIsEditing({ action: "", state: false })
                                                    setData({
                                                        id: 0,
                                                        receiver: '',
                                                        address: '',
                                                        phonenumber: ''
                                                    })
                                                    handleDefaultAddress(data.id)
                                                }}
                                            >
                                                Đặt làm mặc định
                                            </button>
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="flex justify-between">
                            <button
                                className="text-[20px] hover:text-[white] font-[600] border-1 border-[var(--border-color)] px-[12px] py-[6px] rounded-[8px] hover:border-[var(--active-color)] hover:bg-[var(--active-color)]"
                                onClick={() => setIsEditing({ action: "edit", state: true })}
                            >
                                Thêm địa chỉ
                            </button>
                            <button
                                className="text-[20px] hover:text-[white] font-[600] border-1 border-[var(--border-color)] px-[12px] py-[6px] rounded-[8px] hover:border-[var(--active-color)] hover:bg-[var(--active-color)]"
                                onClick={() => {
                                    setDefaultAddress(shippingInfor)
                                    setShowModal(false)
                                }}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div >
    )
}

export default CheckOut
