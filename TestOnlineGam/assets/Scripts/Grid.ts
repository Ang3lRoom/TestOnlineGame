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

    @property(cc.Node)
    SmallStateSprite: cc.Node = null;

    @property(cc.SpriteFrame)
    public SmallStateSprites: cc.SpriteFrame[] = [];

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
            let smallSprite = player === 1 ? this.SmallStateSprites[1] : this.SmallStateSprites[0];
            this.SmallStateSprite.getComponent(cc.Sprite).spriteFrame = smallSprite;
          });

          // Create an object to store the game points earned by each player
        let playerGamePoints = {
            1: 0,
            2: 0
        };
        
        this.socket.on('win', (player) => {
            console.log(`Player ${player} wins!`);
        
            this.socket.on('game-points-updated', (data) => {
                let player = data.player;
                let points = data.points;
                // Update the game points UI for the player who earned the points
                playerGamePoints[player] = points;
                this.mainUI.setGamePoints(player, playerGamePoints[player]);
              });
        
            // Increase the game points earned by the winning player and send an update message to the server
            playerGamePoints[player]++;
            this.socket.emit('update-game-points', { player: player, points: playerGamePoints[player] });

            // Update the game points UI for the winning player
            this.mainUI.setGamePoints(player, playerGamePoints[player]);
        
            // Reset the grid after updating the game points UI
            this.resetGrid();
        
            // Show a win message to the player
            // Reset the game board
        });
        
          
          this.socket.on('draw', () => {
            console.log('Draw!');
            // Show a draw message to the player
            // Reset the game board
          });
          
     }

     resetGrid() {
        // Remove all markers from the cells
        for (let i = 0; i < 9; i++) {
          let cell = this.cells[i];
          // Remove all child nodes from the cell
          cell.removeAllChildren();
        }
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

        let smallSprite = player === 1 ? this.SmallStateSprites[1] : this.SmallStateSprites[0];
        this.SmallStateSprite.getComponent(cc.Sprite).spriteFrame = smallSprite;

        // Emit a "move" event to the server with the player number and cell index
        let data = {
            player: player,
            cell: this.cells.indexOf(cell)
        };
        this.socket.emit('move', data);
    }
    
}
