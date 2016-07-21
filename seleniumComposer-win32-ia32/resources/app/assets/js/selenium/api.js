class SeleniumApi {
  constructor(hub) {
    this.hub = hub;
  }

  getNodes(str) {
    var parsedNodes = this.call(str).find('div[type="config"] p:contains("url")');

    for (var i = 0; i < parsedNodes.length; i++) {
      var id = $(parsedNodes[i]).text().replace(/url:/g, '');
      var url = this.hub + '/grid/api/proxy?id=' + id

      $.get({
        url: url,
        async: false,
        dataType: 'json'
      }).done(function (data) {

      });
    }
  }

  updateControls(str, $buttons) {
    $('#selenium-console').attr('src', this.hub+'/grid/console');
    var parsedNodes = this.call(str).find('div[type="config"] p:contains("url")');
    var obj = [];
    var foo = [];
    for (var i = 0; i < parsedNodes.length; i++) {
      var id = $(parsedNodes[i]).text().replace(/url:/g, '');
      var url = this.hub + '/grid/api/proxy?id=' + id;
      var status = id + '/wd/hub/status';

      var nodes = $.get({
        url: url,
        async: false,
        dataType: 'json'
      });

      var statusnodes = $.get({
        url: status,
        async: false,
        dataType: 'json'
      });

      if (statusnodes.responseText != undefined) {
        foo.push({
          'node': jQuery.parseJSON(nodes.responseText),
          'status': jQuery.parseJSON(statusnodes.responseText)
        })
      } else {
        clearInterval(updateControls);
      }

    }

    if (foo.length == 0) {
      $buttons.each(function () {
        var command = $(this).data('command');
        var browser = $(this).data('browser');
        if (command == 'run' && browser != 'hub' && browser != 'all') {
          $(this).show();
        }
        if (command == 'stop' && browser != 'hub' && browser != 'all') {
          $(this).hide();
        }
      })
    } else {
      $buttons.each(function () {
        var browserButton = $(this).data('browser');
        for (var i = 0; i < foo.length; i++) {
          if (browserButton == foo[i].node.request.capabilities[0].browserName) {

            if ($(this).data('command') == 'run') {
              $(this).hide();
            }
            if ($(this).data('command') == 'stop') {
              $(this).show();
            }
          }
        }
      })
    }

  }

  activeHub(str) {
    if (this.call(str).length > 0) {
      return true
    }
    return false;
  }


  call(str) {
    var nodes = $.get({
      url: str,
      async: false,
      dataType: 'html',
      error: function (err) {
        return false;
      }
    });
    if (nodes.responseText != undefined) {
      var html = nodes.responseText.replace(/<img[^>]*>/g, "");
      return $(html);
    }
    return false;

  }


}