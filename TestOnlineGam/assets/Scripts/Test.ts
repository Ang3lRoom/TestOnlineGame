import { io } from "socket.io-client";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    start () {
        const leftButton = this.node.getChildByName('leftButton');
        const rightButton = this.node.getChildByName('rightButton');
        const player1Sprite = this.node.getChildByName('player1');
        const player2Sprite = this.node.getChildByName('player2');
        const socket = io();
        
        // Handle left button click for player 1
        leftButton.on('click', () => {
          player1Sprite.x -= 10;
          socket.emit('player1-moved', { x: player1Sprite.x, y: player1Sprite.y });
        });
        
        // Handle right button click for player 1
        rightButton.on('click', () => {
          player1Sprite.x += 10;
          socket.emit('player1-moved', { x: player1Sprite.x, y: player1Sprite.y });
        });
        
        // Listen for updates to player 2's position from the server
        socket.on('player2-moved', (player) => {
          player2Sprite.x = player.x;
          player2Sprite.y = player.y;
        });
        
    }

    // update (dt) {}
}
