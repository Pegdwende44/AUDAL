package com.audal.api.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.audal.api.repository.NeoDocumentObjectRepository.KeyValue;
import com.audal.api.model.NeoColumn;
import com.audal.api.repository.ElasticDocumentRepository;
import com.audal.api.repository.ElasticTableRepository;
import com.audal.api.repository.NeoGroupRepository;
import com.audal.api.repository.NeoGroupingRepository;
import com.audal.api.repository.NeoTableObjectRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/tables")
public class TablesExplorationController {

	
	//Repository 
	private NeoTableObjectRepository neoTableObjectRepository;
	
	private NeoGroupRepository neoGroupRepository;

	private ElasticTableRepository elasticTableRepository;
	
	private NeoGroupingRepository neoGroupingRepository;
	
	@Autowired
	public void setNeoTableObjectRepository(NeoTableObjectRepository neoTableObjectRepository) {
		this.neoTableObjectRepository = neoTableObjectRepository;
	}

	@Autowired
	public void setNeoGroupRepository(NeoGroupRepository neoGroupRepository) {
		this.neoGroupRepository = neoGroupRepository;
	}

	@Autowired
	public void setElasticTableRepository(ElasticTableRepository elasticTableRepository) {
		this.elasticTableRepository = elasticTableRepository;
	}

	// Method to welcome users and introduce to the analysis part of AUDAL API
	@GetMapping("/")
	public ResponseEntity<String> welcome() {
		String result = "Welcome to the API interface to analyze AURA-PMI structured data";
		return new ResponseEntity<String>(result, HttpStatus.OK);

	}
	
	
	@Autowired
	public void setNeoGroupingRepository(NeoGroupingRepository neoGroupingRepository) {
		this.neoGroupingRepository = neoGroupingRepository;
	}
	
	// Method to return a list of tables, default all, with a specific name
		@GetMapping("/tablesByName")
		public ResponseEntity<Map<String, Object>> getTablesByName(
				@RequestParam(name = "name", defaultValue = "all") String name,
				@RequestParam(name = "strict", defaultValue = "0") Integer strict,
				@RequestParam(name = "matching", defaultValue = "1") Integer matching,
				@RequestParam(name = "show", defaultValue = "identifier") String showProperty) {

			

			Map<String, Object> result;
			Collection<String> identifiers;
			//Filtering
			if (name.equals("all")) {// Return all tables
				identifiers = neoTableObjectRepository.findAllIdentifiers();
			} else {// Return from specified
				if(matching == 1) {//Positive matching
					if(strict == 1) {//Strict
						identifiers = neoTableObjectRepository.filterMatchingByName(name);
					}else {//Not strict
						identifiers = neoTableObjectRepository.filterMatchingLikeName(name);
					}
				}else {//Negative matching
					if(strict == 1) {//Strict
						identifiers = neoTableObjectRepository.filterUnMatchingByName(name);
					}else {//Not strict
						identifiers = neoTableObjectRepository.filterUnMatchingLikeName(name);
					}
				}
			}	
			//Result presentation
			Collection<KeyValue> temp;
			if (identifiers != null) {// Result found
				result = sfTableIdentifierToProperty(identifiers, showProperty);
				if(result != null) {//OKAY
					
					System.out.println("FOUND");
					return new ResponseEntity<Map<String, Object>>(result, HttpStatus.OK);
				}else {
					System.out.println("ERROR");
					return new ResponseEntity<Map<String, Object>>(HttpStatus.BAD_REQUEST);
				}
				
				
			} else { // Element absent
				System.out.println("NOT_FOUND");
				return new ResponseEntity<Map<String, Object>>(HttpStatus.NOT_FOUND);
			}

		}
	
	
		private Map<String, Object> sfTableIdentifierToProperty(Collection<String> ids, String showProperty) {
			if (ids != null && showProperty != null) {
				Collection<KeyValue> resultTemp = new ArrayList<KeyValue>();
				Map<String, Object> result = new LinkedHashMap<String, Object>();
				Collection<String> availableProperties = neoTableObjectRepository.getPropertyNames();
				if (availableProperties.contains(showProperty)) {
					resultTemp = neoTableObjectRepository.identifiersToProperty(ids, showProperty);
					
					if(resultTemp != null) {//OKAY
						for(KeyValue item : resultTemp) {
							result.putIfAbsent(item.getKey(), item.getValue());
						}
						
						return result;	
					}
				}else {
					// Property not found, search in groupings names:
					Collection<String> availableGroupings = neoGroupingRepository.getNames();
					if (availableGroupings.contains(showProperty)) {
						resultTemp = neoTableObjectRepository.identifiersToGroupNames(ids,
								showProperty);
						if(resultTemp != null) {//OKAY
							for(KeyValue item : resultTemp) {
								result.putIfAbsent(item.getKey(), item.getValue());
							}
							
							return result;	
						}
						

					}

				} 
			}
			return null;
			
		}
	
		
		
