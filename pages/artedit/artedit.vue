<template>
	<view class="wrap">
		<form @submit="submitArticle">
			<view class="cu-form-group">
				<view class="title">文章分类</view>
				<picker @change="PickerChange" :range="picker">
					<view class="picker">
						{{index>-1?picker[index]:'请选择分类'}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">标题</view>
				<input placeholder="请输入标题" name="input" v-model="title"></input>
			</view>
			<view class="cu-form-group">
				<textarea maxlength="-1" v-model="content" placeholder="请输入文章内容"></textarea>
			</view>
			<view class="cu-bar bg-white margin-top">
				<view class="action">
					图片上传
				</view>
				<view class="action">
					{{imgList.length}}/4
				</view>
			</view>
			<view class="cu-form-group">
				<view class="grid col-4 grid-square flex-sub">
					<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
						<image :src="imgList[index]" mode="aspectFill"></image>
						<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
							<text class='cuIcon-close'></text>
						</view>
					</view>
					<view class="solids" @tap="ChooseImage" v-if="imgList.length<4">
						<text class='cuIcon-cameraadd'></text>
					</view>
				</view>
			</view>
			<view class="padding-xl">
				<button class="cu-btn block bg-green margin-tb-sm lg" form-type="submit">提交文章</button>
			</view>
		</form>
	</view>
</template>

<script>
	let art_id, _this, loginRes, sign = require('../../commons/sign.js');
	export default {
		data() {
			return {
				title: '',
				content: '',
				index: -1,
				catid: 0,
				picker: [],
				lists: [],
				category: [],
				imgList: [],
				uploadIndex: 0
			}
		},
		onLoad(options) {
			art_id = options.art_id;
			_this = this;
			sign.sign(_this.apiServer);
			loginRes = this.checkLogin('../my/my', '2');
			if (!loginRes) {
				return false;
			}
			_this.getArticleInfo();
		},
		methods: {
			getArticleInfo() {
				uni.showLoading({
					title: "正在加载..."
				})
				uni.request({
					url: _this.apiServer + "art&m=info",
					data: {
						artid: art_id
					},
					success(res) {
						if (res.data.status == 'ok') {
							let data = res.data.data;
							_this.title = data.art_title;
							_this.content = data.art_content;
							_this.catid = data.art_cate;
							for (let i = 0; i < data.photo.length; i++) {
								_this.imgList.push(_this.staticServer + data.photo[i].content);
							}
							//获取分类
							uni.request({
								url: _this.apiServer + 'category&m=index',
								method: 'GET',
								success: res => {
									var categories = res.data.data;
									for (var k in categories) {
										_this.picker.push(categories[k]);
									}
									// 记录分类信息
									_this.category = categories;
									// 对应的查找picker的默认值
									var cateName = categories[_this.catid];
									for (var i = 0; i < _this.picker.length; i++) {
										if (cateName == _this.picker[i]) {
											_this.index = i;
											break;
										}
									}
								}
							});
						} else {
							uni.showToast({
								title: res.data.data,
								icon: "none"
							})
						}
					},
					complete() {
						uni.hideLoading();
					}
				})
			},
			ChooseImage() {
				uni.chooseImage({
					count: 4, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						if (_this.imgList.length != 0) {
							_this.imgList = _this.imgList.concat(res.tempFilePaths)
						} else {
							_this.imgList = res.tempFilePaths
						}
					}
				});
			},
			ViewImage(e) {
				uni.previewImage({
					urls: _this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			DelImg(e) {
				uni.showModal({
					title: '提示',
					content: '确定要删除图片吗？',
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							_this.imgList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			},
			submitArticle() {
				if (_this.index == -1) {
					uni.showToast({
						title: "请选择文章分类",
						icon: "none"
					});
					return false;
				}
				if (_this.title.length == 0) {
					uni.showToast({
						title: "请输入文章标题",
						icon: "none"
					});
					return false;
				}
				if (_this.content.length == 0) {
					uni.showToast({
						title: "请输入文章内容",
						icon: "none"
					});
					return false;
				}
				if (_this.imgList.length == 0) {
					uni.showToast({
						title: "请上传图片",
						icon: "none"
					});
					return false;
				}
				uni.showLoading({
					title: "正在上传..."
				});
				_this.uploadImg();
			},
			uploadImg() {
				let len = _this.imgList.length;
				if (_this.uploadIndex >= len) {
					_this.doSubmit();
				} else {
					let file = _this.imgList[_this.uploadIndex];
					if (file.indexOf(_this.appid) > 0) {
						uni.uploadFile({
							url: _this.apiServer + 'uploadimg',
							filePath: file,
							name: 'file',
							success(res) {
								res = JSON.parse(res.data);
								if (res.status != 'ok') {
									uni.showToast({
										title: "上传图片失败,请重试!",
										icon: "none"
									});
									return false;
								}
								_this.uploadIndex++;
								_this.lists.push(res.data);
								setTimeout(function() {
									_this.uploadImg();
								}, 1000)
							},
							fail() {
								uni.showToast({
									title: "上传图片失败,请重试!",
									icon: "none"
								});
							}
						})
					} else {
						_this.uploadIndex++;
						_this.lists.push(file.replace(_this.staticServer, ''));
						_this.uploadImg();
					}
				}
			},
			doSubmit() {
				uni.showLoading({
					title: "正在提交..."
				});
				uni.request({
					url: _this.apiServer + "art&m=edit&artid="+art_id,
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						title: _this.title,
						content: _this.content,
						lists: _this.lists,
						uid: loginRes[0],
						random: loginRes[2],
						cate: _this.catid,
						sign: uni.getStorageSync("sign"),
						articleId: art_id
					},
					success: function(res) {
						if (res.data.status == 'ok') {
							uni.showToast({
								title: "提交成功",
								icon: "success"
							});
							_this.imgList = _this.lists = [];
							// 清空数据
							sign.sign(_this.apiServer);
							// 防止数据缓存
							_this.index = -1;
							_this.content = '';
							_this.title = '';
							setTimeout(function() {
								uni.switchTab({
									url: '../me/me'
								})
							}, 1000);
						} else {
							uni.showToast({
								title: res.data.data,
								icon: "none"
							});
						}
					},
					complete() {
						uni.hideLoading();
					}
				})
			}
		}
	}
</script>

<style>

</style>
