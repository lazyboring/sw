package com.nc.mrbs.rpc.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.nc.mrbs.rpc.entity.CmsHelp;
import com.nc.mrbs.rpc.mapper.CmsHelpMapper;
import com.nc.mrbs.rpc.service.CmsHelpService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;


/**
 * <p>
 * 帮助表 服务实现类
 * </p>
 *
 * @author niec
 * @since 2020-04-26
 */
@Service
public class CmsHelpServiceImpl extends ServiceImpl<CmsHelpMapper, CmsHelp> implements CmsHelpService {

}
