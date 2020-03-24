<template>
	<view class="yang-padding">
		<view class="myface">
			<image :src="myFace" mode="widthFix"></image>
		</view>
		<view class="yang-box-banner" style="margin:10rpx 0;">
			<view class="yang-items">
				<view class="line1">{{userInfo.artCount}}</text></view>
				<view class="line2">文章</view>
			</view>
			<view class="yang-items">
				<view class="line1">{{userInfo.u_integral}}</text></view>
				<view class="line2">积分</view>
			</view>
			<view class="yang-items">
				<view class="line1">{{userInfo.u_remainder}}</text></view>
				<view class="line2">余额</view>
			</view>
			<view class="yang-items">
				<view class="line1">0</text></view>
				<view class="line2">消息</view>
			</view>
		</view>
		<view class="yang-title yang-nowrap yang-space-between">
			<view class="yang-h5 yang-blod">我的文章</view>
		</view>
		<view @tap="operateAction" :id="item.art_id" :data-index="index" v-for="(item, index) in arts" :key="index" class="cu-card dynamic no-card" :class="index==0?'margin-top10':'margin-top'">
			<view class="cu-item shadow">
				<view class="text-content">
					{{item.art_title}}
				</view>
				<view class="grid flex-sub padding-lr" :class="item.num>1?'col-3 grid-square':'col-1'">
					<view class="bg-img" :class="item.num>1?'':'only-img'" :style="{'backgroundImage':'url('+host+item2.content+')'}"
					 v-for="(item2,index2) in item.photo" :key="index2">
					</view>
				</view>
				<view class="text-gray text-sm text-right padding">
					<text class="cuIcon-attentionfill margin-lr-xs"></text> {{item.hits}}
					<text class="cuIcon-appreciatefill margin-lr-xs"></text> {{item.click}}
					<text class="cuIcon-messagefill margin-lr-xs"></text> {{item.comments}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	let _this, page = 1,
		loginRes, isEnd = false;
	export default {
		data() {
			return {
				myFace: '',
				userInfo: {
					artCount: 0,
					u_remainder: 0,
					u_integral: 0
				},
				arts: [],
				host: ''
			}
		},
		onLoad() {
			_this = this;
			_this.host = _this.staticServer;
			loginRes = _this.checkLogin('../me/me', 2);
			if (!loginRes) {
				return false;
			}
			_this.myFace = loginRes[3];
		},
		onShow() {
			uni.request({
				url: _this.apiServer + "my&m=info",
				data: {
					uid: uni.getStorageSync("uid"),
					random: uni.getStorageSync("urandom")
				},
				method: "POST",
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				success(res) {
					if (res.data.status == 'ok') {
						let user = res.data.data;
						_this.userInfo = {
							u_integral: user.u_integral,
							u_remainder: user.u_remainder,
							artCount: user.artCount
						}
					} else {
						uni.showToast({
							title: res.data.data,
							icon: "none"
						});
					}
				}
			});
			_this.init();
			_this.getArtList();
		},
		methods: {
			init() {
				page = 1;
				isEnd = false;
				_this.arts = [];
			},
			getArtList() {
				uni.showLoading({
					title: "正在加载...",
					mask: !0
				})
				uni.request({
					url: _this.apiServer + "my&m=arts&page=" + page,
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						uid: uni.getStorageSync("uid"),
						random: uni.getStorageSync("urandom")
					},
					success(res) {
						let status = res.data.status;
						if (status == 'empty') {
							uni.showToast({
								title: "文章已全部加载"
							})
						} else if (status == 'ok') {
							_this.arts = _this.arts.concat(res.data.data);
							page++;
						}
					},
					complete() {
						uni.hideLoading();
					}
				})
			},
			operateAction(e) {
				console.log(e);
				let art_id = e.currentTarget.id, index = e.currentTarget.dataset.index;
				uni.showActionSheet({
					itemList: ['编辑文章', '查看文章', '删除文章'],
					success(res) {
						if(res.tapIndex == 0) {
							uni.navigateTo({
								url: "../artedit/artedit?art_id="+art_id
							})
						}else if(res.tapIndex == 1) {
							uni.navigateTo({
								url: "../info/info?art_id="+art_id
							})
						}else{
							_this.removeArt(art_id, index);
						}
					}
				})
			},
			removeArt(art_id, index) {
				_this.showModal("你确定要删除文章吗？", function(res){
					if(res.confirm) {
						console.log(art_id);
						uni.request({
							url: _this.apiServer + "my&m=removeArt",
							method: "POST",
							header: {
								'content-type': 'application/x-www-form-urlencoded'
							},
							data: {
								uid: uni.getStorageSync("uid"),
								random: uni.getStorageSync("urandom"),
								artId: art_id
							},
							success(res) {
								if(res.data.status == 'ok') {
									uni.showToast({title: "已删除", icon:"none"});
									_this.arts.splice(index, 1);
								}else{
									uni.showToast({
										title: res.data.data,
										icon: "none"
									})
								}
							}
						})
					}
				})
			}
		}
	}
</script>

<style>
	.yang-padding {
		padding: 0%;
	}

	.yang-box-banner {
		padding: 20upx 0;
		display: flex;
		flex-wrap: nowrap;
		overflow: hidden;
		background: #FFF;
	}

	.yang-box-banner .yang-items {
		width: 25%;
		border-right: 1px solid #F1F2F3;
		justify-content: center;
		line-height: 1.4em;
		text-align: center；
	}

	.yang-box-banner .yang-items:last-child {
		border: none;
	}

	.yang-box-banner .yang-items view {
		justify-content: center;
		text-align: center;
	}

	.yang-box-banner .yang-items text text {
		font-size: 22rupx;
		color: #666;
	}

	.yang-box-banner .line1 {
		font-size: 36upx;
		line-height: 60upx;
		overflow: hidden;
	}

	.yang-box-banner .line1 text {
		font-size: 26upx;
		color: #666;
		line-height: 65upx;
		margin-left: 5upx;
	}

	.yang-box-banner .line2 {
		font-size: 26upx;
		color: #666;
		line-height: 32upx;
	}

	.yang-nowrap {
		display: flex;
		flex-wrap: nowrap !important;
	}

	.yang-space-between {
		display: flex;
		justify-content: space-between !important;
	}

	.yang-title {
		padding: 10upx 20upx;
		line-height: 1.8em;
		background: #fff;
	}

	.yang-title .yang-text-small {
		color: #888;
	}

	.yang-more-bottom {
		font-size: 24upx;
		text-align: center;
		justify-content: center;
		padding: 15upx 0;
		line-height: 40upx;
	}

	.yang-more-bottom text {
		font-size: 24upx;
	}

	.yang-more-r {
		display: block;
		width: auto;
		flex-shrink: 0;
		font-size: 22upx;
	}

	.yang-more-r text {
		font-size: 22upx;
	}

	.myface {
		width: 88px;
		height: 88px;
		border: 5px solid #F1F2F3;
		border-radius: 100%;
		margin: 15px auto;
	}

	.myface image {
		width: 100%;
		border-radius: 100%;
	}

	.loadMore {
		width: 100%;
		padding: 8px 0;
		text-align: center;
		color: #CCCCCC;
	}
	.nav .cu-item {
		padding: 0 40upx;
	}
	.cu-card > .cu-item{
		margin: 0;
	}
	.cu-card.dynamic>.cu-item>.text-content{
		padding-top: 20upx;
	}
	.margin-top10{
		margin-top: 10upx;
	}
</style>
