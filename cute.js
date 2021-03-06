/**      _                 _                ___   ____   _
 *      | |_   _ _ __ ___ (_)_ __   __   __/ _ \ | ___| / |
 *   _  | | | | | '_ ` _ \| | '_ \  \ \ / / | | ||___ \ | |
 *  | |_| | |_| | | | | | | | | | |  \ V /| |_| | ___) || |
 *   \___/ \__, |_| |_| |_|_|_| |_|   \_/  \___(_)____(_)_|
 *         |___/
 *
 * http://lighter.io/cute
 *
 * If you're seeing this in production, you really should minify.
 *
 * Source files:
 *   https://github.com/lighterio/cute/blob/master/scripts/ajax.js
 *   https://github.com/lighterio/cute/blob/master/scripts/charts.js
 *   https://github.com/lighterio/cute/blob/master/scripts/collections.js
 *   https://github.com/lighterio/cute/blob/master/scripts/cookies.js
 *   https://github.com/lighterio/cute/blob/master/scripts/crypto.js
 *   https://github.com/lighterio/cute/blob/master/scripts/dates.js
 *   https://github.com/lighterio/cute/blob/master/scripts/dom.js
 *   https://github.com/lighterio/cute/blob/master/scripts/emitter.js
 *   https://github.com/lighterio/cute/blob/master/scripts/events.js
 *   https://github.com/lighterio/cute/blob/master/scripts/forms.js
 *   https://github.com/lighterio/cute/blob/master/scripts/functions.js
 *   https://github.com/lighterio/cute/blob/master/scripts/head.js
 *   https://github.com/lighterio/cute/blob/master/scripts/history.js
 *   https://github.com/lighterio/cute/blob/master/scripts/i18n.js
 *   https://github.com/lighterio/cute/blob/master/scripts/json.js
 *   https://github.com/lighterio/cute/blob/master/scripts/logging.js
 *   https://github.com/lighterio/cute/blob/master/scripts/move.js
 *   https://github.com/lighterio/cute/blob/master/scripts/numbers.js
 *   https://github.com/lighterio/cute/blob/master/scripts/ready.js
 *   https://github.com/lighterio/cute/blob/master/scripts/regexp.js
 *   https://github.com/lighterio/cute/blob/master/scripts/storage.js
 *   https://github.com/lighterio/cute/blob/master/scripts/strings.js
 *   https://github.com/lighterio/cute/blob/master/scripts/timing.js
 *   https://github.com/lighterio/cute/blob/master/scripts/types.js
 */


var Cute = {version: '0.5.1'};

//+env:commonjs
// Support CommonJS.
if (typeof exports === 'object') {
  module.exports = Cute;
}
//-env:commonjs

//+env:amd
// Support AMD.
else if (typeof define === 'function' && define.amd) {
  define(function() {
    return Cute;
  });
}
//-env:amd

//+env:window
// Support browsers.
else {
  this.Cute = Cute;
}
//-env:window

/**
 * Empty handler.
 * @type {function}
 */
Cute.no = function () {}

/**
 * Default AJAX success handler function.
 * @type {function}
 */
Cute.ok = Cute.no

/**
 * Default AJAX failure handler function.
 * @type {function}
 */
Cute.fail = Cute.no

/**
 * Get an XMLHttpRequest object (or ActiveX object in old IE).
 *
 * @return {XMLHttpRequest}   The request object.
 */
Cute.xhr = function () {
  var xhr


  xhr = new XMLHttpRequest()

  return xhr
}

/**
 * Get an XMLHttpRequest upload object.
 *
 * @return {XMLHttpRequestUpload}   The request upload object.
 */
Cute.upload = function () {
  var xhr = Cute.xhr()
  return xhr ? xhr.upload : false
}

/**
 * Make an AJAX request, and handle it with success or failure.
 *
 * @param  {string}   url   A URL from which to request a response.
 * @param  {string}   data  An optional query, which if provided, makes the request a POST.
 * @param  {function} ok    An optional function to run upon success.
 * @param  {function} fail  An optional function to run upon failure.
 */
Cute.get = function (url, data, ok, fail) {
  // If the optional data argument is omitted, zero it.
  if (Cute.isFunction(data)) {
    fail = ok
    ok = data
    data = 0
  }
  var request = Cute.xhr()
  if (request) {
    ok = ok || Cute.ok
    fail = fail || Cute.fail
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        var status = request.status
        var isSuccess = (status === 200)
        var fn = isSuccess ? (ok || Cute.ok) : (fail || Cute.fail)
        var data = Cute.parse(request.responseText) || {}
        fn(data, request, status)
      }
    }
    request.open(data ? 'POST' : 'GET', url, true)
    if (data) {
      request.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
      if (Cute.isObject(data)) {
        data = 'json=' + Cute.escape(Cute.stringify(data))
      }
    }
    request.send(data || null)
  }
}
/**
 * Get 100 consistent colors for charting.
 * These colors are designed to maximize visual distance.
 *
 * @return {Array}   The request object.
 */
Cute.colors = function () {
  var colors = Cute.colors._cache
  if (!colors) {
    var map = {}
    var string =
      '03f290c00eb0b0f0cbe6000605090307bf0c740f7a07f' +
      '686f97a098a0748f05a200a772d6332300b1708014dc0' +
      'c89f7a0ff045faf78304ab9798eb804020fcfd5600089' +
      '9f574be6f0f7f6405'
    colors = []
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 35; j++) {
        var color = string.substr(j * 3 + i, 3)
        if (!map[color]) {
          map[color] = 1
          colors.push('#' + color)
        }
      }
    }
    Cute.colors._cache = colors
  }
  return colors
}
/**
 * Iterate over an object or array, calling a function on each value.
 * If the function returns false, stop iterating.
 *
 * - For arrays, the function arguments are: (value, index, collection).
 * - For objects, the arguments are: (key, value, collection).
 *
 * @param  {Array|Object|string}  collection  A collection of items.
 * @param  {Function}             fn          A function to call on each item.
 * @return {Number}                           Index or key that returned false.
 */
Cute.each = function (collection, fn) {
  if (collection) {
    collection = Cute.isString(collection) ? Cute.split(collection) : collection
    var length = collection.length
    var key, result
    if (Cute.isNumber(length)) {
      for (key = 0; key < length; key++) {
        result = fn(collection[key], key, collection)
        if (result === false) {
          break
        }
      }
    } else {
      for (key in collection) {
        result = fn(collection[key], key, collection)
        if (result === false) {
          break
        }
      }
    }
    return key
  }
}

/**
 * Decorate an object with properties from another object.
 */
Cute.decorate = function (object, decorations) {
  if (object) {
    Cute.each(decorations, function (value, key) {
      object[key] = value
    })
  }
  return object
}

