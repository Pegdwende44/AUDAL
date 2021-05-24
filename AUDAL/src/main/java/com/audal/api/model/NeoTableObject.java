package com.audal.api.model;

import java.util.Date;

import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.typeconversion.Convert;
import org.neo4j.ogm.annotation.typeconversion.DateLong;
import org.neo4j.ogm.annotation.typeconversion.DateString;
import com.audal.api.misc.myDateConverter;

@NodeEntity(label="Table")
public class NeoTableObject extends NeoObject{
	
	private Integer nbRow;
	
	private Integer nbCol;

	public Integer getNbRow() {
		return nbRow;
	}

	public void setNbRow(Integer nbRow) {
		this.nbRow = nbRow;
	}

	public Integer getNbCol() {
		return nbCol;
	}

	public void setNbCol(Integer nbCol) {
		this.nbCol = nbCol;
	}

	
	
	
}
