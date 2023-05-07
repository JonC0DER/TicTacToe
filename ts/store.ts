import type {GameState, Player, SaveStateCb} from './type';

const initialValue: GameState = {
  currentGameMoves: [],
  history: {
    currentRoundGames: [],
    allGames: [],
  },
}

export default class Store extends EventTarget {

  #state = initialValue;

  storageKey: string;
  players: Player[];
  // you can do this to define shortly your variables
  // constructor(
  //     private readonly storageKey: string,
  //     private readonly players: Player[]
  // ) {

  constructor(key: string, players: Player[]) {
    super();
    this.storageKey = key;
    this.players = players;
  }

  get stats() {
    const state = this.#getState();

    return {
      playerWithStats: this.players.map((player) => {
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

  get game() {
    const state = this.#getState();

    const currentPlayer = this.players[state.currentGameMoves.length % 2];

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

    for (const player of this.players) {
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

  playerMove(squareId: number) {
    const stateClone = structuredClone(this.#getState());

    stateClone.currentGameMoves.push({
      squareId,
      player: this.game.currentPlayer,
    });

    this.#setState(stateClone);
  }

  reset() {
    const stateClone = structuredClone(this.#getState());

    const { moves, status } = this.game;

    if (status.isComplete) {
      stateClone.history.currentRoundGames.push({
        moves,
        status,
      });
    }

    stateClone.currentGameMoves = [];
    this.#setState(stateClone);
  }

  newRound() {
    this.reset();

    const stateClone = structuredClone(this.#getState()) as GameState;
    stateClone.history.allGames.push(...stateClone.history.currentRoundGames);
    stateClone.history.currentRoundGames = [];

    this.#setState(stateClone);
  }

  #getState() {
    const item = window.localStorage.getItem(this.storageKey);
    return item ? JSON.parse(item) as GameState : this.#state;
  }

  #setState(stateOrFn: GameState | SaveStateCb) {
    const prevState = this.#getState(); 1

    let newState

    switch (typeof stateOrFn) {
      case 'function':
        newState = stateOrFn(prevState);
        break;
      case 'object':
        newState = stateOrFn;
        break;
      default:
        throw new Error('Invalid argument passed to setState');
    }

    window.localStorage.setItem(this.storageKey, JSON.stringify(newState));

    this.dispatchEvent(new Event("statechange"));
  }
};
