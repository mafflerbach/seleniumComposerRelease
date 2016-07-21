const fs = require('fs');
const download = require('download');
const decompress = require('decompress');
const remote = require('electron').remote;
app = remote.require('electron');
const appPath = app.app.getAppPath();
const spawn = require('child_process').spawn;


var Dependencies = class Dependencies {

  constructor() {
  }


  getallDriver() {
    var me = 'http://chromedriver.storage.googleapis.com';
    this._loadDriverlist(me, 'chromedriver', 4);

    var me = 'http://selenium-release.storage.googleapis.com';
    this._loadDriverlist(me, 'IEDriverServer', 2);

    var filename = 'selenium-server.jar';
    var me = 'http://selenium-release.storage.googleapis.com';
    this._loadDriverlist(me, 'selenium-server-standalone', 1, filename);

    var extract = false;
    var url = 'https://download.microsoft.com/download/C/0/7/C07EBF21-5305-4EC8-83B1-A6FCC8F93F45/MicrosoftWebDriver.msi';
    $('#terminal-content').append('get: ' + url + '<br/>');
    download(url).then(data => {
      $('#terminal-content').append('done: ' + url + '<br/>');
      fs.writeFileSync(appPath + '/thirdparty/MicrosoftWebDriver.msi', data);
      this._installEdgeWebdriver();
    });
  }


  _loadDriverlist(url, keyword, count, filename) {
    download(url).then(data => {

      var foo = $(data.toString()).find("Key:contains('" + keyword + "')").orderBy(function () {
        return $(this).parent().children('Generation').text();
      });

      for (var i = 0; i < count; i++) {
        var me = url + '/' + foo[i].innerHTML;
        var mu = foo[i].innerHTML.split(/\//);
        $('#terminal-content').append('get: ' + me + '<br/>');
        $('#terminal-window').scrollTop(1E10);
        this._driverDownload(me, mu, filename);
      }
    })
  }

  _driverDownload(me, mu, filename) {
    download(me, appPath + '/thirdparty', {'extract': false}).then(data => {
      if (filename == undefined) {
        filename = mu[1];
      }

      fs.writeFileSync(appPath + '/thirdparty/' + filename, data);
      $('#terminal-content').append('done: ' + me + '<br/>');
      $('#terminal-window').scrollTop(1E10);

      if (filename.indexOf('.jar') < 0) {
        var name = filename.split(/_/);
        var newname = name[0] + '_' + name[1];

        decompress(appPath + '/thirdparty/' + filename, appPath + '/thirdparty/' + newname.replace(/\.zip/, '').toLowerCase()).then(files => {
          $('#terminal-content').append('decompress: ' + filename + '<br/>');
          fs.unlinkSync(appPath + '/thirdparty/' + filename);
          $('#terminal-window').scrollTop(1E10);
        });
      }
    });
  }

  _installEdgeWebdriver() {
    var parameter = new Array('/a', appPath + '\\thirdparty\\MicrosoftWebDriver.msi', '/L*v', appPath + '\\install.log', 'TARGETDIR=' + appPath + '\\thirdparty\\MicrosoftWebDriver', '/quiet');
    var seleniumNode = spawn('msiexec', parameter);
    _output(seleniumNode);
    $('#terminal-content').append('install: Edge Driver <br/>');

    function _output(obj) {
      obj.stdout.on('data', (data)=> {
        var test = `${data}`;
        $('#terminal-content').append(test + '<br/>');
        $('#terminal-window').scrollTop(1E10);
      })
      ;

      obj.stderr.on('data', (data)=> {
        var test = `${data}`;
        $('#terminal-content').append(test + '<br/>');
        $('#terminal-window').scrollTop(1E10);

      })
      obj.stderr.on('message', (data)=> {
        var test = `${data}`;
        $('#terminal-content').append(test + '<br/>');
        $('#terminal-window').scrollTop(1E10);
      })
      ;

      obj.on('close', (code) => {
        var test = `${code}`;
        fs.unlinkSync(appPath + '/thirdparty/MicrosoftWebDriver.msi');
        fs.unlinkSync(appPath + '/thirdparty/MicrosoftWebDriver/MicrosoftWebDriver.msi');

        fs.renameSync(
            appPath + '/thirdparty/MicrosoftWebDriver/Microsoft Web Driver/MicrosoftWebDriver.exe',
            appPath + '/thirdparty/MicrosoftWebDriver/MicrosoftWebDriver.exe');
        fs.rmdirSync(appPath + '/thirdparty/MicrosoftWebDriver/Microsoft Web Driver');
        $('#terminal-content').append('finish <br/>');
        $('#terminal-window').scrollTop(1E10);
      })
      ;
    }
  }
}

