package com.nc.mrbs.rpc.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import java.time.LocalDateTime;
import com.baomidou.mybatisplus.annotation.TableField;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 专题表
 * </p>
 *
 * @author niec
 * @since 2020-04-26
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class CmsSubject implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("category_id")
    private Long categoryId;

    @TableField("title")
    private String title;

    /**
     * 专题主图
     */
    @TableField("pic")
    private String pic;

    /**
     * 关联产品数量
     */
    @TableField("product_count")
    private Integer productCount;

    @TableField("recommend_status")
    private Integer recommendStatus;

    @TableField("create_time")
    private LocalDateTime createTime;

    @TableField("collect_count")
    private Integer collectCount;

    @TableField("read_count")
    private Integer readCount;

    @TableField("comment_count")
    private Integer commentCount;

    /**
     * 画册图片用逗号分割
     */
    @TableField("album_pics")
    private String albumPics;

    @TableField("description")
    private String description;

    /**
     * 显示状态：0->不显示；1->显示
     */
    @TableField("show_status")
    private Integer showStatus;

    @TableField("content")
    private String content;

    /**
     * 转发数
     */
    @TableField("forward_count")
    private Integer forwardCount;

    /**
     * 专题分类名称
     */
    @TableField("category_name")
    private String categoryName;


}