		@GetMapping("/tablesNeighbors")
		public ResponseEntity<Map<String, Object>> getTablesNeighbors(
				@RequestParam(name = "ids", required = true) List<String> ids,
				@RequestParam(name = "show", defaultValue = "identifier") String showProperty,
				@RequestParam(name = "limit", defaultValue = "10") Integer limit,
				@RequestParam(name = "threshold", defaultValue = "0.5") Double threshold) {
			Map<String, Object> result;
			Collection identifiers = neoTableObjectRepository.getNeighbors(ids, threshold, limit);
			
			//Presentation
			Collection<KeyValue> temp;
			if (identifiers != null) {// Result found
				
				result = sfTableIdentifierToProperty(identifiers, showProperty);	
				if(result != null) {//OKAY			
					
					System.out.println("FOUND");
					return new ResponseEntity<Map<String, Object>>(result, HttpStatus.OK);
				}else {
					System.out.println("ERROR");
					return new ResponseEntity<Map<String, Object>>(HttpStatus.BAD_REQUEST);
				}		
			} else { // Element absent
				System.out.println("NOT_FOUND");
				return new ResponseEntity<Map<String, Object>>(HttpStatus.NOT_FOUND);
			}

		}
		
		
		
		@GetMapping("/tablesColumns")
		public ResponseEntity<Map<String,List<NeoColumn>>> getTableColumns(
				@RequestParam(name = "ids") List<String> ids) {

			Map<String, List<NeoColumn>> result = new LinkedHashMap<String, List<NeoColumn>>();
				for(String id : ids) {
					List<NeoColumn> resultTemp = neoTableObjectRepository.getTableColumns(id);
					result.putIfAbsent(id, resultTemp);
				}
			if(result != null) {
				System.out.println("FOUND");
				return new ResponseEntity<Map<String,List<NeoColumn>>>(result, HttpStatus.OK);	
			} else { // Element absent
				System.out.println("NOT_FOUND");
				return new ResponseEntity<Map<String,List<NeoColumn>>>(HttpStatus.NOT_FOUND);
			}

		}
		
		
		@GetMapping("/joinableTables/{identifier}")
		public ResponseEntity<Collection<Object>> getJoinableTables(

				
				@PathVariable(name = "identifier", required = true) String identifier,
				@RequestParam(name = "how", defaultValue = "left") String how) {

			Collection result = null;
			
			if(how.equalsIgnoreCase("left")) {//Left joins
				result = neoTableObjectRepository.getDetailedLeftJoinableTables(identifier);
				return new ResponseEntity<Collection<Object>>(result, HttpStatus.OK);
			}
			
			else if(how.equalsIgnoreCase("right")) {//Left joins
				result = neoTableObjectRepository.getDetailedRightJoinableTables(identifier);
				return new ResponseEntity<Collection<Object>>(result, HttpStatus.OK);
			}
			else if(how.equalsIgnoreCase("natural")) {//Natural joins
				result = neoTableObjectRepository.getDetailedNaturalJoinableTables(identifier);
				return new ResponseEntity<Collection<Object>>(result, HttpStatus.OK);
				
			}else if(how.equalsIgnoreCase("inner")) {//Inner joins
				result = neoTableObjectRepository.getDetailedInnerJoinableTables(identifier);
				return new ResponseEntity<Collection<Object>>(result, HttpStatus.OK);
				
			}else {
				return new ResponseEntity<Collection<Object>>(HttpStatus.BAD_REQUEST);
			}
			

		}
		
		
		
