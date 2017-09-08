# ajEditor

## 简介
由于之前公司需求需要开发简单编辑器功能,经过优化和完善开发本富文本编辑器

基于 jQuery 的轻量级,简单,易用的开源Web富文本编辑器
支持 IE10+ 浏览器和目前主流浏览器

目前只支持基本的编辑器功能,已有功能也存在待调试问题,若有发现会及时更新
也希望及时提供意见反馈
***
# 使用
## 下载


- 直接下载：[https://github.com/13029852933/ajEditor]
- 使用`npm`使用:
` npm install` 安装依赖  

` npm start`   本地运行  

` npm run build` 打包  
## 教程
使用时只需要给目标元素绑定初始化方法即可

	<div id="editor"></div>
	<script type="text/javascript">
		$(function(){
			$('#editor').ajEditor();
		})
	</script>
## 参数
* 	width : 100%, 编辑器宽度,默认是父元素的宽度,
*	height : 500px ,编辑器高度,默认是500px,
*	showToolBar : true/fasle, 是否显示工具栏,
*	toolBar : ['bold','italic','underline','font','image','link','alignleft','aligncenter','alignright'], 工具栏数组 根据需要选择,
*	toolBarElement : '', 绑定工具栏元素 工具栏可以和文本区分离开来 添加元素工具栏将绑定在指定元素,
*	uploadImageSize : 30 , 图片上传的大小限制默认30M

