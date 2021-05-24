package com.audal.api.model;

import java.io.Serializable;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection="semantic_resources") 
public class ThesaurusPairs implements Serializable{

	

	@Field("generic")
	private String generic;
	
	@Field("extensions")
	private List<String> extensions;

	
	public String getGeneric() {
		return generic;
	}

	public void setGeneric(String generic) {
		this.generic = generic;
	}

	public List<String> getExtensions() {
		return extensions;
	}

	public void setExtensions(List<String> extensions) {
		this.extensions = extensions;
	}

	
	
	
	
	
	
	
}
