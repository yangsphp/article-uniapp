import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

//封装全局检查登录函数
Vue.prototype.checkLogin = function(backPage, backType) {
	let uid = uni.getStorageSync("uid");
	let uname = uni.getStorageSync("uname");
	let urandom = uni.getStorageSync("urandom");
	let uface = uni.getStorageSync("uface");
	if (uid == '' || uname == '' || urandom == '' || uface == '') {
		uni.redirectTo({
			url: "/pages/login/login?backpage=" + backPage + "&backtype=" + backType
		})
		return false;
	}
	return [uid, uname, urandom, uface];
}

Vue.prototype.showModal = function(content, callback) {
	uni.showModal({
		title: "提示",
		content: content,
		success: callback
	})
}

var APITOKEN  = 'api2018';

Vue.prototype.apiServer    = 'http://192.168.43.64/read/index.php?token='+APITOKEN+'&c=';
Vue.prototype.staticServer = 'http://192.168.43.64/read/';

Vue.prototype.apiServer    = 'http://192.168.0.129/read/index.php?token='+APITOKEN+'&c=';
Vue.prototype.staticServer = 'http://192.168.0.129/read/';

Vue.prototype.appid = 'wxbe4e808c11ec3c5f';
App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
