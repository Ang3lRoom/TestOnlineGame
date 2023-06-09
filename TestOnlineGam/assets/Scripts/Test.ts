import { io } from "socket.io-client";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Test extends cc.Component {

    @property(cc.Node)
    player1Sprite: cc.Node = null;

    @property(cc.Node)
    player2Sprite: cc.Node = null;

    private socket: any = null; // Declare socket as a private property

    playerNumber = 0; // numOfPlayers

    start () {
        
       /* this.socket = io('http://127.0.0.1:3000');

        // Listen for player number message from the server
        this.socket.on('player-number', (playerNumber) => {
            this.playerNumber = playerNumber;

            if (playerNumber === 1) {
                // This client is player 1
                this.player1Sprite.active = true;
                this.player2Sprite.active = true;
            } else if (playerNumber === 2) {
                // This client is player 2
                this.player1Sprite.active = true;
                this.player2Sprite.active = true;
            }
        });

        // Listen for position updates from the server and update the player sprites
        this.socket.on('position-update', (positions) => {
            this.player1Sprite.setPosition(positions.player1.x, positions.player1.y);
            this.player2Sprite.setPosition(positions.player2.x, positions.player2.y);
        });

        // Listen for initial positions from the server
        this.socket.on('initial-positions', (positions) => {
            this.player1Sprite.setPosition(positions.player1.x, positions.player1.y);
            this.player2Sprite.setPosition(positions.player2.x, positions.player2.y);
        });

        // Handle left button click for both players
        const leftButton = this.node.getChildByName('leftButton');
        leftButton.on('click', () => {
            if (this.playerNumber === 1) {
                this.player1Sprite.x -= 10;
            } else if (this.playerNumber === 2) {
                this.player2Sprite.x -= 10;
            }
            this.socket.emit('position-update', {
                player1: { x: this.player1Sprite.x, y: this.player1Sprite.y },
                player2: { x: this.player2Sprite.x, y: this.player2Sprite.y }
            });
        });

        // Handle right button click for both players
        const rightButton = this.node.getChildByName('rightButton');
        rightButton.on('click', () => {
            if (this.playerNumber === 1) {
                this.player1Sprite.x += 10;
            } else if (this.playerNumber === 2) {
                this.player2Sprite.x += 10;
            }
            this.socket.emit('position-update', {
                player1: { x: this.player1Sprite.x, y: this.player1Sprite.y },
                player2: { x: this.player2Sprite.x, y: this.player2Sprite.y }
            });
        });

        // Listen for updates to player 2's position from the server
        this.socket.on('player2-moved', (player) => {
            this.player2Sprite.x = player.x;
            this.player2Sprite.y = player.y;
        });*/
    }
}
