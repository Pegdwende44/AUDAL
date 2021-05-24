package com.audal.api.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.audal.api.model.ElasticDocument;
import com.audal.api.repository.ElasticDocumentRepository;
import com.audal.api.repository.NeoDocumentObjectRepository;
import com.audal.api.repository.NeoDocumentObjectRepository.DocRepresentation;
import com.audal.api.repository.NeoDocumentObjectRepository.KeyValue;
import com.audal.api.repository.NeoGroupRepository;
import com.audal.api.repository.NeoGroupingRepository;
import com.audal.api.model.ElasticExtendedDocument;
import com.audal.api.model.IdentifiersWrapper;
import com.audal.api.model.NeoDocumentObject;

@RestController
@RequestMapping("/documents")
public class DocumentsExplorationController {

	// Repository
	private ElasticDocumentRepository elasticDocumentRepository;

	private NeoDocumentObjectRepository neoDocumentObjectRepository;

	private NeoGroupRepository neoGroupRepository;

	private NeoGroupingRepository neoGroupingRepository;

	@Autowired
	public void setElasticDocumentRepository(ElasticDocumentRepository elasticDocumentRepository) {
		this.elasticDocumentRepository = elasticDocumentRepository;
	}

	@Autowired
	public void setNeoDocumentObjectRepository(NeoDocumentObjectRepository neoDocumentObjectRepository) {
		this.neoDocumentObjectRepository = neoDocumentObjectRepository;
	}

	@Autowired
	public void setNeoGroupRepository(NeoGroupRepository neoGroupRepository) {
		this.neoGroupRepository = neoGroupRepository;
	}

	@Autowired
	public void setNeoGroupingRepository(NeoGroupingRepository neoGroupingRepository) {
		this.neoGroupingRepository = neoGroupingRepository;
	}

	// Method to welcome users and introduce to the exploration part of AUDAL API
	@GetMapping("/")
	public ResponseEntity<String> welcome() {
		String result = "Welcome to the API interface to analyze AURA-PMI textual data";
		return new ResponseEntity<String>(result, HttpStatus.OK);

	}

	
	// Method to return a list of document properties, default all, or for a
	// specified list of identifiers
	@GetMapping("/documentsByTerms")
	public ResponseEntity<Map<String, Object>> getDocumentsByTerms(
			@RequestParam(name = "ids", required = false, defaultValue = "all") List<String> ids,
			@RequestParam(name = "pageSize", defaultValue = "10") int pageSize,
			@RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
			@RequestParam(name = "terms", required = true) List<String> terms,
			@RequestParam(name = "strict", defaultValue = "1") Integer strict,
			@RequestParam(name = "fuzzy", defaultValue = "0") Integer fuzzy,
			@RequestParam(name = "matching", defaultValue = "1") Integer matching,
			@RequestParam(name = "show", defaultValue = "identifier") String showProperty) {

		PageRequest paging = PageRequest.of(pageNo, pageSize);// Paging definition

		List<String> resultTemp;
		if (ids.contains("all")) {// Simple search on all ids
			if (matching == 1) {// Positive matching
				resultTemp = elasticDocumentRepository.findDocsByMatchingTerms(terms, paging, strict == 1, fuzzy == 1);
				
			} else {// Negative matching
				resultTemp = elasticDocumentRepository.findDocsByUnMatchingTerms(terms, paging, strict == 1, fuzzy == 1);
			}
		} else {// Filter from user defined ids
			if (!ids.isEmpty()) {

				if (matching == 1) {// Positive matching
					resultTemp = elasticDocumentRepository.filterDocsByMatchingTerms(ids, terms, paging, strict == 1,
							fuzzy == 1);
				} else {// Negative matching
					resultTemp = elasticDocumentRepository.filterDocsByUnMatchingTerms(ids, terms, paging, strict == 1,
							fuzzy == 1);
				}
			} else {
				return new ResponseEntity<Map<String, Object>>(HttpStatus.BAD_REQUEST);
			}
		}
		if (resultTemp != null) {// Existing Results
			Map<String, Object> result = new HashMap<String, Object>();
			
				// Check Return another property
				
				//System.out.println(resultTemp);
				result = sfDocumentIdentifierToProperty(resultTemp, showProperty);
				if (result != null) {
					return new ResponseEntity<Map<String, Object>>(result, HttpStatus.OK);
				} else {
					return new ResponseEntity<Map<String, Object>>(HttpStatus.BAD_REQUEST);
				}
				
				
			

		} else { // No Results
			System.out.println("NOT_FOUND");
			return new ResponseEntity<Map<String, Object>>(HttpStatus.NO_CONTENT);
		}

	}

	
	
	
	
	
	private List<String> sfDocumentsByGroups(Set<String> groupings,
			Map<String, String> allParams) {
		List<String> resultTemp = new ArrayList<String>();
		List<String> result = new ArrayList<String>();

		// For each grouping, send groups and get affiliated docs
		boolean first = true;// Check filtering stage
		for (String grouping : groupings) {
			List<String> groups = Arrays.asList(allParams.get(grouping).split(","));
			if (groups == null) {
				return null;
			} else {

				// filter in
					resultTemp = neoGroupRepository.filterDocInGroups(grouping, groups);
				
				
				if (first) {// For first iteration, all values are retained
					result = resultTemp;
					first = false;
				} else {// Otherwise, values are filtered
					result.retainAll(resultTemp);
					/*System.out.println("#########################");
					System.out.println("RESULT "+result.size());
					System.out.println("RESULT-TEMP "+grouping +" "+resultTemp.size());*/
				}
			}
		}
		return result;
	}

	
	private Collection<String> sfDocumentIdentifierToProperty2(Collection<String> ids, String showProperty) {
		if (ids != null && showProperty != null) {
			Collection<String> result = new ArrayList<String>();
			Collection<String> availableProperties = neoDocumentObjectRepository.getPropertyNames();
			if (availableProperties.contains(showProperty)) {
				result = neoDocumentObjectRepository.identifiersToProperty(ids, showProperty);
				return result;

			} else {
				// Property not found, search in groupings names:
				Collection<String> availableGroupings = neoGroupingRepository.getNames();
				if (availableGroupings.contains(showProperty)) {
					result = neoDocumentObjectRepository.identifiersToGroupNames(ids,
							showProperty);
					return result;

				}

			}
		}
			return null;
		

	}
	
	
	
