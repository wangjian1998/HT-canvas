// import shebeiImg from '@/assets/img/shebei.png' // 设备
// import cdImg from '@/assets/img/cd-site.png' // 充电站
// import dtImg from '@/assets/img/dt.png' // 电梯
// import gzzImg from '@/assets/img/gzz-site.png' // 工作站
// import mjImg from '@/assets/img/mj.png' //门禁

class drawSence {
  showLine = false // 是否显示路径信息
  showPoint = false // 是否显示点位
  offset = { x: 0, y: 0 }; // 拖动偏移
  curOffset = { x: 0, y: 0 }; // 记录上一次的偏移量
  mousePosition = { x: 0, y: 0 }; // 记录鼠标滚轮点击时的坐标位置
  maxScale = 8;
  minScale = 0.4;
  scaleStep = 0.2;
  scale = 1;
  preScale = 1;
  x = 0; // 记录鼠标点击Canvas时的横坐标
  y = 0; // 记录鼠标点击Canvas时的纵坐标

  // 小车运动变量
  timer = 0
  points = [] //已经运动过的数据
  animatePoint = { x: 0, y: 0 } //当前运动点位置
  nextPointIndex = 1 //下一个运动点的index
  routes = [] // 运动点位
  startTime = 0

  constructor(id, path = [], option = {width: 800, height: 800}) {
    this.canvas = document.querySelector('#' + id)
    this.canvas.width = option.width
    this.canvas.height = option.height
    this.width = option.width
    this.height = option.height
    this.path = path
    this.ctx = this.canvas.getContext('2d')

    this.ctx.translate(this.canvas.width / 2,this.canvas.height / 2);
    this.ctx.rotate(Math.PI);
    this.ctx.scale(-1,1)
  }

  /**
   * 初始化
   * @param {boolean} boolean 是否画线
   */
  init(boolean = false) {
    this.showLine = boolean
    this.showLine ? this.draw() : this.initSite()
  }

  draw() {
    this.drawLine()
    this.initSite()
    this.drawQuadratic()
  }

  // 生成线段路径
  drawLine(x0, y0, x1, y1, flag = false) {
    this.ctx.beginPath();
      !flag ? this.ctx.strokeStyle = '#000' : this.ctx.strokeStyle = 'blue'
      // this.ctx.lineWidth = lineWidth;
      this.ctx.moveTo(x0, y0);
      this.ctx.lineTo(x1, y1);
      this.ctx.stroke();
  }

  /**
   * 初始化地图
   * @param {number} width 矩形宽
   * @param {number} height 矩形高
   * @param {string} fillStyle 填充颜色
   */
  initSite(width = 20, height = 20) {
    // 站点或节点
    if (this.path.nodeNum) {
      this.path.nodes.forEach(item => {
        if (item.isStation === 1) {
          this.drawRect(item.x - width / 2,item.y - height / 2, width, height)
        }
        else {
          this.drawPoint(item.x, item.y, 3, 'red')
        }
        // this.drawText(item.nodeName, item.x - 10, -item.y - 15)
      })
    }
    // 磁钉点
    if (this.path.magNum) {
      this.path.magPoints.forEach(item => {
        this.drawPoint(item.x, item.y, 3, 'blue')
        // this.drawText(item.magPointName, item.x - 10, -item.y - 15)
      })
    }
    // 功能点
    if (this.path.actionPointNum) {
      this.path.actionPoints.forEach(item => {
        this.drawPoint(item.x, item.y, 3, 'green')
        // this.drawText(item.actionName, item.x - 10, -item.y - 15)
      })
    }
  }

