package edu.stevens.cs548.clinic.domain;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.*;

import edu.stevens.cs548.clinic.util.DateUtils;

// TODO
@Entity
@DiscriminatorValue("Physiotherapy")
public class PhysiotherapyTreatment extends Treatment {

	private static final long serialVersionUID = 5602950140629148756L;
	
	// TODO (including order by date)
	@ElementCollection
	protected List<Date> treatmentDates;

	public void addTreatmentDate(LocalDate date) {
		treatmentDates.add(DateUtils.toDatabaseDate(date));
	}

	@Override
	public <T> T export(ITreatmentExporter<T> visitor) {
        // TODO
		return visitor.exportPhysiotherapy(treatmentId,
				   patient.getPatientId(),
				   patient.getName(),
				   provider.getProviderId(),
				   provider.getName(),
				   diagnosis, 
				   DateUtils.fromDatabaseDates(treatmentDates),
				   () -> exportFollowupTreatments(visitor));	
	}
	
	public PhysiotherapyTreatment() {
		treatmentDates = new ArrayList<>();
	}

}
