import { a as makeExports } from './chunk-a8d46fbc.js';
import 'string-hash';
import 'inline-style-prefixer/static/plugins/calc';
import 'inline-style-prefixer/static/plugins/crossFade';
import 'inline-style-prefixer/static/plugins/cursor';
import 'inline-style-prefixer/static/plugins/filter';
import 'inline-style-prefixer/static/plugins/flex';
import 'inline-style-prefixer/static/plugins/flexboxIE';
import 'inline-style-prefixer/static/plugins/flexboxOld';
import 'inline-style-prefixer/static/plugins/gradient';
import 'inline-style-prefixer/static/plugins/imageSet';
import 'inline-style-prefixer/static/plugins/position';
import 'inline-style-prefixer/static/plugins/sizing';
import 'inline-style-prefixer/static/plugins/transition';
import 'inline-style-prefixer/static/createPrefixer';
import 'asap';

var useImportant = false; // Don't add !important to style definitions

var Aphrodite = makeExports(useImportant);

var StyleSheet = Aphrodite.StyleSheet,
    StyleSheetServer = Aphrodite.StyleSheetServer,
    StyleSheetTestUtils = Aphrodite.StyleSheetTestUtils,
    css = Aphrodite.css,
    minify = Aphrodite.minify,
    flushToStyleTag = Aphrodite.flushToStyleTag,
    injectAndGetClassName = Aphrodite.injectAndGetClassName,
    defaultSelectorHandlers = Aphrodite.defaultSelectorHandlers,
    setStyleTagSuffix = Aphrodite.setStyleTagSuffix;

export { StyleSheet, StyleSheetServer, StyleSheetTestUtils, css, minify, flushToStyleTag, injectAndGetClassName, defaultSelectorHandlers, setStyleTagSuffix };
