"use client";

import { useEffect, useState } from "react";
import TeamCard from "@/components/TeamCard";
import PlayerCardSummary from "@/components/PlayerCardSummary";
import RequestButton from "@/components/RequestButton";
import CreateTeamButton from "@/components/CreateTeamButton";
import Link from "next/link";
import styles from "./page.module.css";

export default function Page() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Dynamically import the lib functions so they aren't bundled in a way
        // that tries to run during static generation.
        const { getTeams } = await import("@/lib/getTeams");
        const { getPlayers } = await import("@/lib/getPlayers");

        const teamsData = await getTeams();
        const playersData = await getPlayers();

        setTeams(teamsData);
        setPlayers(playersData);
      } catch (error) {
        console.error("Failed to fetch blockchain data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <main className={styles["page-container"]}>
        <div className={styles["page-wrapper"]}>
          <p>Loading basketball data...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles["page-container"]}>
      <div className={styles["page-wrapper"]}>
        {/* 👋 Welcome Section */}
        <section className={styles.heroBanner}>
          <div className={styles.hero}>
            <h1 className={styles["hero-title"]}>Welcome to BasketChain 🏀</h1>
            <p className={styles["hero-text"]}>
              Discover basketball teams, explore player NFTs, and interact with smart contracts — all on-chain.
            </p>
          </div>
        </section>

        {/* 📋 Registered Teams */}
        <section>
          <div className={styles["section-header"]}>
            <h2 className={styles["section-title"]}>Registered Teams</h2>
            <CreateTeamButton />
          </div>

          {teams.length === 0 ? (
            <p className={styles["no-data-text"]}>No teams found.</p>
          ) : (
            <div className={styles["grid-layout"]}>
              {teams.map((address, i) => (
                <TeamCard key={i} address={address} />
              ))}
            </div>
          )}
        </section>

        {/* 🎽 Registered Players */}
        <section>
          <div className={styles["section-header"]}>
            <h2 className={styles["section-title"]}>Registered Players</h2>
            <Link href="/players/add">
              <button className={styles["actionButton"]}>📝 Register New Player</button>
            </Link>
          </div>
          {players.length === 0 ? (
            <p className={styles["no-data-text"]}>No players found.</p>
          ) : (
            <div className={styles["grid-layout"]}>
              {players.map((address, i) => (
                <PlayerCardSummary key={i} address={address} />
              ))}
            </div>
          )}
        </section>
        <div className={styles.requestButtonContainer}>
          <RequestButton />
        </div>
      </div>
    </main>
  );
}