package com.nc.mrbs.web.controller;


import com.alibaba.dubbo.config.annotation.Reference;
import com.nc.mrbs.rpc.service.CmsSubjectCommentService;
import com.nc.mrbs.rpc.service.CmsSubjectService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * 专题评论表 前端控制器
 * </p>
 *
 * @author niec
 * @since 2020-04-26
 */
@Api(description = "专题评论")
@RestController
@RequestMapping("/cmsSubjectComment")
public class CmsSubjectCommentController {
    @Reference(version = "${service.version.mrbs}")
    private CmsSubjectCommentService cmsSubjectCommentService;

}
