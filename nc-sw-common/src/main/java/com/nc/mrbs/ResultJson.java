package com.nc.mrbs;

import lombok.Data;
import org.apache.commons.lang.StringUtils;


import java.io.Serializable;

/**
 * 返回json格式类
 *
 * @author liliang
 * @date 2018-12-06 15:00
 * @remark
 */
@Data
public class ResultJson<T> implements Serializable {

    private static final long serialVersionUID = -1018942016386433973L;

    private boolean success = true;
    private String errCode = StringUtils.EMPTY;
    private String errMsg = StringUtils.EMPTY;
    private Object data;

    public static <T> ResultJson<T> ok() {
        return new ResultJson<>();
    }

    public static <T> ResultJson<T> ok(T data) {
        ResultJson<T> resultJson = new ResultJson<>();
        resultJson.data = data;
        return resultJson;
    }

    public static <T> ResultJson<T> fail() {
        return fail("unknown_error", "未知错误");
    }

    public static <T> ResultJson<T> fail(String errCode) {
        ResultJson<T> resultJson = new ResultJson<>();
        resultJson.success = false;
        resultJson.errCode = errCode;
        resultJson.errMsg = errCode;
        return resultJson;
    }

    public static <T> ResultJson<T> fail(String errCode, String errMsg) {
        ResultJson<T> resultJson = new ResultJson<>();
        resultJson.success = false;
        resultJson.errCode = errCode;
        resultJson.errMsg = errMsg;
        return resultJson;
    }

}