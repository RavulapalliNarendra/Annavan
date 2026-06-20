"use client";

import { useAuth } from "@/contexts/AuthContext";
import { getFarmerOrders, updateOrderStatus } from "@/lib/firestore";
import { Order } from "@/types";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function FarmerOrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadOrders() {
            if (user) {
                const data: Order[] = await getFarmerOrders(user.uid);
                // Sort by date desc
                data.sort((a: Order, b: Order) => b.createdAt - a.createdAt);
                setOrders(data);
            }
            setLoading(false);
        }
        loadOrders();
    }, [user]);

    const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Order Management</h1>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-green-600" size={32} />
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                    <p className="text-gray-500">No orders received yet.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-sm">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Order ID</th>
                                    <th className="px-6 py-3 font-medium">Crop</th>
                                    <th className="px-6 py-3 font-medium">Quantity</th>
                                    <th className="px-6 py-3 font-medium">Total Price</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-xs font-mono text-gray-500">#{order.id.slice(0, 8)}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{order.cropName}</td>
                                        <td className="px-6 py-4 text-gray-600">{order.quantityKg} kg</td>
                                        <td className="px-6 py-4 text-gray-900 font-bold">₹{order.totalPrice}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    order.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                                                        order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                            order.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                                'bg-gray-100 text-gray-700'
                                                }`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex gap-2">
                                            {order.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(order.id, 'approved')}
                                                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                        title="Approve Order"
                                                    >
                                                        <CheckCircle size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(order.id, 'rejected')}
                                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                        title="Reject Order"
                                                    >
                                                        <XCircle size={20} />
                                                    </button>
                                                </>
                                            )}
                                            {order.status === 'paid' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order.id, 'completed')}
                                                    className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                                >
                                                    Mark Delivered
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
