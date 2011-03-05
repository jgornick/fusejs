  /*------------------------------ LANG: REGEXP ------------------------------*/

  /**
   * Represents a wrapper for the native RegExp class.
   * 
   * @class
   * @name fuse.RegExp
   */

  (function(RegExp) {

    /**
     * Returns a string with escaped characters.
     * 
     * @methodOf fuse.RegExp
     * @static
     * @name escape
     * 
     * @param {String} string The string to escape.
     * 
     * @returns {fuse.String}
     */
    function escape(string) {
      return escape[ORIGIN].String(fuse._.escapeRegExpChars(string));
    }

    /**
     * Returns a clone of this RegExp instance with flags persisted.
     * 
     * @methodOf fuse.RegExp#
     * @name clone
     * 
     * @param {Object} [options] Options to override flags in the clone.
     *   @param {Boolean} [options.global] Persist the global flag.
     *   @param {Boolean} [options.ignoreCase] Persist the ignore case flag.
     *   @param {Boolean} [options.multiline] Persist the multi line flag.
     * 
     */
    function clone(options) {
      options = fuse.Object.extend({
        global:     this.global,
        ignoreCase: this.ignoreCase,
        multiline:  this.multiline
      }, options);

      return clone[ORIGIN].RegExp(this.source,
        (options.global     ? 'g' : '') +
        (options.ignoreCase ? 'i' : '') +
        (options.multiline  ? 'm' : ''));
    }

    (RegExp.escape = escape)[ORIGIN] =
    (RegExp.plugin.clone = clone)[ORIGIN] = fuse;

  })(fuse.RegExp);
