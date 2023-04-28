const {ccclass, property} = cc._decorator;

@ccclass
export abstract class FadeBase extends cc.Component {
    @property(Number)
    public Duration: number = .15;
    public get GetDuration(): number { return this.Duration; }

    @property(Number)
    public Delay: number = 0;
    public get GetDelay(): number { return this.Delay; }

    @property(cc.Node)
    protected object: cc.Node;
    public get GetObj(): cc.Object { return this.object; }

    public abstract fadeIn()
    public abstract fadeOut()

}