package com.audal.api.repository;

import java.util.Collection;
import java.util.Optional;

import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.neo4j.annotation.QueryResult;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.repository.query.Param;

import com.audal.api.model.NeoGrouping;

public interface NeoGroupingRepository extends Neo4jRepository<NeoGrouping, Long> {

	
	@Query("MATCH (a:Grouping)<-[r:MEMBER]-(b:Group) RETURN ID(a) AS id, a.name AS name, COLLECT(b.name) as neoGroups")
	Collection<NeoGrouping> findAll();
	
	@Query("MATCH (a:Grouping) RETURN a.name")
	Collection<String> getNames();
	
	@Query("MATCH (a:Grouping)<-[m:MEMBER]-(b:Group)<-[c:CLASSIFIED]-(d:Table:Object) RETURN DISTINCT a.name")
	Collection<String> getTabGroupings();
	
	@Query("MATCH (a:Grouping)<-[m:MEMBER]-(b:Group)<-[c:CLASSIFIED]-(d:Document:Object) RETURN DISTINCT a.name")
	Collection<String> getDocGroupings();
	
	
	@Query("MATCH (g1:Grouping {name:$param})<-[r:MEMBER]-(g2:Group) RETURN  g1, r, g2")
	Optional<NeoGrouping> findByName(@Param("param")String name);
	
	
	
	//@QueryResult
	
	
}
