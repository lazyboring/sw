package com.nc.mrbs.rpc.service;

import com.nc.mrbs.rpc.dto.OrderDto;
import com.nc.mrbs.rpc.entity.OmsOrder;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * <p>
 * 订单表 服务类
 * </p>
 *
 * @author niec
 * @since 2020-05-21
 */
public interface OmsOrderService extends IService<OmsOrder> {

    OrderDto createOrder(OrderDto orderDto);

    OrderDto updateOrder(OrderDto orderDto);
}
