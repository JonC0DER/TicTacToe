import Store from "./store";
import { ElementObjectDictionary, Game, Move, Player, StoreStats } from "./type";

export default class View {
  $: ElementObjectDictionary = {};
  $$: Record<string, NodeListOf<Element>> = {};

  constructor() {
    this.$.grid = this.#qs('[data-id="grid"]');

    this.$.menu = this.#qs('[data-id="action"]');
    this.$.menuBtn = this.#qs('[data-id="menu-btn"]');
    this.$.menuItems = this.#qs('[data-id="menu-items"]');
    this.$.resetBtn = this.#qs('[data-id="reset-btn"]');
    this.$.newRoundBtn = this.#qs('[data-id="new-round-btn"]');
    this.$.modal = this.#qs('[data-id="modal"]');
    this.$.modalText = this.#qs('[data-id="modal-text"]');
    this.$.modalBtn = this.#qs('[data-id="modal-btn"]');
    this.$.turn = this.#qs('[data-id="turn"]');
    this.$.p1Wins = this.#qs('[data-id="player1-stats"]');
    this.$.p2Wins = this.#qs('[data-id="player2-stats"]');
    this.$.ties = this.#qs('[data-id="ties"]');

    this.$$.squares = this.#qsAll('[data-id="square"]');

    // UI-only event listener 
    this.$.menuBtn.addEventListener("click", (event) => {
      this.#toggleMenu();
    });
  }

  render(game: Store['game'], stats: StoreStats) {
    const { playerWithStats, ties } = stats;
    const {
      moves,
      currentPlayer,
      status: { isComplete, winner },
    } = game;

    this.#closeAll();
    this.#clearMoves();
    this.#updateSoreboard(
      playerWithStats[0].wins,
      playerWithStats[1].wins,
      ties
    );
    this.#initializeMoves(moves);

    if (isComplete) {
      this.#openModal(
        winner
          ? `Player ${winner.id} wins!`
          : 'Tie game!'
      );
    }

    this.#setTrunIndicator(currentPlayer);
  }

  /**
   * Register all the event listeners 
   */

  binGameResetEvent(handler: EventListener) {
    this.$.resetBtn.addEventListener('click', handler);
    this.$.modalBtn.addEventListener('click', handler);
  }

  binNewRoundEvent(handler: EventListener) {
    this.$.newRoundBtn.addEventListener('click', handler);
  }

  binPlayerMoveEvent(handler: (el: Element) => void) {
    // this.$$.squares.forEach(square => {
    //   square.addEventListener('click', () => handler(square));
    // });
    this.#delegate(this.$.grid, '[data-id="square"]', 'click', handler);
  }

  /**
   * DOM helper methods
   */
  #updateSoreboard(p1Wins: number, p2Wins: number, ties: number) {
    this.$.p1Wins.textContent = `${p1Wins} wins`;
    this.$.p2Wins.textContent = `${p2Wins} wins`;
    this.$.ties.textContent = `${ties} ties`;
  }

  #openModal(message: string) {
    this.$.modal.classList.remove('hidden');
    this.$.modalText.textContent = message;
  }

  #closeAll() {
    this.#closeModal();
    this.#closeMenu();
  }

  #clearMoves() {
    this.$$.squares.forEach((square) => {
      square.replaceChildren();
    });
  }

  #initializeMoves(moves: Move[]) {
    this.$$.squares.forEach(square => {
      const existingMove = moves.find(
        (move) => move.squareId === +square.id
      );

      if (existingMove) {
        this.#handlePlayerMove(square, existingMove.player);
      }
    });
  }

  #closeModal() {
    this.$.modal.classList.add('hidden');
  }

  #closeMenu() {
    this.$.menuItems.classList.add('hidden');
    this.$.menuBtn.classList.remove('border');

    // const icon = this.$.menuBtn.querySelector("i");
    const icon = this.#qs('i', this.$.menuBtn);

    // icon?.classList.add('fa-chevron-down');
    // cette soluce peut générer des bugs si l'élément est undefined
    icon.classList.add('fa-chevron-down');
    icon.classList.remove('fa-chevron-up');
  }

  #toggleMenu() {
    this.$.menuItems.classList.toggle('hidden');
    this.$.menuBtn.classList.toggle('border');

    const icon = this.#qs('i', this.$.menuBtn);

    icon.classList.toggle('fa-chevron-down');
    icon.classList.toggle('fa-chevron-up');
  }

  #handlePlayerMove(squareEl: Element, player: Player) {
    const icon = document.createElement('i');
    icon.classList.add(
      'fa-solid', player.iconClass, player.colorClass,
    );
    squareEl.replaceChildren(icon);
  }

  // player = 1 | 2 
  #setTrunIndicator(player: Player) {
    const icon = document.createElement('i');
    const label = document.createElement('p');

    icon.classList.add('fa-solid', player.colorClass, player.iconClass);

    label.classList.add(player.colorClass);

    //const playerNb = player === 1 ? 1 : 2;

    label.textContent = `Player ${player.id}, you're up!`;

    this.$.turn.replaceChildren(icon, label);
  }

  #qs(selector: string, parent?: Element) {
    const el = parent
      ? parent.querySelector(selector)
      : document.querySelector(selector);

    if (!el) throw new Error('Could not find element(s)');

    return el;
  }

  #qsAll(selector: string) {
    const elList = document.querySelectorAll(selector);

    if (!elList) throw new Error('Could not find element(s)');

    return elList;
  }

  #delegate(
    el: Element, 
    selector: string, 
    eventKey: string, 
    handler: (el: Element) => void
  ) {
    el.addEventListener(eventKey, (event) => {
      
      if (!(event.target instanceof Element)) {
        throw new Error('Event target not found');
      }

      if (event.target.matches(selector)) {
        handler(event.target);
      }
    });
  }
}