import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Space, Spin, message, Modal } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import formatPrice from '../../utils/formatPrice';
import { useAuth } from '../../contexts/AuthContext';
import { Order } from '../Cart/CheckOut';
import { formatDateTime_ } from '../../utils/formatDateTime';
import { ProductProps } from '../../interfaces/product';
import { useTranslation } from 'react-i18next';

const API = process.env.REACT_APP_API_URL

const getTotalItems = (products: any) => {
    return products.reduce((sum: any, p: { quantity: any; }) => sum + p.quantity, 0);
};

const getStatusTag = (status: string) => {
    let color = 'blue';
    if (status === 'Pending') color = 'orange';
    else if (status === 'Shipping') color = 'blue';
    else if (status === 'Delivered') color = 'green';
    else if (status === 'Canceled') color = 'red';

    return <Tag color={color} className='font-[500]'>{status.toUpperCase()}</Tag>;
};

const Orders = () => {
    const { t } = useTranslation()
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth()
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [products, setProducts] = useState<ProductProps[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [step, setStep] = useState<number>(1)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API}/order?user_id=${user?.id}`);
                setOrders(res.data || []);
            } catch (err) {
                message.error('Không thể tải đơn hàng.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const fetchData = async () => {
        try {
            const productResponses = await Promise.all(
                (selectedOrder?.products ?? []).map(item =>
                    axios.get(`${API}/product?id=${item.product_id}`)
                )
            );

            const product_ = productResponses.map((res, idx) => {
                const product = res.data[0];
                const quantity = selectedOrder?.products[idx]?.quantity;
                return { ...product, quantity };
            });
            setProducts(product_);
        } catch (err) {
            console.log(err);
        }
    };

    const handleView = (order: Order | null) => {
        setSelectedOrder(order);
        if (order?.order_status === 'Pending' && order?.payment.status === 'Unpaid') setStep(0)
        if (order?.order_status === 'Pending' && order?.payment.status === 'Paid') setStep(1)
        if (order?.order_status === "Shipping") setStep(2)
        if (order?.order_status === "Delivered") setStep(3)
        setIsModalOpen(true);
    };

    useEffect(() => {
        if (selectedOrder) {
            fetchData();
        }
    }, [selectedOrder]);

    const handleCloseModal = () => {
        setSelectedOrder(null);
        setProducts([])
        setIsModalOpen(false);
    };

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date: string | number | Date | dayjs.Dayjs | null | undefined) => dayjs(date).format('DD-MM-YYYY'),
        },
        {
            title: 'Items',
            dataIndex: 'products',
            key: 'items',
            render: (products: any) => getTotalItems(products),
        },
        {
            title: 'Total',
            dataIndex: ['payment', 'totalPrice'],
            key: 'total',
            render: (total: number) => formatPrice(total),
        },
        {
            title: 'Status',
            dataIndex: 'order_status',
            key: 'status',
            render: (status: string) =>
                getStatusTag(status)
            ,
        },
        {
            title: 'Payment',
            dataIndex: ['payment', 'status'],
            key: 'payment',
            render: (status: string) => (
                <Tag color={status === 'Paid' ? 'green' : 'volcano'}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <Space>
                    <Button type="link" onClick={() => handleView(record)}>View</Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="mb-[24px]">
            <div className="container">
                <Spin spinning={loading}>
                    <Table columns={columns} dataSource={orders} rowKey="id" />
                </Spin>
            </div>
            <Modal
                width={800}
                open={isModalOpen}
                onCancel={handleCloseModal}
                footer={null}
                centered

                bodyStyle={{
                    maxHeight: '80vh',
                    overflowY: 'auto',
                }}
            >
                {selectedOrder && (
                    <div className="space-y-2 p-[12px]">
                        <div className='flex items-center'>
                            <p className='text-[18px]'><strong>Chi tiết đơn hàng #{selectedOrder?.id} </strong></p>
                            <p className='ml-[10px]'>{getStatusTag(selectedOrder.order_status)}</p>
                        </div>

                        <div className='flex justify-start items-center relative'>
                            <div className={`
                            absolute z-10 top-[25px] transform -translate-y-1/2 h-[3px] left-[70px]
                            ${step === 3 && `w-[80%]`}
                            ${step === 2 && `w-[50%]`}
                            ${step === 1 && `w-[25%]`}
                            `}
                                style={{
                                    backgroundColor: `var(--active-color)`
                                }}
                            ></div>

                            <div className='absolute z-0 top-[25px] transform w-[80%] left-[70px] bg-[#ccc] -translate-y-1/2 h-[3px]'></div>

                            <div className='flex flex-col items-center flex-[0_0_25%]'>
                                <div className='relative z-10  w-[50px] h-[50px] border-[3px] border-[var(--active-color)] bg-[var(--active-color)] rounded-[50%] text-white flex justify-center items-center'>
                                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="5" y="4" width="14" height="17" rx="2" stroke="#fff" strokeWidth="2" />
                                        <path d="M9 9H15" stroke="#fff" strokeLinecap="round" strokeWidth="2" />
                                        <path d="M9 13H15" stroke="#fff" strokeLinecap="round" strokeWidth="2" />
                                        <path d="M9 17H13" stroke="#fff" strokeLinecap="round" strokeWidth="2" />
                                    </svg>
                                </div>
                                <span className='uppercase font-[600] mt-[10px]'>Order comfirmed</span>
                                <span className='text-[var(--text-color)]'>{formatDateTime_(selectedOrder.created_at)}</span>
                            </div>

                            {selectedOrder.payment.status === 'Paid' ?
                                <div className='flex flex-col items-center flex-[0_0_25%]'>
                                    <div className={`relative z-10 ${step > 0 ? 'bg-[var(--active-color)]' : 'bg-white'} w-[50px] h-[50px] border-[3px] border-[var(--active-color)] rounded-[50%] text-white flex justify-center items-center`}>
                                        <svg fill={`${step > 0 ? 'white' : 'var(--active-color)'}`} width="30" height="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 209.869 209.869">
                                            <path d="M186.143 37.684H47.186c-13.084 0-23.726 9.734-23.726 21.7v1.902C10.5 61.421 0 71.091 0 82.973v67.511c0 11.966 10.644 21.7 23.726 21.7h138.957c13.082 0 23.726-9.734 23.726-21.7v-1.902c12.957-.132 23.46-9.802 23.46-21.687V59.385c.003-11.966-10.644-21.701-23.726-21.701zM171.195 150.484c0 3.515-3.896 6.482-8.509 6.482H23.729c-4.613 0-8.509-2.967-8.509-6.482v-67.51c0-3.513 3.898-6.482 8.509-6.482h138.957c4.613 0 8.509 2.97 8.509 6.482v67.51zM186.412 133.356V82.973c0-11.966-10.644-21.7-23.726-21.7H38.677v-1.889c0-3.513 3.898-6.482 8.509-6.482h138.957c4.613 0 8.509 2.97 8.509 6.482v67.511c.002 3.944-3.748 6.847-8.24 6.961z" />
                                            <path d="M93.479 111.028c-6.404-.763-9.655-1.676-9.655-4.558 0-4.464 6.462-4.946 9.242-4.946 4.091 0 8.615 1.978 10.089 4.41l.586.971 9.346-4.324-.571-1.164c-3.289-6.718-9.12-8.747-13.622-9.572V85.9H87.962v5.914c-9.627 1.499-15.336 6.921-15.336 14.654 0 12.724 11.935 14.058 19.825 14.943 7.172.847 10.515 2.569 10.515 5.417 0 5.509-7.781 5.937-10.168 5.937-5.351 0-10.505-2.65-11.986-6.168l-.495-1.169-10.14 4.296.5 1.169c2.853 6.68 8.968 10.893 17.282 11.943v6.409H98.89v-6.729c7.979-.984 15.666-6.087 15.666-15.691 0-10.621-12.683-12.184-21.077-13.221z" />
                                        </svg>
                                    </div>
                                    <span className='flex gap-[3px] font-[600] mt-[10px] '><span className='uppercase'>Orders Paid</span> ({formatPrice(selectedOrder.payment.totalPrice)})</span>
                                    <span className='text-[var(--text-color)]'>{formatDateTime_(selectedOrder?.payment.cf_payment_at!)}</span>
                                </div>
                                :
                                <div className='flex flex-col items-center flex-[0_0_25%]'>
                                    <div className={`relative z-10 ${step > 0 ? 'bg-[var(--active-color)]' : 'bg-white'} w-[50px] h-[50px] border-[3px] border-[var(--active-color)] rounded-[50%] text-white flex justify-center items-center`}>
                                        <svg fill={`${step > 0 ? 'white' : 'var(--active-color)'}`} width="30" height="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 209.869 209.869">
                                            <path d="M186.143 37.684H47.186c-13.084 0-23.726 9.734-23.726 21.7v1.902C10.5 61.421 0 71.091 0 82.973v67.511c0 11.966 10.644 21.7 23.726 21.7h138.957c13.082 0 23.726-9.734 23.726-21.7v-1.902c12.957-.132 23.46-9.802 23.46-21.687V59.385c.003-11.966-10.644-21.701-23.726-21.701zM171.195 150.484c0 3.515-3.896 6.482-8.509 6.482H23.729c-4.613 0-8.509-2.967-8.509-6.482v-67.51c0-3.513 3.898-6.482 8.509-6.482h138.957c4.613 0 8.509 2.97 8.509 6.482v67.51zM186.412 133.356V82.973c0-11.966-10.644-21.7-23.726-21.7H38.677v-1.889c0-3.513 3.898-6.482 8.509-6.482h138.957c4.613 0 8.509 2.97 8.509 6.482v67.511c.002 3.944-3.748 6.847-8.24 6.961z" />
                                            <path d="M93.479 111.028c-6.404-.763-9.655-1.676-9.655-4.558 0-4.464 6.462-4.946 9.242-4.946 4.091 0 8.615 1.978 10.089 4.41l.586.971 9.346-4.324-.571-1.164c-3.289-6.718-9.12-8.747-13.622-9.572V85.9H87.962v5.914c-9.627 1.499-15.336 6.921-15.336 14.654 0 12.724 11.935 14.058 19.825 14.943 7.172.847 10.515 2.569 10.515 5.417 0 5.509-7.781 5.937-10.168 5.937-5.351 0-10.505-2.65-11.986-6.168l-.495-1.169-10.14 4.296.5 1.169c2.853 6.68 8.968 10.893 17.282 11.943v6.409H98.89v-6.729c7.979-.984 15.666-6.087 15.666-15.691 0-10.621-12.683-12.184-21.077-13.221z" />
                                        </svg>
                                    </div>
                                    <span className='font-[600] mt-[10px]'>{selectedOrder.payment.cf_payment_at ? `Payment Confirm` : <span className='mt-[10px] invisible'>data</span>}</span>
                                    <span className='text-[var(--text-color)]'>{selectedOrder.payment.cf_payment_at ? formatDateTime_(selectedOrder?.payment.cf_payment_at!) : <span className='invisible'>data</span>}</span>
                                </div>
                            }

                            <div className='flex flex-col items-center flex-[0_0_25%]'>
                                <div className={`relative z-10 ${step > 1 ? 'bg-[var(--active-color)]' : 'bg-white'} w-[50px] h-[50px] border-[3px] border-[var(--active-color)] rounded-[50%] text-white flex justify-center items-center`}>
                                    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M16.5 6H3V17.25H4.5C4.708 18.522 5.803 19.5 7.125 19.5S9.541 18.522 9.723 17.25H15.027C15.209 18.522 16.303 19.5 17.625 19.5S20.041 18.522 20.223 17.25H21.75V12.439L18.311 9H16.5V6ZM16.5 10.5V14.503A3.384 3.384 0 0 1 17.625 14.25C18.672 14.25 19.576 14.863 19.997 15.75H20.25V13.061L17.689 10.5H16.5ZM15 15.75V9V7.5H4.5V15.75H4.753A3.384 3.384 0 0 1 7.125 14.25C8.172 14.25 9.076 14.863 9.497 15.75H15ZM17.625 18A1.125 1.125 0 1 1 18.75 16.875 1.125 1.125 0 0 1 17.625 18ZM8.25 16.875A1.125 1.125 0 1 1 7.125 15.75 1.125 1.125 0 0 1 8.25 16.875Z"
                                            fill={`${step > 1 ? 'white' : 'var(--active-color)'}`} />
                                    </svg>
                                </div>
                                <span className='font-[600] uppercase mt-[10px]'>{selectedOrder.shipping_at ? `Shipping` : <span className='mt-[10px] invisible'>data</span>}</span>
                                <span className='text-[var(--text-color)]'>{selectedOrder.shipping_at ? formatDateTime_(selectedOrder?.shipping_at!) : <span className='invisible'>data</span>}</span>
                            </div>

                            <div className='flex flex-col items-center flex-[0_0_25%]'>
                                <div className={`relative z-10 ${step > 2 ? 'bg-[var(--active-color)]' : 'bg-white'} w-[50px] h-[50px] border-[3px] border-[var(--active-color)] rounded-[50%] text-white flex justify-center items-center`}>
                                    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            stroke={`${step > 2 ? 'white' : 'var(--active-color)'}`}
                                            strokeLinecap="round"
                                            strokeWidth="0.4"
                                            d="M5 14.9968c.4142 0 .75.3358.75.75V18c0 .1381.1119.25.25.25H18c.1381 0 .25-.1119.25-.25v-2.2532c0-.4142.3358-.75.75-.75s.75.3358.75.75V18c0 .9665-.7835 1.75-1.75 1.75H6c-.9665 0-1.75-.7835-1.75-1.75v-2.2532c0-.4142.3358-.75.75-.75z"
                                            fill={`${step > 2 ? 'white' : 'var(--active-color)'}`} />
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            stroke={`${step > 2 ? 'white' : 'var(--active-color)'}`}
                                            strokeLinecap="round"
                                            strokeWidth="0.4"
                                            d="M12.2023 4.25c.4142 0 .75.3358.75.75v8.0856c0 .4142-.3358.75-.75.75s-.75-.3358-.75-.75V5c0-.4142.3358-.75.75-.75z"
                                            fill={`${step > 2 ? 'white' : 'var(--active-color)'}`} />
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            stroke={`${step > 2 ? 'white' : 'var(--active-color)'}`}
                                            strokeLinecap="round"
                                            strokeWidth="0.4"
                                            d="M8.3218 10.6256c.2895-.2963.7644-.3019 1.0606-.0124l2.8196 2.7548 2.8198-2.7548c.2962-.2895.7711-.2839 1.0606.0124.2895.2962.284 0.7711-.0123 1.0605l-3.3439 3.2669c-.2915.2847-.7569.2847-1.0484 0l-3.3438-3.2669c-.2963-.2894-.3019-.7643-.0124-1.0605z"
                                            fill={`${step > 2 ? 'white' : 'var(--active-color)'}`} />
                                    </svg>
                                </div>
                                <span className='font-[600] uppercase mt-[10px]'>{selectedOrder.finished_at ? `Delivered` : <span className='invisible mt-[10px]'>data</span>}</span>
                                <span className='text-[var(--text-color)]'>{selectedOrder.finished_at ? formatDateTime_(selectedOrder.finished_at!) : <span className='invisible'>data</span>}</span>
                            </div>
                        </div>

                        <div className='flex justify-between pt-[18px]'>
                            <div>
                                <div className='text-[16px] ml-[3px]'>Người nhận</div>
                                <div className='text-[16px] mt-[4px] rounded-[8px] font-[600] w-[200px] border-1 border-[var(--border-color)] px-[12px] py-[6px]'>{selectedOrder.address.receiver}</div>
                            </div>
                            <div>
                                <div className='text-[16px] ml-[3px]'>SĐT</div>
                                <div className='text-[16px] mt-[4px] rounded-[8px] font-[600] w-[200px] border-1 border-[var(--border-color)] px-[12px] py-[6px]'>{selectedOrder.address.phonenumber}</div>
                            </div>
                            <div>
                                <div className='text-[16px] ml-[3px]'>Thanh toán</div>
                                <div className='text-[16px] mt-[4px] rounded-[8px] font-[600] w-[200px] border-1 border-[var(--border-color)] px-[12px] py-[6px]'>{selectedOrder.payment.status === 'Paid' ? 'Online' : 'Offline'}</div>
                            </div>
                        </div>
                        <div className='flex flex-col w-full pt-[12px]'>
                            <div className='w-fit flex-auto whitespace-nowrap text-[16px] ml-[3px]'>
                                Địa chỉ
                            </div>
                            <div className='text-[16px] mt-[4px] rounded-[8px] font-[600] w-full border-1 border-[var(--border-color)] px-[12px] py-[6px]'>
                                {selectedOrder.address.address}
                            </div>
                        </div>

                        <div className='pt-[18px] text-[16px] font-[600]'>Item Ordered</div>
                        <div className="w-full text-[16px]">
                            <div>
                                {products.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="grid grid-cols-4 gap-4 border-b py-2 items-center"
                                    >
                                        {/* Cột 1: Hình ảnh + Tên sản phẩm */}
                                        <div className="col-span-2 flex items-center">
                                            <img
                                                src={item.image[0]}
                                                alt="product"
                                                className="rounded-[5px] w-[80px] h-[80px] mr-[10px]"
                                            />
                                            <span className="font-[600]">{item.name}</span>
                                        </div>

                                        {/* Cột 2: Số lượng */}
                                        <div className="text-center">
                                            x{item.quantity}
                                        </div>

                                        {/* Cột 3: Giá */}
                                        <div className="flex justify-end">
                                            {formatPrice(
                                                item.discount
                                                    ? item.price * (1 - item.discount / 100) * item.quantity!
                                                    : item.price * item.quantity!
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <div>
                                    <div className="h-full flex flex-col items-end">
                                        <div className="mt-[10px] text-[16px] w-[300px]">
                                            <div className="flex justify-between py-[6px]">
                                                <div>{t("payment1")}</div>
                                                <div>{formatPrice(selectedOrder.payment.totalProduct)}</div>
                                            </div>
                                            <div className="flex justify-between py-[6px]">
                                                <div>{t("payment2")}</div>
                                                <div>{selectedOrder.payment.shippingFee > 0 ? formatPrice(selectedOrder.payment.shippingFee) : <span className='text-[green] font-[600]'>FREE</span>}</div>
                                            </div>
                                            {
                                                selectedOrder.payment.couponDiscount > 0 &&
                                                <div className="flex justify-between py-[6px]">
                                                    <div>{t("payment3")}</div>
                                                    <div>{formatPrice(selectedOrder.payment.couponDiscount)}</div>
                                                </div>
                                            }
                                            <div className="w-full h-[1px] border-1 border-[--border-color] my-[5px]"></div>
                                            <div className="flex justify-between py-[6px] flex items-center text-[var(--primary2-color)] font-[700] text-[18px]">
                                                <div>{t("payment4")}</div>
                                                <div className="">{formatPrice(selectedOrder.payment.totalPrice)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                )
                }
            </Modal >
        </div >
    );
};

export default Orders;
