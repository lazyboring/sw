package com.nc.mrbs.rpc.dto;

import lombok.Data;

import java.io.Serializable;

/**
 * @author : niec
 * @description
 * @date : 2020-05-21 14:16
 */
@Data
public class OrderDto implements Serializable {
    private static final long serialVersionUID = 2L;

    private Long id;

    private Long memberId;

    private String orderSn;

    private String receiverName;

    private String receiverPhone;
}
