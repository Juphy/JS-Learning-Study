## canvas

```html
<canvas id="canvas">
    Your browser does not support HTML5 Canvas.
</canvas>
```
```js
let canvas = documnet.getElementById('canvas'); // 获得画布
if ( canva.getContext ) {
    // drawing code here
} else {
    // canvas-unsupported code here
}
let context = canvas.getContext('2d'); // 3d: webgl
```

### 基本绘制路径
canvas坐标系，从最左上角0,0开始，x向右增大，y向下增大。
- moveTo(x, y): 设置绘制起点。x,y都是相对于canvas盒子的最左上角。**绘制线段前必须设置起点**
- lineTo(x, y): 从x,y的位置绘制一条直线到起点或者上一个线头点。
- ctx.beginPath()开始路径：如果是绘制不同状态的线段或者形状，必须使用开始新路径的方法把不同的绘制操作隔开。 
- ctx.closePath()闭合路径：闭合路径会自动把最后的线头和开始的线头连在一起。
- ctx.stroke()：描边，根据路径绘制线，路径只是草稿，真正绘制线必须执行stroke
- canvas绘制的基本步骤：
  - 获得上下文：canvas.getContext('2d')
  - 开始路劲规划：ctx.beginPath()
  - 移动起始点：ctx.moveTo(x, y)
  - 绘制线(矩形、圆形、图片等)：ctx.lineTo(x, y)
  - 闭合路径：ctx.closePath()
  - 绘制描边：ctx.stroke()

- ctx.fill()：填充，是将闭合的路径的内容填充具体的颜色，默认黑色。

        注意：交叉路径的填充问题，"非零环绕原则"，顺时针穿插次数决定是否填充。对于路径中的任意给定区域，从该区域内部画一条足够长的线段，使此线段的终点完全落在路径范围之外。将计数器初始化为0，然后，每当这条线段与路径上的直线或曲线相交时，就改变计数器的值。如果是与路径的顺时针部分相交，则加1；如果是与路径的逆时针部分相交，则减1.若计数器的最终值不是0，那么此区域就在路径里面，浏览器就会对其进行填充。如果最终值是0，那么此区域就不在路径内部，浏览器也就不会对其进行填充了。

- ctx.rect(x, y, width, height)：规划矩形路径，并没有填充和描边。x, y是矩形左上角坐标。
- ctx.strokeRect(x, y, width, height)：描边矩形，此方法绘制完路径后立即进行stroke绘制
- ctx.fillRect(x, y，width, height)：填充矩形，此方法绘制完矩形后立即进行fill填充
- ctx.clearRect(x, y, width, height)：清除某个矩形内的绘制的内容
- ctx.arc(x, y, r, startAngle, endAngle, counterclockwise)：x, y左上角坐标 r半径大小 startAngle绘制开始的角度 endAngle结束的角度。圆心到最右点是0度，顺时针方向弧度增大。counterclockwise是否逆时针。这里的角度用的是弧度：rad = deg/180 * Math.PI

### 绘制文字
- ctx.font：设置会返回文本内容的当前字体属性，与CSS font一致
- textAlign：设置会返回文本内容的当前对齐方式
    - start：默认。文本在指定的位置开始
    - end：文本在指定的位置结束
    - center：文本的中心被放置在指定的位置
    - left：文本左对齐
    - right：文本右对齐
- textBaseline：设置货返回在绘制文本时使用的当前文本基线
    - alphabetic ： 默认。文本基线是普通的字母基线
    - top ： 文本基线是 em 方框的顶端
    - hanging ： 文本基线是悬挂基线
    - middle ： 文本基线是 em 方框的正中
    - ideographic： 文本基线是 em 基线
    - bottom ： 文本基线是 em 方框的底端
- ctx.fillText(text, width, height)：在画布上绘制“被填充的”文本
- ctx.strokeText(text, width, height)：在画布上绘制文本（无填充）
- ctx.measureText()：返回包括指定文本宽度的对象

### 绘制图片
- context.drawImage(img, x, y, sx, sy, swidth, sheight, width, height)
    - img是绘制图片的DOM对象
    - width, height绘制图片的宽度和高度，如果指定宽高，最好做成比例，不然图片会被拉伸。
    - sx, sy裁剪的左上角坐标
    - swidth, sheight裁剪图片的宽度和高度

```JS
var img = document.getElementById('img');

var img = new Image();
img.src = url;
img.alt = '文本信息';
img.onload = function(){
    // 图片加载完成后，执行此方法
}
```


