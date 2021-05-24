package com.audal.api.repository;

import java.util.Collection;
import java.util.List;
import java.util.Set;

import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.neo4j.annotation.QueryResult;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.repository.query.Param;

import com.audal.api.model.NeoGroup;
import com.audal.api.model.NeoGrouping;

public interface NeoGroupRepository extends Neo4jRepository<NeoGroup, Long> {
	
	@Query("MATCH (g1:Grouping {name:$param1})<-[m:MEMBER]-(g2:Group)<-[c:CLASSIFIED]-(d:Object:Document) WHERE g2.name IN $param2 RETURN d.identifier")
	List<String> filterDocInGroups(@Param("param1")String grouping, @Param("param2")List<String> groups);
	
	@Query("MATCH (g1:Grouping {name:$param1})<-[m:MEMBER]-(g2:Group)<-[c:CLASSIFIED]-(d:Object:Table) WHERE g2.name IN $param2 RETURN d.identifier")
	List<String> filterTabInGroups(@Param("param1")String grouping, @Param("param2")List<String> groups);
	
	
	
	
	/*@Query("MATCH (g1:Grouping {name:$param1})--(g2:Group)--(d:Object:Document) WHERE NOT g2.name  IN $param2 RETURN d.identifier")
	List<String> filterNotInGroups(@Param("param1")String grouping, @Param("param2")List<String> groups);
	*/
	
	@Query("MATCH (g1:Grouping {name:$param})<-[r:MEMBER]-(g2:Group)<-[c:CLASSIFIED]-(o:Object) RETURN  g2.name as name, COUNT(DISTINCT o) as count")
	Collection<GroupCount> findGroupsCount(@Param("param")String name);
	
	/*
	@Query("MATCH (g1:Grouping {name:$param})<-[r:MEMBER]-(g2:Group) <-[s:CLASSIFIED]-() RETURN  g2.name as group, COUNT(s) as count ORDER BY g2.name")
	Collection<ExtGroup> getExtGroup(@Param("param")String name);
	
	@Query("MATCH (g1:Grouping {name:$param})<-[r:MEMBER]-(g2:Group) <-[s:CLASSIFIED]-(d:Document) RETURN  g2.name as group, COLLECT(d.identifier) as docs ORDER BY g2.name")
	Collection<GroupDocs> getDocsListByGroups(@Param("param")String name);
	
	@Query("MATCH (g1:Grouping {name:$param1})<-[r:MEMBER]-(g2:Group {name:$param2}) <-[s:CLASSIFIED]-(d:Document) RETURN  d.identifier ORDER BY d.identifier")
	Collection<String> getDocsListByGroup(@Param("param1")String grouping, @Param("param2")String group);
	
	
	@Query("MATCH (g1:Grouping {name:$param1})<-[r:MEMBER]-(g2:Group) <-[s:CLASSIFIED]-(d:Document) RETURN  ID(g2) ORDER BY d.identifier")
	int[] getClusters(@Param("param1")String grouping);
	
	
	@Query("MATCH (g1:Grouping {name:$param1})--(g2:Group)--(d:Document) WHERE g2.name in $param2 RETURN d.identifier")
	Set<String> filterGroups(@Param("param1")String grouping, @Param("param2")List<String> groups);
	
	@Query("MATCH (g1:Grouping {name:$param1})--(g2:Group)--(d:Document) WHERE d.identifier IN $param2 RETURN g2.name")
	Collection<String> getLabelsFromIdentifiers(@Param("param1")String label, @Param("param2")Set<String> identifiers);
	
	@QueryResult
	public class ExtGroup {
	    String group;
	    Integer count;
		public String getGroup() {
			return group;
		}
		public void setGroup(String group) {
			this.group = group;
		}
		public Integer getCount() {
			return count;
		}
		public void setCount(Integer count) {
			this.count = count;
		}
	    
	    
	    
	}
	*/
	
	@QueryResult
	public class GroupCount {
	    String name;
	    Integer count;
	    
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
		public Integer getCount() {
			return count;
		}
		public void setCount(Integer count) {
			this.count = count;
		}
		
		
		   
	    
	    
	}
}
