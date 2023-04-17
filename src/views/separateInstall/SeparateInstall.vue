<!-- eslint-disable complexity -->
<template>
  <div class="content">
    <div class="wrapper">
      <!-- <toor-bar 
        class="toorbar"
        @zoomIn="zoomIn"
        @zoomOut="zoomOut"
        @showPoint="showPoint"
        @play="play"
        @onShowSite="onShowSite"
        @reset="reset"></toor-bar> -->
        <toor-bar 
          :toorbar = 'toorbar'
          @onClick="toorbarClick"
          class="toorbar"></toor-bar>

      <div id="canvas-wrapper">
        <canvas id="canvas" style="background-color:#f0f2f5"></canvas>
      </div>
      <div class="infor">
        <ul>
          <li>x坐标:{{ '' || siteInfor.x }}</li>
          <li>y坐标:{{ '' || siteInfor.y }}</li>
          <li>站点名称:{{siteInfor.nodeName}}</li>
          <!-- <li>场站类型：{{siteInfor.type}}</li>
          <li>位置信息：{{siteInfor.infor}}</li> -->
        </ul>
        <!-- <el-button @click="clear">点清除</el-button> -->
      </div>

      <ul class="bottom-info">
        <li class="info-list"><span>消息：220</span></li>
        <li class="info-list"><span>待办：120</span></li>
        <li class="info-list">
          <el-switch
            v-model="audioInfo"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
          <span>语音提示</span>
        </li>
        <li class="info-list">
          <el-switch
            v-model="messageInfo"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
          <span>消息提示</span>
        </li>
        <li class="info-list">
          <el-select v-model="selectValue" placeholder="楼层选择" @change="handleChange">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// import drawSence from './draw'
