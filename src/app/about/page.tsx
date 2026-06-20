import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-700 font-medium mb-8">
                    <ArrowLeft size={20} className="mr-2" /> Back to Home
                </Link>

                <h1 className="text-4xl font-extrabold text-gray-900 mb-6">About Annavan</h1>

                <div className="prose prose-green prose-lg text-gray-600">
                    <p className="mb-6">
                        Annavan is a revolutionary digital marketplace designed to bridge the gap between Indian farmers and buyers.
                        Our mission is to eliminate middlemen, ensure fair pricing for farmers, and provide fresh, high-quality
                        produce directly to consumers and businesses.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Mission</h2>
                    <p className="mb-6">
                        To empower the Indian agriculture sector by leveraging technology to create a transparent, efficient,
                        and equitable supply chain.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Choose Us?</h2>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-start">
                            <CheckCircle className="flex-shrink-0 h-6 w-6 text-green-500 mt-1 mr-3" />
                            <span>
                                <strong>Direct Access:</strong> Farmers list their crops and set their prices. Buyers purchase directly.
                            </span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircle className="flex-shrink-0 h-6 w-6 text-green-500 mt-1 mr-3" />
                            <span>
                                <strong>Fair Pricing:</strong> No hidden commissions. Farmers get what they deserve.
                            </span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircle className="flex-shrink-0 h-6 w-6 text-green-500 mt-1 mr-3" />
                            <span>
                                <strong>Secure Payments:</strong> Integrated payment gateways ensure safety for both parties.
                            </span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircle className="flex-shrink-0 h-6 w-6 text-green-500 mt-1 mr-3" />
                            <span>
                                <strong>Real-time Insights:</strong> Live mandi prices help users make informed decisions.
                            </span>
                        </li>
                    </ul>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Customer Support</h2>
                    <div className="bg-green-50 rounded-lg p-6 border border-green-100">
                        <p className="mb-2 font-medium text-gray-900">We are here to help you.</p>
                        <ul className="space-y-3 mt-4">
                            <li className="flex flex-col sm:flex-row sm:items-center">
                                <span className="text-sm text-gray-500 w-24">Name:</span>
                                <span className="font-semibold text-gray-900">Narendra</span>
                            </li>
                            <li className="flex flex-col sm:flex-row sm:items-center">
                                <span className="text-sm text-gray-500 w-24">Mobile:</span>
                                <span className="font-semibold text-gray-900">+91 93925 59023</span>
                            </li>
                            <li className="flex flex-col sm:flex-row sm:items-center">
                                <span className="text-sm text-gray-500 w-24">Email:</span>
                                <a href="mailto:narendra.yadav.ravulapalli@gmail.com" className="font-semibold text-green-600 hover:text-green-700 break-all">
                                    narendra.yadav.ravulapalli@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
