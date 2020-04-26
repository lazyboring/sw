package com.nc.mrbs.web.controller;


import com.alibaba.dubbo.config.annotation.Reference;
import com.nc.mrbs.ResultJson;
import com.nc.mrbs.rpc.service.CmsSubjectService;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.stereotype.Controller;

/**
 * <p>
 * 专题表 前端控制器
 * </p>
 *
 * @author niec
 * @since 2020-04-26
 */
@Controller
@RequestMapping("/nc.mrbs/cmsSubject")
public class CmsSubjectController {

    @Reference(version = "${service.version.mrbs}")
    private CmsSubjectService cmsSubjectService;

    @ApiOperation(value = "查询")
    @GetMapping("/get")
    public ResultJson get(Long id){
        return ResultJson.ok(cmsSubjectService.selectCmsSubjectById(id));
    }
}
