import { io } from "socket.io-client";

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
    
    private checkWin(player: number): boolean {
        let marks = this.cells.map(c => c.childrenCount > 0 && c.children[0].name.startsWith(`player${player}`) ? 1 : 0);
        let rows = [marks.slice(0, 3), marks.slice(3, 6), marks.slice(6)];
        let cols = [[marks[0], marks[5], marks[6]], [marks[1], marks[4], marks[7]], [marks[2], marks[3], marks[8]]];
        let diags = [[marks[0], marks[4], marks[8]], [marks[2], marks[4], marks[6]]];
        return rows.some(r => r.every(m => m === 1)) ||
               cols.some(c => c.every(m => m === 1)) ||
               diags.some(d => d.every(m => m === 1));
    }
    
}
