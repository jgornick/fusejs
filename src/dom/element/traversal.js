  /*--------------------------- ELEMENT: TRAVERSAL ---------------------------*/

  (function(plugin, Selector) {

    // support W3C ElementTraversal interface
    var firstNode = 'firstChild',
     lastNode     = 'lastChild',
     nextNode     = 'nextSibling',
     prevNode     = 'previousSibling',
     firstElement = 'firstElementChild',
     lastElement  = 'lastElementChild',
     nextElement  = 'nextElementSibling',
     prevElement  = 'previousElementSibling';

    if (isHostObject(Fuse._docEl, nextElement) &&
        isHostObject(Fuse._docEl, prevElement)) {
      firstNode = firstElement;
      lastNode  = lastElement;
      nextNode  = nextElement;
      prevNode  = prevElement;
    }

    (function() {
      plugin.getChildren = function getChildren(selectors) {
        var getNextSiblings, element = this.raw || this;
        if (!element[firstNode]) return NodeList();

        while (element && element.nodeType !== ELEMENT_NODE)
          element = element[nextNode];
        if (!element) return NodeList();

        getNextSiblings = this.getNextSiblings;
        return !selectors || !selectors.length ||
            selectors && Selector.match(this, selectors)
          ? prependList(getNextSiblings.call(element, selectors), this, NodeList())
          : getNextSiblings.call(element, selectors);
      };

      plugin.match = function match(selectors) {
        return isString(selectors)
          ? Selector.match(this, selectors)
          : selectors.match(this);
      };

      plugin.query = function query(selectors) {
        return Selector.select(selectors, this);
      };

      plugin.getSiblings = function getSiblings(selectors) {
        var match, element = this.raw || this, i = 0,
         original = element, results = NodeList();

        if (element = element.parentNode && element.parentNode[firstNode])
          return results;
          
        if (selectors && selectors.length) {
          match = Selector.match;
          do {
            if (element.nodeType === ELEMENT_NODE &&
                element !== original && match(element, selectors))
              results[i++] = fromElement(element);
          } while (element = element[nextNode]);
        } else {
          do {
            if (element.nodeType === ELEMENT_NODE && element !== original)
              results[i++] = fromElement(element);
          } while (element = element[nextNode]);
        }
        return results;
      };

      // prevent JScript bug with named function expressions
      var getChildren = nil, match = nil, query = nil, getSiblings = nil;
    })();

    /*------------------------------------------------------------------------*/

    plugin.getDescendants = (function() {
      var getDescendants = function getDescendants(selectors) {
        var match, node, i = 0, results = NodeList(),
         nodes = (this.raw || this).getElementsByTagName('*');

        if (selectors && selectors.length) {
          match = Selector.match;
          while (node = nodes[i++])
            if (match(node, selectors))
              results.push(fromElement(node));
        }
        else while (node = nodes[i]) results[i++] = fromElement(node);
        return results;
      };

      if (Bug('GET_ELEMENTS_BY_TAG_NAME_RETURNS_COMMENT_NODES')) {
        getDescendants = function getDescendants(selectors) {
          var match, node, i = 0, results = NodeList(),
           nodes = (this.raw || this).getElementsByTagName('*');

          if (selectors && selectors.length) {
            match = Selector.match;
            while (node = nodes[i++])
              if (node.nodeType === ELEMENT_NODE && match(element, selectors))
                results.push(fromElement(node));
          } else {
            while (node = nodes[i++])
              if (node.nodeType === ELEMENT_NODE)
                results.push(fromElement(node));
          }
          return results;
        };
      }
      return getDescendants;
    })();

    plugin.contains = (function() {
      var contains = function contains(descendant) {
        descendant = Fuse.get(descendant);
        if (!descendant) return false;
        descendant = descendant.raw || descendant;
        var element = this.raw || this;
        while (descendant = descendant.parentNode)
          if (descendant === element) return true;
        return false;
      };
 
      if (Feature('ELEMENT_COMPARE_DOCUMENT_POSITION')) {
        contains = function contains(descendant) {
          /* DOCUMENT_POSITION_CONTAINS = 0x08 */
          descendant = Fuse.get(descendant);
          if (!descendant) return false;
          var element = this.raw || this;
          return ((descendant.raw || descendant)
            .compareDocumentPosition(element) & 8) === 8;
        };
      }
      else if (Feature('ELEMENT_CONTAINS')) {
        var __contains = contains;
 
        contains = function contains(descendant) {
          descendant = Fuse.get(descendant);
          if (!descendant) return false;
          var element, descendantElem = descendant.raw || descendant;
          if (descendantElem.nodeType !== ELEMENT_NODE)
            return __contains.call(this, descendant);
          element = this.raw || this;
          return element !== descendantElem && element.contains(descendantElem);
        };
      }
      return contains;
    })();

    plugin.down = (function() {
      function get(nodes, count) {
        var i = 0, x = 0, results = NodeList();
        if (count < 2)
          while (node = nodes[i++])
            return fromElement(node);
        else
          while (node = nodes[i++])
            if (x < count)
              results[x++] = fromElement(node);
        return count < 2 ? null : results;
      }

      function getBySelector(nodes, selectors, count) {
        var i = 0, x = 0, results = NodeList(), match = Selector.match;
        if (count < 2)
          while (node = nodes[i++])
            if (match(node, selectors)) 
              return fromElement(node);
        else
          while (node = nodes[i++])
            if (x < count && match(node, selectors))
              results[x++] = fromElement(node);
        return count < 2 ? null : results;
      }
      
      function getByCallback(nodes, callback, thisArg) {
        var i = 0;
        while (node = nodes[i++]) {
          var element = fromElement(node);
          if (callback.call(thisArg, element)) 
            return element;
        }
        return null;
      }      

      if (Bug('GET_ELEMENTS_BY_TAG_NAME_RETURNS_COMMENT_NODES')) {
        get = function(nodes, count) {
          var i = 0, x = 0, results = NodeList();
          if (count < 2)
            while (node = nodes[i++])
              if (node.nodeType === ELEMENT_NODE)
                return fromElement(node);
          else
            while (node = nodes[i++])
              if (x < count && node.nodeType === ELEMENT_NODE)
                results[x++] = fromElement(node);
          return count < 2 ? null : results;
        };

        getBySelector = function(nodes, selectors, count) {
          var i = 0, x = 0, results = NodeList(), match = Selector.match;
          if (count < 2)
            while (node = nodes[i++])
              if (node.nodeType === ELEMENT_NODE && match(node, selectors))
                return fromElement(node);
          else
            while (node = nodes[i++])
              if (x < count && node.nodeType === ELEMENT_NODE && match(node, selectors))
                results[x++] = fromElement(node);
          return count < 2 ? null : results;          
        };
        
        getByCallback = function getByCallback(nodes, callback, thisArg) {
          var i = 0;
          while (node = nodes[i++]) {
            var element = fromElement(node);
            if (node.nodeType === ELEMENT_NODE && callback.call(thisArg, element)) 
              return element;
          }
          return null;
        }          
      }

      function down(selectors, count) {
        if (selectors == null)
          return this.first();

        if (isNumber(selectors)) {
          count = selectors < 1 ? 1 : selectors;
          selectors = null;
        } else if (isNumber(count)) {
          count = count < 1 ? 1 : count;
        } else if (typeof selectors !== 'function') {
          count = 1;
        }
        
        var nodes = (this.raw || this).getElementsByTagName('*');

        if (selectors == null)
          return get(nodes, count);
        else if (typeof selectors === 'function') {
          var callback = selectors, thisArg = count;
          return getByCallback(nodes, callback, thisArg);
        } else if (selectors && selectors.length)
          return getBySelector(nodes, selectors, count);
      }
      return down;
    })();

    /*------------------------------------------------------------------------*/

    (function() {
      function get(decorator, property, selectors, count) {
        var i = 0, match, results, element = decorator.raw || decorator;

        if (isNumber(selectors)) {
          count = selectors < 1 ? 1 : selectors; 
          selectors = null;
        } else if (isNumber(count)) {
          count = count < 1 ? 1 : count;
        } else if (typeof selectors !== 'function') {
          count = 1;          
        }
        
        results = count > 1 ? NodeList() : null;

        if (!(element = element[property])) return results;
        
        // Handle no arguments
        if (selectors == null && count < 2) {
          do {
            if (element.nodeType === 1)
              return fromElement(element);
          } while (element = element[property]);          
        } else if (typeof selectors === 'function') {
          // Handle when a callback and optional thisArg is passed in
          do {
            var el = fromElement(element), callback = selectors, thisArg = count;
            if (element.nodeType === 1 && callback.call(thisArg, el))
              return el;
          } while (element = element[property]);
        } else if (selectors && selectors.length) {
          // Handle when selectors has been specified
          match = Selector.match;
          // Handle when we only need to return the first element
          if (count < 2) {
            do {
              if (element.nodeType === ELEMENT_NODE && match(element, selectors))
                return fromElement(element);
            } while (element = element[property]);            
          } else {
            // Handle when we need to return a specified amount of elements
            do {
              if (i < count && element.nodeType === ELEMENT_NODE && match(element, selectors))
                results[i++] = fromElement(element);
            } while (element = element[property]);            
          }
        } else {
          // Handle when count is greater than 1
          do {
            if (i < count && element.nodeType === 1)
              results[i++] = fromElement(element);             
          } while (element = element[property]);            
        }
        return results;
      }      

      plugin.next = function next(selectors, count) {
        return get(this, nextNode, selectors, count);
      };

      plugin.previous = function previous(selectors, count) {
        return get(this, prevNode, selectors, count);
      };

      plugin.up = function up(selectors, count) {
        return get(this, 'parentNode', selectors, count);
      };

      plugin.first = function first(selectors, count) {
        return get(fromElement((this.raw || this)[firstNode]), nextNode, selectors, count);
      };
      
      plugin.last = function last(selectors, count) {
        return get(fromElement((this.raw || this)[lastNode]), prevNode, selectors, count);
      };

      // prevent JScript bug with named function expressions
      var next = nil, previous = nil, up = nil, first = nil, last = nil;
    })();

    /*------------------------------------------------------------------------*/

    (function() {
      function get(decorator, property, selectors) {
        var match, element = decorator.raw || decorator,
         i = 0, results = NodeList();

        if (!(element = element[property])) return results;
        
        if (selectors && selectors.length) {
          match = Selector.match;
          do {
            if (element.nodeType === ELEMENT_NODE && match(element, selectors))
              results[i++] = fromElement(element);
          } while (element = element[property]);
        } else {
          do {
            if (element.nodeType === ELEMENT_NODE)
              results[i++] = fromElement(element);
          } while (element = element[property]);
        }
        return results;
      }

      plugin.getAncestors = function getAncestors(selectors) {
        return get(this, 'parentNode', selectors);
      };

      plugin.getNextSiblings = function getNextSiblings(selectors) {
        return get(this, nextNode, selectors);
      };

      plugin.getPreviousSiblings = function getPreviousSiblings(selectors) {
        return get(this, prevNode, selectors);
      };

      // prevent JScript bug with named function expressions
      var getAncestors = nil, getNextSiblings = nil, getPreviousSiblings = nil;
    })();

  })(Element.plugin, Fuse.Dom.Selector);
