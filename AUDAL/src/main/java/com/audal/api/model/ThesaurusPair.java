package com.audal.api.model;

import java.io.Serializable;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection="semantic_resources") 
public class ThesaurusPair implements Serializable{

	

	@Field("generic")
	private String generic;
	
	@Field("extension")
	private String extension;

	
	public String getGeneric() {
		return generic;
	}

	public void setGeneric(String generic) {
		this.generic = generic;
	}

	public String getExtension() {
		return extension;
	}

	public void setExtension(String extension) {
		this.extension = extension;
	}

	
	
	
	
	
	
	
}
