package com.audal.api.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.audal.api.misc.Record;
import com.audal.api.model.ElasticDocument;
import com.audal.api.repository.ElasticDocumentRepository;
import com.audal.api.repository.MongoDocumentRepository;
import com.audal.api.repository.NeoDocumentObjectRepository;
import com.audal.api.repository.NeoDocumentObjectRepository.Centrality;
import com.audal.api.repository.NeoDocumentObjectRepository.DocConnection;
import com.audal.api.repository.NeoDocumentObjectRepository.GroupConnection;
import com.audal.api.repository.NeoDocumentObjectRepository.KeyValue;
import com.audal.api.repository.NeoDocumentObjectRepository.Labeling;
import com.audal.api.repository.NeoGroupRepository;
import com.audal.api.repository.NeoGroupingRepository;
import com.audal.api.repository.SparkQueryRepository;
import com.audal.api.model.ElasticExtendedDocument;
import com.audal.api.model.IdsWrapper;
import com.audal.api.model.IdentifiersWrapper;
import com.audal.api.model.NeoDocumentObject;

@RestController
@RequestMapping("/documents")
public class DocumentsAnalysisController {

	// Repository
	private ElasticDocumentRepository elasticDocumentRepository;

	private NeoDocumentObjectRepository neoDocumentObjectRepository;

	private NeoGroupRepository neoGroupRepository;

	private NeoGroupingRepository neoGroupingRepository;
	
	private MongoDocumentRepository mongoDocumentRepository;
	

	private SparkQueryRepository sparkQueryRepository;


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

	@Autowired
	public void setSparkQueryRepository(SparkQueryRepository sparkQueryRepository) {
		this.sparkQueryRepository = sparkQueryRepository;
	}
	
	@Autowired
	public void setMongoDocumentRepository(MongoDocumentRepository mongoDocumentRepository) {
		this.mongoDocumentRepository = mongoDocumentRepository;
	}

	// Method to return a list of document highlights, default all, or for a
	// specified list of identifiers
	@GetMapping("/documentsHighlights")
	public ResponseEntity<Iterable<ElasticExtendedDocument>> getDocumentsHighlights(
			@RequestParam(name = "ids", required = false, defaultValue = "all") List<String> ids,
			@RequestParam(name = "pageSize", defaultValue = "10") int pageSize,
			@RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
			@RequestParam(name = "terms", required = false) List<String> posTerms,
			@RequestParam(name = "strict", defaultValue = "1") Integer strict,
			@RequestParam(name = "fuzzy", defaultValue = "1") Integer fuzzy,
			@RequestParam(name = "fragNum", defaultValue = "10") Integer fragNum,
			@RequestParam(name = "fragSize", required = false, defaultValue = "0") Integer size) {

		PageRequest paging = PageRequest.of(pageNo, pageSize);// Paging definition

		Iterable<ElasticExtendedDocument> result;
		if (ids.contains("all")) {// Return all profiles
			result = elasticDocumentRepository.findDocsHighlightsByMatchingTerms(posTerms, paging, strict == 1, size,fragNum,
					fuzzy == 1);
		} else {// Return from the list of ids
			result = elasticDocumentRepository.filterDocsHighlightsByMatchingTerms(ids, posTerms, paging, strict == 1,
					size,fragNum, fuzzy == 1);
		}
		if (result != null) {// Element présent
			return new ResponseEntity<Iterable<ElasticExtendedDocument>>(result, HttpStatus.OK);
		} else { // Element absent
			System.out.println("NOT_FOUND");
			return new ResponseEntity<Iterable<ElasticExtendedDocument>>(HttpStatus.NOT_FOUND );
		}

	}
	
	
	
