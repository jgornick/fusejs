  /*---------------------------------- DOM -----------------------------------*/

  // Add fuse.dom and fuse.dom.data namespace
  domData = fuse.addNS('dom.data');

  domData[0] = { 'user': { } }; // window
  domData[1] = { 'nodes': { }, 'user': { } }; // document

  NodeList = fuse.Array;

  fuse._doc    = window.document;
  fuse._div    = fuse._doc.createElement('DiV');
  fuse._docEl  = fuse._doc.documentElement;
  fuse._headEl = fuse._doc.getElementsByTagName('head')[0] || fuse._docEl;
  fuse._info   = { };

  fuse._info.docEl =
  fuse._info.root  =
    { 'nodeName': 'HTML', 'property': 'documentElement' };

  fuse._info.body =
  fuse._info.scrollEl =
    { 'nodeName': 'BODY', 'property': 'body' };

  /*--------------------------------------------------------------------------*/

  CHECKED_INPUT_TYPES = { 'checkbox': 1, 'radio': 1 };

  EVENT_TYPE_ALIAS = { 'blur': 'delegate:blur', 'focus': 'delegate:focus' },

  INPUT_BUTTONS = { 'button': 1, 'image': 1, 'reset':  1, 'submit': 1 };

  DATA_ID_PROP =
    fuse.env.test('ELEMENT_UNIQUE_NUMBER') ? 'uniqueNumber' : '_fuseId';

  PARENT_NODE =
    fuse.Object.isHostType(fuse._docEl, 'parentElement') ? 'parentElement' : 'parentNode';

  // Safari 2.0.x returns `Abstract View` instead of `window`
  PARENT_WINDOW =
    fuse.Object.isHostType(fuse._doc, 'defaultView') && fuse._doc.defaultView === window ? 'defaultView' :
    fuse.Object.isHostType(fuse._doc, 'parentWindow') ? 'parentWindow' : null;

  destroyElement = function(element, parentNode) {
    parentNode || (parentNode = element[PARENT_NODE]);
    parentNode && parentNode.removeChild(element);
  };

  emptyElement = function(element) {
    var child;
    while (child = element.lastChild) {
      destroyElement(child, element);
    }
  };

  getDocument = function getDocument(element) {
    return element.ownerDocument || element.document ||
      (element.nodeType == 9 ? element : fuse._doc);
  };

  getNodeName = fuse._doc.createElement('nav').nodeName == 'NAV'
    ? function(element) { return element.nodeName; }
    : function(element) { return element.nodeName.toUpperCase(); };

  getScriptText = function(element) {
    element.childNodes.length > 1 && element.normalize();
    return (element.firstChild || { }).data || '';
  };

  getWindow = function getWindow(element) {
    // based on work by Diego Perini
    var frame, i = -1, doc = getDocument(element), frames = window.frames;
    if (fuse._doc != doc) {
      while (frame = frames[++i]) {
        if (frame.document == doc)
          return frame;
      }
    }
    return window;
  };

  returnOffset = function(left, top) {
    var result  = fuse.Array(fuse.Number(left || 0), fuse.Number(top || 0));
    result.left = result[0];
    result.top  = result[1];
    return result;
  };

  runScriptText = (function() {
    var counter = 0;

    return function(text, context) {
      var head, result, script, suid = fuse.uid + '_script' + counter++;
      if (text && text != '') {
        fuse[suid] = { 'text': String(text) };
        text = 'fuse.' + suid + '.returned=eval(';

        context || (context = fuse._doc);
        head || (head = fuse._headEl);
        if (fuse._doc != context) {
          context = getDocument(context.raw || context);
          head = context ==context.getElementsByTagName('head')[0] || context.documentElement;
          text = 'parent.' + text + 'parent.';
        }

        text += 'fuse.' + suid + '.text);';

        // keep consistent behavior of `arguments`
        // uses an unresolvable reference so it can be deleted without
        // errors in JScript
        text = 'if("arguments" in this){' + text +
               '}else{arguments=void 0;'  + text +
               'delete arguments}';

        script = context.createElement('script');
        script.async = true;
        setScriptText(script, text);
        head.insertBefore(script, head.firstChild);
        head.removeChild(script);

        result = fuse[suid].returned;
        delete fuse[suid];
      }
      return result;
    };
  })();

  setScriptText = function(element, text) {
    (element.firstChild || element.appendChild(element.ownerDocument.createTextNode('')))
      .data = text == null ? '' : text;
  };

  if (PARENT_WINDOW) {
    getWindow = function getWindow(element) {
      return getDocument(element)[PARENT_WINDOW];
    };
  }

  if (fuse.env.test('ELEMENT_INNER_HTML')) {
    emptyElement = function(element) {
      element.innerHTML = '';
    };

    destroyElement = (function() {
      var trash = document.createElement('div');
      return function(element) {
        trash.appendChild(element);
        trash.innerHTML = '';
      };
    })();
  }

  if (fuse.env.test('ELEMENT_SCRIPT_HAS_TEXT_PROPERTY')) {
    getScriptText = function(element) {
      return element.text;
    };

    setScriptText = function(element, text) {
      element.text = text || '';
    };
  }

  fuse.dom.getDocument   = getDocument;
  fuse.dom.getWindow     = getWindow;
  fuse.dom.getScriptText = getScriptText;
  fuse.dom.setScriptText = setScriptText;
  fuse.dom.runScriptText = runScriptText;
