class drawSence {
  showLine = false // 是否显示路径信息
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

  constructor(id, path = [], option = {width: 800, height: 400}) {
    this.canvas = document.querySelector('#' + id)
    this.canvas.width = option.width
    this.canvas.height = option.height
    this.width = option.width
    this.height = option.height
    this.path = path
    this.ctx = this.canvas.getContext('2d')

    // this.ctx.translate(this.canvas.width / 2,this.canvas.height / 2);
    // this.ctx.rotate(Math.PI);
    // this.ctx.scale(-1,1);

    this.onMousedown = this.onMousedown.bind(this)
    this.onMousemove = this.onMousemove.bind(this)
    this.onMouseup = this.onMouseup.bind(this)
    this.onMousewheel = this.onMousewheel.bind(this)
    this.onClick = this.onClick.bind(this)
    this.canvas.addEventListener('mousedown', this.onMousedown)
    this.canvas.addEventListener('mousewheel', this.onMousewheel)
    this.canvas.addEventListener('click', this.onClick)
  }

  init(boolean = false) {
    this.showLine = boolean
    this.showLine ? this.draw() : this.initSite()
  }

  // 生成路径
  draw() {
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = 'rgb(62, 57, 55)'
    this.ctx.save()

    this.path.forEach((path) => {
      this.ctx.beginPath()
      path.forEach((arr, arrIndex)=> {
        if (arrIndex === 0) {
          this.ctx.moveTo(arr[0],arr[1])
          return true
        }
        let isTwoArray = arr.some(item => Array.isArray(item))
        // if (!isTwoArray) {
        //   this.ctx.lineTo(arr[0],arr[1])
        //   this.ctx.fillRect(arr[0],arr[1],20,20)
        // } else {
        //   this.ctx.quadraticCurveTo(arr[0][0], arr[0][1], arr[1][0], arr[1][1])
        //   this.ctx.fillRect(arr[1][0],arr[1][1],20,20)
        // }
        !isTwoArray ? this.ctx.lineTo(arr[0],arr[1]) : this.ctx.quadraticCurveTo(arr[0][0], arr[0][1], arr[1][0], arr[1][1])
      })
      // this.ctx.closePath()
      this.ctx.stroke()
    })

    // this.ctx.beginPath();
    // this.ctx.moveTo(25, 70);
    // this.ctx.lineTo(150, 70);
    // this.ctx.quadraticCurveTo(200, 0, 250, 130);
    // this.ctx.lineTo(700, 130);
    // this.ctx.quadraticCurveTo(730, 0, 800, 70);
    // this.ctx.lineTo(900, 70);
    // this.ctx.lineTo(950, 90);
    // this.ctx.lineTo(950, 450);
    // this.ctx.lineTo(75, 450);
    // this.ctx.lineTo(25, 430);
    // this.ctx.closePath();
    // this.ctx.stroke();

    // this.ctx.beginPath();
    // this.ctx.moveTo(150, 500);
    // this.ctx.lineTo(150, 350);
    // this.ctx.lineTo(450, 350);
    // this.ctx.lineTo(450, 300);
    // this.ctx.stroke();

    // this.ctx.beginPath();
    // this.ctx.moveTo(650, 500);
    // this.ctx.lineTo(650, 430);
    // this.ctx.lineTo(750, 430);
    // this.ctx.lineTo(750, 300);
    // this.ctx.stroke();
    this.ctx.restore()
    this.initSite()
  }

  // 初始化站点
  initSite(width = 20,height = 20, fillStyle = 'pink') {
    this.ctx.beginPath()
    this.ctx.fillStyle = fillStyle
    this.path.forEach((path) => {
      path.forEach((arr, index)=> {
        // this.ctx.beginPath()
        let isTwoArray = arr.some(item => Array.isArray(item))
        if (!isTwoArray) {
          this.ctx.rect(arr[0] - width / 2,arr[1] - height / 2, width, height)
          this.ctx.fillText(`站点${index}`, arr[0] + width / 2,arr[1] + height / 2)
        } else {
          this.ctx.rect(arr[1][0] - width / 2, arr[1][1] - height / 2, width, height)
          this.ctx.fillText(`站点${index}`, arr[1][0] + width / 2,arr[1][1] + height / 2)
        }
        this.ctx.fill()
        this.ctx.textBaseline = 'top'
      })
     
    })
    this.ctx.closePath()
  }

