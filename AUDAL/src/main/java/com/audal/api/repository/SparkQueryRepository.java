package com.audal.api.repository;
import java.sql.DriverManager;
import java.io.BufferedReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Writer;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaDoubleRDD;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.mllib.clustering.KMeans;
import org.apache.spark.mllib.clustering.KMeansModel;
import org.apache.spark.mllib.feature.Normalizer;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.RowFactory;
import org.apache.spark.sql.SparkSession;
import org.apache.spark.sql.types.DataTypes;
import org.apache.spark.sql.types.Metadata;
import org.apache.spark.sql.types.StructField;
import org.apache.spark.sql.types.StructType;
import org.spark_project.dmg.pmml.DataType;

import com.audal.api.misc.Centroid;
import com.audal.api.misc.CosineSimilarity;
import com.audal.api.misc.Record;

import scala.runtime.AbstractFunction2;
import scala.runtime.BoxedUnit;

import org.apache.spark.sql.Dataset;
import org.apache.spark.mllib.linalg.Matrices;
import org.apache.spark.mllib.linalg.Matrix;
//import org.apache.spark.mllib.linalg.Vector;
//import org.apache.spark.mllib.linalg.Vectors;
import org.apache.spark.mllib.linalg.Vector;
import org.apache.spark.mllib.linalg.Vectors;
import org.apache.spark.mllib.linalg.distributed.CoordinateMatrix;
import org.apache.spark.mllib.linalg.distributed.RowMatrix;
import org.apache.spark.mllib.stat.Statistics;
import org.apache.spark.mllib.stat.test.ChiSqTestResult;

//import org.json.JSONObject;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

//import weka.core.Instances;
//import weka.experiment.InstanceQuery;







public class SparkQueryRepository {
	
	private Connection conn;
	
	private SparkConf conf;
	
	private JavaSparkContext sc;
	
	private SparkSession spark;
	
	
			
