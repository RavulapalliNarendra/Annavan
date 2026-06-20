"use client";

import { useAuth } from "@/contexts/AuthContext";
import { getBuyerOrders } from "@/lib/firestore";
import { Order } from "@/types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function BuyerOrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadOrders() {
            if (user) {
                const data: Order[] = await getBuyerOrders(user.uid);
                // Sort by date desc
                data.sort((a: Order, b: Order) => b.createdAt - a.createdAt);
                setOrders(data);
            }
            setLoading(false);
        }
        loadOrders();
    }, [user]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-green-600" size={32} />
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                    <p className="text-gray-500">You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-bold text-gray-900">{order.cropName}</h3>
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                order.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                                                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                            'bg-gray-100 text-gray-700'
                                            }`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500">Order #{order.id.slice(0, 8)} • Quatity: {order.quantityKg} kg</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-green-700">₹{order.totalPrice}</p>
                                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {order.status === 'approved' && (
                                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                                    <button
                                        className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition"
                                        onClick={() => alert("Redirecting to payment gateway...")}
                                    >
                                        Pay Now
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