	private Map<String, Object> sfDocumentIdentifierToProperty(List<String> ids, String showProperty) {
		if (ids != null && showProperty != null) {
			Map<String, Object> result = new HashMap<String, Object>();
			Collection<KeyValue> resultTemp = new ArrayList<KeyValue>();
			Collection<String> availableProperties = neoDocumentObjectRepository.getPropertyNames();
			if (availableProperties.contains(showProperty)) {
				resultTemp = neoDocumentObjectRepository.identifiersToProperty2(ids, showProperty);
				for(KeyValue keyVal : resultTemp) {
					result.put(keyVal.getKey(), keyVal.getValue());
				}
				
				return result;

			} else {
				// Property not found, search in groupings names:
				Collection<String> availableGroupings = neoGroupingRepository.getNames();
				if (availableGroupings.contains(showProperty)) {
					resultTemp = neoDocumentObjectRepository.identifiersToGroupNames2(ids,
							showProperty);
					for(KeyValue keyVal : resultTemp) {
						result.put(keyVal.getKey(), keyVal.getValue());
					}
					return result;

				}

			}
		}
			return null;
		

	}
	

	
	
	
	
	
	
	
	
	
	
	
	// Return list of document identifiers matching groups:
	// PARAMETERS: show
	@GetMapping("/documentsByGroups")
	public ResponseEntity<Map<String, Object>> getDocumentsByGroups(@RequestParam Map<String, String> allParams) {
		// Parameters preprocessing
		
		List<String> resultTemp = new ArrayList<String>();
		String showProperty = null;
		String matching = "1";
		Set<String> groupings = allParams.keySet();// get list of key-values
		if (groupings.contains("show")) {// Check if we have to return labels
			showProperty = allParams.get("show");
			groupings.remove("show");
		} else {
			showProperty = "identifier";
		}

		
		// Filtering
		resultTemp = sfDocumentsByGroups(groupings, allParams);
		
		if (resultTemp != null) {// Existing results

			// Check Return another property
			
			Map<String, Object> result = new HashMap<String, Object>();
			result = sfDocumentIdentifierToProperty(resultTemp, showProperty);
			if (result != null) {
				return new ResponseEntity<Map<String, Object>>(result, HttpStatus.OK);
			} else {
				return new ResponseEntity<Map<String, Object>>(HttpStatus.BAD_REQUEST);
			}

		} else {
			return new ResponseEntity<Map<String, Object>>(HttpStatus.NO_CONTENT);
		}
	}

	
	
	
	
	
	/*
	// Return list of document identifiers matching groups:
		// PARAMETERS: show, matching
		@GetMapping("/documentsByGroups2")
		public ResponseEntity<Iterable<String>> getDocumentsByGroups2(@RequestParam Map<String, String> allParams) {
			// Parameters preprocessing
			
			Collection<String> result = new ArrayList<String>();
			String showProperty = null;
			String matching = "1";
			Set<String> groupings = allParams.keySet();// get list of key-values
			if (groupings.contains("show")) {// Check if we have to return labels
				showProperty = allParams.get("show");
				groupings.remove("show");
			} else {
				showProperty = "identifier";
			}

			if (groupings.contains("matching")) {// Check the type of matching
				matching = allParams.get("matching");
				// System.out.println("*************** "+matching);
				groupings.remove("matching");
				if (matching == null) {// error
					return new ResponseEntity<Iterable<String>>(HttpStatus.BAD_REQUEST);
				}
			}
			// Filtering
			result = sfDocumentsByGroups(matching, groupings, allParams);
			
			if (result != null) {// Existing results

				// Check Return another property
				
				Collection<String> result2;
				result2 = sfDocumentIdentifierToProperty2(result, showProperty);
				if (result2 != null) {
					return new ResponseEntity<Iterable<String>>(result2, HttpStatus.OK);
				} else {
					return new ResponseEntity<Iterable<String>>(HttpStatus.BAD_REQUEST);
				}

			} else {
				return new ResponseEntity<Iterable<String>>(HttpStatus.NO_CONTENT);
			}
		}

	*/
	
