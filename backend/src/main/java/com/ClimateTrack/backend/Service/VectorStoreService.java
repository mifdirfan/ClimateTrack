package com.ClimateTrack.backend.Service;

import com.ClimateTrack.backend.util.CsvReader; // <-- IMPORT CsvReader
import com.ClimateTrack.backend.util.PdfReader;
// --- REMOVE open-csv imports ---
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
// --- REMOVE ClassPathResource, io, and nio imports ---
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
// --- REMOVE Arrays import ---

@Service
public class VectorStoreService {

    private static final Logger logger = LoggerFactory.getLogger(VectorStoreService.class);

    private final EmbeddingService embeddingService;
    private final PdfReader pdfReader;
    private final CsvReader csvReader; // <-- ADD CsvReader dependency

    // In-memory store
    private final List<String> chunks = new ArrayList<>();
    private final List<float[]> embeddings = new ArrayList<>();

    // List of data files
    private final List<String> pdfFiles = List.of(
            "data/(MOHW)RevisionofMedicalEmergencyResponseManual.pdf",
            "data/Emergency_Procedures_Manual_for_Foreigners(English).pdf",
            "data/are-you-ready-guide.pdf"
            // "data/Dosnewnidm.pdf",
            // "data/DisasterPreventionPreparedness.pdf"
    );

    private final List<String> csvFiles = List.of(
            "data/소방청_시도_소방서_현황_20250701.csv",
            "data/행정안전부_일선행정기관_주소와_전화번호_현황_20230701.csv",
            "data/경찰청_전국_경찰서_명칭_및_주소_20230627.csv"
    );

    // --- UPDATE Constructor to inject CsvReader ---
    public VectorStoreService(EmbeddingService embeddingService, PdfReader pdfReader, CsvReader csvReader) {
        this.embeddingService = embeddingService;
        this.pdfReader = pdfReader;
        this.csvReader = csvReader; // <-- ADD this line
    }



    @Async
    public void buildVectorStore() {
        logger.info("--- [BACKGROUND] Starting Vector Store Initialization ---");
        try {
            List<String> allChunks = new ArrayList<>();
            StringBuilder pdfTextBuilder = new StringBuilder();

            // 1. Load and combine all PDF text
            for (String pdfPath : pdfFiles) {
                logger.info("Loading PDF data from classpath: {}", pdfPath);
                String text = pdfReader.extractTextFromClasspathPdf(pdfPath);
                if (text.isEmpty()) {
                    logger.warn("No text extracted from PDF: {}", pdfPath);
                } else {
                    logger.info("Extracted {} characters from PDF: {}", text.length(), pdfPath);
                    pdfTextBuilder.append(text).append("\n\n");
                }
            }
            allChunks.addAll(chunkTextByParagraph(pdfTextBuilder.toString()));
            logger.info("Generated {} chunks from PDF files.", allChunks.size());

            // 2. Load and parse all CSV text (NOW SIMPLIFIED)
            List<String> csvChunks = parseCsvsToChunks(csvFiles);
            allChunks.addAll(csvChunks);
            logger.info("Generated {} chunks from CSV files.", csvChunks.size());

            // 3. Index all chunks
            int indexedCount = 0;
            for (String chunk : allChunks) {
                if (chunk != null && !chunk.trim().isEmpty() && chunk.trim().length() > 10) {
                    try {
                        indexChunk(chunk);
                        indexedCount++;
                    } catch (Exception e) {
                        logger.error("Failed to index chunk: {}", e.getMessage());
                    }
                }
            }
            logger.info("Successfully indexed {} total chunks.", indexedCount);

        } catch (Exception e) {
            logger.error("Failed to initialize vector store: {}", e.getMessage(), e);
        }
        logger.info("--- Vector Store Initialization Complete ---");
    }

