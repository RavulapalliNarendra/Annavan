"use client";

import { getMarketPrices } from "@/lib/firestore";
import { MarketPrice } from "@/types";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { useEffect, useState } from "react";

export default function MarketPricesPage() {
    const [prices, setPrices] = useState<MarketPrice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPrices() {
            const data = await getMarketPrices();
            // If empty (mock), set some static data for display
            if (data.length === 0) {
                setPrices([
                    { id: '1', cropName: 'Wheat', location: 'Madhya Pradesh', pricePerKg: 28.5, trend: 'up', lastUpdated: Date.now() },
                    { id: '2', cropName: 'Rice', location: 'Punjab', pricePerKg: 95, trend: 'stable', lastUpdated: Date.now() },
                    { id: '3', cropName: 'Cotton', location: 'Gujarat', pricePerKg: 62, trend: 'down', lastUpdated: Date.now() },
                    { id: '4', cropName: 'Onion', location: 'Nashik', pricePerKg: 18, trend: 'up', lastUpdated: Date.now() },
                    { id: '5', cropName: 'Potato', location: 'Agra', pricePerKg: 12, trend: 'down', lastUpdated: Date.now() },
                ]);
            } else {
                setPrices(data);
            }
            setLoading(false);
        }
        loadPrices();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Daily Market Prices</h1>
                <p className="text-xl text-gray-600">Real-time mandi rates from across the country</p>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-green-50 text-green-800">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-lg">Crop</th>
                                    <th className="px-6 py-4 font-semibold text-lg">Location</th>
                                    <th className="px-6 py-4 font-semibold text-lg">Price / Kg</th>
                                    <th className="px-6 py-4 font-semibold text-lg">Trend</th>
                                    <th className="px-6 py-4 font-semibold text-lg">Last Updated</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {prices.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-gray-900 font-bold text-lg">{item.cropName}</td>
                                        <td className="px-6 py-4 text-gray-600">{item.location}</td>
                                        <td className="px-6 py-4 text-gray-900 font-medium text-lg">₹{item.pricePerKg.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            {item.trend === 'up' && <span className="text-green-600 flex items-center gap-1"><TrendingUp size={18} /> Rising</span>}
                                            {item.trend === 'down' && <span className="text-red-500 flex items-center gap-1"><TrendingDown size={18} /> Falling</span>}
                                            {item.trend === 'stable' && <span className="text-gray-500 flex items-center gap-1"><Minus size={18} /> Stable</span>}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {new Date(item.lastUpdated).toLocaleDateString()}
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
