package com.audal.api.misc;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

import org.neo4j.ogm.typeconversion.AttributeConverter;

public class myDateConverter implements AttributeConverter<Date, LocalDate> {

	@Override
	public LocalDate toGraphProperty(Date value) {
		// TODO Auto-generated method stub
		return LocalDate.from(value.toInstant());
	}

	@Override
	public Date toEntityAttribute(LocalDate value) {
		// TODO Auto-generated method stub
		return Date.from(value.atStartOfDay(ZoneId.systemDefault()).toInstant());
	}

}
