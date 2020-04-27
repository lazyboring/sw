package com.nc.mrbs.rpc.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.nc.mrbs.rpc.entity.CmsMemberReport;
import com.nc.mrbs.rpc.mapper.CmsMemberReportMapper;
import com.nc.mrbs.rpc.service.CmsMemberReportService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;


/**
 * <p>
 * 用户举报表 服务实现类
 * </p>
 *
 * @author niec
 * @since 2020-04-26
 */
@Service
public class CmsMemberReportServiceImpl extends ServiceImpl<CmsMemberReportMapper, CmsMemberReport> implements CmsMemberReportService {

}
