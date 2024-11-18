//  #ifdef MP-WEIXIN

function wx_check_update(){
	const updateManager = wx.getUpdateManager()
	
	updateManager.onCheckForUpdate(function (res) {
	  // 请求完新版本信息的回调
	  console.log('hasUpdate',res.hasUpdate)
	})
	
	updateManager.onUpdateReady(function () {
	  wx.showModal({
	    title: '更新提示',
	    content: '新版本已经准备好，是否重启应用？',
	    success: function (res) {
	      if (res.confirm) {
	        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
	        updateManager.applyUpdate()
	      }
	    }
	  })
	})
	
	updateManager.onUpdateFailed(function () {
	  // 新版本下载失败
	  console.log('mp-新版本下载失败')
	})
}
	// #endif



function check(param = {}) {
	
	// 合并默认参数
	param = Object.assign({
		title: "检测到有新版本！",
		content: "请升级app到最新版本！",
		canceltext: "暂不升级",
		oktext: "立即升级",
		barbackground:"rgba(50,50,50,0.8)",
		barbackgroundactive:"rgba(32,165,58,1)"
	}, param)
	if (!param.api) {
		return false;
	}
	
	plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
		
		let platform = plus.os.name.toLowerCase()
		uni.request({
			url: param['api'],
			data: {
				platform: platform,
				version: widgetInfo.version
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			method: 'GET',
			dataType: 'json',
			success: (result) => {
				let res = result.data	
				console.log('check update res',res)
				let data = res.data
				if (data && res.code === 0 && data.url) {
					if(/\.wgt$/i.test(data.url) || (platform == 'android' &&  /\.apk$/i.test(data.url))){
						// 如果是热更新  wgt 或 android平台下apk
						startdownload(param,data);
						return
					}
					if (platform == 'ios') {
						// 如果是ios,则跳转到appstore
						plus.runtime.openURL(result.data.data.url)
						
					}
				}
			},
			fail: (res) => {
				
			}
		})
	});
}

function startdownload(param,data){
	uni.showModal({
		title: param.title,
		content: data.log ? data.log : param.content,
		showCancel: data.force ? false : true,
		confirmText: param.oktext,
		cancelText: param.canceltext,
		success: res => {
			if (!res.confirm) {
				console.log('取消了升级');
				return
			}
			if (data.shichang === 1 && /\.apk$/i.test(data.url)) {
				//去应用市场更新
				plus.runtime.openURL(data.shichangurl);
				plus.runtime.restart();
			} else {
				// 开始下载
				// 创建下载任务
				var dtask = plus.downloader.createDownload(data.url, {
						filename: "_downloads/"
					},
					function(d, status) {
						console.log('d',d)
						// 下载完成
						if (status == 200) {
							plus.runtime.install(d.filename, {
								force: false
							}, function() {
								//进行重新启动;
								plus.runtime.restart();
							}, (e) => {
								uni.showToast({
									title: '安装升级包失败:' + JSON.stringify(e),
									icon: 'none'
								})
								plus.downloader.clear();
							});
						} else {
							plus.nativeUI.alert("下载升级包失败，请手动去站点下载安装，错误码: " + status);
							plus.downloader.clear();
						}
						plus.nativeUI.closeWaiting();  
				});
				
				let wrapwidth=parseInt(plus.screen.resolutionWidth / 2);
				let view = new plus.nativeObj.View("maskView", {
					backgroundColor: param.barbackground,
					left: (wrapwidth/2) + "px",
					bottom: "80px",
					width: wrapwidth+"px",
					height: "10px"
				});
				
				view.show()
				let viewinner = new plus.nativeObj.View("maskViewinner", {
					backgroundColor: param.barbackgroundactive,
					left: (wrapwidth/2)+"px",
					bottom: "80px",
					width: "1px",
					height: "10px"
				});
				viewinner.show()
				dtask.addEventListener("statechanged", (e) => {
					if (e && e.downloadedSize > 0) {
						let jindu = parseInt((e.downloadedSize / e.totalSize)*wrapwidth)
						viewinner.setStyle({width:jindu+'px'});
					}
				}, false);
				dtask.start();
			}
		}
	});
}

export default {
	//  #ifdef MP-WEIXIN
	 wx_check_update,
	// #endif
	
	check
}
