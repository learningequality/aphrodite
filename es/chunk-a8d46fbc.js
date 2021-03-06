import stringHash from 'string-hash';
import calc from 'inline-style-prefixer/static/plugins/calc';
import crossFade from 'inline-style-prefixer/static/plugins/crossFade';
import cursor from 'inline-style-prefixer/static/plugins/cursor';
import filter from 'inline-style-prefixer/static/plugins/filter';
import flex from 'inline-style-prefixer/static/plugins/flex';
import flexboxIE from 'inline-style-prefixer/static/plugins/flexboxIE';
import flexboxOld from 'inline-style-prefixer/static/plugins/flexboxOld';
import gradient from 'inline-style-prefixer/static/plugins/gradient';
import imageSet from 'inline-style-prefixer/static/plugins/imageSet';
import position from 'inline-style-prefixer/static/plugins/position';
import sizing from 'inline-style-prefixer/static/plugins/sizing';
import transition from 'inline-style-prefixer/static/plugins/transition';
import createPrefixer from 'inline-style-prefixer/static/createPrefixer';
import asap from 'asap';

/* ::
type ObjectMap = { [id:string]: any };
*/

var UPPERCASE_RE = /([A-Z])/g;
var UPPERCASE_RE_TO_KEBAB = function UPPERCASE_RE_TO_KEBAB(match /* : string */) {
    return (/* : string */'-' + String(match.toLowerCase())
    );
};

var kebabifyStyleName = function kebabifyStyleName(string /* : string */) /* : string */{
    var result = string.replace(UPPERCASE_RE, UPPERCASE_RE_TO_KEBAB);
    if (result[0] === 'm' && result[1] === 's' && result[2] === '-') {
        return '-' + String(result);
    }
    return result;
};

/**
 * CSS properties which accept numbers but are not in units of "px".
 * Taken from React's CSSProperty.js
 */
var isUnitlessNumber = {
    animationIterationCount: true,
    borderImageOutset: true,
    borderImageSlice: true,
    borderImageWidth: true,
    boxFlex: true,
    boxFlexGroup: true,
    boxOrdinalGroup: true,
    columnCount: true,
    flex: true,
    flexGrow: true,
    flexPositive: true,
    flexShrink: true,
    flexNegative: true,
    flexOrder: true,
    gridRow: true,
    gridColumn: true,
    fontWeight: true,
    lineClamp: true,
    lineHeight: true,
    opacity: true,
    order: true,
    orphans: true,
    tabSize: true,
    widows: true,
    zIndex: true,
    zoom: true,

    // SVG-related properties
    fillOpacity: true,
    floodOpacity: true,
    stopOpacity: true,
    strokeDasharray: true,
    strokeDashoffset: true,
    strokeMiterlimit: true,
    strokeOpacity: true,
    strokeWidth: true
};

/**
 * Taken from React's CSSProperty.js
 *
 * @param {string} prefix vendor-specific prefix, eg: Webkit
 * @param {string} key style name, eg: transitionDuration
 * @return {string} style name prefixed with `prefix`, properly camelCased, eg:
 * WebkitTransitionDuration
 */
function prefixKey(prefix, key) {
    return prefix + key.charAt(0).toUpperCase() + key.substring(1);
}

/**
 * Support style names that may come passed in prefixed by adding permutations
 * of vendor prefixes.
 * Taken from React's CSSProperty.js
 */
var prefixes = ['Webkit', 'ms', 'Moz', 'O'];

// Using Object.keys here, or else the vanilla for-in loop makes IE8 go into an
// infinite loop, because it iterates over the newly added props too.
// Taken from React's CSSProperty.js
Object.keys(isUnitlessNumber).forEach(function (prop) {
    prefixes.forEach(function (prefix) {
        isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop];
    });
});

var stringifyValue = function stringifyValue(key /* : string */
, prop /* : any */
) /* : string */{
    if (typeof prop === "number") {
        if (isUnitlessNumber[key]) {
            return "" + prop;
        } else {
            return prop + "px";
        }
    } else {
        return '' + prop;
    }
};

var stringifyAndImportantifyValue = function stringifyAndImportantifyValue(key /* : string */
, prop /* : any */
) {
    return (/* : string */importantify(stringifyValue(key, prop))
    );
};

// Turn a string into a hash string of base-36 values (using letters and numbers)
// eslint-disable-next-line no-unused-vars
var hashString = function hashString(string /* : string */, key /* : ?string */) {
    return (/* string */stringHash(string).toString(36)
    );
};

// Hash a javascript object using JSON.stringify. This is very fast, about 3
// microseconds on my computer for a sample object:
// http://jsperf.com/test-hashfnv32a-hash/5
//
// Note that this uses JSON.stringify to stringify the objects so in order for
// this to produce consistent hashes browsers need to have a consistent
// ordering of objects. Ben Alpert says that Facebook depends on this, so we
// can probably depend on this too.
var hashObject = function hashObject(object /* : ObjectMap */) {
    return (/* : string */hashString(JSON.stringify(object))
    );
};

