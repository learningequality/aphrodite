var calc = require('inline-style-prefixer/static/plugins/calc')
var crossFade = require('inline-style-prefixer/static/plugins/crossFade')
var cursor = require('inline-style-prefixer/static/plugins/cursor')
var filter = require('inline-style-prefixer/static/plugins/filter')
var flex = require('inline-style-prefixer/static/plugins/flex')
var flexboxIE = require('inline-style-prefixer/static/plugins/flexboxIE')
var flexboxOld = require('inline-style-prefixer/static/plugins/flexboxOld')
var gradient = require('inline-style-prefixer/static/plugins/gradient')
var imageSet = require('inline-style-prefixer/static/plugins/imageSet')
var position = require('inline-style-prefixer/static/plugins/position')
var sizing = require('inline-style-prefixer/static/plugins/sizing')
var transition = require('inline-style-prefixer/static/plugins/transition')
var w = ["Webkit"];
var m = ["Moz"];
var ms = ["ms"];
var wm = ["Webkit","Moz"];
var wms = ["Webkit","ms"];
var wmms = ["Webkit","Moz","ms"];

module.exports =  {
  plugins: [calc,crossFade,cursor,filter,flex,flexboxIE,flexboxOld,gradient,imageSet,position,sizing,transition],
  prefixMap: {"transform":wms,"transformOrigin":wms,"transformOriginX":wms,"transformOriginY":wms,"backfaceVisibility":w,"perspective":w,"perspectiveOrigin":w,"transformStyle":w,"transformOriginZ":w,"animation":w,"animationDelay":w,"animationDirection":w,"animationFillMode":w,"animationDuration":w,"animationIterationCount":w,"animationName":w,"animationPlayState":w,"animationTimingFunction":w,"appearance":wm,"userSelect":wmms,"fontKerning":w,"textEmphasisPosition":w,"textEmphasis":w,"textEmphasisStyle":w,"textEmphasisColor":w,"boxDecorationBreak":w,"clipPath":w,"maskImage":w,"maskMode":w,"maskRepeat":w,"maskPosition":w,"maskClip":w,"maskOrigin":w,"maskSize":w,"maskComposite":w,"mask":w,"maskBorderSource":w,"maskBorderMode":w,"maskBorderSlice":w,"maskBorderWidth":w,"maskBorderOutset":w,"maskBorderRepeat":w,"maskBorder":w,"maskType":w,"textDecorationStyle":wm,"textDecorationSkip":wm,"textDecorationLine":wm,"textDecorationColor":wm,"filter":w,"fontFeatureSettings":wm,"breakAfter":wmms,"breakBefore":wmms,"breakInside":wmms,"columnCount":wm,"columnFill":wm,"columnGap":wm,"columnRule":wm,"columnRuleColor":wm,"columnRuleStyle":wm,"columnRuleWidth":wm,"columns":wm,"columnSpan":wm,"columnWidth":wm,"writingMode":wms,"flex":wms,"flexBasis":w,"flexDirection":wms,"flexGrow":w,"flexFlow":wms,"flexShrink":w,"flexWrap":wms,"alignContent":w,"alignItems":w,"alignSelf":w,"justifyContent":w,"order":w,"transitionDelay":w,"transitionDuration":w,"transitionProperty":w,"transitionTimingFunction":w,"backdropFilter":w,"scrollSnapType":wms,"scrollSnapPointsX":wms,"scrollSnapPointsY":wms,"scrollSnapDestination":wms,"scrollSnapCoordinate":wms,"shapeImageThreshold":w,"shapeImageMargin":w,"shapeImageOutside":w,"hyphens":wmms,"flowInto":wms,"flowFrom":wms,"regionFragment":wms,"textOrientation":w,"boxSizing":m,"textAlignLast":m,"tabSize":m,"wrapFlow":ms,"wrapThrough":ms,"wrapMargin":ms,"touchAction":ms,"gridTemplateColumns":ms,"gridTemplateRows":ms,"gridTemplateAreas":ms,"gridTemplate":ms,"gridAutoColumns":ms,"gridAutoRows":ms,"gridAutoFlow":ms,"grid":ms,"gridRowStart":ms,"gridColumnStart":ms,"gridRowEnd":ms,"gridRow":ms,"gridColumn":ms,"gridColumnEnd":ms,"gridColumnGap":ms,"gridRowGap":ms,"gridArea":ms,"gridGap":ms,"textSizeAdjust":["ms","Webkit"],"borderImage":w,"borderImageOutset":w,"borderImageRepeat":w,"borderImageSlice":w,"borderImageSource":w,"borderImageWidth":w}
}