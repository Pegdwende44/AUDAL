package com.audal.api.model;

import java.util.List;

import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Relationship;
import org.springframework.data.annotation.Id;

@NodeEntity(label="Group")
public class NeoGroup {
	 @Id
	 private Long id;
	 
	 private String name;
	 
	
	/*public Long getId() {
		return id;
	}*/

	public String getName() {
		return name;
	}

	
	public void setId(Long id) {
		this.id = id;
	}

	public void setName(String name) {
		this.name = name;
	}


	/*
	@Relationship(type="CLASSIFIED", direction=Relationship.INCOMING)
	private List<String> neoDocuments;
	
	public List<String> getNeoDocuments() {
		return neoDocuments;
	}

	public void setNeoDocuments(List<String> neoDocuments) {
		this.neoDocuments = neoDocuments;
	}
	*/
	
	
}