  /**
   * 图片绘制
   * @param {string} src 图片路径
   * @param {string} sx 开始剪切的 x 坐标位置
   * @param {string} sy 开始剪切的 y 坐标位置
   * @param {string} sWidth 被剪切图像的宽度
   * @param {string} sHeight 被剪切图像的高度
   * @param {number} width 图片起始x坐标
   * @param {number} height 图片起始y坐标
   * @param {number} ImgWidth 图片宽度
   * @param {number} ImgHeight 图片高度
   */
  // drawImg(src,sx,sy,swidth,sHeight,width, height, ImgWidth, ImgHeight) {
  //   const _this = this
  //   const img = new Image()
  //   img.src = src
  //   img.onload = function(){
  //     _this.ctx.drawImage(img, sx,sy,swidth,sHeight,width, height, ImgWidth, ImgHeight)
  //   }
  // }

  drawImg(src,width, height, ImgWidth, ImgHeight) {
    const _this = this
    const img = new Image()
    img.src = src
    img.onload = function(){
      _this.ctx.drawImage(img, width, height, ImgWidth, ImgHeight)
    }
  }

  /**
   * 
   * @param {String} textName 文字内容
   * @param {Number} x 文字x坐标
   * @param {*} y 文字y坐标
   */
  drawText(textName, x, y) {
    this.ctx.save()
    this.ctx.scale(1, -1)
    this.ctx.fillText(textName, x, y)
    this.ctx.translate(x, y)
    this.ctx.restore()
  }

  /**
   * 画圆弧
   * @param {Number} x 圆心点x坐标
   * @param {Number} y 圆心点y坐标
   * @param {Number} r 半径
   * @param {Number} startAngle 开始弧度
   * @param {Number} endAngle 结束弧度
   * @param {Boolean} clockwise 是否顺时针
   */
  drawArc(x, y, r, startAngle, endAngle, clockwise = false) {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.arc(x, y, r, startAngle, endAngle, clockwise)
    this.ctx.stroke()
    this.ctx.restore()
  }

  /**
   * 绘制二次贝塞尔曲线
   * @param {Number} startX 起始X坐标
   * @param {Number} startY 起始Y坐标
   * @param {Number} cp1x 控制点1X坐标
   * @param {Number} cp1y 控制点1Y坐标
   * @param {Number} endX 终点X坐标
   * @param {Number} endY 终点Y坐标
   */
  drawQuadratic(startX, startY, cp1x, cp1y, endX, endY) {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.moveTo(startX, startY)
    this.ctx.quadraticCurveTo(cp1x, cp1y, endX, endY)
    this.ctx.stroke()
    this.ctx.restore()
  }

   /**
   * 绘制三次贝塞尔曲线
   * @param {Number} startX 起始X坐标
   * @param {Number} startY 起始Y坐标
   * @param {Number} cp1x 控制点1 X坐标
   * @param {Number} cp1y 控制点1 Y坐标
   * @param {Number} cp2x 控制点2 X坐标
   * @param {Number} cp2y 控制点2 Y坐标
   * @param {Number} endX 终点X坐标
   * @param {Number} endY 终点Y坐标
   */
   drawbezierCurve(startX, startY, cp1x, cp1y, cp2X, cp2Y, endX, endY) {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.moveTo(startX, startY)
    this.ctx.bezierCurveTo(cp1x, cp1y, cp2X, cp2Y, endX, endY)
    this.ctx.stroke()
    this.ctx.restore()
  }

  // 初始化轨迹运动
  initPlay(routes) {
    this.timer = 0
    this.points = [] //已经运动过的数据
    this.animatePoint = { x: 0, y: 0 } //当前运动点位置
    this.nextPointIndex = 1 //下一个运动点的index
    this.routes = [] // 运动点位
    this.startTime = 0
    this.paint()
    this.routes = routes
    this.animatePoint = [0, 0]
    this.nextPointIndex = 1
    // this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight)

    if (routes.length > 0)
    {
      this.points.push([routes[0][0], routes[0][1]])
      this.animatePoint = [routes[0][0], routes[0][1]]
      this.drawPoint(routes[0][0], routes[0][1])
    }
    if (routes.length > 1)
    {
      this.startTimer()
    }
  }

