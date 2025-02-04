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
            // Emit latex
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
                    "\\sqrt{L^AT_EX + " +
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

view
    .interval({
        width: 192,
        expr: function (emit, x, i, t) {
            y = Math.sin(x + t / 4) * 0.5 + 0.25;
            emit(x, y);
        },
        channels: 2,
    })
    .group()
    .shader(
        {
            code: [
                "uniform float time;",
                "vec4 getSample(vec4 xyzw);",
                "vec4 getRippleSample(vec4 xyzw) {",
                "  vec4 pos = getSample(xyzw);",
                "  pos = pos + .05 * vec4(sin(pos.yxz * 3.0 + time + sin(pos.zxy * 2.9 + time * .339) * 2.0), 0.0);",
                "  pos = pos + .05 * vec4(sin(pos.yxz * 5.0 + time + sin(pos.zxy * 3.9 + time * .439) * 2.0), 0.0);",
                "  pos = pos + .05 * vec4(sin(pos.yxz * 7.0 + time + sin(pos.zxy * 4.9 + time * .539) * 2.0), 0.0);",
                "  return pos;",
                "}",
            ].join("\n"),
        },
        {
            time: function (t) {
                return t;
            },
        }
    )
    .resample()
    .line({
        color: 0x3090ff,
        width: 20,
    })
    .resample({
        shader: null,
        width: 8,
    })
    .point({
        color: 0x3090ff,
        size: 80,
        shape: "down",
    })
    .html({
        width: 8,
        height: 1,
        expr: function (emit, el, i, j, k, l, t) {
            // Emit copies of the button
            emit(el(clone, { i: i + 1, j: j + 1 }, button));
        },
    })
    .dom({
        snap: true,
        offset: [0, 40],
        depth: 0,
        size: 24,
        zoom: 1,
        outline: 2,
        pointerEvents: true,
    })
    .end();

view
    .interval({
        width: 48,
        expr: function (emit, x, i, t) {
            y = Math.sin(x + t / 4) * 0.5 - 0.25;
            emit(x, y);
        },
        channels: 2,
    })
    .line({
        color: 0xc04000,
        width: 20,
    })
    .resample({
        width: 8,
    })
    .point({
        color: 0xc04000,
        size: 80,
        shape: "square",
    })
    .html({
        width: 8,
        expr: function (emit, el, i, j, k, l, t) {
            // Emit Virtual HTML table
            var color = ["#c02050", "#c07020"][i % 2];
            emit(
                el(
                    "table",
                    {
                        style: {
                            border: "4px dashed rgba(192, 32, 48, .5)",
                            color: "rgba(96, 16, 32, 1)",
                            background: "rgba(255, 255, 255, .75)",
                        },
                    },
                    [
                        el("tr", null, [
                            el(
                                "td",
                                { style: { textAlign: "center", paddingBottom: "25px" } },
                                el("strong", null, "HTML")
                            ),
                        ]),
                        el("tr", null, [
                            el(
                                "td",
                                { style: { textAlign: "center", fontSize: "1.25em" } },
                                [
                                    el(
                                        "span",
                                        { style: { color: color } },
                                        Math.floor(t * 2 + i / 2)
                                    ),
                                    el(
                                        "span",
                                        null,
                                        String.fromCharCode(
                                            i + 0x8000 + (Math.floor(t + i / 4) % 100)
                                        )
                                    ),
                                ]
                            ),
                        ]),
                    ]
                )
            );
        },
    })
    .dom({
        snap: false,
        offset: [0, 0],
        depth: 0.5,
        size: 36,
        zoom: 1,
    });

view
    .interval({
        width: 48,
        expr: function (emit, x, i, t) {
            y = Math.sin(x + t / 4) * 0.5 - 0.75;
            emit(x, y);
        },
        channels: 2,
    })
    .line({
        color: 0x0,
        width: 20,
    })
    .resample({
        width: 8,
    })
    .point({
        color: 0x0,
        size: 80,
        shape: "diamond",
    })
    .text({
        width: 8,
        height: 5,
        weight: "bold",
        detail: 48,
        sdf: 6,
        expr: function (emit, i, j, k, t) {
            // Emit GL text
            var str =
                Math.floor(t * 2 + i / 2) +
                "GL" +
                String.fromCharCode(
                    i + 0x8000 + (Math.floor(t + i / 8) % 100) * 3
                );
            emit(str);
        },
    })
    .array({
        width: 8,
        expr: function (emit, i, t) {
            var color = [
                [192, 192, 192],
                [40, 40, 40],
            ][i % 2];
            emit(color[0] / 255, color[1] / 255, color[2] / 255, 1);
        },
        channels: 4,
    })
    .label({
        snap: false,
        offset: [0, -58],
        depth: 0.5,
        size: 42,
        points: "<<",
        colors: "<",
        color: "#fff",
        outline: 3,
        zIndex: 1,
    });

function filterMathBoxElements(parseResult) {
    // Placeholder for filtering logic
    console.log("Filter MathBox with parse result:", parseResult);
    // In a real implementation, you would use 'parseResult'
    // to determine which MathBox elements to show/hide or modify.
}