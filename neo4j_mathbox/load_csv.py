from neo4j import GraphDatabase
import csv

uri = "bolt://localhost:7687"  # Replace with your Neo4j URI
username = "neo4j"  # Replace with your Neo4j username
password = ""  # Replace with your Neo4j password

driver = GraphDatabase.driver(uri, auth=(username, password))


def load_people_nodes(tx, csv_filepath):
    with open(csv_filepath, "r", encoding="utf-8") as csvfile:
        csv_reader = csv.DictReader(csvfile)
        for row in csv_reader:
            query = """
              MERGE (p:Person {person_id: $person_id})
              SET p.name = $person_name
          """
            tx.run(query, row)


with driver.session() as session:
    session.execute_write(load_people_nodes, "people.csv")

print("Nodes loaded successfully!")
