package com.audal.api.repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.neo4j.annotation.Query;

import com.audal.api.model.MongoSemantic;
import com.audal.api.model.ThesaurusPair;




public interface MongoSemanticRepositoryCustom {

	
	
	List<String> findDictionaryTerms(String id);

	Map<String, List<String>> findThesaurusPairs(String id);



	Optional<MongoSemantic> createDictionary(String name, List<String> terms);

	Optional<MongoSemantic> createThesaurus(String name, List<ThesaurusPair> pairs);

	


}
