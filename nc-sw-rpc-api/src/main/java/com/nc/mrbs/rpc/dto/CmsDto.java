package com.nc.mrbs.rpc.dto;

import lombok.Data;

import java.io.Serializable;

/**
 * @author : niec
 * @description
 * @date : 2020-05-19 15:37
 */
@Data
public class CmsDto implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;

    private Long subjectId;

    private Integer showStatus;

}
