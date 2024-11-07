// crypto.js
import CryptoJS from 'crypto-js';
import conf from 'const'

const key = conf.key // 此处替换为实际的密钥

export function encrypt(data) {
    //console.log('key', key)
    // 确保密钥长度为32个字符，以使用AES-256-CBC
    if (key.length !== 32) {
        throw new Error('密钥长度必须为32个字符');
    }

    // 生成随机IV，长度为16字节
    let iv = CryptoJS.lib.WordArray.random(16);

    // 加密数据
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), CryptoJS.enc.Utf8.parse(key), {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    //解密测试
    //console.log('decode', decrypt(CryptoJS.enc.Base64.stringify(encrypted.ciphertext), CryptoJS.enc.Base64.stringify(iv), key));

    // 返回加密数据和IV
    return {
        encryptedData: CryptoJS.enc.Base64.stringify(encrypted.ciphertext), // 将密文转换为Base64字符串
        iv: CryptoJS.enc.Base64.stringify(iv) // 将IV转换为Base64字符串
    };
}

export function decrypt(encryptedDataBase64, ivBase64, key) {
    // Base64解码加密数据和IV
    const encryptedData = CryptoJS.enc.Base64.parse(encryptedDataBase64);
    const iv = CryptoJS.enc.Base64.parse(ivBase64);

    // 解密数据
    const decrypted = CryptoJS.AES.decrypt({
        ciphertext: encryptedData
    }, CryptoJS.enc.Utf8.parse(key), {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    // 将解密后的数据转换为字符串，然后转换为JSON对象
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
}
