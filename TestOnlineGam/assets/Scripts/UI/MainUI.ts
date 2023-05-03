import Fade from "../Utils/Fade";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainUI extends cc.Component {

    @property(cc.Node)
    gameState: cc.Node = null;

    @property(cc.Label)
    player1Points: cc.Label = null;
    @property(cc.Label)
    player2Points: cc.Label = null;
    player1Point = 0;
    player2Point = 0;

    setGameState(player){
        this.gameState.getChildByName("text").getComponent(cc.Label).string = `Player ${player} wins!`;
        this.gameState.getComponent(Fade).fadeIn();
    }

    setGamePoints(player, points) {
        if (player === 1) {
          this.player1Point = points;
          this.player1Points.string = this.player1Point.toString();
        } else {
            this.player2Point = points;
          this.player2Points.string = this.player2Point.toString();
        }
      }
}
