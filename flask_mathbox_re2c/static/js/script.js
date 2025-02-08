// Refactored JavaScript - goto statements removed and corrected cursor usage
function parse_u32(yyinput) {
    let yycursor = 0
    let yycond = 0; // YYC_INIT = 0
    let n = 0

    const YYCOND_INIT = 0;
    const YYCOND_BIN = 1;
    const YYCOND_OCT = 2;
    const YYCOND_DEC = 3;
    const YYCOND_HEX = 4;

    loop: while (true) {
        let yych;
        if (yycursor >= yyinput.length) { yych = 0; } else { yych = yyinput.charCodeAt(yycursor); }
        switch (yycond) {
        case YYCOND_INIT:
            if (yych === 0) {
                return null; // yy1: { return null }
            } else if (yych >= 49 && yych <= 57) { // '1' - '9'
                yycond = YYCOND_DEC; // yy6: { yycond = YYCOND_DEC; continue loop }
                continue loop; // yy4: { yycond = YYCOND_DEC; continue loop } (combined with yy6)
            } else if (yych === 48) { // '0'
                yycursor++; // yy5: { yycursor += (1); ... }
                yycond = YYCOND_OCT; // { yycond = YYCOND_OCT; continue loop }
                continue loop;
            } else if (yych === 98) { // 'b'
                if (yyinput.substring(yycursor, yycursor + 2) === '0b') {
                    yycursor += 2; // yy2: { yycursor += (2); ... }
                    yycond = YYCOND_BIN; // { yycond = YYCOND_BIN; continue loop }
                    continue loop;
                } else {
                    return null; // Fallback to default case behavior (yy1) if '0b' prefix not found
                }
            } else if (yych === 120) { // 'x'
                if (yyinput.substring(yycursor, yycursor + 2) === '0x') {
                    yycursor += 2; // yy3: { yycursor += (2); ... }
                    yycond = YYCOND_HEX; // { yycond = YYCOND_HEX; continue loop }
                    continue loop;
                } else {
                    return null; // Fallback to default case behavior (yy1) if '0x' prefix not found
                }
            } else {
                return null; // yy1: { return null } (default case)
            }
            break; // Added break to prevent fallthrough

        case YYCOND_BIN:
            if (yych === 0) {
                return n; // yy7: { return n }
            } else if (yych === 48 || yych === 49) { // '0' or '1'
                n = n * 2 + (yyinput.charCodeAt(yycursor) - 48); // yy8: { ... } (modified to use yycursor, not yycursor - 1)
                yycursor++;
                continue loop;
            } else {
                return n; // yy7: { return n }
            }
            break;

        case YYCOND_OCT:
            if (yych === 0) {
                return n; // yy9: { return n }
            } else if (yych >= 48 && yych <= 55) { // '0' - '7'
                n = n * 8 + (yyinput.charCodeAt(yycursor) - 48); // yy10: { ... } (modified to use yycursor)
                yycursor++;
                continue loop;
            } else {
                return n; // yy9: { return n }
            }
            break;

        case YYCOND_DEC:
            if (yych === 0) {
                return n; // yy11: { return n }
            } else if (yych >= 48 && yych <= 57) { // '0' - '9'
                n = n * 10 + (yyinput.charCodeAt(yycursor) - 48); // yy12: { ... } (modified to use yycursor)
                yycursor++;
                continue loop;
            } else {
                return n; // yy11: { return n }
            }
            break;

        case YYCOND_HEX:
            if (yych === 0) {
                return n; // yy13: { return n }
            } else if (yych >= 48 && yych <= 57) { // '0' - '9'
                n = n * 16 + (yyinput.charCodeAt(yycursor) - 48); // yy14: { ... } (modified to use yycursor)
                yycursor++;
                continue loop;
            } else if ((yych >= 65 && yych <= 70) || (yych >= 97 && yych <= 102)) { // 'A'-'F' or 'a'-'f'
                n = n * 16 + (yyinput.charCodeAt(yycursor) - (yych >= 97 ? 87 : 55)); // yy15: { ... } (modified to use yycursor)
                yycursor++;
                continue loop;
            } else {
                return n; // yy13: { return n }
            }
            break;
        }
    }
}


var button = document.querySelector("#button");
var symbols = [
    "\\alpha",
    "\\theta",
    "o",
    "\\tau",
    "\\beta",
    "\\vartheta",
    "\\pi",
    "\\upsilon",
    "\\gamma",
    "\\varpi",
    "\\phi",
    "\\delta",
    "\\kappa",
    "\\rho",
    "\\varphi",
    "\\epsilon",
    "\\lambda",
    "\\varrho",
    "\\chi",
    "\\varepsilon",
    "\\mu",
    "\\sigma",
    "\\psi",
    "\\zeta",
    "\\nu",
    "\\varsigma",
    "\\omega",
    "\\eta",
    "i",
];

// Define VDOM handler to clone real DOM elements
var clone = MathBox.DOM.createClass({
    render: function (el, props, children) {
        var button = children.cloneNode(true);
        return button;
    },
});

// Define VDOM handler to format 'latex' into an HTML span
var latex = MathBox.DOM.createClass({
    render: function (el) {
        this.props.innerHTML = katex.renderToString(this.children);
        return el("span", this.props);
    },
});

var mathbox = MathBox.mathBox({
    plugins: ["core", "controls", "cursor"],
    controls: {
        klass: THREE.OrbitControls,
    },
    loop: {
        start: window == window.top,
    },
    camera: {
        near: 0.01,
        far: 1000,
    },
});
var three = mathbox.three;

three.camera.position.set(-1, 1, 2.5);
three.camera.lookAt(new THREE.Vector3());
three.renderer.setClearColor(new THREE.Color(0xffffff), 1.0);

var view = mathbox
    .set({
        scale: null,
    })
    .polar({
        range: [
            [-2, 2],
            [-1, 1],
            [-1, 1],
        ],
        scale: [2, 1, 1],
        bend: 0.25,
    });

view
    .interval({
        width: 48,
        expr: function (emit, x, i, t) {
            y = Math.sin(x + t / 4) * 0.5 + 0.75;
            emit(x, y);
        },
        channels: 2,
    })
    .line({
        color: 0x30c0ff,
        width: 16,
    })
    .resample({
        width: 8,
    })
    .point({
        color: 0x30c0ff,
        size: 60,
    })
    .html({
        width: 8,
        height: 1,
        expr: function (emit, el, i, j, k, l, t) {
            var color = ["#30D0FF", "#30A0FF"][i % 2];
            var a =
                Math.round(
                    Math.sqrt(t * t + t + 3) +
                    Math.abs(Math.cos(t * 0.1 + i + i * i) * 50)
                ) % symbols.length;
            var b = Math.round(Math.sqrt(t * t + Math.sin(t + i * i) + 5));
            emit(
                el(
                    latex,
                    { style: { color: color } },
                    "\\sqrt{" +
                    (i + b + 1) +
                    " \\pi^{" +
                    symbols[a] +
                    "}}"
                )
            );
        },
    })
    .dom({
        snap: false,
        offset: [0, 32],
        depth: 0,
        zoom: 1,
        outline: 2,
        size: 20,
    });





const parseInput = document.getElementById('parseInput');
const parseOutput = document.getElementById('parseOutput');

parseInput.addEventListener('input', function() {
    const inputString = parseInput.value;
    const result = parse_u32(inputString + "\0"); // Add null terminator

    if (result === null) {
        parseOutput.textContent = "Output: null";
    } else {
        parseOutput.textContent = "Output: " + result;
    }
});
