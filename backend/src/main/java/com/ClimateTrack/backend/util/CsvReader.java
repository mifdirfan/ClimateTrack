package com.ClimateTrack.backend.util;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class CsvReader {

    private static final Logger logger = LoggerFactory.getLogger(CsvReader.class);

    /**
     * Reads a specific CSV file from the classpath, parses it, and formats
     * each relevant row into a natural language sentence.
     *
     * @param classpathCsvPath The path to the CSV file (e.g., "data/my_file.csv")
     * @return A list of formatted strings, ready for embedding.
     */
    public List<String> readAndFormatCsv(String classpathCsvPath) {
        List<String> csvChunks = new ArrayList<>();
        logger.info("Loading CSV data from classpath: {}", classpathCsvPath);
        ClassPathResource resource = new ClassPathResource(classpathCsvPath);

        if (!resource.exists()) {
            logger.error("CSV resource not found: {}", classpathCsvPath);
            return csvChunks;
        }

        // --- This logic is moved from VectorStoreService ---
        // It correctly uses UTF-8 to read Korean characters
        try (
                InputStream inputStream = resource.getInputStream();
                Reader reader = new InputStreamReader(inputStream, StandardCharsets.UTF_8);
                CSVReader csvReader = new CSVReader(reader)
        ) {
            String[] headers = csvReader.readNext(); // Read header row
            if (headers == null) {
                logger.warn("CSV file is empty: {}", classpathCsvPath);
                return csvChunks;
            }

            String[] line;
            while ((line = csvReader.readNext()) != null) {
                // Pass the path, headers, and row to the formatter
                String chunk = formatCsvRowAsSentence(classpathCsvPath, headers, line);
                if (chunk != null) {
                    csvChunks.add(chunk);
                }
            }
        } catch (IOException | CsvValidationException e) {
            logger.error("Error reading or parsing CSV file {}: {}", classpathCsvPath, e.getMessage(), e);
        }
        // --- End of moved logic ---

        return csvChunks;
    }

    /**
     * Formats a single CSV row into a natural language sentence based on the file type.
     * (This method is moved from VectorStoreService)
     */
    private String formatCsvRowAsSentence(String filePath, String[] headers, String[] row) {
        try {
            if (filePath.contains("소방청_시도_소방서_현황")) {
                // Headers: 순번,소방본부,소방서,주소,전화번호,팩스번호
                String stationName = row[2]; // 소방서
                String address = row[3];     // 주소
                String phone = row[4];       // 전화번호
                if (stationName != null && !stationName.isEmpty() && address != null && !address.isEmpty() && phone != null && !phone.isEmpty()) {
                    return String.format("%s의 주소는 %s입니다. 전화번호는 %s입니다.", stationName.trim(), address.trim(), phone.trim());
                }
            } else if (filePath.contains("행정안전부_일선행정기관_주소와_전화번호_현황")) {
                // Headers: 기관유형,기관유형별분류,대표기관명,전체기관명,최하위기관명,대표전화번호,새우편번호,도로명주소
                String orgType = row[1]; // 기관유형별분류
                String orgName = row[4]; // 최하위기관명
                String phone = row[5];   // 대표전화번호
                String address = row[7]; // 도로명주소
                if (orgType != null && (orgType.contains("소방") || orgType.contains("경찰")) && orgName != null && !orgName.isEmpty() && address != null && !address.isEmpty() && phone != null && !phone.isEmpty()) {
                    return String.format("%s(%s)의 주소는 %s입니다. 대표 전화번호는 %s입니다.", orgName.trim(), orgType.trim(), address.trim(), phone.trim());
                }
            } else if (filePath.contains("경찰청_전국_경찰서_명칭_및_주소")) {
                // Headers: 시도경찰청,위치,경찰서명칭,경찰서주소
                String agency = row[0];     // 시도경찰청
                String stationName = row[2]; // 경찰서명칭
                String address = row[3];     // 경찰서주소
                if (stationName != null && !stationName.isEmpty() && address != null && !address.isEmpty()) {
                    return String.format("%s %s의 주소는 %s입니다.", agency.trim(), stationName.trim(), address.trim());
                }
            }
        } catch (ArrayIndexOutOfBoundsException e) {
            logger.warn("Skipping malformed CSV row: {} in file {}", Arrays.toString(row), filePath);
        }
        return null; // Return null if row is not relevant or malformed
    }
}