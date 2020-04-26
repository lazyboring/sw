package com.nc.mrbs.rpc;


import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
@MapperScan(value = {"com.nc.mrbs.rpc.mapper"})

public class MrbsRpcServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(MrbsRpcServiceApplication.class, args);
    }

//    @Bean
//    RedisUtil redisUtil() {
//        return new RedisUtil();
//    }
}
