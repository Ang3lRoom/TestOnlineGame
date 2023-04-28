const {ccclass, property} = cc._decorator;

@ccclass
export default class ButtonDisabler extends cc.Component {
    static isEnabled = false;

    static disableButtons() {
        const buttons = cc.find('Canvas').getComponentsInChildren(cc.Button);
        for (let i = 0; i < buttons.length; ++i) {
            buttons[i].interactable = false;
        }
        ButtonDisabler.isEnabled = false;
    }
    

    static enableButtons() {
        const buttons = cc.find('Canvas').getComponentsInChildren(cc.Button);
        for (let i = 0; i < buttons.length; ++i) {
            buttons[i].interactable = true;
        }
        ButtonDisabler.isEnabled = true;
    }

    onLoad() {
        this.scheduleOnce(() => {
            ButtonDisabler.disableButtons();

            // Enable buttons and touch input after 5 seconds
            setTimeout(() => {
                ButtonDisabler.enableButtons();
            }, 1000);
        }, 1);
    }
}
