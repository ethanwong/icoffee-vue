/*
 * @Description:
 * @Author: Ethan Wong
 * @Date: 2021-01-19 10:03:01
 * @FilePath: \src\settings.js
 * @LastEditTime: 2021-03-10 14:48:46
 * @LastEditors: your name
 */

module.exports = {
  title: 'iCoffee Vue Admin',

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: true,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',

  /**
   * @description 记住密码状态下的token在Cookie中存储的天数，默认1天
   */
  tokenCookieExpires: 1,
  /**
   * @description 记住密码状态下的密码在Cookie中存储的天数，默认1天s
   */
  passCookieExpires: 1,

  /**
   * 用户登录密码加密的公钥和私钥
   */
  rsa: {
    publicKey: 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANL378k3RiZHWx5AfJqdH9xRNBmD9wGD\n' +
    '2iRe41HdTNF8RUhNnHit5NpMNtGL0NPTSSpPjjI1kJfVorRvaQerUgkCAwEAAQ==',
    privateKey: 'MIIBUwIBADANBgkqhkiG9w0BAQEFAASCAT0wggE5AgEAAkEA0vfvyTdGJkdbHkB8\n' +
    'mp0f3FE0GYP3AYPaJF7jUd1M0XxFSE2ceK3k2kw20YvQ09NJKk+OMjWQl9WitG9p\n' +
    'B6tSCQIDAQABAkA2SimBrWC2/wvauBuYqjCFwLvYiRYqZKThUS3MZlebXJiLB+Ue\n' +
    '/gUifAAKIg1avttUZsHBHrop4qfJCwAI0+YRAiEA+W3NK/RaXtnRqmoUUkb59zsZ\n' +
    'UBLpvZgQPfj1MhyHDz0CIQDYhsAhPJ3mgS64NbUZmGWuuNKp5coY2GIj/zYDMJp6\n' +
    'vQIgUueLFXv/eZ1ekgz2Oi67MNCk5jeTF2BurZqNLR3MSmUCIFT3Q6uHMtsB9Eha\n' +
    '4u7hS31tj1UWE+D+ADzp59MGnoftAiBeHT7gDMuqeJHPL4b+kC+gzV4FGTfhR9q3\n' +
    'tTbklZkD2A=='
  },
  /**
   * token秘钥
   */
  jwt: {
    secretKey: '088c49f786894126870318483b4fff7d'
  }

}
