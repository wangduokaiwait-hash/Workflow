React 地址列表页面

请使用 React + TypeScript  开发一个移动端地址列表页面，高度还原下面的设计，要求组件化、代码规范、易于维护。

页面整体

这是一个"收货地址列表"页面。

页面背景颜色：

#F7F7F7

列表容器：

宽度100%

白色背景

每个Item之间使用浅灰色分割线

左右Padding：16px

上下Padding：16px

整个页面支持渲染多个地址Item。

AddressItem 布局

整体采用左右布局：

--------------------------------------------------

○ |  标签 标签  地址............................ ✎

|  张先生 112****3838

--------------------------------------------------

使用 Flex：

display:flex;

align-items:flex-start;

左侧：

单选按钮(Radio)

固定宽度

不可被压缩

右侧：

flex:1

里面分为两行：

第一行：

标签 + 地址 + 状态Badge + 编辑按钮

第二行：

姓名 + 手机号

左侧Radio

默认：

○

样式：

20×20

border:1px solid #D9D9D9

白底

选中：

✔

样式：

背景：

#FF4D4F

圆形

白色勾。

第一行布局

使用：

display:flex;

justify-content:space-between;

align-items:flex-start;

左侧：

Tag Tag 地址 Badge

右侧：

编辑按钮

编辑按钮固定宽度。

Tag 标签

例如：

常用

公司

学校

家

父母家

距离最近

样式：

背景：

#FFF1F0

文字：

#FF4D4F

字体：

12px

Padding：

2px 6px

圆角：

4px

多个Tag之间：

margin-right:6px

Tag宽度根据文字自适应。

地址文本

地址在Tag后面。

字体：

15px

颜色：

#222

字体加粗：

font-weight:600;

支持：

一行

两行

三行

最大显示：

3行

超过以后：

...

使用：

-webkit-line-clamp:3;

注意：

Tag不能被省略。

只有地址文字可以折行。

特殊Badge

例如：

04:59 后餐厅停止接单

样式：

边框：

1px solid #FF7A7A

文字：

#FF4D4F

背景：

白色

字体：

12px

Padding：

2px 6px

圆角：

4px

Badge始终完整显示。

不要被省略。

编辑按钮

位于最右侧。

使用：

编辑Icon。

颜色：

#FF4D4F

大小：

20px

点击事件：

onEdit(item)

第二行

显示：

张先生 112****3838

字体：

13px

颜色：

#999999

手机号距离姓名：

margin-left:10px;

Item选中状态

选中的Item：

背景：

#FFF5F5

Radio变红。

其他内容保持一致。

分割线

Item之间：

border-bottom:1px solid #F2F2F2;

数据结构

每个地址对象：

interface AddressItem  {

id: number ;

checked: boolean ;

tags: string [];

address: string ;

name: string ;

phone: string ;

stopText?: string ;

isDefault?: boolean ;

isNearest?: boolean ;

}

示例数据：

[

{

id:1 ,

checked:false ,

tags:["常用","公司" ],

address:"地址未超过一行展示" ,

name:"张先生" ,

phone:"112****3838"

},

{

id:2 ,

checked:false ,

tags:["上次下单","学校" ],

address:"地址未超过一行展示" ,

name:"张先生" ,

phone:"11212343838"

},

{

id:3 ,

checked:false ,

tags:["距离最近","父母家" ],

address:"城开YOYO联合办公6楼 超过固定长度折行3行 超过固定长度折行3行 超过固定长度折行3行" ,

stopText:"04:59 后餐厅停止接单" ,

name:"张先生" ,

phone:"112****3838"

},

{

id:4 ,

checked:false ,

tags:["距离最近","家" ],

address:"一行固定宽度展示超出后折行 超过固定长度折行折行折行折行折行折行折行" ,

name:"张先生" ,

phone:"112****3838"

},

{

id:5 ,

checked:true ,

tags:["常用","公司" ],

address:"城开YOYO联合办公6楼" ,

name:"张先生" ,

phone:"112****3838"

}

]

组件拆分

请拆分为以下组件：

AddressList

│

├── AddressItem

│

├── AddressTag

│

├── AddressBadge

│

├── RadioButton

│

└── EditButton

代码要求

React + TypeScript

使用 Hooks

不依赖 UI 框架（如 Ant Design、MUI）

CSS Modules 或 SCSS Modules

所有样式响应式，适配移动端

组件职责单一，可复用

Props 定义完整

支持点击 Item 切换选中状态

编辑按钮单独触发事件，不影响 Item 的点击事件（需阻止事件冒泡）

地址支持 1～3 行展示，超出省略

Tag 不参与折行省略，地址文本与 Tag 保持良好的布局关系

页面最终效果应尽可能与参考图片保持一致，包括间距、字体大小、颜色、圆角、选中状态和整体视觉层级。
