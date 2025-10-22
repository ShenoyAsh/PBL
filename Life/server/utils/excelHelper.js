const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/lifelink_db.xlsx');
const tempDbPath = path.join(__dirname, '../data/tmp_lifelink_db.xlsx');

/**
 * Reads the existing workbook or creates a new one.
 */
const getWorkbook = () => {
  try {
    if (fs.existsSync(dbPath)) {
      return xlsx.readFile(dbPath);
    }
  } catch (e) {
    console.error("Error reading existing workbook, creating new one.", e.message);
  }
  // If file doesn't exist or is corrupt, create a new one
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet([]), 'Donors');
  xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet([]), 'Patients');
  return wb;
};

/**
 * Performs an atomic write to the Excel file.
 * Reads, updates, writes to temp, then renames.
 */
const atomicWrite = (wb) => {
  try {
    // 1. Write to temporary file
    xlsx.writeFile(wb, tempDbPath);
    // 2. Atomically rename temp file to replace original
    fs.renameSync(tempDbPath, dbPath);
    console.log(`Excel DB updated: ${dbPath}`);
  } catch (error) {
    console.error('Failed atomic write to Excel DB:', error);
    // Clean up temp file if it exists
    if (fs.existsSync(tempDbPath)) {
      fs.unlinkSync(tempDbPath);
    }
  }
};

/**
 * Flattens nested MongoDB objects for clean Excel export.
 */
const flattenDonor = (donor) => {
  const donorObj = donor.toObject ? donor.toObject() : { ...donor };
  return {
    mongoId: donorObj._id.toString(),
    name: donorObj.name,
    email: donorObj.email,
    phone: donorObj.phone,
    bloodType: donorObj.bloodType,
    locationName: donorObj.location?.name,
    lng: donorObj.location?.coordinates?.[0],
    lat: donorObj.location?.coordinates?.[1],
    verified: donorObj.verified,
    otpVerified: donorObj.otpVerified,
    availability: donorObj.availability,
    createdAt: donorObj.createdAt,
  };
};

const flattenPatient = (patient) => {
  const patientObj = patient.toObject ? patient.toObject() : { ...patient };
  return {
    mongoId: patientObj._id.toString(),
    name: patientObj.name,
    email: patientObj.email,
    phone: patientObj.phone,
    bloodType: patientObj.bloodType,
    locationName: patientObj.location?.name,
    lng: patientObj.location?.coordinates?.[0],
    lat: patientObj.location?.coordinates?.[1],
    urgency: patientObj.urgency,
    createdAt: patientObj.createdAt,
  };
};

/**
 * Appends a single donor record to the 'Donors' sheet.
 */
const appendDonorToExcel = (donor) => {
  const wb = getWorkbook();
  const ws = wb.Sheets['Donors'] || xlsx.utils.json_to_sheet([]);
  
  xlsx.utils.sheet_add_json(ws, [flattenDonor(donor)], {
    header: Object.keys(flattenDonor(donor)),
    skipHeader: !!ws['!ref'], // Skip header if sheet already has data
    origin: -1, // Append to end
  });

  if (!wb.Sheets['Donors']) {
     xlsx.utils.book_append_sheet(wb, ws, 'Donors');
  }

  atomicWrite(wb);
};

/**
 * Appends a single patient record to the 'Patients' sheet.
 */
const appendPatientToExcel = (patient) => {
  const wb = getWorkbook();
  const ws = wb.Sheets['Patients'] || xlsx.utils.json_to_sheet([]);
  
  xlsx.utils.sheet_add_json(ws, [flattenPatient(patient)], {
    header: Object.keys(flattenPatient(patient)),
    skipHeader: !!ws['!ref'],
    origin: -1,
  });

  if (!wb.Sheets['Patients']) {
     xlsx.utils.book_append_sheet(wb, ws, 'Patients');
  }

  atomicWrite(wb);
};

/**
 * Generates an Excel workbook buffer for download.
 */
const exportWorkbook = async (donors, patients) => {
  const wb = xlsx.utils.book_new();
  
  const flatDonors = donors.map(flattenDonor);
  const donorSheet = xlsx.utils.json_to_sheet(flatDonors);
  xlsx.utils.book_append_sheet(wb, donorSheet, 'Donors');

  const flatPatients = patients.map(flattenPatient);
  const patientSheet = xlsx.utils.json_to_sheet(flatPatients);
  xlsx.utils.book_append_sheet(wb, patientSheet, 'Patients');

  // Write to buffer
  const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
};

module.exports = {
  appendDonorToExcel,
  appendPatientToExcel,
  exportWorkbook,
  dbPath,
};