
var sudo = require('electron-sudo');

var InstallerJava = class InstallerJava {

  constructor() {

  }

  runInstaller () {
    $('#terminal-content').append('apt-get install default-jre');
    $('#terminal-window').scrollTop(1E10);


    var options = {
      name: 'install openJre (apt-get install default-jre)',
      process: {
        on: function(ps) {
          ps.stdout.on('data', function(data) {});
          setTimeout(function() {
            ps.kill()
          }.bind(ps), 50000);
        }
      }
    };

    sudo.exec('apt-get install default-jre', options, function(error) {});


    var parameter = new Array('apt-get','-y', 'install', 'default-jre');
    var seleniumNode = spawn('sudo', parameter);
    this._output(seleniumNode);
  }

  installWinInstaller(link) {
    var self = this;


    if (!fs.existsSync(appPath + '/thirdparty/java.exe')) {


      var terminal2 = new Terminal('get java');
      terminal2.updateTerminal();

      download(link).then(data => {
        if (os.platform().indexOf('win') == 0) {
          var filename = 'java.exe';
          fs.writeFileSync(appPath + '/thirdparty/' + filename, data);
          self.sudoJavaInstaller();
          terminal2.clearInterval('done: ' + link);
        }
      });

    } else {
      self.sudoJavaInstaller();
    }
  }

  sudoJavaInstaller() {
    var options = {
      name: 'Java installer',
      process: {
        on: function(ps) {
          ps.stdout.on('data', function(data) {});
          setTimeout(function() {
            ps.kill()
          }.bind(ps), 50000);
        }
      }
    };
    var terminal2 = new Terminal('install java');
    terminal2.updateTerminal();
    sudo.exec(appPath + '/thirdparty/java.exe /s', options, function(error) {});
    terminal2.clearInterval('done: installation');
  }

  getInstaller () {

    var self = this;
// Fucking JAVA, fucking oracle page,
    var link = '';
    switch (os.platform()) {
      case 'win32':
        link = 'http://javadl.oracle.com/webapps/download/AutoDL?BundleId=210185';
        self.installWinInstaller(link);
        break;
      case 'win64':
        link = 'http://javadl.oracle.com/webapps/download/AutoDL?BundleId=210183';
        self.installWinInstaller(link);
        break
      default :
        self.runInstaller();
        break;
    }

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
    $('#terminal-content').append('finish java <br/>');
    $('#terminal-window').scrollTop(1E10);
  })
    ;
  }


}