/**
 * Return a property if it is defined, otherwise set and return a default if provided.
 */
Cute.prop = function (object, property, defaultValue) {
  var value = object[property]
  if (!Cute.isDefined(value)) {
    value = object[property] = defaultValue
  }
  return value
}


/**
 * Return the subset of an array for which a filter function returns truthy.
 *
 * @param  {Array|Object|string}  array  An array to filter.
 * @param  {Function}             fn     A filter function.
 * @return {Array}          [description]
 */
Cute.filter = function (array, fn) {
  var filtered = []
  Cute.each(array, function (item) {
    if (fn(item)) {
      filtered.push(item)
    }
  })
  return filtered
}

/**
 * Merge one or more arrays into an array.
 *
 * @param  {Array}     array  An array to merge into.
 * @params {Array...}         Items to merge into the array.
 * @return {Array}            The first array argument, with new items merged in.
 */
Cute.merge = function (array) {
  Cute.each(arguments, function (items, index) {
    if (index) {
      [].push.apply(array, items)
    }
  })
  return array
}
/**
 * Read cookies, and optionally get or set one.
 *
 * @param  {String} name     An optional cookie name to get or set. If not provided, return a map.
 * @param  {Object} value    A value to be set as a string, or null if the cookie is to be deleted.
 * @param  {Object} options  Optional cookie settings, including "ttl", "expires", "path", "domain" and "secure".
 * @return {Object}          A cookie, or a map of cookie names and values.
 */
Cute.cookie = function (name, value, options) {

  // Build a map of key-value pairs of all cookies.
  var result = {}
  var list = Cute.trim(document.cookie)
  if (list) {
    var cookies = list.split(/\s*;\s*/)
    Cute.each(cookies, function (cookie) {
      var pair = cookie.split(/\s*=\s*/)
      result[Cute.unescape(pair[0])] = Cute.unescape(pair[1])
    })
  }

  // If a cookie is named, get or set it.
  if (name) {

    // If no value is provided, return the existing value.
    if (Cute.isUndefined) {
      result = result[name]

    // If a value is provided, set the cookie to that value.
    } else {
      options = options || {}
      var pair = Cute.escape(name) + '=' + Cute.unescape(value)

      var path = options.path
      var domain = options.domain
      var secure = options.secure

      // If the value is null, expire it as of one millisecond ago.
      var ttl = (value === null) ? -1 : options.ttl
      var expires = ttl ? new Date(Date.now() + ttl) : 0

      document.cookie = pair
        + (path ? ';path=' + path : '')
        + (domain ? ';domain=' + domain : '')
        + (expires ? ';expires=' + expires.toUTCString() : '')
        + (secure ? ';secure' : '')

      result = value
    }

  }
  return result
}
/**
 * Calculate an MD5 hash for a string (useful for things like Gravatars).
 *
 * @param  {String} s  A string to hash.
 * @return {String}    The MD5 hash for the given string.
 */
Cute.md5 = function (str) {

  // Encode as UTF-8.
  str = decodeURIComponent(encodeURIComponent(str))

  // Build an array of little-endian words.
  var arr = new Array(str.length >> 2)
  for (var idx = 0, len = arr.length; idx < len; idx += 1) {
    arr[idx] = 0
  }
  for (idx = 0, len = str.length * 8; idx < len; idx += 8) {
    arr[idx >> 5] |= (str.charCodeAt(idx / 8) & 0xFF) << (idx % 32)
  }

  // Calculate the MD5 of an array of little-endian words.
  arr[len >> 5] |= 0x80 << (len % 32)
  arr[(((len + 64) >>> 9) << 4) + 14] = len

  var a = 1732584193
  var b = -271733879
  var c = -1732584194
  var d = 271733878

  len = arr.length
  idx = 0
  while (idx < len) {
    var olda = a
    var oldb = b
    var oldc = c
    var oldd = d

    var e = arr[idx++]
    var f = arr[idx++]
    var g = arr[idx++]
    var h = arr[idx++]
    var i = arr[idx++]
    var j = arr[idx++]
    var k = arr[idx++]
    var l = arr[idx++]
    var m = arr[idx++]
    var n = arr[idx++]
    var o = arr[idx++]
    var p = arr[idx++]
    var q = arr[idx++]
    var r = arr[idx++]
    var s = arr[idx++]
    var t = arr[idx++]

    a = ff(a, b, c, d, e, 7, -680876936)
    d = ff(d, a, b, c, f, 12, -389564586)
    c = ff(c, d, a, b, g, 17, 606105819)
    b = ff(b, c, d, a, h, 22, -1044525330)
    a = ff(a, b, c, d, i, 7, -176418897)
    d = ff(d, a, b, c, j, 12, 1200080426)
    c = ff(c, d, a, b, k, 17, -1473231341)
    b = ff(b, c, d, a, l, 22, -45705983)
    a = ff(a, b, c, d, m, 7, 1770035416)
    d = ff(d, a, b, c, n, 12, -1958414417)
    c = ff(c, d, a, b, o, 17, -42063)
    b = ff(b, c, d, a, p, 22, -1990404162)
    a = ff(a, b, c, d, q, 7, 1804603682)
    d = ff(d, a, b, c, r, 12, -40341101)
    c = ff(c, d, a, b, s, 17, -1502002290)
    b = ff(b, c, d, a, t, 22, 1236535329)

    a = gg(a, b, c, d, f, 5, -165796510)
    d = gg(d, a, b, c, k, 9, -1069501632)
    c = gg(c, d, a, b, p, 14, 643717713)
    b = gg(b, c, d, a, e, 20, -373897302)
    a = gg(a, b, c, d, j, 5, -701558691)
    d = gg(d, a, b, c, o, 9, 38016083)
    c = gg(c, d, a, b, t, 14, -660478335)
    b = gg(b, c, d, a, i, 20, -405537848)
    a = gg(a, b, c, d, n, 5, 568446438)
    d = gg(d, a, b, c, s, 9, -1019803690)
    c = gg(c, d, a, b, h, 14, -187363961)
    b = gg(b, c, d, a, m, 20, 1163531501)
    a = gg(a, b, c, d, r, 5, -1444681467)
    d = gg(d, a, b, c, g, 9, -51403784)
    c = gg(c, d, a, b, l, 14, 1735328473)
    b = gg(b, c, d, a, q, 20, -1926607734)

    a = hh(a, b, c, d, j, 4, -378558)
    d = hh(d, a, b, c, m, 11, -2022574463)
    c = hh(c, d, a, b, p, 16, 1839030562)
    b = hh(b, c, d, a, s, 23, -35309556)
    a = hh(a, b, c, d, f, 4, -1530992060)
    d = hh(d, a, b, c, i, 11, 1272893353)
    c = hh(c, d, a, b, l, 16, -155497632)
    b = hh(b, c, d, a, o, 23, -1094730640)
    a = hh(a, b, c, d, r, 4, 681279174)
    d = hh(d, a, b, c, e, 11, -358537222)
    c = hh(c, d, a, b, h, 16, -722521979)
    b = hh(b, c, d, a, k, 23, 76029189)
    a = hh(a, b, c, d, n, 4, -640364487)
    d = hh(d, a, b, c, q, 11, -421815835)
    c = hh(c, d, a, b, t, 16, 530742520)
    b = hh(b, c, d, a, g, 23, -995338651)

    a = ii(a, b, c, d, e, 6, -198630844)
    d = ii(d, a, b, c, l, 10, 1126891415)
    c = ii(c, d, a, b, s, 15, -1416354905)
    b = ii(b, c, d, a, j, 21, -57434055)
    a = ii(a, b, c, d, q, 6, 1700485571)
    d = ii(d, a, b, c, h, 10, -1894986606)
    c = ii(c, d, a, b, o, 15, -1051523)
    b = ii(b, c, d, a, f, 21, -2054922799)
    a = ii(a, b, c, d, m, 6, 1873313359)
    d = ii(d, a, b, c, t, 10, -30611744)
    c = ii(c, d, a, b, k, 15, -1560198380)
    b = ii(b, c, d, a, r, 21, 1309151649)
    a = ii(a, b, c, d, i, 6, -145523070)
    d = ii(d, a, b, c, p, 10, -1120210379)
    c = ii(c, d, a, b, g, 15, 718787259)
    b = ii(b, c, d, a, n, 21, -343485551)

    a = add(a, olda)
    b = add(b, oldb)
    c = add(c, oldc)
    d = add(d, oldd)
  }
  arr = [a, b, c, d]

  // Build a string.
  var hex = '0123456789abcdef'
  str = ''
  for (idx = 0, len = arr.length * 32; idx < len; idx += 8) {
    var code = (arr[idx >> 5] >>> (idx % 32)) & 0xFF
    str += hex.charAt((code >>> 4) & 0x0F) + hex.charAt(code & 0x0F)
  }

  return str

  /**
   * Add 32-bit integers, using 16-bit operations to mitigate JS interpreter bugs.
   */
  function add (a, b) {
    var lsw = (a & 0xFFFF) + (b & 0xFFFF)
    var msw = (a >> 16) + (b >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xFFFF)
  }

  function cmn (q, a, b, x, s, t) {
    a = add(add(a, q), add(x, t))
    return add((a << s) | (a >>> (32 - s)), b)
  }

  function ff (a, b, c, d, x, s, t) {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t)
  }

  function gg (a, b, c, d, x, s, t) {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t)
  }

  function hh (a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t)
  }

  function ii (a, b, c, d, x, s, t) {
    return cmn(c ^ (b | (~d)), a, b, x, s, t)
  }

}
/**
 * Get Unix epoch milliseconds from a date.
 *
 * @param {Date}    date  An optional Date object (default: now).
 * @return {Number}       Epoch milliseconds.
 */
