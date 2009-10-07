  /*--------------------------- FEATURE/BUG TESTER ---------------------------*/

  (function() {
    function createTester(name) {
      var cacheName = '_' + name.toLowerCase() + 'Cache', 
        cache = Fuse.Env[cacheName] = { };
      
      Fuse.Env['add' + name + 'Test'] = function(name, value) {
        if (typeof name === 'string')
          cache[name] = value;
        else        
          for (var i in name) cache[i] = name[i]; 
      };

      Fuse.Env['remove' + name + 'Test'] = function(name) {
        name = name.valueOf();
        if (typeof name === 'string') 
          delete cache[name];
        else
          for (var i in name) delete cache[i];
      };
      
      Fuse.Env['has' + name] = function() {
        var title, o = cache, i = 0;
        while (title = arguments[i++]) {
          if (typeof o[title] === "function") o[title] = o[title]();
          if (o[title] !== true) return false;
        }
        return true;
      };
    }

    createTester('Bug');
    createTester('Feature');
    
    // Map created methods to our private vars
    hasBug = Fuse.Env.hasBug;
    hasFeature = Fuse.Env.hasFeature;
    addBugTest = Fuse.Env.addBugTest;
    addFeatureTest = Fuse.Env.addFeatureTest;
  })();
