let button = document.querySelector("#button");
let symbols = [
    "\\alpha",
    "\\theta",
    "\\tau",
    "\\beta",
    "\\eta",
    "i",
];
// Define global DOM handler to format 'latex' into an HTML span
MathBox.DOM.Types.latex = MathBox.DOM.createClass({
    render: function (el) {
        this.props.innerHTML = katex.renderToString(this.children);
        return el("span", this.props);
    },
});

mathbox = MathBox.mathBox({
    plugins: ["core", "controls", "cursor", "stats"],
    controls: {
        klass: THREE.OrbitControls,
    },
    camera: {
        near: 0.01,
        far: 1000,
    },
});
three = mathbox.three;

three.camera.position.set(1.1, 1.45, 1);
three.camera.lookAt(new THREE.Vector3());
three.renderer.setClearColor(new THREE.Color(0xffffff), 1.0);

view = mathbox
    .unit({
        scale: null,
    })
    .cartesian({
        range: [
            [-2, 2],
            [-1, 1],
            [-1, 1],
        ],
        scale: [2, 1, 1],
    });




view.interval({
    width: 1,
    expr: function (emit, x, i, time) {
        y = Math.sin(x + (time * 0.2) / 4) * 0.7;
        emit(x, y);
    },
    channels: 2,
});


view
    .point({
        color: 0x3090ff,
        size: 40,
    })

    .html({
        width: 1,
        height: 3,
        depth: 2,
        expr: function (emit, el, i, j, k, l, time) {
            // Emit latex element
            emit(
                el(
                    "latex",
                    null,
                    "c = \\mathbf{F} \\pm\\sqrt{" + i + " a^2 + " + j + " b^2}"
                )
            );
        },
    })
    .dom({
        snap: false,
        offset: [0, -32],
        depth: 0.5,
        size: 24,
        zoom: 1,
        outline: 2,
    });


function filterMathBoxElements(parseResult) {
    // Placeholder for filtering logic
    console.log("Filter MathBox with parse result:", parseResult);
    // In a real implementation, you would use 'parseResult'
    // to determine which MathBox elements to show/hide or modify.
}
