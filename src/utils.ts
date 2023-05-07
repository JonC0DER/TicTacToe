import type {GameState, Player} from './type';

export const players: Player[] = [
  {
    id: 1,
    colorClass: 'yellow',
    iconClass: 'fa-x',
  },
  {
    id: 2,
    colorClass: 'turquoise',
    iconClass: 'fa-o',
  },
];

export const deriveGame = (state: GameState) => {
  const currentPlayer = players[state.currentGameMoves.length % 2];

  const winningPatterns = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ];

  let winner = null;

  for (const player of players) {
    const selectedSquareIds = state.currentGameMoves.filter(
      (move) => move.player.id === player.id
    ).map(move => move.squareId);

    for (const pattern of winningPatterns) {
      // isIncludePatternValue
      const isIPV = pattern.every(
        value => selectedSquareIds.includes(value)
      );

      if (isIPV) {
        winner = player;
      }
    }
  }

  return {
    moves: state.currentGameMoves,
    currentPlayer,
    status: {
      isComplete: winner != null || state.currentGameMoves.length === 9,
      winner,
    },
  }
}

export const deriveStats = (state: GameState) => {
  return {
    playerWithStats: players.map((player) => {
      const wins = state.history.currentRoundGames.filter(
        (game) => game.status.winner?.id === player.id
      ).length;
      return {
        ...player,
        wins,
      };
    }),
    ties: state.history.currentRoundGames.filter(
      (game) => game.status.winner === null
    ).length,
  };
}