  // 初始化轨迹运动
  initPlay(routes) {
    this.reset()
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

      this.drawPoint(this.animatePoint[0], this.animatePoint[1], 'yellow')
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

      this.drawPoint(this.animatePoint[0], this.animatePoint[1], 'yellow')
    }


  }

  drawPoint(x, y, color)
  {
    this.ctx.save()
    //绘制点
    this.ctx.fillStyle = color || '#1DEFFF'
    this.ctx.strokeStyle = '#fff'
    if (!color)
    {
      this.ctx.shadowColor = '#FFF'
      this.ctx.shadowBlur = 2
    }

    this.ctx.beginPath()
    this.ctx.arc(x, y, 3, Math.PI * 2, 0, true)
    this.ctx.closePath()
    this.ctx.stroke()
    this.ctx.fill()
    this.ctx.restore()
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

  // 设置小车生成
  setCar() {
    this.ctx.beginPath();
    this.ctx.arc(25, 70, 10, 0, Math.PI * 2, true); // 绘制
    this.ctx.fill()
    this.ctx.fillStyle = 'red'
  }

  // 清空画布内容
  clear() {
    this.canvas.width = this.width;
    // this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight)
  }

  // 重绘
  paint() {
    this.clear();
    this.ctx.translate(this.offset.x, this.offset.y)
    this.ctx.scale(this.scale, this.scale)
    this.init(this.showLine)
    
  }

  // 鼠标点击事件
  onClick(event) {
    console.log(event)
    let getBoundingClientRect = this.canvas.getBoundingClientRect()
    let x = event.clientX - getBoundingClientRect.left
    let y = event.clientY - getBoundingClientRect.top
    console.log([x, y])
    if (this.ctx.isPointInPath(x, y)) {
      console.log(true)
    }
    else {
      console.log(false)
    }
  }

  // 鼠标悬停事件
  // onMouseover(e) {
  //   console.log(e.clientX, e.clientY)
  // }

  // 鼠标按压事件
  onMousedown(e) {
    if (e.button === 0) {
      // 鼠标左键
      this.x = e.x;
      this.y = e.y
      window.addEventListener('mousemove', this.onMousemove);
      window.addEventListener('mouseup', this.onMouseup);
      // window.removeEventListener('click', this.onClick);
    }
  }

  //鼠标移动事件
  onMousemove(e) {
   this.offset.x = this.curOffset.x + (e.x - this.x);
   this.offset.y = this.curOffset.y + (e.y - this.y);
   this.canvas.style.pointerEvents = 'none' //阻止事件穿透（禁止鼠标点击事件）

   this.paint();
  }

  // 鼠标抬起事件
  onMouseup() {
    this.curOffset.x = this.offset.x;
    this.curOffset.y = this.offset.y;
    window.removeEventListener('mousemove', this.onMousemove);
    window.removeEventListener('mouseup', this.onMouseup);
    this.canvas.style.pointerEvents = null // 恢复点击行为（恢复鼠标点击事件）
  }

  // 滚轮滚动放大缩小
  onMousewheel(e) {
    e.preventDefault();
    this.mousePosition.x = e.offsetX; // 记录当前鼠标点击的横坐标
    this.mousePosition.y = e.offsetY; // 记录当前鼠标点击的纵坐标
    if (e.wheelDelta > 0) {
      // 放大
      this.scale = parseFloat((this.scaleStep + this.scale).toFixed(2)); // 解决小数点运算丢失精度的问题
      if (this.scale > this.maxScale) {
        this.scale = this.maxScale;
        return;
      }
    } else {
      // 缩小
      this.scale = parseFloat((this.scale - this.scaleStep).toFixed(2)); // 解决小数点运算丢失精度的问题
      if (this.scale < this.minScale) {
        this.scale = this.minScale;
        return;
      }
    }
    this.zoom()
  }

  zoom() {
    this.offset.x = this.mousePosition.x - (this.mousePosition.x - this.offset.x) * this.scale / this.preScale;
    this.offset.y = this.mousePosition.y - (this.mousePosition.y - this.offset.y) * this.scale / this.preScale;

    this.paint(this.ctx);
    this.preScale = this.scale;
    this.curOffset.x = this.offset.x;
    this.curOffset.y = this.offset.y;
  }

  // 放大
  zoomIn() {
    this.scale += this.scaleStep;
    if (this.scale > this.maxScale) {
      this.scale = this.maxScale;
      return;
    }
    this.mousePosition.x = this.width / 2;
    this.mousePosition.y = this.height / 2;
    this.zoom();
  }

  // 缩小
  zoomOut() {
    this.scale -= this.scaleStep;
    if (this.scale < this.minScale) {
      this.scale = this.minScale;
      return;
    }
    this.mousePosition.x = this.width / 2;
    this.mousePosition.y = this.height / 2;
    this.zoom();
  }

  // 重置
  reset() {
    this.clear();
    this.scale = 1; // 当前缩放
    this.preScale = 1; // 上一次缩放
    this.offset = { x: 0, y: 0 }; // 拖动偏移
    this.curOffset = { x: 0, y: 0 }; // 当前偏移
    this.mousePosition = { x: 0, y: 0 };

    this.timer = 0
    this.points = [] //已经运动过的数据
    this.animatePoint = { x: 0, y: 0 } //当前运动点位置
    this.nextPointIndex = 1 //下一个运动点的index
    this.routes = [] // 运动点位
    this.startTime = 0
    this.init()
    // this.showLine ? this.draw() : this.initSite()
  }

}

export default drawSence