  startTimer()
    {
      this.startTime = new Date().getTime()
      if (this.routes.length > 1)
      {
        this.clearTimer()
        this.animate()
      }
    }
  
  clearTimer()
  {
    window.cancelAnimationFrame(this.timer)
  }

  animate()
  {
    this.timer = window.requestAnimationFrame(this.animate.bind(this))
    this.startMove()
  }

  // eslint-disable-next-line complexity
  startMove()
  {
    let targetDistance = Math.sqrt(

      // Math.pow((Number(this.routes[this.nextPointIndex - 1][0]) || Number(this.routes[this.nextPointIndex - 1][1][0])) - (Number(this.routes[this.nextPointIndex][0]) || Number(this.routes[this.nextPointIndex][1][0])), 2) +
      // Math.pow(this.routes[this.nextPointIndex - 1][1] - this.routes[this.nextPointIndex][1], 2)

      Math.pow((Number(this.routes[this.nextPointIndex - 1][0]) || Number(this.routes[this.nextPointIndex - 1][1][0])) - (Number(this.routes[this.nextPointIndex][0]) || Number(this.routes[this.nextPointIndex][1][0])), 2) + Math.pow((Number(this.routes[this.nextPointIndex - 1][1]) || Number(this.routes[this.nextPointIndex - 1][1][1])) - (Number(this.routes[this.nextPointIndex][1]) || Number(this.routes[this.nextPointIndex][1][1])), 2)
    )

    let currentDistance = Math.sqrt(
      // Math.pow(this.routes[this.nextPointIndex - 1][0] - this.animatePoint[0], 2) +
      // Math.pow(this.routes[this.nextPointIndex - 1][1] - this.animatePoint[1], 2)

      Math.pow((Number(this.routes[this.nextPointIndex - 1][0]) || Number(this.routes[this.nextPointIndex - 1][1][0])) - this.animatePoint[0], 2) + Math.pow((Number(this.routes[this.nextPointIndex - 1][1]) || Number(this.routes[this.nextPointIndex - 1][1][1])) - this.animatePoint[1], 2)
    )

    if (currentDistance >= targetDistance)
    {
      //利用运动距离与目标距离, 判断运动的点是否超过下一个目标点, 超过了就重置下一个点
      this.startTime = new Date().getTime()

      this.points[this.nextPointIndex] = [this.routes[this.nextPointIndex][0], this.routes[this.nextPointIndex][1]]

      this.animatePoint = [this.routes[this.nextPointIndex][0], this.routes[this.nextPointIndex][1]]

      this.nextPointIndex++

      this.clearTimer()

      if (this.nextPointIndex <= this.routes.length - 1)
      {
        setTimeout(() =>
        {
          this.startTimer()
        }, 500)
      }

      //重绘
      // this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight)
      this.drawPolygon(this.points)

      this.drawPoint(this.animatePoint[0], this.animatePoint[1], 3,'yellow')
      return
    }

    if (this.nextPointIndex > this.routes.length - 1)
    {
      //轨迹运动结束后, 关闭timer
      this.clearTimer()

      this.animatePoint = [this.routes[this.routes.length - 1][0], this.routes[this.routes.length - 1][1]]
    }

    else
    {
      let speed = 0.25

      let deltaTime = new Date().getTime() - this.startTime
      let deltaDistance = deltaTime * speed
      let rate = deltaDistance / targetDistance
      let x, y
      let isArray = this.routes[this.nextPointIndex].some(item => Array.isArray(item))
      if (!isArray) {
        x = (Number(this.routes[this.nextPointIndex - 1][0]) || Number(this.routes[this.nextPointIndex - 1][1][0])) +
        ((Number(this.routes[this.nextPointIndex][0]) || Number(this.routes[this.nextPointIndex][1][0])) - (Number(this.routes[this.nextPointIndex - 1][0]) || Number(this.routes[this.nextPointIndex - 1][1][0]))) * rate
      y = (Number(this.routes[this.nextPointIndex - 1][1]) || Number(this.routes[this.nextPointIndex - 1][1][1])) +
        ((Number(this.routes[this.nextPointIndex][1]) || Number(this.routes[this.nextPointIndex][1][1])) - (Number(this.routes[this.nextPointIndex - 1][1]) || Number(this.routes[this.nextPointIndex - 1][1][1]))) * rate
      } else {
        // x = Math.pow(1 - t, 2) * x1 + 2 * t * (1 - t) * cx + Math.pow(t, 2) * x2
        // y = Math.pow(1 - t, 2) * y1 + 2 * t * (1 - t) * cy + Math.pow(t, 2) * y2

        // x = Math.pow(1 - deltaTime, 2) * this.routes[this.nextPointIndex - 1][0] + 2 * deltaTime * (1 - deltaTime, 2) * this.routes[this.nextPointIndex][0][0] + Math.pow(deltaTime, 2) * this.routes[this.nextPointIndex][1][0]
        // y = Math.pow(1 - deltaTime, 2) * this.routes[this.nextPointIndex - 1][1] + 2 * deltaTime * (1 - deltaTime, 2) * this.routes[this.nextPointIndex][0][1] + Math.pow(deltaTime, 2) * this.routes[this.nextPointIndex][1][1]

        x = this.routes[this.nextPointIndex][1][0]
        y = this.routes[this.nextPointIndex][1][1]
      }

      

      this.animatePoint[0] = x
      this.animatePoint[1] = y

      //重绘, 将animatePoint设为轨迹的下一个点, 以达到动态的效果
      
      // eslint-disable-next-line no-empty
      this.points[this.nextPointIndex] = !isArray ? [this.animatePoint[0], this.animatePoint[1]] : [[this.routes[this.nextPointIndex][0][0], this.routes[this.nextPointIndex][0][1]],[this.animatePoint[0], this.animatePoint[1]]]

      // this.points[this.nextPointIndex] = [this.animatePoint[0], this.animatePoint[1]]


      // this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight)
      this.drawPolygon(this.points)

      this.drawPoint(this.animatePoint[0], this.animatePoint[1], 3,'yellow')
    }
  }

