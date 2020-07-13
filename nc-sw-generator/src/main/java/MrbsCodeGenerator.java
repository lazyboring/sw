import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.core.exceptions.MybatisPlusException;
import com.baomidou.mybatisplus.core.toolkit.StringPool;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.baomidou.mybatisplus.generator.AutoGenerator;
import com.baomidou.mybatisplus.generator.InjectionConfig;
import com.baomidou.mybatisplus.generator.config.*;
import com.baomidou.mybatisplus.generator.config.converts.MySqlTypeConvert;
import com.baomidou.mybatisplus.generator.config.po.TableInfo;
import com.baomidou.mybatisplus.generator.config.rules.IColumnType;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;
import com.baomidou.mybatisplus.generator.engine.FreemarkerTemplateEngine;

import java.io.File;
import java.util.*;

/**
 * <p>
 * mrbs代码生成器
 * </p>
 *
 * @author niec
 * @since 2020-04-26
 */
public class MrbsCodeGenerator {

    /**
     * 代码作者
     */
    private static final String AUTHOR = "niechen";

    /**
     * 数据库配置信息 DataSourceConfig
     */
    private static final String DRIVER_NAME = "com.mysql.jdbc.Driver";
    private static final String HOST = "localhost";
    private static final String PORT = "3306";
    private static final String DATABASE = "mall";
    private static final String USERNAME = "root";
    private static final String PASSWORD = "root";
    private static final String URL = "jdbc:mysql://" + HOST + StringPool.COLON + PORT + StringPool.SLASH + DATABASE + "?characterEncoding=utf8&useSSL=true";

    /**
     * 自定义模板
     */
    private static final String ENTITY_TEMPLATE_PATH = "/templates/entity.java.ftl";
    private static final String XML_TEMPLATE_PATH = "/templates/mapper.xml.ftl";
    private static final String MAPPER_TEMPLATE_PATH = "/templates/mapper.java.ftl";
    private static final String CONTROLLER_TEMPLATE_PATH = "/templates/controller.java.ftl";
    private static final String SERVICE_IMPL_TEMPLATE_PATH = "/templates/serviceImpl.java.ftl";
    private static final String SERVICE_TEMPLATE_PATH = "/templates/service.java.ftl";


    /**
     * 自定义模块名称
     */
    private static final String WEB_MODULE_NAME = "nc-sw-web-api";
    private static final String SERVICE_MODULE_NAME = "nc-sw-rpc-service";
    private static final String SERVICE_API_MODULE_NAME = "nc-sw-rpc-api";
    private static final String DAO_MODULE_NAME = "nc-sw-rpc-service";
    private static final String CLASS_ROUTE = "/src/main/java/com/nc/mrbs/";


    /**
     * 文件地址
     */
    private static final String FILE_PATH = new File("D:/tq/sw/nc-sw").getAbsolutePath();
    /**
     * 项目路径
     */
    private static final String PROJECT_PATH = FILE_PATH + StringPool.SLASH;