	/*
	// Return list of document identifiers matching groups and terms
	// PARAMETERS: show, matching, fuzzy, strict, terms, PageNo, pageSize

	@GetMapping("/documentsByTermsAndGroups")
	public ResponseEntity<Iterable<String>> getDocumentsByTermsAndGroups(@RequestParam Map<String, String> allParams) {
		Collection<String> resultGroupings = new ArrayList<String>();
		Collection<String> resultTerms = new ArrayList<String>();
		Collection<String> resultTemp = new ArrayList<String>();
		Collection<String> result = new ArrayList<String>();
		// Parameters preprocessing
		Set<String> groupings = allParams.keySet();// get list of key-values

		String showProperty = "identifier";
		if (groupings.contains("show")) {// Check if we have to return labels
			showProperty = allParams.get("show");
			groupings.remove("show");
		}
		
		String matching = "1";
		if (groupings.contains("matching")) {// Check the type of matching
			matching = allParams.get("matching");
			groupings.remove("matching");
		}
		
		
		String fuzzy = "0";
		if (groupings.contains("fuzzy")) {// Check the type of matching
			fuzzy = allParams.get("fuzzy");
			groupings.remove("fuzzy");
		}
		
		String strict = "1";
		if (groupings.contains("strict")) {// Check the type of matching
			strict = allParams.get("strict");
			groupings.remove("strict");
		}
		
		List<String> terms = null;
		if (groupings.contains("terms")) {// Check the type of matching
			String tempTerms = allParams.get("terms");
			if(tempTerms != null) {
				terms = Arrays.asList(tempTerms.split(","));
			}
			groupings.remove("terms");
		}
		String pageSize = "10";
		if (groupings.contains("pageSize")) {// Check the type of matching
			pageSize = allParams.get("pageSize");
			groupings.remove("pageSize");
		}
		String pageNo = "0";
		if (groupings.contains("pageNo")) {// Check the type of matching
			pageNo = allParams.get("pageNo");
			groupings.remove("pageNo");
		}
		
		if (matching == null || pageNo == null || pageSize == null || terms == null || 
				strict == null || fuzzy == null || showProperty == null) {// error
			return new ResponseEntity<Iterable<String>>(HttpStatus.BAD_REQUEST);
		}
		
		//Filtering on groupings
	
		resultGroupings = sfDocumentsByGroups( groupings, allParams);
		if(resultGroupings != null) {
			//Filtering on terms
			PageRequest paging = PageRequest.of(Integer.parseInt(pageNo), Integer.parseInt(pageSize));
			if (matching.equals("1")) {// Positive matching
				resultTerms =  elasticDocumentRepository.findDocsByMatchingTerms(terms, paging, 
						Integer.parseInt(strict) == 1, Integer.parseInt(fuzzy) == 1);
				
			} else {// Negative matching
				resultTerms =  elasticDocumentRepository.findDocsByUnMatchingTerms( terms, paging, 
						Integer.parseInt(strict) == 1, Integer.parseInt(fuzzy) == 1);
				
			}
			//Intersection
			
			result = resultTerms;
			
			result.retainAll(resultGroupings); 
			if(showProperty.equals("identifier")) {
				return new ResponseEntity<Iterable<String>>(result, HttpStatus.OK);
			}else {
				// Check Return another property
				
				Collection<String> result2;
				result2 = sfDocumentIdentifierToProperty2(result, showProperty);
				if (result2 != null) {
					return new ResponseEntity<Iterable<String>>(result2, HttpStatus.OK);
				} else {
					return new ResponseEntity<Iterable<String>>(HttpStatus.BAD_REQUEST);
				}
				
			}
			
			
		}else {//No result from Neo4j
			return new ResponseEntity<Iterable<String>>(HttpStatus.NO_CONTENT);
		}
		

	}

	*/
	
	
	@GetMapping("/documentsNeighbors")
	public ResponseEntity<Collection<String>> getDocumentsNeighbors(
			@RequestParam(name = "ids", required = true) List<String> ids,
			@RequestParam(name = "vocabulary", required = true) String vocabulary,
			@RequestParam(name = "show", defaultValue = "identifier") String showProperty,
			@RequestParam(name = "limit", defaultValue = "10") Integer limit,
			@RequestParam(name = "threshold", defaultValue = "0.7") Double threshold) {


		Collection result;
		result = neoDocumentObjectRepository.getNeighbors(ids, vocabulary, threshold, limit);
		if (result != null) {
			if(showProperty.equals("identifier")) {
				return new ResponseEntity<Collection<String>>(result, HttpStatus.OK);
			}else {//Show specific property
				Collection<String> result2;
				result2 = sfDocumentIdentifierToProperty2(result, showProperty);
				if (result2 != null) {
					return new ResponseEntity<Collection<String>>(result2, HttpStatus.OK);
				} else {
					return new ResponseEntity<Collection<String>>(HttpStatus.BAD_REQUEST);
				}
			}
			
		} else { // Element absent
			System.out.println("NOT_FOUND");
			return new ResponseEntity<Collection<String>>(HttpStatus.NOT_FOUND);
		}

	}
	
	
	
	
	@GetMapping("/documentsCoClassified")
	public ResponseEntity<Collection<String>> getDocumentsCoClassified(
			@RequestParam(name = "ids", required = true) List<String> ids,
			@RequestParam(name = "show", defaultValue = "identifier") String showProperty,
			@RequestParam(name = "limit", defaultValue = "10") Integer limit,
			@RequestParam(name = "threshold", defaultValue = "1") Integer threshold) {


		Collection result;
		result = neoDocumentObjectRepository.getCoClassified(ids, threshold, limit);
		if (result != null) {
			if(showProperty.equals("identifier")) {
				return new ResponseEntity<Collection<String>>(result, HttpStatus.OK);
			}else {//Show specific property
				Collection<String> result2;
				result2 = sfDocumentIdentifierToProperty2(result, showProperty);
				if (result2 != null) {
					return new ResponseEntity<Collection<String>>(result2, HttpStatus.OK);
				} else {
					return new ResponseEntity<Collection<String>>(HttpStatus.BAD_REQUEST);
				}
			}
			
		} else { // Element absent
			System.out.println("NOT_FOUND");
			return new ResponseEntity<Collection<String>>(HttpStatus.NOT_FOUND);
		}

	}
	
	
	
	
	
	
	
	
	
	
	
