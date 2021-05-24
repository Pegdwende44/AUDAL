# Overview on AUDAL (AURA-PMI Data Lake)

Welcome to the github repository of the AUDAL data lake. AUDAL is a data management system built for textual and tabular documents analysis. AUDAL provides both a REST-API based access and a graphical interface for analyses. Such analyses go from data retrieval (keyword based, category based, and proximity-based). 
For more details, please read the following paper **Joint Management and Analysis of Textual Documents and Tabular Data within the AUDAL Data Lake**

# Set up

### Metadata Generation
First, you need to install and configure Elasticsearch, Neo4j, MongoDB and SQLite for metadata storage. Then, you have to automatically generate metadata using files and processes we provide in the following repository: <https://github.com/Pegdwende44/AudalMetadata>

### Launching
When the metadata system is set up, you can launch the AUDAL system either through the Eclipse IDE, either by running the project JAR file. To generate such a JAR file, you have to run the command **mvn package** from the project root. 
You have to adapt the **application.properties** (inside src/main/resources) file with the access credentials to the MongoDB, Elasticsearch end Neo4j databases. 

Once everthing is okay, and the system is launched, you can access the api on <http://{host}:8081/> and the graphical interface on <http://{host}:8081/#/>

