package com.nc.mrbs.rpc.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.nc.mrbs.rpc.entity.CmsSubject;
import com.nc.mrbs.rpc.mapper.CmsSubjectMapper;
import com.nc.mrbs.rpc.service.CmsSubjectService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;


/**
 * <p>
 * 专题表 服务实现类
 * </p>
 *
 * @author niec
 * @since 2020-04-26
 */
@Service
public class CmsSubjectServiceImpl extends ServiceImpl<CmsSubjectMapper, CmsSubject> implements CmsSubjectService {

    @Autowired
    private CmsSubjectMapper cmsSubjectMapper;

    @Override
    public CmsSubject selectCmsSubjectById(Long id) {
        return cmsSubjectMapper.selectById(id);
    }
}