		private Collection<String> sfTablesByGroups(Set<String> groupings,
				Map<String, String> allParams) {
			Collection<String> resultTemp = new ArrayList<String>();
			Collection<String> result = new ArrayList<String>();

			// For each grouping, send groups and get affiliated docs
			boolean first = true;// Check filtering stage
			for (String grouping : groupings) {
				List<String> groups = Arrays.asList(allParams.get(grouping).split(","));
				if (groups == null) {
					return null;
				} else {

					// filter in
						resultTemp = neoGroupRepository.filterTabInGroups(grouping, groups);
						//listTab();

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
			return neoTableObjectRepository.findAllIdentifiers(); ////result;
		}
		
		
		
		
		// Return list of tables identifiers matching groups:
		// PARAMETERS: show, matching
		@GetMapping("/tablesByGroups")
		public ResponseEntity<Map<String, Object>> getTablesByGroups(@RequestParam Map<String, String> allParams) {
			// Parameters preprocessing
			
			Collection<String> resultTemp = new ArrayList<String>();
			String showProperty = null;
			
			Set<String> groupings = allParams.keySet();// get list of key-values
			if (groupings.contains("show")) {// Check if we have to return labels
				showProperty = allParams.get("show");
				groupings.remove("show");
			} else {
				showProperty = "identifier";
			}

			
			// Filtering
			resultTemp = sfTablesByGroups(groupings, allParams);
			
			if (resultTemp != null) {// Existing results

				// Check Return another property
				
				Map<String, Object> result = new HashMap<String, Object>();
				result = sfTableIdentifierToProperty(resultTemp, showProperty);
				if (result != null) {
					return new ResponseEntity<Map<String, Object>>(result, HttpStatus.OK);
				} else {
					return new ResponseEntity<Map<String, Object>>(HttpStatus.BAD_REQUEST);
				}

			} else {
				return new ResponseEntity<Map<String, Object>>(HttpStatus.NO_CONTENT);
			}
		}
		
		
		
		
		

		// Method to return a list of document properties, default all, or for a
		// specified list of identifiers
		@GetMapping("/tablesByTerms")
		public ResponseEntity<Map<String, Object>> getTablesByTerms(
				@RequestParam(name = "pageSize", defaultValue = "10") int pageSize,
				@RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
				@RequestParam(name = "terms", required = true) List<String> terms,
				@RequestParam(name = "strict", defaultValue = "1") Integer strict,
				@RequestParam(name = "fuzzy", defaultValue = "0") Integer fuzzy,
				@RequestParam(name = "matching", defaultValue = "1") Integer matching,
				@RequestParam(name = "show", defaultValue = "identifier") String showProperty) {

			PageRequest paging = PageRequest.of(pageNo, pageSize);// Paging definition

			Collection<String> resultTemp;
			
				if (matching == 1) {// Positive matching
					resultTemp = elasticTableRepository.findTabsByMatchingTerms(terms, paging, strict == 1, fuzzy == 1);
					
				} else {// Negative matching
					resultTemp = elasticTableRepository.findTabsByUnMatchingTerms(terms, paging, strict == 1, fuzzy == 1);
					System.out.println(resultTemp.size());
				}
			
			if (resultTemp != null) {// Existing Results
				Map<String, Object> result = new HashMap<String, Object>();
				
					// Check Return another property
					
					//System.out.println(resultTemp);
					result = sfTableIdentifierToProperty(resultTemp, showProperty);
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

		
		
		
		

		// Return list of document properties for specified identifiers
				// PARAMETERS: show, matching
				@GetMapping("/tablesProperties")
				public ResponseEntity<Map<String, Object>> getDocumentsPropertiess(
						@RequestParam(name = "ids", required = true) List<String> ids,
						@RequestParam(name = "show", required = true, defaultValue = "identifier") String showProperty) {
					// Parameters preprocessing
					if(!ids.isEmpty()) {
					

						// Check Return another property
						
						Map<String, Object> result = new HashMap<String, Object>();
						
						result = sfTableIdentifierToProperty(ids, showProperty);
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
				// Method to return a list of document highlights, default all, or for a
						// specified list of identifiers
						@GetMapping("/tablesPath")
						public ResponseEntity<HashMap<String, String> > getDocumentsPath(
								@RequestParam(name = "ids", required = true) List<String> ids) {
								 //new ArrayList<KeyValue>();
								HashMap<String, String> result = new HashMap<String, String>();
								List<KeyValue> resultTemp = neoTableObjectRepository.identifiersToPath(ids);
								for(KeyValue keyval:resultTemp) {
									result.put(keyval.getKey(), (String)keyval.getValue());
								}
								
							
							if (result != null) {// Element présent
								return new ResponseEntity<HashMap<String, String> >(result, HttpStatus.OK);
							} else { // Element absent
								System.out.println("NOT_FOUND");
								return new ResponseEntity<HashMap<String, String> >(HttpStatus.NOT_FOUND );
							}

						}*/
}
