'use strict';

/**
 * token:
 * v-value
 * t-type
 * i-index in string
 */

var punctRgx = /[\.\?!,;\(\)\-]+/m;
var whiteRgx = /[ \t\n]+/m;

var parser = function(content) {
    if (content.length === 0) { return []; }
    
    var tokens = [
        {
            v: content,
            t: '',
            i: 0
        }
    ];

    var split = function(i, parts) {
        var n = parts.length;
        parts.unshift(1);
        parts.unshift(i);
        tokens.splice.apply(tokens, parts);
        return n - 1;
    };

    var findAll = function(rgx, t, i, matchT, unmatchedT) {
        var m, v, ps = [];
        while (true) {
            m = rgx.exec(t.v);
            if (!m) { break; }
            if (m.index !== 0) {
                v = t.v.substring(0, m.index);
                ps.push({v:v, t:unmatchedT, i:t.i});
            }
            ps.push({v:m[0], t:matchT, i:m.index});
            t.v = t.v.substring(m.index + m[0].length);
        }
        if (t.v.length > 0) {
            ps.push({v:t.v, t:unmatchedT, i:t.i});
        }
        split(i, ps);
    };

    //var keepGoing = true;
    while (true /*keepGoing*/) {
        //keepGoing = false;
        for (var i = 0, f = tokens.length, t; i < f; ++i) {
            t = tokens[i];

            switch (t.t) {
                case '':
                    f += findAll(punctRgx, t, i, 'punct', 'nopunct');
                    --i;
                    //keepGoing = true;
                    break;

                case 'nopunct':
                    f += findAll(whiteRgx, t, i, ' ', 'word');
                    --i;
                    //keepGoing = true;
                    break;

                //case 'word': case ' ': case 'punct':
                //  break;

                default:
                    console.log(i, f, t.t, t.v);
                    return tokens;
            }
        }
    }
};



var generateMarkup = function(tokens) {
    var out = [];
    for (var i = 0, f = tokens.length, t; i < f; ++i) {
        t = tokens[i];
        out = out.concat(['<i class="', t.t ,'">', t.v, '</i>']);
    }
    return out.join('');
};



var editor = function(ctnEl, content/*, parser*/) {
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

        //preEl.style.display = '';
    };

    update();

    //textAreaEl.addEventListener('keydown', function() { preEl.style.display = 'none'; });

    textAreaEl.addEventListener('keyup', update);
};
