import React, { useEffect, useState } from "react";
import s from "./PointsShop.module.css";

const API_BASE = "http://159.198.65.254:7777"; // backend URL

const pointPackages = [
    { id: 1, amount: 500, label: "500 Points (Free)", free: true },
    { id: 2, amount: 1000, label: "1000 Points" },
    { id: 3, amount: 2500, label: "2500 Points" },
    { id: 4, amount: 5000, label: "5000 Points" },
];

const PointsShop = () => {
    const [points, setPoints] = useState(0);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    // Fetch current points
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${API_BASE}/user`);
                const data = await res.json();
                setPoints(data.points || 0);
            } catch (err) {
                console.error("Error fetching user:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    // Add points directly (free)
    const addFreePoints = async (amount) => {
        setMessage("");
        try {
            const res = await fetch(`${API_BASE}/user/add-points`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ points: amount }),
            });

            const data = await res.json();
            if (res.ok) {
                setPoints(data.points);
                setMessage(`✅ You received ${amount} points!`);
            } else {
                setMessage(`❌ ${data.error}`);
            }
        } catch (err) {
            console.error("Error adding points:", err);
            setMessage("❌ Failed to add points.");
        }
    };

    // Buy points with Stripe
    const buyWithStripe = async (pkg) => {
        setMessage("");
        try {
            const res = await fetch(`${API_BASE}/create-checkout-session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: pkg.id }),
            });

            const data = await res.json();
            if (res.ok && data.url) {
                window.location.href = data.url; // Redirect to Stripe Checkout
            } else {
                setMessage(`❌ ${data.error || "Payment failed"}`);
            }
        } catch (err) {
            console.error("Error creating checkout session:", err);
            setMessage("❌ Failed to start payment.");
        }
    };

    if (loading) {
        return <div className={s.loading}>Loading points...</div>;
    }

    return (
        <div className={s.container}>
            <h1 className={s.title}>Buy Points</h1>

            <div className={s.points}>
                Your Points: <span>{points}</span>
            </div>

            {message && <div className={s.message}>{message}</div>}

            <div className={s.grid}>
                {pointPackages.map((pkg) => (
                    <div key={pkg.id} className={s.card}>
                        <h3>{pkg.label}</h3>
                        <p className={s.amount}>+{pkg.amount} pts</p>
                        <button
                            className={s.buyBtn}
                            onClick={() =>
                                pkg.free
                                    ? addFreePoints(pkg.amount)
                                    : buyWithStripe(pkg)
                            }
                        >
                            {pkg.free ? "Claim Free" : "Buy"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PointsShop;
