package com.audal.api.controller;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.audal.api.misc.Record;
import com.audal.api.model.NeoGrouping;
import com.audal.api.repository.NeoDocumentObjectRepository;
import com.audal.api.repository.NeoDocumentObjectRepository.DocProperty;
import com.audal.api.repository.NeoGroupRepository;
import com.audal.api.repository.NeoGroupRepository.GroupCount;
import com.audal.api.repository.NeoGroupingRepository;
import com.audal.api.repository.NeoTableObjectRepository;
import com.audal.api.repository.SparkQueryRepository;



@RestController
@RequestMapping("/global")
public class GlobalController {
	
	
	//Repository
	private NeoGroupRepository neoGroupRepository;
	
	private NeoGroupingRepository neoGroupingRepository;

	private NeoDocumentObjectRepository neoDocumentObjectRepository;
	
	private NeoTableObjectRepository neoTableObjectRepository;
	
	SparkQueryRepository sparkQueryRepository;
	
	
	@Autowired
	public void setSparkQueryRepository2(SparkQueryRepository sparkQueryRepository) {
		this.sparkQueryRepository = sparkQueryRepository;
	}
	
	
	@Autowired
	public void setNeoGroupRepository(NeoGroupRepository neoGroupRepository) {
		this.neoGroupRepository = neoGroupRepository;
	}
	
	@Autowired
	public void setNeoGroupingRepository(NeoGroupingRepository neoGroupingRepository) {
		this.neoGroupingRepository = neoGroupingRepository;
	}
	
	@Autowired
	public void setNeoDocumentObjectRepository(NeoDocumentObjectRepository neoDocumentObjectRepository) {
		this.neoDocumentObjectRepository = neoDocumentObjectRepository;
	}
	
	
	@Autowired
	public void setNeoTableObjectRepository(NeoTableObjectRepository neoTableObjectRepository) {
		this.neoTableObjectRepository = neoTableObjectRepository;
	}
	
	// Method to welcome users and introduce to the analysis part of AUDAL API
	@GetMapping("/")
	public ResponseEntity<String> welcome() {
		String result = "Welcome to the API interface to get the metadata system general organization";
		return new ResponseEntity<String>(result, HttpStatus.OK);

	}
	
	
		//Return list of groupings
			@GetMapping("/groupings")
			public ResponseEntity<Iterable<String>> getGroupings() {
				Iterable<String> liste =  neoGroupingRepository.getNames();
				if(liste!=null) {//Element absent
					System.out.println("FOUND!!!!!!!!!");
					return new ResponseEntity<Iterable<String>>(liste, HttpStatus.OK);
					
				}else {
					System.out.println("NOT FOUND");
					return new ResponseEntity<Iterable<String>>(HttpStatus.NO_CONTENT);
				}
				
			}
			
			
			
			//Return list of tables groupings
			@GetMapping("/tabGroupings")
			public ResponseEntity<Iterable<String>> getTabGroupings() {
				Iterable<String> liste =  neoGroupingRepository.getTabGroupings();
				if(liste!=null) {//Element absent
					System.out.println("FOUND!!!!!!!!!");
					return new ResponseEntity<Iterable<String>>(liste, HttpStatus.OK);
					
				}else {
					System.out.println("NOT FOUND");
					return new ResponseEntity<Iterable<String>>(HttpStatus.NO_CONTENT);
				}
				
			}
			
			
			//Return list of tables groupings
			@GetMapping("/docGroupings")
			public ResponseEntity<Iterable<String>> getDocGroupings() {
				Iterable<String> liste =  neoGroupingRepository.getDocGroupings();
				if(liste!=null) {//Element absent
					System.out.println("FOUND!!!!!!!!!");
					return new ResponseEntity<Iterable<String>>(liste, HttpStatus.OK);
					
				}else {
					System.out.println("NOT FOUND");
					return new ResponseEntity<Iterable<String>>(HttpStatus.NO_CONTENT);
				}
				
			}
	
			
			
