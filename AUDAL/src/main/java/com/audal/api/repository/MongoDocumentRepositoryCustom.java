package com.audal.api.repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.neo4j.annotation.Query;




public interface MongoDocumentRepositoryCustom {

	
	
	Map<String, Double> getDocumentsTopKw(List<String> ids, String vocabulary, int limit);
	
	Map<String, Double> getDocumentsEmbedding(List<String> ids, String vocabulary);

	Map<String, Double> getDocumentsFreqKw(List<String> ids, List<String> terms, String vocabulary);
	
}
