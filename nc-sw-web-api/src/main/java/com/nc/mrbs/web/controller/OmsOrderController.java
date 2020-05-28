package com.nc.mrbs.web.controller;


import com.alibaba.dubbo.config.annotation.Reference;
import com.nc.mrbs.ResultJson;
import com.nc.mrbs.rpc.dto.OrderDto;
import com.nc.mrbs.rpc.service.OmsOrderService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * 订单表 前端控制器
 * </p>
 *
 * @author niec
 * @since 2020-05-21
 */
@Api(description = "商品订单")
@RestController
@RequestMapping("/omsOrder")
public class OmsOrderController {
    @Reference(version = "${service.version.mrbs}")
    private OmsOrderService omsOrderService;

    @ApiOperation(value = "创建新订单")
    @PostMapping()
    public ResultJson createOrder(OrderDto orderDto){
        return ResultJson.ok(omsOrderService.createOrder(orderDto));
    }

    @ApiOperation(value = "更新")
    @PutMapping()
    public ResultJson updateOrder(OrderDto orderDto){
        return ResultJson.ok(omsOrderService.updateOrder(orderDto));
    }



}
