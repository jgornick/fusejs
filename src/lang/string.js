  /*------------------------------ LANG: STRING ------------------------------*/

  /**
   * Represents a wrapper for a String object.
   * 
   * @class
   * @name fuse.String
   */

  /* create shared pseudo private props */

  fuse.Object.extend(fuse._, {
    reCapped:       /([A-Z]+)([A-Z][a-z])/g,
    reCamelCases:   /([a-z\d])([A-Z])/g,
    reDoubleColons: /::/g,
    reHyphens:      /-/g,
    reHyphenated:   /-+(.)?/g,
    reUnderscores:  /_/g,
    reTrimLeft:     /^\s\s*/,
    reTrimRight:    /\s\s*$/
  });

  // Based on work by Yaffle and Dr. J.R.Stockton.
  // Uses the `Exponentiation by squaring` algorithm.
  // http://www.merlyn.demon.co.uk/js-misc0.htm#MLS
  fuse._.repeater = function(string, count) {
    var half, p = fuse._;
    if (count < 1) return '';
    if (count % 2) return p.repeater(string, count - 1) + string;
    half = p.repeater(string, count / 2);
    return half + half;
  };

  fuse._.toUpperCase = function(match, character) {
    return character ? character.toUpperCase() : '';
  };

  /*--------------------------------------------------------------------------*/

  (function(plugin) {

    /**
     * Returns a new string with the first letter upper cased and all others
     * are lower cased.
     * 
     * @methodOf fuse.String#
     * @name capitalize
     * 
     * @returns {fuse.String}
     */
    function capitalize() {
      var string = String(this);
      return capitalize[ORIGIN].String(string.charAt(0).toUpperCase() +
        string.slice(1).toLowerCase());
    }

    /**
     * Returns a clone of this string.
     * 
     * @methodOf fuse.String#
     * @name clone
     * 
     * @returns {fuse.String}
     */    
    function clone() {
      return clone[ORIGIN].String(this);
    }

    /**
     * Determines if the string has an occurrence of the specified pattern.
     * 
     * @methodOf fuse.String#
     * @name contains
     * 
     * @param {String} pattern The pattern to search for in the string.
     * 
     * @returns {Boolean}
     */    
    function contains(pattern) {
      return String(this).indexOf(pattern) > -1;
    }

    /**
     * Determines if the string is blank. A string is blank when the length is 0 
     * or contains only whitespace.
     * 
     * @methodOf fuse.String#
     * @name isBlank
     * 
     * @returns {Boolean}
     */    
    function isBlank() {
      return String(this) == false;
    }

    /**
     * Determines if the string is empty. A string is empty only when the length
     * is 0.
     * 
     * @methodOf fuse.String#
     * @name isEmpty
     * 
     * @returns {fuse.String}
     */    
    function isEmpty() {
      return !String(this).length;
    }

    /**
     * Determines if the string ends with the specified pattern.
     * 
     * @methodOf fuse.String#
     * @name endsWith
     * 
     * @param {String} pattern The pattern to search for in the string.
     * 
     * @returns {Boolean}
     */    
    function endsWith(pattern) {
      // when searching for a pattern at the end of a long string
      // indexOf(pattern, fromIndex) is faster than lastIndexOf(pattern)
      var string = String(this), d = string.length - pattern.length;
      return d >= 0 && string.indexOf(pattern, d) == d;
    }

    /**
     * Returns a new string with all underscore characters replaced with a 
     * hyphen (-).
     * 
     * @methodOf fuse.String#
     * @name hyphenate
     * 
     * @returns {fuse.String}
     */    
    function hyphenate() {
      var p = fuse._;
      return hyphenate[ORIGIN].String(p.rawReplace.call(this, p.reUnderscores, '-'));
    }

    /**
     * Returns a new string with this string repeated n times specified by the
     * count.
     * 
     * @methodOf fuse.String#
     * @name repeat
     * 
     * @param {Number} count How many times to repeate the string.
     * 
     * @returns {fuse.String}
     */    
    function repeat(count) {
      var p = fuse._;
      return repeat[ORIGIN].String(p.repeater(String(this), p.toInteger(count)));
    }

    /**
     * Determines if the string begins with the specified pattern.
     * 
     * @methodOf fuse.String#
     * @name startsWith
     * 
     * @param {String} pattern The pattern to search for in the string.
     * 
     * @returns {Boolean}
     */    
    function startsWith(pattern) {
      // when searching for a pattern at the start of a long string
      // lastIndexOf(pattern, fromIndex) is faster than indexOf(pattern)
      return !String(this).lastIndexOf(pattern, 0);
    }

    /**
     * Returns an array representation of characters in the string.
     * 
     * @methodOf fuse.String#
     * @name toArray
     * 
     * @returns {fuse.Array}
     */    
    function toArray() {
      return toArray[ORIGIN].String.prototype.split.call(this, '');
    }

    /**
     * Returns a new string where all hyphens (-) are removed in the string and
     * the following character after each hyphen is upper cased. An example
     * would be 'java-script' to 'javaScript'.
     * 
     * @methodOf fuse.String#
     * @name toCamelCase
     * 
     * @returns {fuse.String}
     */    
    function toCamelCase() {
      var p = fuse._;
      return toCamelCase[ORIGIN].String(p.strReplace.call(this, p.reHyphenated, p.toUpperCase));
    }

    /**
     * Returns a new string truncated to the specified length with an appended
     * truncation suffix.
     * 
     * @methodOf fuse.String#
     * @name truncate
     * 
     * @param {Number} length The length to truncate the string.
     * @param {String} [truncation = '...'] The truncation suffix to include
     *   in the truncated string.
     * 
     * @returns {fuse.String}
     */    
    function truncate(length, truncation) {
      var endIndex, string = String(this);
      length = +length;

      if (isNaN(length)) {
        length = 30;
      }
      if (length < string.length) {
        truncation = truncation == null ? '...' : String(truncation);
        endIndex = length - truncation.length;
        string = endIndex > 0 ? string.slice(0, endIndex) + truncation : truncation;
      }
      return truncate[ORIGIN].String(string);
    }

    /**
     * Returns a new string where upper case characters are converted to lower
     * case and an underscore is inserted before each upper case character.
     * Hyphens (-) will also be converted to underscores.
     * 
     * @methodOf fuse.String#
     * @name underscore
     * 
     * @returns {fuse.String}
     */    
    function underscore() {
      var p = fuse._;
      return underscore[ORIGIN].String(p.rawReplace
        .call(this, p.reDoubleColons, '/')
        .replace(p.reCapped, '$1_$2')
        .replace(p.reCamelCases, '$1_$2')
        .replace(p.reHyphens, '_').toLowerCase());
    }

    /*------------------------------------------------------------------------*/

    /* create ES5 method equivalents */

    /**
     * Returns a new string where whitespace is removed from both ends of the
     * string.
     * 
     * @methodOf fuse.String#
     * @name trim
     * 
     * @returns {fuse.String}
     * 
     * @see ES5 15.5.4.20
     */ 
    function trim() {
      var p = fuse._, replace = trim[ORIGIN].String.prototype.replace;
      return (replace.raw || replace).call(this, p.reTrimLeft, '').replace(p.reTrimRight, '');
    }

    /**
     * Returns a new string where whitespace is removed from the left end of 
     * the string.
     * 
     * @methodOf fuse.String#
     * @name trimLeft
     * 
     * @returns {fuse.String}
     */    
    function trimLeft() {
      var replace = trim[ORIGIN].String.prototype.replace;
      return (replace.raw || replace).call(this, fuse._.reTrimLeft, '');
    }

    /**
     * Returns a new string where whitespace is removed from the right end of 
     * the string.
     * 
     * @methodOf fuse.String#
     * @name trimRight
     * 
     * @returns {fuse.String}
     */    
    function trimRight() {
      var replace = trim[ORIGIN].String.prototype.replace;
      return (replace.raw || replace).call(this, fuse._.reTrimRight, '');
    }

    /*------------------------------------------------------------------------*/

    plugin.contains = contains;
    plugin.endsWith = endsWith;
    plugin.isBlank = isBlank;
    plugin.isEmpty = isEmpty;
    plugin.startsWith = startsWith;

    (plugin.capitalize = capitalize)[ORIGIN] =
    (plugin.clone = clone)[ORIGIN] =
    (plugin.hyphenate = hyphenate)[ORIGIN] =
    (plugin.repeat = repeat)[ORIGIN] =
    (plugin.toArray = toArray)[ORIGIN] =
    (plugin.toCamelCase = toCamelCase)[ORIGIN] =
    (plugin.trim = trim)[ORIGIN] =
    (plugin.trimLeft = trimLeft)[ORIGIN] =
    (plugin.trimRight = trimRight)[ORIGIN] =
    (plugin.truncate = truncate)[ORIGIN] =
    (plugin.underscore = underscore)[ORIGIN] = fuse;

    if (!fuse.Object.isFunction(plugin.trim)) {
      plugin.trim =
      trim.raw = trim;
      trim[ORIGIN] = fuse;
    }
    if (!fuse.Object.isFunction(plugin.trimLeft)) {
      plugin.trimLeft =
      trimLeft.raw = trimLeft;
      trimLeft[ORIGIN] = fuse;
    }
    if (!fuse.Object.isFunction(plugin.trimRight)) {
      plugin.trimRight =
      trimRight.raw = trimRight;
      trimRight[ORIGIN] = fuse;
    }
  })(fuse.String.plugin);
