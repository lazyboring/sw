package com.nc.mrbs.rpc.config;

import com.baomidou.mybatisplus.core.injector.ISqlInjector;
import com.baomidou.mybatisplus.extension.injector.LogicSqlInjector;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author : niec
 * @description
 * @date : 2020-04-02 20:18
 */
@Configuration
public class MyBatisPlusConfiguration {
    @Bean
    public ISqlInjector sqlInjector(){
        return new LogicSqlInjector();
    }
}
