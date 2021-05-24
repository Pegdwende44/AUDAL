package com.audal.api.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

//Elastic search annotation.
@Document(indexName= "table_index", type= "_doc")
public class ElasticTable {

	
	@Id
	private String id;
	
	private String identifier;

	//private float score;
	
	
	
	/*public float getScore() {
		return score;
	}

	public void setScore(float f) {
		this.score = f;
	}
*/
	/*public String getId() {
		return id;
	}*/

	public void setId(String id) {
		this.id = id;
	}

	public String getIdentifier() {
		return identifier;
	}

	public void setIdentifier(String identifier) {
		this.identifier = identifier;
	}
	
	
	
	
}
