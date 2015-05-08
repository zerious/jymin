/**
 * Scroll the top of the page to a specified Y position.
 *
 * @param  {Integer} top  A specified Y position, in pixels.
 */
Jymin.scrollTop = function (top) {
  document.body.scrollTop = (document.documentElement || 0).scrollTop = top;
};

/**
 * Scroll the top of the page to a specified named anchor.
 *
 * @param  {String} name  The name of an HTML anchor.
 * @return {String}
 */
Jymin.scrollToAnchor = function (name) {
  var offset = 0;
  var element;
  //+browser:old
  Jymin.all('a', function (anchor) {
    if (anchor.name == name) {
      element = anchor;
    }
  });
  //-browser:old
  //+browser:ok
  element = Jymin.all('a[name=' + name + ']')[0];
  //-browser:ok
  while (element) {
    offset += element.offsetTop || 0;
    element = element.offsetParent || 0;
  }
  Jymin.scrollTop(offset - (Jymin.body._.offsetTop || 0));
};

/**
 * Set the units to be used for positioning.
 *
 * @param {String} unit  CSS positioning unit (px/em/rem).
 */
Jymin.setUnit = function (unit) {
  Jymin.setUnit._unit = unit;
};

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
Jymin.moveElement = function (element, left, top, width, height, unit) {
  unit = unit || Jymin.setUnit._unit || '';
};