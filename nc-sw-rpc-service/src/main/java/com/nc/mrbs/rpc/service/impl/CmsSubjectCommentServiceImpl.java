package com.nc.mrbs.rpc.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.nc.mrbs.rpc.dto.CmsDto;
import com.nc.mrbs.rpc.entity.CmsSubjectComment;
import com.nc.mrbs.rpc.enums.HackerBusinessEnum;
import com.nc.mrbs.rpc.exception.HackerBusinessException;
import com.nc.mrbs.rpc.mapper.CmsSubjectCommentMapper;
import com.nc.mrbs.rpc.service.CmsSubjectCommentService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.BeanFactory;

/**
 * <p>
 * 专题评论表 服务实现类
 * </p>
 *
 * @author niec
 * @since 2020-04-26
 */
@Service(version = "${service.version.mrbs}")
public class CmsSubjectCommentServiceImpl extends ServiceImpl<CmsSubjectCommentMapper, CmsSubjectComment> implements CmsSubjectCommentService {

    @Override
    public CmsDto addCms(CmsDto cmsDto) {
        CmsSubjectComment cmsSubjectComment = new CmsSubjectComment();
        BeanUtils.copyProperties(cmsDto, cmsSubjectComment, "id");
        baseMapper.insert(cmsSubjectComment);

        cmsDto.setId(cmsSubjectComment.getId());

        return cmsDto;
    }

    @Override
    public CmsDto updateCms(CmsDto cmsDto) {
        CmsSubjectComment cmsSubjectComment = new CmsSubjectComment();
        BeanUtils.copyProperties(cmsDto, cmsSubjectComment);
        int resNum = baseMapper.updateById(cmsSubjectComment);

        if (resNum != 1) {
            throw new HackerBusinessException(HackerBusinessEnum.BUSINESS_OBJECT_IS_NULL);
        }
        return cmsDto;
    }
}
