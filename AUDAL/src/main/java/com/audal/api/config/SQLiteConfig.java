package com.audal.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.audal.api.repository.SQLiteQueryRepository;

@Configuration
public class SQLiteConfig {
	    @Bean
	    public SQLiteQueryRepository createSQLiteQueryRepository() {
	    
	    	 String url = "jdbc:sqlite:/home/ubuntu/d3l/aura_pmi.db";
	        return new SQLiteQueryRepository(url);
	    }
	
}
