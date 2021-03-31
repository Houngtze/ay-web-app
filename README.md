##分支说明  
#### dev-aiyong 爱用开发分支
#### aiyong-release-test 爱用测试分支
#### dev-qyb 绿信权易宝开发分支 

##运行命令

#### cnpm i 安装依赖

#### npm run dev --project=xxx --baseUrl=xxx开发环境本地运行  

#### npm run build --project=xxx --baseUrl=xxx编译测试环境  

#### npm run prod --project=xxx --baseUrl=xxx编译正式环境


###约定参数
#####项目名称带"jxh-"的项目，是吉享花项目，账户/登陆体系使用jxh专用的。以链接名带"jxh-"为标识  

参数说明：  
project 需要编译的项目名称，例如--project=jxh-loan 则编译的是src/projects/jxh-loan项目  

baseUrl 编译到服务器下页面的访问路径，例如--baseUrl=jxh，则访问的是xxx.com/jxh/xxx的项目  
默认baseUrl为custom-page（ps:该参数不轻易加上。访问域名下根目录需要ng配置，找运维）  
例子：  
npm run dev --project=jxh-loan --baseUrl=jxh  
本地跑的是src/projects/jxh-loan吉享花


### 部分文件夹说明：
#### 1、src/components： 
404：通用404页面  
credit：旧版授信流程组件，部分业务有用到，当前不做维护  
jxh：包含吉享花相关项目的组件、授信、登录等功能  
loan: 包含旧版借钱业务，不做维护  
login： 爱用相关登录页面  
navigation： 仿原生组件，包括顶部导航和底部操作等  
NewCredit：当前爱用的需求所用到的授信流程  
randomRange：可滚动的range组件  
RenHangAuthorization：人行征信  
SalePageLayout：页面容器
