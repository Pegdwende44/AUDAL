package com.audal.api.repository;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.Fields;
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
import org.springframework.data.mongodb.core.aggregation.ProjectionOperation;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.mapreduce.MapReduceOptions;
import org.springframework.data.mongodb.core.mapreduce.MapReduceResults;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.audal.api.controller.SemanticResourceController;
import com.audal.api.model.DicoTerms;
import com.audal.api.model.MongoSemantic;
import com.audal.api.model.TermFrequencyItem;
import com.audal.api.model.ThesaurusPair;
import com.audal.api.model.ThesaurusPairs;
import com.audal.api.repository.NeoDocumentObjectRepository.KeyValue;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;




public class MongoSemanticRepositoryCustomImpl implements MongoSemanticRepositoryCustom{

	@Autowired
	MongoTemplate mongoTemplate;

	@Override
	public List<String> findDictionaryTerms(String id) {
		Aggregation agg = newAggregation(
				match(Criteria.where("_id").is(id)),
				project("terms", "representations.data.freq"),
			    unwind("terms"));
		
		List<String> result = new ArrayList<String>();
		AggregationResults<DicoTerms> resultTemp =  mongoTemplate.aggregate(agg, "semantic_resources", DicoTerms.class);
		for (DicoTerms dicoTerms : resultTemp) {
			result.add(dicoTerms.getTerm());
			}
		
		return  result;
	}
	
	
	@Override
	public Map<String, List<String>> findThesaurusPairs(String id) {
		Aggregation agg = newAggregation(
				match(Criteria.where("_id").is(id)),
				project("pairs"),
			    unwind("pairs"),
			    group("pairs.generic").push("pairs.extension").as("extensions"),
			    project("_id","extensions").and("_id").as("generic"));
		Query query = new Query(new Criteria().is(id));
		query.fields().include("terms").exclude("_id");
		LinkedHashMap<String, List<String>> result = new LinkedHashMap<String, List<String>>();
		AggregationResults<ThesaurusPairs> resultTemp =  mongoTemplate.aggregate(agg, "semantic_resources", ThesaurusPairs.class);
		for (ThesaurusPairs thesauPair : resultTemp) {
			result.put(thesauPair.getGeneric(), thesauPair.getExtensions());
			}
		
		return  result;
	}

	
	@Override
	public Optional<MongoSemantic> createThesaurus(String name, List<ThesaurusPair> pairs) {
		MongoSemantic mongoSemantic = new MongoSemantic();
		mongoSemantic.setResourceName(name);
		mongoSemantic.setResourceType("thesaurus");
		mongoSemantic.setPairs(pairs);
		MongoSemantic result = mongoTemplate.insert(mongoSemantic, "semantic_resources");
		return Optional.of(result);
	}
	
	
	@Override
	public Optional<MongoSemantic> createDictionary(String name, List<String> terms) {
		MongoSemantic mongoSemantic = new MongoSemantic();
		mongoSemantic.setResourceName(name);
		mongoSemantic.setResourceType("dictionary");
		mongoSemantic.setTerms(terms);
		
		MongoSemantic result = mongoTemplate.insert(mongoSemantic, "semantic_resources");
		return Optional.of(result);
	}
	
	
	/*@Override
	public Map<String, Integer> getDocumentsTopKw(List<String> ids, String vocabulary, int limit) {
		LinkedHashMap<String, Integer> result = new LinkedHashMap<String, Integer>();

		Aggregation agg = newAggregation(
				match(Criteria.where("_id").in(ids)),
			    unwind("representations"),
			    match(Criteria.where("representations.vocabulary").is(vocabulary)),
			    unwind("representations.data"),
			    project("representations.data.term", "representations.data.freq")
			    .and("representations.data.term").as("term")
			    .and("representations.data.freq").as("freq"),
			    group("term").sum("freq").as("freq"),
			    project("freq").and("$_id").as("term").andExclude("_id"),
			    sort(Sort.Direction.DESC, "freq"),
			    limit(limit)
			);
		
		AggregationResults<TermFrequencyItem> resultTemp =  mongoTemplate.aggregate(agg, "document_profiles", TermFrequencyItem.class);
		for (TermFrequencyItem termFrequencyItem : resultTemp) {
			  result.put(termFrequencyItem.getTerm(),termFrequencyItem.getFreq());
			}
		return result;
	}
	*/
	
	
	
	

}
