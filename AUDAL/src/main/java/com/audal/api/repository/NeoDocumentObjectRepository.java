package com.audal.api.repository;

import java.util.Collection;
import java.util.List;
import java.util.Set;

import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.neo4j.annotation.QueryResult;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.repository.query.Param;

import com.audal.api.model.NeoDocumentObject;
import com.audal.api.model.NeoGroup;
import com.audal.api.model.NeoGrouping;
import com.audal.api.repository.NeoDocumentObjectRepository.DocConnection;

public interface NeoDocumentObjectRepository extends Neo4jRepository<NeoDocumentObject, Long> {
	
	
	@Query("MATCH (a:Object:Document) RETURN a")
	Collection<NeoDocumentObject> findAll();
	
	
	@Query("MATCH (n:Document:Object) WITH n \r\n" + 
			"UNWIND keys(n) AS key\r\n" + 
			"RETURN DISTINCT(key) AS name, apoc.meta.type(n[key]) AS type")
	Collection<DocProperty> getDocProperties();
	

	@Query("MATCH (n:Document:Object) WITH n \r\n" + 
			"UNWIND keys(n) AS key\r\n" + 
			"RETURN DISTINCT(key) AS property")
	Collection<String> getPropertyNames();
	
	@Query("MATCH (d:Document:Object) WHERE d.identifier IN $param1 RETURN d[$param2]")
	Collection<String> identifiersToProperty(@Param("param1") Iterable<String> ids, @Param("param2") String property);
	
	@Query("MATCH (d:Document:Object) WHERE d.identifier IN $param1 RETURN d[$param2] AS value, d.identifier AS key")
	Collection<KeyValue> identifiersToProperty2(@Param("param1") Iterable<String> ids, @Param("param2") String property);
	
	
	@Query("MATCH (d:Document:Object)-[c:CLASSIFIED]->(g1:Group)-[m:MEMBER]->(g2:Grouping {name: $param2}) WHERE d.identifier IN $param1 RETURN g1.name")
	Collection<String> identifiersToGroupNames(@Param("param1") Iterable<String> ids, @Param("param2") String property);
	
	
	@Query("MATCH (d:Document:Object)-[c:CLASSIFIED]->(g1:Group)-[m:MEMBER]->(g2:Grouping {name: $param2}) WHERE d.identifier IN $param1 RETURN g1.name AS value, d.identifier AS key")
	Collection<KeyValue> identifiersToGroupNames2(@Param("param1") Iterable<String> ids, @Param("param2") String property);
	
	@Query("MATCH (d:Document:Raw) WHERE d.identifier IN $param1 RETURN d.path AS value, d.identifier AS key")
	List<KeyValue> identifiersToPath(@Param("param1") Iterable<String> ids);
	
	@Query("MATCH (d:Document:Refined) RETURN DISTINCT d.vocabulary AS vocabulary, d.format AS format")
	List<DocRepresentation> getDocRepresentations();
	
	@Query("MATCH (d1:Document:Refined)-[s:SIMILARITY]->(d2:Document:Refined) RETURN DISTINCT d1.vocabulary AS vocabulary, d1.format AS format")
	List<DocRepresentation> getDocRepresentationsWithSim();
	
	
	@Query("MATCH (d:Document:Raw) WHERE d.identifier = $param1 RETURN d.path")
	String identifierToPath(@Param("param1") String id);
	
	@Query("MATCH (d1:Document:Refined {vocabulary: $param2})-[s:SIMILARITY]-(d2:Document:Refined {vocabulary: $param2}) "
			+ "WHERE d1.identifier IN $param1 AND s.value >= $param3 "
			+ "WITH DISTINCT d2.identifier AS identif"
			+ " RETURN  identif LIMIT $param4 ")
	Collection<String> getNeighbors(@Param("param1") Collection<String> ids, @Param("param2") String vocabulary,
			 @Param("param3") Double threshold,  @Param("param4") int limit);
	
	
	@Query("MATCH (d1:Document:Refined {vocabulary: $param2})-[s:SIMILARITY]-(d2:Document:Refined {vocabulary: $param2}) "
			+ "WHERE d1.identifier IN $param1 AND s.value >= $param3 "
			+ "RETURN d2.identifier ORDER BY s.value DESC LIMIT $param4")
	Collection<String> getNeighbors2(@Param("param1") Collection<String> ids, @Param("param2") String vocabulary,
			 @Param("param3") Double threshold,  @Param("param4") int limit);
	
	
	
