package com.audal.api.controller;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.audal.api.model.MongoSemantic;
import com.audal.api.model.NeoGrouping;
import com.audal.api.model.ThesaurusPair;
import com.audal.api.repository.MongoSemanticRepository;
import com.audal.api.repository.NeoDocumentObjectRepository;
import com.audal.api.repository.NeoDocumentObjectRepository.DocProperty;
import com.audal.api.repository.NeoGroupRepository;
import com.audal.api.repository.NeoGroupRepository.GroupCount;
import com.audal.api.repository.NeoGroupingRepository;
import com.audal.api.repository.NeoTableObjectRepository;
import org.springframework.http.MediaType;



@RestController
@RequestMapping("/semantic")
public class SemanticResourceController {
	
	
	//Repository
	private MongoSemanticRepository mongoSemanticRepository;
	
	
	@Autowired
	public void setMongoSemanticRepository(MongoSemanticRepository mongoSemanticRepository) {
		this.mongoSemanticRepository = mongoSemanticRepository;
	}

	
	
	// Method to welcome users and introduce to the analysis part of AUDAL API
	@GetMapping("/")
	public ResponseEntity<String> welcome() {
		String result = "Welcome to the API interface to get the semantic metadata";
		return new ResponseEntity<String>(result, HttpStatus.OK);

	}
	
	
	//Return list of groupings
			@GetMapping("/resources")
			public ResponseEntity<Iterable<MongoSemantic>> getResources() {
				Iterable<MongoSemantic> liste =  mongoSemanticRepository.findAll();
				if(liste!=null) {//Element absent
					System.out.println("FOUND!!!!!!!!!");
					return new ResponseEntity<Iterable<MongoSemantic>>(liste, HttpStatus.OK);
					
				}else {
					System.out.println("NOT FOUND");
					return new ResponseEntity<Iterable<MongoSemantic>>(HttpStatus.NO_CONTENT);
				}
				
			}
			
			
			//Return list of terms from a dictionary
			@GetMapping("/dictionary/{id}")
			public ResponseEntity<Iterable<String>> getDictionary(@PathVariable("id") String id) {
				Iterable<String> liste =  mongoSemanticRepository.findDictionaryTerms(id);
				if(liste!=null) {//Element absent
					System.out.println("FOUND!!!!!!!!!");
					return new ResponseEntity<Iterable<String>>(liste, HttpStatus.OK);
					
				}else {
					System.out.println("NOT FOUND");
					return new ResponseEntity<Iterable<String>>(HttpStatus.NOT_FOUND);
				}
				
			}
			
			
			//Create a new dictionary
			@PostMapping(value="/dictionary", consumes = MediaType.APPLICATION_JSON_VALUE)
			public ResponseEntity<MongoSemantic> setDictionary(
					@RequestBody Map<String, Object> data
					) {
				//MongoSemantic document = new MongoSemantic();
				//
				if(data.containsKey("name") && data.containsKey("terms")) {//Data complete
					
					List<String> terms = (List<String>) data.get("terms");
					String name = (String) data.get("name");
					Optional<MongoSemantic> document =  mongoSemanticRepository.createDictionary(name, terms);
					System.out.println("CREATED!!!!!!!!!");
					if(document.isPresent()) {
						return new ResponseEntity<MongoSemantic>(document.get(), HttpStatus.CREATED);
					}else {
						return new ResponseEntity<MongoSemantic>(HttpStatus.EXPECTATION_FAILED);
					}
					
				}else {
					//System.out.println("NOT FOUND");
					return new ResponseEntity<MongoSemantic>(HttpStatus.BAD_REQUEST);
				}
				
			}
			
			
			
			@DeleteMapping("/dictionary/{id}")
			public ResponseEntity<MongoSemantic> deleteDictionary(@PathVariable("id")  String id){
				mongoSemanticRepository.deleteById(id);
				return new ResponseEntity<MongoSemantic>(HttpStatus.NO_CONTENT);
			}
		
			
			
			//Return list of groupings
			@GetMapping("/thesaurus/{id}")
			public ResponseEntity<Map<String,List<String>>> getThesaurus(@PathVariable("id") String id) {
				Map<String, List<String>> result =  mongoSemanticRepository.findThesaurusPairs(id);
				if(result!=null) {//Element absent
					System.out.println("FOUND!!!!!!!!!");
					return new ResponseEntity<Map<String,List<String>>>(result, HttpStatus.OK);
					
				}else {
					System.out.println("NOT FOUND");
					return new ResponseEntity<Map<String,List<String>>>(HttpStatus.NOT_FOUND);
				}
				
			}
	

			//Create a new thesaurus
			@PostMapping(value="/thesaurus", consumes = MediaType.APPLICATION_JSON_VALUE)
			public ResponseEntity<MongoSemantic> setThesaurus(
					@RequestBody Map<String, Object> data) {
				
				if(data.containsKey("name") && data.containsKey("pairs")) {//Data complete
					String name = (String) data.get("name");
					Map<String,List<String>> temp = (Map<String,List<String>>) data.get("pairs");
					List<ThesaurusPair> pairs = new ArrayList<ThesaurusPair>();
					for(Map.Entry entry: temp.entrySet()) {
						String generic = (String) entry.getKey();
						List<String> extensions = (List<String>) entry.getValue();
						for(String extension : extensions) {
							ThesaurusPair thesauruspair = new ThesaurusPair();
							thesauruspair.setGeneric(generic);
							thesauruspair.setExtension(extension);
							pairs.add(thesauruspair);
						}
						
					}
						
					Optional<MongoSemantic> document =  mongoSemanticRepository.createThesaurus(name, pairs);
					
					if(document.isPresent()) {
						System.out.println("CREATED!!!!!!!!!");
						return new ResponseEntity<MongoSemantic>(document.get(), HttpStatus.CREATED);
					}else {
						return new ResponseEntity<MongoSemantic>(HttpStatus.EXPECTATION_FAILED);
					}
					
				}else {
					//System.out.println("NOT FOUND");
					return new ResponseEntity<MongoSemantic>(HttpStatus.BAD_REQUEST);
				}
				
			}
			
			
			@DeleteMapping("/thesaurus/{id}")
			public ResponseEntity<MongoSemantic> deleteThesaurus(@PathVariable("id")  String id){
				mongoSemanticRepository.deleteById(id);
				return new ResponseEntity<MongoSemantic>(HttpStatus.NO_CONTENT);
			}
		
}
