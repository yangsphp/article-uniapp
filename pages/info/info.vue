<template>
	<view class="" style="background-color: #fff;padding-bottom: 100upx;">
		<!-- 标题 -->
		<view :class="['yang-article-title', yangSkeleton == 'ing' ? 'yang-skeleton' : '']">{{article.art_title}}</view>
		<!-- 作者信息 -->
		<view class="yang-article-author-line">
			<view :class="['yang-article-author', yangSkeleton == 'ing' ? 'yang-skeleton' : '']">
				<image :src="article.u_face" mode="widthFix"></image>
				<view class="author-name">{{article.u_name}}</view>
			</view>
			<view>{{article.art_createtime}}</view>
		</view>
		<!-- 文章内容 -->
		<view class="yang-article-contents">
			<view :class="['text-item', yangSkeleton == 'ing' ? 'yang-skeleton' : '']">{{article.art_content}}</view>
			<block v-for="(item, index) in artPhoto" :key="index">
				<view :class="['img-item', yangSkeleton == 'ing' ? 'yang-skeleton' : '']">
					<image :src="item" :data-url="item" mode="widthFix" @tap="showImgs"></image>
				</view>
			</block>
		</view>
		<view class="cu-bar bg-white solid-bottom margin-top">
			<view class="action">
				<text class="cuIcon-titles text-orange "></text> 评论列表
			</view>
		</view>
		<view class="cu-card dynamic">
			<view class="cu-item">
				<view class="cu-list menu-avatar comment ">
					<view class="cu-item">
						<view class="cu-avatar round" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg);"></view>
						<view class="content">
							<view class="text-grey">凯尔</view>
							<view class="bg-grey padding-sm radius margin-top-sm  text-sm">
								<view class="flex">
									<view class="flex-sub">如果不能立足于大地，要这双脚又有何用?如果不能立足于大地，要这双脚又有何用?</view>
								</view>
							</view>
							<view class="margin-top-sm flex justify-between">
								<view class="text-gray text-df">2018年12月4日</view>
								<view>
									<text class="cuIcon-appreciate text-gray"></text>
									<text class="cuIcon-messagefill text-gray margin-left-sm"></text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="yang-operate">
			<view class="input-comment">
				<input type="text" value="" placeholder="输入评论..." />
				<button class="cu-btn round bg-red">发布</button>
			</view>
			<view class="click-share">
				<view class="user-click">
					<text class="lg text-gray cuIcon-appreciate"></text>
				</view>
				<view class="user-share">
					<text class="lg text-gray cuIcon-weixin"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	let artid, _this;
	export default {
		data() {
			return {
				article: [],
				artPhoto: [],
				yangSkeleton: 'ing'
			}
		},
		onLoad(options) {
			_this = this;
			artid = options.art_id;
			_this.getArticleInfo();
			_this.setView();
		},
		methods: {
			getArticleInfo() {
				uni.showLoading({
					title: "正在加载..."
				})
				uni.request({
					url: _this.apiServer + "art&m=infoWithUser",
					data: {
						artid: artid
					},
					success(res) {
						let data = res.data.data;
						//勾画骨架
						setTimeout(function() {
							for (let i = 0; i < data.photo.length; i++) {
								_this.artPhoto.push(_this.staticServer + data.photo[i].content);
							}
							_this.article = {
								art_id: data.art_id,
								u_name: data.u_name,
								u_face: data.u_face,
								art_title: data.art_title,
								art_createtime: data.art_createtime,
								art_content: data.art_content
							}
							_this.yangSkeleton = 'end';
							uni.hideLoading()
						}, 500);
					}
				})
			},
			showImgs(e) {
				let url = e.currentTarget.dataset.url;
				uni.previewImage({
					urls: _this.artPhoto,
					current: url
				})
			},
			setView() {
				uni.request({
					url: _this.apiServer + "art&m=view",
					data: {
						artid: artid
					},
					success(res) {

					}
				})
			}
		}

	}
</script>

<style>
	.cu-card>.cu-item {
		margin: 0;
	}

	.yang-skeleton {
		padding: 5px 0;
		background: #F1F2F3;
		border-radius: 8px;
	}

	.yang-article-title {
		margin: 0 12px 8px 12px;
		font-size: 26px;
		line-height: 1.5em;
		font-weight: 700;
	}

	.yang-article-author-line {
		margin: 3px 12px;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
	}

	.yang-article-author {
		display: flex;
		flex-wrap: nowrap;
	}

	.yang-article-author image {
		width: 28px;
		height: 28px;
		border-radius: 100%;
	}

	.yang-article-author .author-name {
		line-height: 28px;
		padding-left: 5px;
	}

	.yang-article-author-line .btn {
		display: inline-block;
		height: 28px;
		line-height: 28px;
		border-radius: 3px;
		padding: 0 10px;
		background: #00B26A;
		color: #FFFFFF;
	}

	.yang-article-info-line {
		margin: 8px 12px;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
	}

	.yang-article-info-line view {
		color: #888;
		line-height: 20px;
		font-size: 12px;
	}

	.yang-article-contents {
		margin: 10px 0;
	}

	.yang-article-contents .img-item {
		width: 100%;
	}

	.yang-article-contents .img-item image {
		width: 100%;
	}

	.yang-article-contents .text-item {
		margin: 8px 12px;
		line-height: 2.2em;
		font-size: 16px;
		color: #2F2F2F;
	}

	.yang-operate {
		width: 100%;
		height: 100upx;
		display: flex;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 1;
		background-color: #fff;
		align-items: center;
	}

	.input-comment {
		flex: 1;
		display: flex;
		align-items: center;
	}

	.input-comment input {
		padding: 0 20upx;
		flex: 1;
	}

	.click-share {
		width: 200upx;
		display: flex;
	}

	.click-share>view {
		flex: 1;
		text-align: center;
	}

	.click-share>view>text {
		font-size: 50upx;
	}
</style>
