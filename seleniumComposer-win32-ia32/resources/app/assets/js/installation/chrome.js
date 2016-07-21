
var InstallerChrome = class InstallerChrome {

  constructor() {

  }

  installWinInstaller(link) {
    terminal.terminalMessage(link)
    download(link , appPath+'/thirdparty').then(data => {
      terminal.clearInterval('done: ' + link );
      var seleniumNode = spawn(appPath + '/thirdparty/ChromeSetup.exe');
      that._output(seleniumNode);
    });
  }
  getInstaller() {

    var link = ''
    switch (os.platform()) {
      case 'win32':
        link ="https://dl.google.com/tag/s/appguid%3D%7B8A69D345-D564-463C-AFF1-A69D9E530F96%7D%26iid%3D%7BD3585D62-F229-BBB7-807A-3D642C471CEE%7D%26lang%3Dde%26browser%3D4%26usagestats%3D0%26appname%3DGoogle%2520Chrome%26needsadmin%3Dprefers%26installdataindex%3Ddefaultbrowser/update2/installers/ChromeSetup.exe";
        this.installWinInstaller(link);
        break;
      case 'win64':
        link ="https://dl.google.com/tag/s/appguid%3D%7B8A69D345-D564-463C-AFF1-A69D9E530F96%7D%26iid%3D%7BD3585D62-F229-BBB7-807A-3D642C471CEE%7D%26lang%3Dde%26browser%3D4%26usagestats%3D0%26appname%3DGoogle%2520Chrome%26needsadmin%3Dprefers%26installdataindex%3Ddefaultbrowser/update2/installers/ChromeSetup.exe";
        this.installWinInstaller(link);
        break
      default :
        this.runInstaller();
        break;
    }

  }

  runInstaller () {
    $('#terminal-content').append('apt-get install chromium-browser');
    $('#terminal-window').scrollTop(1E10);
    var parameter = new Array('apt-get','-y', 'install', 'chromium-browser');
    var seleniumNode = spawn('sudo', parameter);

    this._output(seleniumNode);

    $('#terminal-content').append('create symlink to chrome');
    $('#terminal-window').scrollTop(1E10);
    var parameter = new Array('ln','-s', '/usr/bin/chromium-browser', '/usr/bin/chrome');
    var seleniumNode = spawn('sudo', parameter);

    this._output(seleniumNode);
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
      $('#terminal-content').append('finish chrome <br/>');
      $('#terminal-window').scrollTop(1E10);
    })
    ;
  }



}
