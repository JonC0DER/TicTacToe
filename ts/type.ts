
export type Player = {
  id: number;
  colorClass: string;
  iconClass: string;
};

export type Move = {
  squareId: number;
  player: Player;
};

export type GameStatus = {
  isComplete: boolean;
  winner: Player;
};

export type Game = {
  moves: Move[];
  status: GameStatus;
};

export type GameState = {
  currentGameMoves: Move[];
  history: {
    currentRoundGames: Game[];
    allGames: Game[];
  };
};

// Cb is for CallBack
export type SaveStateCb = (prevState: GameState) => GameState;

// I want an object that can have an arbitrary number of properties
export type ElementObjectDictionary = {
  // And the key of that property is a string
  // and the value of that property is an Element
  [key in string]: Element;
};
// in View class at the declaration of $
// you can do the same as :
// $: Record<string, Element> = {};


export type StoreStats = {
    playerWithStats: {
        wins: number;
        id: number;
        colorClass: string;
        iconClass: string;
    }[];
    ties: number;
}