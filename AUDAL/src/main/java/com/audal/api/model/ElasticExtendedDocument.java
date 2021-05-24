package com.audal.api.model;

import java.util.List;

public class ElasticExtendedDocument extends ElasticDocument {

	private List<String> highlights;
	
	public List<String> getHighlights() {
		return highlights;
	}

	public void setHighlights(List<String> highlights) {
		this.highlights = highlights;
	}
}
