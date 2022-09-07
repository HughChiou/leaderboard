import "./leaderboard.css";
import { useEffect, useState } from "react";
import styled from "styled-components";

/* eslint-disable-next-line */
export interface LeaderboardProps {
  className?: string;
}

interface RankingTableProps {
  itemLength?: number;
}

interface PhotoProps {
  src: string;
}

interface ScoreProps {
  score: number;
}

interface LeaderboardData {
  userID: string;
  displayName: string;
  picture: string;
  score: number;
}

interface RankingRowProps {
  index?: number;
}

const StyledLeaderboard = styled.div`
  color: #87ceeb;
  font-family: Menlo, Andale Mono, monospace;
  background-color: #222;
  padding: 1em;
  width: 400px;
  box-sizing: border-box;
`;
const RankingTable = styled.div<RankingTableProps>`
  text-align: center;
  transform: translateX(-0.5em);
  position: relative;
  height: ${(props: any) => props.itemLength * 3}em;
`;
const Photo = styled.img<PhotoProps>`
  width: 2.5em;
  height: 2.5em;
  border-radius: 50%;
  object-fit: contain;
  src: ${(props: any) => props.src};
`;
const RankingRow = styled.div<RankingRowProps>`
  display: grid;
  width: 100%;
  grid-template-columns: 2em 3em 1fr 1fr;
  align-items: center;
  gap: 0.5em;
  position: absolute;
  height: 3em;
  top: ${(props: any) => props.index * 3}em;
  transition: top 0.55s ease-in-out;
  transition-delay: 0.5s;
`;
const DisplayName = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: left;
`;
const Score = styled.div<ScoreProps>`
  text-align: right;
  --score: ${(props: any) => props.score};
`;

export function Leaderboard(props: LeaderboardProps) {
  const [rankingData, setRankingData] = useState<LeaderboardData[]>([]);

  useEffect(() => {
    fetch("https://webcdn.17app.co/campaign/pretest/data.json")
      .then((res) => res.json())
      .then((data) => setRankingData(data));
  }, []);

  useEffect(() => {
    const updated = rankingData
      .map((item) => {
        const addValue =
          Math.random() > 0.6 ? Math.round(Math.random() * 1000) : 0;
        item.score += addValue;

        return {
          ...item,
        };
      })
      .sort((a, b) => b.score - a.score);

    const st = setTimeout(() => {
      setRankingData(updated);
    }, 1000);

    return () => clearTimeout(st);
  }, [rankingData]);

  const rankingList = rankingData.map((item, idx) => (
    <RankingRow key={item.userID} index={idx}>
      <RankingTable>{idx + 1}</RankingTable>
      <Photo src={item.picture} alt={item.displayName} />
      <DisplayName title={item.displayName}>{item.displayName}</DisplayName>
      <Score className="Score" score={item.score}>
        pt
      </Score>
    </RankingRow>
  ));

  return (
    <StyledLeaderboard className={props.className}>
      <RankingTable itemLength={rankingData.length}>{rankingList}</RankingTable>
    </StyledLeaderboard>
  );
}

export default Leaderboard;
