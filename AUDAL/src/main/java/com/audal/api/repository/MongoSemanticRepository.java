package com.audal.api.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.audal.api.model.MongoSemantic;

@Repository
public interface MongoSemanticRepository extends MongoRepository<MongoSemantic, String>, MongoSemanticRepositoryCustom{
	
	
}
