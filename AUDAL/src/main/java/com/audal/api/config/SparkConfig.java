package com.audal.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.audal.api.repository.SQLiteQueryRepository;
import com.audal.api.repository.SparkQueryRepository;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
 
import org.apache.commons.io.FileUtils;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaSparkContext;

/*
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.mllib.util.MLUtils;
import org.apache.spark.mllib.clustering.KMeansModel;
import org.apache.spark.mllib.linalg.Vector;
import org.apache.spark.mllib.linalg.Vectors;
*/

@Configuration
public class SparkConfig {
	    @Bean
	    public SparkQueryRepository createSparkeQueryRepository() {
	    	
	    	String url = "jdbc:sqlite:/home/ubuntu/d3l/aura_pmi.db";
	    	
	    	
	    	
	        return new SparkQueryRepository(url);
	    }
	
}
