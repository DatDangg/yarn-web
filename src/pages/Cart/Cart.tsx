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
import formatPrice from "../../utils/formatPrice"

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
    const [selectedProducts, setSelectedProducts] = useState<{ product_id: number; quantity: number }[]>([])

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
            if (safeQty !== Number(item.quantity)) {
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
            const total = Math.round(discountedPrice * Number(item.quantity))

            return {
                key: `${index}`,
                name: product.name,
                image: product.image[0],
                price: product.price,
                discount,
                quantity: Number(item.quantity),
                total
            }
        }).filter(Boolean) as DataType[]
        , [cartItems, products])

    const summary = useMemo(() => {
        return selectedProducts.reduce(
            (acc, selected) => {
                const product = products.find(p => p.id === selected.product_id)
                if (!product) return acc

                const discount = product.discount ?? 0
                const price = product.price * (1 - discount / 100)
                const totalPrice = price * selected.quantity

                return {
                    total: acc.total + totalPrice,
                    quantity: Number(acc.quantity) + Number(selected.quantity),
                }
            },
            { total: 0, quantity: 0 }
        )
    }, [selectedProducts, products])

    const columns: TableProps<DataType>['columns'] = useMemo(() => [
        {
            title: "",
            key: "selection",
            render: (data, __, index,) => {
                const item = cartItems[index]
                const handleChange = () => {
                    setSelectedProducts(prev => {
                        const exists = prev.some(p => p.product_id === item.product_id)
                        if (exists) {
                            return prev.filter(p => p.product_id !== item.product_id)
                        } else {
                            return [...prev, { product_id: item.product_id, quantity: item.quantity }]
                        }
                    })
                }

                return (
                    <input
                        type="checkbox"
                        onChange={handleChange}
                        checked={selectedProducts.some(p => p.product_id === item.product_id)}
                    />
                )
            }
        },
        {
            title: t("table1"),
            dataIndex: 'name',
            key: 'name',
            render: (name, _, index) => {
                const image = data[index]?.image
                return (
                    <div className="flex items-center">
                        <img src={image} className="rounded-[5px] w-[100px] h-[100px] pr-[10px]" alt="product" />
                        <span className="uppercase text-[18px] break-all">{name}</span>
                    </div>
                )
            }
        },
        {
            title: t("table2"),
            dataIndex: 'price',
            key: 'price',
            render: price => <span className="text-[18px] font-[600]">{formatPrice(price)}</span>,
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
                const productStock = products[index]?.stock ?? 1
                const localValue = localQuantities[item.id!] ?? Number(item.quantity)

                const handleQtyChange = (val: string) => {
                    const newQty = val === '0' ? 1 : Math.min(Number(val), productStock)

                    setLocalQuantities(prev => ({ ...prev, [item.id!]: newQty }))

                    // Nếu item đang được chọn, cập nhật lại số lượng trong selectedProducts
                    const isSelected = selectedProducts.some(p => p.product_id === item.product_id)
                    if (isSelected) {
                        setSelectedProducts(prev =>
                            prev.map(p =>
                                p.product_id === item.product_id ? { ...p, quantity: newQty } : p
                            )
                        )
                    }
                }


                return (
                    <div className="flex items-center gap-2">
                        <button
                            className={`bg-[#f6f6f6] ${Number(item.quantity) > 1 ? 'cursor-pointer hover:text-[var(--primary2-color)]' : 'hover:cursor-not-allowed'} text-[16px] w-[40px] h-[40px] flex items-center justify-center`}
                            onClick={() => handleQtyChange(String(Number(item.quantity) - 1))}
                        >
                            <i className="fa-solid fa-minus"></i>
                        </button>
                        <input
                            className="w-[40px] h-[40px] text-[16px] bg-[#f6f6f6] text-center font-[600] outline-[var(--outline-color)]"
                            type="number"
                            value={localValue || ''}
                            onBlur={e => {
                                if (e.target.value === '') handleQtyChange('1')
                            }}
                            onChange={e => handleQtyChange(e.target.value)}
                        />
                        <button
                            className={`bg-[#f6f6f6] ${Number(item.quantity) < productStock ? 'cursor-pointer hover:text-[var(--primary2-color)]' : 'hover:cursor-not-allowed'} text-[16px] w-[40px] h-[40px] flex items-center justify-center`}
                            onClick={() => handleQtyChange(String(Number(item.quantity) + 1))}
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
            render: total => <span className="text-[18px]">{formatPrice(total)}</span>,
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
    ], [cartItems, products, localQuantities, selectedProducts, dispatch, t, data])

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
                    <div className="flex flex-col items-end pt-[24px] gap-2">
                        <div className="text-[18px] font-[600]">
                            Số lượng sản phẩm: {summary.quantity}
                        </div>
                        <div className="text-[18px] font-[600] flex">
                            <span className="mr-[5px]">Tổng cộng:</span> {formatPrice(summary.total)}
                        </div>
                        <button
                            className="text-[18px] font-[600] rounded-[5px] border-1 border-[var(--border-color)] w-fit px-[18px] py-[6px] float-right hover:border-[var(--primary2-color)] hover:text-[white] hover:bg-[var(--primary2-color)]"
                            onClick={() => {
                                navigate('/checkout')
                                localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts))
                            }}
                            disabled={selectedProducts.length === 0}
                        >
                            {t("checkout")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart
