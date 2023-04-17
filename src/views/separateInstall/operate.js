class Operate {
    flag = false
    moveDistance = {}
    animation = {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0,
    }
  constructor(id, outId) {
    this.id = id
    this.outId = outId

    this.mapElem = document.querySelector('#' + id)
    this.outElem = document.querySelector('#' + outId)

    this.onMousedown1 = this.onMousedown1.bind(this)
    this.onMousemove1 = this.onMousemove1.bind(this)
    this.onMouseup1 = this.onMouseup1.bind(this)
    this.onMouseout = this.onMouseout.bind(this)
    this.onMousewheel = this.onMousewheel.bind(this)
    // this.onClick = this.onClick.bind(this)
    this.mapElem.addEventListener('mousedown', this.onMousedown1)
    this.mapElem.addEventListener('mousewheel', this.onMousewheel)
    this.outElem.addEventListener('mouseleave', this.onMouseout)
  }

   // 设置样式
   setStyle(elem, obj)
   {
     for (let key in obj)
     {
       let value = obj[key]
       elem.style.setProperty(key, value)
     }
   }

   // 获取元素相对于目标元素的 offsetTop offsetLeft
   getElementTopLeft(elem, target)
   {
     if (elem === target) {return {
       top: 0,
       left: 0,
     }}

     target || (target = null)
     let elemTop = elem.offsetTop
     let elemLeft = elem.offsetLeft

     elem = elem.offsetParent
     while (elem !== target)
     {
       elemTop += elem.offsetTop
       elemLeft += elem.offsetLeft
       elem = elem.offsetParent
     }

     return {
       top: elemTop,
       left: elemLeft,
     }
   }

   setMapStyle(obj)
   {
     let x = obj.x
     let y = obj.y
     let scale = obj.scale
     let duration = obj.duration
     this.setStyle(this.mapElem, {
       'transform-origin': '0px 0px',
       transition: `all ${duration / 1000}s ease-out 0s`,
       transform: `translate3d(${x}px, ${y}px, 0px) scale3d(${scale}, ${scale}, 1)`,
     })
   }

   // 测试使用
  //  this.setMapStyle(this.animation)


   // 鼠标按钮被按下
   onMousedown1(event) {
    // 0 为鼠标左键
    if (event.button === 0)
    {
      this.flag = true

      // clientX 鼠标指针相对于浏览器页面左边的水平坐标
      this.moveDistance = {
        x: event.clientX - this.animation.x,
        y: event.clientY - this.animation.y,
      }
    }
    window.addEventListener('mousemove', this.onMousemove1);
    window.addEventListener('mouseup', this.onMouseup1);
   }

   onMouseup1(event) {
     // 0 为鼠标左键
     if (event.button === 0)
     {
       this.flag = false
     }
   }

   onMousemove1(event) {
    if (this.flag)
    {
      let left = event.clientX - this.moveDistance.x
      let top = event.clientY - this.moveDistance.y

      // let FWidth = this.mapElem.parentNode.offsetWidth - this.mapElem.offsetWidth;
      // let FHeight = this.mapElem.parentNode.offsetHeight - this.mapElem.offsetHeight;
      // //移动当前元素
      // // console.log('left' + left);
      // // console.log('top' + top);
      // // 判断当前元素可以活动的区域
      // if (left <= 0) {
      //   left = 0 
      // } else if (left >= FWidth) {
      //   left = FWidth
      // }
      // if (top <= 0) {
      //   top = 0 
      // } else if (top >= FHeight) {
      //   top = FHeight
      // }

      this.animation = {
        x: left,
        y: top,
        scale: this.animation.scale,
        duration: 0,
      }

      this.setMapStyle(this.animation)
    }
    // window.addEventListener('mouseout', this.onMouseout);
   }

   onMouseout(event)
   {
     const ev = window.event || event;
     let path = ev.path || ev.composedpath && ev.composedpat()
     let mapIndex = path.findIndex(f => f === this.mapElem)
     let targetIndex = path.findIndex(f => f === event.relatedTarget)
     if (targetIndex > mapIndex)
     {
       this.flag = false
     }
   }

   onMousewheel(event, boolean)
   {
     let oldScale = this.animation.scale
     let scale = this.animation.scale

     if (event.wheelDelta > 0 || boolean)
     {
       // 上滑放大
       let maxScale = 3
       if (scale === maxScale) {return}
       scale = (scale + 0.1).toFixed(1) * 1
       if (scale >= maxScale) {scale = maxScale}
     } else
     {
       // 下滑缩小
       let minScale = 0.1
       if (scale === minScale) {return}
       scale = (scale - 0.1).toFixed(1) * 1
       if (scale <= minScale) {scale = minScale}
     }

     let ret = this.getElementTopLeft(event.target, this.mapElem)
     let left = this.animation.x + (event.offsetX + ret.left + 4) * (oldScale - scale)
     let top = this.animation.y + (event.offsetY + ret.top + 4) * (oldScale - scale)

     this.animation = {
       x: left,
       y: top,
       scale: scale,
       duration: 300,
     }
     this.setMapStyle(this.animation)
  }

  destory() {
    this.mapElem.removeEventListener('mousedown', this.onMousedown1)
    this.mapElem.removeEventListener('mousewheel', this.onMousewheel)
  }

  reset() {
    this.mapElem.addEventListener('mousedown', this.onMousedown1)
    this.mapElem.addEventListener('mousewheel', this.onMousewheel)
  }



}

export default Operate
