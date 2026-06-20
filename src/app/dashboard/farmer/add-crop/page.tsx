"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { addCrop } from "@/lib/firestore";
import { uploadFile } from "@/lib/storage";
import { Loader2, Upload, ArrowLeft, Image as ImageIcon, X, Award, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AddCropPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [prefilledImageUrl, setPrefilledImageUrl] = useState<string | null>(null);
    const [grade, setGrade] = useState<'A' | 'B' | 'C' | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        quantityKg: "",
        pricePerKg: "",
        location: "",
        description: "",
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const pName = params.get("name") || "";
            const pPrice = params.get("pricePerKg") || "";
            const pGrade = params.get("grade") || "";
            const pImage = params.get("image") || "";

            if (pName || pPrice) {
                setFormData(prev => ({
                    ...prev,
                    name: pName,
                    pricePerKg: pPrice
                }));
            }
            if (pGrade === "A" || pGrade === "B" || pGrade === "C") {
                setGrade(pGrade);
            }
            if (pImage) {
                setPrefilledImageUrl(pImage);
                setImagePreview(pImage);
            }
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPrefilledImageUrl(null);
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setPrefilledImageUrl(null);
        if (imagePreview) {
            // Only revoke if it was an uploaded file object URL
            if (imagePreview.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
            setImagePreview(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert("You must be logged in to add a crop.");
            return;
        }

        if (!imageFile && !prefilledImageUrl) {
            alert("Please select or scan an image for your crop.");
            return;
        }

        setLoading(true);

        try {
            let finalImageUrl = "";
            if (imageFile) {
                // Upload Image to Firebase Storage
                finalImageUrl = await uploadFile(imageFile, "crops");
            } else if (prefilledImageUrl) {
                finalImageUrl = prefilledImageUrl;
            }

            // Save Crop Data to Firestore
            await addCrop({
                farmerId: user.uid,
                farmerName: user.displayName || "Unknown Farmer",
                name: formData.name,
                quantityKg: Number(formData.quantityKg),
                pricePerKg: Number(formData.pricePerKg),
                location: formData.location,
                description: formData.description,
                imageUrl: finalImageUrl,
                grade: grade || undefined,
                createdAt: Date.now(),
            });

            alert("Crop added successfully!");
            router.push("/dashboard/farmer");
        } catch (error) {
            console.error("Error adding crop:", error);
            alert("Failed to add crop. Please check your internet connection or try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <Link href="/dashboard/farmer" className="inline-flex items-center text-gray-500 hover:text-green-600 mb-6 font-semibold">
                <ArrowLeft size={18} className="mr-1" /> Back to Dashboard
            </Link>

            {grade && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 text-sm font-semibold flex items-center gap-3 mb-6 shadow-sm">
                    <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
                        <Award size={18} className="animate-bounce" />
                    </div>
                    <div>
                        <span className="block font-bold">AI Optical Grading Certificate Applied</span>
                        <span className="text-xs text-emerald-700/80 font-medium">This crop will show up on the marketplace with a verified <span className="font-bold">Grade {grade}</span> quality badge.</span>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sm:p-8">
                <h1 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    <Sparkles size={24} className="text-green-600" /> List a New Crop
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label htmlFor="name" className="block text-sm font-bold text-slate-700">Crop Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                className="mt-2 block w-full border border-slate-200 rounded-xl shadow-sm py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm text-slate-800 placeholder-slate-400 font-semibold"
                                placeholder="e.g. Wheat, Rice, Tomato"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-bold text-slate-700">Location</label>
                            <input
                                type="text"
                                name="location"
                                id="location"
                                required
                                className="mt-2 block w-full border border-slate-200 rounded-xl shadow-sm py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm text-slate-800 placeholder-slate-400 font-semibold"
                                placeholder="Village, City, State"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="quantityKg" className="block text-sm font-bold text-slate-700">Quantity (kg)</label>
                            <input
                                type="number"
                                name="quantityKg"
                                id="quantityKg"
                                required
                                min="1"
                                className="mt-2 block w-full border border-slate-200 rounded-xl shadow-sm py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm text-slate-800 placeholder-slate-400 font-semibold"
                                placeholder="e.g. 500"
                                value={formData.quantityKg}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="pricePerKg" className="block text-sm font-bold text-slate-700">Price per kg (₹)</label>
                            <input
                                type="number"
                                name="pricePerKg"
                                id="pricePerKg"
                                required
                                min="1"
                                className="mt-2 block w-full border border-slate-200 rounded-xl shadow-sm py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm text-slate-800 placeholder-slate-400 font-semibold"
                                placeholder="e.g. 25"
                                value={formData.pricePerKg}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-bold text-slate-700">Description (Optional)</label>
                        <textarea
                          name="description"
                          id="description"
                          rows={3}
                          className="mt-2 block w-full border border-slate-200 rounded-xl shadow-sm py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm text-slate-800 placeholder-slate-400 font-semibold"
                          placeholder="Any specific details about the crop quality..."
                          value={formData.description}
                          onChange={handleChange}
                        />
                    </div>

                    {/* Image Upload Section */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Crop Image</label>

                        {!imagePreview ? (
                            <div className="mt-2 flex justify-center px-6 pt-6 pb-6 border-2 border-slate-200 border-dashed rounded-2xl hover:bg-slate-50 transition cursor-pointer relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleImageChange}
                                    required
                                />
                                <div className="space-y-1 text-center pointer-events-none">
                                    <Upload className="mx-auto h-10 w-10 text-slate-400" />
                                    <div className="flex text-sm text-slate-600 justify-center">
                                        <span className="font-bold text-green-600">
                                            Upload a file
                                        </span>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium">PNG, JPG up to 10MB</p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative w-full h-64 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 mt-2">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md text-slate-500 hover:text-red-500 active:scale-95 transition"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-green-600 text-white px-8 py-3.5 rounded-full font-bold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 flex items-center gap-2 min-w-[160px] justify-center shadow-lg shadow-green-700/15"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Saving...
                                </>
                            ) : (
                                "List Crop"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
