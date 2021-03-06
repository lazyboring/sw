package com.nc.mrbs.rpc.service;

import com.nc.mrbs.rpc.entity.CmsSubject;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * <p>
 * 专题表 服务类
 * </p>
 *
 * @author niec
 * @since 2020-04-26
 */
public interface CmsSubjectService extends IService<CmsSubject> {

    CmsSubject selectCmsSubjectById(Long id);
}
