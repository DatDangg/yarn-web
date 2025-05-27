import { Table, TableProps } from "antd"
import PageBanner from "../../components/ui/PageBanner"
import { useTranslation } from "react-i18next"
import { useAppDispatch, useAppSelector } from "../../hooks/useStore"
import { useEffect, useMemo, useState, useCallback } from "react"
import axios from "axios"
import { removeFromCart, updateQuantity } from "../../store/slice/cartSlice"
import useDebounce from "../../hooks/useDebounce"
import { useNavigate } from "react-router-dom"
import { ProductProps } from "../../interfaces/product"

interface DataType {
    key: string
    name: string
    image: string
    price: number
    discount?: number
    quantity: number
    total: number
}

function Cart() {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const API = process.env.REACT_APP_API_URL

    const cartItems = useAppSelector(state => state.cart.items)
    const [products, setProducts] = useState<ProductProps[]>([])
    const [localQuantities, setLocalQuantities] = useState<Record<number, number>>({})
    const [couponCode, setCouponCode] = useState('')
    const [couponDiscount, setCouponDiscount] = useState(0)
    const [couponErr, setCouponErr] = useState('')

    const debouncedQuantities = useDebounce(localQuantities, 500)

    const fetchProducts = useCallback(async () => {
        try {
            const productResponses = await Promise.all(
                cartItems.map(item => axios.get(`${API}/product?id=${item.product_id}`))
            )
            setProducts(productResponses.map(res => res.data[0]))
        } catch (err) {
            console.error("Fetch products error:", err)
        }
    }, [cartItems, API])

    useEffect(() => { fetchProducts() }, [fetchProducts])

    useEffect(() => {
        for (const [id, qty] of Object.entries(debouncedQuantities)) {
            const item = cartItems.find(i => i.id === Number(id))
            const product = products.find(p => p.id === item?.product_id)
            if (!item || !product) continue

            const safeQty = Math.max(1, Math.min(qty, product.stock))
            if (safeQty !== item.quantity) {
                dispatch(updateQuantity({ id: Number(item.id), quantity: safeQty }))
            }
        }
    }, [debouncedQuantities, cartItems, products, dispatch])

    const data: DataType[] = useMemo(() =>
        cartItems.map((item, index) => {
            const product = products.find(p => p.id === item.product_id)
            if (!product) return null

            const discount = product.discount ?? 0
            const discountedPrice = product.price * (1 - discount / 100)
            const total = Math.round(discountedPrice * item.quantity)

            return {
                key: `${index}`,
                name: product.name,
                image: product.image[0],
                price: product.price,
                discount,
                quantity: item.quantity,
                total
            }
        }).filter(Boolean) as DataType[]
    , [cartItems, products])

    const grandTotal = useMemo(() => data.reduce((sum, item) => sum + item.total, 0), [data])
    const shippingCharge = 40000
    const totalPayment = grandTotal + shippingCharge - couponDiscount

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

    const columns: TableProps<DataType>['columns'] = useMemo(() => [
        {
            title: t("table1"),
            dataIndex: 'name',
            key: 'name',
            render: (name, _, index) => {
                const image = data[index]?.image
                return (
                    <div className="flex items-center">
                        <img src={image} className="rounded-[5px] w-[100px] h-[100px] pr-[10px]" alt="product" />
                        <span className="uppercase text-[18px]">{name}</span>
                    </div>
                )
            }
        },
        {
            title: t("table2"),
            dataIndex: 'price',
            key: 'price',
            render: price => <span className="text-[18px] font-[600]">{price.toLocaleString()}₫</span>,
        },
        {
            title: t("table3"),
            dataIndex: 'discount',
            key: 'discount',
            render: discount => <span className="text-[18px]">{discount ? `${discount}%` : '0%'}</span>,
        },
        {
            title: t("table4"),
            dataIndex: 'quantity',
            key: 'quantity',
            render: (_, __, index) => {
                const item = cartItems[index]
                const productQuantity = products[index]?.stock ?? 1
                const localValue = localQuantities[item.id!] ?? item.quantity

                const handleQtyChange = (val: number) => {
                    if (val >= 1 && val <= productQuantity) {
                        setLocalQuantities(prev => ({ ...prev, [item.id!]: val }))
                    }
                }

                return (
                    <div className="flex items-center gap-2">
                        <button
                            className={`bg-[#f6f6f6] ${item.quantity > 1 ? 'cursor-pointer hover:text-[var(--primary2-color)]' : 'hover:cursor-not-allowed'} text-[16px] w-[40px] h-[40px] flex items-center justify-center`}
                            onClick={() => handleQtyChange(item.quantity - 1)}
                        >
                            <i className="fa-solid fa-minus"></i>
                        </button>
                        <input
                            className="w-[40px] h-[40px] text-[16px] bg-[#f6f6f6] text-center font-[600] outline-[var(--outline-color)]"
                            type="number"
                            min={1}
                            value={localValue}
                            onChange={e => {
                                const val = parseInt(e.target.value)
                                if (!isNaN(val)) handleQtyChange(val)
                            }}
                        />
                        <button
                            className={`bg-[#f6f6f6] ${item.quantity < productQuantity ? 'cursor-pointer hover:text-[var(--primary2-color)]' : 'hover:cursor-not-allowed'} text-[16px] w-[40px] h-[40px] flex items-center justify-center`}
                            onClick={() => handleQtyChange(item.quantity + 1)}
                        >
                            <i className="fa-solid fa-plus"></i>
                        </button>
                    </div>
                )
            }
        },
        {
            title: t("table5"),
            dataIndex: 'total',
            key: 'total',
            render: total => <span className="text-[18px]">{total.toLocaleString()}₫</span>,
        },
        {
            title: t("table6"),
            key: 'action',
            render: (_, __, index) => {
                const item = cartItems[index]
                return (
                    <button
                        onClick={() => dispatch(removeFromCart(item.id!))}
                        className="bg-[#f6f6f6] hover:text-[var(--primary2-color)] text-[16px] w-[40px] h-[40px] flex items-center justify-center"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                )
            }
        }
    ], [cartItems, products, localQuantities, dispatch, t, data])

    return (
        <div className="mb-[24px] mt-[100px]">
            <PageBanner name="Cart" />
            <div className="relative pt-[28px]">
                <img className="absolute" src='/line.png' />
                <img className="absolute" src='/line1.png' />
            </div>
            <div className="container mt-[24px]">
                <div className="row mb-[48px] mx-0">
                    <div className="col-lg-12 shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
                        <Table<DataType>
                            columns={columns}
                            dataSource={data}
                            pagination={false}
                        />
                    </div>
                </div>
                <div className="row gx-5 mb-[48px]">
                    <div className="col-lg-6 ">
                        <div className="shadow-[0_7px_29px_0_rgba(100,100,111,0.2)] h-full p-[40px] flex flex-col">
                            <div className="uppercase font-[700] text-[20px]">{t('discount')}</div>
                            <div className="w-[80px] border-1 border-[--border-color]"></div>
                            <div className="text-[var(--text-color)] pb-[7px] mt-[10px] font-[500] text-[16px] mb-[6px]">{t('discountDesc')}</div>
                            <input
                                className="bg-[#eeeeee] px-[14px] py-[8px] outline-none text-[16px]"
                                value={couponCode}
                                onChange={e => setCouponCode(e.target.value)}
                                placeholder={t('discountPlaceholder')}
                            />
                            <div className="text-red-500 mt-[5px] h-[20px]">
                                {couponErr ? couponErr : <span className="invisible">error placeholder</span>}
                            </div>

                            <button
                                className="mt-[20px] w-fit px-[24px] py-[6px] rounded-[5px] hover:bg-[var(--primary2-color)] hover:text-white font-[600] border-1 border-[var(--border-color)]"
                                onClick={handleCouponSubmit}
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="shadow-[0_7px_29px_0_rgba(100,100,111,0.2)] h-full p-[40px] flex flex-col">
                            <div className="uppercase font-[700] text-[20px]">{t('payment')}</div>
                            <div className="w-[80px] border-1 border-[--border-color]"></div>
                            <div className="mt-[10px] text-[18px]">
                                <div className="flex justify-between py-[6px] px-[20px]">
                                    <div>{t("payment1")}</div>
                                    <div>{grandTotal.toLocaleString()}₫</div>
                                </div>
                                <div className="w-full h-[1px] border-1 border-[--border-color] my-[5px]"></div>
                                <div className="flex justify-between py-[6px] px-[20px]">
                                    <div>{t("payment2")}</div>
                                    <div>{(shippingCharge).toLocaleString()}₫</div>
                                </div>
                                <div className="w-full h-[1px] border-1 border-[--border-color] my-[5px]"></div>
                                <div className="flex justify-between py-[6px] px-[20px]">
                                    <div>{t("payment3")}</div>
                                    <div className=" text-red-500"> -{' '}{(couponDiscount).toLocaleString()}₫</div>
                                </div>
                                <div className="w-full h-[1px] border-1 border-[--border-color] my-[5px]"></div>
                                <div className="flex justify-between py-[6px] px-[20px] flex items-center">
                                    <div>{t("payment4")}</div>
                                    <div className="text-[var(--primary2-color)] font-[700] text-[24px]">{totalPayment.toLocaleString()}₫</div>
                                </div>
                            </div>
                            <div className="mt-[18px]">
                                <button 
                                    className="text-[18px] font-[600] rounded-[5px] border-1 border-[var(--border-color)] w-fit px-[18px] py-[6px] float-right hover:border-[var(--primary2-color)] hover:text-[white] hover:bg-[var(--primary2-color)]"
                                    onClick={() => navigate('/')}
                                >
                                    {t("checkout")}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Cart
