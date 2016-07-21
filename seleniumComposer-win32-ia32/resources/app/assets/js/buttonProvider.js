var buttonProvider = class buttonProvider {

  constructor() {
  }


  getButtons () {

    var buttons = [];

    if(os.platform().indexOf('win') != -1 && parseInt(os.release()) == 10) {
      buttons.push(this._buttonTemplate('MicrosoftEdge', 'Microsoft Edge'));
      buttons.push(this._buttonTemplate('internet explorer', 'Internet Explorer 11'));
    } else if(os.platform().indexOf('win') != -1 && parseInt(os.release()) < 10) {
      buttons.push(this._buttonTemplate('internet explorer', 'Internet Explorer 11'));
    }

    buttons.push(this._buttonTemplate('firefox', 'Firefox'));
    buttons.push(this._buttonTemplate('chrome', 'Chrome'));
    buttons.push(this._buttonTemplate('all', 'All'));

    return buttons;
  }

  _buttonTemplate(browser, label) {

    var html = '<button class="mdl-button mdl-js-button mdl-button--raised" data-browser="'+browser+'" data-command="run">Start '+label+'</button>' +
        '<button class="mdl-button mdl-js-button mdl-button--raised" data-browser="'+browser+'" data-command="stop" style="display:none">Stop '+label+'</button>'

    return html;
  }

}