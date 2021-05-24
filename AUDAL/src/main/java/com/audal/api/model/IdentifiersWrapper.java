package com.audal.api.model;

import java.util.List;

public class IdentifiersWrapper {
	 
	List<String> identifiers;

	public List<String> getIdentifiers() {
		return identifiers;
	}

	public void setIdentifiers(List<String> identifiers) {
		this.identifiers = identifiers;
	}
	 
	public boolean isEmpty() {
		return identifiers.isEmpty();
	}
	 
	public List<String> getIds(){
		return identifiers;
	}
}
