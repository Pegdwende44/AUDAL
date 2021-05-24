package com.audal.api.model;

import java.util.List;

import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Relationship;
import org.springframework.data.annotation.Id;

@NodeEntity(label="Grouping")
public class NeoGrouping {

	
	 @Id
	 private Long id;
	 
	 private String name;
	 
	 @Relationship(type="MEMBER", direction=Relationship.INCOMING)
	 private List<NeoGroup> groups;

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

	 public List<NeoGroup> getGroups() {
			return groups;
		}
	 
	 public void setGroups(List<NeoGroup> neoGroups) {
			this.groups = neoGroups;
		}

}
