webpackJsonp([1],{

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(7);


/***/ }),

/***/ 7:
/***/ (function(module, exports) {

$.fn.extend({

	_option : {
		width : '100%',
		height : '500px',
		showToolBar : true, //是否显示工具栏
		toolBar : ['bold','italic','underline','font','image','link','alignleft','aligncenter','alignright'], //工具栏数组 
		toolBarElement : '', //绑定工具栏元素
		uploadImageSize : 30, //图片上传的大小限制 30M
	},
	_qiniuInfo : {
		token : '', //七牛信息-token
		imgBase : '' //七牛信息-图片域名前缀
	},
	_fontColor : ['black','red','yellow','lime','blue','cyan','magenta','orange','green'],
	currentRange : '',
	supportsDOMRanges : '',

	// 构造函数
	ajEditor : function(option){
		window._this = this;

        // 重构 参数
        _this._option = $.extend(_this._option,option);


		// 修改 绑定元素的样式 contenteditable = true;
		var style = {
            "-webkit-user-select": "text",
            "user-select": "text",
            "overflow-y": "auto",
            "text-break": "brak-all",
            "outline": "none",
            "cursor": "text",
            "width" : _this._option.width,
            "height" : _this._option.height
        };

        $(this).css(style).attr('contenteditable',true);

        // 显示工具栏
        if(_this._option.showToolBar){
	        if(_this._option.toolBarElement){
	        	// 绑定工具栏
	        	$(_this._option.toolBarElement).addClass('editor-bar');
	        	$(_this._option.toolBarElement).next()[0] == $(_this)[0]?'':$(_this._option.toolBarElement).css('border-bottom','1px solid #ccc');
	        	$(_this._option.toolBarElement).prev()[0] == $(_this)[0]?$(_this._option.toolBarElement).css('border-top','0'):'';
	        }else{
	        	// 生成工具栏
	        	var editorBar = $('<div class="editor-bar"></div>').insertBefore($(_this));	        	
	        }

	        for (var i = 0; i < _this._option.toolBar.length; i++) {
	        		var iconClass = 'icon-' + _this._option.toolBar[i],
	        			barClass = 'bar-' + _this._option.toolBar[i];
	        		$('.editor-bar').append($('<div class="icon-bar '+barClass+'"><i class="editor-icon '+iconClass+'"></i></div>'))
	        	}
        }

        // 绑定对应功能
        $(document).on('click','.editor-icon',function(){
			// 移出其他弹出窗口
			$('.tool-wrap').remove();
			// 按钮选中
        	// $(this).hasClass('active')?$(this).removeClass('active'):$(this).addClass('active');
        	var fun = $(this).attr('class').match(/(icon-)(\w*)(\s*)/g)[0].trim().replace(/(\-\w)/g,function(letter){return letter.substr(1).toUpperCase()}).trim();
        	// 使用eval动态调用方法
        	eval('_this.'+fun+'Handler()');
        });

        // 绑定失去焦点事件(keyup mouseup) 保存当前range
        $(this).on('keyup',function(){
        	_this.saveCurrentRange()
        });

        $(this).on('mouseup',function(){
        	_this.saveCurrentRange()
        });

		// 窗口失去焦点事件
		$(document).on('click',function(e){
			// console.log(e.target.)

			if(e.target.className != 'editor-link'){
				$('.editor-link-tip').hide();
			}
		})



	},
	// 关闭窗口
	iconCloseHandler : function(){
		$('.tool-wrap').hide()
	},
	// 处理上传图片事件
	iconImageHandler : function(){
		// 打开上传窗口
		var top = ($('.editor-bar').outerHeight() - parseInt($('.editor-bar').css('padding').replace('px',"")) )+'px';
		// 窗口 trigger
		if($('.image-wrap').length){
			$('.image-wrap').remove();
			return;
		}

		var element = '<div class="tool-wrap image-wrap"><ul>'+
		'<li class="upload-item"><label for="networkPic">网络图片: <input type="text" name="networkPic" placeholder="网络图片地址"></label><a href="javascript:;" class="insert-net-image">插入</a></li>'+
        '<li class="upload-item"><label for="LocalPic">本地图片: <input type="file" name="LocalPic" class="upload-file" accept="image/jpg,image/jpeg,image/png" ></label></li>'+
       	'</ul><span class="editor-icon icon-close"></span></div>';

       	$(element).css('top' , top).appendTo($('.bar-image'));

       	// 插入网络图片
       	$(document).on('click','.insert-net-image',function(){
			$('#loading').show()
       		var url = $('input[name="networkPic"]').val();
       		var cache = new Image();
       		cache.src = url;
       		cache.onload = function(){
				$('#loading').hide();	
				$('.image-wrap').hide();
       			_this.insertFragment('<div><br><p class="insert" contenteditable="false"><img class="editorImg" src=' + url + ' /></p><br></div>');
       		}
       		
       	})
       	// 绑定上传事件
		$(document).on('change','.upload-file',function(){
			var file = $(this)[0].files[0] || '';
			if(file){
				var cache = new Image(),
					blob = window.URL.createObjectURL(file);

				cache.src = blob;
				cache.onload = function(){
					_this.uploadImageHandler({
						file : file,
						blob : blob
					});
				}

				$(this).val('');
				$('.image-wrap').hide();
				$('#loading').show();
			}
		})



	},
	// 添加链接事件
	iconLinkHandler : function(){
		// 打开窗口
		var top = ($('.editor-bar').outerHeight() - parseInt($('.editor-bar').css('padding').replace('px',"")) )+'px';

		if($('.link-wrap').length){
			$('.link-wrap').remove();
			return;
		}
		var element = '<div class="tool-wrap link-wrap"><ul>'+
		'<li class="upload-item"><label for="linkText">链接文字: <input type="text" name="linkText" placeholder="请输入链接文字"></label></li>'+
		'<li class="upload-item"><label for="linkHref">链接地址: <input type="text" name="linkHref" placeholder="默认添加http://前缀"></label></li>'+
        '<a href="javascript:;" class="insert-link">插入</a></ul><span class="editor-icon icon-close"></span></div>';


       	$(element).css('top' , top).appendTo($('.bar-link'));


		// 绑定操作
		$('.insert-link').on('click',_this.insertLinkHandler);

		$(document).on('click','.editor-link',function(e){
			var left = e.pageX,
				top = e.pageY;

			var text = $(this).html(),
				href = $(this).attr('href');	

			var style = {
				position : 'absolute',
				left : left,
				top : top,
				padding	: '10px 5px',
				background : '#f1f1f1'
			}
			// 链接跳转tip
			if($('.editor-link-tip')){
				$('.editor-link-tip').remove();
			}
			$('<div class="editor-link-tip"></div>').appendTo('body').css(style).append('<span>点击跳转: <a href="'+href+'" target="blank">'+text+'</a></span>');

		})



	},

	// 上传图片处理事件
	uploadImageHandler : function(options){
		console.log('uploadImageHandler')
		// 获取 七牛token 
		_this.getQiniuToken({
			callback : function(){
				_this.doUploadImage({
					file : options.file,
					callback : function(){
						$('#loading').hide()
						_this.insertFragment('<div><br><p class="insert" contenteditable="false"><img class="editorImg" data-id="" src=' + options.blob + ' /></p><br></div>')
					}
				});
			}
		})
	},
	// 获取 七牛token 方法
	getQiniuToken : function(options){
		console.log('getQiniuToken')
		var nowTime = new Date().getTime();
        var qiniuTime = localStorage.getItem('qiniuTime') || false;
        if (qiniuTime) {
            // 本地存储有内容
            if ((parseInt(nowTime) - parseInt(qiniuTime)) < 1800000) {
                _this._qiniuInfo = {
                    token: localStorage.getItem('qiniuToken'),
                    imgBase: localStorage.getItem('imageBase')
                }
                options.callback();
            } else {
                // 超过半小时 - 清空本地存储
                localStorage.removeItem('qiniuToken');
                localStorage.removeItem('imageBase');
                localStorage.removeItem('qiniuTime');
                _this.getQiniuToken(options);
            }
        } else {
            // 本地存储为空
            $.ajax({
                type: 'GET',
                url: 'http://dcrmwsfbuikhru0.kuaikanmanhua.com/image/qiniu/token'
            }).done(function(res) {

                console.log(res.data);
                localStorage.setItem('qiniuToken', res.data.token);
                localStorage.setItem('imageBase', res.data.image_base);
                localStorage.setItem('qiniuTime', new Date().getTime());
                _this.getQiniuToken(options);
            }).fail(function(res) {
                console.log('token error')
            })
        }

	},
	// 上传图片
	doUploadImage : function (options){
console.log('doUploadImage')
	    function changeNumber(el) {
	        var num = el < 10 ? '0' + el : '' + el;
	        return num;
	    }

	    function getRandomStr(len) {
	        var i, pwd = '';
	        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
	        for (i = 0; i < len; i++) {
	            pwd += chars.charAt(Math.floor(Math.random() * 62));
	        }
	        return pwd;
	    }

        var file = options.file;console.log(file)
        var cIndex = options.index || Math.ceil(Math.random() * 10);
        var cacheDate = new Date();
        var cDate = (cacheDate.getFullYear() + '').substr(2, 2) + changeNumber(cacheDate.getMonth() - 1) + changeNumber(cacheDate.getDate());
        var key = 'image' + '/' + cDate + '/' + getRandomStr(8) + cIndex + '.' + file.name.split('.')[1];

        var formData = new FormData();
        formData.append('token', _this._qiniuInfo.token);
        formData.append('file', file);
        formData.append('key', key);

        $.ajax({
            type: 'POST',
            url: 'http://upload.qiniu.com',
            data: formData,
            contentType: false,
            processData: false,
            // xhr: function() {
            //     var xhr = $.ajaxSettings.xhr();
            //                         console.log('10')
            //     if (options.progress && xhr.upload) {
            //         xhr.upload.addEventListener("progress", function(evt) {
            //             if (evt.lengthComputable) {

            //                 options.progress(evt)
            //                 var percentComplete = Math.round(evt.loaded * 100 / evt.total);
            //                 console.log(currentUploadIndex, percentComplete)
            //                 // options.progress(percentComplete)
            //             }
            //         }, false);
            //         return xhr;
            //     }
            // },
            success: function(res) {
                options.callback(res)
            },
            error: function() {
            	console.log('error')
            }
        }).fail(function(res) {
        	console.log('fail')
            console.log(res)
        });

	},

	// 插入内容
	insertFragment : function(str){
		console.log(_this.currentRange)
		_this.restoreSelection();
        var selection = window.getSelection ? window.getSelection() : document.getSelection;

        if (!window.getSelection) {
            _this.currentRange.pasteHTML(str);
            _this.currentRange.collapse(false);
            _this.currentRange.select();
        } else {
            _this.currentRange.collapse(false);
            hasR = _this.currentRange.createContextualFragment(str);
            var hasLastChild = hasR.lastChild;
            while (hasLastChild && hasLastChild.nodeName.toLowerCase() == "br" && hasLastChild.previousSibling && hasLastChild.previousSibling.nodeName.toLowerCase() == "br") {
                var e = hasLastChild;
                hasLastChild = hasLastChild.previousSibling;
                hasR.removeChild(e);
            }
            // _this.currentRange.insertNode(_this.currentRange.createContextualFragment("<br/>"));
            _this.currentRange.insertNode(hasR);
            if (hasLastChild) {
                _this.currentRange.setEndAfter(hasLastChild);
                _this.currentRange.setStartAfter(hasLastChild);
            }
            selection.removeAllRanges();
            selection.addRange(_this.currentRange);
        }

        _this.saveCurrentRange();
	},

	// 获取当前range
	getCurrentRange : function(){
		_this.supportsDOMRanges = document.implementation.hasFeature("Range", "2.0");
		// 是否支持 range 对象
		if(_this.supportsDOMRanges){
        	var selection = window.getSelection ? window.getSelection() : document.getSelection,
        		range;

        	// 获取 range 对象
        	if(selection.getRangeAt && selection.rangeCount){
        		range = document.getSelection().getRangeAt(0);
        	}else{
        		range = document.getSelection().createRange();
        	}

        	return range;



		}else{
			alert('当前浏览器版本不支持 Range 对象');
		}
	},

	// 保存当前 range
	saveCurrentRange : function(){
		_this.currentRange = _this.getCurrentRange();
	},

	// 回复当前 selection
	restoreSelection : function (){
		console.log(_this.currentRange)
		if(!_this.currentRange){
			return;
		}

		var selection, 
			range;

		if(_this.supportsDOMRanges){
			// 移动 range 到元素末尾 标准方法
			selection = document.getSelection();
			selection.removeAllRanges();
			selection.addRange(_this.currentRange);
		}else{
			// 移动 range 到元素末尾 替代方法
			range = document.selection.createRange();
			range.setEndPoint('EndToEnd', _this.currentRange);
			if(_this.currentRange.text.length === 0){
				range.collapse(false);
			}else{
				range.setEndPoint('StartToStart', _this.currentRange);
			}
			range.select();
		}
	},

	//插入超链接
	insertLinkHandler : function(){
		var text = $('input[name="linkText"]').val(),
			href = $('input[name="linkHref"]').val();

		// 默认添加http://前缀
		href = href.indexOf('http://')>0?href:'http://'+href;

		_this.insertFragment('<a class="editor-link" href="'+href+'" target="blank">'+text+'</a>');

		$('.link-wrap').hide();

	},
	// 字体颜色
	iconFontHandler : function(){
		// 打开窗口
		var top = ($('.editor-bar').outerHeight() - parseInt($('.editor-bar').css('padding').replace('px',"")) )+'px';

		if($('.font-wrap').length){
			$('.font-wrap').remove();
			return;
		}

		var element = '<div class="tool-wrap font-wrap"><p>字体颜色</p></div>';

       	$(element).css('top' , top).appendTo($('.bar-font'));
       	for (var i = 0; i < _this._fontColor.length; i++) {
       		var item = _this._fontColor[i];
       		$('.font-wrap').append($('<span class="font-color color-'+item+'" data-color="'+item+'"></span>'));
       	}

       	$(document).on('click','.font-color',function(){
       		var color = $(this).data('color');
       		document.execCommand('forecolor',false,color);
			$('.font-wrap').remove();
       	})


	},
	// 字体加粗
	iconBoldHandler : function(){
		document.execCommand('bold');

	},

	// 字体倾斜
	iconItalicHandler : function(){
		document.execCommand('italic');
	},

	// 下划线
	iconUnderlineHandler : function(){
		document.execCommand('underline');
	},

	// 左对齐
	iconAlignleftHandler : function(){
		document.execCommand('justifyLeft');
	},

	// 右对齐
	iconAlignrightHandler : function(){
		document.execCommand('justifyRight');
	},

	// 居中对齐
	iconAligncenterHandler : function(){
		document.execCommand('justifyCenter');
	}















})

/***/ })

},[6]);