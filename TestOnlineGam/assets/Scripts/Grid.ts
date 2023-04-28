import { io } from "socket.io-client";
import MainUI from "./UI/MainUI";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TicTacToeGrid extends cc.Component {

    @property(cc.Prefab)
    circlePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    crossPrefab: cc.Prefab = null;

    @property(cc.Integer)
    cellSize: number = 100;

    @property(cc.Node)
    public cells: cc.Node[] = [];

    private socket: any = null; // Declare socket as a private property

    playerNumber = 0; // numOfPlayers

    @property(MainUI)
    mainUI: MainUI = null;

    start () {
         this.socket = io('http://127.0.0.1:3000');
 
         // Listen for player number message from the server
         this.socket.on('player-number', (playerNumber) => {
            this.playerNumber = playerNumber;
            if (playerNumber === 1) {
                // Player 1 logic
            } else if (playerNumber === 2) {
                // Player 2 logic
            }
        })        
         
         // Create the cells for the Tic Tac Toe grid
        for (let i = 0; i < 9; i++) {
            const leftButton = this.cells[i];
            leftButton.on(cc.Node.EventType.TOUCH_END, this.onCellTouched, this);
        }

        this.socket.on('move', (data) => {
            let player = data.player;
            let cellIndex = data.cell;
            // Update the game board with the player's marker
            let cell = this.cells[cellIndex];
            let markerPrefab = player === 1 ? this.circlePrefab : this.crossPrefab;
            let marker = cc.instantiate(markerPrefab);
            marker.parent = cell;
            marker.setPosition(0, 0);
          });
          
          this.socket.on('win', (player) => {
            console.log(`Player ${player} wins!`);
            this.mainUI.setGameState(player);
            console.log("Testin");
            // Show a win message to the player
            // Reset the game board
          });
          
          this.socket.on('draw', () => {
            console.log('Draw!');
            // Show a draw message to the player
            // Reset the game board
          });
     }

     private onCellTouched(event: cc.Event.EventTouch) {
        let cell = event.currentTarget;
        // Check if the cell is already marked and return if it is
        if (cell.childrenCount > 0) {
            return;
        }
        // Determine which player's turn it is based on the number of cells already marked
        let player = (this.cells.filter(c => c.childrenCount > 0).length % 2) + 1;
        // Create the appropriate marker for the player and add it to the cell
        let markerPrefab = player === 1 ? this.circlePrefab : this.crossPrefab;
        let marker = cc.instantiate(markerPrefab);
        // Set the position of the parent node to (0, 0) before adding the marker
        marker.parent = cell;
        marker.setPosition(0, 0);
        // Emit a "move" event to the server with the player number and cell index
        let data = {
            player: player,
            cell: this.cells.indexOf(cell)
        };
        this.socket.emit('move', data);
    }
    
}