	public SparkQueryRepository(String url) {
	       
        this.conn = null;
        try {
        	this.conn = DriverManager.getConnection(url);
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
        
      //Spark Configuration
     // hadoop home dir [path to bin folder containing winutils.exe]
       // System.setProperty("hadoop.home.dir", "C:\\Winutils\\");
		//Conf
		conf = new SparkConf().setAppName("SparkApplication").setMaster("local[2]");
		//spark.driver.allowMultipleContexts = true
		//Context
		
		sc = new JavaSparkContext(conf);
		sc.setLogLevel("WARN");
		//Session
		spark = SparkSession
				  .builder()
				  .appName("JTestSpark")
				  .config("spark.driver.allowMultipleContexts", true)
				  .getOrCreate();
		
       
}
	
	public Map<Map<String,Double>, List<Record>> tabKMeans(String query, int numClusters, boolean normalize){
		//List<Centroid> result = new ArrayList<Centroid>();
		Map<Map<String,Double>, List<Record>> result = new HashMap<Map<String,Double>, List<Record>>();
		
		
		
		//Own data
		try (
             Statement stmt  = conn.createStatement();
             ResultSet rs    = stmt.executeQuery(query)){
	        	
			ResultSetMetaData md = rs.getMetaData();
			
			//1- CREATE DATAFRAME
			//Collect columns
		  int nbColumns = md.getColumnCount();
		
		  StructField[] columns = new StructField[nbColumns];
		  Map<String, Integer> numericColumns = new HashMap<String, Integer>();
		  List<String> numericColumnsNames = new ArrayList<String>();
		  Map<String, Integer> stringColumns = new HashMap<String, Integer>();
		  List<String> stringColumnsNames = new ArrayList<String>();
		  for(int i=1; i<=nbColumns; ++i){
			  
			  switch(md.getColumnType(i)) {
			  case -5: 
				  columns[i-1] = new StructField(md.getColumnName(i), DataTypes.IntegerType, false, Metadata.empty());
				  numericColumns.put(md.getColumnName(i), i);
				  numericColumnsNames.add(md.getColumnName(i));
				  break;
			  	case 2: 
			  		columns[i-1] = new StructField(md.getColumnName(i), DataTypes.IntegerType, false, Metadata.empty());
			  		numericColumns.put(md.getColumnName(i), i);
			  		numericColumnsNames.add(md.getColumnName(i));
			  		break;
			  	case 4: 
			  		columns[i-1] = new StructField(md.getColumnName(i), DataTypes.IntegerType, false, Metadata.empty());
			  		numericColumns.put(md.getColumnName(i), i);
			  		numericColumnsNames.add(md.getColumnName(i));
			  		break;
			  	case 6: 
			  		columns[i-1] = new StructField(md.getColumnName(i), DataTypes.DoubleType, false, Metadata.empty());
			  		numericColumns.put(md.getColumnName(i), i);
			  		numericColumnsNames.add(md.getColumnName(i));
			  		break;
			  	case 7: columns[i-1] = new StructField(md.getColumnName(i), DataTypes.DoubleType, false, Metadata.empty());
			  		numericColumns.put(md.getColumnName(i), i);
			  		numericColumnsNames.add(md.getColumnName(i));
			  		break;
			  	case 8: 
			  		columns[i-1] = new StructField(md.getColumnName(i), DataTypes.DoubleType, false, Metadata.empty());
			  		numericColumns.put(md.getColumnName(i), i);
			  		numericColumnsNames.add(md.getColumnName(i));
			  		break;
			  	default: columns[i-1] = new StructField(md.getColumnName(i), DataTypes.StringType, false, Metadata.empty());
			  		stringColumns.put(md.getColumnName(i), i);
			  		stringColumnsNames.add(md.getColumnName(i));
			  }
			   
		  	}
		  StructType schema = new StructType(columns);
		  
		  //Collect lines as Rows
		  
			 
			  //Data
			  List<Row> linesRows = new ArrayList<Row>();
			  List<Map<String, Object>> stringValues = new ArrayList<Map<String, Object>>();
			  List<Map<String, Object>> numericValues2 = new ArrayList<Map<String, Object>>();
			  List<Vector> numericValues = new ArrayList<Vector>();
			  Normalizer normalizer = new Normalizer();
			  while (rs.next()){//For each line
				
			     
			     //Numeric data
			     double[] numericValuesLine = new double[numericColumns.size()];
			     Map<String,Object> numericValuesLine2 = new HashMap<String, Object>();
			     int j=0;
			     for(Entry<String, Integer> entry : numericColumns.entrySet()) {

			    	 Object valueTemp = rs.getObject(entry.getValue()); 
			    	 
			    	 if(valueTemp != null) {
			    		 numericValuesLine[j] = (double) Double.parseDouble(rs.getObject(entry.getValue()).toString());
			    		 numericValuesLine2.put(md.getColumnName(entry.getValue()), rs.getObject(entry.getValue()));
			    	 }else {
			    		 numericValuesLine[j] = 0;
			    	 } 
			    	 j++;
			     }
			    
			     if(normalize) {
			    	 numericValues.add(normalizer.transform(Vectors.dense(numericValuesLine))); 
			     }else {
			    	 numericValues.add(Vectors.dense(numericValuesLine));
			     }
			     
			     numericValues2.add(numericValuesLine2);
			     
			     //String data
			     Map<String,Object> stringValuesLine = new HashMap<String, Object>();
			     for(Entry<String, Integer> entry : stringColumns.entrySet()) {
			    	 stringValuesLine.put(md.getColumnName(entry.getValue()), rs.getObject(entry.getValue()).toString());
			    	 j++;
			     }
			     stringValues.add(stringValuesLine);
			     
			     
			  }
			  
			  //Create Dataframe
			 // Dataset<Row> df = spark.createDataFrame(linesRows, schema);
			  //df.show();
			  
			 
			//2- CREATE DATASET
		
		
			//Create Dataset
		  	JavaRDD<Vector> rows = sc.parallelize(numericValues);
		  	rows.cache();
		  	// Create a RowMatrix from JavaRDD<Vector>.
		  	//RowMatrix mat = new RowMatrix(rows.rdd());
		  	
		  	
			//3- CLUSTERING - KMEANS	
		  	//System.out.println("CLUSTERING...");
			// Cluster the data into two classes using KMeans
			
			int numIterations = 50;
			KMeansModel clusters = KMeans.train(rows.rdd(), numClusters, numIterations, KMeans.K_MEANS_PARALLEL());

			List<Integer> prediction = clusters.predict(rows).collect();
			 //System.out.println(prediction);
			
			 
			int clusterNumber=0;
			for (Vector center: clusters.clusterCenters()) {
				//Make center characteristics
				Map<String,Double> coordinates = new HashMap<String, Double>();
				
				
				double[] centerValues = center.toArray();
				
				for(int i=0;i<numericColumnsNames.size();i++) {
					coordinates.put(numericColumnsNames.get(i), centerValues[i]);
				}
				 
				
				//Get descriptive and active features 
				 List<Record> records = new ArrayList<Record>();
				
				for(int i = 0; i<prediction.size(); i++) {
					Map<String, Object> descriptiveFeatures = null;
					Map<String, Object> activeFeatures = null;
					if(prediction.get(i) == clusterNumber) {
						descriptiveFeatures = stringValues.get(i);
						activeFeatures = numericValues2.get(i);
						Record record = new Record(activeFeatures, descriptiveFeatures);
						records.add(record);
					}
					
				}

			  
			  //Centroid centroid = new Centroid(coordinates);
			  //result.add(centroid);
			  result.put(coordinates, records);
			  clusterNumber++;
			}
			//System.out.println("FINISHED");	
			//sc.close();	
			return result;	
				
	        
	        } catch (SQLException e) {
	            System.out.println(e.getMessage());
	        	return null;
	        }
	
	}
	
	
	
	
	
	
	public List<Record> tabPCA(String query, int n, boolean normalize){
		List<Record> result = new ArrayList<Record>();
		

		//Query to SQLite
		try (
             Statement stmt  = conn.createStatement();
             ResultSet rs    = stmt.executeQuery(query)){
	        	
			ResultSetMetaData md = rs.getMetaData();
			
			//1- CREATE DATAFRAME
			//Collect columns
		  int nbColumns = md.getColumnCount();
		
		  //StructField[] columns = new StructField[nbColumns];
		  Map<String, Integer> numericColumns = new HashMap<String, Integer>();
		  List<String> numericColumnsNames = new ArrayList<String>();
		  Map<String, Integer> stringColumns = new HashMap<String, Integer>();
		  List<String> stringColumnsNames = new ArrayList<String>();
		  for(int i=1; i<=nbColumns; ++i){
			  
			  switch(md.getColumnType(i)) {
			  case -5: 
				  //columns[i-1] = new StructField(md.getColumnName(i), DataTypes.IntegerType, false, Metadata.empty());
				  numericColumns.put(md.getColumnName(i), i);
				  numericColumnsNames.add(md.getColumnName(i));
				  break;
			  	case 2: 
			  		//columns[i-1] = new StructField(md.getColumnName(i), DataTypes.IntegerType, false, Metadata.empty());
			  		numericColumns.put(md.getColumnName(i), i);
			  		numericColumnsNames.add(md.getColumnName(i));
			  		break;
			  	case 4: 
			  		//columns[i-1] = new StructField(md.getColumnName(i), DataTypes.IntegerType, false, Metadata.empty());
			  		numericColumns.put(md.getColumnName(i), i);
			  		numericColumnsNames.add(md.getColumnName(i));
			  		break;
			  	case 6: 
			  		//columns[i-1] = new StructField(md.getColumnName(i), DataTypes.DoubleType, false, Metadata.empty());
			  		numericColumns.put(md.getColumnName(i), i);
			  		numericColumnsNames.add(md.getColumnName(i));
			  		break;
			  	case 7: 
			  		//columns[i-1] = new StructField(md.getColumnName(i), DataTypes.DoubleType, false, Metadata.empty());
			  		numericColumns.put(md.getColumnName(i), i);
			  		numericColumnsNames.add(md.getColumnName(i));
			  		break;
			  	case 8: 
			  		//columns[i-1] = new StructField(md.getColumnName(i), DataTypes.DoubleType, false, Metadata.empty());
			  		numericColumns.put(md.getColumnName(i), i);
			  		numericColumnsNames.add(md.getColumnName(i));
			  		break;
			  	default: 
			  		//columns[i-1] = new StructField(md.getColumnName(i), DataTypes.StringType, false, Metadata.empty());
			  		stringColumns.put(md.getColumnName(i), i);
			  		stringColumnsNames.add(md.getColumnName(i));
			  }
			   
		  	}
		  //StructType schema = new StructType(columns);
		  
		  //Collect lines as Rows
		  
			 
			  //Data
			  List<Row> linesRows = new ArrayList<Row>();
			  List<Map<String, Object>> stringValues = new ArrayList<Map<String, Object>>();
			  List<Vector> numericValues = new ArrayList<Vector>();
			  List<Map<String, Object>> numericValues2 = new ArrayList<Map<String, Object>>();
			  Normalizer normalizer = new Normalizer();
			  
			  while (rs.next()){//For each line
				
			     
			     //Numeric data
			     double[] numericValuesLine = new double[numericColumns.size()];
			     Map<String,Object> numericValuesLine2 = new HashMap<String, Object>();
			     int j=0;
			     for(Entry<String, Integer> entry : numericColumns.entrySet()) {

			    	 Object valueTemp = rs.getObject(entry.getValue()); 
			    	 
			    	 if(valueTemp != null) {
			    		 numericValuesLine[j] = (double) Double.parseDouble(rs.getObject(entry.getValue()).toString());
			    		 numericValuesLine2.put(md.getColumnName(entry.getValue()), rs.getObject(entry.getValue()));
			    	 }else {
			    		 numericValuesLine[j] = 0;
			    	 } 
			    	 j++;
			     }
			     if(normalize) {
			    	 numericValues.add(normalizer.transform(Vectors.dense(numericValuesLine))); 
			     }else {
			    	 numericValues.add(Vectors.dense(numericValuesLine));
			     }
			     numericValues2.add(numericValuesLine2);
			     
			     //String data
			     Map<String,Object> stringValuesLine = new HashMap<String, Object>();
			     for(Entry<String, Integer> entry : stringColumns.entrySet()) {
			    	 stringValuesLine.put(md.getColumnName(entry.getValue()), rs.getObject(entry.getValue()).toString());
			    	 j++;
			     }
			     stringValues.add(stringValuesLine);
			     
			     
			  }
			  
			  
			//2- CREATE DATASET
		
		
			//Create Dataset
		  	JavaRDD<Vector> rows = sc.parallelize(numericValues);
		  	rows.cache();
		  	// Create a RowMatrix from JavaRDD<Vector>.
		  	RowMatrix mat = new RowMatrix(rows.rdd());
		  	
		 // Compute the top 4 principal components.
		 // Principal components are stored in a local dense matrix.
		  	
		  	int nbPrincipalComponents = Math.min(numericColumnsNames.size(), n);
		 Matrix pc = mat.computePrincipalComponents(nbPrincipalComponents);
		
		 // Project the rows to the linear space spanned by the top 4 principal components.
		 RowMatrix projected = mat.multiply(pc);
		 
		 
		 JavaRDD<Vector> resultRDD = projected.rows().toJavaRDD();
		 resultRDD.cache();
		 
		 //Generate records
		 List<Record> records = new ArrayList<Record>();
		 int i=0;
		 for(Vector  line:resultRDD.collect()) {
			
				Map<String, Object> activeFeatures = new HashMap<String, Object>();
				 for(int j=0; j<nbPrincipalComponents; j++) {
					 	activeFeatures.put("comp"+(j+1), line.toArray()[j]);
				 }
				 Map<String, Object> descriptiveFeatures = stringValues.get(i);
				 Record record = new Record(activeFeatures, descriptiveFeatures);
				 result.add(record);
				 i++;
		 }
		 
		 
			//System.out.println("FINISHED");	
			//sc.close();	
			return result;	
				
	        
	        } catch (SQLException e) {
	            System.out.println(e.getMessage());
	        	return null;
	        }
	
	}
	
	
	
	
	
	public Map<String,Object> chisqTest(List<Double> values, int nbRow, int nbCol){
		Map<String,Object> result = new HashMap<String,Object>();
		
		double[] valuesArray = new double[values.size()];
		int i = 0;
		for(Double elt:values) {
			valuesArray[i] = elt.doubleValue();
			i++;
		}
		//Matrix mat = Matrices.dense(4, 3, new double[] { 1.0, 3.0, 5.0, 2.0, 4.0, 6.0, 1.0, 3.5, 6.9, 8.9, 10.5, 5.0 });
		Matrix mat = Matrices.dense(nbRow, nbCol, valuesArray);
		//System.out.println(mat);
		//System.out.println(valuesArray);
		//Indépendance test
		ChiSqTestResult independenceTestResult = Statistics.chiSqTest(mat);
		
		result.put("pvalue", independenceTestResult.pValue());
		result.put("statistic", independenceTestResult.statistic());
		
		return result;

	}
	
	
	
	public Map<String,Object> corrMesure(List<Double> values1, List<Double> values2){
		Map<String,Object> result = new HashMap<String,Object>();
		
		double[] valuesArray1 = new double[values1.size()];
		double[] valuesArray2 = new double[values2.size()];
		
		for(int i=0; i<values1.size(); i++) {
			valuesArray1[i] = values1.get(i);
			valuesArray2[i] = values2.get(i);
			i++;
		}
		
		JavaRDD<Double> rddValues1 = sc.parallelize(values1);
		JavaRDD<Double> rddValues2 = sc.parallelize(values2);
		
		double correlation = Statistics.corr(rddValues1,rddValues2);
		
		
		result.put("correlation", correlation);
		//result.put("statistic", independenceTestResult.statistic());
		
		return result;

	}
	
	 
	

	
	
	
	
	
	
	
	
	
	
	
	public Map<Map<String,Double>, List<Record>> docKMeans(List<Map<String, Double>> embeddings, int numClusters, List<String> labels, List<String> keys){
		//List<Centroid> result = new ArrayList<Centroid>();
		Map<Map<String,Double>, List<Record>> result = new HashMap<Map<String,Double>, List<Record>>();
		
		
		
		//Number of dimensions
		  int nbColumns = embeddings.get(0).size();
		
		 
		  	//List<String> numericColumnsNames = new ArrayList<String>(embeddings.get(0).keySet() ); 
		  
		  //List<String> stringColumnsNames = new ArrayList<String>();
		  
			  //Data
			  //List<Row> linesRows = new ArrayList<Row>();
			  List<Map<String, Object>> listStringFeatures = new ArrayList<Map<String, Object>>();
			  List<Map<String, Object>> listNumericFeatures = new ArrayList<Map<String, Object>>();
			  //List<Map<String, Object>> numericValues2 = new ArrayList<Map<String, Object>>();
			  List<Vector> numericValues = new ArrayList<Vector>();
			  int i=0;
			 for(Map<String, Double> embedding : embeddings){//For each line
			     //Numeric data
				 
			     double[] numericValuesLine = new double[nbColumns];
			    int j=0;
			     Map<String,Object> numbersMap = new HashMap<String, Object>();
			     for(Entry<String, Double> entry : embedding.entrySet()) {

			    	 numericValuesLine[j] = entry.getValue().doubleValue();
			    	 numbersMap.put(entry.getKey(), entry.getValue());
			    	 j++;
			     }    
			    numericValues.add(Vectors.dense(numericValuesLine));
			    listNumericFeatures.add(numbersMap);
			    Map<String,Object> labelsMap = new HashMap<String, Object>();
			    labelsMap.put("label", labels.get(i));
			    listStringFeatures.add(labelsMap);
			    
			    i++;
			 }
			//System.out.println("String features");    
			//System.out.println(listStringFeatures);
			  
			  
			 
			//2- CREATE DATASET
		
		
			//Create Dataset
		  	JavaRDD<Vector> rows = sc.parallelize(numericValues);
		  	rows.cache();
		  	// Create a RowMatrix from JavaRDD<Vector>.
		  	//RowMatrix mat = new RowMatrix(rows.rdd());
		  	
		  	
			//3- CLUSTERING - KMEANS	
		  	//System.out.println("CLUSTERING...");
			// Cluster the data into two classes using KMeans
			
			int numIterations = 50;
			KMeansModel clusters = KMeans.train(rows.rdd(), numClusters, numIterations, KMeans.K_MEANS_PARALLEL());

			List<Integer> prediction = clusters.predict(rows).collect();
			 //System.out.println(prediction);
			
			 
			int clusterNumber=0;
			for (Vector center: clusters.clusterCenters()) {
				//Make center characteristics
				Map<String,Double> coordinates = new HashMap<String, Double>();
				
				
				double[] centerValues = center.toArray();
				//System.out.println("Center values");
				//System.out.println(centerValues);
				for(i=0;i<keys.size();i++) {
					coordinates.put(keys.get(i), centerValues[i]);
				}
				 
				
				//Get descriptive and active features 
				 List<Record> records = new ArrayList<Record>();
				
				for(i = 0; i<prediction.size(); i++) {//For each prediction
					Map<String, Object> descriptiveFeatures = null;
					Map<String, Object> activeFeatures = null;
					if(prediction.get(i) == clusterNumber) {
						descriptiveFeatures = listStringFeatures.get(i);
						activeFeatures = listNumericFeatures.get(i);
						Record record = new Record(activeFeatures, descriptiveFeatures);
						records.add(record);
					}
					
				}

			  
			  //Centroid centroid = new Centroid(coordinates);
			  //result.add(centroid);
			  result.put(coordinates, records);
			  clusterNumber++;
			}
			//System.out.println("FINISHED");	
			//sc.close();	
			return result;	
				
	        
	      
	
	}
	
	
	
	
	
	
	public List<Record>  docPCA(List<Map<String, Double>> embeddings, List<String> labels, List<String> keys){
		//List<Centroid> result = new ArrayList<Centroid>();
		List<Record> result = new ArrayList<Record>();
		
		
		
		//Number of dimensions
		  int nbColumns = keys.size();
		
		 
		  	//List<String> numericColumnsNames = new ArrayList<String>(embeddings.get(0).keySet() ); 
		  
		  //List<String> stringColumnsNames = new ArrayList<String>();
		  
			  //Data
			  //List<Row> linesRows = new ArrayList<Row>();
			  List<Map<String, Object>> listStringFeatures = new ArrayList<Map<String, Object>>();
			  List<Map<String, Object>> listNumericFeatures = new ArrayList<Map<String, Object>>();
			  //List<Map<String, Object>> numericValues2 = new ArrayList<Map<String, Object>>();
			  List<Vector> numericValues = new ArrayList<Vector>();
			  int i=0;
			 for(Map<String, Double> embedding : embeddings){//For each line
			     //Numeric data
				 
			     double[] numericValuesLine = new double[nbColumns];
			    int j=0;
			     Map<String,Object> numbersMap = new HashMap<String, Object>();
			     for(Entry<String, Double> entry : embedding.entrySet()) {

			    	 numericValuesLine[j] = entry.getValue().doubleValue();
			    	 numbersMap.put(entry.getKey(), entry.getValue());
			    	 j++;
			     }    
			    numericValues.add(Vectors.dense(numericValuesLine));
			    listNumericFeatures.add(numbersMap);
			    Map<String,Object> labelsMap = new HashMap<String, Object>();
			    labelsMap.put("label", labels.get(i));
			    listStringFeatures.add(labelsMap);
			    
			    i++;
			 }
			//System.out.println("String features");    
			//System.out.println(listStringFeatures);
			  
			  
			 
			//Create Dataset
			  	JavaRDD<Vector> rows = sc.parallelize(numericValues);
			  	rows.cache();
			  	// Create a RowMatrix from JavaRDD<Vector>.
			  	RowMatrix mat = new RowMatrix(rows.rdd());
			  	
			 // Compute the top 4 principal components.
			 // Principal components are stored in a local dense matrix.
			  	
			  int nbPrincipalComponents = Math.min(nbColumns, 2);
			 Matrix pc = mat.computePrincipalComponents(nbPrincipalComponents);
			
			 // Project the rows to the linear space spanned by the top 4 principal components.
			 RowMatrix projected = mat.multiply(pc);
			 
			 
			 JavaRDD<Vector> resultRDD = projected.rows().toJavaRDD();
			 resultRDD.cache();
			 
			 //Generate records
			 List<Record> records = new ArrayList<Record>();
			 i=0;
			 for(Vector  line:resultRDD.collect()) {
				
					Map<String, Object> activeFeatures = new HashMap<String, Object>();
					 for(int j=0; j<nbPrincipalComponents; j++) {
						 	activeFeatures.put("comp"+(j+1), line.toArray()[j]);
					 }
					 Map<String, Object> descriptiveFeatures = listStringFeatures.get(i);
						//activeFeatures = listNumericFeatures.get(i);
					 Record record = new Record(activeFeatures, descriptiveFeatures);
					 result.add(record);
					 i++;
			 }

			System.out.println("FINISHED");	
			//sc.close();	
			return result;	
				
	        
	      
	
	}
	
	
	
	public Map<String,Object>  docSimilarities(List<Map<String, Double>> embeddings, List<String> labels, List<String> keys){
		//List<Centroid> result = new ArrayList<Centroid>();
			System.out.println(labels);
			System.out.println(keys);
			System.out.println(embeddings.size());

			CosineSimilarity cosineSimilarity = new CosineSimilarity();
			//Number of dimensions
			  int nbColumns = keys.size();
			  List<double[]> numericValues = new ArrayList<double[]>();
			//Data
			  int i;
			  double[] numericValuesLine;
			  for(Map<String, Double> embedding : embeddings){//For each category
				  numericValuesLine = new double[nbColumns];
				  i = 0;
				  for (String key:keys) {//Iterate coordinates
					 
					  numericValuesLine[i] = embedding.get(key);	
					  i++;
				  }
				  numericValues.add(numericValuesLine);
			  }
			   
			
				
			Map<String, Object> result = new HashMap<String, Object>();
			System.out.println("######################");
			
			
			for(int k=0; k<labels.size(); k++) {
				int l=k+1;
				 while( l<labels.size()) {
					 double value = cosineSimilarity.cosineSimilarity(numericValues.get(k), numericValues.get(l));
	
						 result.putIfAbsent(labels.get(k)+'*'+labels.get(l), value);
						 l++;
					 
				 }
				 
			 }
			
			System.out.println("FINISHED");	
			//sc.close();	
			return result;	
	}
	
	
	
	
	
}
