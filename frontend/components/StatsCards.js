"use client";

import styles from "./StatsCards.module.css";

const CARDS = [
    {
        key: "followersFetched",
        label: "Takipçi",
        icon: "👥",
        color: "#8b5cf6",
    },
    {
        key: "followingFetched",
        label: "Takip Edilen",
        icon: "➡️",
        color: "#6366f1",
    },
    {
        key: "notFollowingBack",
        label: "Geri Takip Etmeyen",
        icon: "💔",
        color: "#ef4444",
    },
    {
        key: "notFollowedBack",
        label: "Takip Etmediğin",
        icon: "👻",
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
                        {(counts[card.key] ?? 0).toLocaleString("tr-TR")}
                    </span>
                    <span className={styles.label}>{card.label}</span>
                </div>
            ))}
        </div>
    );
}
