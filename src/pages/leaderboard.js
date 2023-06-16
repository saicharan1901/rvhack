import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const leaderboardCollection = collection(db, 'profile');
        const leaderboardQuery = query(leaderboardCollection, orderBy('points', 'desc'));
        const leaderboardSnapshot = await getDocs(leaderboardQuery);

        const leaderboardData = leaderboardSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLeaderboard(leaderboardData);
      } catch (error) {
        console.log('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div>
      <h1>Leaderboard</h1>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={entry.id}>
              <td>{index + 1}</td>
              <td>{entry.username}</td>
              <td>{entry.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
