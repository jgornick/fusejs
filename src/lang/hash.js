  /*------------------------------- LANG: HASH -------------------------------*/
  
  /**
   * Represents a collection of keys and values.
   * 
   * @class
   * @name fuse.Hash
   */
  
  fuse.Hash = (function() {

    function Klass() { }

    /**
     * Hash constructor.
     * 
     * @memberOf fuse.Hash
     * @constructor
     * @name Hash
     * 
     * @param {Object} [object] An object to wrap with Hash.
     * 
     * @returns {fuse.Hash}
     */
    function Hash(object) {
      return setWithObject((new Klass).clear(), object);
    }

    /**
     * Returns a new hash with the specified object merged into this hash.
     * 
     * @methodOf fuse.Hash#
     * @name merge
     * 
     * @param {Object} object An object to merge into this hash.
     * 
     * @returns {fuse.Hash}
     */
    function merge(object) {
      return setWithObject(this.clone(), object);
    }

    /**
     * Add or update values of this hash specified by the key or an object of 
     * keys and values.
     * 
     * @methodOf fuse.Hash#
     * @name set
     * 
     * @param {String|Object} key The key of the element to set. Key can also be 
     *   an object to set multiple key/values.
     * @param {Object} [value] The value of the specified key.
     * 
     * @returns {fuse.Hash}
     */
    function set(key, value) {
      return fuse.Object.isString(key)
        ? setValue(this, key, value)
        : setWithObject(this, key);
    }

    /**
     * Removes an element from this hash by the specified key.
     * 
     * @methodOf fuse.Hash#
     * @name unset
     * 
     * @param {String|Array} key[, ...] The key of the element to remove from
     *   this hash. When wanting to remove multiple elements, key can be an 
     *   array of keys or multiple arguments.
     *   
     * @returns {fuse.Hash}
     */
    function unset(key) {
      var data = this._data, i = -1,
       keys = fuse.Object.isArray(key) ? key : arguments;

      while (key = keys[++i])  {
        if ((fuse.uid + key) in data)
          unsetByIndex(this, indexOfKey(this, key));
      }
      return this;
    }

    /**
     * Returns the index of the element by the key specified.
     * 
     * @methodOf fuse.Hash#
     * @private
     * @name indexOfKey
     * 
     * @param {fuse.Hash} hash The hash to search.
     * @param {String} key The key to search for.
     * 
     * @return {Number}
     */
    function indexOfKey(hash, key) {
      key = String(key);
      var i = -1, keys = hash._keys, length = keys.length;
      while (++i < length) {
        if (keys[i] == key) return i;
      }
    }

    /**
     * Adds or updates element value by specified key.
     * 
     * @methodOf fuse.Hash#
     * @private
     * @name setValue
     * 
     * @param {fuse.Hash} hash The hash to set the value.
     * @param {String} key The key to set the value.
     * @param {Object} value The value of the specified key.
     * 
     * @returns {fuse.Hash}
     */
    function setValue(hash, key, value) {
      if (!key.length) return hash;
      var data = hash._data, uidKey = fuse.uid + key, keys = hash._keys;

      // avoid a method call to Hash#hasKey
      if (uidKey in data) {
        unsetByIndex(hash, indexOfKey(hash, key));
      }

      keys.push(key = fuse.String(key));

      hash._pairs.push(fuse.Array(key, value));
      hash._values.push(value);

      hash._data[uidKey] =
      hash._object[key] = value;
      return hash;
    }

    /**
     * Adds or updates multiple element values by the specified object.
     * 
     * @memberOf fuse.Hash#
     * @private
     * @name setWithObject
     * 
     * @param {fuse.Hash} hash The hash to set values.
     * @param {Object} object The object containing key/values.
     * 
     * @returns {fuse.Hash}
     */
    function setWithObject(hash, object) {
      if (fuse.Object.isHash(object)) {
        var pair, i = -1, pairs = object._pairs;
        while (pair = pairs[++i]) setValue(hash, pair[0], pair[1]);
      }
      else {
        fuse.Object.each(object, function(value, key) {
          setValue(hash, key, value);
        });
      }
      return hash;
    }

    /**
     * Removes an element from this hash by an index.
     * 
     * @methodOf fuse.Hash#
     * @private
     * @name unsetByIndex
     * 
     * @param {fuse.Hash} hash The hash containing the element to remove.
     * @param {Number} index The index of the element to remove.
     */
    function unsetByIndex(hash, index) {
      var keys = hash._keys;
      delete hash._data[fuse.uid + keys[index]];
      delete hash._object[keys[index]];

      keys.splice(index, 1);
      hash._pairs.splice(index, 1);
      hash._values.splice(index, 1);
    }

    fuse.Class({ 'constructor': Hash, 'merge': merge, 'set': set, 'unset': unset });
    Klass.prototype = Hash.plugin;
    return Hash;
  })();

  /**
   * Convert an object to a fuse.Hash instance.
   * 
   * @methodOf fuse.Hash
   * @static
   * @name from
   * 
   * @param {Object} object The object to convert to a hash.
   * 
   * @returns {fuse.Hash}
   */
  fuse.Hash.from = fuse.Hash;

  /*--------------------------------------------------------------------------*/

  (function(plugin) {

    /**
     * Removes all elements from this hash.
     * 
     * @methodOf fuse.Hash#
     * @name clear
     * 
     * @returns {fuse.Hash}
     */
    function clear() {
      this._data   = { };
      this._object = { };
      this._keys   = fuse.Array();
      this._pairs  = fuse.Array();
      this._values = fuse.Array();
      return this;
    }

    /**
     * Returns a shallow clone of this hash.
     * 
     * @methodOf fuse.Hash#
     * @name clone
     * 
     * @param {Boolean} deep Flag to perform a deep clone.
     * 
     * @returns {fuse.Hash}
     */  
    function clone(deep) {
      var result, pair, pairs, i = -1, origin = clone[ORIGIN];
      if (deep) {
        result = origin.Hash();
        pairs  = this._pairs;
        while (pair = pairs[++i]) {
          result.set(pair[0], origin.Object.clone(pair[1], deep));
        }
      } else {
        result = origin.Hash(this);
      }
      return result;
    }

    /**
     * Returns the value for the specified key.
     * 
     * @methodOf fuse.Hash#
     * @name get
     * 
     * @param {String} key The key to get the value for.
     * 
     * @returns {Object}
     */     
    function get(key) {
      return this._data[fuse.uid + key];
    }

    /**
     * Determines if the specified key exists.
     * 
     * @methodOf fuse.Hash#
     * @name hasKey
     * 
     * @param {String} key The key to search the hash.
     * 
     * @returns {Boolean} 
     */
    function hasKey(key) {
      return (fuse.uid + key) in this._data;
    }

    /**
     * Return the first key where the value matches the specified value.
     * 
     * @methodOf fuse.Hash#
     * @name keyOf
     * 
     * @param {Object} value The value to search.
     * 
     * @returns {fuse.Number}  
     */
    function keyOf(value) {
      var pair, i = -1, pairs = this._pairs;
      while (pair = pairs[++i]) {
        if (value === pair[1])
          return pair[0];
      }
      return keyOf[ORIGIN].Number(-1);
    }

    /**
     * Returns an array of keys in this hash.
     * 
     * @methodOf fuse.Hash#
     * @name keys
     * 
     * @returns {fuse.Array}  
     */
    function keys() {
      return keys[ORIGIN].Array.fromArray(this._keys);
    }

    /**
     * Converts this hash to a primitive object.
     * 
     * @methodOf fuse.Hash#
     * @name toObject
     * 
     * @returns {Object}  
     */    
    function toObject() {
      var pair, i = -1, pairs = this._pairs, result = toObject[ORIGIN].Object();
      while (pair = pairs[++i]) result[pair[0]] = pair[1];
      return result;
    }

    /**
     * Return an array of values in this hash.
     * 
     * @methodOf fuse.Hash#
     * @name values
     * 
     * @returns {fuse.Array}  
     */
    function values() {
      return values[ORIGIN].Array.fromArray(this._values);
    }

    /*------------------------------------------------------------------------*/

    /* create optimized enumerable equivalents */

    /**
     * Tests whether an element is in the hash by the value specified.
     * 
     * This method uses a strict comparison against the value specified.
     * 
     * @methodOf fuse.Hash#
     * @name contains
     * 
     * @param {Object} value The object to locate in the hash.
     * 
     * @returns {Boolean}
     */      
    function contains(value) {
      var item, pair, i = -1, pairs = this._pairs;
      while (pair = pairs[++i]) {
        // basic strict match
        if ((item = pair[1]) === value) return true;
        // match String and Number object instances
        try { if (item.valueOf() === value.valueOf()) return true; } catch (e) { }
      }
      return false;
    }

    /**
     * Returns a new hash with all elements that pass the test implemented by 
     * the provided function.
     * 
     * This method does not use a strict comparison. If your callback function 
     * returns a truthy value, the condition will pass. 
     * 
     * @methodOf fuse.Hash#
     * @name filter
     * 
     * @param {Function} callback Function to test each element of the hash.  
     *   The callback is passed 3 arguments: element value, element key and this 
     *   hash. Modify the key and value arguments in the callback to transform 
     *   the key/value pair in the resulting hash.
     * @param {Object} [thisArg] Object to use as this when executing callback.
     * 
     * @returns {fuse.Hash}
     * 
     * @throws {TypeError} If callback isn't a function, TypeError is thrown.
     */      
    function filter(callback, thisArg) {
      var key, pair, value, i = -1, pairs = this._pairs,
       result = this.constructor();

      if (typeof callback != 'function') {
        throw new TypeError;
      }
      while (pair = pairs[++i]) {
        if (callback.call(thisArg, value = pair[1], key = pair[0], this))
          result.set(key, value);
      }
      return result;
    }

    /**
     * Returns the first element in the hash by default or will return the 
     * first element when a provided testing function passes.  First can also
     * return the first n amount of elements by specifying a count as the first
     * argument.
     * 
     * This method does not use a strict comparison. If your callback function 
     * returns a truthy value, the condition will pass. 
     * 
     * @methodOf fuse.Hash#
     * @name first
     * 
     * @param {Function|Number} [callback] Function to test each element or a
     *   count of first elements to return.  When a function, the callback is 
     *   passed 3 arguments: element value, element key and this hash.
     * @param {Object} [thisArg] Object to use as this when executing callback.
     * 
     * @returns {Object|fuse.Hash} 
     */          
    function first(callback, thisArg) {
      var count, pair, result, i = -1,
       p = fuse._, pairs = this._pairs;

      if (callback == null) {
        if (pairs.length) return p.returnPair(pairs[0]);
      }
      else if (typeof callback == 'function') {
        while (pair = pairs[++i]) {
          if (callback.call(thisArg, pair[1], pair[0], this))
            return p.returnPair(pair);
        }
      }
      else {
        count  = +callback;
        result = first[ORIGIN].Array();
        if (!isNaN(count)) {
          count = count < 1 ? 1 : count;
          while (++i < count && (pair = pairs[i])) result[i] = p.returnPair(pair);
        }
        return result;
      }
    }

    /**
     * Returns the last element in the hash by default or will return the 
     * last element when a provided testing function passes.  Last can also
     * return the last n amount of elements by specifying a count as the first
     * argument.
     * 
     * This method does not use a strict comparison. If your callback function 
     * returns a truthy value, the condition will pass. 
     * 
     * @methodOf fuse.Hash#
     * @name last
     * 
     * @param {Function|Number} [callback] Function to test each element or a
     *   count of last elements to return.  When a function, the callback is 
     *   passed 3 arguments: element value, element key and this hash.
     * @param {Object} [thisArg] Object to use as this when executing callback.
     * 
     * @returns {Object|fuse.Array} 
     */      
    function last(callback, thisArg) {
      var count, pad, pair, result, i = -1,
       p = fuse._, pairs = this._pairs, length = pairs.length;

      if (callback == null) {
        if (length) return p.returnPair(this._pairs.last());
      }
      else if (typeof callback == 'function') {
        while (length--) {
          pair = pairs[length];
          if (callback.call(thisArg, pair[1], pair[2], this))
            return p.returnPair(pair);
        }
      }
      else {
        count = +callback;
        result = last[ORIGIN].Array();
        if (!isNaN(count)) {
          count = count < 1 ? 1 : count > length ? length : count;
          pad = length - count;
          while (++i < count)
            result[i] = p.returnPair(pairs[pad + i]);
        }
        return result;
      }
    }

    /**
     * Returns a new hash with the results of calling a provided function on 
     * every element in this hash.
     * 
     * @methodOf fuse.Hash#
     * @name map
     * 
     * @param {Function} callback Function that produces a value for each
     *   element in the hash.  The callback is passed 3 arguments: 
     *   element value, element key and this hash.
     * @param {Object} [thisArg] Object to use as this when executing callback.
     * 
     * @returns {fuse.Hash}
     * 
     * @throws {TypeError} If callback isn't a function, TypeError is thrown.
     */    
    function map(callback, thisArg) {
      var key, pair, i = -1, pairs = this._pairs, result = this.constructor();
      if (typeof callback != 'function') {
        throw new TypeError;
      }
      while (pair = pairs[++i]) {
        result.set(key = pair[0], callback.call(thisArg, pair[1], key, this));
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
     * @methodOf fuse.Hash#
     * @name partition
     * 
     * @param {Function} [callback] Function to test each element. The callback 
     *   is passed 3 arguments: element value, element key and this hash.
     * @param {Object} [thisArg] Object to use as this when executing callback.
     * 
     * @returns {fuse.Array} Returns [[true array], [false array]]
     */      
    function partition(callback, thisArg) {
      callback || (callback = fuse.Function.IDENTITY);
      var key, value, pair, i = -1, origin = partition[ORIGIN],
       pairs = this._pairs, trues = origin.Hash(), falses = origin.Hash();

      while (pair = pairs[++i]) {
        (callback.call(thisArg, value = pair[1], key = pair[0], this) ?
          trues : falses).set(key, value);
      }
      return origin.Array(trues, falses);
    }

    /**
     * Returns the size of the hash.
     * 
     * @methodOf fuse.Hash#
     * @name size
     * 
     * @returns {fuse.Number}
     */    
    function size() {
      return size[ORIGIN].Number(this._keys.length);
    }

    /**
     * Returns and array representation of this hash.
     * 
     * @methodOf fuse.Hash#
     * @name toArray
     * 
     * @returns {fuse.Array}
     */
    function toArray() {
      return toArray[ORIGIN].Array.fromArray(this._pairs);
    }

    /**
     * Returns a new hash of tuples by combining two or more specified hashes.
     * 
     * @methodOf fuse.Hash#
     * @name zip
     * 
     * @param {fuse.Hash|Object} hash[, ...] The hash or hashes to zip with this
     *   hash. 
     * @param {Function} [callback] Function to transform the tuples once 
     *   generated; this is always the last argument provided.  The callback is
     *   passed 3 arguments: element value, element key and this hash.
     * 
     * @returns {fuse.Hash}
     */    
    function zip() {
      var j, key, length, pair, pairs, values, i = -1,
       origin   = zip[ORIGIN],
       hashes   = [this],
       pairs    = this._pairs,
       args     = hashes.slice.call(arguments, 0),
       callback = fuse.Function.IDENTITY,
       result   = origin.Hash();

      // if last argument is a function it is the callback
      if (typeof args[args.length - 1] == 'function') {
        callback = args.pop();
      }

      length = args.length;
      while (length--) {
        hashes[length + 1] = origin.Hash(args[length]);
      }

      length = hashes.length;
      while (pair = pairs[++i]) {
        j = -1; values = origin.Array(); key = pair[0];
        while (++j < length) values[j] = hashes[j]._data[fuse.uid + key];
        result.set(key, callback(values, key, this));
      }
      return result;
    }

    /*------------------------------------------------------------------------*/

    plugin.clear = clear;
    plugin.contains = contains;
    plugin.filter = filter;
    plugin.get = get;
    plugin.hasKey = hasKey;
    plugin.map = map;

    (plugin.clone = clone)[ORIGIN] =
    (plugin.first = first)[ORIGIN] =
    (plugin.keyOf = keyOf)[ORIGIN] =
    (plugin.keys = keys)[ORIGIN] =
    (plugin.last = last)[ORIGIN] =
    (plugin.partition = partition)[ORIGIN] =
    (plugin.size = size)[ORIGIN] =
    (plugin.toArray = toArray)[ORIGIN] =
    (plugin.toObject = toObject)[ORIGIN] =
    (plugin.values = values)[ORIGIN] =
    (plugin.zip = zip)[ORIGIN] = fuse;

  })(fuse.Hash.plugin);
