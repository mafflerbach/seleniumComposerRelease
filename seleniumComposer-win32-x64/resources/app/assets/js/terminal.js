
var Terminal = class Terminal {

  constructor(message) {
    $('#terminal-content').append(message + '<br/>');

    this.timer = setInterval(function(){ this.updateTerminal() }, 1000);
  }

  updateTerminal() {
    $('#terminal-content').append('-');
  }

  clearInterval(message) {
    clearInterval(this.timer);
    $('#terminal-content').append(message + '<br/>');

  }

  terminalMessage(message) {
    $('#terminal-content').append(message +'<br/>');
    $('#terminal-window').scrollTop(1E10);
  }


}
