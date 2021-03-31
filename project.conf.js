/*
fileName--为project目录下的子文件名，当fileName值存在时，则单独打包该文件夹下的项目
*/

// const fileName = null;
// 例 xxx--> projects下的目录名称
// const fileName = 'xxx'
// const fileName = 'status-pages'; // app相关状态页面/包括补件、审核状态等
// const fileName = 'economizer-sqdr';  // 省钱达人/一元购
// const fileName = 'jyc-xjd'; // 现金分期
// const fileName = 'credit-certification';//信用认证
// const fileName = 'credit-withdrawal';//信用提额
// const fileName = 'receive-pos';//免费领POS机
// const fileName = 'prepaid-refill';//话费充值
// const fileName = 'source-credit'; // 渠道授信
// const fileName = 'ayq-credit'; // 爱有钱H5实名授信
// const fileName = 'goodman-member'; // 好人会员
// const fileName = 'jxh-loan'; // 吉享花借钱
// const fileName = 'jxh-credit'; // 吉享花授信
// 解析指令参数
const argv = JSON.parse(process.env.npm_config_argv);
const config = {};

// 获取自定义参数
let idx = 2;
const cooked = argv.cooked;
const length = argv.cooked.length;
while ((idx += 2) <= length) {
  config[cooked[idx - 2]] = cooked[idx - 1];
}
console.log(config)
let fileName = "", baseUrl = "/custom-page/"

try {
  if (config['--project']) fileName = config['--project']
  if (config['--baseUrl']) baseUrl = `/${config['--baseUrl']}/`
} catch (e) {
  throw error('get project error')
  return false
}

module.exports = {
  fileName,
  baseUrl
};
