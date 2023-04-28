import Fade from "../Utils/Fade";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainUI extends cc.Component {

    @property(cc.Node)
    gameState: cc.Node = null;

    setGameState(player){
        this.gameState.getChildByName("text").getComponent(cc.Label).string = `Player ${player} wins!`;
        this.gameState.getComponent(Fade).fadeIn();
    }

}
