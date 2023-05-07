import React from 'react';
import './App.css';
import Footer from './components/Footer';
import Modal from './components/Modal';
import Menu from './components/Menu';
import { GameState, Player } from './type';
import {useLocalStorage} from './useLocalStorage';
import { deriveGame, deriveStats } from './utils';


export default function App() {

  const [state, setState] = useLocalStorage<GameState>("game-state-key", {
    currentGameMoves: [],
    history: {
      currentRoundGames: [],
      allGames: [],
    },
  } );
  // } as GameState);

  const game = deriveGame(state);
  const stats = deriveStats(state);

  const resetGame = (isNewRound: boolean) => {
    setState((prev) => {

      const stateClone = structuredClone(prev);
      
      const { moves, status } = game;
      
      if (status.isComplete) {
        stateClone.history.currentRoundGames.push({
          moves,
          status,
        });
      }
      
      stateClone.currentGameMoves = [];

      if (isNewRound) {
        stateClone.history.allGames.push(
          ...stateClone.history.currentRoundGames
        );
        stateClone.history.currentRoundGames = [];
      }

      return stateClone;
    });
  }

  const handlePlayerMove = (squareId: number, player: Player) => {
    setState((prev) => {
      const stateClone = structuredClone(prev);
      
      stateClone.currentGameMoves.push({
        squareId,
        player,
      });
      
      return stateClone;
    });
  };

  return (
    <>
      <main>
        <div className="grid">

          {/* <!-- Trun indicator --> */}
          <div className={`turn ${game.currentPlayer.colorClass}`}>
            <i className={`fa-solid ${game.currentPlayer.iconClass}`}></i>
            <p>Player {game.currentPlayer.id}, you're up!</p>
          </div>

          <Menu onAction={(action) => resetGame(action === 'new-round')} /> 

          {/* <!-- Game Board --> */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((squareId) => {
            
            const existingMove = game.moves.find(
              (move) => move.squareId === squareId
            );

            return (
              <div key={squareId} className="square shadow"
                onClick={() => {
                  if (existingMove) return;
                  
                  handlePlayerMove(squareId, game.currentPlayer);
                }}
              >
                {existingMove && <i 
                  className={
                    `fa-solid 
                    ${existingMove.player.colorClass} 
                    ${existingMove.player.iconClass}`
                  }>
                </i>}
              </div>
            );
          })}

          {/* <!-- Score Board --> */}
          <div className="score shadow bg-yellow">
            <p>Player 1</p>
            <span data-id="player1-stats">
              {stats.playerWithStats[0].wins}
            </span>
          </div>
          <div className="score shadow bg-light-gray">
            <p>Ties</p>
            <span data-id="ties">
              {stats.ties}
            </span>
          </div>
          <div className="score shadow bg-turquoise">
            <p>Player 2</p>
            <span data-id="player2-stats">
              {stats.playerWithStats[1].wins}
            </span>
          </div>

        </div>

      </main>
      
      <Footer />

      {game.status.isComplete && <Modal 
        message={
          game.status.winner 
            ? `Player ${game.status.winner.id} wins!` 
            : 'Tie Game!'
        }
        onClick={() => resetGame(false)}
      />}
    </>
  );
}
