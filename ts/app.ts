import Store from './store.js';
import { Player } from './type';
import View from "./view.js";

const players: Player[] = [
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

function init() {
  const view = new View();
  const store = new Store('live-t3-storage-key', players);

  // current tab state changes
  store.addEventListener('statechange', () => {
    view.render(store.game, store.stats);
  });

  // different tab state changes
  window.addEventListener("storage", () => {
    console.log('State change from a other tab');
    view.render(store.game, store.stats);
  });

  // first load of the document 
  view.render(store.game, store.stats);

  view.binGameResetEvent((event) => {
    store.reset();
    // view.render(store.game, store.stats);
  });

  view.binNewRoundEvent((event) => {
    store.newRound();
    // view.render(store.game, store.stats);
  });

  view.binPlayerMoveEvent((square) => {
    // console.log(square);

    const existingMove = store.game.moves.find(
      (move) => move.squareId === +square.id
    );

    if (existingMove) {
      return
    }

    // place an icon of the current player in the square 
    // view.handlePlayerMove(square, store.game.currentPlayer);

    // Advance the next state by pushing a move to the moves array 
    store.playerMove(+square.id);
    // view.render(store.game, store.stats);
  });

}

window.addEventListener("load", init);