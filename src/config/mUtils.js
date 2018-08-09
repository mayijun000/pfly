/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
	if(!name) return;
	if(typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
export const getStore = name => {
	if(!name) return;
	return window.localStorage.getItem(name);
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
	if(!name) return;
	window.localStorage.removeItem(name);
}

//保存cookie
export const setCookie = (name, value, days) => {
	let d = new Date;
	d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
	window.document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}
//获得cookie
export const getCookie = name => {
	var v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	return v ? v[2] : null;
}
//删除cookie
export const deleteCookie = name => {
	setCookie(name, '', -1);
}

//日期格式化方法
Date.prototype.format = function(format) {
	var date = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S+": this.getMilliseconds()
	};
	if(/(y+)/i.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	for(var k in date) {
		if(new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
				date[k] : ("00" + date[k]).substr(("" + date[k]).length));
		}
	}
	return format;
}

Date.prototype.getWeekNumber = function() {
	let time = this.getTime();
	let week;
	//this.setDate(this.getDate() + 4 - (this.getDay() || 7));
	this.setMonth(0);
	this.setDate(1);
	week = Math.floor(Math.round((time - this) / 86400000) / 7) + 1;
	return week;
}
//根据周数，得到日期类型
export const getWeekDate = (year, week) => {
	var d = new Date(year, 0, 1);
	while(d.getDay() != 1) {
		d.setDate(d.getDate() + 1);
	}
	var to = new Date(year + 1, 0, 1);
	var i = 1;
	for(var from = d; from < to;) {
		if(i == week) {
			return from;
		}
		//alert(from.getDate());
		from.setTime(from.getTime() + 7 * 24 * 60 * 60 * 1000);
		i++;
	}
}

//根据周数，得到日期类型
export const getMonthDate = (year, month) => {
	var d = new Date(year, month, 0);
	return d;
}


