  /*------------------------------ LANG: NUMBER ------------------------------*/

  /**
   * Represents a class wrapper for numerical values.
   * 
   * @class
   * @name fuse.Number
   */

  /* create shared pseudo private props */

  fuse._.pad = '000000';

  /*--------------------------------------------------------------------------*/

  (function(plugin) {

    /**
     * Returns the absolute value of a number.
     * 
     * @methodOf fuse.Number#
     * @name abs
     * 
     * @returns {fuse.Number}
     */
    function abs() {
      return abs[ORIGIN].Number(Math.abs(this));
    }

    /**
     * Returns the smallest integer greater than or equal to a number.
     * 
     * @methodOf fuse.Number#
     * @name ceil
     * 
     * @returns {fuse.Number}
     */    
    function ceil() {
      return ceil[ORIGIN].Number(Math.ceil(this));
    }

    /**
     * Returns a new copy of this number.
     * 
     * @methodOf fuse.Number#
     * @name clone
     * 
     * @returns {fuse.Number}
     */        
    function clone() {
      return clone[ORIGIN].Number(this);
    }

    /**
     * Returns the largest integer less than or equal to a number.
     * 
     * @methodOf fuse.Number#
     * @name floor
     * 
     * @returns {fuse.Number}
     */     
    function floor() {
      return floor[ORIGIN].Number(Math.floor(this));
    }

    /**
     * Returns the value of a number rounded to the nearest integer.
     * 
     * @methodOf fuse.Number#
     * @name round
     * 
     * @param {Number} fractionDigits 
     * 
     * @returns {fuse.Number}
     */     
    function round(fractionDigits) {
      return round[ORIGIN].Number(fractionDigits
        ? parseFloat(0..toFixed.call(this, fractionDigits))
        : Math.round(this));
    }

    /**
     * Call a function n number of times based on the value of the number.
     * 
     * @methodOf fuse.Number#
     * @name times
     * 
     * @param {Function} callback Function to execute for each element. The 
     *   callback is passed 2 arguments: current element, index of 
     *   element.
     * @param {Object} [thisArg] Object to use as this when executing callback.
     * 
     * @returns {fuse.Number}
     */         
    function times(callback, thisArg) {
      var i = -1, length = fuse._.toInteger(this);
      if (arguments.length == 1) {
        while (++i < length) callback(i, i);
      } else {
        while (++i < length) callback.call(thisArg, i, i);
      }
      return this;
    }

    /**
     * Returns a hexadecimal representation of the number.
     * 
     * @methodOf fuse.Number#
     * @name toColorPart
     * 
     * @returns {fuse.String}
     */     
    function toColorPart() {
      return toColorPart[ORIGIN].Number.toPaddedString(this, 2, 16);
    }

    /**
     * Returns a new string that right-aligns the number and adds padding with 
     * 0's on the left, for a specified total length.
     * 
     * @methodOf fuse.Number#
     * @name toPaddedString
     * 
     * @param {Number} length The total length of the resulting string.  If the
     *   length is less than the resulting string length, the original number
     *   is returned as a string.
     * @param {Number} [radix] An integer between 2 and 36 specifying the base 
     *   to use for representing numeric values.
     * 
     * @returns {fuse.String}
     */  
    function toPaddedString(length, radix) {
      var origin = toPaddedString[ORIGIN], p = fuse._,
       string = p.toInteger(this).toString(radix || 10);

      if (length <= string.length) return origin.String(string);
      if (length > p.pad.length) p.pad = Array(length + 1).join('0');
      return origin.String((p.pad + string).slice(-length));
    }

    /*------------------------------------------------------------------------*/

    plugin.times = times;

    (plugin.abs   = abs)[ORIGIN]   =
    (plugin.ceil  = ceil)[ORIGIN]  =
    (plugin.clone = clone)[ORIGIN] =
    (plugin.floor = floor)[ORIGIN] =
    (plugin.round = round)[ORIGIN] =
    (plugin.toColorPart = toColorPart)[ORIGIN] =
    (plugin.toPaddedString = toPaddedString)[ORIGIN] = fuse;

  })(fuse.Number.plugin);
