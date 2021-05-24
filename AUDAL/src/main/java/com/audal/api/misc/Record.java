package com.audal.api.misc;

import java.util.Map;

public class Record {
    private  Map<String, Object> activeFeatures;

    private  Map<String, Object> descriptiveFeatures;

    
    
	

	public Record(Map<String, Object> activeFeatures, Map<String, Object> descriptiveFeatures) {
		super();
		this.activeFeatures = activeFeatures;
		this.descriptiveFeatures = descriptiveFeatures;
	}

	

	public Map<String, Object> getActiveFeatures() {
		return activeFeatures;
	}



	public void setActiveFeatures(Map<String, Object> activeFeatures) {
		this.activeFeatures = activeFeatures;
	}



	public Map<String, Object> getDescriptiveFeatures() {
		return descriptiveFeatures;
	}



	public void setDescriptiveFeatures(Map<String, Object> descriptiveFeatures) {
		this.descriptiveFeatures = descriptiveFeatures;
	}



	
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((activeFeatures == null) ? 0 : activeFeatures.hashCode());
		result = prime * result + ((descriptiveFeatures == null) ? 0 : descriptiveFeatures.hashCode());
		return result;
	}



	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Record other = (Record) obj;
		if (activeFeatures == null) {
			if (other.activeFeatures != null)
				return false;
		} else if (!activeFeatures.equals(other.activeFeatures))
			return false;
		if (descriptiveFeatures == null) {
			if (other.descriptiveFeatures != null)
				return false;
		} else if (!descriptiveFeatures.equals(other.descriptiveFeatures))
			return false;
		return true;
	}



	@Override
	public String toString() {
		return "Record [activeFeatures=" + activeFeatures + ", descriptiveFeatures=" + descriptiveFeatures + "]";
	}



	
    
    
	
 
    
}