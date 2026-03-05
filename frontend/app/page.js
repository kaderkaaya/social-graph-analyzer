"use client";

import { useState, useRef, useEffect } from "react";
import SearchForm from "../components/SearchForm";
import StatsCards from "../components/StatsCards";
import UserList from "../components/UserList";
import { startCompareJob, getJob } from "../lib/api";
import { joinJobRoom, leaveJobRoom } from "../lib/socket";
import styles from "./page.module.css";

export default function Home() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const socketHandlersRef = useRef(null);

  useEffect(() => {
    return () => {
      if (socketHandlersRef.current) leaveJobRoom(socketHandlersRef.current);
    };
  }, []);

  const handleSearch = async (username) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setProgress(0);

    if (socketHandlersRef.current) leaveJobRoom(socketHandlersRef.current);

    try {
      const { jobId } = await startCompareJob(username);

      const onProgress = (payload) => {
        setProgress(payload.progress ?? 0);
        if (payload.progress === 100) {
          leaveJobRoom(socketHandlersRef.current);
          const fetchResult = () =>
            getJob(jobId).then((job) => {
              if (job?.result) {
                setResult(job.result);
              } else {
                throw new Error("Sonuç henüz hazır değil");
              }
              setIsLoading(false);
            });
          fetchResult().catch(() => {
            // Worker bitti ama cache henüz yazılmış olmayabilir; aynı endpoint'i kısa gecikmeyle tekrar çağır
            return new Promise((r) => setTimeout(r, 300)).then(fetchResult);
          }).catch((err) => {
            setError(err?.message || "Sonuç alınamadı");
            setIsLoading(false);
          });
        }
      };

      const onJobFailed = (payload) => {
        leaveJobRoom(socketHandlersRef.current);
        setError(payload?.error?.message || "Job başarısız oldu");
        setIsLoading(false);
      };

      socketHandlersRef.current = { onProgress, onJobFailed };
      joinJobRoom(jobId, socketHandlersRef.current);
    } catch (err) {
      setError(err.message || "Bir hata oluştu");
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <h1 className={styles.title}>
          <span className={styles.titleIcon}></span>
          Social Graph
          <span className={styles.titleAccent}> Analyzer</span>
        </h1>
        <p className={styles.subtitle}>
          Analyze your GitHub account: discover who doesn't follow you back and
          who you don't follow back.
        </p>
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />
      </section>

      {error && (
        <div className={styles.error}>
          <span>⚠️</span> {error}
        </div>
      )}

      {isLoading && (
        <section className={styles.results}>
          <p className={styles.progressText}>Analyzing {progress}%</p>
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

      {result && !isLoading && (
        <section className={styles.results}>
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
                  ? "Large account — some data may be limited"
                  : "All data was fetched successfully"}
              </p>
            </div>
          </div>

          <StatsCards counts={result.counts} />

          <div className={styles.listsGrid}>
            <UserList
              title="Not Following Back "
              users={result.result.notFollowingBack}
              accentColor="#ef4444"
            />
            <UserList
              title="Not Followed Back"
              users={result.result.notFollowedBack}
              accentColor="#10b981"
            />
          </div>
        </section>
      )}

      <footer className={styles.footer}>
        <p>Built by Kader Kaya</p>
      </footer>
    </main>
  );
}
