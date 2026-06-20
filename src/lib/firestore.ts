import { db } from "./firebase";
import { doc, getDoc, setDoc, collection, addDoc, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { UserProfile, Crop, Order, MarketPrice } from "@/types";

// User Functions
export const createUserProfile = async (user: UserProfile) => {
    await setDoc(doc(db, "users", user.uid), user);
};

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    if (uid.startsWith("mock-")) {
        const role = uid.includes("farmer") ? "farmer" : "buyer";
        return {
            uid,
            name: `Mock ${role.charAt(0).toUpperCase() + role.slice(1)}`,
            role: role as "farmer" | "buyer",
            phoneNumber: "+919876543210",
            createdAt: Date.now()
        };
    }

    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
}

// Crop Functions
export const addCrop = async (crop: Omit<Crop, "id">) => {
    if (crop.farmerId.startsWith("mock-")) {
        console.log("Mock Mode: Simulating addCrop", crop);
        const mockCrops = JSON.parse(localStorage.getItem("mock_crops") || "[]");
        const newCrop = { id: `mock-crop-${Date.now()}`, ...crop };
        mockCrops.push(newCrop);
        localStorage.setItem("mock_crops", JSON.stringify(mockCrops));
        return newCrop.id;
    }

    const docRef = await addDoc(collection(db, "crops"), crop);
    return docRef.id;
};

export const getCrops = async () => {
    // Merge real and mock crops for display? 
    // Usually buyer sees everything.
    const mockCrops = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("mock_crops") || "[]") : [];

    // Fail fast if keys are missing
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey || apiKey.includes("your_api_key")) {
        console.warn("Mock Mode: Returning only mock crops.");
        return mockCrops;
    }

    try {
        const querySnapshot = await getDocs(collection(db, "crops"));
        const realCrops = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Crop));

        // Dedup if execution environment mixes them (unlikely but safe)
        // We prioritize real crops, but here we just append.
        return [...realCrops, ...mockCrops];
    } catch (e) {
        console.warn("Failed to fetch real crops, returning mocks only.", e);
        return mockCrops;
    }
};

export const getFarmerCrops = async (farmerId: string) => {
    if (farmerId.startsWith("mock-")) {
        const mockCrops = JSON.parse(localStorage.getItem("mock_crops") || "[]");
        return mockCrops.filter((c: Crop) => c.farmerId === farmerId);
    }

    const q = query(collection(db, "crops"), where("farmerId", "==", farmerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Crop));
};

// Market Prices (Mock for now if DB empty)
export const getMarketPrices = async () => {
    // connect to real collection later
    return [];
};

// Order Functions
export const createOrder = async (order: Omit<Order, "id">) => {
    // Check if buyer or farmer is mock
    if (order.buyerId.startsWith("mock-") || order.farmerId.startsWith("mock-")) {
        console.log("Mock Mode: Simulating createOrder", order);
        const mockOrders = JSON.parse(localStorage.getItem("mock_orders") || "[]");
        const newOrder = { id: `mock-order-${Date.now()}`, ...order, createdAt: Date.now(), status: "pending" };
        mockOrders.push(newOrder);
        localStorage.setItem("mock_orders", JSON.stringify(mockOrders));

        // Dispatch event for local listeners if any (optional, but good for immediate UI update in same tab)
        window.dispatchEvent(new Event("mock-order-created"));

        return newOrder.id;
    }

    const docRef = await addDoc(collection(db, "orders"), {
        ...order,
        status: "pending",
        createdAt: Date.now() // Use serverTimestamp() in real app, but number is easier for hybrid mock/real
    });
    return docRef.id;
};

export const getFarmerOrders = async (farmerId: string) => {
    if (farmerId.startsWith("mock-")) {
        const mockOrders = JSON.parse(localStorage.getItem("mock_orders") || "[]");
        return mockOrders.filter((o: Order) => o.farmerId === farmerId);
    }
    const q = query(collection(db, "orders"), where("farmerId", "==", farmerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
};

export const getBuyerOrders = async (buyerId: string) => {
    if (buyerId.startsWith("mock-")) {
        const mockOrders = JSON.parse(localStorage.getItem("mock_orders") || "[]");
        return mockOrders.filter((o: Order) => o.buyerId === buyerId);
    }
    const q = query(collection(db, "orders"), where("buyerId", "==", buyerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
};

// Real-time listener for Farmer Orders
export const subscribeToFarmerOrders = (farmerId: string, callback: (orders: Order[]) => void) => {
    if (farmerId.startsWith("mock-")) {
        // Poll localStorage for mock mode
        const checkMockOrders = () => {
            const mockOrders = JSON.parse(localStorage.getItem("mock_orders") || "[]");
            const farmerOrders = mockOrders.filter((o: Order) => o.farmerId === farmerId);
            callback(farmerOrders);
        };

        checkMockOrders(); // Initial call
        const interval = setInterval(checkMockOrders, 2000); // Poll every 2s
        return () => clearInterval(interval);
    }

    const q = query(collection(db, "orders"), where("farmerId", "==", farmerId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        callback(orders);
    });
    return unsubscribe;
};

// Real-time listener for Buyer Orders
export const subscribeToBuyerOrders = (buyerId: string, callback: (orders: Order[]) => void) => {
    if (buyerId.startsWith("mock-")) {
        const checkMockOrders = () => {
            const mockOrders = JSON.parse(localStorage.getItem("mock_orders") || "[]");
            const buyerOrders = mockOrders.filter((o: Order) => o.buyerId === buyerId);
            callback(buyerOrders);
        };
        checkMockOrders();
        const interval = setInterval(checkMockOrders, 2000);
        return () => clearInterval(interval);
    }

    const q = query(collection(db, "orders"), where("buyerId", "==", buyerId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        callback(orders);
    });
    return unsubscribe;
};

export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    if (orderId.startsWith("mock-order-")) {
        const mockOrders = JSON.parse(localStorage.getItem("mock_orders") || "[]");
        const orderIndex = mockOrders.findIndex((o: Order) => o.id === orderId);
        if (orderIndex !== -1) {
            mockOrders[orderIndex].status = status;
            if (status === "approved") mockOrders[orderIndex].acceptedAt = Date.now();
            if (status === "rejected") mockOrders[orderIndex].rejectedAt = Date.now();
            localStorage.setItem("mock_orders", JSON.stringify(mockOrders));
        }
        return;
    }

    const updateData: any = { status };
    if (status === "approved") updateData.acceptedAt = Date.now();
    if (status === "rejected") updateData.rejectedAt = Date.now();

    await setDoc(doc(db, "orders", orderId), updateData, { merge: true });
};
