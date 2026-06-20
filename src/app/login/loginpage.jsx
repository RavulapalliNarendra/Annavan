import React, { useState } from "react";
import { auth } from "./firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export default function LoginPage() {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [confirm, setConfirm] = useState(null);

    const sendOtp = async () => {
        try {
            if (!window.recaptchaVerifier) {
                window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
                    size: "invisible",
                });
            }

            const appVerifier = window.recaptchaVerifier;
            const result = await signInWithPhoneNumber(auth, phone, appVerifier);
            setConfirm(result);
            alert("OTP Sent Successfully");
        } catch (error) {
            console.error(error);
        }
    };

    const verifyOtp = async () => {
        try {
            await confirm.confirm(otp);
            alert("Login Successful");
        } catch (error) {
            alert("Invalid OTP");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-80">
                <h2 className="text-2xl font-bold mb-4 text-center">Annavan Login</h2>

                <input
                    type="text"
                    placeholder="+91 Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 border rounded mb-3"
                />

                <button
                    onClick={sendOtp}
                    className="w-full bg-green-600 text-white p-2 rounded mb-3"
                >
                    Send OTP
                </button>

                {confirm && (
                    <>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full p-2 border rounded mb-3"
                        />

                        <button
                            onClick={verifyOtp}
                            className="w-full bg-green-700 text-white p-2 rounded"
                        >
                            Verify OTP
                        </button>
                    </>
                )}

                <div id="recaptcha"></div>
            </div>
        </div>
    );
}