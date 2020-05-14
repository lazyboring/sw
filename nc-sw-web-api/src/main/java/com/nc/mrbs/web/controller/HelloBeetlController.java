package com.nc.mrbs.web.controller;

import com.alibaba.dubbo.common.logger.Logger;
import com.alibaba.dubbo.common.logger.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * @author : niec
 * @description
 * @date : 2020-05-14 14:18
 */

@Controller
@RequestMapping("/home")
public class HelloBeetlController {

    private static Logger logger = LoggerFactory.getLogger(HelloBeetlController.class);

    /**
     * 测试beetl模板
     *
     * @return
     */
    @RequestMapping("/add")
    public ModelAndView home() {

        ModelAndView modelAndView = new ModelAndView();
        logger.info("add request");
        modelAndView.addObject("email", "apk2sf@163.com");
        modelAndView.setViewName("add");

        return modelAndView;
    }


}


