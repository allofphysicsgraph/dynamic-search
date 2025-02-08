var button = document.querySelector("#button");
var symbols = [
    "\\alpha",
    "\\theta",
    "\\tau",
    "\\beta",
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

var node_count = 32;
view
    .interval({
        width: 2*node_count,
        expr: function (emit, x, i, t) {
            y = Math.sin(x + t / 4) * 0.5 + 0.75;
            emit(x, y);
        },
        channels: 2,
    })
    .resample({
        width: node_count,
    })
    .point({
        color: 0x30c0ff,
        size: 80,
    })
    .html({
        width: node_count,
        height: 2,
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


function filterMathBoxElements(parseResult) {
    // Placeholder for filtering logic
    console.log("Filter MathBox with parse result:", parseResult);
    // In a real implementation, you would use 'parseResult'
    // to determine which MathBox elements to show/hide or modify.
}
