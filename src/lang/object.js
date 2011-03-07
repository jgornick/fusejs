  /*------------------------------ LANG: OBJECT ------------------------------*/

  (function(Object) {

    var NON_HOST_TYPES = { 'boolean': 1, 'number': 1, 'string': 1, 'undefined': 1 },
     loc = window.location || { },
     protocol = loc.protocol,
     port = loc.port,
     reUrlParts = /([^:]+:)\/\/(?:[^:]+(?:\:[^@]+)?@)?([^\/:$]+)(?:\:(\d+))?/,
     defaultPort = protocol == 'ftp:' ? 21 : protocol == 'https:' ? 443 : 80,
     toString = fuse._.toString;

    /**
     * Determines if the object is a HTMLElement (ELEMENT_NODE).
     * 
     * @methodOf fuse.Object
     * @static
     * @name isElement
     * 
     * @param {Object} value The object to inspect.
     * 
     * @returns {Boolean}
     */
    function isElement(value) {
      return !!value && value.nodeType == 1;
    }

    /**
     * Determines if the object is empty. An object is empty when it doesn't 
     * contain any elements.
     * 
     * @methodOf fuse.Object
     * @static
     * @name isEmpty
     * 
     * @param {Object} object The object to inspect.
     * 
     * @returns {Boolean}
     */    
    function isEmpty(object) {
      var result = true;
      if (object) {
        Object.each(object, function(value, key) {
          return (result = false);
        });
      }
      return result;
    }

    /**
     * Determines if the object is a function.
     * 
     * @methodOf fuse.Object
     * @static
     * @name isFunction
     * 
     * @param {Object} value The object to inspect.
     * 
     * @returns {Boolean}
     */    
    function isFunction(value) {
      return toString.call(value) == '[object Function]';
    }

    /**
     * Determines if the object is a fuse.Hash.
     * 
     * @methodOf fuse.Object
     * @static
     * @name isHash
     * 
     * @param {Object} value The object to inspect.
     * 
     * @returns {Boolean}
     */        
    function isHash(value) {
      var Hash = isHash[ORIGIN].Hash;
      return !!value && value.constructor == Hash && value != Hash.prototype;
    }

    /**
     * Determines if the object is a host type.
     * 
     * Host objects can return type values that are different from their actual
     * data type. The objects we are concerned with usually return non-primitive
     * types of object, function, or unknown.
     * 
     * @methodOf fuse.Object
     * @static
     * @name isHostType
     * 
     * @param {Object} object The object to inspect.
     * @param {String} property The property name to search.
     * 
     * @returns {Boolean}
     */     
    function isHostType(object, property) {
      var type = typeof object[property];
      return type == 'object' ? !!object[property] : !NON_HOST_TYPES[type];
    }

    /**
     * Determines if the specified object is a number.
     * 
     * @methodOf fuse.Object
     * @static
     * @name isNumber
     * 
     * @param {Object} value The object to inspect.
     * 
     * @returns {Boolean}
     */       
    function isNumber(value) {
      return toString.call(value) == '[object Number]' && isFinite(value);
    }

    /**
     * Determines if the object is a primitive type.
     * 
     * @methodOf fuse.Object
     * @static
     * @name isPrimitive
     * 
     * @param {Object} value The object to inspect.
     * 
     * @returns {Boolean}
     * 
     * @see ES5 4.3.2
     */
    function isPrimitive(value) {
      var type = typeof value;
      return value == null || type == 'boolean' || type == 'number' || type == 'string';
    }

    /**
     * Determines if the object is a regular expression.
     * 
     * @methodOf fuse.Object
     * @static
     * @name isRegExp
     * 
     * @param {Object} value The object to inspect.
     * 
     * @returns {Boolean}
     */    
    function isRegExp(value) {
      return toString.call(value) == '[object RegExp]';
    }

    /**
     * Determines if the object is a string.
     * 
     * @methodOf fuse.Object
     * @static
     * @name isString
     * 
     * @param {Object} value The object to inspect.
     * 
     * @returns {Boolean}
     */        
    function isString(value) {
      return toString.call(value) == '[object String]';
    }

    /**
     * Determines if the specified URL is of the same origin as our current
     * location.
     * 
     * @methodOf fuse.Object
     * @static
     * @name isSameOrigin
     * 
     * @param {String} url The URL to inspect.
     * 
     * @returns {Boolean}
     * 
     * @see https://developer.mozilla.org/En/Same_origin_policy_for_JavaScript
     * @see http://www.iana.org/assignments/port-numbers
     */         
    function isSameOrigin(url) {
      var domainIndex, urlDomain, docDomain = fuse._doc.domain,
       parts = String(url).match(reUrlParts), result = true;

      if (parts && parts[0]) {
        urlDomain = parts[2];
        domainIndex = urlDomain.indexOf(docDomain);
        result = parts[1] == protocol &&
          (!domainIndex || urlDomain.charAt(domainIndex -1) == '.') &&
            (parts[3] || defaultPort) == (port || defaultPort);
      }
      return result;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Determines if the specified object is an array.
     * 
     * @methodOf fuse.Object
     * @static
     * @name isArray
     * 
     * @param {Object} value The object to inspect.
     * 
     * @returns {Boolean}
     * 
     * @see fuse.Array.isArray
     */    
    Object.isArray = fuse.Array.isArray;
    Object.isElement = isElement;
    Object.isEmpty = isEmpty;
    Object.isFunction = isFunction;
    Object.isHostType = isHostType;
    Object.isNumber = isNumber;
    Object.isPrimitive = isPrimitive;
    Object.isRegExp = isRegExp;
    Object.isSameOrigin = isSameOrigin;
    Object.isString = isString;

    (Object.isHash = isHash)[ORIGIN] = fuse;

  })(fuse.Object);

  /*--------------------------------------------------------------------------*/

  (function(Object) {

    /**
     * Returns a shallow clone of the object.
     * 
     * @methodOf fuse.Object
     * @static
     * @name clone
     * 
     * @param {Object} object The object to clone.
     * @param {Boolean} deep Flag to perform a deep clone.
     * 
     * @returns {fuse.Object}
     */    
    function clone(object, deep) {
      var length, result, constructor, i = -1;
      if (object) {
        if (Object.isFunction(object.clone)) {
          return object.clone(deep);
        }
        if (typeof object == 'object') {
          constructor = object.constructor;
          switch (Object.prototype.toString.call(object)) {
            case '[object Array]'  :
              if (deep) {
                result = constructor();
                length = object.length;
                while (++i < length) {
                  result[i] = Object.clone(object[i], deep);
                }
              } else {
                result = object.slice(0);
              }
              return result;

            case '[object RegExp]' :
              return constructor(object.source,
                (object.global     ? 'g' : '') +
                (object.ignoreCase ? 'i' : '') +
                (object.multiline  ? 'm' : ''));

            case '[object Number]'  :
            case '[object String]'  : return new constructor(object);
            case '[object Boolean]' : return new constructor(object == true);
            case '[object Date]'    : return new constructor(+object);
          }

          result = Object();
          if (deep) {
            Object.each(object, function(value, key) {
              result[key] = Object.clone(value, deep);
            });
          } else {
            Object.extend(result, object);
          }
          return result;
        }
      }
      return Object();
    }

    /**
     * Copies all properties from the source object to the destination object.
     * 
     * This method does directly modify the destination object and doesn't 
     * return a new object.
     * 
     * @methodOf fuse.Object
     * @static
     * @name extend
     * 
     * @param {Object} destination The object to receive the source properties.
     * @param {Object} source The object to copy the properties from.
     * 
     * @returns {Object} Returns the destination object with source properties
     *   added/merged to it.
     */ 
    function extend(destination, source) {
      Object.each(source, function(value, key) { destination[key] = value; });
      return destination;
    }

    /**
     * Returns the class name of the object.
     * 
     * The erratum states Object#toString should return [object Null] and 
     * [object Undefined] for null and undefined values. However, Null and 
     * Undefined are *not* [[Class]] property values.
     * 
     * @methodOf fuse.Object
     * @static
     * @name getClassOf
     * 
     * @param {Object} object The object to get the class name.
     * 
     * @returns {String}
     * 
     * @see ES5 15.2.4.2
     */     
    function getClassOf(object) {
      if (object == null) throw new TypeError;
      return getClassOf[ORIGIN].String(Object.prototype.toString.call(object).slice(8, -1));
    }

    /**
     * Returns an array containing the keys from the object.
     * 
     * @methodOf fuse.Object
     * @static
     * @name keys
     * 
     * @param {Object} object The object to get the keys from.
     * 
     * @returns {fuse.Array}
     * 
     * @see ES5 15.2.3.14
     */
    function keys(object) {
      var result = keys.raw.call(object);
      return result.constructor == fuse.Array ? result : Array.fromArray(result);
    }

    /**
     * Returns an array containing the values from the object.
     * 
     * @methodOf fuse.Object
     * @static
     * @name values
     * 
     * @param {Object} object The object to get the values from.
     * 
     * @returns {fuse.Array}
     */    
    function values(object) {
      var result = values[ORIGIN].Array(), i = -1;
      if (Object.isPrimitive(object)) {
        throw new TypeError;
      }
      Object.each(object, function(value, key) { result[++i] = value; });
      return result;
    }

    /**
     * Returns an HTML representation of the object.
     * 
     * @methodOf fuse.Object
     * @static
     * @name toHTML
     * 
     * @param {Object} object The object to transform to HTML.
     * 
     * @returns {fuse.String}
     */
    function toHTML(object) {
      var String = toHTML[ORIGIN].String;
      return object && typeof object.toHTML == 'function'
        ? String(object.toHTML())
        : String(object == null ? '' : object);
    }

    /*------------------------------------------------------------------------*/

    Object.clone = clone;
    Object.extend = extend;

    (Object.getClassOf = getClassOf)[ORIGIN] =
    (Object.toHTML = toHTML)[ORIGIN] =
    (Object.values = values)[ORIGIN] = fuse;

    if (Object.isFunction(Object.keys)) {
      keys.raw = Object.keys;
      Object.keys = keys;
    }
  })(fuse.Object);

  // ES5 15.2.3.14
  (function(Object) {

    function keys(object) {
      var result = keys[ORIGIN].Array(), i = -1;
      if (Object.isPrimitive(object)) {
        throw new TypeError;
      }
      Object.each(object, function(value, key) { result[++i] = key; });
      return result;
    }

    if (!Object.isFunction(Object.keys)) {
      (Object.keys = keys)[ORIGIN] = fuse;
    }
  })(fuse.Object);

  /*--------------------------------------------------------------------------*/

  /**
   * Determines if the object has the specified property name.
   * 
   * Use fuse.Object.hasKey() on object Objects only as it may error on DOM 
   * Classes (https://bugzilla.mozilla.org/show_bug.cgi?id=375344)
   * 
   * @methodOf fuse.Object
   * @static
   * @name hasKey
   * 
   * @param {Object} object The object to inspect.
   * @param {String} property The property name to search.
   * 
   * @returns {Boolean}
   * 
   * @see ES5 15.2.4.5
   */
  fuse.Object.hasKey = (function() {

    var objProto = Object.prototype,
     hasOwnProperty = objProto.hasOwnProperty;

    // ES5 15.2.4.5
    var hasKey = function hasKey(object, property) {
      if (object == null) throw new TypeError;
      return hasOwnProperty.call(object, property);
    };

    if (!fuse.Object.isFunction(hasOwnProperty)) {
      if (fuse.env.test('OBJECT__PROTO__')) {
        // Safari 2
        hasKey = function hasKey(object, property) {
          if (object == null) throw new TypeError;
          // convert primatives to objects so IN operator will work
          object = Object(object);

          var result, proto = object.__proto__;
          object.__proto__ = null;
          result = property in object;
          object.__proto__ = proto;
          return result;
        };
      } else {
        // Other
        hasKey = function hasKey(object, property) {
          if (object == null) throw new TypeError;
          object = Object(object);

          var constructor = object.constructor;
          return property in object &&
            (constructor && constructor.prototype
              ? object[property] !== constructor.prototype[property]
              : object[property] !== objProto[property]);
        };
      }
    }
    // Garrett Smith found an Opera bug that occurs with the window object and not the global
    if (window.window == window && !hasKey(window.window, 'Object')) {
      var __hasKey = hasKey;
      hasKey = function hasKey(object, property) {
        if (object == null) throw new TypeError;
        return object == window
          ? property in object && object[property] !== objProto[property]
          : __hasKey(object, property);
      };
    }

    return hasKey;
  })();

  /*--------------------------------------------------------------------------*/

  /**
   * Calls a function for each element in the object.
   * 
   * @methodOf fuse.Object
   * @static
   * @name each
   * 
   * @param {Function} callback Function to execute for each element.  The
   *   callback is passed 3 arguments: element value, element key and 
   *   the object.  If callback returns {Boolean} false, the loop will stop.
   * @param {Object} [thisArg] Object to use as this when executing callback.
   * 
   * @returns {Object}
   */  
  fuse.Object.each = (function() {

    var each, isFunction = fuse.Object.isFunction, hasKey = fuse.Object.hasKey,
     shadowed = 'constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf'.split(' ');

    function bind(fn, thisArg) {
      return function(value, key, object) {
        return fn.call(thisArg, value, key, object);
      };
    }

    // switch statement avoids creating a temp var
    switch (function() {
      var key, count = 0, klass = function() { this.toString = 1; };
      klass.prototype.toString = 1;
      for (key in new klass) { count++; }
      return count;
    }()) {

      case 0:
        // IE
        each = function each(object, callback, thisArg) {
          var key, i = -1;
          if (object) {
            thisArg && (callback = bind(callback, thisArg));
            for (key in object) {
              if (hasKey(object, key) &&
                  callback(object[key], key, object) === false) {
                return object;
              }
            }
            while(key = shadowed[++i]) {
              if (hasKey(object, key) &&
                  callback(object[key], key, object) === false) {
                break;
              }
            }
          }
          return object;
        };

        break;

      case 2:
        // Tobie Langel: Safari 2 broken for-in loop
        // http://replay.waybackmachine.org/20090428222941/http://tobielangel.com/2007/1/29/for-in-loop-broken-in-safari/
        each = function each(object, callback, thisArg) {
          var key, keys = { }, skipProto = fuse.Object.isFunction(object);
          if (object)  {
            thisArg && (callback = bind(callback, thisArg));
            for (key in object) {
              if (!(skipProto && key == 'prototype') && !hasKey(keys, key) &&
                  (keys[key] = 1) && hasKey(object, key) &&
                  callback(object[key], key, object) === false) {
                break;
              }
            }
          }
          return object;
        };

        break;

      default:
        // Others
        each = function each(object, callback, thisArg) {
          var key, skipProto = fuse.Object.isFunction(object);
          if (object) {
            thisArg && (callback = bind(callback, thisArg));
            for (key in object) {
              if (!(skipProto && key == 'prototype') && hasKey(object, key) &&
                  callback(object[key], key, object) === false) {
                break;
              }
            }
          }
          return object;
        };
    }

    return each;
  })();
