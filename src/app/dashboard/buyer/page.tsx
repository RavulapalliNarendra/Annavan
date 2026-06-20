"use client";

import { useAuth } from "@/contexts/AuthContext";
import { getCrops, createOrder, subscribeToBuyerOrders } from "@/lib/firestore";
import { Crop, Order } from "@/types";
import { Filter, Search, ShoppingCart, Loader2, ShoppingBag, Award, MapPin, User, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function BuyerDashboard() {
    const { user } = useAuth();
    const [crops, setCrops] = useState<Crop[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGrade, setSelectedGrade] = useState<'All' | 'A' | 'B' | 'C'>('All');
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'market' | 'orders'>('market');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        async function loadData() {
            const data = await getCrops();
            setCrops(data);
            setLoading(false);
        }
        loadData();

        if (user) {
            const unsubscribe = subscribeToBuyerOrders(user.uid, (newOrders: Order[]) => {
                setOrders(newOrders.sort((a, b) => b.createdAt - a.createdAt));
            });
            return () => unsubscribe();
        }
    }, [user]);

    if (!mounted) return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
            <div className="text-center py-12">
                <Loader2 className="animate-spin text-green-600 mx-auto" size={48} />
                <p className="mt-4 text-slate-500 font-semibold">Loading marketplace...</p>
            </div>
        </div>
    );

    const handleBuy = async (crop: Crop) => {
        if (!user) {
            alert("Please login to buy crops");
            return;
        }

        const totalCost = crop.pricePerKg * crop.quantityKg;
        if (!confirm(`Place order for ${crop.name} (${crop.quantityKg}kg) at ₹${crop.pricePerKg}/kg?\nTotal Value: ₹${totalCost.toLocaleString()}`)) return;

        setProcessingId(crop.id);
        try {
            await createOrder({
                cropId: crop.id,
                cropName: crop.name,
                farmerId: crop.farmerId,
                buyerId: user.uid,
                quantityKg: crop.quantityKg,
                totalPrice: totalCost,
                status: 'pending',
                createdAt: Date.now()
            });
            setActiveTab('orders');
        } catch (error) {
            console.error("Order failed", error);
            alert("Failed to place order. Please try again.");
        } finally {
            setProcessingId(null);
        }
    };

    const filteredCrops = crops.filter(crop => {
        const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            crop.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGrade = selectedGrade === 'All' || crop.grade === selectedGrade;
        return matchesSearch && matchesGrade;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 min-h-screen bg-slate-50">
            {/* Header & Tabs */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-950 tracking-tight">Buyer Marketplace</h1>
                    <p className="text-slate-500 font-semibold mt-1">Welcome back, {user?.displayName || 'Buyer'}</p>
                </div>

                <div className="flex bg-slate-200/60 p-1.5 rounded-full border border-slate-200/50 shadow-sm shrink-0">
                    <button
                        onClick={() => setActiveTab('market')}
                        className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
                          activeTab === 'market' 
                            ? 'bg-white text-green-700 shadow-sm' 
                            : 'text-slate-600 hover:text-slate-800'
                        }`}
                    >
                        Marketplace Listings
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                          activeTab === 'orders' 
                            ? 'bg-white text-green-700 shadow-sm' 
                            : 'text-slate-600 hover:text-slate-800'
                        }`}
                    >
                        My Purchase Orders
                        {orders.length > 0 && (
                            <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-[10px] font-black border border-green-200">
                                {orders.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {activeTab === 'market' ? (
                <>
                    {/* Search and Filters Controls */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8 items-stretch md:items-center justify-between">
                        {/* Search Input */}
                        <div className="relative flex-grow max-w-xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-full focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:outline-none text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-sm"
                                placeholder="Search by crop name or farmer location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Grade Filters */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
                                <Filter size={12} /> Quality:
                            </span>
                            {(['All', 'A', 'B', 'C'] as const).map((grade) => (
                                <button
                                    key={grade}
                                    onClick={() => setSelectedGrade(grade)}
                                    className={`py-1.5 px-4 rounded-full text-xs font-bold transition-all shrink-0 ${
                                        selectedGrade === grade
                                            ? 'bg-green-600 border border-green-600 text-white shadow-md shadow-green-600/10'
                                            : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                                    }`}
                                >
                                    {grade === 'All' ? 'All Grades' : `Grade ${grade}`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <Loader2 className="animate-spin text-green-600 mx-auto" size={48} />
                            <p className="mt-4 text-slate-400 font-semibold text-sm">Refresing listings...</p>
                        </div>
                    ) : filteredCrops.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-inner">
                            <ShoppingBag className="mx-auto h-12 w-12 text-slate-300 mb-2" />
                            <h3 className="text-base font-bold text-slate-800">No matching crops available</h3>
                            <p className="text-xs text-slate-400 mt-1">Try resetting your search query or quality filters.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredCrops.map((crop) => (
                                <div key={crop.id} className="bg-white rounded-3xl border border-slate-100 hover:border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                                    <div className="h-52 relative bg-slate-100 overflow-hidden">
                                        <img
                                            src={crop.imageUrl || "https://placehold.co/600x400?text=No+Image"}
                                            alt={crop.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 select-none"
                                            onError={(e) => {
                                                e.currentTarget.src = "https://placehold.co/600x400?text=Image+Not+Available";
                                            }}
                                        />

                                        {/* Grade Badge Overlay */}
                                        {crop.grade && (
                                            <div className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur text-white px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border border-emerald-400/30 shadow-md flex items-center gap-1">
                                                <Award size={10} /> Grade {crop.grade} Certified
                                            </div>
                                        )}

                                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur px-3 py-1 rounded-xl text-[10px] font-bold text-slate-100 border border-white/10">
                                            {crop.quantityKg.toLocaleString()} kg available
                                        </div>
                                    </div>

                                    <div className="p-6 flex-grow flex flex-col justify-between">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-lg font-black text-slate-900 leading-tight">{crop.name}</h3>
                                                <span className="text-green-700 font-extrabold text-lg">₹{crop.pricePerKg}/kg</span>
                                            </div>
                                            
                                            <div className="space-y-1.5 text-xs text-slate-500 border-t border-slate-50 pt-3">
                                                <div className="flex items-center gap-1.5 font-semibold">
                                                    <MapPin size={14} className="text-slate-400 shrink-0" />
                                                    <span className="truncate">{crop.location}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 font-semibold">
                                                    <User size={14} className="text-slate-400 shrink-0" />
                                                    <span className="truncate">Listed by <span className="font-bold text-slate-600">{crop.farmerName}</span></span>
                                                </div>
                                            </div>

                                            {crop.description && (
                                                <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                                                    {crop.description}
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => handleBuy(crop)}
                                            disabled={processingId === crop.id}
                                            className="w-full mt-6 bg-green-600 hover:bg-green-700 disabled:bg-slate-200 text-white py-3.5 rounded-full font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-green-700/10 active:scale-98 disabled:scale-100"
                                        >
                                            {processingId === crop.id ? (
                                                <Loader2 className="animate-spin" size={16} />
                                            ) : (
                                                <ShoppingCart size={16} />
                                            )}
                                            {processingId === crop.id ? "Placing Order..." : "Buy Crop Pack"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div className="space-y-4 max-w-4xl mx-auto">
                    {orders.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-inner">
                            <ShoppingBag className="mx-auto h-12 w-12 text-slate-300 mb-2" />
                            <h3 className="text-base font-bold text-slate-800">No orders yet</h3>
                            <p className="text-xs text-slate-400 mt-1">Explore the marketplace above to place your first trade order.</p>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 hover:border-slate-200 transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-extrabold text-slate-900 text-base">{order.cropName}</h3>
                                        <span className="text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded">
                                            #{order.id.slice(-6)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 font-semibold">
                                        Quantity: {order.quantityKg} kg • Total Value: <span className="text-green-700 font-bold">₹{order.totalPrice.toLocaleString()}</span>
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-semibold">Ordered: {new Date(order.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="flex flex-col items-start sm:items-end gap-1.5">
                                    <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-inner flex items-center gap-1.5
                                        ${order.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                                            order.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                                'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'approved' ? 'bg-green-500' : order.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500 animate-ping'}`} />
                                        {order.status === 'approved' ? 'Accepted' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