Cute.getTime = function (date) {
  return date ? date.getTime() : Date.now()
}

/**
 * Get an ISO-standard date string.
 *
 * @param {Date}    date  Date object (default: now).
 * @return {String}       ISO date string.
 */
Cute.getIsoDate = function (date) {
  date = date || new Date()

  date = date.toISOString()


  return date
}

/**
 * Take a date and return a formatted date string in long or short format:
 * - Short: "8/26/14 7:42pm"
 * - Long: "August 26, 2014 at 7:42pm"
 *
 * @param  {Object}  date    An optional Date object or constructor argument.
 * @param  {Boolean} isLong  Whether to output the short or long format.
 * @param  {Boolean} isTime  Whether to append the time.
 * @return {String}          The formatted date string.
 */
Cute.formatDate = function (date, isLong, isTime) {
  if (!Cute.isDate(date)) {
    date = new Date(+date || date)
  }
  var m = date.getMonth()
  var day = date.getDate()
  var y = date.getFullYear()
  if (isLong) {
    m = Cute.i18nMonths[m]
  } else {
    m++
    y = ('' + y).substr(2)
  }
  var isAm = 1
  var hour = +date.getHours()
  var minute = date.getMinutes()
  minute = minute > 9 ? minute : '0' + minute
  if (!Cute.i18n24Hour) {
    if (hour > 12) {
      isAm = 0
      hour -= 12
    } else if (!hour) {
      hour = 12
    }
  }
  var string
  if (Cute.i18nDayMonthYear) {
    string = m
    m = day
    day = string
  }
  if (isLong) {
    string = m + ' ' + day + ', ' + y
  } else {
    string = m + '/' + day + '/' + y
  }
  if (isTime) {
    if (isLong) {
      string += ' ' + Cute.i18nAt
    }
    string += ' ' + hour + ':' + minute
    if (Cute.i18n24Hour) {
      string += (isAm ? 'am' : 'pm')
    }
  }
  return string
}

/**
 * Taka a date object and return a formatted time string.
 *
 * @param  {Object}  date    An optional Date object or constructor argument.
 * @return {[type]}
 */
Cute.formatTime = function (date) {
  date = Cute.formatDate(date).replace(/^.* /, '')
}
/**
 * Get an element by its ID (if the argument is an ID).
 * If you pass in an element, it just returns it.
 * This can be used to ensure that you have an element.
 *
 * @param  {HTMLElement}        parent  Optional element to call getElementById on (default: document).
 * @param  {string|HTMLElement} idOrElement    ID of an element, or the element itself.
 * @return {HTMLElement}                       The matching element, or undefined.
 */
Cute.byId = function (parent, idOrElement) {
  if (!idOrElement) {
    idOrElement = parent
    parent = document
  }
  return Cute.isString(idOrElement) ? parent.getElementById(idOrElement) : idOrElement
}

/**
 * Get or set the parent of an element.
 *
 * @param  {HTMLElement} element    A element whose parent we want to get/set.
 * @param  {String}      parent     An optional parent to add the element to.
 * @param  {String}      before     An optional child to insert the element before.
 * @return {HTMLElement}            The parent of the element.
 */
Cute.parent = function (element, parent, before) {
  if (parent) {
    parent.insertBefore(element, before || null)
  } else {
    parent = element.parentNode
  }
  return parent
}

/**
 * Get an element's ancestors, optionally filtered by a selector.
 *
 * @param  {HTMLElement} element   An element to start from.
 * @param  {String}      selector  An optional selector to filter ancestors.
 * @return {Array}                 The array of ancestors.
 */
Cute.up = function (element, selector) {
  var ancestors = []
  while (element = Cute.parent(element)) { // jshint ignore:line
    ancestors.push(element)
  }
  ancestors = Cute.filter(ancestors, function (element) {
    return Cute.matches(element, selector)
  })
  return ancestors
}

