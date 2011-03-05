  /*---------------------------- LANG: ENUMERABLE ----------------------------*/
  /**
   * Represents the mixin methods for enumerable, which supports a simple 
   * iteration over a collection of a specified type.
   * 
   * When implementing the enumerable mixin to another object, it is required
   * a _each method is provided to iterate over the collection.
   * 
   * @namespace
   * @name fuse.Class.mixins.enumerable
   */
  fuse.Class.mixins.enumerable = { };

  (function(mixin) {
 
    var $break = function() { };

    /**
     * Tests whether an element is in the array.
     * 
     * This method uses a strict comparison against the value specified.
     * 
     * @methodOf fuse.Class.mixins.enumerable
     * @name contains
     * 
     * @param {Object} value The object to locate in the list.
     * 
     * @returns {Boolean}
     */     
    function contains(value) {
      var result = 0;
      this.each(function(item) {
        // basic strict match
        if (item === value && result++) return false; 
        // match String and Number object instances
        try {
          if (item.valueOf() === value.valueOf() && result++) return false;
        } catch (e) { }
      });

      return !!result;
    }

    /**
     * Calls a function for each element in the collection.
     * 
     * @methodOf fuse.Class.mixins.enumerable
     * @name each
     * 
     * @param {Function} callback Function to execute for each element.  The
     *   callback is passed 3 arguments: current element, index of element and 
     *   the collection.  If callback returns {Boolean} false, the loop will stop.
     * @param {Object} [thisArg] Object to use as this when executing callback.
     * 
     * @returns {Object}
     * 
     * @throws {TypeError} If callback isn't a function, TypeError is thrown. 
     */      
    function each(callback, thisArg) {
      if (typeof callback != 'function') {
        throw new TypeError;
      }
      try {
        this._each(function(value, index, iterable) {
          if (callback.call(thisArg, value, index, iterable) === false)
            throw $break;
        });
      } catch (e) {
        if (e != $break) throw e;
      }
      return this;
    }

    /**
     * Groups items into chunks of the given size. The final "slice" may have 
     * fewer than number items; it won't "pad" the last group with empty values.
     * 
     * @methodOf fuse.Class.mixins.enumerable
     * @name eachSlice
     * 
     * @param {Number} size The number of items to include in each slice.
     * @param {Function} [callback] Function used to transform each element 
     *   before it's included in the slice; if this is not provided, the element 
     *   itself is included.
     * @param {Object} [thisArg] Object to use as this when executing callback.
     * 
     * @returns {fuse.Array}  
     */     
    function eachSlice(size, callback, thisArg) {
      var index = -size, slices = fuse.Array(), list = this.toArray();
      if (size < 1) return list;
      while ((index += size) < list.length) {
        slices[slices.length] = list.slice(index, index + size);
      }
      return callback
        ? slices.map(callback, thisArg)
        : slices;
    }

    /**
     * Returns true if every element in the collection satisfies the provided
     * testing function.
     * 
     * This method does not use a strict comparison. If your callback function 
     * returns a truthy value, the condition will pass. 
     * 
     * @methodOf fuse.Class.mixins.enumerable
     * @name every
     * 
     * @param {Function} callback Function to test for each element.  The
     *   callback is passed 3 arguments: current element, index of element and 
     *   the collection.
     * @param {Object} [thisArg] Object to use as this when executing callback.
     * 
     * @returns {Boolean}
     * 
     * @throws {TypeError} If callback isn't a function, TypeError is thrown.
     */    
    function every(callback, thisArg) {
      var result = true;
      if (typeof callback != 'function') {
        throw new TypeError;
      }
      this.each(function(value, index, iterable) {
        if (!callback.call(thisArg, value, index, iterable)) {
          return (result = false);
        }
      });
      return result;
    }

    /**
     * Returns a new array with all elements that pass the test implemented by 
     * the provided function.
     * 
     * This method does not use a strict comparison. If your callback function 
     * returns a truthy value, the condition will pass. 
     * 
     * @methodOf fuse.Class.mixins.enumerable
     * @name filter
     * 
     * @param {Function} callback Function to test each element of the array.  
     *   The callback is passed 3 arguments: current element, index of element 
     *   and the collection.
     * @param {Object} [thisArg] Object to use as this when executing callback.
     * 
     * @returns {fuse.Array}
     * 
     * @throws {TypeError} If callback isn't a function, TypeError is thrown.
     */
    function filter(callback, thisArg) {
      var result = fuse.Array();
      if (typeof callback != 'function') {
        throw new TypeError;
      }
      this._each(function(value, index, iterable) {
        if (callback.call(thisArg, value, index, iterable))
          result.push(value);
      });
      return result;
    }

    /**
     * Returns the first element in the collection by default or will return the 
     * first element when a provided testing function passes.  First can also
     * return the first n amount of elements by specifying a count as the first
     * argument.
     * 
     * This method does not use a strict comparison. If your callback function 
     * returns a truthy value, the condition will pass. 
     * 
     * @methodOf fuse.Class.mixins.enumerable
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
      if (callback == null) {
        var result;
        this.each(function(value) { result = value; return false; });
        return result;
      }
      return this.toArray().first(callback, thisArg);
    }

    /**
     * Returns a new array of grouped values based on the specified size.  If
     * there are empty slots in the last group, then this method will pad the
     * group with null or the specified filler.
     * 
     * @methodOf fuse.Class.mixins.enumerable
     * @name inGroupsOf
     * 
     * @param {Number} size The number of items to include in each group.
     * @param {Object} [filler = null] Object to fill in empty slots of last 
     *   group if any exist. 
     * 
     * @returns {fuse.Array} 
     */
    function inGroupsOf(size, filler) {
      filler = typeof filler == 'undefined' ? null : filler;
      return this.eachSlice(size, function(slice) {
        while (slice.length < size) slice.push(filler);
        return slice;
      });
    }

    /**
     * Incrementally builds a result value based on the successive results of 
     * the callback.
     * 
     * @methodOf fuse.Class.mixins.enumerable
     * @name inject
     * 
     * @param {Object} accumulator The initial value to which the callback
     *   modifies.
     * @param {Function} callback Function to modify the accumulator for each 
     *   element.  The callback is passed 4 arguments: current accumulator
     *   value, current element, index of element and the collection.   
     * @param {Object} [thisArg] Object to use as this when executing callback.
     * 
     * @returns {Object} 
     * 
     * @throws {TypeError} If callback isn't a function, TypeError is thrown. 
     */      
    function inject(accumulator, callback, thisArg) {
      if (typeof callback != 'function') {
        throw new TypeError;
      }
      this._each(function(value, index, iterable) {
        accumulator = callback.call(thisArg, accumulator, value, index, iterable);
      });
      return accumulator;
    }

    /**
     * Returns a new array with elements modified by the specified method.
     * 
     * @methodOf fuse.Class.mixins.enumerable
     * @name invoke
     * 
     * @param {String} method The method name to call on each element.
     * @param {Object} [arg[, ...]] Arguments to pass to the specified method.
     * 
     * @returns {fuse.Array}
     */      
    function invoke(method) {
      var args = Array.prototype.slice.call(arguments, 1), funcProto = Function.prototype;
      return this.map(function(value) {
        return funcProto.apply.call(value[method], value, args);
      });
    }

    /**
     * Returns the last element in the collection by default or will return the 
     * last element when a provided testing function passes.  Last can also
     * return the last n amount of elements by specifying a count as the first
     * argument.
     * 
     * This method does not use a strict comparison. If your callback function 
     * returns a truthy value, the condition will pass. 
     * 
     * @methodOf fuse.Class.mixins.enumerable
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
      return this.toArray().last(callback, thisArg);
    }

    /**
     * Returns a new array with the results of calling a provided function on 
     * every element in the collection.
     * 
     * @methodOf fuse.Class.mixins.enumerable
     * @name map
     * 
     * @param {Function} callback Function that produces an element for the new 
     *   Array from an element of the current collection.  The callback is 
     *   passed 3 arguments: current element, index of element and the 
     *   collection.
     * @param {Object} [thisArg] Object to use as this when executing callback.
     * 
     * @returns {fuse.Array}
     * 
     * @throws {TypeError} If callback isn't a function, TypeError is thrown.
     */    
    function map(callback, thisArg) {
      var result = fuse.Array();
      if (typeof callback != 'function') {
        throw new TypeError;
      }
      if (thisArg) {
        this._each(function(value, index, iterable) {
          result.push(callback.call(thisArg, value, index, iterable));
        });
      } else {
        this._each(function(value, index, iterable) {
          result.push(callback(value, index, iterable));
        });
      }
      return result;
    }

    /**
     * Returns the maximum value in the collection based on a greater-than (>) 
     * comparison.  A function may be specified to transform the element before 
     * the comparison is called.
     * 
     * @methodOf fuse.Class.mixins.enumerable
     * @name max
     * 
     * @param {Function} [callback] Function to transform each element before
     *   the comparison. The callback is passed 3 arguments: current element, 
     *   index of element and the collection.
     * @param {Object} [thisArg] Object to use as this when executing callback.
     * 
     * @returns {Object} Returns undefined when no elements are in the 
     *   collection.
     */     
    function max(callback, thisArg) {
      callback || (callback = fuse.Function.IDENTITY);
      var comparable, max, result;
      this._each(function(value, index, iterable) {
        comparable = callback.call(thisArg, value, index, iterable);
        if (max == null || comparable > max) {
          max = comparable; result = value;
        }
      });
      return result;
    }

    /**
     * Returns the minimum value in the collection based on a less-than (<) 
     * comparison.  A function may be specified to transform the element before 
     * the comparison is called.
     * 
     * @methodOf fuse.Class.mixins.enumerable
     * @name min
     * 
     * @param {Function} [callback] Function to transform each element before
     *   the comparison. The callback is passed 3 arguments: current element, 
     *   index of element and the collection.
     * @param {Object} [thisArg] Object to use as this when executing callback.
     * 
     * @returns {Object} Returns undefined when no elements are in the 
     *   collection.
     */         
    function min(callback, thisArg) {
      callback || (callback = fuse.Function.IDENTITY);
      var comparable, min, result;
      this._each(function(value, index, iterable) {
        comparable = callback.call(thisArg, value, index, iterable);
        if (min == null || comparable < min) {
          min = comparable; result = value;
        }
      });
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
     * @methodOf fuse.Class.mixins.enumerable
     * @name partition
     * 
     * @param {Function} [callback] Function to test each element. The callback 
     *   is passed 3 arguments: current element, index of element 
     *   and the collection.
     * @param {Object} [thisArg] Object to use as this when executing callback.
     * 
     * @returns {fuse.Array} Returns [[true array], [false array]]
     */       
    function partition(callback, thisArg) {
      callback || (callback = fuse.Function.IDENTITY);
      var trues = fuse.Array(), falses = fuse.Array();
      this._each(function(value, index, iterable) {
        (callback.call(thisArg, value, index, iterable) ?
          trues : falses).push(value);
      });
      return fuse.Array(trues, falses);
    }

    /**
     * Returns a new array containing the values of the property specified for
     * each element.
     * 
     * @methodOf fuse.Class.mixins.enumerable
     * @name pluck
     * 
     * @param {String} property The property name used to capture values.
     * 
     * @returns {fuse.Array}
     */      
    function pluck(property) {
      return this.map(function(value) {
        return value[property];
      });
    }

    /**
     * Returns the size of the collection.
     * 
     * @methodOf fuse.Class.mixins.enumerable
     * @name size
     * 
     * @returns {fuse.Number}
     */    
    function size() {
      return fuse.Number(this.toArray().length);
    }

    /**
     * Tests whether some element in the collection passes the test implemented 
     * by the provided function.
     * 
     * This method does not use a strict comparison. If your callback function 
     * returns a truthy value, the condition will pass. 
     * 
     * @methodOf fuse.Class.mixins.enumerable
     * @name some
     * 
     * @param {Function} callback Function to test for each element.  The
     *   callback is passed 3 arguments: current element, index of element and 
     *   the collection.
     * @param {Object} [thisArg] Object to use as this when executing callback.
     * 
     * @returns {Boolean}
     * 
     * @throws {TypeError} If callback isn't a function, TypeError is thrown.
     * 
     * @see ES5 15.4.4.17
     */       
    function some(callback, thisArg) {
      var result = false;
      if (typeof callback != 'function') {
        throw new TypeError;
      }
      this.each(function(value, index, iterable) {
        if (callback.call(thisArg, value, index, iterable)) {
          return !(result = true);
        }
      });
      return result;
    }

    /**
     * Returns a new array with the elements in the list sorted based on 
     * the criteria computed for each element.
     * 
     * @methodOf fuse.Class.mixins.enumerable
     * @name sortBy
     * 
     * @param {Function} [callback] Function to compute the criteria for each 
     *   element. The callback is passed 3 arguments: current element, index of 
     *   element and the collection.
     * @param {Object} [thisArg] Object to use as this when executing callback.
     * 
     * @returns {fuse.Array}
     */    
    function sortBy(callback, thisArg) {
      return this.map(function(value, index, iterable) {
        return {
          'value': value,
          'criteria': callback.call(thisArg, value, index, iterable)
        };
      }).sort(function(left, right) {
        var a = left.criteria, b = right.criteria;
        return a < b ? -1 : a > b ? 1 : 0;
      }).pluck('value');
    }

    /**
     * Converts the array-like object to a fuse.Array.
     * 
     * @methodOf fuse.Class.mixins.enumerable
     * @name toArray
     * 
     * @returns {fuse.Array}
     */
    function toArray() {
      var result = fuse.Array();
      this._each(function(value, index) { result[index] = value; });
      return result;
    }

    /**
     * Returns a new array of tuples by combining two or more specified 
     * collections.
     * 
     * @methodOf fuse.Class.mixins.enumerable
     * @name zip
     * 
     * @param {ArrayLike} collection[, ...] The collection or collections to 
     *   zip with this collection. 
     * @param {Function} [callback] Function to transform the tuples once 
     *   generated; this is always the last argument provided.  The callback is
     *   passed 2 arguments: index of element and the collection.
     * 
     * @returns {fuse.Array}
     */    
    function zip() {
      var j, length, lists, plucked, callback = fuse.Function.IDENTITY,
       args = Array.prototype.slice.call(arguments, 0);

      // if last argument is a function it is the callback
      if (typeof args[args.length-1] == 'function') {
        callback = args.pop();
      }

      lists = fuse._.prependList(args, this.toArray());
      length = lists.length;

      return this.map(function(value, index, iterable) {
        j = -1; plucked = fuse.Array();
        while (++j < length) {
          if (j in lists) plucked[j] = lists[j][index];
        }
        return callback(plucked, index, iterable);
      });
    }

    mixin.contains = contains;
    mixin.each = each;
    mixin.eachSlice = eachSlice;
    mixin.every = every;
    mixin.filter = filer;
    mixin.first = first;
    mixin.inGroupsOf = inGroupsOf;
    mixin.inject = inject;
    mixin.invoke = invoke;
    mixin.last = last;
    mixin.map = map;
    mixin.max = max;
    mixin.min = min;
    mixin.partition = partition;
    mixin.pluck = pluck;
    mixin.size = size;
    mixin.some = some;
    mixin.sortBy = sortBy;
    mixin.toArray = toArray;
    mixin.zip = zip;

  })(fuse.Class.mixins.enumerable);
