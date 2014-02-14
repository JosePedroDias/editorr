// credits go to dominic tarr's js-tokenizer available here:
// https://raw2.github.com/dominictarr/js-tokenizer/master/index.js
// I removed node stuff and converted it into a factory

(function(window, undefined) {
    
    'use strict';
    

    
    function combine() {
        return new RegExp('(' + [].slice.call(arguments).map(function(e) {
            e = e.toString();
            return '(?:' + e.substring(1, e.length - 1) + ')';
        }).join('|')+')');
    }



    function makeTester(rx) {
        var s = rx.toString();
        return new RegExp('^' + s.substring(1, s.length -1) + '$');
    }



    function jsTokenizer(rulesDict, rulesOrder, objectMode) {

        var combineOrder = rulesOrder.map(function(ruleName) {
            return rulesDict[ruleName];
        });
        var match = combine.apply(null, combineOrder);

        var tester = {};
        for (var ruleName in rulesDict) {
            tester[ruleName] = makeTester(rulesDict[ruleName]);
        }

        function tokenize(strToTokenize, throwInvalidTokens) {
            if (objectMode) {
                return strToTokenize.split(match).map(function(token) {

                    if (token === '') { return; }

                    var tokenType;
                    for (var i = 0, f = rulesOrder.length, ruleName; i < f; ++i) {
                        ruleName = rulesOrder[i];
                        if (tester[ruleName].test(token)) {
                            tokenType = ruleName;
                            break;
                        }
                    }

                    if (!tokenType && throwInvalidTokens) {
                        throw new Error('invalid token:' + JSON.stringify(token));
                    }

                    if (tokenType) {
                        return {
                            t: tokenType,
                            v: token
                        };
                    }
                }).filter(function(o) { return (o !== undefined); });
            }

            return strToTokenize.split(match).filter(function(token, idx) {
                if (idx % 2) { return true; }

                if (token !== '') {
                    if (throwInvalidTokens) {
                        throw new Error('invalid token:' + JSON.stringify(token));
                    }
                    return true;
                }
            });
        }

        function tokenType(e) {
            if (objectMode) {
                return e.t;   
            }

            for (var i = 0, f = rulesOrder.length, ruleName; i < f; ++i) {
                ruleName = rulesOrder[i];
                if (tester[ruleName].test(e)) {
                    return ruleName;
                }
            }
            return 'invalid';
        }

        // exposed API of initialized parser
        return {
            tokenize:  tokenize,
            tokenType: tokenType
        };

    }



    // export to global namespace
    window.jsTokenizer = jsTokenizer;
    
})(window);
