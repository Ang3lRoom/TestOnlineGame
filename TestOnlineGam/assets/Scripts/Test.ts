import { io } from "socket.io-client";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Test extends cc.Component {

    @property(cc.Node)
    player1Sprite: cc.Node = null;

    @property(cc.Node)
    player2Sprite: cc.Node = null;

    start () {
        const socket = io('http://127.0.0.1:3000');

        // Listen for initial positions from the server
        socket.on('initial-positions', (positions) => {
            this.player1Sprite.setPosition(positions.player1.x, positions.player1.y);
            this.player2Sprite.setPosition(positions.player2.x, positions.player2.y);
        });

        // Handle left button click for player 1
        const leftButton = this.node.getChildByName('leftButton');
        leftButton.on('click', () => {
            this.player1Sprite.x -= 10;
            socket.emit('player1-moved', { x: this.player1Sprite.x, y: this.player1Sprite.y });
        });

        // Handle right button click for player 1
        const rightButton = this.node.getChildByName('rightButton');
        rightButton.on('click', () => {
            this.player1Sprite.x += 10;
            socket.emit('player1-moved', { x: this.player1Sprite.x, y: this.player1Sprite.y });
        });

        // Listen for updates to player 2's position from the server
        socket.on('player2-moved', (player) => {
            this.player2Sprite.x = player.x;
            this.player2Sprite.y = player.y;
        });
    }
}
