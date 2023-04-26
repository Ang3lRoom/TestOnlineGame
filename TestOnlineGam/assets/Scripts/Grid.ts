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

    onLoad() {
        // Create the cells for the Tic Tac Toe grid
        for (let i = 0; i < 9; i++) {
            this.cells[i].on(cc.Node.EventType.TOUCH_END, this.onCellTouched, this);
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
        // Check for a win condition
        if (this.checkWin(player)) console.log(`Player ${player} wins!`);
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
