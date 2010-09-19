  /*------------------------------ HTML ELEMENT ------------------------------*/

  // add/pave statics
  (function() {

    var isMixin = false,

    addToNodeList = function() {
      var arg, j, jmax,
       args = arguments, i = -1, imax = args.length,
       Klass = this, prototype = Klass.prototype;

      while (++i < imax) {
        arg = args[i];
        if (typeof arg == 'function') arg = arg();
        if (!isArray(arg)) arg = [arg];

        j = -1; jmax = arg.length;
        while (++j < jmax) {
          eachKey(arg[j], function(method, key) {
            if (!isMixin || isMixin && !method.$super) {
              addNodeListMethod(method, key, prototype);
            }
          });
        }
      }
      return Klass;
    },

    addMixins = function addMixins() {
      fuse.Class.defaults.statics.addMixins.apply(this, arguments);
      isMixin = true;
      addToNodeList.apply(this, arguments);
      isMixin = false;
      return this;
    },

    addPlugins = function addPlugins() {
      fuse.Class.defaults.statics.addPlugins.apply(this, arguments);
      return addToNodeList.apply(this, arguments);
    };

    Element.addMixins =
    HTMLElement.addMixins = addMixins;

    Element.addPlugins =
    HTMLElement.addPlugins = addPlugins;
  })();

  /*--------------------------------------------------------------------------*/

  (function(plugin) {

    var counter = 0, dataJsonKey = 'data-json', reDataKey = /data\-(.*)/i;

    function parseDataAttributes(element, data) {
      var attr, match, name, value, i = -1,  matches = [], userData = data.user;

      // before we continue and use other data methods, let's make sure to update
      // our parsed data attributes flag so we don't try to pull custom data
      // attributes from the element
      data.parsedDataAttributes = true;

      // handle parsing the json attribute value
      if (attr = element.attributes[dataJsonKey]) {
        // decoding HTML entities on the attribute valued
        value = decodeURIComponent(attr.value);

        // try to evaluate the JSON
        try {
          value = fuse.String.plugin.evalJSON.call(value);

          plugin.setData.call(element, value);

          element.removeAttribute(dataJsonKey);
        } catch (e) {
          // since we couldn't parse the JSON, we'll leave the data-json attribute
          // on the element so it can be parsed by the following code below and
          // will assign the "json" key's value to the invalid JSON as a string
        }
      }

      // loop through the available attributes
      while (attr = element.attributes[++i]) {
        // is the attribute name defined as a custom data attribute
        if ((match = attr.name.match(reDataKey))) {
          userData[uid + match[1]] = attr.value;

          // add the attribute name to our matches array to remove later
          matches.push(match[0]);
        }
      }

      // finally, remove them from the element so they can't be parsed again
      // and potentially confuse the developer
      while (matches.length) {
        element.removeAttribute(matches.pop());
      }

      return element;
    }

    plugin.identify = function identify() {
      // use getAttribute to avoid issues with form elements and
      // child controls with ids/names of "id"
      var ownerDoc, element = this.raw || this,
       id = plugin.getAttribute.call(this, 'id');
      if (id != '') return id;

      ownerDoc = element.ownerDocument;
      while (ownerDoc.getElementById(id = 'anonymous_element_' + counter++)) { }

      plugin.setAttribute.call(this, 'id', id);
      return fuse.String(id);
    };

    plugin.isEmpty = function isEmpty() {
      var element = this.raw || this, node = element.firstChild;
      while (node) {
        if (node.nodeType != TEXT_NODE || node.data != false) {
          return false;
        }
        node = node.nextSibling;
      }
      return true;
    };

    plugin.isDetached = function isDetached() {
      var element = this.raw || this;
      return !(element[PARENT_NODE] &&
        plugin.contains.call(element.ownerDocument, element));
    };

    if (envTest('ELEMENT_INNER_HTML')) {
      plugin.isEmpty = function isEmpty() {
        return (this.raw || this).innerHTML == false;
      };
    }

    if (envTest('ELEMENT_SOURCE_INDEX')) {
      plugin.isDetached = function isDetached() {
        var element = this.raw || this;
        return element.ownerDocument.all[element.sourceIndex] != element;
      };
    }
    else if (envTest('ELEMENT_COMPARE_DOCUMENT_POSITION')) {
      plugin.isDetached = function isDetached() {
        /* DOCUMENT_POSITION_DISCONNECTED = 0x01 */
        var element = this.raw || this;
        return (element.ownerDocument.compareDocumentPosition(element) & 1) == 1;
      };
    }

    plugin.getData = function getData(key) {
      var name, element = this.raw || this, data = domData[getFuseId(element)],
        result = null, uidKey = uid + key, userData = data.user;

      if (!data.parsedDataAttributes) {
        parseDataAttributes(element, data);
      }

      // return the entire user data object if a key isn't specified
      if (typeof key == 'undefined') {
        result = {};

        // remove the uid from each key in the result
        for (name in userData) {
          result[name.slice(15)] = userData[name];
        }
      }
      else if (userData[uidKey] != null) {
        result = userData[uidKey];
      }

      return result;
    };

    plugin.hasData = function hasData(key) {
      var element = this.raw || this, data = domData[getFuseId(element)],
        userData = data.user;

      if (!data.parsedDataAttributes) {
        parseDataAttributes(element, data);
      }

      return typeof userData[uid + key] != 'undefined';
    };

    plugin.removeData = function removeData(key) {
      return plugin.setData.call(this, key);
    };

    plugin.setData = function setData(key, value) {
      var name, element = this.raw || this, data = domData[getFuseId(element)],
        userData = data.user;

      if (!data.parsedDataAttributes) {
        parseDataAttributes(element, data);
      }

      if (isString(key)) {
        if (typeof value == 'undefined') {
          delete userData[uid + key];
        }
        else {
          userData[uid + key] = value;
        }
      }
      else {
        if (isHash(key)) {
          key = key._object;
        }

        for (name in key) {
          if (typeof (value = key[name]) == 'undefined') {
            delete userData[uid + name];
          }
          else {
            userData[uid + name] = value;
          }
        }
      }

      return this;
    };

    // prevent JScript bug with named function expressions
    var getData     = null,
        hasData     = null,
        identify    = null,
        isDetached  = null,
        isEmpty     = null,
        removeData  = null,
        setData     = null;
  })(Element.plugin);
