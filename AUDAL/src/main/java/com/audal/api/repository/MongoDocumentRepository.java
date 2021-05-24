package com.audal.api.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.neo4j.annotation.Query;
import org.springframework.stereotype.Repository;

import com.audal.api.model.MongoDocument;

@Repository
public interface MongoDocumentRepository extends MongoRepository<MongoDocument, String>, MongoDocumentRepositoryCustom{
	
	
}