	@Query("MATCH (d1:Document:Refined {vocabulary: $param2})-[s:SIMILARITY ]-(d2:Document:Refined {vocabulary: $param2}) "
			+ "WHERE d1.identifier IN $param1 AND d2.identifier IN $param1 AND s.value >= $param3 "
			+ "WITH DISTINCT d1.identifier AS from, d2.identifier AS to "
			+ "RETURN from, to")
	Collection<DocConnection> getDocsLinks(@Param("param1") List<String> ids, @Param("param2") String vocabulary,
			 @Param("param3") Double threshold);
	
	
/*	@Query("MATCH (d1:Document:Refined {vocabulary: $param2})-[s:SIMILARITY]->(d2:Document:Refined {vocabulary: $param2}) " + 
			"WHERE s.value >=$param3 AND d1.identifier IN $param1 AND d2.identifier IN $param1 " + 
			"WITH DISTINCT d1.identifier AS id1, d2.identifier AS id2, s " + 
			"MATCH (gr1:Grouping{name:$param4})<-[:MEMBER]-(g1:Group)<-[:CLASSIFIED]-(o1:Document:Object) WHERE o1.identifier=id1 " + 
			"MATCH (gr2:Grouping{name:$param4})<-[:MEMBER]-(g2:Group)<-[:CLASSIFIED]-(o2:Document:Object) WHERE o2.identifier=id2 " + 
			"RETURN  g1.name AS from, COUNT(id1) AS value, g2.name AS to" )*/
	@Query("MATCH (d1:Document:Refined {vocabulary: $param3})-[s:SIMILARITY]->(d2:Document:Refined {vocabulary: $param3}) " + 
			"WHERE s.value >=$param4 AND d1.identifier IN $param1 AND d2.identifier IN $param2 " + 
			"RETURN \"count\" AS key, COUNT(s) AS value" )
	KeyValue getGroupsLinks(@Param("param1") List<String> ids1, @Param("param2") List<String> ids2, @Param("param3") String vocabulary,
			 @Param("param4") Double threshold);
	
	
	@Query("MATCH (gr1:Grouping{name:$param4})<-[m1:MEMBER]-(g1:Group)<-[c1:CLASSIFIED]-(o1:Document:Object)-[r1:REPRESENTATION]->(d1:Document:Refined {vocabulary: $param2})-[s:SIMILARITY ]-(d2:Document:Refined {vocabulary: $param2})<-[r2:REPRESENTATION]-(o2:Document:Object)-[c2:CLASSIFIED]->(g2:Group)-[m2:MEMBER]->(gr2:Grouping{name:$param4}) " + 
			"WHERE o1.identifier IN $param1 " + 
			"AND o2.identifier IN $param1 " + 
			"AND s.value >= $param3 " + 
			"WITH DISTINCT g1.name AS from, o1.identifier AS id1, o2.identifier AS id2, g2.name AS to " + 
			"RETURN  DISTINCT from, to, COUNT(*) AS value")
	Collection<GroupConnection> getGroupsLinks2(@Param("param1") List<String> ids, @Param("param2") String vocabulary,
			 @Param("param3") Double threshold, @Param("param4") String grouping);
	
	
	@Query("MATCH (d1:Document:Object)-[c1:CLASSIFIED]->(g:Group)<-[c2:CLASSIFIED]-(d2:Document:Object) " + 
			"WHERE d1.identifier IN $param1 " + 
			"WITH d2, COUNT(*) AS nbMatches WHERE nbMatches >= $param2 " + 
			"RETURN  d2.identifier ORDER BY nbMatches DESC LIMIT $param3")
	Collection<String> getCoClassified(@Param("param1") Collection<String> ids,
			 @Param("param2") int threshold,  @Param("param3") int limit);
	
