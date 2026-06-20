"use client";

import { useAuth } from "@/contexts/AuthContext";
import { getFarmerCrops, subscribeToFarmerOrders, updateOrderStatus } from "@/lib/firestore";
import { Crop, Order } from "@/types";
import { Plus, TrendingUp, Package, IndianRupee, Bell, Check, X, Clock, Award } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import WeatherWidget from "@/components/WeatherWidget";

export default function FarmerDashboard() {
    const { user } = useAuth();
    const [crops, setCrops] = useState<Crop[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingOrder, setProcessingOrder] = useState<string | null>(null);

    useEffect(() => {
        async function loadCrops() {
            if (user) {
                const data = await getFarmerCrops(user.uid);
                setCrops(data);
            }
            setLoading(false);
        }
        loadCrops();

        if (user) {
            const unsubscribe = subscribeToFarmerOrders(user.uid, (newOrders) => {
                setOrders(newOrders.sort((a, b) => b.createdAt - a.createdAt));
            });
            return () => unsubscribe();
        }
    }, [user]);

    const handleOrderAction = async (orderId: string, status: 'approved' | 'rejected') => {
        setProcessingOrder(orderId);
        try {
            await updateOrderStatus(orderId, status);
        } catch (error) {
            console.error("Failed to update order", error);
            alert("Failed to update status.");
        } finally {
            setProcessingOrder(null);
        }
    };

    const pendingOrders = orders.filter(o => o.status === 'pending');
    const activeOrdersCount = orders.filter(o => o.status === 'approved').length;
    // Calculate total earnings from approved/completed orders (mock calculation)
    const totalEarnings = orders
        .filter(o => o.status === 'approved' || o.status === 'completed' || o.status === 'paid')
        .reduce((sum, o) => sum + o.totalPrice, 0);

    return (
        <div className="relative min-h-screen bg-slate-50">
            {/* Background Image & Overlay */}
            <div className="fixed inset-0 z-0 h-full w-full">
                <img
                    src="/images/farmer-bg.jpg"
                    alt="Farmer Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]" />
            </div>

            {/* Dashboard Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 text-white">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Farmer Dashboard</h1>
                        <p className="text-green-300 font-semibold mt-1">Welcome back, {user?.displayName || "Farmer"}</p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/ai-grader"
                            className="bg-slate-900/80 border border-slate-700/80 text-white px-5 py-3 rounded-full font-bold hover:bg-slate-800 shadow-md transition flex items-center gap-2 text-sm"
                        >
                            <Award size={16} className="text-yellow-400" />
                            AI Crop Grader
                        </Link>
                        <Link
                            href="/dashboard/farmer/add-crop"
                            className="bg-green-600 text-white px-6 py-3 rounded-full font-bold hover:bg-green-500 shadow-lg hover:shadow-green-500/30 transition flex items-center gap-2 transform hover:-translate-y-0.5 text-sm"
                        >
                            <Plus size={16} />
                            Add New Crop
                        </Link>
                    </div>
                </div>

                {/* Weather Widget Section */}
                <div className="mb-8">
                    <WeatherWidget />
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="glass-card p-6 rounded-2xl shadow-lg border-l-4 border-green-500 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3.5 bg-green-100 text-green-700 rounded-2xl">
                                <Package size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Listed Crops</p>
                                <h3 className="text-2xl font-black text-slate-950 mt-0.5">{crops.length}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card p-6 rounded-2xl shadow-lg border-l-4 border-blue-500 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3.5 bg-blue-100 text-blue-700 rounded-2xl">
                                <IndianRupee size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Earnings</p>
                                <h3 className="text-2xl font-black text-slate-950 mt-0.5">₹{totalEarnings.toLocaleString()}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card p-6 rounded-2xl shadow-lg border-l-4 border-purple-500 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3.5 bg-purple-100 text-purple-700 rounded-2xl">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active Orders</p>
                                <h3 className="text-2xl font-black text-slate-950 mt-0.5">{activeOrdersCount}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Orders Section */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="glass-card rounded-2xl shadow-lg overflow-hidden bg-white/95">
                            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <Bell size={18} className="text-green-600" /> Recent Incoming Orders
                                </h2>
                                {pendingOrders.length > 0 && (
                                    <span className="bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded-full font-bold animate-pulse shadow-sm border border-red-200">
                                        {pendingOrders.length} Pending
                                    </span>
                                )}
                            </div>

                            {loading ? (
                                <div className="p-12 text-center text-slate-500 font-medium">Loading orders...</div>
                            ) : orders.length === 0 ? (
                                <div className="p-12 text-center text-slate-500">
                                    <Bell className="mx-auto h-12 w-12 text-slate-300 mb-2 opacity-50" />
                                    No orders received yet.
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {orders.map((order) => (
                                        <div key={order.id} className="p-6 hover:bg-slate-50/50 transition duration-200">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="text-slate-900 font-bold text-base">{order.cropName}</h3>
                                                        <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-bold border border-slate-200/60">
                                                            x{order.quantityKg}kg
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-medium">
                                                        <span>ID: <span className="font-mono text-slate-400">#{order.id.slice(-6)}</span></span>
                                                        <span>•</span>
                                                        <span>Buyer: {order.buyerId.slice(0, 8)}...</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <p className="text-green-700 font-extrabold text-lg">₹{order.totalPrice.toLocaleString()}</p>
                                                        <p className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                                                            <Clock size={12} /> {new Date(order.createdAt).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-2">
                                                    {order.status === 'pending' ? (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleOrderAction(order.id, 'approved')}
                                                                disabled={processingOrder === order.id}
                                                                className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-xs transition shadow-sm active:scale-95 disabled:opacity-70 disabled:scale-100"
                                                            >
                                                                <Check size={14} /> Accept
                                                            </button>
                                                            <button
                                                                onClick={() => handleOrderAction(order.id, 'rejected')}
                                                                disabled={processingOrder === order.id}
                                                                className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 font-bold text-xs transition active:scale-95 disabled:opacity-70"
                                                            >
                                                                <X size={14} /> Reject
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm border
                                                            ${order.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                                                                order.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                                                    'bg-slate-100 text-slate-700 border-slate-200'}`}>
                                                            {order.status === 'approved' ? 'Accepted' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Listings Preview */}
                    <div className="lg:col-span-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-100 overflow-hidden h-fit">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <h2 className="text-base font-bold text-slate-900">Your Listings</h2>
                            <Link href="/dashboard/farmer/add-crop" className="text-xs font-bold text-green-600 hover:text-green-700">Add New</Link>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {crops.slice(0, 5).map((crop) => (
                                <div key={crop.id} className="p-4 hover:bg-slate-50 flex justify-between items-center transition">
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-1.5">
                                            <p className="font-bold text-slate-800 text-sm">{crop.name}</p>
                                            {crop.grade && (
                                                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wider border border-emerald-200/50">
                                                    Grade {crop.grade}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                                            {crop.quantityKg} kg • <span className="text-green-600">₹{crop.pricePerKg}/kg</span>
                                        </p>
                                    </div>
                                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                                </div>
                            ))}
                            {crops.length > 5 && (
                                <div className="p-3 text-center bg-slate-50/30">
                                    <button className="text-xs text-green-700 hover:text-green-800 font-bold">View All Listings ({crops.length})</button>
                                </div>
                            )}
                            {crops.length === 0 && (
                                <div className="p-8 text-center text-xs text-slate-400 font-semibold">
                                    No crops listed.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