	// Return list of document properties for specified identifiers
			// PARAMETERS: show, matching
			@GetMapping("/documentsProperties")
			public ResponseEntity<Map<String, Object>> getDocumentsProperties(
					@RequestParam(name = "ids", required = true) List<String> ids,
					@RequestParam(name = "show", required = true, defaultValue = "identifier") String showProperty) {
				// Parameters preprocessing
				if(!ids.isEmpty()) {
				

					// Check Return another property
					
					Map<String, Object> result = new HashMap<String, Object>();
					
					result = sfDocumentIdentifierToProperty(ids, showProperty);
					if (result != null) {
						return new ResponseEntity<Map<String, Object>>(result, HttpStatus.OK);
					} else {
						return new ResponseEntity<Map<String, Object>>(HttpStatus.BAD_REQUEST);
					}

				} else {
					return new ResponseEntity<Map<String, Object>>(HttpStatus.NO_CONTENT);
				}
			}
			
			
			
			// Return list of document properties for specified identifiers
						// PARAMETERS: show, matching
						@PostMapping("/documentsProperties")
						public ResponseEntity<Map<String, Object>> getDocumentsProperties2(
								@RequestBody IdentifiersWrapper ids,
								@RequestParam(name = "show", required = true, defaultValue = "identifier") String showProperty) {
							// Parameters preprocessing
							if(!ids.isEmpty()) {
							

								// Check Return another property
								
								Map<String, Object> result = new HashMap<String, Object>();
								
								result = sfDocumentIdentifierToProperty(ids.getIdentifiers(), showProperty);
								if (result != null) {
									return new ResponseEntity<Map<String, Object>>(result, HttpStatus.OK);
								} else {
									return new ResponseEntity<Map<String, Object>>(HttpStatus.BAD_REQUEST);
								}

							} else {
								return new ResponseEntity<Map<String, Object>>(HttpStatus.NO_CONTENT);
							}
						}
			
			
			
			
			// Method to return a list of documents path
			// specified list of identifiers
			@GetMapping("/documentsPath")
			public ResponseEntity<HashMap<String, String> > getDocumentsPath(
					@RequestParam(name = "ids", required = true) List<String> ids) {
					 //new ArrayList<KeyValue>();
					HashMap<String, String> result = new HashMap<String, String>();
					List<KeyValue> resultTemp = neoDocumentObjectRepository.identifiersToPath(ids);
					for(KeyValue keyval:resultTemp) {
						result.put(keyval.getKey(), (String)keyval.getValue());
					}
					
				
				if (result != null) {// Element présent
					return new ResponseEntity<HashMap<String, String> >(result, HttpStatus.OK);
				} else { // Element absent
					System.out.println("NOT_FOUND");
					return new ResponseEntity<HashMap<String, String> >(HttpStatus.NOT_FOUND );
				}

			}
			

			
			@GetMapping("/documentsRepresentations")
			public ResponseEntity<List<DocRepresentation>> getDocumentsRepresentations(
					@RequestParam(name = "withSim", defaultValue = "0") Integer withSim) {
					 //new ArrayList<KeyValue>();
				List<DocRepresentation> result = new ArrayList<DocRepresentation>();
				if(withSim == 0) {
					result = neoDocumentObjectRepository.getDocRepresentations();
				}else if(withSim == 1){
					result = neoDocumentObjectRepository.getDocRepresentationsWithSim();
				}else {
					result = null;
				}
					
					
				
				if (result != null) {// Element présent
					return new ResponseEntity<List<DocRepresentation>>(result, HttpStatus.OK);
				} else { // Element absent
					System.out.println("NOT_FOUND");
					return new ResponseEntity<List<DocRepresentation>>(HttpStatus.NOT_FOUND );
				}

			}
			
	
}
