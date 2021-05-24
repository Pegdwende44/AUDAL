package com.audal.api.misc;

import java.util.List;
import java.util.Map;

import org.apache.hadoop.yarn.util.Records;

public class Centroid {
	
	 private Map<String, Double> coordinates;

	 //private List<Record> elements;
	 
	public Centroid(Map<String, Double> coordinates) {
		//super();
		this.coordinates = coordinates;
		
		//this.elements = elements;
	}
	/*
	public Centroid(Map<String, Double> coordinates) {
		//super();
		this.coordinates = coordinates;
		
		
	}*/

	public Map<String, Double> getCoordinates() {
		return coordinates;
	}

	
	
	
	//public List<Record> getElements() {
	//	return elements;
	//}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((coordinates == null) ? 0 : coordinates.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Centroid other = (Centroid) obj;
		if (coordinates == null) {
			if (other.coordinates != null)
				return false;
		} else if (!coordinates.equals(other.coordinates))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Centroid [coordinates=" + coordinates + "]";
	}
	 
	 
	 
}
