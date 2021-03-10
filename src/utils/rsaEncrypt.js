
import JSEncrypt from 'jsencrypt/bin/jsencrypt'
import Config from '@/settings'

// 密钥对生成 http://web.chacuo.net/netrsakeypair
// 公钥
const publicKey = Config.rsa.publicKey
// 私钥
const privateKey = Config.rsa.privateKey

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对需要加密的数据进行加密
}

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey)
  return encryptor.decrypt(txt)
}