			//Return details of a specified grouping
			@GetMapping("/documentsProperties")
			public ResponseEntity<Iterable<DocProperty>> getDocumentsProperties() {
				Collection<DocProperty> liste =  neoDocumentObjectRepository.getDocProperties();
				if(liste != null) {//Element présent
					System.out.println("FOUND!!!!!!!!!");
					return new ResponseEntity<Iterable<DocProperty>>(liste, HttpStatus.OK);
					
				}else {
					System.out.println("NOT FOUND");
					return new ResponseEntity<Iterable<DocProperty>>(HttpStatus.NOT_FOUND);
				}
				
			}
			
			
			//Return details of a specified grouping
			@GetMapping("/tablesProperties")
			public ResponseEntity<Iterable<DocProperty>> getTablesProperties() {
				Collection<DocProperty> liste =  neoTableObjectRepository.getTabProperties();
				if(liste != null) {//Element présent
					System.out.println("FOUND!!!!!!!!!");
					return new ResponseEntity<Iterable<DocProperty>>(liste, HttpStatus.OK);
					
				}else {
					System.out.println("NOT FOUND");
					return new ResponseEntity<Iterable<DocProperty>>(HttpStatus.NOT_FOUND);
				}
				
			}
			
			
			//List of available attributes for document objects 
			@GetMapping("/grouping/{name}")
			public ResponseEntity<Collection<GroupCount>> getGrouping(@PathVariable("name") String name) {
				Collection<GroupCount> resultTemp =  neoGroupRepository.findGroupsCount(name);
				if(resultTemp != null) {//Element présent
					System.out.println("FOUND!!!!!!!!!");
					return new ResponseEntity<Collection<GroupCount>>(resultTemp, HttpStatus.OK);
					
				}else {
					System.out.println("NOT FOUND");
					return new ResponseEntity<Collection<GroupCount>>(HttpStatus.NOT_FOUND);
				}
				
			}
			
			
			
			
			// Method to make chi square test
			@GetMapping("/chisq")
			public ResponseEntity<Map<String, Object>> executeChisqTest(
					@RequestParam(name = "nbRow", required = true) Integer nbRow,
					@RequestParam(name = "nbCol", required = true) Integer nbCol,
					@RequestParam(name = "values", required = true) List<Double> values
					) {
					
				
				Map<String, Object> result = null;
				result = sparkQueryRepository.chisqTest(values, nbRow, nbCol);
				if(result != null) {
					return new ResponseEntity<Map<String, Object>>(result, HttpStatus.OK);
				}else {
					return new ResponseEntity<Map<String, Object>>(HttpStatus.NOT_FOUND);
				}
					
				
				
			}
			
			
			
			// Method to make Correlation calculation
						@GetMapping("/corr")
						public ResponseEntity<Map<String, Object>> executeCorrMeasure(
								@RequestParam(name = "x", required = true) List<String> xValues,
								@RequestParam(name = "y", required = true) List<String> yValues
								) {
							List<Double> xConverted = new ArrayList<Double>();
							List<Double> yConverted = new ArrayList<Double>();
							for(String xItem:xValues) {
								if(xItem != null) {
									xConverted.add(Double.valueOf(xItem));
								}
								
							}
							for(String yItem:yValues) {
								if(yItem != null) {
									yConverted.add(Double.valueOf(yItem));
								}
								
							}	
								
							System.out.println("OKAY");
							Map<String, Object> result = null;
							result = sparkQueryRepository.corrMesure(xConverted, yConverted);
							//System.out.println("OKAY2");
							if(result != null) {
								return new ResponseEntity<Map<String, Object>>(result, HttpStatus.OK);
							}else {
								return new ResponseEntity<Map<String, Object>>(HttpStatus.NOT_FOUND);
							}
								
							
							
						}
			
			
						
						
						
						
			
}
