package com.audal.api.repository;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;

import org.apache.lucene.search.Sort;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.common.text.Text;
import org.elasticsearch.common.unit.Fuzziness;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.Operator;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightBuilder;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightField;
import org.elasticsearch.search.sort.SortBuilders;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.core.ResultsExtractor;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.query.SearchQuery;

import com.audal.api.model.ElasticDocument;
import com.audal.api.model.ElasticExtendedDocument;

//@Service
public class ElasticTableRepositoryCustomImpl implements ElasticTableRepositoryCustom {

	@Autowired
	ElasticsearchTemplate elasticTemplate;

	
	
	
	
	

	
	
	

	@Override
	public Collection<String> findTabsByMatchingTerms(Collection<String> matchingTerms, Pageable paging, boolean strict,
			boolean fuzzy) {
		org.elasticsearch.index.query.QueryBuilder query1;
		if (strict) {//Match all
			if(fuzzy) {
				query1 = org.elasticsearch.index.query.QueryBuilders.termsQuery("keywords", matchingTerms);
				//.						fuzziness(Fuzziness.ONE).boost(1.0f).prefixLength(0).operator(Operator.AND);//				.operator(Operator.AND);
			}else {
				query1 = org.elasticsearch.index.query.QueryBuilders.termsQuery("keywords", matchingTerms);
			}
		} else {//Match any
			if(fuzzy) {
				query1 = org.elasticsearch.index.query.QueryBuilders.termsQuery("keywords", matchingTerms);//		
			}else {
				query1 = org.elasticsearch.index.query.QueryBuilders.termsQuery("keywords", matchingTerms);
						//.operator(Operator.OR);
			}
			
		}

		SearchQuery searchQuery = new NativeSearchQueryBuilder().withQuery(query1).withIndices("table_index")
				.withSort(SortBuilders.scoreSort().order(SortOrder.DESC)).withPageable(paging).build();
		List<String> docs = elasticTemplate.query(searchQuery, new ResultsExtractor<List<String>>() {

			@Override
			public List<String> extract(SearchResponse response) {

				 long totalHits = response.getHits().totalHits; // totalHits();
				//long totalHits = response.getHits().getTotalHits().value; // totalHits();
				List<String> res = new ArrayList<String>();
				
				for (SearchHit hit : response.getHits()) {
					if (hit != null) {

						res.add((String) hit.getSourceAsMap().get("identifier"));

					}

				}
				return res;
			}
		});

		return docs;
	}



	@Override
	public Collection<String> findTabsByUnMatchingTerms(Collection<String> negTerms, Pageable paging, boolean strict,
			boolean fuzzy) {
		org.elasticsearch.index.query.QueryBuilder query1;
		if (strict) {//Match all
			if(fuzzy) {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("keywords", negTerms).
						fuzziness(Fuzziness.ONE).boost(1.0f).prefixLength(0).operator(Operator.AND);//				.operator(Operator.AND);
			}else {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("keywords", negTerms)
						.operator(Operator.AND);
			}
		} else {//Match any
			if(fuzzy) {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("keywords", negTerms).
						fuzziness(Fuzziness.ONE).boost(1.0f).prefixLength(0).operator(Operator.OR);//		
			}else {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("keywords", negTerms)
						.operator(Operator.OR);
			}
			
		}

		org.elasticsearch.index.query.QueryBuilder query = org.elasticsearch.index.query.QueryBuilders.boolQuery().mustNot(query1);
		SearchQuery searchQuery = new NativeSearchQueryBuilder().withQuery(query).withIndices("table_index").withPageable(paging).build();

		List<String> docs = elasticTemplate.query(searchQuery, new ResultsExtractor<List<String>>() {

			@Override
			public List<String> extract(SearchResponse response) {

				long totalHits = response.getHits().totalHits; // totalHits();
				//long totalHits = response.getHits().getTotalHits().value;
				
				List<String> res = new ArrayList<String>();

				for (SearchHit hit : response.getHits()) {
					if (hit != null) {
						res.add((String) hit.getSourceAsMap().get("identifier"));
					}
				}
				return res;
			}
		});

		return docs;
	}

	
	
	
	
	
	
	
	
	}
