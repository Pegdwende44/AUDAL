package com.audal.api.repository;
import java.sql.DriverManager;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.sql.Column;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Encoder;
import org.apache.spark.sql.Encoders;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;
import org.apache.spark.sql.functions;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.audal.api.misc.*;





public class SQLiteQueryRepository {
	private Connection conn;
	
	
	public SQLiteQueryRepository(String url) {
	       
	        this.conn = null;
	        try {
	        	this.conn = DriverManager.getConnection(url);
	        } catch (SQLException e) {
	            System.out.println(e.getMessage());
	        }
	       
    }
	
	
	private Collection sfResultSetToList(ResultSet rs) throws SQLException{
		  ResultSetMetaData md = rs.getMetaData();
		  int columns = md.getColumnCount();
		  Collection result = new ArrayList();
		  while (rs.next()){
		     HashMap row = new HashMap(columns);
		     for(int i=1; i<=columns; ++i){           
		      row.put(md.getColumnName(i),rs.getObject(i));
		     }
		     result.add(row);
		  }

		 return result;
		}
	
	
	
	 
	public Collection<Object> simpleQuery(String query){
        Collection result = null;
        try (
             Statement stmt  = conn.createStatement();
             ResultSet rs    = stmt.executeQuery(query)){
        	result = sfResultSetToList(rs);
        	
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
		return result;
    }
	
	
	
	
	
	
	
	
	
	
	private  List<Record> sfResultSetToRecords(ResultSet rs) throws SQLException{
		  ResultSetMetaData md = rs.getMetaData();
		  int columns = md.getColumnCount();
		  //Collection liste = new ArrayList();
		  List<Record> records = new ArrayList<Record>();
		  while (rs.next()){
		     HashMap activeFeatures = new HashMap();
		     HashMap descriptiveFeatures = new HashMap();
		     for(int i=1; i<=columns; ++i){
		    	 if((md.getColumnType(i) >= 2 && md.getColumnType(i) <=8) || md.getColumnType(i) == -5) {
		    		 //Filter on numeric columns
		    		 activeFeatures.put(md.getColumnName(i),rs.getDouble(i));  
		    	 }
		    	 else {
		    		 descriptiveFeatures.put(md.getColumnName(i),rs.getObject(i)); 
		    	 }
	    		 
		     }
		     records.add(new Record(activeFeatures, descriptiveFeatures));
		  }
		  
		 return records;
		}
	
	
	
	
	
	
	
	
	/*public Map<Centroid, List<Record>> kMeans(String query, int nbClusters, boolean normalize){
		 List<Record> recordsTemp = null;
		 List<Record> records = null;
		 Map<Centroid, List<Record>> result = null;
        try (
             Statement stmt  = conn.createStatement();
             ResultSet rs    = stmt.executeQuery(query)){
        	recordsTemp = sfResultSetToRecords(rs);
        	records = KMeans.preProcessRecords(recordsTemp, normalize);
        	result = KMeans.fit(records, nbClusters, new EuclideanDistance(), 1000);
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
		return result;
    }
	*/
}
