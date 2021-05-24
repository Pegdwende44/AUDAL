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
public class ElasticDocumentRepositoryCustomImpl implements ElasticDocumentRepositoryCustom {

	@Autowired
	ElasticsearchTemplate elasticTemplate;

	
	
	
	@Override
	public String findDocContent(String id) {

		org.elasticsearch.index.query.QueryBuilder query = org.elasticsearch.index.query.QueryBuilders
				.termsQuery("identifier", id);
		

		SearchQuery searchQuery = new NativeSearchQueryBuilder().withFields("content").withIndices("document_index")
				.withFilter(query).withQuery(query).build();

		List<String> contents = elasticTemplate.query(searchQuery, new ResultsExtractor<List<String>>() {

			@Override
			public List<String> extract(SearchResponse response) {

				long totalHits = response.getHits().totalHits; // totalHits();
				//long totalHits = response.getHits().getTotalHits().value;
				
				List<String> res = new ArrayList<String>();
				for (SearchHit hit : response.getHits()) {
					if (hit != null) {
						res.add((String) hit.getSourceAsMap().get("content"));
						
					}
				}
				return res;
			}
		});
		if(contents.size() > 0) {
			return contents.get(0);
		}else {
			return null;
		}
		
	}

	
	
	
	
	
	
	
	
