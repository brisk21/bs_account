import Vue from 'vue';

const check = (params) => {
	return Vue.prototype.$u.post('wgt/check', params);
};

const download = (params) => {
	return Vue.prototype.$u.get('wgt/download', params);
};

const start = (data) => {
	// #ifdef APP-PLUS
	try {
		// 从缓存中获取当前应用的 WGT 版本列表
		let app_current_wgt_version = uni.getStorageSync('app_current_wgt_versions');
		if (app_current_wgt_version && !Array.isArray(app_current_wgt_version)) {
			app_current_wgt_version = JSON.parse(app_current_wgt_version);
		} else {
			app_current_wgt_version = []
		}

		// 创建下载任务
		var dtask = plus.downloader.createDownload(data.url, {
				filename: "_downloads/"
			},
			function(d, status) {
				// 下载完成
				if (status == 200) {
					// 安装下载的 WGT 包
					plus.runtime.install(d.filename, {
						force: true // 强制更新，不要判断版本号
					}, function() {
						// 更新缓存中的 WGT 版本列表
						app_current_wgt_version.push(data.wgt_version);
						uni.setStorageSync('app_current_wgt_versions',
						app_current_wgt_version); // 设置一个缓存
						console.log('更新成功，下次重启生效', uni.getStorageSync('app_current_wgt_versions'));
					}, function(e) {
						console.log('安装升级包失败:' + JSON.stringify(e));
						plus.downloader.clear();
					});
				} else {
					plus.downloader.clear();
					console.log('下载wgt失败，状态码：' + status);
				}
				plus.nativeUI.closeWaiting();
			});
		dtask.start();
	} catch (error) {
		console.error('发生错误:', error);
	}

	// #endif
};

export default {
	check,
	download,
	start
};