/**
 * Get the children of a parent element.
 *
 * @param  {HTMLElement}    element  A parent element who might have children.
 * @return {HTMLCollection}          The collection of children.
 */
Cute.children = function (element) {
  return element.childNodes
}

/**
 * Get an element's index with respect to its parent.
 *
 * @param  {HTMLElement} element  An element with a parent, and potentially siblings.
 * @return {Number}               The element's index, or -1 if there's no matching element.
 */
Cute.index = function (element) {
  var index = -1
  while (element) {
    ++index
    element = element.previousSibling
  }
  return index
}

/**
 * Create an element, given a specified tag identifier.
 *
 * Identifiers are of the form:
 *   tagName#id.class1.class2?attr1=value1&attr2=value2
 *
 * Each part of the identifier is optional.
 *
 * @param  {HTMLElement|String} elementOrString  An element or a string used to create an element (default: div).
 * @param  {String}             innerHtml        An optional string of HTML to populate the element.
 * @return {HTMLElement}                         The existing or created element.
 */
Cute.create = function (elementOrString, innerHtml) {
  var element = elementOrString
  if (Cute.isString(elementOrString)) {
    var tagAndAttributes = elementOrString.split('?')
    var tagAndClass = tagAndAttributes[0].split('.')
    var className = tagAndClass.slice(1).join(' ')
    var tagAndId = tagAndClass[0].split('#')
    var tagName = tagAndId[0] || 'div'
    var id = tagAndId[1]
    var attributes = tagAndAttributes[1]
    var isSvg = /^(svg|g|path|circle|line)$/.test(tagName)
    var uri = 'http://www.w3.org/' + (isSvg ? '2000/svg' : '1999/xhtml')
    element = document.createElementNS(uri, tagName)
    if (id) {
      element.id = id
    }
    if (className) {
      element.className = className
    }
    // TODO: Do something less janky than using query string syntax (Maybe like Ltl?).
    if (attributes) {
      attributes = attributes.split('&')
      Cute.each(attributes, function (attribute) {
        var keyAndValue = attribute.split('=')
        var key = keyAndValue[0]
        var value = keyAndValue[1]
        element[key] = value
        Cute.attr(element, key, value)
      })
    }
    if (innerHtml) {
      Cute.html(element, innerHtml)
    }
  }
  return element
}

/**
 * Add an element to a parent element, creating it first if necessary.
 *
 * @param  {HTMLElement}        parent    An optional parent element (default: document).
 * @param  {HTMLElement|String} elementOrString  An element or a string used to create an element (default: div).
 * @param  {String}             innerHtml        An optional string of HTML to populate the element.
 * @return {HTMLElement}                         The element that was added.
 */
Cute.add = function (parent, elementOrString, innerHtml) {
  if (Cute.isString(parent)) {
    elementOrString = parent
    parent = document.body
  }
  var element = Cute.create(elementOrString, innerHtml)
  parent.appendChild(element)
  return element
}

/**
 * Insert a child element under a parent element, optionally before another element.
 *
 * @param  {HTMLElement}         parent    An optional parent element (default: document).
 * @param  {HTMLElement|String}  elementOrString  An element or a string used to create an element (default: div).
 * @param  {HTMLElement}         beforeSibling    An optional child to insert the element before.
 * @return {HTMLElement}                          The element that was inserted.
 */
Cute.insert = function (parent, elementOrString, beforeSibling) {
  if (Cute.isString(parent)) {
    beforeSibling = elementOrString
    elementOrString = parent
    parent = document.body
  }
  var element = Cute.create(elementOrString)
  if (parent) {
    // If the beforeSibling value is a number, get the (future) sibling at that index.
    if (Cute.isNumber(beforeSibling)) {
      beforeSibling = Cute.children(parent)[beforeSibling]
    }
    // Insert the element, optionally before an existing sibling.
    parent.insertBefore(element, beforeSibling || parent.firstChild || null)
  }
  return element
}

/**
 * Remove an element from its parent.
 *
 * @param  {HTMLElement} element  An element to remove.
 */
Cute.remove = function (element) {
  if (element) {
    // Remove the element from its parent, provided that it has a parent.
    var parent = Cute.parent(element)
    if (parent) {
      parent.removeChild(element)
    }
  }
}

/**
 * Get or set an element's inner HTML.
 *
 * @param  {HTMLElement} element  An element.
 * @param  {String}      html     An optional string of HTML to set as the innerHTML.
 * @return {String}               The element's HTML.
 */
Cute.html = function (element, html) {
  if (!Cute.isUndefined(html)) {
    element.innerHTML = html
  }
  return element.innerHTML
}

/**
 * Get an element's lowercase tag name.
 *
 * @param  {HTMLElement} element  An element.
 * @return {String}               The element's tag name.
 */
Cute.tag = function (element) {
  return Cute.lower(element.tagName)
}

/**
 * Get or set the text of an element.
 *
 * @param  {HTMLElement} element  An element.
 * @return {String}      text     A text string to set.
 */
Cute.text = function (element, text) {
  if (!Cute.isUndefined(text)) {
    Cute.html(element, '')
    Cute.addText(element, text)
  }
  return element.textContent || element.innerText
}

/**
 * Add text to an element.
 *
 * @param  {HTMLElement} element  An element.
 * @return {String}      text     A text string to add.
 */
Cute.addText = function (element, text) {
  Cute.add(element, document.createTextNode(text))
}

/**
 * Get, set, or delete an attribute of an element.
 *
 * @param  {HTMLElement} element  An element.
 * @param  {String}      name     An attribute name.
 * @param  {String}      value    A value to set the attribute to.
 * @return {String}               The value of the attribute.
 */
Cute.attr = function (element, name, value) {
  if (value === null) {
    element.removeAttribute(name)
  } else if (Cute.isUndefined(value)) {
    value = element.getAttribute(name)
  } else {
    var old = Cute.attr(element, name)
    if (value !== old) {
      element.setAttribute(name, value)
    }
  }
  return value
}

/**
 * Get, set, or delete a data attribute of an element.
 *
 * @param  {HTMLElement} element  An element.
 * @param  {String}      key      A data attribute key.
 * @param  {String}      value    A value to set the data attribute to.
 * @return {String}               The value of the attribute.
 */
Cute.data = function (element, key, value) {
  return Cute.attr(element, 'data-' + key, value)
}

/**
 * Add, remove or check classes on an element.
 *
 * @param  {HTMLElement} element     An element to change or read classes from.
 * @param  {String}      operations  Operations to perform on classes.
 * @return {Object}                  The map of classes, or truthy if the last queried class was found.
 */
