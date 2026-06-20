"use client";

import { Users, ShoppingBag, DollarSign, Activity, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Panel</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Users</p>
                            <h3 className="text-2xl font-bold text-gray-900">0</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-full">
                            <ShoppingBag size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Orders</p>
                            <h3 className="text-2xl font-bold text-gray-900">0</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Transaction Vol</p>
                            <h3 className="text-2xl font-bold text-gray-900">₹0</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                            <Activity size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Active Listings</p>
                            <h3 className="text-2xl font-bold text-gray-900">0</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pending Verification */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            User Approvals
                        </h2>
                    </div>
                    <div className="p-6 text-center text-gray-500">
                        No pending approvals.
                    </div>
                </div>

                {/* System Alerts */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <AlertTriangle size={20} className="text-orange-500" /> Disputes & Alerts
                        </h2>
                    </div>
                    <div className="p-6 text-center text-gray-500">
                        All systems healthy. No active disputes.
                    </div>
                </div>
            </div>
        </div>
    );
}
