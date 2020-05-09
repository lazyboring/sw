package com.nc.mrbs.rpc.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.nc.mrbs.rpc.entity.SmsCoupon;
import com.nc.mrbs.rpc.mapper.SmsCouponMapper;
import com.nc.mrbs.rpc.service.SmsCouponService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;


/**
 * <p>
 * 优惠卷表 服务实现类
 * </p>
 *
 * @author niec
 * @since 2020-04-28
 */
@Service(version = "${service.version.mrbs}")
public class SmsCouponServiceImpl extends ServiceImpl<SmsCouponMapper, SmsCoupon> implements SmsCouponService {
    @Autowired
    private SmsCouponMapper smsCouponMapper;
}
