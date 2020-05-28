package com.nc.mrbs.rpc.exception;

/**
 * 登录失效异常
 *
 * @author liuhaixing
 * @date 2020-03-05 15:40
 * @remark
 */
public class LoginLoseException extends RuntimeException{
    private int code;

    public LoginLoseException(int code, String msg){
        super(msg);
        this.code = code;
    }

    public LoginLoseException(String msg){
        super(msg);
    }

    public int getCode() {
        return code;
    }
}
