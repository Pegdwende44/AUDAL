package com.audal.api.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

//Elastic search annotation.
@Document(indexName= "document_index", type= "_doc")
public class ElasticDocument {

	
	@Id
	private String id;
	
	private String identifier;

	
	/*public String getId() {
		return id;
	}*/

	public void setId(String id) {
		this.id = id;
	}

	public String getIdentifier() {
		return identifier;
	}

	public void setIdentifier(String identifier) {
		this.identifier = identifier;
	}
	
	
	
	
}