  /**
   * 绘制点集
   * @param {Array} pointArr 点集合
   * @param {String} color 颜色
   */
  isPoint(pointArr, color = 'rgb(94, 179, 152)') {
    pointArr.forEach(item => {
      this.drawPoint(item.x, item.y, 3, color)
    })
  }

  /**
   * 绘制点
   * @param {number} x 点的x坐标
   * @param {number} y 点的y坐标
   * @param {number} r 半径
   * @param {string} color 颜色
   */
  drawPoint(x, y, r = 3, color = '#1DEFFF')
  {
    this.ctx.save()
    //绘制点
    this.ctx.fillStyle = color
    this.ctx.strokeStyle = '#fff'
    if (!color)
    {
      this.ctx.shadowColor = '#FFF'
      this.ctx.shadowBlur = 2
    }

    this.ctx.beginPath()
    this.ctx.arc(x, y, r, 0, Math.PI * 2)
    this.ctx.closePath()
    this.ctx.stroke()
    this.ctx.fill()
    this.ctx.restore()
  }

  /**
   * 绘制矩形
   * @param {number} x x坐标
   * @param {number} y y坐标
   * @param {number} width 矩形宽度
   * @param {number} height 矩形高度
   * @param {string} color 填充颜色
   */
  drawRect(x, y, width, height) {
    this.ctx.save()
    // this.ctx.fillStyle = color || 'orange'
    this.ctx.beginPath()
    this.ctx.rect(x, y, width, height)
    this.ctx.stroke()
    this.ctx.restore()
  }

  /**
   * 绘制线
   * @param {number} x 初始x坐标
   * @param {number} y 初始y坐标
   * @param {number} tx 目标x坐标
   * @param {number} ty 目标y坐标
   * @param {string} strokeStyle 网格颜色
   */
  drawAxis(x, y, tx, ty, strokeStyle) {
    this.ctx.save()
    this.ctx.strokeStyle = strokeStyle || '#dadada'
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(tx, ty);
    this.ctx.stroke();
    this.ctx.restore()
  }