//生成uuid
export const getUUID = (len, radix) => {
	let chars = '0123456789abcdefghijklmnopqrstuvwxyz'.split(''),
		uuid = [],
		i;
	radix = radix || chars.length;
	if(len) {
		// Compact form   
		for(i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
	} else {
		// rfc4122, version 4 form   
		let r;
		// rfc4122 requires these characters   
		uuid[8] = uuid[13] = uuid[18] = uuid[23];
		uuid[14] = '4';
		// Fill in random data.  At i==19 set the high bits of clock sequence as   
		// per rfc4122, sec. 4.1.5   
		for(i = 0; i < 36; i++) {
			if(!uuid[i]) {
				r = 0 | Math.random() * 16;
				uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
			}
		}
	}
	return uuid.join('');
};

//合并单元格算法
export const combineCell = list => {
	list.sort(function(a, b) {
		if(a.deliveryNum == b.deliveryNum) {
			return 0;
		} else if(a.deliveryNum < b.deliveryNum) {
			return -1;
		} else {
			return 1
		}
	});
	for(let field in list[0]) {
		let k = 0;
		while(k < list.length) {
			list[k][field + 'span'] = 1;
			list[k][field + 'dis'] = false;
			let i = 0;
			for(i = k + 1; i <= list.length - 1; i++) {
				if(list[k][field] == list[i][field] && list[k][field] != '') {
					list[k][field + 'span']++;
					list[k][field + 'dis'] = false;
					list[i][field + 'span'] = 1;
					list[i][field + 'dis'] = true;
				} else {
					break;
				}
			}
			k = i;
		}
	}
	return list;
}

/**
 * 获取style样式
 */
export const getStyle = (element, attr, NumberMode = 'int') => {
	let target;
	// scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
	if(attr === 'scrollTop') {
		target = element.scrollTop;
	} else if(element.currentStyle) {
		target = element.currentStyle[attr];
	} else {
		target = document.defaultView.getComputedStyle(element, null)[attr];
	}
	//在获取 opactiy 时需要获取小数 parseFloat
	return NumberMode == 'float' ? parseFloat(target) : parseInt(target);
}

/**
 * 页面到达底部，加载更多
 */
export const loadMore = (element, callback) => {
	let windowHeight = window.screen.height;
	let height;
	let setTop;
	let paddingBottom;
	let marginBottom;
	let requestFram;
	let oldScrollTop;

	document.body.addEventListener('scroll', () => {
		loadMore();
	}, false)
	//运动开始时获取元素 高度 和 offseTop, pading, margin
	element.addEventListener('touchstart', () => {
		height = element.offsetHeight;
		setTop = element.offsetTop;
		paddingBottom = getStyle(element, 'paddingBottom');
		marginBottom = getStyle(element, 'marginBottom');
	}, {
		passive: true
	})

	//运动过程中保持监听 scrollTop 的值判断是否到达底部
	element.addEventListener('touchmove', () => {
		loadMore();
	}, {
		passive: true
	})

	//运动结束时判断是否有惯性运动，惯性运动结束判断是非到达底部
	element.addEventListener('touchend', () => {
		oldScrollTop = document.body.scrollTop;
		moveEnd();
	}, {
		passive: true
	})

	const moveEnd = () => {
		requestFram = requestAnimationFrame(() => {
			if(document.body.scrollTop != oldScrollTop) {
				oldScrollTop = document.body.scrollTop;
				loadMore();
				moveEnd();
			} else {
				cancelAnimationFrame(requestFram);
				//为了防止鼠标抬起时已经渲染好数据从而导致重获取数据，应该重新获取dom高度
				height = element.offsetHeight;
				loadMore();
			}
		})
	}

	const loadMore = () => {
		if(document.body.scrollTop + windowHeight >= height + setTop + paddingBottom + marginBottom) {
			callback();
		}
	}
}

/**
 * 显示返回顶部按钮，开始、结束、运动 三个过程中调用函数判断是否达到目标点
 */
export const showBack = callback => {
	let requestFram;
	let oldScrollTop;

	document.addEventListener('scroll', () => {
		showBackFun();
	}, false)
	document.addEventListener('touchstart', () => {
		showBackFun();
	}, {
		passive: true
	})

	document.addEventListener('touchmove', () => {
		showBackFun();
	}, {
		passive: true
	})

	document.addEventListener('touchend', () => {
		oldScrollTop = document.body.scrollTop;
		moveEnd();
	}, {
		passive: true
	})

	const moveEnd = () => {
		requestFram = requestAnimationFrame(() => {
			if(document.body.scrollTop != oldScrollTop) {
				oldScrollTop = document.body.scrollTop;
				moveEnd();
			} else {
				cancelAnimationFrame(requestFram);
			}
			showBackFun();
		})
	}

	//判断是否达到目标点
	const showBackFun = () => {
		if(document.body.scrollTop > 500) {
			callback(true);
		} else {
			callback(false);
		}
	}
}

/**
 * 运动效果
 * @param {HTMLElement} element   运动对象，必选
 * @param {JSON}        target    属性：目标值，必选
 * @param {number}      duration  运动时间，可选
 * @param {string}      mode      运动模式，可选
 * @param {function}    callback  可选，回调函数，链式动画
 */
export const animate = (element, target, duration = 400, mode = 'ease-out', callback) => {
	clearInterval(element.timer);

	//判断不同参数的情况
	if(duration instanceof Function) {
		callback = duration;
		duration = 400;
	} else if(duration instanceof String) {
		mode = duration;
		duration = 400;
	}

	//判断不同参数的情况
	if(mode instanceof Function) {
		callback = mode;
		mode = 'ease-out';
	}

	//获取dom样式
	const attrStyle = attr => {
		if(attr === "opacity") {
			return Math.round(getStyle(element, attr, 'float') * 100);
		} else {
			return getStyle(element, attr);
		}
	}
	//根字体大小，需要从此将 rem 改成 px 进行运算
	const rootSize = parseFloat(document.documentElement.style.fontSize);

	const unit = {};
	const initState = {};

	//获取目标属性单位和初始样式值
	Object.keys(target).forEach(attr => {
		if(/[^\d^\.]+/gi.test(target[attr])) {
			unit[attr] = target[attr].match(/[^\d^\.]+/gi)[0] || 'px';
		} else {
			unit[attr] = 'px';
		}
		initState[attr] = attrStyle(attr);
	});

	//去掉传入的后缀单位
	Object.keys(target).forEach(attr => {
		if(unit[attr] == 'rem') {
			target[attr] = Math.ceil(parseInt(target[attr]) * rootSize);
		} else {
			target[attr] = parseInt(target[attr]);
		}
	});

	let flag = true; //假设所有运动到达终点
	const remberSpeed = {}; //记录上一个速度值,在ease-in模式下需要用到
	element.timer = setInterval(() => {
		Object.keys(target).forEach(attr => {
			let iSpeed = 0; //步长
			let status = false; //是否仍需运动
			let iCurrent = attrStyle(attr) || 0; //当前元素属性址
			let speedBase = 0; //目标点需要减去的基础值，三种运动状态的值都不同
			let intervalTime; //将目标值分为多少步执行，数值越大，步长越小，运动时间越长
			switch(mode) {
				case 'ease-out':
					speedBase = iCurrent;
					intervalTime = duration * 5 / 400;
					break;
				case 'linear':
					speedBase = initState[attr];
					intervalTime = duration * 20 / 400;
					break;
				case 'ease-in':
					let oldspeed = remberSpeed[attr] || 0;
					iSpeed = oldspeed + (target[attr] - initState[attr]) / duration;
					remberSpeed[attr] = iSpeed
					break;
				default:
					speedBase = iCurrent;
					intervalTime = duration * 5 / 400;
			}
			if(mode !== 'ease-in') {
				iSpeed = (target[attr] - speedBase) / intervalTime;
				iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
			}
			//判断是否达步长之内的误差距离，如果到达说明到达目标点
			switch(mode) {
				case 'ease-out':
					status = iCurrent != target[attr];
					break;
				case 'linear':
					status = Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) > Math.abs(iSpeed);
					break;
				case 'ease-in':
					status = Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) > Math.abs(iSpeed);
					break;
				default:
					status = iCurrent != target[attr];
			}

			if(status) {
				flag = false;
				//opacity 和 scrollTop 需要特殊处理
				if(attr === "opacity") {
					element.style.filter = "alpha(opacity:" + (iCurrent + iSpeed) + ")";
					element.style.opacity = (iCurrent + iSpeed) / 100;
				} else if(attr === 'scrollTop') {
					element.scrollTop = iCurrent + iSpeed;
				} else {
					element.style[attr] = iCurrent + iSpeed + 'px';
				}
			} else {
				flag = true;
			}

			if(flag) {
				clearInterval(element.timer);
				if(callback) {
					callback();
				}
			}
		})
	}, 20);
}