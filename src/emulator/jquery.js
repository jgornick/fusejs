(function(global) {
  var jQuery = function(selector, context) {
    return new init(selector, context);
  };

  var nlp = fuse.dom.NodeList.plugin, epr = fuse.dom.Element.plugin;

  jQuery.fn = jQuery.prototype = (jQuery._NodeList = fuse.Fusebox().Array).plugin;

  jQuery.fn.attr = function(name, value) {
    var result, i = -1, item;

    if (typeof value == 'undefined') {
      // Getter
      result = nlp.getAttribute.apply(this, arguments);

      return result == ''
        ? undefined
        : result;
    } else {
      // Setter
      if (typeof name == 'object') {
        for (item in name) {
          nlp.setAttribute.call(this, item, name[item]);
        }
        return this;
      } else if (fuse.Object.isFunction(value)) {
        while (item = this[++i]) {
          nlp.setAttribute.call(this, name, value.call(item, i, jQuery(item).attr(name)));
        }
        return this;
      } else {
        return nlp.setAttribute.apply(this, arguments);
      }
    }
  };

  jQuery.fn.addClass = function(value) {
    var i = -1, item;
    if (fuse.Object.isFunction(value)) {
      while (item = this[++i]) {
        nlp.addClassName.call(this, value.call(item, i, jQuery(item).attr('class')));
      }
      return this;
    } else {
      return nlp.addClassName.apply(this, arguments);
    }
  };

  jQuery.fn.css = function(name, value) {
    var i = -1, item;
    if (typeof value == 'undefined') {
      // Getter
      return String(nlp.getStyle.apply(this, arguments));
    } else {
      // Setter
      if (typeof name == 'object') {
        for (item in name) {
          nlp.setStyle.call(this, item, name[item]);
        }
        return this;
      } else if (fuse.Object.isFunction(value)) {
        while (item = this[++i]) {
          nlp.setStyle.call(this, name, value.call(item, i, jQuery(item).css(name)));
        }
        return this;
      } else {
        return nlp.setStyle.call(this, name + ': ' + value);
      }
    }
  };

  jQuery.fn.hasClass = nlp.hasClassName;

  jQuery.fn.height = function(value) {
    var i = -1, item;

    if (typeof value == 'undefined') {
      // Getter
      return Number(nlp.getHeight.call(this, 'content'));
    } else {
      // Setter
      if (fuse.Object.isFunction(value)) {
        while (item = this[++i]) {
          this.height(value.call(item, i, jQuery(item).height()));
        }
        return this;
      } else {
        value = (parseFloat(value) || 0) + 'px';
        return nlp.setStyle.call(this, 'height: ' + value);
      }
    }
  };

  jQuery.fn.hide = nlp.hide;

  function convertNodeListTojQuery(nodeList, jq) {
    var i = -1, item;

    jq.length = 0;

    while (item = nodeList[++i]) {
      jq.push(item);
    }

    return jq;
  }

  var init = function(selector, context) {
    var item, temp,  result, count = 0, i = -1;

    if (!selector) {
      return jQuery._NodeList();
    }

    if (typeof selector == 'string') {
      if (selector.charAt(0) == '<') {
        result = fuse.dom.Element(selector, { decorate: false });
      } else {
        // exit early
        result = jQuery._NodeList();
        fuse.query(selector, context, function(element) { result[count++] = element; });
        return result;
      }
    }

    if (fuse.Array.isArray(result)) {
      result = jQuery._NodeList.fromArray(result);
    } else if (selector.nodeType) {
      result = jQuery._NodeList(selector);
    }

    result.context = context || document;

    return result;
  };

  init.prototype = jQuery.fn;

  global.jQuery = jQuery;
})(this);