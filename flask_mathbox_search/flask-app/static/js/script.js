document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const mathboxContainer = document.getElementById('mathbox-container');

    let mathbox = null;
    let view = null;
    let graphData = null; // Store graph data

    function initializeMathbox() {
        mathbox = MathBox.mathBox({
            plugins: ["core", "controls", "cursor", "stats"], // Added 'stats' plugin for performance monitoring
            controls: {
                klass: THREE.OrbitControls,
            },
            loop: {
                start: true,
            },
            camera: {
                near: 0.1,
                far: 1000,
                fov: 45,
            },
            renderer: {
                antialias: true,
            },
        });

        mathboxContainer.appendChild(mathbox.domElement);

        view = mathbox.cartesian({
            range: [[-2, 2], [-2, 2], [-2, 2]],
            scale: [1, 1, 1],
        });

        view.axis({
            detail: 100,
        });
        view.axis({
            axis: 2,
            detail: 100,
        });
        view.axis({
            axis: 3,
            detail: 100,
        });
    }

    function renderGraph(data) {
        if (!mathbox || !view) {
            initializeMathbox();
        }

        view.remove('*'); // Clear previous graph elements

        const nodes = data.nodes;
        const links = data.links;

        const nodePositions = {};
        nodes.forEach((node, index) => {
            nodePositions[node.id] = [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1]; // Random positions for now, consider graph layout algorithms for better visualization
        });

        // Draw edges (links)
        view.array({
            data: links.map(link => [nodePositions[link.source], nodePositions[link.target]]),
            channels: 2,
            items: 2,
            live: false,
        }).line({
            color: 0x909090,
            width: 3,
        });

        // Draw nodes (points)
        view.array({
            data: nodes.map(node => nodePositions[node.id]),
            channels: 3,
            live: false,
        }).point({
            color: 0x30c0ff,
            size: 12,
        });

        // Node labels (HTML labels)
        view.array({
            data: nodes.map(node => nodePositions[node.id]),
            channels: 3,
            live: false,
        }).html({
            data: nodes.map(node => node.name),
            width: 64,
            height: 32,
            depth: 1,
            zoom: 1,
            offset: [0, 16],
            classes: ['node-label'],
        }).dom({
            element: function(el, i, data) {
                el.textContent = data;
            },
        });
    }


    function fetchGraphData() {
        fetch('/graph_data')
            .then(response => response.json())
            .then(data => {
                graphData = data; // Store fetched data
                renderGraph(graphData);
            })
            .catch(error => console.error('Error fetching graph data:', error));
    }

    function performSearch(searchTerm) {
        if (!graphData) {
            console.warn("Graph data not loaded yet. Please wait or refresh.");
            return;
        }

        fetch('/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `search_term=${searchTerm}`,
        })
        .then(response => response.json())
        .then(searchResults => {
            if (searchResults.error) {
                console.error("Search error:", searchResults.error);
                return;
            }
            console.log("Search Results:", searchResults);

            // Highlight or filter nodes based on search results
            if (searchResults.nodes) {
                const searchNodeIds = new Set(searchResults.nodes.map(node => node.id));
                const filteredGraph = {
                    nodes: graphData.nodes.filter(node => searchNodeIds.has(node.id)),
                    links: graphData.links.filter(link => searchNodeIds.has(link.source) && searchNodeIds.has(link.target)), // Keep only links between found nodes for simplicity
                };
                renderGraph(filteredGraph); // Re-render graph with filtered data
            } else {
                renderGraph({ nodes: [], links: [] }); // Clear graph if no results (or handle differently)
            }


        })
        .catch(error => console.error('Search request failed:', error));
    }

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            performSearch(searchTerm);
        } else {
            renderGraph(graphData); // If search is cleared, show full graph again
        }
    });

    // Initial graph load
    fetchGraphData();
});