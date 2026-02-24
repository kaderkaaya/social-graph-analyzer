"use client";

import { useState } from "react";
import styles from "./UserList.module.css";

export default function UserList({ title, icon, users, accentColor }) {
    const [showAll, setShowAll] = useState(false);
    const INITIAL_COUNT = 20;
    const displayedUsers = showAll ? users : users.slice(0, INITIAL_COUNT);

    if (!users || users.length === 0) {
        return (
            <div className={styles.card} style={{ "--accent": accentColor }}>
                <h3 className={styles.title}>
                    <span>{icon}</span> {title}
                </h3>
                <p className={styles.empty}>No users found ✨</p>
            </div>
        );
    }

    return (
        <div className={styles.card} style={{ "--accent": accentColor }}>
            <h3 className={styles.title}>
                <span>{icon}</span> {title}
                <span className={styles.badge}>{users.length}</span>
            </h3>
            <ul className={styles.list}>
                {displayedUsers.map((user, i) => (
                    <li
                        key={user}
                        className={styles.item}
                        style={{ animationDelay: `${Math.min(i * 0.03, 0.6)}s` }}
                    >
                        <img
                            className={styles.avatar}
                            src={`https://github.com/${user}.png?size=80`}
                            alt={user}
                            width={36}
                            height={36}
                            loading="lazy"
                        />
                        <a
                            className={styles.link}
                            href={`https://github.com/${user}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {user}
                        </a>
                        <svg
                            className={styles.externalIcon}
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                    </li>
                ))}
            </ul>
            {users.length > INITIAL_COUNT && (
                <button
                    className={styles.showMore}
                    onClick={() => setShowAll((prev) => !prev)}
                >
                    {showAll
                        ? "Show less"
                        : `Show all (${users.length - INITIAL_COUNT} more)`}
                </button>
            )}
        </div>
    );
}
