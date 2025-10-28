package com.ClimateTrack.backend.Service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Objects;

@Service
@Slf4j
public class S3Service {

    @Value("${application.bucket.name}")
    private String bucketName;

    private final S3Client s3Client;

    @Autowired
    public S3Service(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public String uploadFile(MultipartFile file) {
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .build();
            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            log.info("File uploaded successfully: {}", fileName);
            return s3Client.utilities().getUrl(b -> b.bucket(bucketName).key(fileName)).toString();
        } catch (IOException | S3Exception e) {
            log.error("Error uploading file: {}", fileName, e);
            throw new RuntimeException("Error uploading file to S3");
        }
    }

    public byte[] downloadFile(String fileName) {
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .build();
            return s3Client.getObject(getObjectRequest).readAllBytes();
        } catch (IOException | S3Exception e) {
            log.error("Error downloading file: {}", fileName, e);
            throw new RuntimeException("Error downloading file from S3");
        }
    }

    public String deleteFile(String fileName) {
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .build();
            s3Client.deleteObject(deleteObjectRequest);
            log.info("File deleted successfully: {}", fileName);
            return fileName + " removed ...";
        } catch (S3Exception e) {
            log.error("Error deleting file: {}", fileName, e);
            throw new RuntimeException("Error deleting file from S3");
        }
    }
}
