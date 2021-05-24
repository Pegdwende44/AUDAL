package com.audal.api.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.audal.api.misc.Centroid;
import com.audal.api.misc.Record;
import com.audal.api.repository.NeoTableObjectRepository;
import com.audal.api.repository.SQLiteQueryRepository;

import com.audal.api.repository.SparkQueryRepository;
import com.audal.api.repository.NeoDocumentObjectRepository.KeyValue;

@RestController
@RequestMapping("/tables")
public class TablesAnalysisController {

	// Repository
	private SQLiteQueryRepository sqliteQueryRepository;
	
	private SparkQueryRepository sparkQueryRepository;

	private NeoTableObjectRepository neoTableObjectRepository;
	
	
	@Autowired
	public void setNeoTableObjectRepository(NeoTableObjectRepository neoTableObjectRepository) {
		this.neoTableObjectRepository = neoTableObjectRepository;
	}
	
	@Autowired
	public void setSqliteQueryRepository(SQLiteQueryRepository sqliteQueryRepository) {
		this.sqliteQueryRepository = sqliteQueryRepository;
	}

	@Autowired
	public void setSparkQueryRepository(SparkQueryRepository sparkQueryRepository) {
		this.sparkQueryRepository = sparkQueryRepository;
	}





	// Method to return the result of a select query on a unique table
	@GetMapping("/simpleQuery")
	public ResponseEntity<Collection<Object>> executeSimpleQuery(
			@RequestParam(name = "q", required = true) String query) {
		System.out.println(query);
		Collection<Object> result = sqliteQueryRepository.simpleQuery(query);
		if(result != null) {
			return new ResponseEntity<Collection<Object>>(result, HttpStatus.OK);
		}else {
			return new ResponseEntity<Collection<Object>>(HttpStatus.NOT_FOUND);
		}
		
		
	}
	
	
	
	
	// Method to return the result of a select query on a unique table
		@GetMapping("/kmeans")
		public ResponseEntity<Map<Map<String,Double>,List<Record>>> executeClustering(
				@RequestParam(name = "q", required = true) String query,
				@RequestParam(name = "k", defaultValue="3") Integer nbClusters,
				@RequestParam(name = "normalize", defaultValue="0") Integer normalize) {
			
			Map<Map<String,Double>,List<Record>> result = null;
				result = sparkQueryRepository.tabKMeans(query, nbClusters, normalize==1);
				if(result != null) {
					return new ResponseEntity<Map<Map<String,Double>,List<Record>>>(result, HttpStatus.OK);
				}else {
					return new ResponseEntity<Map<Map<String,Double>,List<Record>>>(HttpStatus.NOT_FOUND);
				}
			
			
			
			
		}
	
	
		// Method to return the result of a select query on a unique table
				@GetMapping("/pca")
				public ResponseEntity<List<Record>> executePCA(
						@RequestParam(name = "q", required = true) String query,
						@RequestParam(name = "n", defaultValue="3") Integer nbComponents,
						@RequestParam(name = "normalize", defaultValue="0") Integer normalize
						) {
						
					
					List<Record> result = null;
					result = sparkQueryRepository.tabPCA(query, nbComponents, normalize==1);
					if(result != null) {
						return new ResponseEntity<List<Record>>(result, HttpStatus.OK);
					}else {
						return new ResponseEntity<List<Record>>(HttpStatus.NOT_FOUND);
					}
						
					
					
				}
	
			
				
				// Method to return a a document file as Resource
				@GetMapping("/tableContent")
				public ResponseEntity<Resource> getTableContent(
						@RequestParam(name = "id", required = true) String id)  {
						String path = neoTableObjectRepository.identifierToPath(id);
						try {
							File file = new File(path);
							Path filepath = Paths.get(file.getAbsolutePath());
							Resource resource = new UrlResource(filepath.toUri());

					
						
							return  ResponseEntity.ok()
									.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
						            .contentLength(file.length())
						            .contentType(MediaType.APPLICATION_OCTET_STREAM)
						            
						            .body(resource);
						}catch(IOException e) {
							e.printStackTrace();
							System.out.println("NOT_FOUND");
							return new ResponseEntity<Resource>(HttpStatus.NOT_FOUND);
						}
				}
				
	

}
