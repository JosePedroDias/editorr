(function() {

    'use strict';



    var tknzr = window.jsTokenizer(
        { // rules regexes
            ws:    /\s+/,
            punct: /[;.:\?\^%<>=!&|+\-,\(\)]+/,
            email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/,
            //url:   /((([a-zA-Z]{2,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[a-zA-Z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
            word:  /[a-zA-ZáéíóúàãẽõâêôçÁÉÍÓÚÀÃẼÕÂÊÔÇ]+/,
            any:   /.+/
        },
        'ws punct email word any'.split(' '), // rules order
        1 // object mode?
    );



    var parser = function(content) {
        return tknzr.tokenize(content, true);
    };



    var generateMarkup = function(tokens) {
        var out = [];
        for (var i = 0, f = tokens.length, t; i < f; ++i) {
            t = tokens[i];
            out = out.concat(['<i class="', t.t ,'">', t.v, '</i>']);
        }
        return out.join('');
    };



    window.editorr = function(ctnEl, content) {
        ctnEl.classList.add('editor');

        var preEl      = document.createElement('pre');
        var textAreaEl = document.createElement('textarea');
        textAreaEl.spellcheck = false;

        ctnEl.appendChild(preEl);
        ctnEl.appendChild(textAreaEl);
        
        if (content === undefined) {
            content = '';
        }

        preEl.innerHTML = content;
        textAreaEl.value = content;

        var update = function() {
            content = textAreaEl.value;

            var tokens = parser(content);
            var html = generateMarkup(tokens);

            preEl.innerHTML = html;
        };

        update();

        textAreaEl.addEventListener('keyup', update);
    };

})();

