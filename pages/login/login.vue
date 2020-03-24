<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<button type="default" open-type="getUserInfo" @getuserinfo="getUserInfo" withCredentials="true">小程序登录</button>
		<!-- #endif -->

		<!-- #ifdef APP-PLUS -->
		<button class="" @click="appLogin">APP微信授权登录</button>
		<!-- #endif -->
	</view>
</template>

<script>
	let _this, pageOptions;
	export default {
		data() {
			return {

			}
		},
		onLoad(options) {
			_this = this;
			pageOptions = options;
			console.log(options);
			
			// #ifndef APP-PLUS
			uni.login({
				success(res) {
					uni.getUserInfo({
						success(info) {

						},
						fail() {
							uni.showToast({
								title: "微信授权登录失败"
							})
						}
					})
				},
				fail() {
					uni.showToast({
						title: "微信授权登录失败"
					})
				}
			})
			// #endif
		},
		methods: {
			getUserInfo(res) {
				console.log(res);
				let userInfo = res.detail.userInfo;
				uni.login({
					provider:"weixin",
					success(res) {
						uni.request({
							method: "GET",
							url: _this.apiServer + "member&m=codeToSession&code=" + res.code,
							success(res) {
								let session_key = res.data.session_key;
								let openid = res.data.openid;
								uni.request({
									method: "POST",
									header: {
										'content-type': "application/x-www-form-urlencoded"
									},
									url: _this.apiServer+"member&m=login",
									data:{
										openid: openid,
										name: userInfo.nickName,
										face: userInfo.avatarUrl
									},
									success(res) {
										res = res.data;
										uni.showToast({
											title: "登录成功"
										});
										uni.setStorageSync("uid", res.data.u_id);
										uni.setStorageSync("uname", res.data.u_name);
										uni.setStorageSync("urandom", res.data.u_random);
										uni.setStorageSync("uface", res.data.u_face);
										if(pageOptions.backtype == 1) {
											uni.redirectTo({
												url: pageOptions.backpage
											})
										}else{
											uni.switchTab({
												url: pageOptions.backpage
											})
										}
									}
								})
							}
						})
					}
				})
			},
			appLogin: function() {
				uni.getProvider({
					service: 'oauth',
					success: function(res) {
						console.log(res.provider);
						//支持微信、qq和微博等
						if (~res.provider.indexOf('weixin')) {
							uni.login({
								provider: 'weixin',
								success: function(loginRes) {
									console.log('-------获取openid(unionid)-----');
									console.log(JSON.stringify(loginRes));
									// 获取用户信息
									uni.getUserInfo({
										provider: 'weixin',
										success: function(infoRes) {
											console.log('-------获取微信用户所有-----');
											console.log(JSON.stringify(infoRes.userInfo));
										}
									});
								}
							});
						}
					}
				});
			},
		}
	}
</script>

<style>

</style>
