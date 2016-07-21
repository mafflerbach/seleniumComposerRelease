intervalStatus = false;

$(document).ready(function () {
  var selenium = new Selenium('http://localhost:4444');
  $('button[data-browser]').click(function () {
    var command = $(this).data('command');
    var browser = $(this).data('browser');
    if (command == 'run') {
      selenium.start(browser);
      $('button[data-browser="' + browser + '"][data-command="stop"]').show();
      $(this).hide();
    }
    if (command == 'stop') {
      selenium.stop(browser);
      $('button[data-browser="' + browser + '"][data-command="run"]').show();
      $(this).hide();
    }
    if(intervalStatus == false) {
      intervalManager(true);
    }
  })

  $('button[data-install]').click(function () {
    var install = new InstallerJava()
    install.runInstaller();
  });

  $('button[data-driver]').click(function () {
    var dep = new Dependencies();
    dep.getallDriver($(this).data('driver'));
  });

  $('button[data-command]').click(function () {
    if ($(this).data('command') == 'clrs') {
      $('#terminal-content').empty();
    }
  });

  $('button[data-installer]').click(function () {
    var installer = null;
    switch ($(this).data('installer')) {
      case 'firefox' :
        installer = new InstallerFirefox();
        break;
      case 'java' :
        installer = new InstallerJava();
        break;
      case 'chrome' :
        installer = new InstallerChrome();
        break;
    }

    installer.getInstaller();


  });
})

function intervalManager(activate) {
  intervalStatus =  activate;
  if (activate) {
    updateControls = setInterval(function () {
      var selenium = new Selenium('http://localhost:4444');
      selenium.updateControls($('button'));
    }, 5000);
  } else {
    clearInterval(updateControls);
  }
}


jQuery.fn.orderBy = function(keySelector)
{
  return this.sort(function(a,b)
  {
    a = keySelector.apply(a);
    b = keySelector.apply(b);
    if (a < b)
      return 1;
    if (a > b)
      return -1;
    return 0;
  });
};



function updateTerminal() {
  $('#terminal-content').append('-');
}