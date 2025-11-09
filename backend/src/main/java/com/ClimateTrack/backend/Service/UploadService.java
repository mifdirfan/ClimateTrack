package com.ClimateTrack.backend.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;

import java.time.Duration;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UploadService {

    private final S3Presigner s3Presigner;
    private final S3Client s3Client; // The standard S3 client for operations like delete

    @Value("${application.bucket.name}")
    private String bucketName;

    //public String generatePreSignedUrl(String filename, String filetype) {
    public Map<String, String> generatePreSignedUrl(String filename, String filetype) {
        // Define the S3 key, which includes the folder path
        String s3Key = "uploads/" + filename;

        // Create a PutObjectRequest to specify the bucket and key
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(s3Key)
                .contentType(filetype)
                .build();

        // Create the pre-signed URL request with a 10-minute expiration
        PresignedPutObjectRequest presignedRequest = s3Presigner.presignPutObject(builder ->
                builder.signatureDuration(Duration.ofMinutes(10))
                        .putObjectRequest(putObjectRequest)
        );

        //return presignedRequest.url().toString();
        return Map.of(
                "uploadUrl", presignedRequest.url().toString(),
                "key", s3Key
        );
    }

    /**
     * NEW: Generates a temporary, pre-signed URL to view a private S3 object.
     */
    public String generatePresignedGetUrl(String objectKey) {
        if (objectKey == null || objectKey.isBlank()) {
            return null;
        }

        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(10)) // The link will be valid for 10 minutes
                .getObjectRequest(getObjectRequest)
                .build();

        return s3Presigner.presignGetObject(presignRequest).url().toString();
    }

    /**
     * Deletes a file from the S3 bucket using its object key.
     * @param objectKey The key of the object to delete (e.g., "uploads/my-image.jpg").
     */
    public void deleteFile(String objectKey) {
        if (objectKey == null || objectKey.isBlank()) {
            System.out.println("Skipping deletion for null or empty objectKey.");
            return; // Do nothing if the key is invalid
        }

        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectKey)
                    .build();

            s3Client.deleteObject(deleteObjectRequest);
            System.out.println("Successfully deleted file with key: " + objectKey);
        } catch (Exception e) {
            // Log the error and re-throw it as a runtime exception
            System.err.println("Failed to delete file from S3. Key: " + objectKey);
            throw new RuntimeException("S3 file deletion failed for key: " + objectKey, e);
        }
    }
}
