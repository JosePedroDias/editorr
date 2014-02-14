'use strict';

/**
 * token:
 * v-value
 * t-type
 * i-index in string
 */

var punctRgx = /[\.\?!,\-]+/m;

var parser = function(content) {
	var tokens = [
		{
			v: content,
			t: '',
			i: 0
		}
	];

	var split = function(i, parts) {
		parts.unshift(1);
		parts.unshift(i);
		tokens.splice.apply(tokens, parts);
	};

	while (true) {
		punctRgx.lastIndex = 0;

		for (var i = 0, f = tokens.length, t, m, ps, v; i < f; ++i) {
			t = tokens[i];
			ps = [];

			switch (t.t) {
				case '':
					//punctRgx.lastIndex = 0;
					while (true) {
						m = punctRgx.exec(t.v);
						//console.log(m);
						if (!m) { break; }
						if (m.index !== 0) {
							v = t.v.substring(0, m.index);
							ps.push({v:v, t:'word', i:t.i});
							//t.v = t.v.substr(m.index, m[0].length);
						}
						ps.push({v:m[0], t:'punct', i:m.index});
						t.v = t.v.substring(m.index + m[0].length);
					}
					if (t.v.length > 0) {
						ps.push({v:t.v, t:'word', i:t.i});
					}
					split(i, ps);
					--i;
					break;

				default:
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

	textAreaEl.addEventListener('keyup', function() {
		content = textAreaEl.value;

		var tokens = parser(content);
		var html = generateMarkup(tokens);

		preEl.innerHTML = html;
	});
};
