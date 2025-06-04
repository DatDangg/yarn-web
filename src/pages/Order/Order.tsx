import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Space, Spin, message, Modal } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import formatPrice from '../../utils/formatPrice';
import { useAuth } from '../../contexts/AuthContext';
import { Order } from '../Cart/CheckOut';

const API = process.env.REACT_APP_API_URL

const getTotalItems = (products: any) => {
    return products.reduce((sum: any, p: { quantity: any; }) => sum + p.quantity, 0);
};



const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth()
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleView = (order: React.SetStateAction<Order | null>) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
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
            render: (status: string) => {
                let color = 'blue';
                if (status === 'Pending') color = 'orange';
                else if (status === 'Shipping') color = 'blue';
                else if (status === 'Delivered') color = 'green';
                else if (status === 'Canceled') color = 'red';
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
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
                open={isModalOpen}
                onCancel={handleCloseModal}
                footer={null}
                title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
            >
                {selectedOrder && (
                    <div className="space-y-2">
                        <p><strong>Người nhận:</strong> {selectedOrder.address.receiver}</p>
                        <p><strong>SĐT:</strong> {selectedOrder.address.phonenumber}</p>
                        <p><strong>Địa chỉ:</strong> {selectedOrder.address.address}</p>
                        <p><strong>Ngày tạo:</strong> {dayjs(selectedOrder.created_at).format('DD-MM-YYYY')}</p>
                        <p><strong>Trạng thái:</strong> {selectedOrder.order_status}</p>
                        <p><strong>Thanh toán:</strong> {selectedOrder.payment.status}</p>
                        <p><strong>Tổng tiền:</strong> {formatPrice(selectedOrder.payment.totalPrice)}</p>
                        <div>
                            <strong>Sản phẩm:</strong>
                            <ul className="list-disc pl-5">
                                {selectedOrder.products.map((p, index) => (
                                    <li key={index}>
                                        ID SP: {p.product_id} - SL: {p.quantity} - Giá: {formatPrice(p.price!)} - Giảm: {p.discount}%
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Orders;
