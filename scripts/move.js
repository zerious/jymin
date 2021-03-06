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
  //+browser:old
  Cute.all('a', function (anchor) {
    if (anchor.name === name) {
      element = anchor
    }
  })
  //-browser:old
  //+browser:ok
  element = Cute.all('a[name=' + name + ']')[0]
  //-browser:ok
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
