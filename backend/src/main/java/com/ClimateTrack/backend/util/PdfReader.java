package com.ClimateTrack.backend.util;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;

@Component
public class PdfReader {

    private static final Logger logger = LoggerFactory.getLogger(PdfReader.class);

    /**
     * Extracts text from a PDF file located in the classpath (e.g., src/main/resources).
     * @param classpathPdfPath The path to the PDF within the classpath (e.g., "data/my_file.pdf").
     * @return The extracted text as a String.
     * @throws IOException If the file cannot be found or read.
     */
    public String extractTextFromClasspathPdf(String classpathPdfPath) throws IOException {
        logger.debug("Attempting to read PDF from classpath: {}", classpathPdfPath);

        ClassPathResource resource = new ClassPathResource(classpathPdfPath);
        if (!resource.exists()) {
            logger.error("PDF resource not found at classpath: {}", classpathPdfPath);
            throw new IOException("Resource not found: " + classpathPdfPath);
        }

        // --- FIX for ClassCastException ---
        // Read the InputStream into a byte array first
        try (InputStream inputStream = resource.getInputStream()) {
            byte[] pdfBytes = inputStream.readAllBytes();

            // Now, load the PDF from the byte array
            try (PDDocument document = Loader.loadPDF(pdfBytes)) { // <-- USE Loader.loadPDF(byte[])

                if (!document.isEncrypted()) {
                    PDFTextStripper stripper = new PDFTextStripper();
                    return stripper.getText(document);
                } else {
                    logger.warn("PDF file is encrypted, cannot extract text: {}", classpathPdfPath);
                    return ""; // Return empty for encrypted files
                }
            }
            // --- END FIX ---
        } catch (Exception e) {
            logger.error("Failed to read or parse PDF {}: {}", classpathPdfPath, e.getMessage(), e);
            throw new IOException("Failed to process PDF file: " + classpathPdfPath, e);
        }
    }
}