import drawSence from './path'
import Operate from './operate'
import ToorBar from '@/components/toor-bar/toor-bar.vue'
import screenfull from "screenfull";
import {getmapApi} from '@/service/api'
import agvImg from '@/assets/img/agv.png' //门禁
export default {
  components: {ToorBar},
  data() {
    return {
      sence: {},
      operate: {},
      canvas: {},
      ctx: {},
      audioInfo: true,
      messageInfo: true,
      coordinate: [[[25,70],[150,70],[[200,0],[250,130]],[700,130],[[730,0],[800,70]],[900,70],[950,90],[950,450],[75,450],[25,430],[25,70]],[[150, 500],[150, 350],[450, 350],[450, 300]],[[650, 500],[650, 430],[750, 430],[750, 300]]],

      routes: [
      [25, 70], [65, 70], [105,70], [145, 70], [185, 70], [225, 70],
      [25,100], [25,130], [25,160], 
      // [25, 70],[150,70],[[200,0],[250,130]],[700,130],[[730,0],[800,70]],[900,70],[950,90],[950,450],[75,450],[25,430],[25,70]
      ],

      siteObj2: {
        path: [
        {x: 0, y: 0, name: '设备', siteId: 1, type: 1, infor: '站点1'},
        {x: 25, y: 70, name: '设备', siteId: 1, type: 1, infor: '站点1'},
        {x: 65, y: 70, name: '充电站', siteId: 2, type: 0, infor: '站点2'},
        {x: 105, y: 70, name: '电梯', siteId: 3, type: 3, infor: '站点3'},
        {x: 145, y: 70, name: '工作站', siteId: 4, type: 4, infor: '站点4'},
        {x: 185, y: 70, name: '门禁', siteId: 5, type: 5, infor: '站点5'},
        {x: 25, y: 100, name: '门禁', siteId: 6, type: 5, infor: '站点6'},
        {x: 65, y: 100, name: '工作站', siteId: 7, type: 0, infor: '站点7'},
        {x: 105, y: 100, name: '电梯', siteId: 8, type: 3, infor: '站点8'},
        {x: 145, y: 100, name: '充电站', siteId: 9, type: 2, infor: '站点9'},
        {x: 185, y: 100, name: '设备', siteId: 10, type: 1, infor: '站点10'},
        {x: 25, y: 130, name: '门禁', siteId: 6, type: 5, infor: '站点6'},
        {x: 65, y: 130, name: '工作站', siteId: 7, type: 0, infor: '站点7'},
        {x: 105, y: 130, name: '电梯', siteId: 8, type: 3, infor: '站点8'},
        {x: 145, y: 130, name: '充电站', siteId: 9, type: 2, infor: '站点9'},
        {x: 185, y: 130, name: '设备', siteId: 10, type: 1, infor: '站点10'},
        {x: 25, y: 160, name: '门禁', siteId: 6, type: 5, infor: '站点6'},
        {x: 65, y: 160, name: '工作站', siteId: 7, type: 0, infor: '站点7'},
        {x: 105, y: 160, name: '电梯', siteId: 8, type: 3, infor: '站点8'},
        {x: 145, y: 160, name: '充电站', siteId: 9, type: 2, infor: '站点9'},
        {x: 185, y: 160, name: '设备', siteId: 10, type: 1, infor: '站点10'},
        {x: 25, y: 190, name: '门禁', siteId: 6, type: 5, infor: '站点6'},
        {x: 65, y: 190, name: '工作站', siteId: 7, type: 0, infor: '站点7'},
        {x: 105, y: 190, name: '电梯', siteId: 8, type: 3, infor: '站点8'},
        {x: 145, y: 190, name: '充电站', siteId: 9, type: 2, infor: '站点9'},
        {x: 185, y: 190, name: '设备', siteId: 10, type: 1, infor: '站点10'}],
        point: 
        [{x: 200, y: 100},
        {x: 250, y: 150},
        {x: 350, y: 200},
        {x: 380, y: 250},
        ]
        // {x: 25, y: 70, siteId: 11, type: 2, infor: '站点11'}
      },
      siteObj1: {
        path: [{x: 0, y: 0, name: '设备', siteId: 1, type: 1, infor: '站点1'},
          {x: 20, y: 70, name: '设备', siteId: 1, type: 1, infor: '站点1'},
        {x: 80, y: 70, name: '充电站', siteId: 2, type: 0, infor: '站点2'},
        {x: 140, y: 70, name: '电梯', siteId: 3, type: 3, infor: '站点3'},
        {x: 200, y: 70, name: '工作站', siteId: 4, type: 4, infor: '站点4'},
        {x: 260, y: 70, name: '门禁', siteId: 5, type: 5, infor: '站点5'},
        {x: 20, y: 130, name: '门禁', siteId: 6, type: 5, infor: '站点6'},
        {x: 80, y: 130, name: '工作站', siteId: 7, type: 0, infor: '站点7'},
        {x: 140, y: 130, name: '电梯', siteId: 8, type: 3, infor: '站点8'},
        {x: 200, y: 130, name: '充电站', siteId: 9, type: 2, infor: '站点9'},
        {x: 260, y: 130, name: '设备', siteId: 10, type: 1, infor: '站点10'},
        {x: 20, y: 190, name: '门禁', siteId: 6, type: 5, infor: '站点6'},
        {x: 80, y: 190, name: '工作站', siteId: 7, type: 0, infor: '站点7'},
        {x: 140, y: 190, name: '电梯', siteId: 8, type: 3, infor: '站点8'},
        {x: 200, y: 190, name: '充电站', siteId: 9, type: 2, infor: '站点9'},
        {x: 260, y: 190, name: '设备', siteId: 10, type: 1, infor: '站点10'},
        {x: 20, y: 250, name: '门禁', siteId: 6, type: 5, infor: '站点6'},
        {x: 80, y: 250, name: '工作站', siteId: 7, type: 0, infor: '站点7'},
        {x: 140, y: 250, name: '电梯', siteId: 8, type: 3, infor: '站点8'},
        {x: 200, y: 250, name: '充电站', siteId: 9, type: 2, infor: '站点9'},
        {x: 260, y: 250, name: '设备', siteId: 10, type: 1, infor: '站点10'},
        {x: 20, y: 310, name: '门禁', siteId: 6, type: 5, infor: '站点6'},
        {x: 80, y: 310, name: '工作站', siteId: 7, type: 0, infor: '站点7'},
        {x: 140, y: 310, name: '电梯', siteId: 8, type: 3, infor: '站点8'},
        {x: 200, y: 310, name: '充电站', siteId: 9, type: 2, infor: '站点9'},
        {x: 260, y: 310, name: '设备', siteId: 10, type: 1, infor: '站点10'}],
        point: 
        [{x: 200, y: 100},
        {x: 250, y: 150},
        {x: 350, y: 200},
        {x: 380, y: 250},
        ]
        // {x: 25, y: 70, siteId: 11, type: 2, infor: '站点11'}
      },
      siteObj: {},
      siteInfor: {},
      isPoint: false,
      scale: 1,
      options: [
        {
          value: '1',
          label: '楼层ALL'
        }, {
          value: '2',
          label: '一楼'
        }, {
          value: '3',
          label: '二楼'
        }],
      selectValue: '1',
      isShowLine: false, //是否显示路径
      toorbar: [
        {id: 1, icon: 'icon-quanping', content: '全屏', click: null, elId: 'fullscreenbtn'},
        {id: 2, icon: 'icon-fangda', content: '放大', click: this.zoomIn},
        {id: 3, icon: 'icon-suoxiao', content: '缩小', click: this.zoomOut},
        {id: 4, icon: 'icon-gonglu', content: '路径全选', click: this.onShowSite},
        {id: 5, icon: 'icon-Icon_lujinghuizhi', content: '路径绘制', click: this.play},
        {id: 6, icon: 'icon-dianweipeizhi', content: '显示点位', click: this.showPoint},
        {id: 7, icon: 'icon-zhongzhi', content: '重置', click: this.reset},
      ],
      oldX: null, // 上一次点击矩形的X坐标
      oldY: null // 上一次点击矩形的Y坐标
    }
  },
  created() {
    // this.siteObj = this.siteObj2
    this.initMap()
  },

  methods: {

    initMap() {
      const option = {width: 3500, height: 3500}

      getmapApi().then(res => {
        this.siteObj = res
        this.operate = new Operate('canvas', 'canvas-wrapper')
        this.operate.setMapStyle(this.operate.animation)
        // this.sence = new drawSence('canvas', this.coordinate)
        this.sence = new drawSence('canvas', this.siteObj, option)
        this.sence.init() // 初始化事件
        this.handleClick() // 点击事件

        // 显示小车位置
        let nodes = res.nodes
        for(let i = 0; i < nodes.length;i++) {
          setTimeout(() => {
            this.sence.drawImg(agvImg, nodes[i].x - 10, nodes[i].y - 10, 20, 20)
            this.sence.reset()
          }, 3000 * (i + 1))
        }
      })
    },

    // 工具栏点击
    toorbarClick(data) {
      if (data.click) {
        data.click()
      }
    },

    // 楼层选择
    handleChange(value) {
      console.log(value)
      if (value === '2') {
        this.siteObj = this.siteObj1
      }else {
        this.siteObj = this.siteObj2
      }
      this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight) // 清空画布内容
      this.sence = new drawSence('canvas', this.siteObj)
      this.sence.init()

      
    },

    play() {
      this.sence.initPlay(this.routes)
    },

    clickToor(data) {
      console.log(data)
      data.click()
    },

    // // 全屏
    // fullscreen() {
    //   const el = document.getElementById('#canvas')
    //   screenfull.toggle(el); //全屏显示
    // },

    reset() {
      this.scale = 1
      this.operate.flag = false
      this.operate.moveDistance = {}
      this.operate.animation = {
        x: 100,
        y: 100,
        scale: 1,
        duration: 0,
      }
      this.operate.setMapStyle(this.operate.animation)
      this.sence.reset()
    },
    onShowSite() {
      this.isShowLine = !this.isShowLine
      if (this.isShowLine) {
        if (!this.siteObj.segmentNum) {
          this.$message({
            message: '暂无路径信息'
          })
        } else {
          this.siteObj.segmentInfos.forEach(item => {
            this.sence.drawLine(item.control1X, item.control1Y, item.control2X, item.control2Y)
          })
        }
      } else {
        this.sence.reset()
      }

    },

    zoomOut() {
      // this.operate.onMousewheel(false)
      this.scale -= 0.1
      if (this.scale <= 0.1) {return}
      let ele = document.querySelector('canvas');
      ele.style.height = ele.height * this.scale + 'px';
      ele.style.width = ele.width * this.scale + 'px';
    },

     zoomIn() {
      // this.operate.onMousewheel(true)
      this.scale += 0.1
      if (this.scale >= 3) {return}
      let ele = document.querySelector('canvas');
      ele.style.height = ele.height * this.scale + 'px';
      ele.style.width = ele.width * this.scale + 'px';
    },

    // 显示点位
    showPoint() {
      this.isPoint = !this.isPoint
      this.sence.showPoint = this.isPoint
      this.sence.paint()
    },

    handleClick() {
      this.canvas = document.querySelector('#canvas')
      this.ctx = this.canvas.getContext('2d')
      this.canvas.addEventListener('click', this.onClick)
    },

    onClick(event) {
      let arr = [...this.siteObj.nodes, ...this.siteObj.magPoints, ...this.siteObj.actionPoints]

      let getBoundingClientRect = this.canvas.getBoundingClientRect()
      const width = this.canvas.width 
      const height = this.canvas.height
      let x = event.clientX - getBoundingClientRect.left - width / 2 // 当前位置相对于原点的x坐标
      let y = height / 2 - (event.clientY - getBoundingClientRect.top) //当前位置相对于原点的y轴坐标
      console.log([x, y])
        let scale = this.operate.animation.scale // 鼠标滚动的缩放比例
        let scaleX = (width * scale * this.scale - width) / 2 // 缩放后x轴原点
        let scaleY = (height * scale * this.scale - height) / 2 // 缩放后y轴原点
        // eslint-disable-next-line complexity
        arr.forEach(item => {
          if (x >= item.x * scale * this.scale - 10 + scaleX && x <= item.x * scale * this.scale + 10 + scaleX && y >= item.y * scale * this.scale - 10 - scaleY && y <= item.y * scale * this.scale + 10 - scaleY){
            this.siteInfor = item
            if ((item.nodeId || item.nodeId === 0) && item.isStation) {
              this.ctx.clearRect(item.x - 10, item.y - 10, 20, 20)
              this.ctx.fillStyle = 'green';
              this.ctx.fillRect(item.x - 10, item.y - 10, 20, 20);
              if ((this.oldX || this.oldX === 0 ) && (this.oldY || this.oldY === 0)) {
                this.ctx.clearRect(this.oldX - 10, this.oldY - 10, 20, 20)
                this.sence.drawRect(this.oldX - 10, this.oldY - 10, 20, 20);
              }
              this.oldX = item.x
              this.oldY = item.y
            } 
            // else {
            //   this.ctx.strokeStyle = 'green'
            //   this.ctx.rect(item.x - 10, item.y - 10, 20, 20)
            //   this.ctx.stroke()
            //   if ((this.oldX || this.oldX === 0 ) && (this.oldY || this.oldY === 0)) {
            //     this.ctx.clearRect(this.oldX - 10, this.oldY - 10, 20, 20)
            //   }
            // }
            
          }
        })
    }

  },


  mounted() {
    // this.$nextTick(()=> {
    //   this.operate = new Operate('canvas', 'canvas-wrapper')
    //   this.operate.setMapStyle(this.operate.animation)
    //   // this.sence = new drawSence('canvas', this.coordinate)
    //   this.sence = new drawSence('canvas', this.siteObj)
    //   this.sence.init()
    //   this.handleClick()
    // })

    // sence.setCar()

    const element = document.getElementById('canvas-wrapper');//指定全屏区域元素
    document.getElementById('fullscreenbtn').addEventListener('click', () => {
      screenfull.request(element);
    });//实现模块全屏

  },

  beforeDestroy() {

  }
}
</script>

<style lang="less" scoped>
  .content {
    width: 100%;
    height: 100%;
    .wrapper {
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .toorbar {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 99;
      }
      #canvas-wrapper {
        width: 100%;
        height: 100%;
        // width: 1000px;
        // height: 600px;
        overflow: hidden;
        background-color: #fff;
      }
      .infor {
        width: 20%;
        position: absolute;
        right: 50px;
        top: 40%;
        ul {
          li {
            margin-top: 10px;
          }
        }
      }

      .bottom-info {
        display: flex;
        position: absolute;
        width: 100%;
        height: 35px;
        bottom: 0;
        left: 0;
        justify-content: space-between;
        .info-list {
          width: 24%;
          height: 100%;
          position: relative;
          &:after {
            top: 25%;
            left: auto;
            right: 0;
            width: 0;
            height: 50%;
            border-right: 0.01rem solid #ddd;
            position: absolute;
            display: block;
            content: " ";
            font-size: 0;
            line-height: 0;
          }
        }
      }
    }
  }

  /deep/ .el-input--suffix .el-input__inner {
    height: 30px;
  }
  .canvas-content {
    position: absolute;
    left: 200px;
    // background-color: rgb(94, 179, 152);
  }
</style>