	// Method to return a list of document highlights, default all, or for a
		// specified list of identifiers
		@PostMapping("/documentsHighlights")
		public ResponseEntity<Iterable<ElasticExtendedDocument>> getDocumentsHighlights2(
				@RequestBody IdentifiersWrapper ids,
				@RequestParam(name = "pageSize", defaultValue = "10") int pageSize,
				@RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
				@RequestParam(name = "terms", required = false) List<String> posTerms,
				@RequestParam(name = "strict", defaultValue = "1") Integer strict,
				@RequestParam(name = "fuzzy", defaultValue = "1") Integer fuzzy,
				@RequestParam(name = "fragNum", defaultValue = "10") Integer fragNum,
				@RequestParam(name = "fragSize", required = false, defaultValue = "0") Integer size) {

			PageRequest paging = PageRequest.of(pageNo, pageSize);// Paging definition

			Iterable<ElasticExtendedDocument> result;
			if (ids.getIdentifiers().contains("all")) {// Return all profiles
				result = elasticDocumentRepository.findDocsHighlightsByMatchingTerms(posTerms, paging, strict == 1, size,fragNum,
						fuzzy == 1);
			} else {// Return from the list of ids
				result = elasticDocumentRepository.filterDocsHighlightsByMatchingTerms(ids.getIdentifiers(), posTerms, paging, strict == 1,
						size,fragNum, fuzzy == 1);
			}
			if (result != null) {// Element présent
				return new ResponseEntity<Iterable<ElasticExtendedDocument>>(result, HttpStatus.OK);
			} else { // Element absent
				System.out.println("NOT_FOUND");
				return new ResponseEntity<Iterable<ElasticExtendedDocument>>(HttpStatus.NOT_FOUND );
			}

		}
	
	
	