Cute.classes = function (element, operations) {
  var map = {}
  var result = map
  var list = '' + element.className
  list.replace(/\S+/g, function (key) {
    map[key] = true
  })
  if (operations) {
    operations.replace(/(!\+-\?)?(\S+)/, function (match, op, key) {
      var value = map[key]
      if (op === '!') {
        value = !value
      } else if (op === '+') {
        value = true
      } else if (op === '-') {
        value = false
      } else if (op === '?') {
        result = value
      }
      map[key] = value
    })
    list = []
    Cute.each(map, function (value, key) {
      if (value) {
        list.push(key)
      }
    })
    element.className = list.join(' ')
  }
  return result
}

/**
 * Find elements matching a selector, and return or run a function on them.
 *
 * Selectors are not fully querySelector compatible.
 * Selectors only support commas, spaces, IDs, tags & classes.
 *
 * @param  {HTMLElement}    parent    An optional element under which to find elements.
 * @param  {String}         selector  A simple selector for finding elements.
 * @param  {Function}       fn        An optional function to run on matching elements.
 * @return {HTMLCollection}           The matching elements (if any).
 */
Cute.all = function (parent, selector, fn) {
  if (!selector || Cute.isFunction(selector)) {
    fn = selector
    selector = parent
    parent = document
  }
  if (!parent) {
    parent = document
  }
  var elements


  elements = parent.querySelectorAll(selector)

  if (fn) {
    Cute.each(elements, fn)
  }
  return elements
}

/**
 * Find an element matching a selector, optionally run a function on it, and return it.
 *
 * @param  {HTMLElement} parent  An optional element under which to find an element.
 * @param  {String}      selector       A simple selector for finding an element.
 * @param  {Function}    fn             An optional function to run on a matching element.
 * @return {HTMLElement}                The matching element (if any).
 */
Cute.one = function (parent, selector, fn) {
  if (!selector || Cute.isFunction(selector)) {
    fn = selector
    selector = parent
    parent = document
  }
  var element


  element = parent.querySelector(selector)

  if (element && fn) {
    fn(element)
  }
  return element
}

/**
 * Push new HTML into one or more selected elements.
 *
 * @param  {String} html     A string of HTML.
 * @param  {String} selector An optional selector (default: "body").
 */
Cute.pushHtml = function (html, selector) {
  var content = html
  selector = selector || 'body'

  if (selector === 'body') {
    content = (/<body\b.*?>(.*?)<\/body>/i.exec(html) || 0)[0] || html
  }

  // Set the HTML of an element.
  return Cute.all(selector, function (element) {

    Cute.startTime('virtual')
    var virtualDom = Cute.create('m', content)
    Cute.endTime('virtual')
    Cute.startTime('diff')
    Cute.diffDom(element, virtualDom)
    Cute.endTime('diff')
    Cute.isReady(element, 1)

    Cute.timer(function () {
      Cute.all(virtualDom, 'script', function (script) {
        script = Cute.html(script)
        Cute.execute(script)
      })
      Cute.all('script', Cute.remove)
    })

  })[0]
}

/**
 * Merge children from a virtual DOM.
 *
 * @param  {HTMLElement} domNode     The DOM node to merge into.
 * @param  {HTMLElement} newNode     The virtual DOM to merge from.
 */
Cute.diffDom = function (domNode, newNode, isTopLevel) {
  var domChild = domNode.firstChild || 0
  var newChild = newNode.firstChild || 0
  while (newChild) {
    var domTag = domChild.tagName
    var newTag = newChild.tagName
    var domNext = domChild.nextSibling || 0
    var newNext = newChild.nextSibling || 0
    if ((domTag !== newTag) || Cute.lower(newTag) === 'svg') {
      domNode.insertBefore(newChild, domChild || null)
      if (domChild) {
        domNode.removeChild(domChild)
      }
      domChild = domNext
    } else {
      if (newTag) {
        Cute.diffDom(domChild, newChild)
        Cute.diffAttributes(domChild, newChild)
      } else if (domChild && newChild) {
        domChild.textContent = newChild.textContent
      } else if (newChild) {
        domNode.appendChild(newChild)
      }
      domChild = domNext
    }
    newChild = newNext
  }
  while (domChild) {
    domNext = domChild.nextSibling
    domNode.removeChild(domChild)
    domChild = domNext
  }
}

/**
 * Merge attributes from a virtual DOM.
 *
 * @param  {HTMLElement} domNode  The DOM node to merge into.
 * @param  {HTMLElement} newNode  The virtual DOM to merge from.
 */
Cute.diffAttributes = function (domNode, newNode) {
  var map = {}
  Cute.each([domNode, newNode], function (element, index) {
    Cute.each(element.attributes, function (attribute) {
      if (attribute) {
        map[attribute.name] = index ? attribute.value : null
      }
    })
  })
  Cute.each(map, function (value, name) {
    Cute.attr(domNode, name, value)
  })
}
/**
 * Event Handlers
 * @type {Object}
 */
Cute.handlers = {}

/**
 * Listen for one or more events, optionally on a given element.
 *
 * @param  {String|HTMLElement} selectorOrElement  An optional selector or element.
 * @param  {String|Array}       eventTypes         A list of events to listen for.
 * @param  {Function}           listener           A function to execute when an event occurs.
 */
Cute.on = function (selectorOrElement, eventTypes, listener) {
  if (!listener) {
    listener = eventTypes
    eventTypes = selectorOrElement
    selectorOrElement = document
  }
  var element = Cute.isString(selectorOrElement) ? document : selectorOrElement
  Cute.each(eventTypes, function (eventType) {
    var handlers = Cute.handlers[eventType]
    if (!handlers) {
      handlers = Cute.handlers[eventType] = []
      if (element.addEventListener) {
        element.addEventListener(eventType, Cute.emit, false)
      } else if (element.attachEvent) {
        element.attachEvent('on' + eventType, Cute.emit)
      } else {
        element['on' + eventType] = Cute.emit
      }
    }
    handlers.push([selectorOrElement, listener])
  })
}

/**
 * Remove a listener for one event type.
 *
 * @param  {String|Array} eventType  An event to stop listening for.
 * @param  {Function}     listener   A listener function to remove.
 */
Cute.off = function (eventType, listener) {
  var handlers = Cute.handlers[eventType]
  handlers = Cute.each(handlers, function (item) {
    return item[1] !== listener
  })
  Cute.handlers[eventType] = handlers
}

/**
 * Listen for one or more events just once, optionally on a given element.
 *
 * @param  {String|HTMLElement} selectorOrElement  An optional selector or element.
 * @param  {String|Array}       eventTypes         A list of events to listen for.
 * @param  {Function}           listener           A function to execute when an event occurs.
 */
