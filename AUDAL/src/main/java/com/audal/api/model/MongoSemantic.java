package com.audal.api.model;

import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection="semantic_resources") 
public class MongoSemantic {
	
	@Id
	private String id;
	
	@Field("resource_name")
	private String resourceName;
	
	@Field("resource_type")
	private String resourceType;
	
	@Field("pairs")
	private List<ThesaurusPair> pairs;
	
	@Field("terms")
	private List<String> terms;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getResourceName() {
		return resourceName;
	}

	public void setResourceName(String resourceName) {
		this.resourceName = resourceName;
	}

	public String getResourceType() {
		return resourceType;
	}

	public void setResourceType(String resourceType) {
		this.resourceType = resourceType;
	}

	public void setPairs(List<ThesaurusPair> pairs) {
		this.pairs = pairs;
	}

	public void setTerms(List<String> terms) {
		this.terms = terms;
	}

	

	
	
	

}
