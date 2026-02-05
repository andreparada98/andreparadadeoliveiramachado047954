package com.andre_machado.desafio_seplag_musical.service;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import com.andre_machado.desafio_seplag_musical.domain.dto.FileResponseDTO;
import com.andre_machado.desafio_seplag_musical.domain.model.File;
import com.andre_machado.desafio_seplag_musical.repository.FileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileService {

    private final MinioClient minioClient;
    private final FileRepository fileRepository;

    @Value("${minio.bucket-name}")
    private String bucketName;

    @Value("${minio.endpoint}")
    private String minioEndpoint;

    @Value("${minio.public-url}")
    private String minioPublicUrl;

    public FileResponseDTO uploadFile(MultipartFile file) {
        try {
            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
            if (!found) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
            }

            String policy = "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Action\":[\"s3:GetBucketLocation\",\"s3:ListBucket\"],\"Effect\":\"Allow\",\"Principal\":{\"AWS\":[\"*\"]},\"Resource\":[\"arn:aws:s3:::"
                    + bucketName
                    + "\"]},{\"Action\":[\"s3:GetObject\"],\"Effect\":\"Allow\",\"Principal\":{\"AWS\":[\"*\"]},\"Resource\":[\"arn:aws:s3:::"
                    + bucketName + "/*\"]}]}";
            minioClient.setBucketPolicy(
                    io.minio.SetBucketPolicyArgs.builder()
                            .bucket(bucketName)
                            .config(policy)
                            .build());

            String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();

            try (InputStream is = file.getInputStream()) {
                minioClient.putObject(
                        PutObjectArgs.builder()
                                .bucket(bucketName)
                                .object(fileName)
                                .stream(is, file.getSize(), -1)
                                .contentType(file.getContentType())
                                .build());
            }

            String url = getFileUrl(fileName);

            File fileEntity = new File();
            fileEntity.setName(fileName);
            fileEntity.setSize(file.getSize());
            fileEntity.setMimeType(file.getContentType());
            fileEntity.setUrl(url);

            File savedFile = fileRepository.save(fileEntity);

            return new FileResponseDTO(
                    savedFile.getId(),
                    savedFile.getName(),
                    savedFile.getSize(),
                    savedFile.getMimeType(),
                    savedFile.getUrl());
        } catch (Exception e) {
            log.error("Error uploading file to MinIO", e);
            throw new RuntimeException("Could not upload file", e);
        }
    }

    public FileResponseDTO getFileById(UUID id) {
        File file = fileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));

        return new FileResponseDTO(
                file.getId(),
                file.getName(),
                file.getSize(),
                file.getMimeType(),
                file.getUrl());
    }

    public String getFileUrl(String fileName) {
        return String.format("%s/%s/%s", minioPublicUrl, bucketName, fileName);
    }
}