Cute.once = function (selectorOrElement, eventTypes, listener) {
  if (!listener) {
    listener = eventTypes
    eventTypes = selectorOrElement
    selectorOrElement = document
  }
  var fn = function (element, event, type) {
    listener(element, event, type)
    Cute.off(type, fn)
  }
  Cute.on(selectorOrElement, eventTypes, fn)
}

/**
 * Simulate an event, or propagate an event up the DOM.
 *
 * @param  {String|Object} event   An event or event type to propagate.
 * @param  {HTMLElement}   target  An optional target to start propagation from.
 * @param  {Object}        data    Optional data to report with the event.
 */
Cute.emit = function (event, target, data) {

  // Get the window-level event if an event isn't passed.
  event = event || window.event

  // Construct an event object if necessary.
  if (Cute.isString(event)) {
    event = {type: event}
  }

  // Reference an element if possible.
  var element = event.target = target || event.target || event.srcElement || document

  // Extract the event type.
  var type = event.type

  var handlers = Cute.handlers[type]
  while (element && !event._stopped) {
    Cute.each(handlers, function (handler) {
      var selector = handler[0]
      var fn = handler[1]
      var isMatch = Cute.isString(selector) ?
        Cute.matches(element, selector) :
        (element === selector)
      if (isMatch) {
        fn(data || element, event, type)
      }
      return !event._stopped
    })
    if (element === document) {
      break
    }
    element = Cute.parent(element)
  }
}

/**
 * Find out if an element matches a given selector.
 *
 * @param  {HTMLElement} element   An element to pretend the event occurred on.
 * @param  {String}      selector  A CSS selector to check against an element.
 * @return {boolean}               True if the element (this) matches the selector.
 */
Cute.matches = function (element, selector, type) {
  var self = this
  var matches =
    element.webkitMatchesSelector ||
    element.msMatchesSelector ||
    element.mozMatchesSelector ||
    element.oMatchesSelector ||
    element.matchesSelector ||
    element.matches || Cute.no
  var isMatch = matches.call(element, selector)
  return isMatch
}

/**
 * Prevent the default action for this event.
 *
 * @param  {Event} event  Event to prevent from doing its default action.
 */
Cute.prevent = function (event) {
  Cute.apply(event, 'preventDefault')
}

/**
 * Stop an event from bubbling or performing its default action.
 *
 * @param  {Event} event  Event to stop.
 */
Cute.stop = function (event) {
  event._stopped = 1
  Cute.prevent(event)
}

/**
 * Focus on a specified element.
 *
 * @param  {HTMLElement} element  The element to focus on.
 * @param  {Boolean}     blur     Whether to blur instead.
 */
Cute.focus = function (element, blur) {
  Cute.apply(element, blur ? 'blur' : 'focus')
}
/**
 * Get or set the value of a form element.
 *
 * @param  {HTMLElement} input     A form element.
 * @param  {String}      newValue  An optional new value for the element.
 * @return {String|Array}          A value or values to set on the form element.
 */
Cute.value = function (input, newValue) {
  var type = input.type[0]
  var value = input.value
  var checked = input.checked
  var options = input.options
  var setNew = !Cute.isUndefined(newValue)
  if (type === 'c' || type === 'r') {
    if (setNew) {
      input.checked = newValue ? true : false
    } else {
      value = checked ? value : null
    }
  } else if (options) {
    if (setNew) {
      var selected = {}
      if (input.multiple) {
        newValue = Cute.isArray(newValue) ? newValue : [newValue]
        Cute.each(newValue, function (optionValue) {
          selected[optionValue] = 1
        })
      } else {
        selected[newValue] = 1
      }
      Cute.each(options, function (option) {
        option.selected = !!selected[option.value]
      })
    } else {
      value = Cute.value(options[input.selectedIndex])
    }
  } else if (setNew) {
    input.value = newValue
  }
  return value
}
/**
 * Apply arguments to an object method.
 *
 * @param  {Object}          object      An object with methods.
 * @param  {string}          methodName  A method name, which may exist on the object.
 * @param  {Arguments|Array} args        An arguments object or array to apply to the method.
 * @return {Object}                      The result returned by the object method.
 */
Cute.apply = function (object, methodName, args) {
  return ((object || 0)[methodName] || Cute.no).apply(object, args)
}
/**
 * Get the head element from the document.
 */
Cute.getHead = function () {
  var head = Cute.all('head')[0]
  return head
}

/**
 * Get the body element from the document.
 */
Cute.getBody = function () {
  var body = Cute.all('body')[0]
  return body
}

/**
 * Insert an external JavaScript file.
 *
 * @param  {String}   src  A source URL of a script to insert.
 * @param  {function} fn   An optional function to run when the script loads.
 */
Cute.js = function (src, fn) {
  var head = Cute.getHead()
  var script = Cute.add(head, 'script')
  if (fn) {
    Cute.ready(script, fn)
  }
  script.async = 1
  script.src = src
}

/**
 * Insert CSS text to the page.
 *
 * @param  {String} css  CSS text to be inserted.
 */
Cute.css = function (css) {

  // Allow CSS pixel sizes to be scaled using a window property.
  var zoom = window._zoom
  if (zoom && zoom > 1) {
    css = Cute.zoomCss(css)
  }

  // Insert CSS into the document head.
  var head = Cute.getHead()
  var style = Cute.add(head, 'style?type=text/css', css)
  var sheet = style.styleSheet
  if (sheet) {
    sheet.cssText = css
  }
}

/**
 * Scale CSS pixel sizes using a window property.
 *
 * @param  {String} css  CSS text to be zoomed.
 */
Cute.zoomCss = function (css) {
  var zoom = window._zoom || 1
  return css.replace(/([\.\d]+)px\b/g, function (match, n) {
    return Math.floor(n * zoom) + 'px'
  })
}
/**
 * Push, replace or pop a history item.
 *
 * @param  {String}  href   An href, if not popping.
 * @param  {Boolean} isNew  Whether the URL should be pushed as a new entry.
 */
Cute.history = function (href, isNew) {
  var history = window.history
  if (history) {
    if (href) {
      try {
        var method = isNew ? 'push' : 'replace'
        history[method + 'State'](null, null, href)
      } catch (ignore) {
        // TODO: Create a hash-based history push for old browsers.
      }
    } else {
      history.back()
    }
  }
}
/**
 * The values in this file can be overridden externally.
 * The default locale is US. Sorry, World.
 */

/**
 * Month names in English.
 * @type {Array}
 */
Cute.i18nMonths = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

/**
 * The word "at" in English (for separating date & time).
 * @type {String}
 */
Cute.i18nAt = 'at'

/**
 * Whether to show dates in DD/MM/YYYY format.
 * @type {Booly}
 */
Cute.i18nDayMonthYear = 0

/**
 * Whether to show times in 24-hour format.
 * @type {Booly}
 */
