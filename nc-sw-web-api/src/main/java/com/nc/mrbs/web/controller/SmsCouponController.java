package com.nc.mrbs.web.controller;


import com.alibaba.dubbo.config.annotation.Reference;
import com.nc.mrbs.ResultJson;
import com.nc.mrbs.rpc.service.SmsCouponService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * 优惠卷表 前端控制器
 * </p>
 *
 * @author niec
 * @since 2020-04-28
 */
@Api(description = "优惠券")
@RestController
@RequestMapping("/smsCoupon")
public class SmsCouponController {
    @Reference(version  = "${service.version.mrbs}")
    private SmsCouponService smsCouponService;

    @ApiOperation(value = "查询")
    @GetMapping("/get")
    public ResultJson get(Long id){
        return ResultJson.ok(smsCouponService.getById(id));
    }
}
