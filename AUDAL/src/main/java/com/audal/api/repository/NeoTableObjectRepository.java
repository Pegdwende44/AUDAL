package com.audal.api.repository;

import java.util.Collection;
import java.util.List;
import java.util.Set;

import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.neo4j.annotation.QueryResult;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.repository.query.Param;

import com.audal.api.model.NeoColumn;
import com.audal.api.model.NeoDocumentObject;
import com.audal.api.model.NeoGroup;
import com.audal.api.model.NeoGrouping;
import com.audal.api.model.NeoTableObject;
import com.audal.api.repository.NeoDocumentObjectRepository.DocProperty;
import com.audal.api.repository.NeoDocumentObjectRepository.KeyValue;

public interface NeoTableObjectRepository extends Neo4jRepository<NeoTableObject, Long> {
	
	
	@Query("MATCH (n:Table:Object) WITH n \r\n" + 
			"UNWIND keys(n) AS key\r\n" + 
			"RETURN DISTINCT(key) AS name, apoc.meta.type(n[key]) AS type")
	Collection<DocProperty> getTabProperties();
	
	
	@Query("MATCH (a:Object:Table) RETURN a.identifier")
	Collection<String> findAllIdentifiers();
	
	@Query("MATCH (a:Object:Table {title: $param}) RETURN a.identifier")
	Collection<String> filterMatchingByName(@Param("param") String name);
	
	@Query("MATCH (a:Object:Table) WHERE a.title != $param RETURN a.identifier")
	Collection<String> filterUnMatchingByName(@Param("param") String name);
	
	@Query("MATCH (a:Object:Table) WHERE a.title CONTAINS  $param  RETURN a.identifier")
	Collection<String> filterMatchingLikeName(@Param("param") String name);
	
	@Query("MATCH (a:Object:Table) WHERE NOT a.title CONTAINS  $param  RETURN a.identifier")
	Collection<String> filterUnMatchingLikeName(@Param("param") String name);
	
	@Query("MATCH (n:Table:Object) WITH n \r\n" + 
			"UNWIND keys(n) AS key\r\n" + 
			"RETURN DISTINCT(key) AS property")
	Collection<String> getPropertyNames();
	
	@Query("MATCH (d:Table:Object) WHERE d.identifier IN $param1 RETURN d.identifier AS key, d[$param2] AS value")
	Collection<KeyValue> identifiersToProperty(@Param("param1") Iterable<String> ids, @Param("param2") String property);
	
	@Query("MATCH (d:Table:Object)-[c:CLASSIFIED]->(g1:Group)-[m:MEMBER]->(g2:Grouping {name: $param2}) WHERE d.identifier IN $param1 RETURN d.identifier AS key, g1.name AS value")
	Collection<KeyValue> identifiersToGroupNames(@Param("param1") Iterable<String> ids, @Param("param2") String property);
	
	
	@Query("MATCH (t1:Table:Object)<-[c1:CONTAINS]-(col1:Column)-[l:COL_SIMILARITY]-(col2:Column)-[c2:CONTAINS]->(t2:Table:Object) "
			+ "WHERE t1.identifier IN $param1 AND l.value >= $param2 "
			+ "WITH t2.identifier AS identifier, SUM(l.value) as value ORDER BY value DESC "
			+ "RETURN DISTINCT identifier  LIMIT $param3 ")
	Collection<String> getNeighbors(@Param("param1") Collection<String> ids,
			 @Param("param2") Double threshold,  @Param("param3") int limit);
	
	@Query("MATCH (d:Table:Raw) WHERE d.identifier = $param1 RETURN d.path AS value")
	String identifierToPath(@Param("param1") String id);
	
	@Query("MATCH (t:Table:Object {identifier: $param1})<-[c:CONTAINS]-(col:Column) "
			+ "RETURN col")
	List<NeoColumn> getTableColumns(@Param("param1") String id);
	
	@Query("MATCH (t1:Table:Object {title: $param1})-[l:TABLE_LINK]->(t2:Table:Object) "
			+ "RETURN t2.title AS table")
	Collection<String> getSimpleLeftJoinableTables(@Param("param1") String name);
	
	@Query("MATCH (t1:Table:Object {identifier: $param1})-[c1:CONTAINS]-(col1:Column)-[l:PK_FK_LINK]->(col2:Column)"
			+ "-[c2:CONTAINS]->(t2:Table:Object) "
			+ "RETURN col1.name AS thisCol, col2.name AS otherCol, t2.title AS tableName, t2.identifier AS tableId ORDER BY l.value DESC")
	Collection<Joinable> getDetailedLeftJoinableTables(@Param("param1") String identifier);
	
	
	@Query("MATCH (t1:Table:Object {title: $param1})<-[l:TABLE_LINK]-(t2:Table:Object) "
			+ "RETURN t2.title AS table")
	Collection<String> getSimpleRightJoinableTables(@Param("param1") String name);
	
	@Query("MATCH (t1:Table:Object {identifier: $param1})-[c1:CONTAINS]-(col1:Column)<-[l:PK_FK_LINK]-(col2:Column)"
			+ "-[c2:CONTAINS]->(t2:Table:Object) "
			+ "RETURN col1.name AS thisCol, col2.name AS otherCol, t2.title AS tableName, t2.identifier AS tableId ORDER BY l.value DESC")
	Collection<Joinable> getDetailedRightJoinableTables(@Param("param1") String identifier);
	
	@Query("MATCH (t1:Table:Object {identifier: $param1})-[c1:CONTAINS]-(col1:Column)-[l:PK_FK_LINK]-(col2:Column)"
			+ "-[c2:CONTAINS]->(t2:Table:Object) WHERE col1.name = col2.name "
			+ "WITH  col1, col2, t2 ORDER BY l.value "
			+ "RETURN  DISTINCT col1.name AS thisCol, col2.name AS otherCol, t2.title AS tableName, t2.identifier AS tableId ")
	Collection<Joinable> getDetailedNaturalJoinableTables(@Param("param1") String identifier);
	
	
	@Query("MATCH (t1:Table:Object {identifier: $param1})-[c1:CONTAINS]-(col1:Column)-[l:PK_FK_LINK]-(col2:Column)"
			+ "-[c2:CONTAINS]->(t2:Table:Object) "
			+ "WITH col1, col2, t2 ORDER BY l.value "
			+ "RETURN  DISTINCT col1.name AS thisCol, col2.name AS otherCol, t2.title AS tableName, t2.identifier AS tableId  ")
	Collection<Joinable> getDetailedInnerJoinableTables(@Param("param1") String name);
	
	
	@QueryResult
	public class Joinable{
		private String tableId;
		
		private String tableName;
		
		private String thisCol;
		
		private String otherCol;
		
		

		public String getThisCol() {
			return thisCol;
		}

		public void setThisCol(String thisCol) {
			this.thisCol = thisCol;
		}

		public String getOtherCol() {
			return otherCol;
		}

		public void setOtherCol(String otherCol) {
			this.otherCol = otherCol;
		}

		public String getTableId() {
			return tableId;
		}

		public void setTableId(String tableId) {
			this.tableId = tableId;
		}

		public String getTableName() {
			return tableName;
		}

		public void setTableName(String tableName) {
			this.tableName = tableName;
		}

		
		
		
		
		
	}
	
	
}


	