	@Override
	public List<String> filterDocsByMatchingTerms(Collection<String> ids, Collection<String> matchingTerms, Pageable paging,
			boolean strict, boolean fuzzy) {
		org.elasticsearch.index.query.QueryBuilder query1;

		if (strict) {//Match all
			if(fuzzy) {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("content", matchingTerms).
						fuzziness(Fuzziness.ONE).boost(1.0f).prefixLength(0).operator(Operator.AND);//				.operator(Operator.AND);
			}else {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("content", matchingTerms)
						.operator(Operator.AND);
			}
			
		} else {//Match any
			if(fuzzy) {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("content", matchingTerms).
						fuzziness(Fuzziness.ONE).boost(1.0f).prefixLength(0).operator(Operator.OR);//		
			}else {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("content", matchingTerms)
						.operator(Operator.OR);
			}
			
		}

		org.elasticsearch.index.query.QueryBuilder query2 = org.elasticsearch.index.query.QueryBuilders
				.termsQuery("identifier", ids);
		

		SearchQuery searchQuery = new NativeSearchQueryBuilder().withFields("identifier").withIndices("document_index")
				.withFilter(query2).withQuery(query1).withSort(SortBuilders.scoreSort().order(SortOrder.DESC))
				.withPageable(paging).build();

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

	
	
	
	
	
	
	@Override
	public List<String> findDocsByMatchingTerms(Collection<String> matchingTerms, Pageable paging, boolean strict, boolean fuzzy) {
		org.elasticsearch.index.query.QueryBuilder query1;
		if (strict) {//Match all
			if(fuzzy) {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("content", matchingTerms).
						fuzziness(Fuzziness.ONE).boost(1.0f).prefixLength(0).operator(Operator.AND);//				.operator(Operator.AND);
			}else {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("content", matchingTerms)
						.operator(Operator.AND);
			}
		} else {//Match any
			if(fuzzy) {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("content", matchingTerms).
						fuzziness(Fuzziness.ONE).boost(1.0f).prefixLength(0).operator(Operator.OR);//		
			}else {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("content", matchingTerms)
						.operator(Operator.OR);
			}
			
		}

		SearchQuery searchQuery = new NativeSearchQueryBuilder().withQuery(query1).withIndices("document_index")
				.withSort(SortBuilders.scoreSort().order(SortOrder.DESC)).withPageable(paging).build();
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

	
	
	@Override
	public List<String> findDocsByUnMatchingTerms(Collection<String> negTerms, Pageable paging, boolean strict, boolean fuzzy) {
		
		org.elasticsearch.index.query.QueryBuilder query1;
		if (strict) {//Match all
			if(fuzzy) {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("content", negTerms).
						fuzziness(Fuzziness.ONE).boost(1.0f).prefixLength(0).operator(Operator.AND);//				.operator(Operator.AND);
			}else {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("content", negTerms)
						.operator(Operator.AND);
			}
			
		} else {//Match any
			if(fuzzy) {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("content", negTerms).
						fuzziness(Fuzziness.ONE).boost(1.0f).prefixLength(0).operator(Operator.OR);//		
			}else {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("content", negTerms)
						.operator(Operator.OR);
			}
			
		}
		org.elasticsearch.index.query.QueryBuilder query = org.elasticsearch.index.query.QueryBuilders.boolQuery()
				.mustNot(query1);

		SearchQuery searchQuery = new NativeSearchQueryBuilder().withQuery(query).withIndices("document_index")
				.withSort(SortBuilders.scoreSort().order(SortOrder.DESC)).withPageable(paging).build();
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

	
	
	
	
	
	
	
	
	@Override
	public List<String> filterDocsByUnMatchingTerms(Collection<String> ids, Collection<String> negTerms, Pageable paging,
			boolean strict, boolean fuzzy) {
		org.elasticsearch.index.query.QueryBuilder query1;
		if (strict) {//Match all
			if(fuzzy) {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("content", negTerms).
						fuzziness(Fuzziness.ONE).boost(1.0f).prefixLength(0).operator(Operator.AND);
			}else {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("content", negTerms)
						.operator(Operator.AND);
			}
			
		} else {//Match any
			if(fuzzy) {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("content", negTerms).
						fuzziness(Fuzziness.ONE).boost(1.0f).prefixLength(0).operator(Operator.OR);//		
			}else {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("content", negTerms)
						.operator(Operator.OR);
			}
			
		}
		org.elasticsearch.index.query.QueryBuilder query2 = org.elasticsearch.index.query.QueryBuilders
				.termsQuery("identifier", ids);
		org.elasticsearch.index.query.QueryBuilder query = org.elasticsearch.index.query.QueryBuilders.boolQuery()
				.mustNot(query1).filter(query2);

		SearchQuery searchQuery = new NativeSearchQueryBuilder().withQuery(query).withIndices("document_index")
				.withSort(SortBuilders.scoreSort().order(SortOrder.DESC)).withPageable(paging).build();
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
	
	
	
	
	
	
	
	
	
	
	
	
	@Override
	public Iterable<ElasticExtendedDocument> findDocsHighlightsByMatchingTerms(List<String> matchingTerms,
			Pageable paging, boolean strict, int fragmentSize, int fragmentNumber, boolean fuzzy) {
		org.elasticsearch.index.query.QueryBuilder query1;
		
		if (strict) {//Match all
			if(fuzzy) {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("content", matchingTerms).
						fuzziness(Fuzziness.ONE).boost(1.0f).prefixLength(0).operator(Operator.AND);//				.operator(Operator.AND);
			}else {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("content", matchingTerms)
						.operator(Operator.AND);
			}
		} else {//Match any
			if(fuzzy) {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("content", matchingTerms).
						fuzziness(Fuzziness.ONE).boost(1.0f).prefixLength(0).operator(Operator.OR);//		
			}else {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("content", matchingTerms)
						.operator(Operator.OR);
			}
		}
		BoolQueryBuilder query = org.elasticsearch.index.query.QueryBuilders.boolQuery()
				.must(query1);
		
		SearchQuery searchQuery = new NativeSearchQueryBuilder().withIndices("document_index")
				//.withQuery(query)
				.withSort(SortBuilders.scoreSort().order(SortOrder.DESC))
				.withHighlightFields(new HighlightBuilder.Field("content").preTags("<em>").postTags("</em>")
						.numOfFragments(fragmentNumber).fragmentSize(fragmentSize).highlightQuery(query).requireFieldMatch(true))
				.withPageable(paging).build();
		List<ElasticExtendedDocument> docs = elasticTemplate.query(searchQuery,
				new ResultsExtractor<List<ElasticExtendedDocument>>() {

					@Override
					public List<ElasticExtendedDocument> extract(SearchResponse response) {

						long totalHits = response.getHits().totalHits; // totalHits();
						//long totalHits = response.getHits().getTotalHits().value;
						System.out.print("HITS "+totalHits);
						List<ElasticExtendedDocument> res = new ArrayList<ElasticExtendedDocument>();

						for (SearchHit hit : response.getHits()) {
							if (hit != null) {
								ElasticExtendedDocument doc = new ElasticExtendedDocument();// Init a new doc
								doc.setId(hit.getId());// Set Id
								doc.setIdentifier((String) hit.getSourceAsMap().get("identifier"));
								//doc.setScore(hit.getScore());
								
								HighlightField highlightField = hit.getHighlightFields().get("content");
								if (highlightField != null) {
									List<String> highlights = new ArrayList<String>();
									Text[] fragments = highlightField.fragments();
									for (Text text : fragments) {
										highlights.add(text.string());
									}
									doc.setHighlights(highlights);
									res.add(doc);
								}
								

							}

						}
						return res;
					}
				});

		return docs;
	}

	@Override
	public Iterable<ElasticExtendedDocument> filterDocsHighlightsByMatchingTerms(Collection<String> ids,
			Collection<String> matchingTerms, Pageable paging, boolean strict, int fragmentSize,int fragmentNumber, boolean fuzzy) {
		org.elasticsearch.index.query.QueryBuilder query1;
		if (strict) {//Match all
			if(fuzzy) {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("content", matchingTerms).
						fuzziness(Fuzziness.ONE).boost(1.0f).prefixLength(0).operator(Operator.AND);//				.operator(Operator.AND);
			}else {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("content", matchingTerms)
						.operator(Operator.AND);
			}
		} else {//Match any
			if(fuzzy) {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("content", matchingTerms).
						fuzziness(Fuzziness.ONE).boost(1.0f).prefixLength(0).operator(Operator.OR);//		
			}else {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("content", matchingTerms)
						.operator(Operator.OR);
			}
		}
		org.elasticsearch.index.query.QueryBuilder query2 = org.elasticsearch.index.query.QueryBuilders
				.termsQuery("identifier", ids);
		SearchQuery searchQuery = new NativeSearchQueryBuilder()
				.withQuery(query1).withFilter(query2).withIndices("document_index")
				.withSort(SortBuilders.scoreSort().order(SortOrder.DESC))
				.withHighlightFields(new HighlightBuilder.Field("content").preTags("<em>").postTags("</em>")
						.numOfFragments(fragmentNumber).fragmentSize(fragmentSize))
				.withPageable(paging).build();

		List<ElasticExtendedDocument> docs = elasticTemplate.query(searchQuery,
				new ResultsExtractor<List<ElasticExtendedDocument>>() {

					@Override
					public List<ElasticExtendedDocument> extract(SearchResponse response) {

						long totalHits = response.getHits().totalHits; // totalHits();
						//long totalHits = response.getHits().getTotalHits().value;
						List<ElasticExtendedDocument> res = new ArrayList<ElasticExtendedDocument>();

						for (SearchHit hit : response.getHits()) {
							if (hit != null) {
								ElasticExtendedDocument doc = new ElasticExtendedDocument();// Init a new doc
								doc.setId(hit.getId());// Set Id
								doc.setIdentifier((String) hit.getSourceAsMap().get("identifier"));
								//doc.setScore(hit.getScore());
								List<String> highlights = new ArrayList<String>();
								HighlightField highlightField = hit.getHighlightFields().get("content");
								if (highlightField != null) {
									Text[] fragments = highlightField.fragments();
									for (Text text : fragments) {
										highlights.add(text.string());
									}
									doc.setHighlights(highlights);
									res.add(doc);
								}
								

							}

						}
						return res;
					}
				});

		return docs;
	}



	
	@Override
	public HashMap<String, Double> filterDocsScores(Collection<String> ids,
			Collection<String> matchingTerms, Pageable paging, boolean fuzzy) {
		org.elasticsearch.index.query.QueryBuilder query1;
		//Match any
			if(fuzzy) {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("content", matchingTerms).
						fuzziness(Fuzziness.ONE).boost(1.0f).prefixLength(0).operator(Operator.OR);//		
			}else {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("content", matchingTerms)
						.operator(Operator.OR);
			}
		
		org.elasticsearch.index.query.QueryBuilder query2 = org.elasticsearch.index.query.QueryBuilders
				.termsQuery("identifier", ids);
		SearchQuery searchQuery = new NativeSearchQueryBuilder().withQuery(query1)
				.withFilter(query2).withIndices("document_index")
				.withSort(SortBuilders.scoreSort().order(SortOrder.DESC))
				.withPageable(paging).build();
		
		HashMap<String, Double> result = new HashMap<String, Double>();
		
		elasticTemplate.query(searchQuery,
				new ResultsExtractor<List<ElasticDocument>>() {
					@Override
					public List<ElasticDocument> extract(SearchResponse response) {

						long totalHits = response.getHits().totalHits; // totalHits();
						//long totalHits = response.getHits().getTotalHits().value;
						
						for (SearchHit hit : response.getHits()) {
							if (hit != null) {
				
								String identifier = (String) hit.getSourceAsMap().get("identifier");	
								if(identifier != null) {
									result.put(identifier, (double) hit.getScore());
								}
								
							}

						}
						return null;
					}
				});

		return result;
	}
	
	@Override
	public HashMap<String, Double> findDocsScores(Collection<String> matchingTerms, Pageable paging, boolean fuzzy) {
		org.elasticsearch.index.query.QueryBuilder query1;
		//Match any
			if(fuzzy) {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("content", matchingTerms).
						fuzziness(Fuzziness.ONE).boost(1.0f).prefixLength(0).operator(Operator.OR);//		
			}else {
				query1 = org.elasticsearch.index.query.QueryBuilders.matchQuery("content", matchingTerms)
						.operator(Operator.OR);
			}
		
		
		SearchQuery searchQuery = new NativeSearchQueryBuilder().withQuery(query1).withIndices("document_index")
				.withSort(SortBuilders.scoreSort().order(SortOrder.DESC))
				.withPageable(paging).build();
		
		HashMap<String, Double> result = new HashMap<String, Double>();
		
		elasticTemplate.query(searchQuery,
				new ResultsExtractor<List<ElasticDocument>>() {
					@Override
					public List<ElasticDocument> extract(SearchResponse response) {

						long totalHits = response.getHits().totalHits; // totalHits();
						//long totalHits = response.getHits().getTotalHits().value;
						
						for (SearchHit hit : response.getHits()) {
							if (hit != null) {
				
								String identifier = (String) hit.getSourceAsMap().get("identifier");	
								if(identifier !=null) {
									result.put(identifier, (double) hit.getScore());
								}
							}

						}
						return null;
					}
				});

		return result;
	}
	
	}
