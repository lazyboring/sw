package com.nc.mrbs.rpc.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.nc.mrbs.rpc.entity.CmsSubjectComment;
import com.nc.mrbs.rpc.mapper.CmsSubjectCommentMapper;
import com.nc.mrbs.rpc.service.CmsSubjectCommentService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

/**
 * <p>
 * 专题评论表 服务实现类
 * </p>
 *
 * @author niec
 * @since 2020-04-26
 */
@Service
public class CmsSubjectCommentServiceImpl extends ServiceImpl<CmsSubjectCommentMapper, CmsSubjectComment> implements CmsSubjectCommentService {

}
