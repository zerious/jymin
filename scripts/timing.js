/**
 * Set or reset a timeout or interval, and save it for possible cancellation.
 * The timer can either be added to the setTimer method itself, or it can
 * be added to an object provided (such as an HTMLElement).
 *
 * @param {Object|String} objectOrString  An object to bind a timer to, or a name to call it.
 * @param {Function}      fn              A function to run if the timer is reached.
 * @param {Integer}       delay           An optional delay in milliseconds.
 */
Jymin.setTimer = function (objectOrString, fn, delay, isInterval) {
  var useString = Jymin.isString(objectOrString);
  var object = useString ? Jymin.setTimer : objectOrString;
  var key = useString ? objectOrString : '_timeout';
  clearTimeout(object[key]);
  if (fn) {
    if (Jymin.isUndefined(delay)) {
      delay = 9;
    }
    object[key] = (isInterval ? setInterval : setTimeout)(fn, delay);
  }
};

/**
 * Remove a timer from an element or from the Jymin.setTimer method.
 *
 * @param {Object|String} objectOrString  An object or a timer name.
 */
Jymin.clearTimer = function (objectOrString) {
  Jymin.setTimer(objectOrString);
};

/**
 * Throttle a function by preventing it from being called again soon.
 *
 * @param {Function}        fn            The function to throttle.
 * @param {Array|Arguments} args          Arguments to pass to the function.
 * @param {Number}          milliseconds  Number of milliseconds to throttle.
 */
Jymin.throttle = function (fn, args, milliseconds) {
  if (Jymin.isNumber(args)) {
    milliseconds = args;
    args = [];
  }
  milliseconds = milliseconds || 9;
  var now = Jymin.getTime();
  var until = fn._throttleUntil || now;
  if (until <= now) {
    fn.apply(fn, args);
  }
  fn._throttleUntil = now + milliseconds;
};