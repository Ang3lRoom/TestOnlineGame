import ButtonDisabler from "../UI/ButtonDisabler";
import { FadeBase } from "./FadeBase";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("FadeObject/Fade")
export default class Fade extends FadeBase
{
    public fadeIn() 
    {
        this.object.active = true;
        this.object.opacity = 0;
        ButtonDisabler.disableButtons();
        this.scheduleOnce(function() 
        {
            this.object.runAction(cc.sequence(cc.delayTime(this.Delay), cc.fadeIn(this.Duration)));
        }, this.Delay);
        this.scheduleOnce(function() 
        {
            ButtonDisabler.enableButtons();
        }, this.Duration);
    }

    public fadeOut() 
    {
        this.object.opacity = 255;
        ButtonDisabler.disableButtons();
        this.scheduleOnce(function() 
        {
            this.object.runAction(cc.sequence(cc.delayTime(this.Delay), cc.fadeOut(this.Duration)));
        }, this.Delay);
        this.scheduleOnce(function() 
        {
            ButtonDisabler.enableButtons();
            this.object.active = false;
        }, this.Duration);
    }
   
}