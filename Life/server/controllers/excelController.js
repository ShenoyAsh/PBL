const xlsx = require('xlsx');
const Donor = require('../models/Donor');
const Patient = require('../models/Patient');
const { exportWorkbook, dbPath } = require('../utils/excelHelper');

/**
 * Export Donors and Patients from MongoDB to an Excel file
 */
const exportDonorsAndPatients = async (req, res) => {
  try {
    // 1. Fetch all data from MongoDB
    const donors = await Donor.find();
    const patients = await Patient.find();

    // 2. Generate the workbook buffer
    const buffer = await exportWorkbook(donors, patients);

    // 3. Set headers for file download
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=lifelink_export.xlsx'
    );
    
    res.send(buffer);

  } catch (error) {
    console.error('Excel export error:', error);
    res.status(500).json({ message: 'Failed to export Excel file' });
  }
};

/**
 * Import Donors and Patients from an uploaded Excel file
 * (This is a complex "upsert" operation)
 */
const importDonorsAndPatients = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const wb = xlsx.read(req.file.buffer, { type: 'buffer' });
    const donorSheet = wb.Sheets['Donors'];
    const patientSheet = wb.Sheets['Patients'];

    let donorsImported = 0;
    let patientsImported = 0;

    // --- 1. Process Donors ---
    if (donorSheet) {
      const donors = xlsx.utils.sheet_to_json(donorSheet);
      for (const donor of donors) {
        // Use email or phone as the unique key to find and update
        const filter = { $or: [{ email: donor.email }, { phone: donor.phone }] };
        const update = {
          name: donor.name,
          email: donor.email,
          phone: donor.phone,
          bloodType: donor.bloodType,
          verified: donor.verified,
          availability: donor.availability,
          location: {
            type: 'Point',
            coordinates: [donor.lng || 0, donor.lat || 0],
            name: donor.locationName || 'Imported Location',
          },
        };
        // Upsert: Update if exists, insert if new
        await Donor.findOneAndUpdate(filter, update, { upsert: true, new: true });
        donorsImported++;
      }
    }

    // --- 2. Process Patients ---
    if (patientSheet) {
        const patients = xlsx.utils.sheet_to_json(patientSheet);
         for (const patient of patients) {
            const filter = { $or: [{ email: patient.email }, { phone: patient.phone }] };
            const update = {
                 name: patient.name,
                email: patient.email,
                phone: patient.phone,
                bloodType: patient.bloodType,
                urgency: patient.urgency,
                location: {
                    type: 'Point',
                    coordinates: [patient.lng || 0, patient.lat || 0],
                    name: patient.locationName || 'Imported Location',
                },
            };
            await Patient.findOneAndUpdate(filter, update, { upsert: true, new: true });
            patientsImported++;
         }
    }

    // --- 3. Replace the Bolt DB file ---
    // The newly imported file becomes the new source of truth
    require('fs').writeFileSync(dbPath, req.file.buffer);

    res.status(200).json({
      message: 'Import successful',
      donorsImported,
      patientsImported,
    });

  } catch (error) {
    console.error('Excel import error:', error);
    res.status(500).json({ message: 'Failed to import Excel file', error: error.message });
  }
};


module.exports = {
  exportDonorsAndPatients,
  importDonorsAndPatients
};