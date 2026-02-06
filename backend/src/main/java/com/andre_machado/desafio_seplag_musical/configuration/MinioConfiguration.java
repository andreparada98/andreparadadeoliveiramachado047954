package com.andre_machado.desafio_seplag_musical.configuration;

import io.minio.MinioClient;
import okhttp3.Dns;
import okhttp3.OkHttpClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Arrays;
import java.util.List;

@Configuration
public class MinioConfiguration {

    @Value("${minio.endpoint}")
    private String endpoint; 

    @Value("${minio.public-url}")
    private String publicUrl; 

    @Value("${minio.access-key}")
    private String accessKey;

    @Value("${minio.secret-key}")
    private String secretKey;

    @Bean
    public MinioClient minioClient() {
        String internalHost = endpoint.replace("http://", "").replace("https://", "").split(":")[0];
        String publicHost = publicUrl.replace("http://", "").replace("https://", "").split(":")[0];

        OkHttpClient httpClient = new OkHttpClient.Builder()
                .dns(new Dns() {
                    @Override
                    public List<InetAddress> lookup(String hostname) throws UnknownHostException {
                        if (hostname.equals(publicHost)) {
                            return Arrays.asList(InetAddress.getAllByName(internalHost));
                        }
                        return Dns.SYSTEM.lookup(hostname);
                    }
                })
                .build();

        return MinioClient.builder()
                .endpoint(publicUrl)
                .credentials(accessKey, secretKey)
                .region("us-east-1")
                .httpClient(httpClient)
                .build();
    }
}
