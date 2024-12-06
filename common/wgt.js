import Vue from 'vue';

const check = (params) => {
    return Vue.prototype.$u.post('wgt/check', params);
};

const download = (params) => {
    return Vue.prototype.$u.get('wgt/download', params);
};

const start = (data) => {
    // #ifdef APP-PLUS

    // 创建下载任务
    var dtask = plus.downloader.createDownload(data.url, {
            filename: "_downloads/"
        },
        function (d, status) {
            console.log('d', d)
            // 下载完成
            if (status == 200) {
                plus.runtime.install(d.filename, {
                    force: false
                }, function () {
                    uni.showModal({
                        title: '提示',
                        content: '资源更新成功，是否重启应用？',
                        success: function (res) {
                            if (res.confirm) {
                                //进行重新启动;
                                plus.runtime.restart();
                            }else{
                                uni.showToast({
                                    title: '好的，将在下次重启后生效',
                                    icon: 'none'
                                })
                            }
                        }
                    })
                }, (e) => {
                    uni.showToast({
                        title: '安装升级包失败:' + JSON.stringify(e),
                        icon: 'none'
                    })
                    plus.downloader.clear();
                });
            } else {
                plus.downloader.clear();
                console.log('下载wgt失败，状态码：' + status);
            }
            plus.nativeUI.closeWaiting();
        });
    // #endif
};

export default {
    check,
    download,
    start
};
