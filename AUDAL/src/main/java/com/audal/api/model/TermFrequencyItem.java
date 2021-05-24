package com.audal.api.model;

import java.io.Serializable;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="document_profiles") 
public class TermFrequencyItem implements Serializable{

	
	private String term;
	
	private Double freq;

	private String docId;
	
	
	
	
	public String getDocId() {
		return docId;
	}

	public void setDocId(String docId) {
		this.docId = docId;
	}

	public String getTerm() {
		return term;
	}

	public void setTerm(String term) {
		this.term = term;
	}

	public Double getFreq() {
		return freq;
	}

	public void setFreq(Double freq) {
		this.freq = freq;
	}
	
	
	
	
}
