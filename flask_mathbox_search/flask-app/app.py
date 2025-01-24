from flask import Flask, render_template, jsonify, request
from neo4j import GraphDatabase
import re

app = Flask(__name__)
app.config["NEO4J_URI"] = "bolt://neo4j:7687"
app.config["NEO4J_USER"] = "neo4j"
app.config["NEO4J_PASSWORD"] = "password"

# Initialize Neo4j Driver
driver = GraphDatabase.driver(
    app.config["NEO4J_URI"],
    auth=(app.config["NEO4J_USER"], app.config["NEO4J_PASSWORD"]),
)


# Example Data (for demonstration - replace with your actual Neo4j data and queries)
def create_sample_data():
    with driver.session() as session:
        session.run(
            """
            MERGE (n1:Node {name: 'Node A', description: 'Alpha feature'})
            MERGE (n2:Node {name: 'Node B', description: 'Beta functionality'})
            MERGE (n3:Node {name: 'Node C', description: 'Gamma integration'})
            MERGE (n4:Node {name: 'Node D', description: 'Delta component'})
            MERGE (n1)-[:RELATES_TO]->(n2)
            MERGE (n1)-[:RELATES_TO]->(n3)
            MERGE (n2)-[:RELATES_TO]->(n4)
            MERGE (n3)-[:RELATES_TO]->(n4)
        """
        )


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/search", methods=["POST"])
def search():
    search_term = request.form.get("search_term", "")
    if not search_term:
        return jsonify({"error": "Search term is required"}), 400

    try:
        # Compile re2 pattern for performance (compile once at app start for real applications)
        pattern = re.compile(search_term, re.IGNORECASE)  # Case-insensitive search

        with driver.session() as session:
            query = """
                MATCH (n:Node)
                WHERE n.name =~ $pattern OR n.description =~ $pattern
                RETURN n { .name, .description } AS node
            """
            results = session.run(
                query, pattern=f".*{search_term}.*"
            )  # Neo4j LIKE equivalent using =~
            nodes = [record["node"] for record in results]

            # Filter results further in Python using re2 for more complex regex if needed
            filtered_nodes = [
                node
                for node in nodes
                if pattern.search(coalesce(node["name"], "No Name"))
                or pattern.search(node["description"])
            ]

            return jsonify(nodes=filtered_nodes)
    except Exception as e:
        print(f"Error during search: {e}")
        return jsonify({"error": "Search failed"}), 500


@app.route("/graph_data")
def graph_data():
    try:
        with driver.session() as session:
            query = """
                 MATCH (n)-[r]->(m)
                RETURN
                    { id: elementId(n), name: coalesce(n.name, 'No Name'), label: labels(n) } AS source,
                    { id: elementId(m), name: coalesce(m.name, 'No Name'), label: labels(m) } AS target,
                    type(r) AS relationship
            """
            results = session.run(query)
            graph = {"nodes": [], "links": []}
            node_ids = set()
            for record in results:
                source_node = record["source"]
                target_node = record["target"]
                relationship = record["relationship"]

                if source_node["id"] not in node_ids:
                    graph["nodes"].append(source_node)
                    node_ids.add(source_node["id"])
                if target_node["id"] not in node_ids:
                    graph["nodes"].append(target_node)
                    node_ids.add(target_node["id"])

                graph["links"].append(
                    {
                        "source": source_node["id"],
                        "target": target_node["id"],
                        "type": relationship,
                    }
                )
            return jsonify(graph)
    except Exception as e:
        print(f"Error fetching graph data: {e}")
        return jsonify({"error": "Failed to fetch graph data"}), 500


if __name__ == "__main__":
    create_sample_data()  # Create sample data on startup for demonstration
    app.run(debug=True)  # Debug mode for development, remove in production