    public static void main(String[] args) {

        AutoGenerator mpg = new AutoGenerator();

        /**
         * 模板引擎配置		默认Velocity
         */
        //切换成Freemarker
        mpg.setTemplateEngine(new FreemarkerTemplateEngine());

        /**
         * 全局 相关配置
         */
        GlobalConfig globalConfig = new GlobalConfig();
        // 生成存放地址
        globalConfig.setOutputDir(null);
        // 是否覆盖已有文件
        globalConfig.setFileOverride(true);
        // 开启 ActiveRecord 模式
        globalConfig.setActiveRecord(false);
        // 是否在XML中添加二级缓存配置（XML 二级缓存）
        globalConfig.setEnableCache(false);
        //globalConfig.setEnableCache(true);
        // 开启 BaseResultMap（XML ResultMap,生成基本的resultMap）
        globalConfig.setBaseResultMap(true);
        // 开启 baseColumnList（XML columList,生成基本的SQL片段）
        globalConfig.setBaseColumnList(true);
        // 开发人员
        globalConfig.setAuthor(AUTHOR);
        // 是否打开输出目录
        globalConfig.setOpen(false);
        // 指定生成的主键的ID类型
        //globalConfig.setIdType(IdType.UUID);
        // 自定义文件命名，注意 %s 会自动填充表实体属性！（各层文件名称方式，例如： %Action 生成 UserAction）
        globalConfig.setMapperName("%sMapper");
        globalConfig.setXmlName("%sMapper");
        globalConfig.setServiceName("%sService");
        globalConfig.setServiceImplName("%sServiceImpl");
        globalConfig.setControllerName("%sController");
        mpg.setGlobalConfig(globalConfig);

        /**
         * 数据源配置
         */
        DataSourceConfig dataSourceConfig = new DataSourceConfig();
        dataSourceConfig.setDbType(DbType.MYSQL);
        dataSourceConfig.setTypeConvert(new MySqlTypeConvert() {
            // 自定义数据库表字段类型转换【可选】
            @Override
            public IColumnType processTypeConvert(GlobalConfig globalConfig, String fieldType) {
                System.out.println("转换类型：" + fieldType);
                //	注意！！processTypeConvert存在默认类型转换，如果不是你要的效果请自定义返回，非如下直接返回
                return super.processTypeConvert(globalConfig, fieldType);
            }
        });
        // 数据库驱动
        dataSourceConfig.setDriverName(DRIVER_NAME);
        // 数据库账号
        dataSourceConfig.setUsername(USERNAME);
        // 数据库密码
        dataSourceConfig.setPassword(PASSWORD);
        // 数据库地址
        dataSourceConfig.setUrl(URL);
        mpg.setDataSource(dataSourceConfig);

        /**
         * 数据库表配置（策略配置）
         */
        StrategyConfig strategyConfig = new StrategyConfig();
        // 全局大写命名 ORACLE 注意
        // strategy.setCapitalMode(true);
        // 此处可以修改为您的表前缀（用来去掉不想要的表前缀）
        //strategyConfig.setTablePrefix(new String[] { "sys_" });
        // 数据库表映射到实体的命名策略（表名生成策略）
        strategyConfig.setNaming(NamingStrategy.underline_to_camel);
        // 【实体】是否为Lombok模型（默认 false）
        strategyConfig.setEntityLombokModel(true);
        // 是否生成实体时，生成字段注解d
        strategyConfig.entityTableFieldAnnotationEnable(true);
        // 设置逻辑删除字段
        //strategyConfig.setLogicDeleteFieldName("data_status");
        strategyConfig.setInclude(scanner("数据表全称"));

        mpg.setStrategy(strategyConfig);

        /**
         * 包 相关配置
         */
        PackageConfig packageConfig = new PackageConfig();
        //父包名。如果为空，将下面子包名必须写全部， 否则就只需写子包名
        packageConfig.setParent("com");
        //父包模块名
        packageConfig.setModuleName("nc.mrbs");
        //Controller包名
        packageConfig.setController("web.controller");
        //Entity包名
        packageConfig.setEntity("rpc.entity");
        //Mapper包名
        packageConfig.setMapper("rpc.mapper");
        //Mapper XML包名
        packageConfig.setXml("mapper.xml");
        //Service包名
        packageConfig.setService("rpc.service");
        //Service Impl包名
        packageConfig.setServiceImpl("rpc.service.impl");
        mpg.setPackageInfo(packageConfig);

        /**
         * 注入自定义模板配置，可以在 VM 中使用 cfg.abc 设置的值
         * 自定义模板配置，可以 copy 源码 mybatis-plus/src/main/resources/template 下面内容修改，
         * 放置自己项目的 src/main/resources/templates 目录下, 默认名称一下可以不配置，也可以自定义模板名称
         */
        InjectionConfig injectionConfig = new InjectionConfig() {
            @Override
            public void initMap() {
                Map<String, Object> map = new HashMap<String, Object>(16);
                map.put("Author", "Author : " + this.getConfig().getGlobalConfig().getAuthor());
                this.setMap(map);
            }
        };
        //	取消自带（任何一个模块如果设置 空 OR Null 将不生成该模块）
        TemplateConfig templateConfig = new TemplateConfig();
        templateConfig.setXml(null);
        templateConfig.setController(null);
        templateConfig.setServiceImpl(null);
        mpg.setTemplate(templateConfig);
        //	设置自定义
        List<FileOutConfig> focList = new ArrayList<FileOutConfig>();
        //调整 xml 生成目录
        focList.add(new FileOutConfig(XML_TEMPLATE_PATH) {
            @Override
            public String outputFile(TableInfo tableInfo) {
                //	mapper.xml生成路径+名称		如果Entity设置了前后缀、此处注意xml的名称会跟着发生变化
                return PROJECT_PATH + DAO_MODULE_NAME + "/src/main/resources/mapping/" + tableInfo.getEntityName() + ConstVal.MAPPER + StringPool.DOT_XML;
            }
        });
        //调整 Entity 生成目录
        focList.add(new FileOutConfig(ENTITY_TEMPLATE_PATH) {
            @Override
            public String outputFile(TableInfo tableInfo) {
                //	Entity生成路径+名称		如果Entity设置了前后缀、此处名称会跟着发生变化
                return PROJECT_PATH + SERVICE_API_MODULE_NAME + CLASS_ROUTE + "rpc/entity/" + tableInfo.getEntityName() + StringPool.DOT_JAVA;
            }
        });
        //调整 Mapper 生成目录
        focList.add(new FileOutConfig(MAPPER_TEMPLATE_PATH) {
            @Override
            public String outputFile(TableInfo tableInfo) {
                //	Mapper生成路径+名称		如果Entity设置了前后缀、此处注意Mapper的名称会跟着发生变化
                return PROJECT_PATH + DAO_MODULE_NAME + CLASS_ROUTE + "rpc/mapper/" + tableInfo.getEntityName() + ConstVal.MAPPER + StringPool.DOT_JAVA;
            }
        });
        //调整Controller生成
        focList.add(new FileOutConfig(CONTROLLER_TEMPLATE_PATH) {
            @Override
            public String outputFile(TableInfo tableInfo) {
                //	Controller生成路径+名称		如果Entity设置了前后缀、此处注意Controller的名称会跟着发生变化
                return PROJECT_PATH + WEB_MODULE_NAME + CLASS_ROUTE + "web/controller/" + tableInfo.getEntityName() + ConstVal.CONTROLLER + StringPool.DOT_JAVA;
            }
        });
        //调整Service生成
        focList.add(new FileOutConfig(SERVICE_TEMPLATE_PATH) {
            @Override
            public String outputFile(TableInfo tableInfo) {
                //	Service生成路径+名称		如果Entity设置了前后缀、此处注意Service的名称会跟着发生变化
                return PROJECT_PATH + SERVICE_API_MODULE_NAME + CLASS_ROUTE + "rpc/service/" + tableInfo.getEntityName() + ConstVal.SERVICE + StringPool.DOT_JAVA;
            }
        });
        //调整ServiceImpl生成
        focList.add(new FileOutConfig(SERVICE_IMPL_TEMPLATE_PATH) {
            @Override
            public String outputFile(TableInfo tableInfo) {
                //	ServiceImpl生成路径+名称		如果Entity设置了前后缀、此处注意ServiceImpl的名称会跟着发生变化
                return PROJECT_PATH + SERVICE_MODULE_NAME + CLASS_ROUTE + "rpc/service/impl/" + tableInfo.getEntityName() + ConstVal.SERVICE_IMPL + StringPool.DOT_JAVA;
            }
        });

        injectionConfig.setFileOutConfigList(focList);
        mpg.setCfg(injectionConfig);

        /**
         * 生成代码
         */
        mpg.execute();

        /**
         * 打印注入设置【可无】
         */
        System.out.println(mpg.getCfg().getMap().get("Author"));
    }

    public static String scanner(String string){
        Scanner scanner = new Scanner(System.in);
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("请输入一个正确的" + string + "：");
        System.out.println(stringBuilder.toString());
        if (scanner.hasNext()) {
            String name = scanner.next();
            if (StringUtils.isNotEmpty(name)) {
                return name;
            }
        }
        throw new MybatisPlusException("请输入正确的" + string + "！！！");
    }

}