	// Method to return a a document file as Resource
		@GetMapping("/documentContent")
		public ResponseEntity<Resource> getDocumentContent(
				@RequestParam(name = "id", required = true) String id)  {
				String path = neoDocumentObjectRepository.identifierToPath(id);
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
		
		
		
	
	
	

	// Method to return a list of document highlights, default all, or for a
	// specified list of identifiers
	@GetMapping("/documentsScores")
	public ResponseEntity<HashMap<String, Double>> getDocumentsScores(
			@RequestParam(name = "ids", required = false, defaultValue = "all") List<String> ids,
			@RequestParam(name = "pageSize", defaultValue = "10") int pageSize,
			@RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
			@RequestParam(name = "terms", required = false) List<String> terms,
			@RequestParam(name = "fuzzy", defaultValue = "1") Integer fuzzy) {

		PageRequest paging = PageRequest.of(pageNo, pageSize);// Paging definition

		HashMap<String, Double> result;
		if (ids.contains("all")) {// Return all profiles
			result = elasticDocumentRepository.findDocsScores(terms, paging, fuzzy == 1);
		} else {// Return from the list of ids
			result = elasticDocumentRepository.filterDocsScores(ids, terms, paging, fuzzy == 1);
		}
		if (result != null) {// Element présent
			return new ResponseEntity<HashMap<String, Double>>(result, HttpStatus.OK);
		} else { // Element absent
			System.out.println("NOT_FOUND");
			return new ResponseEntity<HashMap<String, Double>>(HttpStatus.NOT_FOUND);
		}

	}

	
	@PostMapping("/documentsScores")
	public ResponseEntity<HashMap<String, Double>> getDocumentsScores2(
			@RequestBody IdentifiersWrapper ids,
			@RequestParam(name = "pageSize", defaultValue = "10") int pageSize,
			@RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
			@RequestParam(name = "terms", required = false) List<String> terms,
			@RequestParam(name = "fuzzy", defaultValue = "1") Integer fuzzy) {

		PageRequest paging = PageRequest.of(pageNo, pageSize);// Paging definition

		HashMap<String, Double> result;
		if (ids.getIdentifiers().contains("all")) {// Return all profiles
			result = elasticDocumentRepository.findDocsScores(terms, paging, fuzzy == 1);
		} else {// Return from the list of ids
			result = elasticDocumentRepository.filterDocsScores(ids.getIdentifiers(), terms, paging, fuzzy == 1);
		}
		if (result != null) {// Element présent
			return new ResponseEntity<HashMap<String, Double>>(result, HttpStatus.OK);
		} else { // Element absent
			System.out.println("NOT_FOUND");
			return new ResponseEntity<HashMap<String, Double>>(HttpStatus.NOT_FOUND);
		}

	}

	
	
	
	
	// Method to return documents partition from a list of identifiers
		@GetMapping("/documentsPartition")
		public ResponseEntity<Map<String, String>> getDocumentsPartition(
				@RequestParam(name = "ids", defaultValue = "all") List<String> ids,
				@RequestParam(name = "vocabulary", required = true) String vocabulary,
				@RequestParam(name = "threshold", defaultValue = "0.7") Double threshold) {
			
			Map<String, String> result = new HashMap<String, String>();
			Collection<Labeling> resultTemp = null;
			resultTemp = neoDocumentObjectRepository.getPartition(ids, vocabulary, threshold);
			if(resultTemp != null) {
				for (Labeling labeling :resultTemp) {
					result.put(labeling.getIdentifier(), String.valueOf(labeling.getLabel()));
				}
				if(result != null) {//OK
					return new ResponseEntity<Map<String, String>>(result, HttpStatus.OK);
				}else {
					return new ResponseEntity<Map<String, String>>(HttpStatus.NOT_FOUND);
				}
			}else {//BAD REQUEST
				return new ResponseEntity<Map<String, String>>(HttpStatus.NOT_FOUND);
			}
		}
		
		
		
		// Method to return documents subgraph
				@GetMapping("/documentsLinks")
				public ResponseEntity<Collection<DocConnection>> getDocumentsLinks(
						@RequestParam(name = "ids", required = true) List<String> ids,
						@RequestParam(name = "vocabulary", required = true) String vocabulary,
						@RequestParam(name = "threshold", defaultValue = "0.7") Double threshold) {
					
			
					Collection<DocConnection> result = null;
					result = neoDocumentObjectRepository.getDocsLinks(ids, vocabulary, threshold);
					if(result != null) {
						
						return new ResponseEntity<Collection<DocConnection>>(result, HttpStatus.OK);
						
					}else {//BAD REQUEST
						return new ResponseEntity<Collection<DocConnection>>(HttpStatus.NOT_FOUND);
					}
				}
				
				
				@PostMapping("/documentsLinks")
				public ResponseEntity<Collection<DocConnection>> getDocumentsLinks2(
						@RequestBody IdentifiersWrapper ids,
						@RequestParam(name = "vocabulary", required = true) String vocabulary,
						@RequestParam(name = "threshold", defaultValue = "0.7") Double threshold) {
					
			
					Collection<DocConnection> result = null;
					result = neoDocumentObjectRepository.getDocsLinks(ids.getIdentifiers(), vocabulary, threshold);
					if(result != null) {
						
						return new ResponseEntity<Collection<DocConnection>>(result, HttpStatus.OK);
						
					}else {//BAD REQUEST
						return new ResponseEntity<Collection<DocConnection>>(HttpStatus.NOT_FOUND);
					}
				}
				
		/*
		
				// Method to return documents subgraph
				@GetMapping("/groupsLinks")
				public ResponseEntity<Collection<GroupConnection>> getGroupsLinks(
						@RequestParam(name = "ids", required = true) List<String> ids,
						@RequestParam(name = "vocabulary", required = true) String vocabulary,
						@RequestParam(name = "grouping", required = true) String grouping,
						@RequestParam(name = "threshold", defaultValue = "0.7") Double threshold) {
					
					
					Collection<GroupConnection> result = null;
					result = neoDocumentObjectRepository.getGroupsLinks(ids, vocabulary, threshold, grouping);
					if(result != null) {//OK
							return new ResponseEntity<Collection<GroupConnection>>(result, HttpStatus.OK);
						
					}else {//BAD REQUEST
						return new ResponseEntity<Collection<GroupConnection>>(HttpStatus.BAD_REQUEST);
					}
				}*/
				
				
				// Method to return documents subgraph
				@PostMapping("/groupsLinks")
				public ResponseEntity<KeyValue> getGroupsLinks2(
						@RequestBody IdsWrapper ids,
						//@RequestBody IdsWrapper ids2,
						@RequestParam(name = "vocabulary", required = true) String vocabulary,
						@RequestParam(name = "threshold", defaultValue = "0.7") Double threshold) {
					
					
					KeyValue result = null;
					result = neoDocumentObjectRepository.getGroupsLinks(ids.getIds1(), ids.getIds2(), vocabulary, threshold);
					if(result != null) {//OK
							return new ResponseEntity<KeyValue>(result, HttpStatus.OK);
						
					}else {//BAD REQUEST
						return new ResponseEntity<KeyValue>(HttpStatus.BAD_REQUEST);
					}
				}
				
				
				
		// Method to return documents centralities from a list of identifiers
				@GetMapping("/documentsCentralities")
				public ResponseEntity<Map<String, Double>> getDocumentsCentralities(
						@RequestParam(name = "ids", defaultValue = "all") List<String> ids,
						@RequestParam(name = "vocabulary", required = true) String vocabulary,
						@RequestParam(name = "threshold", defaultValue = "0.7") Double threshold,
						@RequestParam(name = "limit", defaultValue = "5") Integer limit) {
					
					Map<String, Double> result = new LinkedHashMap<String, Double>();
					Collection<Centrality> resultTemp = null;
					resultTemp = neoDocumentObjectRepository.getCentralities(ids, vocabulary, threshold, limit);
					if(resultTemp != null) {
						for (Centrality centrality :resultTemp) {
							result.put(centrality.getIdentifier(), centrality.getValue());
						}
						return new ResponseEntity<Map<String, Double>>(result, HttpStatus.OK);
					}else {//BAD REQUEST
						return new ResponseEntity<Map<String, Double>>(HttpStatus.NOT_FOUND);
					}
					
				}
	
				// Method to return documents top kw from a list of identifiers
				@GetMapping("/documentsTopKw")
				public ResponseEntity<Map<String, Double>> getDocumentsTopKw(
						@RequestParam(name = "ids", defaultValue = "all") List<String> ids,
						@RequestParam(name = "vocabulary", required = true) String vocabulary,
						@RequestParam(name = "limit", defaultValue = "5") Integer limit) {
				
					Map<String, Double> result = null;
					result = mongoDocumentRepository.getDocumentsTopKw(ids, vocabulary, limit);
					
					
					if(result != null) {
						
						return new ResponseEntity<Map<String, Double>>(result, HttpStatus.OK);
					}else {//BAD REQUEST
						return new ResponseEntity<Map<String, Double>>(HttpStatus.NOT_FOUND);
					}
					
				}
				
				
				@PostMapping("/documentsTopKw")
				public ResponseEntity<Map<String, Double>> getDocumentsTopKw2(
						@RequestBody IdentifiersWrapper ids,
						@RequestParam(name = "vocabulary", required = true) String vocabulary,
						@RequestParam(name = "limit", defaultValue = "5") Integer limit) {
				
					Map<String, Double> result = null;
					result = mongoDocumentRepository.getDocumentsTopKw(ids.getIdentifiers(), vocabulary, limit);
					
					
					if(result != null) {
						
						return new ResponseEntity<Map<String, Double>>(result, HttpStatus.OK);
					}else {//BAD REQUEST
						return new ResponseEntity<Map<String, Double>>(HttpStatus.NOT_FOUND);
					}
					
				}
				
				
				
				@PostMapping("/documentsFreqKw")
				public ResponseEntity<Map<String, Double>> getDocumentsFreqKw(
						@RequestBody IdentifiersWrapper ids,
						@RequestParam(name = "vocabulary", required = true) String vocabulary,
						@RequestParam(name = "terms", required = true) List<String> terms) {
				
					Map<String, Double> result = null;
					result = mongoDocumentRepository.getDocumentsFreqKw(ids.getIdentifiers(), terms, vocabulary);
					
					
					if(result != null) {
						
						return new ResponseEntity<Map<String, Double>>(result, HttpStatus.OK);
					}else {//BAD REQUEST
						return new ResponseEntity<Map<String, Double>>(HttpStatus.NOT_FOUND);
					}
					
				}
				
				
				
				
				// Method to return documents centralities from a list of identifiers
				@GetMapping("/documentsEmbedding")
				public ResponseEntity<Map<String, Double>> getDocumentsEmbedding(
						@RequestParam(name = "ids", defaultValue = "all") List<String> ids,
						@RequestParam(name = "vocabulary", required = true) String vocabulary) {
					
					Map<String, Double> result = null;
					//Collection<Centrality> resultTemp = null;
					//resultTemp = neoDocumentObjectRepository.getCentralities(ids, vocabulary, threshold, 1);
					//String format = "embedding";
					result = mongoDocumentRepository.getDocumentsEmbedding(ids, vocabulary);
					if(result != null) {
						
						return new ResponseEntity<Map<String, Double>>(result, HttpStatus.OK);
					}else {//BAD REQUEST
						return new ResponseEntity<Map<String, Double>>(HttpStatus.NOT_FOUND);
					}
					
				}
				
				
				@PostMapping("/documentsEmbedding")
				public ResponseEntity<Map<String, Double>> getDocumentsEmbedding2(
						@RequestBody IdentifiersWrapper ids,
						@RequestParam(name = "vocabulary", required = true) String vocabulary) {
					
					Map<String, Double> result = null;
					//Collection<Centrality> resultTemp = null;
					//resultTemp = neoDocumentObjectRepository.getCentralities(ids, vocabulary, threshold, 1);
					//String format = "embedding";
					result = mongoDocumentRepository.getDocumentsEmbedding(ids.getIdentifiers(), vocabulary);
					if(result != null) {
						
						return new ResponseEntity<Map<String, Double>>(result, HttpStatus.OK);
					}else {//BAD REQUEST
						return new ResponseEntity<Map<String, Double>>(HttpStatus.NOT_FOUND);
					}
					
				}
				
				
				
				
				
				// Method to return the result of a kmeans
				@GetMapping("/kmeans")
				public ResponseEntity<Map<Map<String,Double>,List<Record>>> executeClustering(
						@RequestParam(name = "values", required = true) List<Double> values,
						@RequestParam(name = "k", defaultValue="3") Integer nbClusters,
						@RequestParam(name = "labels", required = true) List<String> labels,
						@RequestParam(name = "keys", required = true) List<String> keys) {
						//Transform entry
						System.out.println(values);
						int nbLines = values.size()/keys.size();
						List<Map<String,Double>> lines = new ArrayList<Map<String,Double>>();
						
						int k=0;
						for(int i=0; i<nbLines; i++) {
							Map<String,Double> line = new LinkedHashMap<String, Double>();
							for(int j=0; j<keys.size(); j++) {
								line.put(keys.get(j), values.get(k));
								k++;
							}
							lines.add(line);
							
						}
						//System.out.println("labels");
						//System.out.println(labels);
						Map<Map<String,Double>,List<Record>> result = null;
						result = sparkQueryRepository.docKMeans(lines, nbClusters, labels, keys);
						if(result != null) {
							return new ResponseEntity<Map<Map<String,Double>,List<Record>>>(result, HttpStatus.OK);
						}else {
							return new ResponseEntity<Map<Map<String,Double>,List<Record>>>(HttpStatus.NOT_FOUND);
						}
			
				}
				
				
				
				
				
				// Method to return the result of a pca
				@GetMapping("/pca")
				public ResponseEntity<List<Record>> executePCA(
						@RequestParam(name = "values", required = true) List<Double> values,
						@RequestParam(name = "labels", required = true) List<String> labels,
						@RequestParam(name = "keys", required = true) List<String> keys) {
						//Transform entry
						System.out.println(values);
						int nbLines = values.size()/keys.size();
						List<Map<String,Double>> lines = new ArrayList<Map<String,Double>>();
						
						int k=0;
						for(int i=0; i<nbLines; i++) {
							Map<String,Double> line = new LinkedHashMap<String, Double>();
							for(int j=0; j<keys.size(); j++) {
								line.put(keys.get(j), values.get(k));
								k++;
							}
							lines.add(line);
							
						}
						
						List<Record>  result = null;
						result = sparkQueryRepository.docPCA(lines, labels, keys);
						if(result != null) {
							return new ResponseEntity<List<Record>>(result, HttpStatus.OK);
						}else {
							return new ResponseEntity<List<Record>>(HttpStatus.NOT_FOUND);
						}

				}	
				
				
				
				
				
				// Method to return the list of column similarities
				@GetMapping("/cos")
				public ResponseEntity<Map<String,Object>> cosSimilarities(
						@RequestParam(name = "values", required = true) List<Double> values,
						@RequestParam(name = "labels", required = true) List<String> labels,
						@RequestParam(name = "keys", required = true) List<String> keys) {
						//Transform entry
						System.out.println(values);
						int nbLines = values.size()/keys.size();
						List<Map<String,Double>> lines = new ArrayList<Map<String,Double>>();
						
						int k=0;
						for(int i=0; i<nbLines; i++) {
							Map<String,Double> line = new LinkedHashMap<String, Double>();
							for(int j=0; j<keys.size(); j++) {
								line.put(keys.get(j), values.get(k));
								k++;
							}
							lines.add(line);
							
						}
						
						Map<String,Object> result = null;
						result = sparkQueryRepository.docSimilarities(lines, labels, keys);
						if(result != null) {
							return new ResponseEntity<Map<String,Object>>(result, HttpStatus.OK);
						}else {
							return new ResponseEntity<Map<String,Object>>(HttpStatus.NOT_FOUND);
						}
	
				}	
				
	
}
