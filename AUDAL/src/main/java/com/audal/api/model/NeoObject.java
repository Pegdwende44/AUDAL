package com.audal.api.model;

import org.neo4j.ogm.annotation.NodeEntity;
import org.springframework.data.annotation.Id;

@NodeEntity(label="Object")
public class NeoObject {

	 @Id
	 private Long id;
	 
	 private String identifier;
	
	 private String title;

	/*public Long getId() {
		return id;
	}*/

	public void setId(Long id) {
		this.id = id;
	}

	public String getIdentifier() {
		return identifier;
	}

	public void setIdentifier(String identifier) {
		this.identifier = identifier;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}
	 
	 
	 
}
