package com.andre_machado.desafio_seplag_musical.service;

import io.minio.BucketExistsArgs;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.http.Method;
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
import java.util.concurrent.TimeUnit;

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

            // Removida a política pública. Agora o acesso é apenas via URL assinada.

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

            File fileEntity = new File();
            fileEntity.setName(fileName);
            fileEntity.setSize(file.getSize());
            fileEntity.setMimeType(file.getContentType());
            fileEntity.setUrl(fileName); // Salvamos apenas o nome do arquivo (key)

            File savedFile = fileRepository.save(fileEntity);

            return new FileResponseDTO(
                    savedFile.getId(),
                    savedFile.getName(),
                    savedFile.getSize(),
                    savedFile.getMimeType(),
                    getPresignedUrl(fileName));
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
                getPresignedUrl(file.getUrl()));
    }

    public String getPresignedUrl(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            return null;
        }

        // Se o fileName já for uma URL completa, extraímos apenas o nome do arquivo
        // Isso ajuda na migração de dados antigos que tinham a URL completa
        if (fileName.contains("/")) {
            fileName = fileName.substring(fileName.lastIndexOf("/") + 1);
        }

        try {
            String url = minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(bucketName)
                            .object(fileName)
                            .expiry(30, TimeUnit.MINUTES)
                            .build());

            // Se a URL gerada usar o endpoint interno (ex: http://minio:9000),
            // substituímos pelo endpoint público para o frontend funcionar.
            if (minioEndpoint != null && minioPublicUrl != null && url.contains(minioEndpoint)) {
                url = url.replace(minioEndpoint, minioPublicUrl);
            }

            return url;
        } catch (Exception e) {
            log.error("Error generating presigned URL for file: {}", fileName, e);
            return null;
        }
    }
}