Cute.i18n24Hour = 0

/**
 * Why oh why did I have to learn different units than the rest of the world?
 * @type {String}
 */
Cute.i18nTemperature = 'F'
/**
 * Create a circular-safe JSON string.
 */
Cute.safeStringify = function (data, quote, stack) {
  if (Cute.isString(data)) {
    data = quote + data.replace(/\n\r"'/g, function (c) {
      return c === '\n' ? '\\n' : c === '\r' ? '\\r' : c === quote ? '\\' + c : c === '"' ? '&quot;' : "'"
    }) + quote
  } else if (Cute.isFunction(data) || Cute.isUndefined(data)) {
    return null
  } else if (data && Cute.isObject(data)) {
    stack = stack || []
    var isCircular
    Cute.each(stack, function (item) {
      if (item === data) {
        isCircular = 1
      }
    })
    if (isCircular) {
      return null
    }
    stack.push(data)
    var parts = []
    var before, after
    if (Cute.isArray(data)) {
      before = '['
      after = ']'
      Cute.each(data, function (value) {
        parts.push(Cute.safeStringify(value, quote, stack))
      })
    } else {
      before = '{'
      after = '}'
      Cute.each(data, function (value, key) {
        parts.push(Cute.stringify(key) + ':' + Cute.safeStringify(value, stack))
      })
    }
    stack.pop()
    data = before + parts.join(',') + after
  } else {
    data = '' + data
  }
  return data
}

/**
 * Create a JSON string.
 */


Cute.stringify = JSON.stringify


/**
 * Create a JSON-ish string.
 */
Cute.attrify = function (data) {
  return Cute.safeStringify(data, "'")
}

/**
 * Parse JavaScript and return a value.
 */
Cute.parse = function (value, alternative) {
  try {
    var evil = window.eval; // jshint ignore:line
    evil('eval.J=' + value)
    value = evil.J
  } catch (e) {
    //+env:debug
    Cute.error('[Cute] Could not parse JS: ' + value)
    //-env:debug
    value = alternative
  }
  return value
}

/**
 * Execute JavaScript.
 */
Cute.execute = function (text) {
  Cute.parse('0;' + text)
}

/**
 * Parse a value and return a boolean no matter what.
 */
Cute.parseBoolean = function (value, alternative) {
  value = Cute.parse(value)
  return Cute.isBoolean(value) ? value : (alternative || false)
}

/**
 * Parse a value and return a number no matter what.
 */
Cute.parseNumber = function (value, alternative) {
  value = Cute.parse(value)
  return Cute.isNumber(value) ? value : (alternative || 0)
}

/**
 * Parse a value and return a string no matter what.
 */
Cute.parseString = function (value, alternative) {
  value = Cute.parse(value)
  return Cute.isString(value) ? value : ('' + alternative)
}

/**
 * Parse a value and return an object no matter what.
 */
Cute.parseObject = function (value, alternative) {
  value = Cute.parse(value)
  return Cute.isObject(value) ? value : (alternative || {})
}

/**
 * Parse a value and return a number no matter what.
 */
Cute.parseArray = function (value, alternative) {
  value = Cute.parse(value)
  return Cute.isObject(value) ? value : (alternative || [])
}
// When not in debug mode, make the logging functions do nothing.
Cute.error = Cute.no
Cute.warn = Cute.no
Cute.info = Cute.no
Cute.log = Cute.no
Cute.trace = Cute.no

//+env:debug

/**
 * Log values to the console, if it's available.
 */
Cute.error = function () {
  Cute.ifConsole('error', arguments)
}

/**
 * Log values to the console, if it's available.
 */
Cute.warn = function () {
  Cute.ifConsole('warn', arguments)
}

/**
 * Log values to the console, if it's available.
 */
Cute.info = function () {
  Cute.ifConsole('info', arguments)
}

/**
 * Log values to the console, if it's available.
 */
Cute.log = function () {
  Cute.ifConsole('log', arguments)
}

/**
 * Log values to the console, if it's available.
 */
Cute.trace = function () {
  Cute.ifConsole('trace', arguments)
}

/**
 * Log values to the console, if it's available.
 */
Cute.ifConsole = function (method, args) {
  var console = window.console
  if (console && console[method]) {
    console[method].apply(console, args)
  }
}

//-env:debug
/**
 * Scroll the top of the page to a specified Y position.
 *
 * @param  {Integer} top  A specified Y position, in pixels.
 */
Cute.scrollTop = function (top) {
  document.body.scrollTop = (document.documentElement || 0).scrollTop = top
}

/**
 * Scroll the top of the page to a specified named anchor.
 *
 * @param  {String} name  The name of an HTML anchor.
 * @return {String}
 */
Cute.scrollToAnchor = function (name) {
  var offset = 0
  var element


  element = Cute.all('a[name=' + name + ']')[0]

  while (element) {
    offset += element.offsetTop || 0
    element = element.offsetParent || 0
  }
  Cute.scrollTop(offset - (document._menuOffset || 0))
}

/**
 * Set the units to be used for positioning.
 *
 * @param {String} unit  CSS positioning unit (px/em/rem).
 */
Cute.setUnit = function (unit) {
  Cute.setUnit._unit = unit
}

/**
 * Get the width and height of an element.
 *
 * @param  {HTMLElement} element  Element to measure.
 */
Cute.size = function (element) {
  element = element || 0
  return [element.offsetWidth, element.offsetHeight]
}

/**
 * Move, and potentially re-size, an element.
 *
 * @param  {HTMLElement} element  Element to move.
 * @param  {Number}      left     New left position for the element.
 * @param  {Number}      top      New top position for the element.
 * @param  {Number}      width    New width for the element.
 * @param  {Number}      height   New height for the element.
 * @param  {String}      unit     An optional unit (px/em/rem).
 */
Cute.moveElement = function (element, left, top, width, height, unit) {
  unit = unit || Cute.setUnit._unit || ''
}

/**
 * Get the width and height of the viewport as an array.
 *
 * @return {Array} [width, height]
 */
Cute.getViewport = function () {
  function dim (key) {
    return Math.max(document.documentElement['client' + key], window['inner' + key] || 0)
  }
  return [dim('Width'), dim('Height')]
}
/**
 * If the argument is numeric, return a number, otherwise return zero.
 *
 * @param  {Object} number  An object to convert to a number, if necessary.
 * @return {number}         The number, or zero.
 */
Cute.ensureNumber = function (number) {
  return isNaN(number *= 1) ? 0 : number
}

/**
 * Left-pad a number with zeros if it's shorter than the desired length.
 *
 * @param  {number} number  A number to pad.
 * @param  {number} length  A length to pad to.
 * @return {String}         The zero-padded number.
 */
