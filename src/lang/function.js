  /*----------------------------- LANG: FUNCTIONS ----------------------------*/

  /**
   * Represents a wrapper for the native Function object.
   * 
   * @class
   * @name fuse.Function
   */

  (function(Function) {

    var concatList = fuse._.concatList, isArray = fuse.Object.isArray,
     prependList = fuse._.prependList, slice = [].slice;

    /**
     * Returns a new function that, when called, calls this function in 
     * the context of the provided this value, with a given sequence of 
     * arguments preceding any provided when the new function was called.
     * 
     * @methodOf fuse.Function#
     * @static
     * @name bind
     * 
     * @param {Function|Array} fn The function to call with an updated this 
     *   argument. This can also be specified as an array to allow lazy loading
     *   of the target method. The array first element is the name of the
     *   function to call and second element is the context.
     * @param {Object} thisArg The value to be passed as the this parameter to 
     *   the target function when the bound function is called. The value is 
     *   ignored if the bound function is constructed using the new operator.
     * @param {Object} [argument[, ...]] The arguments to prepend when wrapped
     *   function is called.
     * 
     * @returns {Function}
     * 
     * @throws {TypeError} If fn isn't a function or callable, TypeError is 
     *   thrown.
     */
    // ES5 15.3.4.5
    var bind = function bind(fn, thisArg) {
      // allows lazy loading the target method
      var f, context, curried, name, reset;
      if (isArray(fn)) {
        name = fn[0]; context = fn[1];
      } else {
        f = fn;
      }
      // follow spec and throw if fn is not callable
      if (typeof (f || context[name]) != 'function') {
        throw new TypeError;
      }
      // bind with curry
      if (arguments.length > 2) {
        curried = slice.call(arguments, 2);
        reset = curried.length;

        return function() {
          curried.length = reset; // reset arg length
          return (f || context[name]).apply(thisArg, arguments.length
            ? concatList(curried, arguments)
            : curried);
        };
      }
      // simple bind
      return function() {
        var fn = f || context[name];
        return arguments.length
          ? fn.apply(thisArg, arguments)
          : fn.call(thisArg);
      };
    };

    /** @deprecated **/
    function bindAsEventListener(fn, thisArg) {
      // allows lazy loading the target method
      var f, context, curried, name;
      if (isArray(fn)) {
        name = fn[0]; context = fn[1];
      } else {
        f = fn;
      }
      // bind with curry
      if (arguments.length > 2) {
        curried = slice.call(arguments, 2);
        return function(event) {
          return (f || context[name]).apply(thisArg,
            prependList(curried, event || fuse.dom.getWindow(this).event));
        };
      }
      // simple bind
      return function(event) {
        return (f || context[name]).call(thisArg, event || fuse.dom.getWindow(this).event);
      };
    }

    /**
     * Returns a new function that, when called, calls this function with a 
     * given sequence of arguments preceding any provided when the new function 
     * was called.
     * 
     * @methodOf fuse.Function#
     * @static
     * @name curry
     * 
     * @param {Function|Array} fn The function to curry arguments to. This can 
     *   also be specified as an array to allow lazy loading of the target 
     *   method. The array first element is the name of the function to call and 
     *   second element is the context.
     * @param {Object} [argument[, ...]] The arguments to prepend when wrapped
     *   function is called.
     * 
     * @returns {Function}
     */
    function curry(fn) {
      // allows lazy loading the target method
      var f, context, curried, name, reset;
      if (isArray(fn)) {
        name = fn[0]; context = fn[1];
      } else {
        f = fn;
      }

      if (arguments.length > 1) {
        curried = slice.call(arguments, 1);
        reset   = curried.length;

        return function() {
          curried.length = reset; // reset arg length
          var fn = f || context[name];
          return fn.apply(this, arguments.length
            ? concatList(curried, arguments)
            : curried);
        };
      }

      return f || context[name];
    }

    /**
     * Calls a function after the specified amount of time.
     * 
     * @methodOf fuse.Function#
     * @static
     * @name delay
     * 
     * @param {Function|Array} fn The function to delay execution on. This can 
     *   also be specified as an array to allow lazy loading of the target 
     *   method. The array first element is the name of the function to call and 
     *   second element is the context.
     * @param {Number} timeout The amount of time, specified in seconds to delay
     *   execution.
     * 
     * @returns {Number} The timeout ID returned from setTimeout.
     */
    function delay(fn, timeout) {
      // allows lazy loading the target method
      var f, context, name, args = slice.call(arguments, 2);
      if (isArray(fn)) {
        name = fn[0]; context = fn[1];
      } else {
        f = fn;
      }

      return setTimeout(function() {
        var fn = f || context[name];
        return fn.apply(fn, args);
      }, timeout * 1000);
    }

    /**
     * Calls a function as soon as the interpreter's call stack is empty.
     * 
     * @methodOf fuse.Function#
     * @static
     * @name defer
     * 
     * @param {Function|Array} fn The function to defer execution on. This can 
     *   also be specified as an array to allow lazy loading of the target 
     *   method. The array first element is the name of the function to call and 
     *   second element is the context.
     * 
     * @returns {Number} The timeout ID returned from setTimeout.
     */ 
    function defer(fn) {
      return Function.delay.apply(window,
        concatList([fn, 0.01], slice.call(arguments, 1)));
    }

    /**
     * Returns a new function that, when called, prepends the current context
     * as the first argument of the original function.
     * 
     * @methodOf fuse.Function#
     * @static
     * @name methodize
     * 
     * @param {Function|Array} fn The function to methodize. This can 
     *   also be specified as an array to allow lazy loading of the target 
     *   method. The array first element is the name of the function to call and 
     *   second element is the context.
     * 
     * @returns {Function}
     */     
    function methodize(fn) {
      // allows lazy loading the target method
      var f, context, name;
      if (isArray(fn)) {
        name = fn[0]; context = fn[1]; fn = context[name];
      } else {
        f = fn;
      }

      return fn._methodized || (fn._methodized = function() {
        var fn = f || context[name];
        return arguments.length
          ? fn.apply(window, prependList(arguments, this))
          : fn.call(window, this);
      });
    }
    
    /**
     * Returns a new function that, when called, calls the specified wrapper
     * with the original function passed in as the first argument.
     * 
     * @methodOf fuse.Function#
     * @static
     * @name wrap
     * 
     * @param {Function|Array} fn The function to wrap. This can also be 
     *   specified as an array to allow lazy loading of the target method. The 
     *   array first element is the name of the function to call and second 
     *   element is the context.
     * @param {Function} wrapper The function to use as the wrapper. The first
     *   argument for the wrapper is the original function wrapped.
     *  
     * @returns {Function}
     */     
    function wrap(fn, wrapper) {
      // allows lazy loading the target method
      var f, context, name;
      if (isArray(fn)) {
        name = fn[0]; context = fn[1];
      } else {
        f = fn;
      }

      return function() {
        var fn = f || context[name];
        return arguments.length
          ? wrapper.apply(this, prependList(arguments, Function.bind(fn, this)))
          : wrapper.call(this, Function.bind(fn, this));
      };
    }

    // native support
    if (fuse.Object.isFunction(Function.plugin.bind)) {
      var __bind = bind;
      bind = function bind(fn, thisArg) {
        // bind with curry
        var isLazy = isArray(fn);
        if (arguments.length > 2) {
          return isLazy
            ? __bind.apply(null, args)
            : this.bind.apply(fn, slice.call(args, 1));
        }
        // simple bind
        return isLazy
          ? __bind(fn, thisArg)
          : this.bind.call(fn, thisArg);
      };
    }

    Function.bind = bind;
    Function.bindAsEventListener = bindAsEventListener;
    Function.curry = curry;
    Function.delay = delay;
    Function.defer = defer;
    Function.methodize = methodize;
    Function.wrap = wrap;

  })(fuse.Function)

  /*--------------------------------------------------------------------------*/

  (function(Function) {

    var plugin = Function.plugin;

    function bind(thisArg) {
        return arguments.length > 1
          ? Function.bind.apply(Function, prependList(arguments, this))
          : Function.bind(this, thisArg);
    }

    function bindAsEventListener(thisArg) {
      return arguments.length > 1
        ? Function.bindAdEventListener.apply(Function, prependList(arguments, this))
        : Function.bindAdEventListener(this, thisArg);
    }

    function curry() {
      return arguments.length
        ? Function.curry.apply(Function, prependList(arguments, this))
        : this;
    }

    function delay(timeout) {
      return arguments.length > 1
        ? Function.delay.apply(Function, prependList(arguments, this))
        : Function.delay(this, timeout);
    }

    function defer() {
      return arguments.length
        ? Function.defer.apply(Function, prependList(arguments, this))
        : Function.defer(this);
    }

    function methodize() {
      return Function.methodize(this);
    }

    function wrap(wrapper) {
      return Function.wrap(this, wrapper);
    }

    plugin.bindAsEventListener = bindAsEventListener;
    plugin.curry = curry;
    plugin.delay = delay;
    plugin.defer = defer;
    plugin.methodize = methodize;
    plugin.wrap = wrap;

    if (!fuse.Object.isFunction(plugin.bind)) {
      plugin.bind = bind;
    }
  })(fuse.Function);