    /**
     * Parses a list of CSV files by delegating to the CsvReader.
     * (This method is now much simpler)
     */
    private List<String> parseCsvsToChunks(List<String> classpathCsvPaths) {
        List<String> csvChunks = new ArrayList<>();
        for (String csvPath : classpathCsvPaths) {
            // --- Delegate all the complex logic to the CsvReader ---
            List<String> chunksFromFile = csvReader.readAndFormatCsv(csvPath);
            csvChunks.addAll(chunksFromFile);
        }
        return csvChunks;
    }

    /**
     * This method is NO LONGER NEEDED here.
     * It has been MOVED to CsvReader.java
     */
    // private String formatCsvRowAsSentence(String filePath, String[] headers, String[] row) { ... }


    /**
     * Simple text chunking by splitting into paragraphs (based on blank lines).
     * (This method remains unchanged)
     */
    private List<String> chunkTextByParagraph(String text) {
        List<String> result = new ArrayList<>();
        if (text == null || text.isEmpty()) return result;
        String[] paragraphs = text.split("(\\s*\\r?\\n\\s*){2,}");
        for (String p : paragraphs) {
            String trimmedParagraph = p.trim();
            if (trimmedParagraph.length() > 20) {
                result.add(trimmedParagraph);
            }
        }
        return result;
    }

    /**
     * Generates embedding for a text chunk and adds it to the in-memory store.
     * (This method remains unchanged)
     */
    public void indexChunk(String text) {
        if (text == null || text.trim().isEmpty()) {
            logger.warn("Skipping indexing of null or empty chunk.");
            return;
        }
        logger.debug("Indexing chunk (first 50 chars): '{}...'", text.substring(0, Math.min(50, text.length())));
        try {
            float[] embedding = embeddingService.generateEmbedding(text);
            synchronized (chunks) {
                chunks.add(text);
                embeddings.add(embedding);
            }
        } catch (Exception e) {
            logger.error("Exception during indexing chunk: {}", e.getMessage());
        }
    }

    /**
     * Finds the top N text chunks most similar to a given query embedding.
     * (This method remains unchanged)
     */
    public List<String> findSimilarChunks(float[] queryEmbedding, int topN) {
        if (queryEmbedding == null || topN <= 0) {
            return List.of();
        }

        List<String> currentChunks;
        List<float[]> currentEmbeddings;
        synchronized(chunks) {
            if (embeddings.isEmpty()) return List.of();
            currentChunks = new ArrayList<>(chunks);
            currentEmbeddings = new ArrayList<>(embeddings);
        }

        Map<Integer, Double> similarities = new HashMap<>();
        for (int i = 0; i < currentEmbeddings.size(); i++) {
            float[] chunkEmbedding = currentEmbeddings.get(i);
            if(chunkEmbedding.length != queryEmbedding.length){
                logger.warn("Embedding dimension mismatch at index {}. Skipping similarity calculation.", i);
                continue;
            }
            similarities.put(i, cosineSimilarity(queryEmbedding, chunkEmbedding));
        }

        if (similarities.isEmpty()) return List.of();

        List<Map.Entry<Integer, Double>> sortedEntries = new ArrayList<>(similarities.entrySet());
        sortedEntries.sort((e1, e2) -> e2.getValue().compareTo(e1.getValue()));

        List<String> results = new ArrayList<>();
        for (int i = 0; i < Math.min(topN, sortedEntries.size()); i++) {
            results.add(currentChunks.get(sortedEntries.get(i).getKey()));
        }
        logger.debug("Found {} relevant chunks for query.", results.size());
        return results;
    }

    /**
     * Calculates the cosine similarity between two float vectors.
     * (This method remains unchanged)
     */
    private double cosineSimilarity(float[] vectorA, float[] vectorB) {
        if (vectorA == null || vectorB == null || vectorA.length != vectorB.length || vectorA.length == 0) {
            return 0.0;
        }
        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;
        for (int i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i] * vectorB[i];
            normA += vectorA[i] * vectorA[i];
            normB += vectorB[i] * vectorB[i];
        }
        if (normA == 0.0 || normB == 0.0) {
            return 0.0;
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}