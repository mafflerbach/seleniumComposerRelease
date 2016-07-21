var getos = require('getos');
const osName = require('os-name');

var InstallerFirefox = class InstallerFirefox {

  constructor() {

  }

  _output(obj) {
    obj.stdout.on('data', (data) => {
      var test = `${data}`;
    $('#terminal-content').append(test + '<br/>');
    $('#terminal-window').scrollTop(1E10);
  })
    ;

    obj.stderr.on('data', (data) => {
      var test = `${data}`;
    $('#terminal-content').append(test + '<br/>');
    $('#terminal-window').scrollTop(1E10);

  })
    obj.stderr.on('message', (data) => {
      var test = `${data}`;
    $('#terminal-content').append(test + '<br/>');
    $('#terminal-window').scrollTop(1E10);
  })
    ;

    obj.on('close', (code) => {
      var test = `${code}`;
      $('#terminal-content').append('finish install firefox <br/>');
      $('#terminal-window').scrollTop(1E10);
    })
    ;
  }

  runInstaller () {
    $('#terminal-content').append('apt-get install firefox');
    $('#terminal-window').scrollTop(1E10);
    var parameter = new Array('apt-get','-y', 'install', 'firefox');
    var seleniumNode = spawn('sudo', parameter);
    this._output(seleniumNode);
  }


  installWinInstaller(link) {
    var self = this;
    var terminal2 = new Terminal('get Firefox');
    terminal2.updateTerminal();
    download(link).then(data => {
      fs.writeFileSync(appPath + '/thirdparty/firefox.exe', data);
      var parameter = new Array('-ms');
      var seleniumNode = spawn(appPath + '/thirdparty/firefox.exe', parameter);
      that._output(seleniumNode);
      terminal.clearInterval('done: ' + link);
    });
  }



  getInstaller() {

    var link = '';

    switch (os.platform()) {
      case 'win32':
        link = 'https://download.mozilla.org/?product=firefox-latest&os=win&lang=en-US';
        this.installWinInstaller(link);
        break;
      case 'win64':
        link = 'https://download.mozilla.org/?product=firefox-latest&os=win64&lang=en-US';
        this.installWinInstaller(link);
        break
      default :
        this.runInstaller()
        break;
    }

    return true;
  }



  getRevision () {
    var terminal = new Terminal('get Revision');
    var winLink ="https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/Linux_x64%2FLAST_CHANGE?alt=media";
    var linux ="https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/Win_x64%2FLAST_CHANGE?alt=media";

    download(winLink).then(data => {
      fs.writeFileSync(appPath + '/thirdparty/chromerelease.txt', data);

    fs.readFile(appPath + '/thirdparty/chromerelease.txt', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      console.log(data);
    });

    terminal.clearInterval('done: ' + link);
  })

  }


  command(type) {
    switch (type) {
      case 'linux':

        break;
      case 'win':

        break;
    }
  }

}