// Given a single style value string like the "b" from "a: b;", adds !important
// to generate "b !important".
var importantify = function importantify(string /* : string */) {
    return (/* : string */
        // Bracket string character access is very fast, and in the default case we
        // normally don't expect there to be "!important" at the end of the string
        // so we can use this simple check to take an optimized path. If there
        // happens to be a "!" in this position, we follow up with a more thorough
        // check.
        string[string.length - 10] === '!' && string.slice(-11) === ' !important' ? string : String(string) + ' !important'
    );
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MAP_EXISTS = typeof Map !== 'undefined';

var OrderedElements = function () {
    /* ::
    elements: {[string]: any};
    keyOrder: string[];
    */

    function OrderedElements() {
        _classCallCheck(this, OrderedElements);

        this.elements = {};
        this.keyOrder = [];
    }

    _createClass(OrderedElements, [{
        key: 'forEach',
        value: function () {
            function forEach(callback /* : (string, any) => void */) {
                for (var i = 0; i < this.keyOrder.length; i++) {
                    // (value, key) to match Map's API
                    callback(this.elements[this.keyOrder[i]], this.keyOrder[i]);
                }
            }

            return forEach;
        }()
    }, {
        key: 'set',
        value: function () {
            function set(key /* : string */, value /* : any */, shouldReorder /* : ?boolean */) {
                if (!this.elements.hasOwnProperty(key)) {
                    this.keyOrder.push(key);
                } else if (shouldReorder) {
                    var index = this.keyOrder.indexOf(key);
                    this.keyOrder.splice(index, 1);
                    this.keyOrder.push(key);
                }

                if (value == null) {
                    this.elements[key] = value;
                    return;
                }

                if (MAP_EXISTS && value instanceof Map || value instanceof OrderedElements) {
                    // We have found a nested Map, so we need to recurse so that all
                    // of the nested objects and Maps are merged properly.
                    var nested = this.elements.hasOwnProperty(key) ? this.elements[key] : new OrderedElements();
                    value.forEach(function (value, key) {
                        nested.set(key, value, shouldReorder);
                    });
                    this.elements[key] = nested;
                    return;
                }

                if (!Array.isArray(value) && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
                    // We have found a nested object, so we need to recurse so that all
                    // of the nested objects and Maps are merged properly.
                    var _nested = this.elements.hasOwnProperty(key) ? this.elements[key] : new OrderedElements();
                    var keys = Object.keys(value);
                    for (var i = 0; i < keys.length; i += 1) {
                        _nested.set(keys[i], value[keys[i]], shouldReorder);
                    }
                    this.elements[key] = _nested;
                    return;
                }

                this.elements[key] = value;
            }

            return set;
        }()
    }, {
        key: 'get',
        value: function () {
            function get(key /* : string */) /* : any */{
                return this.elements[key];
            }

            return get;
        }()
    }, {
        key: 'has',
        value: function () {
            function has(key /* : string */) /* : boolean */{
                return this.elements.hasOwnProperty(key);
            }

            return has;
        }()
    }, {
        key: 'addStyleType',
        value: function () {
            function addStyleType(styleType /* : any */) /* : void */{
                var _this = this;

                if (MAP_EXISTS && styleType instanceof Map || styleType instanceof OrderedElements) {
                    styleType.forEach(function (value, key) {
                        _this.set(key, value, true);
                    });
                } else {
                    var keys = Object.keys(styleType);
                    for (var i = 0; i < keys.length; i++) {
                        this.set(keys[i], styleType[keys[i]], true);
                    }
                }
            }

            return addStyleType;
        }()
    }]);

    return OrderedElements;
}();

var w = ["Webkit"];
var m = ["Moz"];
var ms = ["ms"];
var wm = ["Webkit", "Moz"];
var wms = ["Webkit", "ms"];
var wmms = ["Webkit", "Moz", "ms"];

var staticPrefixData = {
  plugins: [calc, crossFade, cursor, filter, flex, flexboxIE, flexboxOld, gradient, imageSet, position, sizing, transition],
  prefixMap: { "transform": wms, "transformOrigin": wms, "transformOriginX": wms, "transformOriginY": wms, "backfaceVisibility": w, "perspective": w, "perspectiveOrigin": w, "transformStyle": w, "transformOriginZ": w, "animation": w, "animationDelay": w, "animationDirection": w, "animationFillMode": w, "animationDuration": w, "animationIterationCount": w, "animationName": w, "animationPlayState": w, "animationTimingFunction": w, "appearance": wm, "userSelect": wmms, "fontKerning": w, "textEmphasisPosition": w, "textEmphasis": w, "textEmphasisStyle": w, "textEmphasisColor": w, "boxDecorationBreak": w, "clipPath": w, "maskImage": w, "maskMode": w, "maskRepeat": w, "maskPosition": w, "maskClip": w, "maskOrigin": w, "maskSize": w, "maskComposite": w, "mask": w, "maskBorderSource": w, "maskBorderMode": w, "maskBorderSlice": w, "maskBorderWidth": w, "maskBorderOutset": w, "maskBorderRepeat": w, "maskBorder": w, "maskType": w, "textDecorationStyle": wm, "textDecorationSkip": wm, "textDecorationLine": wm, "textDecorationColor": wm, "filter": w, "fontFeatureSettings": wm, "breakAfter": wmms, "breakBefore": wmms, "breakInside": wmms, "columnCount": wm, "columnFill": wm, "columnGap": wm, "columnRule": wm, "columnRuleColor": wm, "columnRuleStyle": wm, "columnRuleWidth": wm, "columns": wm, "columnSpan": wm, "columnWidth": wm, "writingMode": wms, "flex": wms, "flexBasis": w, "flexDirection": wms, "flexGrow": w, "flexFlow": wms, "flexShrink": w, "flexWrap": wms, "alignContent": w, "alignItems": w, "alignSelf": w, "justifyContent": w, "order": w, "transitionDelay": w, "transitionDuration": w, "transitionProperty": w, "transitionTimingFunction": w, "backdropFilter": w, "scrollSnapType": wms, "scrollSnapPointsX": wms, "scrollSnapPointsY": wms, "scrollSnapDestination": wms, "scrollSnapCoordinate": wms, "shapeImageThreshold": w, "shapeImageMargin": w, "shapeImageOutside": w, "hyphens": wmms, "flowInto": wms, "flowFrom": wms, "regionFragment": wms, "textOrientation": w, "boxSizing": m, "textAlignLast": m, "tabSize": m, "wrapFlow": ms, "wrapThrough": ms, "wrapMargin": ms, "touchAction": ms, "gridTemplateColumns": ms, "gridTemplateRows": ms, "gridTemplateAreas": ms, "gridTemplate": ms, "gridAutoColumns": ms, "gridAutoRows": ms, "gridAutoFlow": ms, "grid": ms, "gridRowStart": ms, "gridColumnStart": ms, "gridRowEnd": ms, "gridRow": ms, "gridColumn": ms, "gridColumnEnd": ms, "gridColumnGap": ms, "gridRowGap": ms, "gridArea": ms, "gridGap": ms, "textSizeAdjust": ["ms", "Webkit"], "borderImage": w, "borderImageOutset": w, "borderImageRepeat": w, "borderImageSlice": w, "borderImageSource": w, "borderImageWidth": w }
};

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var prefixAll = createPrefixer(staticPrefixData);

/* ::
import type { SheetDefinition } from './index.js';
type StringHandlers = { [id:string]: Function };
type SelectorCallback = (selector: string) => string[];
export type SelectorHandler = (
    selector: string,
    baseSelector: string,
    callback: SelectorCallback
) => string[] | string | null;
*/

/**
 * `selectorHandlers` are functions which handle special selectors which act
 * differently than normal style definitions. These functions look at the
 * current selector and can generate CSS for the styles in their subtree by
 * calling the callback with a new selector.
 *
 * For example, when generating styles with a base selector of '.foo' and the
 * following styles object:
 *
 *   {
 *     ':nth-child(2n)': {
 *       ':hover': {
 *         color: 'red'
 *       }
 *     }
 *   }
 *
 * when we reach the ':hover' style, we would call our selector handlers like
 *
 *   handler(':hover', '.foo:nth-child(2n)', callback)
 *
 * Since our `pseudoSelectors` handles ':hover' styles, that handler would call
 * the callback like
 *
 *   callback('.foo:nth-child(2n):hover')
 *
 * to generate its subtree `{ color: 'red' }` styles with a
 * '.foo:nth-child(2n):hover' selector. The callback would return an array of CSS
 * rules like
 *
 *   ['.foo:nth-child(2n):hover{color:red !important;}']
 *
 * and the handler would then return that resulting CSS.
 *
 * `defaultSelectorHandlers` is the list of default handlers used in a call to
 * `generateCSS`.
 *
 * @name SelectorHandler
 * @function
 * @param {string} selector: The currently inspected selector. ':hover' in the
 *     example above.
 * @param {string} baseSelector: The selector of the parent styles.
 *     '.foo:nth-child(2n)' in the example above.
 * @param {function} generateSubtreeStyles: A function which can be called to
 *     generate CSS for the subtree of styles corresponding to the selector.
 *     Accepts a new baseSelector to use for generating those styles.
 * @returns {string[] | string | null} The generated CSS for this selector, or
 *     null if we don't handle this selector.
 */
var defaultSelectorHandlers /* : SelectorHandler[] */ = [
// Handle pseudo-selectors, like :hover and :nth-child(3n)
function () {
    function pseudoSelectors(selector, baseSelector, generateSubtreeStyles) {
        if (selector[0] !== ":") {
            return null;
        }
        return generateSubtreeStyles(baseSelector + selector);
    }

    return pseudoSelectors;
}(),

// Handle media queries (or font-faces)
function () {
    function mediaQueries(selector, baseSelector, generateSubtreeStyles) {
        if (selector[0] !== "@") {
            return null;
        }
        // Generate the styles normally, and then wrap them in the media query.
        var generated = generateSubtreeStyles(baseSelector);
        return [String(selector) + '{' + String(generated.join('')) + '}'];
    }

    return mediaQueries;
}()];

/**
 * Generate CSS for a selector and some styles.
 *
 * This function handles the media queries and pseudo selectors that can be used
 * in aphrodite styles.
 *
 * @param {string} selector: A base CSS selector for the styles to be generated
 *     with.
 * @param {Object} styleTypes: A list of properties of the return type of
 *     StyleSheet.create, e.g. [styles.red, styles.blue].
 * @param {Array.<SelectorHandler>} selectorHandlers: A list of selector
 *     handlers to use for handling special selectors. See
 *     `defaultSelectorHandlers`.
 * @param stringHandlers: See `generateCSSRuleset`
 * @param useImportant: See `generateCSSRuleset`
 *
 * To actually generate the CSS special-construct-less styles are passed to
 * `generateCSSRuleset`.
 *
 * For instance, a call to
 *
 *     generateCSS(".foo", [{
 *       color: "red",
 *       "@media screen": {
 *         height: 20,
 *         ":hover": {
 *           backgroundColor: "black"
 *         }
 *       },
 *       ":active": {
 *         fontWeight: "bold"
 *       }
 *     }], defaultSelectorHandlers);
 *
 * with the default `selectorHandlers` will make 5 calls to
 * `generateCSSRuleset`:
 *
 *     generateCSSRuleset(".foo", { color: "red" }, ...)
 *     generateCSSRuleset(".foo:active", { fontWeight: "bold" }, ...)
 *     // These 2 will be wrapped in @media screen {}
 *     generateCSSRuleset(".foo", { height: 20 }, ...)
 *     generateCSSRuleset(".foo:hover", { backgroundColor: "black" }, ...)
 */
var generateCSS = function generateCSS(selector /* : string */
, styleTypes /* : SheetDefinition[] */
, selectorHandlers /* : SelectorHandler[] */
, stringHandlers /* : StringHandlers */
, useImportant /* : boolean */
) /* : string[] */{
    var merged = new OrderedElements();

    for (var i = 0; i < styleTypes.length; i++) {
        merged.addStyleType(styleTypes[i]);
    }

    var plainDeclarations = new OrderedElements();
    var generatedStyles = [];

    // TODO(emily): benchmark this to see if a plain for loop would be faster.
    merged.forEach(function (val, key) {
        // For each key, see if one of the selector handlers will handle these
        // styles.
        var foundHandler = selectorHandlers.some(function (handler) {
            var result = handler(key, selector, function (newSelector) {
                return generateCSS(newSelector, [val], selectorHandlers, stringHandlers, useImportant);
            });
            if (result != null) {
                // If the handler returned something, add it to the generated
                // CSS and stop looking for another handler.
                if (Array.isArray(result)) {
                    generatedStyles.push.apply(generatedStyles, _toConsumableArray(result));
                } else {
                    // eslint-disable-next-line
                    console.warn('WARNING: Selector handlers should return an array of rules.' + 'Returning a string containing multiple rules is deprecated.', handler);
                    generatedStyles.push('@media all {' + String(result) + '}');
                }
                return true;
            }
        });
        // If none of the handlers handled it, add it to the list of plain
        // style declarations.
        if (!foundHandler) {
            plainDeclarations.set(key, val, true);
        }
    });
    var generatedRuleset = generateCSSRuleset(selector, plainDeclarations, stringHandlers, useImportant, selectorHandlers);

    if (generatedRuleset) {
        generatedStyles.unshift(generatedRuleset);
    }

    return generatedStyles;
};

/**
 * Helper method of generateCSSRuleset to facilitate custom handling of certain
 * CSS properties. Used for e.g. font families.
 *
 * See generateCSSRuleset for usage and documentation of paramater types.
 */
var runStringHandlers = function runStringHandlers(declarations /* : OrderedElements */
, stringHandlers /* : StringHandlers */
, selectorHandlers /* : SelectorHandler[] */
) /* : void */{
    if (!stringHandlers) {
        return;
    }

    var stringHandlerKeys = Object.keys(stringHandlers);
    for (var i = 0; i < stringHandlerKeys.length; i++) {
        var key = stringHandlerKeys[i];
        if (declarations.has(key)) {
            // A declaration exists for this particular string handler, so we
            // need to let the string handler interpret the declaration first
            // before proceeding.
            //
            // TODO(emily): Pass in a callback which generates CSS, similar to
            // how our selector handlers work, instead of passing in
            // `selectorHandlers` and have them make calls to `generateCSS`
            // themselves. Right now, this is impractical because our string
            // handlers are very specialized and do complex things.
            declarations.set(key, stringHandlers[key](declarations.get(key), selectorHandlers),

            // Preserve order here, since we are really replacing an
            // unprocessed style with a processed style, not overriding an
            // earlier style
            false);
        }
    }
};

var transformRule = function transformRule(key /* : string */
, value /* : string */
, transformValue /* : function */
) {
    return (/* : string */String(kebabifyStyleName(key)) + ':' + String(transformValue(key, value)) + ';'
    );
};

var arrayToObjectKeysReducer = function arrayToObjectKeysReducer(acc, val) {
    acc[val] = true;
    return acc;
};

/**
 * Generate a CSS ruleset with the selector and containing the declarations.
 *
 * This function assumes that the given declarations don't contain any special
 * children (such as media queries, pseudo-selectors, or descendant styles).
 *
 * Note that this method does not deal with nesting used for e.g.
 * psuedo-selectors or media queries. That responsibility is left to  the
 * `generateCSS` function.
 *
 * @param {string} selector: the selector associated with the ruleset
 * @param {Object} declarations: a map from camelCased CSS property name to CSS
 *     property value.
 * @param {Object.<string, function>} stringHandlers: a map from camelCased CSS
 *     property name to a function which will map the given value to the value
 *     that is output.
 * @param {bool} useImportant: A boolean saying whether to append "!important"
 *     to each of the CSS declarations.
 * @returns {string} A string of raw CSS.
 *
 * Examples:
 *
 *    generateCSSRuleset(".blah", { color: "red" })
 *    -> ".blah{color: red !important;}"
 *    generateCSSRuleset(".blah", { color: "red" }, {}, false)
 *    -> ".blah{color: red}"
 *    generateCSSRuleset(".blah", { color: "red" }, {color: c => c.toUpperCase})
 *    -> ".blah{color: RED}"
 *    generateCSSRuleset(".blah:hover", { color: "red" })
 *    -> ".blah:hover{color: red}"
 */
var generateCSSRuleset = function generateCSSRuleset(selector /* : string */
, declarations /* : OrderedElements */
, stringHandlers /* : StringHandlers */
, useImportant /* : boolean */
, selectorHandlers /* : SelectorHandler[] */
) /* : string */{
    // Mutates declarations
    runStringHandlers(declarations, stringHandlers, selectorHandlers);

    var originalElements = Object.keys(declarations.elements).reduce(arrayToObjectKeysReducer, Object.create(null));

    // NOTE(emily): This mutates handledDeclarations.elements.
    var prefixedElements = prefixAll(declarations.elements);

    var elementNames = Object.keys(prefixedElements);
    if (elementNames.length !== declarations.keyOrder.length) {
        // There are some prefixed values, so we need to figure out how to sort
        // them.
        //
        // Loop through prefixedElements, looking for anything that is not in
        // sortOrder, which means it was added by prefixAll. This means that we
        // need to figure out where it should appear in the sortOrder.
        for (var i = 0; i < elementNames.length; i++) {
            if (!originalElements[elementNames[i]]) {
                // This element is not in the sortOrder, which means it is a prefixed
                // value that was added by prefixAll. Let's try to figure out where it
                // goes.
                var originalStyle = void 0;
                if (elementNames[i][0] === 'W') {
                    // This is a Webkit-prefixed style, like "WebkitTransition". Let's
                    // find its original style's sort order.
                    originalStyle = elementNames[i][6].toLowerCase() + elementNames[i].slice(7);
                } else if (elementNames[i][1] === 'o') {
                    // This is a Moz-prefixed style, like "MozTransition". We check
                    // the second character to avoid colliding with Ms-prefixed
                    // styles. Let's find its original style's sort order.
                    originalStyle = elementNames[i][3].toLowerCase() + elementNames[i].slice(4);
                } else {
                    // if (elementNames[i][1] === 's') {
                    // This is a Ms-prefixed style, like "MsTransition".
                    originalStyle = elementNames[i][2].toLowerCase() + elementNames[i].slice(3);
                }

                if (originalStyle && originalElements[originalStyle]) {
                    var originalIndex = declarations.keyOrder.indexOf(originalStyle);
                    declarations.keyOrder.splice(originalIndex, 0, elementNames[i]);
                } else {
                    // We don't know what the original style was, so sort it to
                    // top. This can happen for styles that are added that don't
                    // have the same base name as the original style.
                    declarations.keyOrder.unshift(elementNames[i]);
                }
            }
        }
    }

    var transformValue = useImportant === false ? stringifyValue : stringifyAndImportantifyValue;

    var rules = [];
    for (var _i = 0; _i < declarations.keyOrder.length; _i++) {
        var key = declarations.keyOrder[_i];
        var value = prefixedElements[key];
        if (Array.isArray(value)) {
            // inline-style-prefixer returns an array when there should be
            // multiple rules for the same key. Here we flatten to multiple
            // pairs with the same key.
            for (var j = 0; j < value.length; j++) {
                rules.push(transformRule(key, value[j], transformValue));
            }
        } else {
            rules.push(transformRule(key, value, transformValue));
        }
    }

    if (rules.length) {
        return String(selector) + '{' + String(rules.join("")) + '}';
    } else {
        return "";
    }
};

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray$1(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/* ::
import type { SheetDefinition, SheetDefinitions } from './index.js';
import type { MaybeSheetDefinition } from './exports.js';
import type { SelectorHandler } from './generate.js';
*/

// The current <style> tag we are inserting into, or null if we haven't
// inserted anything yet. We could find this each time using
// `document.querySelector("style[data-aphrodite"])`, but holding onto it is
// faster.
var styleTag /* : ?HTMLStyleElement */ = null;
var styleTagSuffix = '';
var styleTagAttribute = function styleTagAttribute() {
    return 'data-aphrodite' + (styleTagSuffix ? '-' + styleTagSuffix : '');
};

var setStyleTagSuffix = function setStyleTagSuffix(suffix) {
    styleTagSuffix = suffix;
};

// Inject a set of rules into a <style> tag in the head of the document. This
// will automatically create a style tag and then continue to use it for
// multiple injections. It will also use a style tag with the `data-aphrodite`
// tag on it if that exists in the DOM. This could be used for e.g. reusing the
// same style tag that server-side rendering inserts.
var injectStyleTag = function injectStyleTag(cssRules /* : string[] */) {
    if (styleTag == null) {
        // Try to find a style tag with the `data-aphrodite` attribute first.
        styleTag = document.querySelector('style[' + String(styleTagAttribute()) + ']') /* : any */;

        // If that doesn't work, generate a new style tag.
        if (styleTag == null) {
            // Taken from
            // http://stackoverflow.com/questions/524696/how-to-create-a-style-tag-with-javascript
            var head = document.head || document.getElementsByTagName('head')[0];
            styleTag = document.createElement('style');

            styleTag.type = 'text/css';
            styleTag.setAttribute('' + String(styleTagAttribute()), "");
            head.appendChild(styleTag);
        }
    }

    // $FlowFixMe
    var sheet = styleTag.styleSheet || styleTag.sheet /* : any */;

    if (sheet.insertRule) {
        var numRules = sheet.cssRules.length;
        cssRules.forEach(function (rule) {
            try {
                sheet.insertRule(rule, numRules);
                numRules += 1;
            } catch (e) {
                // The selector for this rule wasn't compatible with the browser
            }
        });
    } else {
        styleTag.innerText = (styleTag.innerText || '') + cssRules.join('');
    }
};

// Custom handlers for stringifying CSS values that have side effects
// (such as fontFamily, which can cause @font-face rules to be injected)
var stringHandlers = {
    // With fontFamily we look for objects that are passed in and interpret
    // them as @font-face rules that we need to inject. The value of fontFamily
    // can either be a string (as normal), an object (a single font face), or
    // an array of objects and strings.
    fontFamily: function () {
        function fontFamily(val) {
            if (Array.isArray(val)) {
                var nameMap = {};

                val.forEach(function (v) {
                    nameMap[fontFamily(v)] = true;
                });

                return Object.keys(nameMap).join(",");
            } else if ((typeof val === 'undefined' ? 'undefined' : _typeof$1(val)) === "object") {
                injectStyleOnce(val.src, "@font-face", [val], false);
                return '"' + String(val.fontFamily) + '"';
            } else {
                return val;
            }
        }

        return fontFamily;
    }(),

    // With animationName we look for an object that contains keyframes and
    // inject them as an `@keyframes` block, returning a uniquely generated
    // name. The keyframes object should look like
    //  animationName: {
    //    from: {
    //      left: 0,
    //      top: 0,
    //    },
    //    '50%': {
    //      left: 15,
    //      top: 5,
    //    },
    //    to: {
    //      left: 20,
    //      top: 20,
    //    }
    //  }
    // TODO(emily): `stringHandlers` doesn't let us rename the key, so I have
    // to use `animationName` here. Improve that so we can call this
    // `animation` instead of `animationName`.
    animationName: function () {
        function animationName(val, selectorHandlers) {
            if (Array.isArray(val)) {
                return val.map(function (v) {
                    return animationName(v, selectorHandlers);
                }).join(",");
            } else if ((typeof val === 'undefined' ? 'undefined' : _typeof$1(val)) === "object") {
                // Generate a unique name based on the hash of the object. We can't
                // just use the hash because the name can't start with a number.
                // TODO(emily): this probably makes debugging hard, allow a custom
                // name?
                var name = 'keyframe_' + String(hashObject(val));

                // Since keyframes need 3 layers of nesting, we use `generateCSS` to
                // build the inner layers and wrap it in `@keyframes` ourselves.
                var finalVal = '@keyframes ' + name + '{';

                // TODO see if we can find a way where checking for OrderedElements
                // here is not necessary. Alternatively, perhaps we should have a
                // utility method that can iterate over either a plain object, an
                // instance of OrderedElements, or a Map, and then use that here and
                // elsewhere.
                if (val instanceof OrderedElements) {
                    val.forEach(function (valVal, valKey) {
                        finalVal += generateCSS(valKey, [valVal], selectorHandlers, stringHandlers, false).join('');
                    });
                } else {
                    Object.keys(val).forEach(function (key) {
                        finalVal += generateCSS(key, [val[key]], selectorHandlers, stringHandlers, false).join('');
                    });
                }
                finalVal += '}';

                injectGeneratedCSSOnce(name, [finalVal]);

                return name;
            } else {
                return val;
            }
        }

        return animationName;
    }()
};

// This is a map from Aphrodite's generated class names to `true` (acting as a
// set of class names)
var alreadyInjected = {};

// This is the buffer of styles which have not yet been flushed.
var injectionBuffer /* : string[] */ = [];

// A flag to tell if we are already buffering styles. This could happen either
// because we scheduled a flush call already, so newly added styles will
// already be flushed, or because we are statically buffering on the server.
var isBuffering = false;

var injectGeneratedCSSOnce = function injectGeneratedCSSOnce(key, generatedCSS) {
    var _injectionBuffer;

    if (alreadyInjected[key]) {
        return;
    }

    if (!isBuffering) {
        // We should never be automatically buffering on the server (or any
        // place without a document), so guard against that.
        if (typeof document === "undefined") {
            throw new Error("Cannot automatically buffer without a document");
        }

        // If we're not already buffering, schedule a call to flush the
        // current styles.
        isBuffering = true;
        asap(flushToStyleTag);
    }

    (_injectionBuffer = injectionBuffer).push.apply(_injectionBuffer, _toConsumableArray$1(generatedCSS));
    alreadyInjected[key] = true;
};

var injectStyleOnce = function injectStyleOnce(key /* : string */
, selector /* : string */
, definitions /* : SheetDefinition[] */
, useImportant /* : boolean */
) {
    var selectorHandlers /* : SelectorHandler[] */ = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

    if (alreadyInjected[key]) {
        return;
    }

    var generated = generateCSS(selector, definitions, selectorHandlers, stringHandlers, useImportant);

    injectGeneratedCSSOnce(key, generated);
};

var reset = function reset() {
    injectionBuffer = [];
    alreadyInjected = {};
    isBuffering = false;
    styleTag = null;
    styleTagSuffix = '';
};

var getBufferedStyles = function getBufferedStyles() {
    return injectionBuffer;
};

var startBuffering = function startBuffering() {
    if (isBuffering) {
        throw new Error("Cannot buffer while already buffering");
    }
    isBuffering = true;
};

var flushToArray = function flushToArray() {
    isBuffering = false;
    var ret = injectionBuffer;
    injectionBuffer = [];
    return ret;
};

var flushToString = function flushToString() {
    return flushToArray().join('');
};

var flushToStyleTag = function flushToStyleTag() {
    var cssRules = flushToArray();
    if (cssRules.length > 0) {
        injectStyleTag(cssRules);
    }
};

var getRenderedClassNames = function getRenderedClassNames() /* : string[] */{
    return Object.keys(alreadyInjected);
};

var addRenderedClassNames = function addRenderedClassNames(classNames /* : string[] */) {
    classNames.forEach(function (className) {
        alreadyInjected[className] = true;
    });
};

var processStyleDefinitions = function processStyleDefinitions(styleDefinitions /* : any[] */
, classNameBits /* : string[] */
, definitionBits /* : Object[] */
, length /* : number */
) /* : number */{
    for (var i = 0; i < styleDefinitions.length; i += 1) {
        // Filter out falsy values from the input, to allow for
        // `css(a, test && c)`
        if (styleDefinitions[i]) {
            if (Array.isArray(styleDefinitions[i])) {
                // We've encountered an array, so let's recurse
                length += processStyleDefinitions(styleDefinitions[i], classNameBits, definitionBits, length);
            } else {
                classNameBits.push(styleDefinitions[i]._name);
                definitionBits.push(styleDefinitions[i]._definition);
                length += styleDefinitions[i]._len;
            }
        }
    }
    return length;
};

/**
 * Inject styles associated with the passed style definition objects, and return
 * an associated CSS class name.
 *
 * @param {boolean} useImportant If true, will append !important to generated
 *     CSS output. e.g. {color: red} -> "color: red !important".
 * @param {(Object|Object[])[]} styleDefinitions style definition objects, or
 *     arbitrarily nested arrays of them, as returned as properties of the
 *     return value of StyleSheet.create().
 */
var injectAndGetClassName = function injectAndGetClassName(useImportant /* : boolean */
, styleDefinitions /* : MaybeSheetDefinition[] */
, selectorHandlers /* : SelectorHandler[] */
) /* : string */{
    var classNameBits = [];
    var definitionBits = [];

    // Mutates classNameBits and definitionBits and returns a length which we
    // will append to the hash to decrease the chance of hash collisions.
    var length = processStyleDefinitions(styleDefinitions, classNameBits, definitionBits, 0);

    // Break if there aren't any valid styles.
    if (classNameBits.length === 0) {
        return "";
    }

    var className = void 0;
    if (process.env.NODE_ENV === 'production') {
        className = classNameBits.length === 1 ? '_' + String(classNameBits[0]) : '_' + String(hashString(classNameBits.join())) + String((length % 36).toString(36));
    } else {
        className = classNameBits.join("-o_O-");
    }

    injectStyleOnce(className, '.' + String(className), definitionBits, useImportant, selectorHandlers);

    return className;
};

/* ::
import type { SelectorHandler } from './generate.js';
export type SheetDefinition = { [id:string]: any };
export type SheetDefinitions = SheetDefinition | SheetDefinition[];
type RenderFunction = () => string;
type Extension = {
    selectorHandler: SelectorHandler
};
export type MaybeSheetDefinition = SheetDefinition | false | null | void
*/

var unminifiedHashFn = function unminifiedHashFn(str /* : string */, key /* : string */) {
    return String(key) + '_' + String(hashString(str));
};

// StyleSheet.create is in a hot path so we want to keep as much logic out of it
// as possible. So, we figure out which hash function to use once, and only
// switch it out via minify() as necessary.
//
// This is in an exported function to make it easier to test.
var initialHashFn = function initialHashFn() {
    return process.env.NODE_ENV === 'production' ? hashString : unminifiedHashFn;
};

var hashFn = initialHashFn();

var StyleSheet = {
    create: function () {
        function create(sheetDefinition /* : SheetDefinition */) /* : Object */{
            var mappedSheetDefinition = {};
            var keys = Object.keys(sheetDefinition);

            for (var i = 0; i < keys.length; i += 1) {
                var key = keys[i];
                var val = sheetDefinition[key];
                var stringVal = JSON.stringify(val);

                mappedSheetDefinition[key] = {
                    _len: stringVal.length,
                    _name: hashFn(stringVal, key),
                    _definition: val
                };
            }

            return mappedSheetDefinition;
        }

        return create;
    }(),
    rehydrate: function () {
        function rehydrate() {
            var renderedClassNames /* : string[] */ = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            addRenderedClassNames(renderedClassNames);
        }

        return rehydrate;
    }()
};

/**
 * Utilities for using Aphrodite server-side.
 *
 * This can be minified out in client-only bundles by replacing `typeof window`
 * with `"object"`, e.g. via Webpack's DefinePlugin:
 *
 *   new webpack.DefinePlugin({
 *     "typeof window": JSON.stringify("object")
 *   })
 */
var StyleSheetServer = typeof window !== 'undefined' ? null : {
    renderStatic: function () {
        function renderStatic(renderFunc /* : RenderFunction */) {
            reset();
            startBuffering();
            var html = renderFunc();
            var cssContent = flushToString();

            return {
                html: html,
                css: {
                    content: cssContent,
                    renderedClassNames: getRenderedClassNames()
                }
            };
        }

        return renderStatic;
    }()
};

/**
 * Utilities for using Aphrodite in tests.
 *
 * Not meant to be used in production.
 */
var StyleSheetTestUtils = process.env.NODE_ENV === 'production' ? null : {
    /**
    * Prevent styles from being injected into the DOM.
    *
    * This is useful in situations where you'd like to test rendering UI
    * components which use Aphrodite without any of the side-effects of
    * Aphrodite happening. Particularly useful for testing the output of
    * components when you have no DOM, e.g. testing in Node without a fake DOM.
    *
    * Should be paired with a subsequent call to
    * clearBufferAndResumeStyleInjection.
    */
    suppressStyleInjection: function () {
        function suppressStyleInjection() {
            reset();
            startBuffering();
        }

        return suppressStyleInjection;
    }(),


    /**
    * Opposite method of preventStyleInject.
    */
    clearBufferAndResumeStyleInjection: function () {
        function clearBufferAndResumeStyleInjection() {
            reset();
        }

        return clearBufferAndResumeStyleInjection;
    }(),


    /**
    * Returns a string of buffered styles which have not been flushed
    *
    * @returns {string}  Buffer of styles which have not yet been flushed.
    */
    getBufferedStyles: function () {
        function getBufferedStyles$$1() {
            return getBufferedStyles();
        }

        return getBufferedStyles$$1;
    }()
};

/**
 * Generate the Aphrodite API exports, with given `selectorHandlers` and
 * `useImportant` state.
 */
function makeExports(useImportant /* : boolean */
) {
    var selectorHandlers /* : SelectorHandler[] */ = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultSelectorHandlers;

    return {
        StyleSheet: Object.assign({}, StyleSheet, {

            /**
             * Returns a version of the exports of Aphrodite (i.e. an object
             * with `css` and `StyleSheet` properties) which have some
             * extensions included.
             *
             * @param {Array.<Object>} extensions: An array of extensions to
             *     add to this instance of Aphrodite. Each object should have a
             *     single property on it, defining which kind of extension to
             *     add.
             * @param {SelectorHandler} [extensions[].selectorHandler]: A
             *     selector handler extension. See `defaultSelectorHandlers` in
             *     generate.js.
             *
             * @returns {Object} An object containing the exports of the new
             *     instance of Aphrodite.
             */
            extend: function () {
                function extend(extensions /* : Extension[] */) {
                    var extensionSelectorHandlers = extensions
                    // Pull out extensions with a selectorHandler property
                    .map(function (extension) {
                        return extension.selectorHandler;
                    })
                    // Remove nulls (i.e. extensions without a selectorHandler property).
                    .filter(function (handler) {
                        return handler;
                    });

                    return makeExports(useImportant, selectorHandlers.concat(extensionSelectorHandlers));
                }

                return extend;
            }()
        }),

        StyleSheetServer: StyleSheetServer,
        StyleSheetTestUtils: StyleSheetTestUtils,

        minify: function () {
            function minify(shouldMinify /* : boolean */) {
                hashFn = shouldMinify ? hashString : unminifiedHashFn;
            }

            return minify;
        }(),
        css: function () {
            function css() /* : MaybeSheetDefinition[] */{
                for (var _len = arguments.length, styleDefinitions = Array(_len), _key = 0; _key < _len; _key++) {
                    styleDefinitions[_key] = arguments[_key];
                }

                return injectAndGetClassName(useImportant, styleDefinitions, selectorHandlers);
            }

            return css;
        }(),


        flushToStyleTag: flushToStyleTag,
        injectAndGetClassName: injectAndGetClassName,
        defaultSelectorHandlers: defaultSelectorHandlers,
        setStyleTagSuffix: setStyleTagSuffix
    };
}

export { makeExports as a };