	@Query("CALL algo.labelPropagation.stream("
			+ "\"MATCH (d:Document:Refined {vocabulary:$param2}) WHERE d.identifier IN $param1 RETURN ID(d) AS id\", " + 
			"\"MATCH (d1:Document:Refined {vocabulary:$param2})-[s:SIMILARITY]-(d2:Document:Refined {vocabulary:'aura_pmi'}) "+
			 " WHERE s.value > $param3 " +
			 "RETURN id(d1) AS source, id(d2) AS target, s.value AS value\", " + 
			" {graph: 'cypher', weightProperty:'value', writeProperty:'partition', concurrency:4, direction:'BOTH',"+
			 " params: {param1:$param1, param2:$param2, param3:$param3}}) " + 
			"YIELD nodeId, label " + 
			"RETURN algo.asNode(nodeId).identifier AS identifier, label")
	Collection<Labeling> getPartition(@Param("param1") Collection<String> ids, @Param("param2") String vocabulary, @Param("param3") Double threshold);
	
	@Query("CALL algo.closeness.stream("
			+ "\"MATCH (d:Document:Refined {vocabulary:$param2}) WHERE d.identifier IN $param1 RETURN ID(d) AS id\", " + 
			"\"MATCH (d1:Document:Refined {vocabulary:$param2})-[s:SIMILARITY]-(d2:Document:Refined {vocabulary:'aura_pmi'}) "
			+ "WHERE s.value > $param3 "
			+ "RETURN id(d1) AS source, id(d2) AS target \", " + 
			" {graph: 'cypher', concurrency:4, direction:'BOTH',"
			+ " params: {param1:$param1, param2:$param2, param3:$param3, param4:$param4}}) " + 
			"YIELD nodeId, centrality " + 
			"RETURN algo.asNode(nodeId).identifier AS identifier, centrality AS value "
			+ "ORDER BY value DESC LIMIT $param4")
	Collection<Centrality> getCentralities(@Param("param1") Collection<String> ids, @Param("param2") String vocabulary, 
			@Param("param3") Double threshold, @Param("param4") Integer limit);
	
	@QueryResult
	public class Centrality{
		String identifier;
		Double value;
		public String getIdentifier() {
			return identifier;
		}
		public void setIdentifier(String identifier) {
			this.identifier = identifier;
		}
		public Double getValue() {
			return value;
		}
		public void setValue(Double value) {
			this.value = value;
		}
		
		
		}
	
	@QueryResult
	public class Labeling{
		String identifier;
		
		Long label;

		public String getIdentifier() {
			return identifier;
		}

		public void setIdentifier(String identifier) {
			this.identifier = identifier;
		}

		public Long getLabel() {
			return label;
		}

		public void setLabel(Long label) {
			this.label = label;
		}

		@Override
		public String toString() {
			return "Labeling [identifier=" + identifier + ", label=" + label + "]";
		}
		
		
	}
	
	@QueryResult
	public class DocProperty{
		String name;
		String type;
		
		public String getName() {
			return name;
		}


		public void setName(String name) {
			this.name = name;
		}


		public String getType() {
			return type;
		}


		public void setType(String type) {
			this.type = type;
		}

	}
	
	
	
	
	@QueryResult
	public class KeyValue{
		String key;
		Object value;
		public String getKey() {
			return key;
		}
		public void setKey(String key) {
			this.key = key;
		}
		public Object getValue() {
			return value;
		}
		public void setValue(Object value) {
			this.value = value;
		}
		
		

	}
	
	
	@QueryResult
	public class DocRepresentation{
		
		String vocabulary;
		
		String format;
		
		public String getVocabulary() {
			return vocabulary;
		}
		
		public void setVocabulary(String vocabulary) {
			this.vocabulary = vocabulary;
		}
		
		public String getFormat() {
			return format;
		}
		
		public void setFormat(String format) {
			this.format = format;
		}
		
		
	}
	
	
	@QueryResult
	public class DocConnection{
		String from;
		String to;
		public String getFrom() {
			return from;
		}
		public void setFrom(String from) {
			this.from = from;
		}
		public String getTo() {
			return to;
		}
		public void setTo(String to) {
			this.to = to;
		}
		
		
	}
	
	
	@QueryResult
	public class GroupConnection{
		String from;
		String to;
		Integer value;
		public String getFrom() {
			return from;
		}
		public void setFrom(String from) {
			this.from = from;
		}
		public String getTo() {
			return to;
		}
		public void setTo(String to) {
			this.to = to;
		}
		public Integer getValue() {
			return value;
		}
		public void setValue(Integer value) {
			this.value = value;
		}
		
		
	}
	
	
}


	