Cute.zeroFill = function (number, length) {
  number = '' + number
  // Repurpose the lenth variable to count how much padding we need.
  length = Math.max(length - number.length, 0)
  return (new Array(length + 1)).join('0') + number
}
/**
 * Execute a function when the page loads or new content is added.
 *
 * @param  {Function}  listener  A function which will receive a ready element.
 */
Cute.ready = function (object, listener) {
  if (!listener) {
    listener = object
    object = document
  }

  // If the object is alreay ready, run the function now.
  if (object._isReady) {
    listener(object)
  }

  // Create a function that replaces itself so it will only run once.
  var fn = function () {
    if (Cute.isReady(object)) {
      Cute.isReady(object, 1)
      listener(object)
      listener = Cute.no
    }
  }

  // Bind using multiple methods for a variety of browsers.
  Cute.on(object, 'readystatechange,DOMContentLoaded', fn)
  Cute.on(object === document ? window : object, 'load', fn)

  // Bind to the Cute-triggered ready event.
  Cute.on(object, '_ready', fn)
}

/**
 * Get or set the readiness status of an object.
 *
 * @param  {Object}  object    The object that might be ready.
 * @param  {Boolean} setReady  Whether to .
 * @return {Boolean}           Whether the object is currently ready.
 */
Cute.isReady = function (object, setReady) {
  // Declare an object to be ready, and run events that have been bound to it.
  if (setReady && !object._ready) {
    object._ready = true
    Cute.emit('_ready', object)
  }
  // AJAX requests have readyState 4 when loaded.
  // All documents will reach readyState=="complete".
  // In IE, scripts can reach readyState=="loaded" or readyState=="complete".
  return object._ready || /(4|complete|scriptloaded)$/.test('' + object.tagName + object.readyState)
}
/**
 * Get the contents of a specified type of tag within a string of HTML.
 *
 * @param  {String}   html    [description]
 * @param  {String}   tagName [description]
 * @param  {Function} fn      [description]
 * @return {Array}            [description]
 */
Cute.tagContents = function (html, tagName, fn) {
  var pattern = Cute.tagPatterns[tagName]
  if (!pattern) {
    var flags = /^(html|head|title|body)$/.test(tagName) ? 'i' : 'gi'
    pattern = new RegExp('<' + tagName + '.*?>([\\s\\S]*?)<\\/' + tagName + '>', flags)
    Cute.tagPatterns[tagName] = pattern
  }
  var contents = []
  html.replace(pattern, function (match, content) {
    contents.push(content)
    if (fn) {
      fn(content)
    }
  })
  return contents
}

Cute.tagPatterns = {}
/**
 * Get or set an item in local storage.
 *
 * @param  {String} key    A key to fetch an object by.
 * @param  {Any}    value  A value to be stringified and stored.
 * @return {Any}           The object that was fetched and deserialized
 */
Cute.persist = function (key, value) {
  var storage = window.localStorage
  if (storage) {
    if (Cute.isUndefined(value)) {
      value = Cute.parse(storage.getItem(key))
    } else {
      storage.setItem(key, Cute.stringify(value))
    }
  }
  return value
}
/**
 * Return true if the string contains the given substring.
 */
Cute.contains = function (string, substring) {
  return ('' + string).indexOf(substring) > -1
}

/**
 * Return true if the string starts with the given substring.
 */
Cute.startsWith = function (string, substring) {
  return ('' + string).indexOf(substring) === 0; // jshint ignore:line
}

/**
 * Trim the whitespace from a string.
 */
Cute.trim = function (string) {
  return ('' + string).replace(/^\s+|\s+$/g, '')
}

/**
 * Split a string by commas.
 */
Cute.split = function (string) {
  return ('' + string).split(',')
}

/**
 * Return a lowercase string.
 */
Cute.lower = function (object) {
  return ('' + object).toLowerCase()
}

/**
 * Return an uppercase string.
 */
Cute.upper = function (object) {
  return ('' + object).toUpperCase()
}

/**
 * Return an escaped value for URLs.
 */
Cute.escape = function (value) {
  return encodeURIComponent('' + value)
}

/**
 * Return an unescaped value from an escaped URL.
 */
Cute.unescape = function (value) {
  return decodeURIComponent('' + value)
}
/**
 * Set or clear a timeout or interval. If set, save it for possible clearing.
 * The timer can either be added to the setTimer method itself, or it can
 * be added to an object provided (such as an HTMLElement).
 *
 * @param {Object|String} objectOrString  An object to bind a timer to, or a name to call it.
 * @param {Function}      fn              A function to run if the timer is reached.
 * @param {Integer}       delay           An optional delay in milliseconds.
 */
Cute.timer = function (objectOrString, fn, delay, isInterval) {
  var useString = Cute.isString(objectOrString)
  var object = useString ? Cute.timer : objectOrString
  var key = useString ? objectOrString : '_timeout'
  clearTimeout(object[key])
  if (fn) {
    if (Cute.isUndefined(delay)) {
      delay = 9
    }
    object[key] = (isInterval ? setInterval : setTimeout)(fn, delay)
  }
}

Cute.times = {}

Cute.now = function () {
  var perf = window.performance
  return perf && perf.now ? perf.now() : Date.now()
}

Cute.startTime = function (label) {
  Cute.times[label] = Cute.now()
}

Cute.endTime = function (label) {
  Cute.times[label] = Cute.now() - Cute.times[label]
}

Cute.beamTimes = function (label) {
  var times = []
  Cute.each(Cute.times, function (value, key) {
    times.push(key + ' ' + value.toFixed(3) + 'ms')
  })
  Beams.log(times.join(', '))
}
/**
 * Check whether a value is undefined.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is undefined.
 */
Cute.isUndefined = function (value) {
  return typeof value === 'undefined'
}

/**
 * Check whether a value is a boolean.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is a boolean.
 */
Cute.isBoolean = function (value) {
  return typeof value === 'boolean'
}

/**
 * Check whether a value is a number.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is a number.
 */
Cute.isNumber = function (value) {
  return typeof value === 'number'
}

/**
 * Check whether a value is a string.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is a string.
 */
Cute.isString = function (value) {
  return typeof value === 'string'
}

/**
 * Check whether a value is a function.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is a function.
 */
Cute.isFunction = function (value) {
  return typeof value === 'function'
}

/**
 * Check whether a value is an object.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is an object.
 */
Cute.isObject = function (value) {
  return typeof value === 'object'
}

/**
 * Check whether a value is null.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is null.
 */
Cute.isNull = function (value) {
  return value === null
}

/**
 * Check whether a value is an array.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is an array.
 */
Cute.isArray = function (value) {
  return value instanceof Array
}

/**
 * Check whether a value is a date.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is a date.
 */
Cute.isDate = function (value) {
  return value instanceof Date
}
