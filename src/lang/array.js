  /*------------------------------ LANG: ARRAY -------------------------------*/

  /**
   * Represents a list of objects that can be accessed by index or other
   * methods.  Provides methods to search, sort and manipulate arrays.
   * 
   * @class
   * @name fuse.Array
   */

  /* create shared pseudo private props */

  fuse._.sorter = function(left, right) {
    var a = left.criteria, b = right.criteria;
    return a < b ? -1 : a > b ? 1 : 0;
  };

  /*--------------------------------------------------------------------------*/
  
  (function(plugin) {

    /* create Array statics */

    /**
     * Convert an array-like object to a fuse.Array instance.
     * 
     * When no arguments are specified, an empty fuse.Array is returned.
     * 
     * @methodOf fuse.Array
     * @static
     * @name from
     * 
     * @param {ArrayLike} [iterable] The array-like object to convert from.
     * 
     * @returns {fuse.Array}
     */
    function from(iterable) {
      var length, object, result, Array = from[ORIGIN].Array;
      if (!arguments.length) {
        return Array();
      }
      // Safari 2.x will crash when accessing a non-existent property of a
      // node list, not in the document, that contains a text node unless we
      // use the `in` operator
      object = Object(iterable);
      if ('toArray' in object) {
        return object.toArray();
      }
      if ('item' in object) {
        return Array.fromNodeList(iterable);
      }
      if (fuse.Object.isString(object)) {
        object = object.split('');
      }
      if ('length' in object) {
        length = object.length >>> 0;
        result = Array(length);
        while (length--) {
          if (length in object) result[length] = object[length];
        }
        return result;
      }
      return Array.fromArray([iterable]);
    }

    /**
     * Converts a fuse.dom.NodeList to fuse.Array.
     * 
     * @methodOf fuse.Array
     * @static
     * @name fromNodeList
     * 
     * @param {fuse.dom.NodeList} nodeList The node list to convert from.
     * 
     * @returns {fuse.Array}
     */    
    function fromNodeList(nodeList) {
      var i = -1, result = fromNodeList[ORIGIN].Array();
      while (result[++i] = nodeList[i]) { }
      return result.length-- && result;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Removes all elements from the array.
     * 
     * Please note that this method is destructive and will modify the array
     * instance the method is called on.
     * 
     * @methodOf fuse.Array#
     * @name clear
     * 
     * @returns {fuse.Array}
     */
    function clear() {
      var object = Object(this), length = object.length >>> 0;
      if (!fuse.Object.isArray(object)) {
        while (length--) {
          if (length in object) delete object[length];
        }
      }
      object.length = 0;
      return object;
    }

    /**
     * Returns a shallow clone of the array.
     * 
     * @methodOf fuse.Array#
     * @name clone
     * 
     * @param {Boolean} deep Flag to perform a deep clone.
     * 
     * @returns {fuse.Array}
     */
    function clone(deep) {
      var length, result, i = -1, object = Object(this),
       Array = clone[ORIGIN].Array;
      if (deep) {
        result = Array();
        length = object.length >>> 0;
        while (++i < length) result[i] = fuse.Object.clone(object[i], deep);
      }
      else if (fuse.Object.isArray(object)) {
        result = object.constructor != Array
          ? Array.fromArray(object)
          : object.slice(0);
      } else {
        result = Array.from(object);
      }
      return result;
    }

    /**
     * Returns a new array with values that are not null or undefined.
     * 
     * @methodOf fuse.Array#
     * @name compact
     * 
     * @param {Boolean} [falsy] Flag to remove values that are falsy.
     * 
     * @returns {fuse.Array}
     */    
    function compact(falsy) {
      var i = -1, j = i, object = Object(this), length = object.length >>> 0,
       result = compact[ORIGIN].Array();

      if (falsy) {
        while (++i < length) {
          if (object[i] && object[i] != '') result[++j] = object[i];
        }
      } else {
        while (++i < length) {
          if (object[i] != null) result[++j] = object[i];
        }
      }
      return result;
    }

    /**
     * Returns a new flattened (one-dimensional) copy of the array.
     * 
     * @methodOf fuse.Array#
     * @name flatten
     * 
     * @returns {fuse.Array}
     */        
    function flatten() {
      var item, i = -1, j = i, object = Object(this),
       length = object.length >>> 0,
       result = flatten[ORIGIN].Array();

      while (++i < length) {
        if (fuse.Object.isArray(item = object[i])) {
          j = fuse._.concatList(result, flatten.call(item)).length - 1;
        } else {
          result[++j] = item;
        }
      }
      return result;
    }

    /**
     * Inserts a value into the array at a specified index.
     * 
     * @methodOf fuse.Array#
     * @name insert
     * 
     * @param {Number} index The index to insert the value at.
     * @param {Object} value[, ...] Value or values to insert.
     * 
     * @returns {fuse.Array}
     */   
    function insert(index, value) {
      var proto = window.Array.prototype,
       slice = proto.slice, splice = proto.splice,
       object = Object(this), length = object.length >>> 0;

      if (length < index) object.length = index;
      if (index < 0) index = length;
      if (arguments.length > 2) {
        splice.apply(object, fuse._.concatList([index, 0], slice.call(arguments, 1)));
      } else {
        splice.call(object, index, 0, value);
      }
      return object;
    }

    /**
     * Returns a new array with elements common to both arrays.
     * 
     * @methodOf fuse.Array#
     * @name intersect
     * 
     * @param {fuse.Array} array Other array to intersect with.
     * 
     * @returns {fuse.Array}
     */       
    function intersect(array) {
      var item, i = -1, j = i, Array = intersect[ORIGIN].Array,
       contains = Array.prototype.contains, object = Object(this),
       length = object.length >>> 0, result = Array();

      while (++i < length) {
        if (i in object &&
            contains.call(array, item = object[i]) &&
            !result.contains(item)) {
          result[++j] = item;
        }
      }
      return result;
    }

    /**
     * Returns a new array with only unique elements.
     * 
     * @methodOf fuse.Array#
     * @name unique
     * 
     * @returns {fuse.Array}
     */    
    function unique() {
      var item, i = -1, j = i, object = Object(this),
       length = object.length >>> 0,
       result = unique[ORIGIN].Array();

      while (++i < length) {
        if (i in object && !result.contains(item = object[i]))
          result[++j] = item;
      }
      return result;
    }

    /**
     * Returns a new array without the value(s) specified.
     * 
     * @methodOf fuse.Array#
     * @name without
     * 
     * @param {Object} value[, ...] Value or values to remove from returned
     *   array.
     * 
     * @returns {fuse.Array}
     */      
    function without() {
      var args, i = -1, j = i, proto = window.Array.prototype,
       object = Object(this), length = object.length >>> 0,
       result = without[ORIGIN].Array(), indexOf = proto.indexOf || result.indexOf;

      if (length) {
        args = proto.slice.call(arguments, 0);
        while (++i < length) {
          if (i in object && indexOf.call(args, object[i]) == -1)
            result[++j] = object[i];
        }
      }
      return result;
    }

    /*------------------------------------------------------------------------*/

    /* create ES5 method equivalents */

    /**
     * Returns true if every element in the array satisfies the provided
     * testing function.
     * 
     * This method does not use a strict comparison. If your callback function 
     * returns a truthy value, the condition will pass. 
     * 
     * @methodOf fuse.Array#
     * @name every
     * 
     * @param {Function} callback Function to test for each element.  The
     *   callback is passed 3 arguments: current element, index of element and 
     *   this array.
     * @param {Object} [thisArg] Object to use as this when executing callback.
     * 
     * @returns {Boolean}
     * 
     * @throws {TypeError} If callback isn't a function, TypeError is thrown.
     * 
     * @see ES5 15.4.4.16
     */
    function every(callback, thisArg) {
      var i = -1, object = Object(this), length = object.length >>> 0;
      if (typeof callback != 'function') {
        throw new TypeError;
      }
      while (++i < length) {
        if (i in object && !callback.call(thisArg, object[i], i, object))
          return false;
      }
      return true;
    }

    /**
     * Returns a new array with all elements that pass the test implemented by 
     * the provided function.
     * 
     * This method does not use a strict comparison. If your callback function 
     * returns a truthy value, the condition will pass. 
     * 
     * @methodOf fuse.Array#
     * @name filter
     * 
     * @param {Function} callback Function to test each element of the array.  
     *   The callback is passed 3 arguments: current element, index of element 
     *   and this array.
     * @param {Object} [thisArg] Object to use as this when executing callback.
     * 
     * @returns {fuse.Array}
     * 
     * @throws {TypeError} If callback isn't a function, TypeError is thrown.
     * 
     * @see ES5 15.4.4.20
     */    
    function filter(callback, thisArg) {
      var i = -1, j = i, object = Object(this), length = object.length >>> 0,
       result = filter[ORIGIN].Array();

      if (typeof callback != 'function') {
        throw new TypeError;
      }
      while (++i < length) {
        if (i in object && callback.call(thisArg, object[i], i, object))
          result[++j] = object[i];
      }
      return result;
    }

    /**
     * Calls a function for each element in the array.
     * 
     * @methodOf fuse.Array#
     * @name forEach
     * 
     * @param {Function} callback Function to execute for each element.  The
     *   callback is passed 3 arguments: current element, index of element and 
     *   this array.
     * @param {Object} [thisArg] Object to use as this when executing callback.
     * 
     * @see ES5 15.4.4.18
     */
    function forEach(callback, thisArg) {
      var i = -1, object = Object(this), length = object.length >>> 0;
      while (++i < length) {
        i in object && callback.call(thisArg, object[i], i, object);
      }
    }

    /**
     * Returns the first index at which a given element can be found in the 
     * array, or -1 if it is not present.
     * 
     * This method performs a strict comparison against the specified element.
     * 
     * @methodOf fuse.Array#
     * @name indexOf
     * 
     * @param {Object} item Element to locate in the array.
     * @param {Number} [fromIndex] The index at which to begin the search. 
     *   Defaults to 0, i.e. the whole array will be searched. If the index is 
     *   greater than or equal to the length of the array, -1 is returned, i.e. 
     *   the array will not be searched. If negative, it is taken as the offset 
     *   from the end of the array. Note that even when the index is negative, 
     *   the array is still searched from front to back. If the calculated index 
     *   is less than 0, the whole array will be searched.
     * 
     * @returns {fuse.Number}
     * 
     * @see ES5 15.4.4.14
     */
    function indexOf(item, fromIndex) {
      var Number = indexOf[ORIGIN].Number,
       object = Object(this), length = object.length >>> 0;

      fromIndex = fuse._.toInteger(fromIndex);
      if (fromIndex < 0) fromIndex = length + fromIndex;
      fromIndex--;

      // ES5 draft oversight, should use [[HasProperty]] instead of [[Get]]
      while (++fromIndex < length) {
        if (fromIndex in object && object[fromIndex] === item)
          return Number(fromIndex);
      }
      return Number(-1);
    }

    /**
     * Returns the last index at which a given element can be found in the 
     * array, or -1 if it is not present. The array is searched backwards, 
     * starting at fromIndex.
     * 
     * @methodOf fuse.Array#
     * @name lastIndexOf
     * 
     * @param {Object} item Element to locate in the array.
     * @param {Number} [fromIndex] The index at which to start searching 
     *   backwards. Defaults to the array's length, i.e. the whole array will be
     *   searched. If the index is greater than or equal to the length of the 
     *   array, the whole array will be searched. If negative, it is taken as 
     *   the offset from the end of the array. Note that even when the index is 
     *   negative, the array is still searched from back to front. If the 
     *   calculated index is less than 0, -1 is returned, i.e. the array will 
     *   not be searched.
     * 
     * @returns {fuse.Number}
     * 
     * @see ES5 15.4.4.15
     */     
    function lastIndexOf(item, fromIndex) {
      var object = Object(this), length = object.length >>> 0;
      fromIndex = fromIndex == null ? length : fuse._.toInteger(fromIndex);

      if (!length) return fuse.Number(-1);
      if (fromIndex > length) fromIndex = length - 1;
      if (fromIndex < 0) fromIndex = length + fromIndex;

      // ES5 draft oversight, should use [[HasProperty]] instead of [[Get]]
      fromIndex++;
      while (--fromIndex > -1) {
        if (fromIndex in object && object[fromIndex] === item) break;
      }
      return lastIndexOf[ORIGIN].Number(fromIndex);
    }

    /**
     * Returns a new array with the results of calling a provided function on 
     * every element in this array.
     * 
     * @methodOf fuse.Array#
     * @name map
     * 
     * @param {Function} callback Function that produces an element for the new 
     *   Array from an element of the current one.  The callback is passed 3 
     *   arguments: current element, index of element and this array.
     * @param {Object} [thisArg] Object to use as this when executing callback.
     * 
     * @returns {fuse.Array}
     * 
     * @throws {TypeError} If callback isn't a function, TypeError is thrown.
     * 
     * @see ES5 15.4.4.19
     */
    function map(callback, thisArg) {
      var i = -1, object = Object(this), length = object.length >>> 0,
       result = map[ORIGIN].Array();

      if (typeof callback != 'function') {
        throw new TypeError;
      }
      while (++i < length) {
        if (i in object) result[i] = callback.call(thisArg, object[i], i, object);
      }
      return result;
    }

    /**
     * Tests whether some element in the array passes the test implemented by 
     * the provided function.
     * 
     * This method does not use a strict comparison. If your callback function 
     * returns a truthy value, the condition will pass. 
     * 
     * @methodOf fuse.Array#
     * @name some
     * 
     * @param {Function} callback Function to test for each element.  The
     *   callback is passed 3 arguments: current element, index of element and 
     *   this array.
     * @param {Object} [thisArg] Object to use as this when executing callback.
     * 
     * @returns {Boolean}
     * 
     * @throws {TypeError} If callback isn't a function, TypeError is thrown.
     * 
     * @see ES5 15.4.4.17
     */    
    function some(callback, thisArg) {
      var i = -1, object = Object(this), length = object.length >>> 0;
      if (typeof callback != 'function') {
        throw new TypeError;
      }
      while (++i < length) {
        if (i in object && callback.call(thisArg, object[i], i, object))
          return true;
      }
      return false;
    }

    /*------------------------------------------------------------------------*/

    /* create optimized enumerable equivalents */

    /**
     * Enumerable mixin iteration helper.
     * 
     * @methodOf fuse.Array#
     * @private
     * @name _each
     * 
     * @param {Function} callback Function to execute for each element.
     * 
     * @returns {fuse.Array}
     * 
     * @see fuse.Array#forEach
     */
    function _each(callback) {
      this.forEach(callback);
      return this;
    }

    /**
     * Tests whether an element is in the array.
     * 
     * This method uses a strict comparison against the value specified.
     * 
     * @methodOf fuse.Array#
     * @name contains
     * 
     * @param {Object} value The object to locate in the list.
     * 
     * @returns {Boolean}
     */  
    function contains(value) {
      var item, object = Object(this), length = object.length >>> 0;
      while (length--) {
        if (length in object) {
          // basic strict match
          if ((item = object[length]) === value) return true;
          // match String and Number object instances
          try { if (item.valueOf() === value.valueOf()) return true; } catch (e) { }
        }
      }
      return false;
    }

    /**
     * Calls a function for each element in the array.
     * 
     * @methodOf fuse.Array#
     * @name each
     * 
     * @param {Function} callback Function to execute for each element.  The
     *   callback is passed 3 arguments: current element, index of element and 
     *   this array.  If callback returns {Boolean} false, the loop will stop.
     * @param {Object} [thisArg] Object to use as this when executing callback.
     * 
     * @returns {fuse.Array}
     * 
     * @throws {TypeError} If callback isn't a function, TypeError is thrown. 
     */      
    function each(callback, thisArg) {
      var i = -1, object = Object(this), length = object.length >>> 0;
      if (typeof callback != 'function') {
        throw new TypeError;
      }
      while (++i < length) {
        if (i in object && callback.call(thisArg, object[i], i, object) === false) {
          break;
        }
      }
      return this;
    }

    /**
     * Returns the first element in the array by default or will return the 
     * first element when a provided testing function passes.  First can also
     * return the first n amount of elements by specifying a count as the first
     * argument.
     * 
     * This method does not use a strict comparison. If your callback function 
     * returns a truthy value, the condition will pass. 
     * 
     * @methodOf fuse.Array#
     * @name first
     * 
     * @param {Function|Number} [callback] Function to test each element or a
     *   count of first elements to return.  When a function, the callback is 
     *   passed 2 arguments: current element and index of element.
     * @param {Object} [thisArg] Object to use as this when executing callback.
     * 
     * @returns {Object|fuse.Array} 
     */        
    function first(callback, thisArg) {
      var count, i = -1, Array = first[ORIGIN].Array,
       object = Object(this), length = object.length >>> 0;
      if (callback == null) {
        while (++i < length) {
          if (i in object) return object[i];
        }
      }
      else if (typeof callback == 'function') {
        while (++i < length) {
          if (callback.call(thisArg, object[i], i)) {
            return object[i];
          }
        }
      }
      else {
        count = +callback; // fast coerce to number
        if (isNaN(count)) return Array();
        count = count < 1 ? 1 : count > length ? length : count;
        return Array.prototype.slice.call(object, 0, count);
      }
    }

    /**
     * Incrementally builds a result value based on the successive results of 
     * the callback.
     * 
     * @methodOf fuse.Array#
     * @name inject
     * 
     * @param {Object} accumulator The initial value to which the callback
     *   modifies.
     * @param {Function} callback Function to modify the accumulator for each 
     *   element.  The callback is passed 4 arguments: current accumulator
     *   value, current element, index of element and this array.   
     * @param {Object} [thisArg] Object to use as this when executing callback.
     * 
     * @returns {Object} 
     * 
     * @throws {TypeError} If callback isn't a function, TypeError is thrown. 
     */            
    function inject(accumulator, callback, thisArg) {
      var i = -1, object = Object(this), length = object.length >>> 0;
      if (typeof callback != 'function') {
        throw new TypeError;
      }
      while (++i < length) {
        if (i in object) {
          accumulator = callback.call(thisArg, accumulator, object[i], i, object);
        }
      }
      return accumulator;
    }

    /**
     * Returns a new array with elements modified by the specified method.
     * 
     * @methodOf fuse.Array#
     * @name invoke
     * 
     * @param {String} method The method name to call on each element.
     * @param {Object} [arg[, ...]] Arguments to pass to the specified method.
     * 
     * @returns {fuse.Array}
     */    
    function invoke(method) {
      var args, result = invoke[ORIGIN].Array(),
       apply = invoke.apply, call = invoke.call,
       object = Object(this), length = object.length >>> 0;

      if (arguments.length < 2) {
        while (length--) {
          if (length in object)
            result[length] = call.call(object[length][method], object[length]);
        }
      } else {
        args = Array.prototype.slice.call(arguments, 1);
        while (length--) {
          if (length in object)
            result[length] = apply.call(object[length][method], object[length], args);
        }
      }
      return result;
    }

    /**
     * Returns the last element in the array by default or will return the 
     * last element when a provided testing function passes.  Last can also
     * return the last n amount of elements by specifying a count as the first
     * argument.
     * 
     * This method does not use a strict comparison. If your callback function 
     * returns a truthy value, the condition will pass. 
     * 
     * @methodOf fuse.Array#
     * @name last
     * 
     * @param {Function|Number} [callback] Function to test each element or a
     *   count of last elements to return.  When a function, the callback is 
     *   passed 2 arguments: current element and index of element.
     * @param {Object} [thisArg] Object to use as this when executing callback.
     * 
     * @returns {Object|fuse.Array} 
     */   
    function last(callback, thisArg) {
      var result, count, Array = last[ORIGIN].Array,
       object = Object(this), length = object.length >>> 0;

      if (callback == null) {
        return object[length && length - 1];
      }
      if (typeof callback == 'function') {
        while (length--) {
          if (callback.call(thisArg, object[length], length, object))
            return object[length];
        }
      } else {
        count = +callback;
        result = Array();
        if (isNaN(count)) return result;

        count = count < 1 ? 1 : count > length ? length : count;
        return result.slice.call(object, length - count);
      }
    }

    /**
     * Returns the maximum value in the array based on Math.max or a 
     * greater-than (>) comparison.  A function may be specified to transform the
     * element before the comparison is called.
     * 
     * @methodOf fuse.Array#
     * @name max
     * 
     * @param {Function} [callback] Function to transform each element before
     *   the comparison. The callback is passed 3 arguments: current element, 
     *   index of element and this array.
     * @param {Object} [thisArg] Object to use as this when executing callback.
     * 
     * @returns {Object} Returns undefined when no elements are in the array.
     */ 
    function max(callback, thisArg) {
      var result;
      if (!callback && (callback = fuse.Function.IDENTITY) && fuse.Object.isArray(this)) {
        // John Resig's fast Array max|min:
        // http://ejohn.org/blog/fast-javascript-maxmin
        result = Math.max.apply(Math, this);
        if (!isNaN(result)) return result;
        result = undef;
      }

      var comparable, max, value, i = -1,
       object = Object(this), length = object.length >>> 0;

      while (++i < length) {
        if (i in object) {
          comparable = callback.call(thisArg, value = object[i], i, object);
          if (max == null || comparable > max) {
            max = comparable; result = value;
          }
        }
      }
      return result;
    }

    /**
     * Returns the minimum value in the array based on Math.min or a 
     * less-than (<) comparison.  A function may be specified to transform the
     * element before the comparison is called.
     * 
     * @methodOf fuse.Array#
     * @name min
     * 
     * @param {Function} [callback] Function to transform each element before
     *   the comparison. The callback is passed 3 arguments: current element, 
     *   index of element and this array.
     * @param {Object} [thisArg] Object to use as this when executing callback.
     * 
     * @returns {Object} Returns undefined when no elements are in the array.
     */     
    function min(callback, thisArg) {
      var result;
      if (!callback && (callback = fuse.Function.IDENTITY) && fuse.Object.isArray(this)) {
        result = Math.min.apply(Math, this);
        if (!isNaN(result)) return result;
        result = undef;
      }

      var comparable, min, value, i = -1,
       object = Object(this), length = object.length >>> 0;

      while (++i < length) {
        if (i in object) {
          comparable = callback.call(thisArg, value = object[i], i, object);
          if (min == null || comparable < min) {
            min = comparable; result = value;
          }
        }
      }
      return result;
    }


    /**
     * Returns a new array that contains two elements.  The first element is a
     * truthy array and the second is a falsy array.  A function may be
     * specified to perform a custom test on each element.
     * 
     * This method does not use a strict comparison. If your callback function 
     * returns a truthy value, the condition will pass. 
     * 
     * @methodOf fuse.Array#
     * @name partition
     * 
     * @param {Function} [callback] Function to test each element. The callback 
     *   is passed 3 arguments: current element, index of element 
     *   and this array.
     * @param {Object} [thisArg] Object to use as this when executing callback.
     * 
     * @returns {fuse.Array} Returns [[true array], [false array]]
     */        
    function partition(callback, thisArg) {
      var item, i = -1, j = i, k = i,  Array = partition[ORIGIN].Array,
       object = Object(this), length = object.length >>> 0,
       trues = Array(), falses = Array();

      callback || (callback = fuse.Function.IDENTITY);
      while (++i < length) {
        if (i in object) {
          if (callback.call(thisArg, item = object[i], i, object)) {
            trues[++j] = item;
          } else {
            falses[++k] = item;
          }
        }
      }
      return Array(trues, falses);
    }

    /**
     * Returns a new array containing the values of the property specified for
     * each element.
     * 
     * @methodOf fuse.Array#
     * @name pluck
     * 
     * @param {String} property The property name used to capture values.
     * 
     * @returns {fuse.Array}
     */     
    function pluck(property) {
      var i = -1, result = pluck[ORIGIN].Array(),
       object = Object(this), length = object.length >>> 0;

      while (++i < length) {
        if (i in object) result[i] = object[i][property];
      }
      return result;
    }

    /**
     * Returns the size of the array.
     * 
     * @methodOf fuse.Array#
     * @name size
     * 
     * @returns {fuse.Number}
     */
    function size() {
      return size[ORIGIN].Number(Object(this).length >>> 0);
    }

    /**
     * Returns a new array with the elements in the list sorted based on 
     * the criteria computed for each element.
     * 
     * @methodOf fuse.Array#
     * @name sortBy
     * 
     * @param {Function} [callback] Function to compute the criteria for each 
     *   element. The callback is passed 3 arguments: current element, index of 
     *   element and this array.
     * @param {Object} [thisArg] Object to use as this when executing callback.
     * 
     * @returns {fuse.Array}
     */
    function sortBy(callback, thisArg) {
      var value, i = -1,  array = [], object = Object(this),
       length = object.length >>> 0,
       result = sortBy[ORIGIN].Array();

      callback || (callback = fuse.Function.IDENTITY);
      while (length--) {
        value = object[length];
        array[length] = { 'value': value, 'criteria': callback.call(thisArg, value, length, object) };
      }

      array = array.sort(fuse._.sorter);
      length = array.length;
      while (++i < length) {
        if (i in array) result[i] = array[i].value;
      }
      return result;
    }
    
    /**
     * Returns a new array of tuples by combining two or more specified arrays.
     * 
     * @methodOf fuse.Array#
     * @name zip
     * 
     * @param {Array} array[, ...] The array or arrays to zip with this array. 
     * @param {Function} [callback] Function to transform the tuples once 
     *   generated; this is always the last argument provided.  The callback is
     *   passed 2 arguments: index of element and this array.
     * 
     * @returns {fuse.Array}
     */
    function zip() {
      var lists, plucked, j, k, i = -1,
       origin   = zip[ORIGIN],
       result   = origin.Array(),
       args     = Array.prototype.slice.call(arguments, 0),
       callback = fuse.Function.IDENTITY,
       object   = Object(this),
       length   = object.length >>> 0;

      // if last argument is a function it is the callback
      if (typeof args[args.length - 1] == 'function') {
        callback = args.pop();
      }

      lists = fuse._.prependList(args, object);
      k = lists.length;

      while (++i < length) {
        j = -1;
        plucked = origin.Array();
        while (++j < k) {
          if (j in lists) plucked[j] = lists[j][i];
        }
        result[i] = callback(plucked, i, object);
      }
      return result;
    }

    /*------------------------------------------------------------------------*/

    plugin.clear = clear;
    plugin.contains = contains;
    plugin.each = each;
    plugin.inject = inject;
    plugin.insert = insert;
    plugin.max = max;
    plugin.min = min;

    from[ORIGIN] =
    fromNodeList[ORIGIN] =
    (plugin.clone = clone)[ORIGIN] =
    (plugin.compact = compact)[ORIGIN] =
    (plugin.first = first)[ORIGIN] =
    (plugin.flatten = flatten)[ORIGIN] =
    (plugin.intersect = intersect)[ORIGIN] =
    (plugin.invoke = invoke)[ORIGIN] =
    (plugin.last = last)[ORIGIN] =
    (plugin.partition = partition)[ORIGIN] =
    (plugin.pluck = pluck)[ORIGIN] =
    (plugin.size = size)[ORIGIN] =
    (plugin.sortBy = sortBy)[ORIGIN] =
    (plugin.unique = unique)[ORIGIN] =
    (plugin.without = without)[ORIGIN] =
    (plugin.zip = zip)[ORIGIN] = fuse;

    if (!fuse.Object.isFunction(plugin.every)) {
      plugin.every =
      every.raw = every;
    }
    if (!fuse.Object.isFunction(plugin.filter)) {
      plugin.filter =
      filter.raw = filter;
      filter[ORIGIN] = fuse;
    }
    if (!fuse.Object.isFunction(plugin.forEach)) {
      plugin.forEach =
      forEach.raw = forEach;
    }
    if (!fuse.Object.isFunction(plugin.indexOf)) {
      plugin.indexOf =
      indexOf.raw = indexOf;
      indexOf[ORIGIN] = fuse;
    }
    if (!fuse.Object.isFunction(plugin.lastIndexOf)) {
      plugin.lastIndexOf =
      lastIndexOf.raw = lastIndexOf;
      lastIndexOf[ORIGIN] = fuse;
    }
    if (!fuse.Object.isFunction(plugin.map)) {
      plugin.map =
      map.raw = map;
      map[ORIGIN] = fuse;
    }
    if (!fuse.Object.isFunction(plugin.some)) {
      plugin.some =
      some.raw = some;
    }

    // assign statics
    fuse.Array.from = from;
    fuse.Array.fromNodeList = fromNodeList;

    // assign missing enumerable methods
    if (fuse.Class.mixins.enumerable) {
      plugin._each = _each;
      plugin.toArray = clone;
      fuse.Object.each(fuse.Class.mixins.enumerable, function(value, key, object) {
        if (!fuse.Object.isFunction(plugin[key])) {
          plugin[key] = value;
        }
      });
    }
  })(fuse.Array.plugin);

  (function(plugin) {

    function contains(value) {
      // attempt a fast strict search first
      var object = Object(this);
      return plugin.indexOf.call(object, value) > -1 ?
        true : __contains.call(object, value);
    }

    function inject(accumulator, callback, thisArg) {
      return thisArg
        ? __inject.call(this, accumulator, callback, thisArg)
        : plugin.reduce.call(this, callback, accumulator);
    }

    var __contains = plugin.contains, __inject = plugin.inject;
    if (fuse.Object.isFunction(Array.prototype.indexOf)) {
      plugin.contains = contains;
    }
    if (fuse.Object.isFunction(Array.prototype.reduce)) {
      plugin.inject = inject;
    }
  })(fuse.Array.plugin);
