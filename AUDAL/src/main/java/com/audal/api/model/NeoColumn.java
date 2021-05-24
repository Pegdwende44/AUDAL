package com.audal.api.model;

import java.util.Date;

import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.typeconversion.Convert;
import org.neo4j.ogm.annotation.typeconversion.DateLong;
import org.neo4j.ogm.annotation.typeconversion.DateString;
import com.audal.api.misc.myDateConverter;

@NodeEntity(label="Column")
public class NeoColumn{
	
	private String name;
	
	private String type;
	
	
	private Double uniqueness;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Double getUniqueness() {
		return uniqueness;
	}

	public void setUniqueness(Double uniqueness) {
		this.uniqueness = uniqueness;
	}

	
	
	
}
