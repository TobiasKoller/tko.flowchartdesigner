

module common {
    declare var jQuery: any;

    export class DomHelper {

        ///**
        // * returns true, if the given class exists.
        // * @param className Name of the cssClass
        // */
        //static CssClassExists(className:string) {
        //    return this.GetCssClass(className) != null;
        //}

        ///**
        // * Returns the cssClass from the dom.
        // * @param className Name of the cssClass
        // */
        //static GetCssClass(className: string): CSSStyleRule {

        //    if (className.indexOf(".") !== 0)
        //        className = '.' + className;

        //    for (var i = 0; i < document.styleSheets.length; i++) {
        //        var styleSheet: any = document.styleSheets[i];
        //        var rules = styleSheet.rules || styleSheet.cssRules;

        //        if (!rules)
        //            continue;

        //        var rule: CSSStyleRule;
        //        for (rule of rules) {
        //            if (rule.selectorText == className)
        //                return rule;
        //        }
        //    }

        //    return null;
        //}

        static CreateCopy(object) {
            return jQuery.extend(true, {}, object);
        }

        static EncodeHtmlEntity(x) {
            return x.replace(/./gm, function (s) {
                return "&#" + s.charCodeAt(0) + ";";
            });
        }

        /**
         * Create string from HTML entities
         */
        static DecodeHtmlEntity(string) {
            return (string + "").replace(/&#\d+;/gm, function (s) {
                var x: any = s.match(/\d+/gm)[0];
                return String.fromCharCode(x);
            })
        }

        //static DecodeHtmlEntity(str):string {

        //    return str.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
        //}

        //static EncodeHtmlEntity(str):string {

        //    return str.replace(/[\u00A0-\u9999\<\>\&\'\"\\\/]/gim, function (c) {
        //        return '&#' + c.charCodeAt(0) + ';';
        //    });
        //}
    };



    
}