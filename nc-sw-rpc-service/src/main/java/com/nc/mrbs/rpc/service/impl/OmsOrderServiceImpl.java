package com.nc.mrbs.rpc.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.nc.mrbs.rpc.dto.OrderDto;
import com.nc.mrbs.rpc.entity.OmsOrder;
import com.nc.mrbs.rpc.enums.HackerBusinessEnum;
import com.nc.mrbs.rpc.exception.HackerBusinessException;
import com.nc.mrbs.rpc.mapper.OmsOrderMapper;
import com.nc.mrbs.rpc.service.OmsOrderService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.BeanUtils;

/**
 * <p>
 * 订单表 服务实现类
 * </p>
 *
 * @author niec
 * @since 2020-05-21
 */
@Service(version = "${service.version.mrbs}")
public class OmsOrderServiceImpl extends ServiceImpl<OmsOrderMapper, OmsOrder> implements OmsOrderService {

    @Override
    public OrderDto createOrder(OrderDto orderDto) {
        OmsOrder omsOrder = new OmsOrder();
        BeanUtils.copyProperties(orderDto, omsOrder, "id");

        baseMapper.insert(omsOrder);

        orderDto.setId(omsOrder.getId());
        return orderDto;
    }

    @Override
    public OrderDto updateOrder(OrderDto orderDto) {
        OmsOrder omsOrder = new OmsOrder();
        BeanUtils.copyProperties(orderDto, omsOrder);

        int resNum = baseMapper.updateById(omsOrder);

        if (resNum != 1){
            throw  new HackerBusinessException(HackerBusinessEnum.PRODUCT_CONUT_IS_ZERO);
        }
            return orderDto;
    }

}
