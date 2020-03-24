<template>
	<view>
		<scroll-view scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft">
			<view class="cu-item" :class="index==TabCur?'text-red cur':''" v-for="(item,index) in categories" :key="index" @tap="tabSelect"
			 :data-id="item.cateId">
				{{item.name}}
			</view>
		</scroll-view>
		<block v-for="(item, index) in artList" :key="index">
			<navigator :url="'../info/info?art_id='+item.art_id" class="cu-card dynamic margin-top" :class="(item.num>1)?'no-card':''">
				<view class="cu-item shadow">
					<view class="cu-list menu-avatar">
						<view class="cu-item">
							<view class="cu-avatar round lg" :style="{'backgroundImage':'url('+item.u_face+')'}"></view>
							<view class="content flex-sub">
								<view>{{item.u_name}}</view>
								<view class="text-gray text-sm flex justify-between">
									{{item.time}}
								</view>
							</view>
						</view>
					</view>
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
			</navigator>
		</block>
	</view>
</template>

<script>
	let sign = require("../../commons/sign.js");
	let _this, page = 1,
		catid = 0,
		isEnd = false;
	export default {
		data() {
			return {
				TabCur: 0,
				scrollLeft: 0,

				categories: [{
					cateId: 0,
					name: "全部"
				}],
				artList: [],
				host: ''
			}
		},
		onLoad() {
			_this = this;
			_this.host = _this.staticServer;
			// 加载文章分类
			uni.request({
				url: _this.apiServer + 'category&m=index',
				method: 'GET',
				success: res => {
					if (res.data.status == 'ok') {
						var categories = res.data.data;
						for (var k in categories) {
							_this.categories.push({
								cateId: k,
								name: categories[k]
							});
						}
						_this.getArticleList();
					} else {
						uni.showToast({
							title: res.data.data,
							icon: "none"
						})
					}
				}
			});
		},
		onPullDownRefresh() {
			_this.init();
			_this.getArticleList();
		},
		onReachBottom() {
			_this.getArticleList();
		},
		methods: {
			init() {
				page = 1;
				isEnd = false;
				_this.artList = [];
			},
			tabSelect(e) {
				_this.TabCur = e.currentTarget.dataset.id;
				_this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
				catid = _this.categories[_this.TabCur].cateId;
				_this.init();
				_this.getArticleList();
			},
			getArticleList() {
				if (isEnd) {
					return false;
				}
				uni.showLoading({
					title: "正在加载...",
					mask: true
				})
				uni.request({
					url: _this.apiServer + 'art&m=getList',
					method: "GET",
					data: {
						cate: catid,
						page: page
					},
					success(res) {
						if (res.data.status == 'empty') {
							isEnd = true;
							uni.showToast({
								title: "已全部加载文章",
								icon: "none"
							})
						} else if (res.data.status == 'ok') {
							_this.artList = _this.artList.concat(res.data.data);
							page++;
						}
					},
					complete() {
						uni.hideLoading();
						uni.stopPullDownRefresh();
					}
				})
			}
		}
	}
</script>

<style>
	.nav .cu-item {
		padding: 0 40upx;
	}

	.cu-card>.cu-item {
		margin: 0;
	}
</style>
