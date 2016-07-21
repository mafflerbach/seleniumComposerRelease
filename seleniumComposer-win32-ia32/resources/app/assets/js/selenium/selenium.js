const os = require('os');

var Selenium = class Selenium {

  constructor(hub) {
    this.hub = hub;
    this.console = hub + '/grid/console';
    this.register = hub + '/grid/register';
    this.server = hub + '/selenium-server/driver';
  }

  start(browser) {
    var spawn = require('child_process').spawn;

    switch (browser) {
      case 'chrome':
        this.chrome = this._startChrome(spawn);
        break;
      case 'firefox':
        this.firefox = this._startFirefox(spawn);
        break;
      case 'internet explorer':
        this.ie = this._startIe(spawn);
        break;
      case 'MicrosoftEdge':
        this.edge = this._startEdge(spawn);
        break;
      case 'hub':
        this.hub = this._startHub(spawn);
        break;
      default:
        this.chrome = this._startChrome(spawn);
        this.firefox = this._startFirefox(spawn);
        if(os.platform().indexOf('win') >= 0) {
          this.ie = this._startIe(spawn);
          this.edge = this._startEdge(spawn);
        }
        break;
    }

  };


  call(str) {
    var nodes = $.get({
      url: str,
      async: false,
      error: function (err) {
        return false;
      }
    });
    return $(nodes.responseText);
  }


  stop(browser) {
    var process = null;
    switch (browser) {
      case 'chrome':
        this.chrome.kill('SIGINT');
        break;
      case 'firefox':
        this.firefox.kill('SIGINT');
        break;
      case 'internet explorer':
        this.ie.kill('SIGINT');
        break;
      case 'MicrosoftEdge':
        this.edge.kill('SIGINT');
        break;
      case 'hub':
        this.hub.kill('SIGINT');
        break;
      default:
        if (this.chrome != null) {
          this.chrome.kill('SIGINT');
        }
        if (this.ie != null) {
          this.ie.kill('SIGINT');
        }
        if (this.firefox != null) {
          this.firefox.kill('SIGINT');
        }
        if (this.edge != null) {
          this.edge.kill('SIGINT');
        }
        if (this.hubProcess != null) {
          this.hubProcess.kill('SIGINT');
        }
        break;
    }
  }


  updateControls($buttons) {
    var api = new SeleniumApi(this.hub);
    api.updateControls(this.console, $buttons);
    if(intervalStatus == true) {
      intervalManager(false);
    }
  }

  _startChrome(spawn) {
    if (this._checkHub() == false) {
      this._startHub(spawn);
    }

    //@TODO convert \\ to / check on arch and platform look out .exe
    var parameter = new Array(
        '-jar',
        appPath+'/thirdparty/selenium-server.jar',
        '-role',
        'node',
        '-hub' ,
        this.register ,
        '-nodeConfig',
        appPath+'/config/capabilityChrome.json'
    );


    if(os.platform().indexOf('linux') >= 0) {
      console.log(os.arch());
      if (os.arch() == 'x64') {
        parameter.push('-Dwebdriver.chrome.driver='+appPath+'/thirdparty/chromedriver_'+os.platform()+'64/chromedriver');
      } else {
        parameter.push('-Dwebdriver.chrome.driver='+appPath+'/thirdparty/chromedriver_'+os.platform()+'32/chromedriver');
      }

    } else {
      parameter.push('-Dwebdriver.chrome.driver='+appPath+'\\thirdparty\\chromedriver_'+os.platform()+'\\chromedriver.exe');
    }

    var seleniumNode = spawn('java', parameter);
    this._output(seleniumNode);
    return seleniumNode;
  }

  _startFirefox(spawn) {
    if (this._checkHub() == false) {
      this._startHub(spawn);
    }
    var parameter = new Array('-jar', appPath+'/thirdparty/selenium-server.jar',  '-role',  'node',  '-hub', this.register , '-nodeConfig', appPath+'/config/capabilityFirefox.json');

    var seleniumNode = spawn('java', parameter);
    this._output(seleniumNode);
    return seleniumNode;
  }

  _startEdge(spawn) {
    if (this._checkHub() == false) {
      this._startHub(spawn);
    }
    var parameter = new Array('-jar', appPath+'/thirdparty/selenium-server.jar',  '-role',  'node', '-hub',  this.register ,'-nodeConfig', appPath+'\\config\\capabilityEdge.json','-Dwebdriver.edge.driver=thirdparty\\MicrosoftWebDriver\\MicrosoftWebDriver.exe');
    var seleniumNode = spawn('java', parameter);
    this._output(seleniumNode);
    return seleniumNode;
  }

  _startIe(spawn) {
    if (this._checkHub() == false) {
      this._startHub(spawn);
    }

    var parameter = new Array('-jar', appPath+'/thirdparty/selenium-server.jar', '-role', 'node', '-hub' , this.register , '-nodeConfig', appPath+'\\config\\capabilityIe.json','-Dwebdriver.ie.driver='+appPath+'\\thirdparty\\iedriverserver_'+os.platform()+'\\IEDriverServer.exe');
    var seleniumNode = spawn('java', parameter);
    this._output(seleniumNode);
    return seleniumNode;
  }

  _startHub(spawn) {
    if (this._checkHub() == false) {
      var parameter = new Array('-jar', appPath+'/thirdparty/selenium-server.jar' ,'-role' ,'hub');
      var seleniumNode = spawn('java', parameter);
      this._output(seleniumNode);
      this.hubProcess = seleniumNode;

      return seleniumNode;
    }
  }

  _checkHub() {
    var api = new SeleniumApi();
    return api.activeHub(this.console);
  }


  _output(obj) {
    obj.stdout.on('data', (data) => {
      var test = `${data}`;
    $('#terminal-content').append(test+'<br/>');
    $('#terminal-window').scrollTop(1E10);

  })
    ;

    obj.stderr.on('data', (data) => {
      var test = `${data}`;
    $('#terminal-content').append(test+'<br/>');
    $('#terminal-window').scrollTop(1E10);

  })
    ;

    obj.on('close', (code) => {
      var test = `${code}`;
    $('#terminal-content').append('kill process <br/>');
    $('#terminal-window').scrollTop(1E10);
  })
    ;
  }
}