  /**
   * 绘制网格及坐标轴
   * @param {number} space 网格间距
   */
  initGrid(space = 10) {
    this.drawAxis(-this.canvas.width / 2, 0, this.canvas.width / 2, 0, '#000') // 绘制y轴
    this.drawAxis(0, -this.canvas.height / 2, 0, this.canvas.height / 2, '#000') // 绘制x轴
    // 绘制箭头
    this.drawAxis(this.canvas.width / 2, 0, this.canvas.width / 2 - 10, 4, '#000')
    this.drawAxis(this.canvas.width / 2, 0, this.canvas.width / 2 - 10, -4, '#000')
    this.drawAxis(0, this.canvas.height / 2, 4, this.canvas.height / 2 - 10, '#000')
    this.drawAxis(0, this.canvas.height / 2, -4, this.canvas.height / 2 - 10, '#000')

    // 绘制网格
    for(let i = 0;i < Number(this.canvas.width);i += space) {
      this.drawAxis(-this.canvas.width / 2 + i, -this.canvas.height / 2, -this.canvas.width / 2 + i, this.canvas.height / 2 )
      this.drawAxis(-this.canvas.width / 2, -this.canvas.height / 2 + i, this.canvas.width / 2, -this.canvas.height / 2 + i)
    }
    this.drawPoint(0, 0, 4, '#000') // 绘制坐标原点
  }

  drawPolygon(points)
  {
    //绘制轨迹
    // this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight)
    this.ctx.save()
    this.ctx.strokeStyle = '#1DEFFF'
    this.ctx.shadowColor = '#1DEFFF'
    this.ctx.shadowBlur = 2
    this.ctx.lineWidth = 2

    this.ctx.beginPath()
    this.ctx.moveTo(points[0][0], points[0][1])
    let i = 1, len = points.length
    for (; i < len; i++)
    {
      let isTwoArray = points[i].some(item => Array.isArray(item))
      !isTwoArray ? this.ctx.lineTo(points[i][0], points[i][1]) : this.ctx.quadraticCurveTo(points[i][0][0], points[i][0][1], points[i][1][0], points[i][1][1])
    }
    this.ctx.stroke()

    let j = 0
    for (; j < len - 1; j++)
    {
      this.drawPoint(points[j][0], points[j][1])
    }
    this.ctx.restore()
  }

  // 清空画布内容
  clear() {
    this.canvas.width = this.width;
  }

  // 重绘
  paint() {
    this.clear();
    this.ctx.translate(this.canvas.width / 2 + this.offset.x,this.canvas.height / 2 + this.offset.y);
    this.ctx.rotate(Math.PI);
    this.ctx.scale(-this.scale,this.scale)
    this.init(this.showLine)
    if (this.showPoint) {
      this.isPoint(this.path.point)
    }
  }

  // 重置
  reset() {
    this.clear();
    // this.scale = 1; // 当前缩放
    this.preScale = 1; // 上一次缩放
    this.offset = { x: 0, y: 0 }; // 拖动偏移
    this.curOffset = { x: 0, y: 0 }; // 当前偏移
    this.mousePosition = { x: 0, y: 0 };

    this.ctx.translate(this.canvas.width / 2,this.canvas.height / 2);
    this.ctx.rotate(Math.PI);
    this.ctx.scale(-1,1)

    this.timer = 0
    this.points = [] //已经运动过的数据
    this.animatePoint = { x: 0, y: 0 } //当前运动点位置
    this.nextPointIndex = 1 //下一个运动点的index
    this.routes = [] // 运动点位
    this.startTime = 0

    this.showPoint = false
    this.init()
    // this.showLine ? this.draw() : this.initSite()
  }

}

export default drawSence

