from neo4j import GraphDatabase
import re

NEO4J_URI = "bolt://127.0.0.1:7687"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "password"

# Initialize Neo4j Driver
driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))


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


def get_sample_data():
    """
    allofphysicsgraph/ui_v8_website_flask_neo4j/README_neo4j_commands.md
    """
    with driver.session() as session:
        for record in session.run("""MATCH (n) RETURN n;"""):
            print(record.value())


create_sample_data()
get_sample_data()
