package com.audal.api.repository;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.audal.api.model.ElasticDocument;
import com.audal.api.model.ElasticExtendedDocument;

public interface ElasticDocumentRepositoryCustom {





	List<String> filterDocsByMatchingTerms(Collection<String> resultGroupings, Collection<String> matchingTerms, Pageable paging,
			boolean strict, boolean fuzzy);

	List<String> findDocsByMatchingTerms(Collection<String> matchingTerms, Pageable paging, boolean strict, boolean fuzzy);

	
	
	
	List<String> findDocsByUnMatchingTerms(Collection<String> negTerms, Pageable paging, boolean strict, boolean fuzzy);
	
	List<String> filterDocsByUnMatchingTerms(Collection<String> ids, Collection<String> negTerms, Pageable paging, boolean strict, boolean fuzzy);
	
	

	Iterable<ElasticExtendedDocument> findDocsHighlightsByMatchingTerms(List<String> matchingTerms, Pageable paging,
			boolean strict, int fragmentSize, int fragmentNumber, boolean fuzzy);

	Iterable<ElasticExtendedDocument> filterDocsHighlightsByMatchingTerms(Collection<String> ids, Collection<String> matchingTerms,
			Pageable paging, boolean strict, int fragmentSize, int fragmentNumber, boolean fuzzy);

	HashMap<String, Double> filterDocsScores(Collection<String> ids, Collection<String> matchingTerms, Pageable paging,
			boolean fuzzy);

	HashMap<String, Double> findDocsScores(Collection<String> matchingTerms, Pageable paging, boolean fuzzy);

	String findDocContent(String id);
	
}
