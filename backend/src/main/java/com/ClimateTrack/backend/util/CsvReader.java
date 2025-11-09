package com.ClimateTrack.backend.util;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource; // <-- 1. IMPORT ClassPathResource
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets; // <-- 2. IMPORT Charsets
import java.util.ArrayList;
import java.util.List;

@Component // <-- 3. This makes it a "bean" and fixes the original error
public class CsvReader {

    private static final Logger logger = LoggerFactory.getLogger(CsvReader.class);

    /**
     * This is the method your VectorStoreService is trying to call.
     * It takes a classpath path string, loads the file, and returns formatted chunks.
     */
    public List<String> readAndFormatCsv(String classpathCsvPath) {
        List<String> chunks = new ArrayList<>();

        // 1. Get the InputStream from the classpath path string
        try (InputStream inputStream = new ClassPathResource(classpathCsvPath).getInputStream();
             // 2. Force the reader to use "EUC-KR" for Korean characters
             InputStreamReader reader = new InputStreamReader(inputStream, "EUC-KR"); // <-- NEW LINE
             CSVReader csvReader = new CSVReader(reader)) {

            String[] headers = csvReader.readNext(); // Read the header row
            if (headers == null) {
                logger.warn("CSV file is empty or headers are missing: {}", classpathCsvPath);
                return chunks;
            }

            String[] row;
            while ((row = csvReader.readNext()) != null) {
                if (row.length == headers.length) {
                    chunks.add(formatCsvRowAsSentence(headers, row));
                }
            }

        } catch (IOException | CsvValidationException e) {
            logger.error("Error reading or parsing CSV file: " + classpathCsvPath, e);
        }

        logger.info("Extracted {} chunks from CSV: {}", chunks.size(), classpathCsvPath);
        return chunks;
    }

    /**
     * Formats a CSV row into a human-readable sentence.
     */
    private String formatCsvRowAsSentence(String[] headers, String[] row) {
        StringBuilder sb = new StringBuilder();

        // Header names from your CSVs
        String policeName = getColumnValue(headers, row, "Police station name");
        String policeAddress = getColumnValue(headers, row, "Police station address");

        String fireStation = getColumnValue(headers, row, "fire station");
        String fireAddress = getColumnValue(headers, row, "address");
        String firePhone = getColumnValue(headers, row, "phone number");

        String adminName = getColumnValue(headers, row, "Name of lowest-level institution");
        String adminAddress = getColumnValue(headers, row, "Road name address");
        String adminPhone = getColumnValue(headers, row, "Representative phone number");

        // Build a sentence
        if (policeName != null) { // Police CSV
            sb.append("The institution named '").append(policeName.trim()).append("' ");
            sb.append("is located at '").append(policeAddress.trim()).append("'.");
        } else if (fireStation != null) { // Fire CSV
            sb.append("The institution named '").append(fireStation.trim()).append("' ");
            sb.append("is located at '").append(fireAddress.trim()).append("'");
            sb.append(" and the phone number is '").append(firePhone.trim()).append("'.");
        } else if (adminName != null) { // Admin CSV
            sb.append("The institution named '").append(adminName.trim()).append("' ");
            sb.append("is located at '").append(adminAddress.trim()).append("'");
            sb.append(" and the phone number is '").append(adminPhone.trim()).append("'.");
        } else {
            // Fallback for any other CSV structure
            sb.append("A record contains the following data: ");
            for (int i = 0; i < headers.length; i++) {
                if (i < row.length && row[i] != null && !row[i].isEmpty()) {
                    sb.append(headers[i]).append(" is ").append(row[i]).append("; ");
                }
            }
        }

        return sb.toString().replaceAll("\\s+", " ").trim();
    }

    /**
     * Helper to safely get a value from a CSV row by its header name.
     */
    private String getColumnValue(String[] headers, String[] row, String headerName) {
        for (int i = 0; i < headers.length; i++) {
            if (headers[i].trim().equalsIgnoreCase(headerName)) {
                if (i < row.length) {
                    return row[i];
                } else {
                    return null;
                }
            }
        }
        return null;
    }
}