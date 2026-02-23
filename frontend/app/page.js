"use client";

import { useState } from "react";
import SearchForm from "../components/SearchForm";
import StatsCards from "../components/StatsCards";
import UserList from "../components/UserList";
import { compareGithubUsers } from "../lib/api";
import styles from "./page.module.css";

export default function Home() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (username) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await compareGithubUsers(username);
      setResult(data);
    } catch (err) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <h1 className={styles.title}>
          <span className={styles.titleIcon}>🔍</span>
          Social Graph
          <span className={styles.titleAccent}> Analyzer</span>
        </h1>
        <p className={styles.subtitle}>
          GitHub hesabınızı analiz edin — sizi geri takip etmeyenleri ve takip
          etmediklerinizi keşfedin.
        </p>
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />
      </section>

      {/* Error */}
      {error && (
        <div className={styles.error}>
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <section className={styles.results}>
          <div className={styles.skeletonCards}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={styles.skeletonCard} />
            ))}
          </div>
          <div className={styles.skeletonLists}>
            <div className={styles.skeletonList} />
            <div className={styles.skeletonList} />
          </div>
        </section>
      )}

      {/* Results */}
      {result && !isLoading && (
        <section className={styles.results}>
          {/* Profile Header */}
          <div className={styles.profileHeader}>
            <img
              className={styles.profileAvatar}
              src={`https://github.com/${result.username}.png?size=120`}
              alt={result.username}
              width={72}
              height={72}
            />
            <div>
              <h2 className={styles.profileName}>{result.username}</h2>
              <p className={styles.profileMeta}>
                {result.truncated.followers || result.truncated.following
                  ? "⚠️ Büyük hesap — bazı veriler kısıtlanmış olabilir"
                  : "✅ Tüm veriler başarıyla çekildi"}
              </p>
            </div>
          </div>

          {/* Stats */}
          <StatsCards counts={result.counts} />

          {/* User Lists */}
          <div className={styles.listsGrid}>
            <UserList
              title="Geri Takip Etmeyenler"
              icon="💔"
              users={result.result.notFollowingBack}
              accentColor="#ef4444"
            />
            <UserList
              title="Senin Takip Etmediklerin"
              icon="👻"
              users={result.result.notFollowedBack}
              accentColor="#10b981"
            />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className={styles.footer}>
        <p>
          Built with 💜 using Next.js &amp; GitHub API
        </p>
      </footer>
    </main>
  );
}
