package com.audal.api.repository;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.Fields;

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

import com.audal.api.model.DimValueItem;
import com.audal.api.model.TermFrequencyItem;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;




public class MongoDocumentRepositoryCustomImpl implements MongoDocumentRepositoryCustom{

	@Autowired
	MongoTemplate mongoTemplate;
	
	
	

	@Override
	public Map<String, Double> getDocumentsTopKw(List<String> ids, String vocabulary, int limit) {
		LinkedHashMap<String, Double> result = new LinkedHashMap<String, Double>();
		Aggregation agg;
		if(ids.contains("all")) {
			agg = newAggregation(
				    unwind("representations"),
				    match(Criteria.where("representations.vocabulary").is(vocabulary).andOperator(Criteria.where("representations.format").is("key-values"))),
				    unwind("representations.data"),
				    project("representations.data.term", "representations.data.freq")
				    .and("representations.data.term").as("term")
				    .and("representations.data.freq").as("freq"),
				    group("term").sum("freq").as("freq"),
				    project("freq").and("$_id").as("term").andExclude("_id"),
				    sort(Sort.Direction.DESC, "freq"),
				    limit(limit)
				);
		}else {
			agg = newAggregation(
					match(Criteria.where("_id").in(ids)),
				    unwind("representations"),
				    match(Criteria.where("representations.vocabulary").is(vocabulary).andOperator(Criteria.where("representations.format").is("key-values"))),
				    unwind("representations.data"),
				    project("representations.data.term", "representations.data.freq")
				    .and("representations.data.term").as("term")
				    .and("representations.data.freq").as("freq"),
				    group("term").sum("freq").as("freq"),
				    project("freq").and("$_id").as("term").andExclude("_id"),
				    sort(Sort.Direction.DESC, "freq"),
				    limit(limit)
				);
		}
		 
		int nbDocs = ids.size();
		AggregationResults<TermFrequencyItem> resultTemp =  mongoTemplate.aggregate(agg, "document_profiles", TermFrequencyItem.class);
		for (TermFrequencyItem termFrequencyItem : resultTemp) {
			  result.put(termFrequencyItem.getTerm(),termFrequencyItem.getFreq()/nbDocs);
			}
		return result;
	}
	
	
	@Override
	public Map<String, Double> getDocumentsFreqKw(List<String> ids, List<String> terms, String vocabulary) {
		LinkedHashMap<String, Double> result = new LinkedHashMap<String, Double>();

		Aggregation agg = newAggregation(
				match(Criteria.where("_id").in(ids)),
			    unwind("representations"),
			    match(Criteria.where("representations.vocabulary").is(vocabulary).andOperator(Criteria.where("representations.format").is("key-values"))),
			    unwind("representations.data"),
			    match(Criteria.where("representations.data.term").in(terms)),
			    project("representations.data.term", "representations.data.freq")
			    .and("representations.data.term").as("term")
			    .and("representations.data.freq").as("freq"),
			    group("term").sum("freq").as("freq"),
			    project("freq").and("$_id").as("term").andExclude("_id"),
			    sort(Sort.Direction.DESC, "freq")
			);
		int nbDocs = ids.size();
		AggregationResults<TermFrequencyItem> resultTemp =  mongoTemplate.aggregate(agg, "document_profiles", TermFrequencyItem.class);
		for (TermFrequencyItem termFrequencyItem : resultTemp) {
			  result.put(termFrequencyItem.getTerm(),termFrequencyItem.getFreq()/nbDocs);
			}
		return result;
	}
	
	
	
	
	@Override
	public Map<String, Double> getDocumentsEmbedding(List<String> ids, String vocabulary) {
		LinkedHashMap<String, Double> result = new LinkedHashMap<String, Double>();

		Aggregation agg = newAggregation(
				match(Criteria.where("_id").in(ids)),
			    unwind("representations"),
			    match(Criteria.where("representations.vocabulary").is(vocabulary).andOperator(Criteria.where("representations.format").is("embedding"))),
			    unwind("representations.data"),
			    project("representations.data.dim", "representations.data.value")
			    .and("representations.data.dim").as("dim")
			    .and("representations.data.value").as("val"),
			    group("dim").avg("val").as("val"),
			    project("val").and("$_id").as("dim").andExclude("_id"),
			    sort(Sort.Direction.ASC, "dim")
			);
		
		AggregationResults<DimValueItem> resultTemp =  mongoTemplate.aggregate(agg, "document_profiles", DimValueItem.class);
		for (DimValueItem dimValueItem : resultTemp) {
			  result.put(dimValueItem.getDim(),dimValueItem.getVal());
			  
			}
		return result;
	}
	
	
	

}
