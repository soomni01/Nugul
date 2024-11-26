package com.example.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;


// CORS 문제를 해결 하기 위한, WebConfig
@Configuration
public class WebConfig {


    // TODO:  프론트 주소 변경해야할 가능성 농후
    private static final String DEVELOP_FRONT_ADDRESS = "http://localhost:3000";

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(DEVELOP_FRONT_ADDRESS)
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .exposedHeaders("location")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

}
