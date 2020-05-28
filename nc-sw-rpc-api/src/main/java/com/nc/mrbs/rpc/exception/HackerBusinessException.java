package com.nc.mrbs.rpc.exception;




import com.nc.mrbs.rpc.enums.HackerBusinessEnum;

import java.io.Serializable;

/**
 * 异常
 *
 * @author wwy
 * @date 2020-01-02 17:33
 */
public class HackerBusinessException extends RuntimeException implements Serializable {

    private String code;

    private String msg;

    public HackerBusinessException(){
        super();
    }

    public HackerBusinessException(String msg){
        super(msg);
        this.msg = msg;
    }

    public HackerBusinessException(HackerBusinessEnum mrbsBusinessEnum) {
        super(mrbsBusinessEnum.getErrorMessage());
        this.msg = mrbsBusinessEnum.getErrorMessage();
        this.code = mrbsBusinessEnum.getErrorCode();
    }

    public HackerBusinessException(String code, String msg) {
        super(msg);
        this.code = code;
        this.msg = msg;
    }

    public String getCode() {
        return code;
    }

    public String getMsg() {
        return msg;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
