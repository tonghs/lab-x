var CosAuth = require('./cos-auth'); // 这里引用了 cos-auth.js，下载地址为 https://unpkg.com/cos-js-sdk-v5/demo/common/cos-auth.min.js 
const config = require('../config.js')
const req = require('./request.js')

var Bucket = config.qcloudCosBucket;
var Region = config.qcloudCosRegion;
var ForcePathStyle = false; // 是否使用后缀式，涉及签名计算和域名白名单配置，后缀式说明看上文

var uploadFile = function (options) {
    // 请求用到的参数
    var prefix = 'https://' + Bucket + '.cos.' + Region + '.myqcloud.com/';
    if (ForcePathStyle) {
        // 后缀式请求在签名时域名使用地域域名，而不是存储桶域名，具体说明见本文上述“3.后缀式请求”
        prefix = 'https://cos.' + Region + '.myqcloud.com/' + Bucket + '/'; 
    }

    // 对更多字符编码的 url encode 格式
    var camSafeUrlEncode = function (str) {
        return encodeURIComponent(str)
            .replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*/g, '%2A');
    };

    // 获取临时密钥
    var stsCache;
    var getCredentials = function (callback) {
        if (stsCache && Date.now() / 1000 + 30 < stsCache.expiredTime) {
            callback(data.credentials);
            return;
        }
        req.request({
            method: 'POST',
            url: '/auth/cos_temp_credential/',
            dataType: 'json',
            success: function (result) {
                var data = result.data.content;
                var credentials = data.credentials;
                if (credentials) {
                    stsCache = data
                } else {
                    wx.showModal({title: '临时密钥获取失败', content: JSON.stringify(data), showCancel: false});
                }
                callback(stsCache && stsCache.credentials);
            },
            error: function (err) {
                wx.showModal({title: '临时密钥获取失败', content: JSON.stringify(err), showCancel: false});
            }
        });
    };

    // 计算签名
    var getAuthorization = function (options, callback) {
        getCredentials(function (credentials) {
            callback({
                XCosSecurityToken: credentials.sessionToken,
                Authorization: CosAuth({
                    SecretId: credentials.tmpSecretId,
                    SecretKey: credentials.tmpSecretKey,
                    Method: options.Method,
                    Pathname: options.Pathname,
                })
            });
        });
    };

    // 上传文件
    var uploadFile = function (filePath) {
        var Key = filePath.substr(filePath.lastIndexOf('/') + 1); // 这里指定上传的文件名
        var signPathname = '/'; // PostObject 接口 Key 是放在 Body 传输，所以请求路径和签名路径是 /
        if (ForcePathStyle) {
            // 后缀式请求在签名时用的路径，要包含存储桶名称，具体说明见本文上述“3.后缀式请求”
            signPathname = '/' + Bucket + '/';  
        }
        getAuthorization({Method: 'POST', Pathname: signPathname}, function (AuthData) {
            var requestTask = wx.uploadFile({
                url: prefix,
                name: 'file',
                filePath: filePath,
                formData: {
                    'key': Key,
                    'success_action_status': 200,
                    'Signature': AuthData.Authorization,
                    'x-cos-security-token': AuthData.XCosSecurityToken,
                    'Content-Type': '',
                },
                success: function (res) {
                    var url = prefix + camSafeUrlEncode(Key).replace(/%2F/g, '/');
                    if (/^2\d\d$/.test('' + res.statusCode)) {
                        if (options.success !== undefined) {
                            options.success({
                                "url": url,
                                "key": Key
                            })
                        }
                    } else {
                        if (options.fail !== undefined) {
                            options.fail(res)
                        }
                        wx.showModal({title: '上传失败', content: JSON.stringify(res), showCancel: false});
                    }
                    
                },
                fail: function (res) {
                    if (options.fail !== undefined) {
                        options.fail(res)
                    }
                    wx.showModal({title: '上传失败', content: JSON.stringify(res), showCancel: false});
                }
            });
            requestTask.onProgressUpdate(function (res) {
                //.log('进度:', res);
                if (options.onProgressUpdate !== undefined) {
                    options.onProgressUpdate(res)
                }
            });
        });
    };
    uploadFile(options.path);
};

module.exports = {
    uploadFile: uploadFile
}
