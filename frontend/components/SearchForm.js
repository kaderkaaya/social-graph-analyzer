"use client";

import { useState } from "react";
import styles from "./SearchForm.module.css";

export default function SearchForm({ onSearch, isLoading }) {
    const [username, setUsername] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = username.trim();
        if (trimmed) onSearch(trimmed);
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputWrapper}>
                <svg
                    className={styles.icon}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.66-.22.66-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8c.85.004 1.7.115 2.5.337 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.16.58.67.48A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z" />
                </svg>
                <input
                    id="github-username-input"
                    type="text"
                    className={styles.input}
                    placeholder="Enter GitHub username..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    autoComplete="off"
                />
            </div>
            <button
                id="analyze-button"
                type="submit"
                className={styles.button}
                disabled={isLoading || !username.trim()}
            >
                {isLoading ? (
                    <span className={styles.spinner} />
                ) : (
                    <>
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21l-4.35-4.35" />
                        </svg>
                        Analyze
                    </>
                )}
            </button>
        </form>
    );
}
