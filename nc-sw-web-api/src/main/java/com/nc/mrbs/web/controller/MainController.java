package com.nc.mrbs.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author : niec
 * @description
 * @date : 2020-05-12 09:21
 */
@Controller
@RequestMapping("/main")
public class MainController {

    @GetMapping("/ou")
    public String get(){
        return "cms/cms.html";
    }
}
