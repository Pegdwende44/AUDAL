package com.audal.api.repository;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.audal.api.model.ElasticTable;


public interface ElasticTableRepositoryCustom {





	

	Collection<String> findTabsByMatchingTerms(Collection<String> matchingTerms, Pageable paging, boolean strict, boolean fuzzy);

	
	
	
	Collection<String> findTabsByUnMatchingTerms(Collection<String> negTerms, Pageable paging, boolean strict, boolean fuzzy);
	
	
	
}
