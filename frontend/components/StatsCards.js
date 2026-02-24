"use client";

import styles from "./StatsCards.module.css";
import { Users, UserCheck, UserX, UserMinus } from "lucide-react";

const CARDS = [
    {
        key: "followersFetched",
        label: "Followers",
        icon: <Users size={24} />,
        color: "#8b5cf6",
    },
    {
        key: "followingFetched",
        label: "Following",
        icon: <UserCheck size={24} />,
        color: "#6366f1",
    },
    {
        key: "notFollowingBack",
        label: "Not Following Back",
        icon: <UserX size={24} />,
        color: "#ef4444",
    },
    {
        key: "notFollowedBack",
        label: "Not Followed Back",
        icon: <UserMinus size={24} />,
        color: "#10b981",
    },
];

export default function StatsCards({ counts }) {
    return (
        <div className={styles.grid}>
            {CARDS.map((card, i) => (
                <div
                    key={card.key}
                    className={styles.card}
                    style={{
                        "--card-color": card.color,
                        animationDelay: `${i * 0.1}s`,
                    }}
                >
                    <span className={styles.icon}>{card.icon}</span>
                    <span className={styles.value}>
                        {(counts[card.key] ?? 0).toLocaleString("en-US")}
                    </span>
                    <span className={styles.label}>{card.label}</span>
                </div>
            ))}
        </div>
    );
}
