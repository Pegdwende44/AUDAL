package com.audal.api.repository;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import com.audal.api.model.ElasticTable;

@Repository
public interface ElasticTableRepository extends ElasticsearchRepository<ElasticTable, String>, ElasticTableRepositoryCustom {

	

}
