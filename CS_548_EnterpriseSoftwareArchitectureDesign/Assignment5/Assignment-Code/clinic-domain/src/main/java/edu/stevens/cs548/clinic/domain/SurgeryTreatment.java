package edu.stevens.cs548.clinic.domain;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Date;

import javax.persistence.*;

import edu.stevens.cs548.clinic.util.DateUtils;

//TODO JPA annotations
@Entity
@DiscriminatorValue("Surgery")
public class SurgeryTreatment extends Treatment implements Serializable  {

	/**
	 * 
	 */
	private static final long serialVersionUID = 4173146640306267418L;
	
	//TODO annotations
	@Temporal(TemporalType.DATE)
	private Date surgeryDate;
	
	private String dischargeInstructions;
	
	public LocalDate getSurgeryDate() {
		return DateUtils.fromDatabaseDate(surgeryDate);
	}

	public void setSurgeryDate(LocalDate surgeryDate) {
		this.surgeryDate = DateUtils.toDatabaseDate(surgeryDate);
	}

	public String getDischargeInstructions() {
		return dischargeInstructions;
	}

	public void setDischargeInstructions(String dischargeInstructions) {
		this.dischargeInstructions = dischargeInstructions;
	}
	
	@Override
	public <T> T export(ITreatmentExporter<T> visitor) {
		// TODO
		return visitor.exportSurgery(treatmentId,
				   patient.getPatientId(),
				   patient.getName(),
				   provider.getProviderId(),
				   provider.getName(),
		   		   diagnosis,
		   		   DateUtils.fromDatabaseDate(surgeryDate),
		   		   dischargeInstructions,
		   		   () -> exportFollowupTreatments(visitor));
	}
	
	public SurgeryTreatment() {
		super();
	}

}
