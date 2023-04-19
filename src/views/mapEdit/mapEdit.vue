<!-- eslint-disable complexity -->
<template>
  <div class="content">
    <div class="wrapper">
      <div id="canvas-wrapper" class="left">
        <canvas id="canvas"></canvas>
        <div id="coor"></div>
        <toor-bar
          :toorbar="toorbar"
          class="toorbar"
          @onClick="toorbarClick">
        </toor-bar>
      </div>
      <div class="right">
        <div class="map-operate">
        <el-button @click="edit" :disabled="!disabledEdit">编辑</el-button>
        <el-button @click="onDelete" :disabled="!disabledEdit">删除</el-button>
        <!-- <el-button @click="onBetchAdd">批量增加</el-button> -->
        <el-button @click="saveSite">保存地图</el-button>
        </div>
        <div class="infor" id="add-content">
          <site-form v-if="!showMegmentInfo" :addInfor1="addInfor" :disabledSave="disabledSave"></site-form>
          <segment-form v-if="showMegmentInfo" :addInfor1="megmentInfo" :disabledSave="disabledSave"></segment-form>
          <div class="operate">
            <el-button @click="onSaveInfo" :disabled="!disabledSave">保存</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="批量增加点位" :visible.sync="dialogFormVisible">
      <Dialog 
        :dialogFormVisible="dialogFormVisible"
        :startX="x"
        :startY="y"
        @onCancel="dialogCancel"
        @onDefine="dialogDefine"
        ref="dialogRef"
      ></Dialog>
    </el-dialog>
 
  </div>
</template>

<script>
import Operate from '../separateInstall/operate'
import drawSence from '@/views/separateInstall/path'
import {getBezierT, getThreeBezierPoint} from './bezier'
import {mapinfoApi, getmapApi} from '@/service/api'
import ToorBar from '@/components/toor-bar/toor-bar.vue'
import Dialog from './cpns/dialog.vue'
import SiteForm from './cpns/siteForm.vue'
import SegmentForm from './cpns/segmentForm.vue'
import formConfig from '@/assets/data/siteConfig.json'
import segmentConfig from '@/assets/data/segmentConfig.json'
export default {
  components: {ToorBar, Dialog, SiteForm, SegmentForm},
  data() {
    return {
      sence: {},
      canvas: {},
      ctx: {},
      operate: null,
      siteObj: {},
      siteInfor: {},
      isEdit: false, // 编辑
      disabledEdit: false, // 是否可以编辑（点击点位时可以编辑）
      disabledSave: false, // 是否可以点击确定按钮
      flag: false,
      addInfor: {},
      megmentInfo: {}, // 线段信息
      showMegmentInfo: false, // 展示点位信息还是线段信息
      isAdd: true, // 是否可以添加节点
      toorbar: [
        {id: 1, type: 6, icon: 'icon-zhandian', content: '添加节点', point: true},
        {id: 2, type: 7, icon: 'icon-ding', content: '添加磁钉点', point: true},
        {id: 3, type: 8, icon: 'icon-gongneng_dian', content: '添加功能点', point: true},
        {id: 4, icon: 'icon-24gl-square', type: 1, content: '添加站点', point: false},
        {id: 6, icon: 'icon-huaxian', type: -2, content: '直线', lineType: 1},
        {id: 9, icon: 'icon-zhengyuanhu', type: -2, content: '圆弧', lineType: 2},
        {id: 10, icon: 'icon-quxianlujing', type: -2, content: '贝塞尔曲线', lineType: 3},
        {id: 7, icon: 'icon-piliangcaozuo', type: -3, content: '批量增加'},
        {id: 8, icon: 'icon-xinxi', type: -4, content: '点位显示'},
        {id: 5, icon: 'icon-24gl-grid', type: -1, content: '网格显示'},
      ],
      pointTypes: 0, // 点的类型（1：站点；6：节点；7：磁钉点；8：功能点）
      lineType: 0, // 线的类型（1：直线；2：圆弧；3：贝塞尔）
      isLine: false, // 是否画线
      isGrid: true, // 是否展示坐标网格
      addP: false, // 是否是增加点的操作
      selectP: false, // 批量操作中是否可以选择点
      isShowName: true, // 切换站点名称
      x: 0, // 当前位置x坐标
      y: 0, // 当前位置y坐标
      oldX: null, // 鼠标按下时X坐标
      oldY: null, //鼠标按下时Y坐标
      startNode: null, // 开始node
      endNode: null, // 结束node
      startNodeName: '', // 画线时开始节点的节点名称
      endNodeName: '', // 画线时结束节点的节点名称
      dialogFormVisible: false, // 批量增加dialog
      arcLength: 0, // 弧长
      arcArr: [], // 关于弧线的数组
      bezierArr: [] // 关于贝塞尔曲线的数组
    }
  },

  created() {
    this.getMapInfo()
  },

  methods: {
    // 获取地图信息
    getMapInfo() {
      getmapApi().then(res => {
        this.siteObj = res
        this.init()
        this.handleClick()
        this.operate = new Operate('canvas', 'canvas-wrapper')
        this.operate.setMapStyle(this.operate.animation)
      })
    },

    // 保存地图
    saveSite() {
      let params = Object.assign(this.siteObj, {nodeNum: this.siteObj.nodes.length, magNum: this.siteObj.magPoints.length, actionPointNum: this.siteObj.actionPoints.length, agvNum: this.siteObj.agvInfos.length,segmentNum: this.siteObj.segmentInfos.length, segmentInfos: this.siteObj.segmentInfos})
      mapinfoApi(params).then(res=> {
        if (res.success) {
          this.$message({
            message: '地图上传成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '地图上传失败',
            type: 'error'
          })
        }
      })
    },

    // 地图初始化
    init() {
      const option = {width: 3500, height: 3500}
      this.canvas = document.querySelector('#canvas')
      this.ctx = this.canvas.getContext('2d')
      this.sence = new drawSence('canvas', this.siteObj, option)
      if (this.isGrid) {
        this.sence.initGrid(10)
      }
      if (this.isShowName) {
        this.toggleName()
      }
      this.sence.init()
      this.getLine()
    },

    // 生成线段
    getLine() {
      if (this.siteObj.segmentNum) {
        let segmentArr = this.getSegmentCoor()
        segmentArr.forEach(item => {
          if (item.type === 0 || item.type === 1) {
            this.sence.drawLine(item.startX, item.startY, item.endX, item.endY, item.flag ?? false)
          } else if (item.type === 2) {
            this.getArcLine(item.startX, item.startY, item.endX, item.endY, item.rotAngle, item.isClockwiseDirection === 0 ? true : false)
          } 
          else if (item.type === 3) {
            this.sence.drawbezierCurve(item.startX, item.startY, item.control1X, item.control1Y, item.control2X, item.control2Y, item.endX, item.endY)

            this.bezierArr.push({startPoint: {x1: item.startX, y1: item.startY}, endPoint: {x2: item.endX, y2: item.endY}, control1: {cx1: item.control1X, cy1: item.control1Y}, control2: {cx2: item.control2X, cy2: item.control2Y}})
          }
        })
      }
    },

    // 编辑
    edit() {
      if (this.operate) {
        this.operate.destory() // 编辑时取消拖拽画布
      }
      this.isEdit = true
      this.disabledSave = true
      this.canvas.addEventListener('mousedown', this.onMousedown)
      // 如果是编辑贝塞尔曲线，可以在画布上更改控制点位置
      if (this.lineType === 3) {
        this.sence.drawArc(this.megmentInfo.control1X, this.megmentInfo.control1Y, 3, 0, 2 * Math.PI)
        this.sence.drawArc(this.megmentInfo.control2X, this.megmentInfo.control2Y, 3, 0, 2 * Math.PI)
        this.canvas.addEventListener('mousedown', this.onQuadratic)

        // this.canvas.onmousedown = e => this.onQuadratic(e)
      }
    },

    onQuadratic(e) {
      this.getCoor1(e)
      if (this.x >= this.megmentInfo.control1X - 5 && this.x <= this.megmentInfo.control1X + 5 && this.y >= this.megmentInfo.control1Y - 5 && this.y <= this.megmentInfo.control1Y + 5) {
        this.canvas.removeEventListener('mouseup', this.onQuadraticUp2)
        this.canvas.addEventListener('mouseup', this.onQuadraticUp1)
      }

      if (this.x >= this.megmentInfo.control2X - 5 && this.x <= this.megmentInfo.control2X + 5 && this.y >= this.megmentInfo.control2Y - 5 && this.y <= this.megmentInfo.control2Y + 5) {
        this.canvas.removeEventListener('mouseup', this.onQuadraticUp1)
        this.canvas.addEventListener('mouseup', this.onQuadraticUp2)
      }
    },
    onQuadraticUp1(e) {
      this.getCoor1(e)
      this.megmentInfo.control1X = this.x
      this.megmentInfo.control1Y = this.y
      // this.sence.drawbezierCurve(this.oldX, this.oldY, control1.x, control1.y, control2.x, control2.y, taggleX, taggleY)
      this.sence.drawbezierCurve(this.megmentInfo.startX, this.megmentInfo.startY, this.megmentInfo.control1X, this.megmentInfo.control1Y, this.megmentInfo.control2X, this.megmentInfo.control2Y, this.megmentInfo.endX, this.megmentInfo.endY)
      this.sence.drawArc(this.megmentInfo.control1X, this.megmentInfo.control1Y, 3, 0, 2 * Math.PI)
      this.sence.drawArc(this.megmentInfo.control2X, this.megmentInfo.control2Y, 3, 0, 2 * Math.PI)
      this.x = this.y = null
    },

    onQuadraticUp2(e) {
      this.getCoor1(e)
      this.megmentInfo.control2X = this.x
      this.megmentInfo.control2Y = this.y
      // this.sence.drawbezierCurve(this.oldX, this.oldY, control1.x, control1.y, control2.x, control2.y, taggleX, taggleY)
      this.sence.drawbezierCurve(this.megmentInfo.startX, this.megmentInfo.startY, this.megmentInfo.control1X, this.megmentInfo.control1Y, this.megmentInfo.control2X, this.megmentInfo.control2Y, this.megmentInfo.endX, this.megmentInfo.endY)
      this.sence.drawArc(this.megmentInfo.control1X, this.megmentInfo.control1Y, 3, 0, 2 * Math.PI)
      this.sence.drawArc(this.megmentInfo.control2X, this.megmentInfo.control2Y, 3, 0, 2 * Math.PI)
      this.x = this.y = null
    },

    // // 批量增加
    // onBetchAdd() {
    //   this.dialogFormVisible = true
    // },

    // 删除点位
    onDelete() {
      this.$confirm(`确定删除该点位以及该点位所连接的线段信息吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除点位
        if (this.pointTypes === 1 || this.pointTypes === 6) {
          const index = this.siteObj.nodes.findIndex(item => item.nodeId === this.siteInfor.nodeId)
          this.siteObj.nodes.splice(index, 1)
        }else if (this.pointTypes === 7) {
          const index = this.siteObj.magPoints.findIndex(item => item.magId === this.siteInfor.magId)
          this.siteObj.magPoints.splice(index, 1)
        } else if (this.pointTypes === 8) {
          const index = this.siteObj.magPoints.findIndex(item => item.actionId === this.siteInfor.actionId)
          this.siteObj.actionPoints.splice(index, 1)
        }

        // 删除线段
        this.siteObj.segmentInfos = this.siteObj.segmentInfos.filter(item => {
          return (item.control1X !== this.addInfor.x || item.control1Y !== this.addInfor.y) && (item.control2X !== this.addInfor.x || item.control2Y !== this.addInfor.y)
        })

        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.disabledEdit = false
        this.init()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
    },

    //工具栏点击事件
    // eslint-disable-next-line complexity
    toorbarClick(data) {
      if (!this.isAdd) {
        return this.$message({
          message: '请先编辑上一条点位信息',
          type: 'warning'
        })
      }
      if (data.type === -2) {
        this.isLine = !this.isLine
        if (this.isLine) {
          this.lineType = data.lineType
          this.canvas.addEventListener('mousedown', this.onMousedown)
          this.operate.destory()
        } else {
          this.lineType = 0
          this.operate.reset()
          // this.canvas.addEventListener('mousedown', this.operate.onMousedown1)
          this.canvas.removeEventListener('mousemove', this.onMousemove)
          this.canvas.removeEventListener('mouseup', this.onMouseup)
        }
        // console.log(this.lineType)
      }
      else if(data.type === -1) {
        this.isGrid = !this.isGrid
        this.init()
      } else if (data.type === -3) {
        this.operate.destory()
        this.$message('请在画布中选择初始点')
        this.selectP = true
        this.canvas.style.cursor = 'crosshair'
        this.canvas.onclick = e => this.selectPoint(e)
      }else if (data.type === -4) {
        this.isShowName = !this.isShowName
        this.init()
      } else {
        this.pointTypes = data.type
        this.addInfor = Object.assign({}, this.pointTypes === 1 ? formConfig.node1 : this.pointTypes === 6 ? formConfig.node0 : this.pointTypes === 7 ? formConfig.mag_point : this.pointTypes === 8 ? formConfig.action_point : {}) 
        this.addP = true
        this.canvas.style.cursor = 'crosshair'
        this.canvas.onclick = e => this.addPoint(e, data)
      }
    },

    // 切换展示点位名称
    toggleName() {
      let arr = [...this.siteObj.nodes, ...this.siteObj.magPoints, ...this.siteObj.actionPoints]
      arr.forEach(item => {
        let name = item.nodeName || item.magPointName || item.actionName
        this.sence.drawText(name, item.x - 10, -item.y - 15)
      })
    },

    // 获取当前位置坐标
    getCoor(event) {
      let getBoundingClientRect = this.canvas.getBoundingClientRect()
      const width = this.canvas.width 
      const height = this.canvas.height
      this.x = event.clientX - getBoundingClientRect.left - width / 2 // 当前位置相对于原点的x坐标
      this.y = height / 2 - (event.clientY - getBoundingClientRect.top) //当前位置相对于原点的y轴坐标q
    },

    // 获取缩放后的坐标
    getCoor1(e) {
      this.getCoor(e)
      let scale = this.operate.animation.scale // 鼠标滚动的缩放比例
      let scaleX = (this.canvas.width * scale - this.canvas.width) / 2 // 缩放后x轴原点
      let scaleY = (this.canvas.height * scale - this.canvas.height) / 2 // 缩放后y轴原点
     this.x = (this.x - scaleX) / scale
     this.y = (this.y + scaleY) / scale
    },

    // 获取线段起始坐标与结束坐标
    getSegmentCoor() {
      let arr = []
      this.siteObj.segmentInfos.forEach(item => {
        let startNode = this.siteObj.nodes.filter(node => node.nodeId === item.startNodeId)
        let endNode = this.siteObj.nodes.filter(node => node.nodeId === item.endNodeId)
        if (startNode && endNode) {
          arr.push(Object.assign({}, item, {startX: startNode[0].x, startY: startNode[0].y, endX: endNode[0].x, endY: endNode[0].y}))
        }
      })
      return arr
    },

    // 保存点信息
    // eslint-disable-next-line complexity
    onSaveInfo() {
      this.isAdd = true
      // let innerDiv = document.querySelector('#add-content')
      // innerDiv.style.display = 'none'
      // 非编辑状态下进行数据添加
      if (!this.isEdit) {
        if (this.pointTypes === 1) {
          this.siteObj.nodes.push({nodeId: this.siteObj.nodes.length, nodeName: this.addInfor.name, x: this.x, y: this.y, isStation: 1, stationType: this.addInfor.value, endMode: this.addInfor.otherValue, x1: 0, x2: 0, y1: 0, y2: 0, codeId: this.siteObj.nodes.length, miscellaneous: ''})
        } else if (this.pointTypes === 6) {
          this.siteObj.nodes.push({nodeId: this.siteObj.nodes.length, nodeName: this.addInfor.name, x: this.x, y: this.y, isStation: 0, stationType: this.addInfor.value, endMode: this.addInfor.otherValue, x1: 0, x2: 0, y1: 0, y2: 0, codeId: this.siteObj.nodes.length, miscellaneous: ''})
        } else if (this.pointTypes === 7) {
          this.siteObj.magPoints.push({magId: this.siteObj.magPoints.length, magPointName: this.addInfor.name, x: this.x, y: this.y, magType: this.addInfor.value, magInterval: this.addInfor.magInterval})
        } else if (this.pointTypes === 8) {
          this.siteObj.actionPoints.push({actionId: this.siteObj.actionPoints.length, actionName: this.addInfor.name, actionTypes: this.addInfor.value, actionContents: '', x: this.x, y: this.y})
        }
        if (this.isShowName) {
        this.toggleName()
      }
      } else { // 编辑状态下修改此条数据
        // console.log(this.addInfor)
        if (this.pointTypes === 1) {
          this.siteObj.nodes.forEach(item => {
            if (item.nodeId === this.siteInfor.nodeId) {
              item = Object.assign(item, {nodeName: this.addInfor.name, x: this.addInfor.x, y: this.addInfor.y, stationType: this.addInfor.value, endMode: this.addInfor.otherValue})
            }
          })
        } else if (this.pointTypes === 6) {
          this.siteObj.nodes.forEach(item => {
            if (item.nodeId === this.siteInfor.nodeId) {
              item = Object.assign(item, {nodeName: this.addInfor.name, x: this.addInfor.x, y: this.addInfor.y})
            }
          })
        } else if (this.pointTypes === 7) {
          this.siteObj.magPoints.forEach(item => {
            if (item.magId === this.siteInfor.magId) {
              item = Object.assign(item, {magPointName: this.addInfor.name, x: this.addInfor.x, y: this.addInfor.y, magType: this.addInfor.value, magInterval: this.addInfor.magInterval})
            }
          })
        } else if (this.pointTypes === 8) {
          this.siteObj.actionPoints.forEach(item => {
            if (item.actionId === this.siteInfor.actionId) {
              item = Object.assign(item, {actionName: this.addInfor.name, x: this.addInfor.x, y: this.addInfor.y, actionTypes: this.addInfor.value})
            }
          })
        }
        if (this.lineType === 1) {
          this.siteObj.segmentInfos = this.siteObj.segmentInfos.map(item =>{
            if (item.segmentId === this.megmentInfo.segmentId) {
              item = Object.assign(item, {segmentName: this.megmentInfo.segmentName, directionality: this.megmentInfo.directionality ? 1 : 0, maxSpeed: this.megmentInfo.maxSpeed})
            }
            return item
          })
          // console.log(this.siteObj.segmentInfos)
        }
        if (this.lineType === 2) {
          this.siteObj.segmentInfos = this.siteObj.segmentInfos.map(item =>{
            if (item.segmentId === this.megmentInfo.segmentId) {
              item = Object.assign(item, {segmentName: this.megmentInfo.segmentName, directionality: this.megmentInfo.directionality ? 1 : 0, isClockwiseDirection: this.megmentInfo.isClockwiseDirection ? 1 : 0, maxSpeed: this.megmentInfo.maxSpeed, rotAngle: this.megmentInfo.rotAngle})
            }
            return item
          })
          // console.log(this.siteObj.segmentInfos)
        }
        if (this.lineType === 3) {
          this.siteObj.segmentInfos = this.siteObj.segmentInfos.map(item =>{
            if (item.segmentId === this.megmentInfo.segmentId) {
              item = Object.assign(item, {segmentName: this.megmentInfo.segmentName, directionality: this.megmentInfo.directionality ? 1 : 0, maxSpeed: this.megmentInfo.maxSpeed, control1X: this.megmentInfo.control1X, control1Y: this.megmentInfo.control1Y, control2X: this.megmentInfo.control2X, control2Y: this.megmentInfo.control2Y})
            }
            return item
          })
          this.canvas.removeEventListener('mousedown', this.onQuadratic)
          this.canvas.removeEventListener('mouseup', this.onQuadraticUp1)
          this.canvas.removeEventListener('mouseup', this.onQuadraticUp2)
          this.lineType = 0
        }
        this.isEdit = false
        this.operate.reset()
        this.init()
        // this.canvas.addEventListener('mousedown', this.operate.onMousedown1)
      }
      this.$message({
        message: '保存成功',
        type: 'success'
      })
      this.disabledSave = false
    },

    // 添加点信息
    // eslint-disable-next-line complexity
    addPoint(event, data) {
      event.stopPropagation()
      this.getCoor(event)
      const color = { 6: 'red', 7: 'blue', 8: 'green'}

      if (this.addP) { 
        this.getCoor1(event)
        this.addInfor.x = this.x
        this.addInfor.y = this.y
        this.addInfor.id = this.pointTypes === 1 ? this.siteObj.nodes.length : this.pointTypes === 6 ? this.siteObj.nodes.length : this.pointTypes === 7 ? this.siteObj.magPoints.length : this.pointTypes === 8 ? this.siteObj.actionPoints.length : 0
        this.addInfor.name += this.pointTypes === 1 ? this.siteObj.nodes.length : this.pointTypes === 6 ? this.siteObj.nodes.length : this.pointTypes === 7 ? this.siteObj.magPoints.length : this.pointTypes === 8 ? this.siteObj.actionPoints.length : 0
        const innerDiv = document.querySelector('#add-content')
        innerDiv.style.display = 'block'
        // innerDiv.style.left = this.x + this.canvas.width / 2 + 50 + 'px'
        // innerDiv.style.top = this.canvas.height / 2 - this.y - 50 + 'px'
        // 添加站点
        if (!data.point) {
          this.sence.drawRect(this.x - 10, this.y - 10, 20, 20)  
        } else {
          this.sence.drawPoint(this.x,this.y, 3, color[data.type])
        }
        // console.log(this.siteObj)
        this.canvas.style.cursor = 'auto'
        this.addP = false
        this.isAdd = false // 在点击确定时变成true
        this.disabledSave = true // 在生成点位时可以进行点位保存
      }
      
    },

    // 选择点位
    selectPoint(event) {
      if (this.selectP) {
        this.getCoor(event)
        this.selectP = false
        this.dialogFormVisible = true
        this.canvas.style.cursor = 'auto'
        this.operate.reset()
        // this.canvas.addEventListener('mousedown', this.operate.onMousedown1)
        // console.log([this.x, this.y])
      } else {return}
    },

    dialogCancel() {
      this.dialogFormVisible = false
    },

    // 确认批量增加
    dialogDefine(data) {
      let x, y
      let scale = this.operate.animation.scale // 鼠标滚动的缩放比例
      let scaleX = (this.canvas.width * scale - this.canvas.width) / 2 // 缩放后x轴原点
      let scaleY = (this.canvas.height * scale - this.canvas.height) / 2 // 缩放后y轴原点
      this.x = (this.x - scaleX) / scale
      this.y = (this.y + scaleY) / scale
      this.dialogFormVisible = false
      for(let i = 0; i < Number(data.num); i++) {
        switch(data.rankValue) {
          case '1':
            x = this.x - Number(data.spacing) * i
            y = this.y
            break
          case '2':
            x = this.x + Number(data.spacing) * i
            y = this.y
            break
          case '3':
            x = this.x
            y = this.y + Number(data.spacing) * i
            break
          case '4':
            x = this.x
            y = this.y - Number(data.spacing) * i
            break
        }
        if (data.siteType === '1') {
          this.siteObj.nodes.push({nodeId: this.siteObj.nodes.length, nodeName: `节点${this.siteObj.nodes.length}`, x, y, isStation: 0, stationType: this.addInfor.value, endMode: this.addInfor.otherValue, x1: 0, x2: 0, y1: 0, y2: 0, codeId: this.siteObj.nodes.length, miscellaneous: ''})
        }else if (data.siteType === '2') {
          this.siteObj.nodes.push({nodeId: this.siteObj.nodes.length, nodeName: `站点${this.siteObj.nodes.length}`, x, y, isStation: 1, stationType: 1, endMode: 1, x1: 0, x2: 0, y1: 0, y2: 0, codeId: this.siteObj.nodes.length, miscellaneous: ''})
        } else if (data.siteType === '3') {
          this.siteObj.magPoints.push({magId: this.siteObj.magPoints.length, magPointName: `磁钉点${this.siteObj.magPoints.length}`, x, y, magType: 1, magInterval: 300})
        } else if (data.siteType === '4') {
          this.siteObj.actionPoints.push({actionId: this.siteObj.actionPoints.length, actionName: `功能点${this.siteObj.actionPoints.length}`, actionTypes: '1', actionContents: '', x, y})
        }
        this.init()
        // this.$refs['dialogRef'].dataReset()
      }
    },

    handleClick() {
      this.canvas.addEventListener('click', this.onClick)
      this.canvas.onclick = e => this.onClick(e)
    },

    onMousedown(event) {
      // 画线时起点坐标为站点的中心坐标,记录起始点坐标以及站点id
      if (this.isLine) {
        let arr = [...this.siteObj.nodes]
        let getBoundingClientRect = this.canvas.getBoundingClientRect()
        const width = this.canvas.width 
        const height = this.canvas.height
        this.oldX = event.clientX - getBoundingClientRect.left - width / 2 // 当前位置相对于原点的x坐标
        this.oldY = height / 2 - (event.clientY - getBoundingClientRect.top) //当前位置相对于原点的y轴坐标
        let scale = this.operate?.animation?.scale ?? 1 // 鼠标滚动的缩放比例
        let scaleX = (this.canvas.width * scale - this.canvas.width) / 2 // 缩放后x轴原点
        let scaleY = (this.canvas.height * scale - this.canvas.height) / 2 // 缩放后y轴原点
        arr.forEach(item => {
          if (this.oldX >= item.x * scale - 10 + scaleX && this.oldX <= item.x * scale + 10 + scaleX && this.oldY >= item.y * scale - 10 - scaleY && this.oldY <= item.y * scale + 10 - scaleY){
            this.oldX = item.x
            this.oldY = item.y
            this.startNode = item.nodeId ?? 0
            this.startNodeName = item.nodeName
            // this.startNode = (item.nodeId || item.actionId || item.magId) ?? 0
          }
        })  
      }
      if (!this.isLine) {
        let arr = [...this.siteObj.nodes, ...this.siteObj.magPoints, ...this.siteObj.actionPoints]
        this.getCoor(event)
        arr.forEach(item => {
          if (this.x >= item.x - 10 && this.x <= item.x + 10 && this.y >= item.y - 10 && this.y <= item.y + 10){
            this.siteInfor = item
            this.flag = true
            this.oldX = item.x
            this.oldY = item.y
          }
        })  
      } 
      this.canvas.addEventListener('mousemove', this.onMousemove)
      this.canvas.addEventListener('mouseup', this.onMouseup)
    },

    onMousemove(event) {
      if (this.flag && this.isEdit) {
        this.getCoor(event)
        this.siteInfor.x = this.x
        this.siteInfor.y = this.y

        // let innerDiv = document.querySelector('#coor')
        // innerDiv.style.display = 'block'
        // innerDiv.innerHTML = `(${this.x}, ${this.y})`
        // innerDiv.style.left = this.x + this.canvas.width / 2 + 'px'
        // innerDiv.style.top = this.canvas.height / 2 - this.y - 50 + 'px'
      }
    },

    onMouseup(event) {
      if (this.isLine) { // 画线时鼠标抬起记录当前的坐标以及结束端点的站点id
        this.getCoor(event)
        // let arr = [...this.siteObj.nodes, ...this.siteObj.magPoints, ...this.siteObj.actionPoints]
        let arr = [...this.siteObj.nodes]
        let scale = this.operate?.animation?.scale ?? 1 // 鼠标滚动的缩放比例
        let scaleX = (this.canvas.width * scale - this.canvas.width) / 2 // 缩放后x轴原点
        let scaleY = (this.canvas.height * scale - this.canvas.height) / 2 // 缩放后y轴原

        arr.forEach(item => {
          // if (this.x >= item.x - 10 && this.x <= item.x + 10 && this.y >= item.y - 10 && this.y <= item.y + 10){
          if (this.x >= item.x * scale - 10 + scaleX && this.x <= item.x * scale + 10 + scaleX && this.y >= item.y * scale - 10 - scaleY && this.y <= item.y * scale + 10 - scaleY){
            this.x = item.x
            this.y = item.y
            this.endNode = item.nodeId
            this.endNodeName = item.nodeName
            // this.endNode = (item.nodeId || item.actionId || item.magId) ?? 0
          }
        })
        if ((this.startNode || this.startNode === 0) && (this.endNode || this.endNode === 0)) { // 画线时选择的两个端点必须是点位
          // this.sence.drawLine(this.oldX, this.oldY, this.x, this.y) // 画直线
          let distance = Math.sqrt(Math.pow(this.x - this.oldX, 2) + Math.pow(this.y - this.oldY, 2))
          // console.log(this.lineType)
          // 直线
          if (this.lineType === 1) {
            this.sence.drawLine(this.oldX, this.oldY, this.x, this.y) // 画直线
            this.siteObj.segmentInfos.push({segmentId: this.siteObj.segmentInfos.length, segmentName: this.startNodeName + '-' + this.endNodeName, type: 1, directionality: 0, startNodeId: this.startNode, endNodeId: this.endNode, rotAngle: 0, isClockwiseDirection: 0, control1X: null, control1Y: null, control2X: null, control2Y: null, length: distance.toFixed(0), isLink: 1, maxSpeed: 300, miscellaneous: ''})
          } else if (this.lineType === 2) { // 弧线绘制
            this.x = Number(this.x)
            this.oldX = Number(this.oldX)
            this.y = Number(this.y)
            this.oldY = Number(this.oldY)
            this.getArcLine(this.oldX, this.oldY, this.x, this.y, 90)

            this.siteObj.segmentInfos.push({segmentId: this.siteObj.segmentInfos.length, segmentName: this.startNodeName + '-' + this.endNodeName, type: 2, directionality: 0, startNodeId: this.startNode, endNodeId: this.endNode, rotAngle: 90, isClockwiseDirection: 0, control1X: null, control1Y: null, control2X: null, control2Y: null, length: this.arcLength.toFixed(0), isLink: 1, maxSpeed: 300, miscellaneous: ''})

 
          } 
          else if (this.lineType === 3) { // 贝塞尔曲线绘制
            let taggleX = this.x
            let taggleY = this.y
            let {control1, control2} = this.getTrisection(this.oldX, this.oldY, taggleX, taggleY)
            // console.log(control1, control2)
            // this.sence.drawLine(this.oldX, this.oldY, this.x, this.y) // 画直线
            this.sence.drawArc(control1.x, control1.y, 3, 0, 2 * Math.PI)
            this.sence.drawArc(control2.x, control2.y, 3, 0, 2 * Math.PI)
            this.sence.drawbezierCurve(this.oldX, this.oldY, control1.x, control1.y, control2.x, control2.y, this.x, this.y)

            this.siteObj.segmentInfos.push({segmentId: this.siteObj.segmentInfos.length, segmentName: this.startNodeName + '-' + this.endNodeName, type: 3, directionality: 0, startNodeId: this.startNode, endNodeId: this.endNode, rotAngle: 0, isClockwiseDirection: 0, control1X: control1.x, control1Y: control1.y, control2X: control2.x, control2Y: control2.y, length: distance.toFixed(0), isLink: 1, maxSpeed: 300, miscellaneous: ''})
            // this.bezierArr.push({startPoint: {x1: this.oldX, y1: this.oldY}, endPoint: {x2: this.x, y2: this.y}, control1: {cx1: control1.x, cy1: control1.y}, control2: {cx2: control2.x, cy2: control2.y}})


            // this.operate.destory()
            // this.isLine = false
            
            // eslint-disable-next-line complexity
            // this.canvas.onmousedown = e => {
            //   this.getCoor(e)
            //   if (this.x >= control1.x - 5 && this.x <= control1.x + 5 && this.y >= control1.y - 5 && this.y <= control1.y + 5) {
            //     z
            //   }
            //   if (this.x >= control2.x - 5 && this.x <= control2.x + 5 && this.y >= control2.y - 5 && this.y <= control2.y + 5) {
            //     this.canvas.onmousemove = e => {
            //       this.getCoor(e)
            //       control2.x = this.x
            //       control2.y = this.y
            //       this.canvas.onmouseup = e => {
            //         this.sence.drawbezierCurve(this.oldX, this.oldY, control1.x, control1.y, control2.x, control2.y, taggleX, taggleY)
            //         this.sence.drawArc(control1.x, control1.y, 5, 0, 2 * Math.PI)
            //         this.sence.drawArc(control2.x, control2.y, 5, 0, 2 * Math.PI)
            //         console.log(control1, control2)
            //       }
            //     }
            //   }
            // }
          }
          
        } else {
          this.$message({
            message: '请连接两个节点',
            type: 'warning'
          })
        }
        this.startNode = this.endNode = null
      }
      else {
        // if (this.isEdit) { // 处于编辑状态时线段跟随点位变化而变化
        //     this.siteObj.segmentInfos.forEach(item => {
        //     if (item.control1X === this.oldX) {item.control1X = this.x}
        //     if (item.control1Y === this.oldY) {item.control1Y = this.y}
        //     if (item.control2X === this.oldX) {item.control2X = this.x}
        //     if (item.control2Y === this.oldY) {item.control2Y = this.y}
        //   })
        // }
        this.init()
        this.flag = false
        let innerDiv = document.querySelector('#coor')
        innerDiv.style.display = 'none'
        this.canvas.removeEventListener('mousemove', this.onMousemove)
      }
    },

    // 求一条直线的两个三等分点
    getTrisection(resourceX, resourceY, taggleX, taggleY) {
      let control1x = (2 * resourceX + taggleX) / 3
      let control1y = (2 * resourceY + taggleY) / 3
      let control2x = (resourceX + 2 * taggleX) / 3
      let control2y = (resourceY + 2 * taggleY) / 3
      return {control1: {x: control1x, y: control1y}, control2: {x: control2x, y: control2y}}

    },

    // 根据弧线上的两点绘制弧形
    getArcLine(oldX, oldY, x, y, CentralAngle, clockwise = true) {
      let distance = Math.sqrt(Math.pow(x - oldX, 2) + Math.pow(y - oldY, 2))
      let angle = CentralAngle / 2
      let r = distance / 2 / Math.sin(angle * Math.PI / 180)
      // console.log(r)
      // 弧长
      this.arcLength = angle * Math.PI * r / 180
      // 两点间的x轴夹角弧度
      let xAngle = Math.atan2(y - oldY, x - oldX)
      // 转为角度
      xAngle = 360 * xAngle / (2 * Math.PI)

      let val = {}
      let val1 = {};
      // 求第二个顶点坐标
      let val2 = {};
      val1['x'] = oldX + Math.round(r * Math.cos((xAngle + 90 - angle) * 2 * Math.PI / 360))
      val1['y'] = oldY + Math.round(r * Math.sin((xAngle + 90 - angle) * 2 * Math.PI / 360))
      val2['x'] = oldX + Math.round(r * Math.cos((xAngle - (90 - angle)) * 2 * Math.PI / 360))
      val2['y'] = oldY + Math.round(r * Math.sin((xAngle - (90 - angle)) * 2 * Math.PI / 360))
      // console.log(val2)
      if (clockwise) {
        val = Object.assign({}, val2)
        // let endAngle = 2 * Math.PI - Math.atan2(y - val2.y, x - val2.x)
        // let startAngle = 2 * Math.PI - (Math.atan2(y - val2.y, x - val2.x) + CentralAngle * Math.PI / 180)
        let startAngle = Math.atan2(y - val2.y, x - val2.x)
        let endAngle = CentralAngle * Math.PI / 180 + startAngle
        // this.sence.drawArc(val2.x, val2.y, r, 0, 2 * Math.PI)
        // this.sence.drawPoint(val2.x, val2.y)
        this.sence.drawArc(val2.x, val2.y, r, startAngle, endAngle)
      } else {
        val = Object.assign({}, val1)
        let startAngle = Math.atan2(y - val1.y, x - val1.x)
        let endAngle = startAngle - CentralAngle * Math.PI / 180
        this.sence.drawArc(val1.x, val1.y, r, startAngle, endAngle, true)
      }
      // 把关于弧线的半径，圆心坐标以及起始点坐标记录到arcArr中，为了编辑弧线时找到对应的弧线
      this.arcArr.push({r, val, line1: {startPoint: {x: oldX, y: oldY}, endPoint: {x, y}}})
    },

    // 判断是否选择了直线
    // eslint-disable-next-line complexity
    selectLine() {
      // this.getCoor(event)
      let scale = this.operate.animation.scale // 鼠标滚动的缩放比例
      let scaleX = (this.canvas.width * scale - this.canvas.width) / 2 // 缩放后x轴原点
      let scaleY = (this.canvas.height * scale - this.canvas.height) / 2 // 缩放后y轴原点
      let px = (this.x - scaleX) / scale
      let py = (this.y + scaleY) / scale
      // let px = this.x
      // let py = this.y
      const offset = 8 // 可接受（偏移）范围
      let segmentInfos = this.siteObj.segmentInfos
      let segmentCoorArr = this.getSegmentCoor()
      let segmentInfoArr = segmentInfos.map((item, index) => {
        return Object.assign({}, item, segmentCoorArr[index])
      })
      // console.log(segmentInfoArr)
      for (let i = 0; i < segmentInfoArr.length; i++)
    {
      let p1x = segmentInfoArr[i].startX
      let p2x = segmentInfoArr[i].endX
      let p1y = segmentInfoArr[i].startY
      let p2y = segmentInfoArr[i].endY

      let minX = Math.min(p1x, p2x); // 较小的X轴坐标值
      let maxX = Math.max(p1x, p2x); // 较大的X轴坐标值
      let minY = Math.min(p1y, p2y); // 较小的Y轴坐标值
      let maxY = Math.max(p1y, p2y); // 较大的Y轴坐标值

      if (p1y === p2y)
      {
        // 水平线
        if (px >= minX && px <= maxX && (py >= minY - offset && py <= maxY + offset))
        {
          this.showMegmentInfo = true
          this.disabledEdit = true // 点击站点后可以进行编辑
          this.megmentInfo = Object.assign({}, segmentConfig.line, segmentInfoArr[i])
          this.lineType = 1
          // console.log(this.megmentInfo)
          // segmentInfoArr[i].flag = 1
          // this.init()
          // delete segmentInfoArr[i].flag
          // segmentInfoArr[i].crossPoint = { x: px, y: p1y }; // 直线上交叉点  
        }

      }
      else if (p1x === p2x)
      {
        // 垂直线
        if (py >= minY && py <= maxY && (px >= minX - offset && px <= maxX + offset))
        {
          this.showMegmentInfo = true
          this.disabledEdit = true // 点击站点后可以进行编辑
          this.megmentInfo = Object.assign({}, segmentConfig.line, segmentInfoArr[i])
          // console.log(this.megmentInfo)
          this.lineType = 1
          // segmentInfoArr[i].flag = 1
          // this.init()
          // delete segmentInfoArr[i].flag
          // segmentInfoArr[i].crossPoint = { x: p1x, y: py }; // 直线上交叉点  
        }
      }
      else
      {
        // 斜线 (先判断点是否进入可接受大范围(矩形)，然后再根据直线上的交叉点进行小范围比较)
        if (px >= minX && px <= maxX && (py >= minY - offset && py <= maxY + offset))
        {
          //求Y轴坐标
          //方法1：根据tanθ= y/x = y1/x1, 即y = (y1/x1)*x  (该方法有局限性，垂直线(p2.x - p1.x)=0，不能用)
          //var y = ((p2.y - p1.y) / (p2.x - p1.x)) * (px - p1.x);

          //方法2：先求弧度hudu，根据cosθ=x/r, r=x/cosθ,求得r，再根据sinθ=y/r, y=sinθ*r, 求得y 
          let hudu = Math.atan2(p2y - p1y, p2x - p1x); // 直线的弧度(倾斜度)
          // 用三角函数计出直线上的交叉点
          let r = (px - p1x) / Math.cos(hudu); // 直角三角形的斜边（或理解成圆的半径）
          let y = Math.sin(hudu) * r; // Y轴坐标

          let p = { x: px, y: p1y + y }; // 直线上的交叉点
          if (Math.abs(px - p.x) <= offset && Math.abs(py - p.y) <= offset)
          {
            this.showMegmentInfo = true
            this.disabledEdit = true // 点击站点后可以进行编辑
            this.megmentInfo = Object.assign({}, segmentConfig.line, segmentInfoArr[i], {directionality: segmentInfoArr[i].directionality === 1 ? true : false})
            this.lineType = this.megmentInfo.type
            // console.log(this.megmentInfo)
            // flag = 1; // 1 - 点中
            // segmentInfoArr[i].flag = 1
            // console.log(segmentInfoArr[i])
            // this.init()
            // this.disabledSave = true
            // delete segmentInfoArr[i].flag
            // this.megmentInfo = segmentInfoArr[i]
          }
          
        }
      }

      // if (flag === 1)
      // {
      //   segmentInfos[i].flag = (segmentInfos[i].flag + 1) % 2; // 0、1切换
      //   break;
      // }
    }
    },

    // 判断是否选择了弧线
    selectArcLine() {
      let scale = this.operate.animation.scale // 鼠标滚动的缩放比例
      let scaleX = (this.canvas.width * scale - this.canvas.width) / 2 // 缩放后x轴原点
      let scaleY = (this.canvas.height * scale - this.canvas.height) / 2 // 缩放后y轴原点
      let px = (this.x - scaleX) / scale
      let py = (this.y + scaleY) / scale
      this.arcArr.forEach(item => {
        let line2 = {startPoint: {x: item.val.x, y: item.val.y}, endPoint: {x: px, y: py}}
        let isIntersect = this.isIntersect(item.line1, line2)
        // 点击的点与圆心点之间距离
        let distance = Math.sqrt(Math.pow(px - item.val.x, 2) + Math.pow(py - item.val.y, 2))
        // 如果点击了弧线： 1：点与圆心点距离等于半径；2：点与圆心的直线和两个端点的直线相交
        if (isIntersect && distance - item.r >= -10 && distance - item.r <= 10) {
          let segmentArr = this.getSegmentCoor()
          // console.log(segmentArr)
          let segItemInfo = segmentArr.filter(seg => seg.startX === item.line1.startPoint.x && seg.startY === item.line1.startPoint.y && seg.endX === item.line1.endPoint.x && seg.endY === item.line1.endPoint.y)
          this.showMegmentInfo = true
          this.disabledEdit = true // 点击站点后可以进行编辑
          this.lineType = 2
          this.megmentInfo = Object.assign({}, segmentConfig.arcLine, segItemInfo[0], {directionality: segItemInfo[0].directionality === 1 ? true : false, isClockwiseDirection: segItemInfo[0].isClockwiseDirection === 0 ? false : true})
        }
      })
    },

    // 判断两条线段是否相交
    isIntersect(line1, line2)
    {
      // 转换成一般式: Ax+By = C
      var a1 = line1.endPoint.y - line1.startPoint.y;
      var b1 = line1.startPoint.x - line1.endPoint.x;
      var c1 = a1 * line1.startPoint.x + b1 * line1.startPoint.y;
      
      //转换成一般式: Ax+By = C
      var a2 = line2.endPoint.y - line2.startPoint.y;
      var b2 = line2.startPoint.x - line2.endPoint.x;
      var c2 = a2 * line2.startPoint.x + b2 * line2.startPoint.y;
      
      // 计算交点		
      var d = a1 * b2 - a2 * b1;
      
      // 当d==0时，两线平行
      if (d == 0) {
        return false;
      }
        var x = (b2 * c1 - b1 * c2) / d;
        var y = (a1 * c2 - a2 * c1) / d;
              
        // 检测交点是否在两条线段上
        if ((this.isInBetween(line1.startPoint.x, x, line1.endPoint.x) || this.isInBetween(line1.startPoint.y, y, line1.endPoint.y)) &&
          (this.isInBetween(line2.startPoint.x, x, line2.endPoint.x) || this.isInBetween(line2.startPoint.y, y, line2.endPoint.y))) 
        {
          return true;	
        }
      
      
      return false;
    },


    isInBetween(a, b, c) {
      // 如果b几乎等于a或c，返回false.为了避免浮点运行时两值几乎相等，但存在相差0.00000...0001的这种情况出现使用下面方式进行避免
      if (Math.abs(a - b) < 10 || Math.abs(b - c) < 10) {
        return false;
      }
      
      return a < b && b < c || c < b && b < a;
    },

    // 贝塞尔曲线选择
    selectBezier() {
      let scale = this.operate.animation.scale // 鼠标滚动的缩放比例
      let scaleX = (this.canvas.width * scale - this.canvas.width) / 2 // 缩放后x轴原点
      let scaleY = (this.canvas.height * scale - this.canvas.height) / 2 // 缩放后y轴原点
      let px = (this.x - scaleX) / scale
      let py = (this.y + scaleY) / scale
      const offsetY = 5
      const offsetX = 5
      let X = px
      // eslint-disable-next-line complexity
      this.bezierArr.forEach(item => {
        let x1 = item.startPoint.x1
        let x2 = item.control1.cx1
        let x3 = item.control2.cx2
        let x4 = item.endPoint.x2
        const tsx = getBezierT(x1, x2, x3, x4, X)
        for (let x = 0; x < 3; x++) {
          if (tsx[x] <= 1 && tsx[x] >= 0) {
            const ny = getThreeBezierPoint(tsx[x], item.startPoint, item.control1, item.control2, item.endPoint)
            if (Math.abs(ny[1] - py) < offsetY) {
              let segmentArr = this.getSegmentCoor()
              // console.log(segmentArr)
              let segItemInfo = segmentArr.filter(seg => seg.startX === item.startPoint.x1 && seg.startY === item.startPoint.y1 && seg.endX === item.endPoint.x2 && seg.endY === item.endPoint.y2 && seg.type === 3)
              this.showMegmentInfo = true
              this.disabledEdit = true // 点击站点后可以进行编辑
              this.lineType = 3
              this.megmentInfo = Object.assign({}, segmentConfig.quaLine, segItemInfo[0], {directionality: segItemInfo[0].directionality === 1 ? true : false})
              // this.sence.drawArc(segItemInfo[0].control1X, segItemInfo[0].control1Y, 3, 0, 2 * Math.PI)
              // this.sence.drawArc(segItemInfo[0].control2X, segItemInfo[0].control2Y, 3, 0, 2 * Math.PI)
              
            }
          }
        }
         // 如果上述没有结果，则用 y 求出对应的 t，再用 t 求出对应的 x，与 offsetX 进行匹配
        const tsy = getBezierT(item.startPoint.y1, item.control1.cy1, item.control2.cy2, item.endPoint.y2, offsetY)
        for (let y = 0; y < 3; y++) {
          if (tsy[y] <= 1 && tsy[y] >= 0) {
            const nx = getThreeBezierPoint(tsy[y], item.startPoint, item.control1, item.control2, item.endPoint)
            if (Math.abs(nx[0] - this.x) < offsetX) {
              return 22222
            }
          }
  }

        
      })
    },

    onClick(event) {
      // this.canvas.removeEventListener('mousedown', this.onQuadratic)
      this.getCoor(event)
      // console.log(this.x, this.y)
      let arr = [...this.siteObj.nodes, ...this.siteObj.magPoints, ...this.siteObj.actionPoints]
      if (!this.addP) {
        // console.log(this.ctx.isPointInPath(this.x, this.y))
        this.disabledEdit = false
        // this.disabledSave = false
        let scale = this.operate?.animation?.scale ?? 1 // 鼠标滚动的缩放比例
        let scaleX = (this.canvas.width * scale - this.canvas.width) / 2 // 缩放后x轴原点
        let scaleY = (this.canvas.height * scale - this.canvas.height) / 2 // 缩放后y轴原
        this.disabledDelete = false
        // eslint-disable-next-line complexity
        arr.forEach(item => {
          // if (this.x >= item.x - 10 && this.x <= item.x + 10 && this.y >= item.y - 10 && this.y <= item.y + 10){
            if (this.x >= item.x * scale - 10 + scaleX && this.x <= item.x * scale + 10 + scaleX && this.y >= item.y * scale - 10 - scaleY && this.y <= item.y * scale + 10 - scaleY){
            this.siteInfor = item
            this.showMegmentInfo = false
            // 节点
            if (item.nodeId && item.isStation === 0) {
              this.addInfor = Object.assign({}, {name: item.nodeName, x: item.x, y: item.y, id: item.nodeId})
              this.pointTypes = 6
            }
            // 站点
            if (item.nodeId && item.isStation === 1) {
              this.addInfor = Object.assign({}, formConfig.node1, {name: item.nodeName, x: item.x, y: item.y, value: item.stationType, otherValue: item.endMode, id: item.nodeId})
              this.pointTypes = 1
            }
            // 磁钉点
            if (item.magId) {
              this.addInfor = Object.assign({}, formConfig.mag_point, {name: item.magPointName, x: item.x, y: item.y, value: item.magType, id: item.magId})
              this.pointTypes = 7
            }
            // 功能点
            if (item.actionId) {
              this.addInfor = Object.assign({}, formConfig.action_point, {name: item.actionName, x: item.x, y: item.y, value: item.actionTypes, id: item.actionId})
              this.pointTypes = 8
            }
            const innerDiv = document.querySelector('#add-content')
            innerDiv.style.display = 'block'
            this.disabledEdit = true // 点击站点后可以进行编辑
            // this.disabledSave = true
            // this.disabledDelete = true
          }
        })
        this.selectLine()
        this.selectArcLine()
        this.selectBezier()
      }
      
    }
  }
}
</script>

<style lang="less" scoped>
  .content {
    width: 100%;
    height: 100%;
    // color: #dadada;
    .wrapper {
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      justify-content: space-between;
      // align-items: center;
      .toorbar {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 99;
      }
      #canvas-wrapper {
        // width: 100%;
        // height: 100%;
        width: 1000px;
        height: 650px;
        overflow: hidden;
        background-color: rgb(240, 242, 245);
        text-align: left;
        #canvas {
          background-color: rgb(240, 242, 245);
          border: 1px solid #ccc8c8;
        }
      }

      #coor {
        position: absolute;
        font-size: 16px;
        font-weight: bolder;
        // border: 1px solid #000;
        // width: 100px;
        // height: 50px;
        // line-height: 30px;
      }
      .right {
        width: 20%;
        margin-top: 20px;

      }

      #add-content {
        // display: none;
        position: relative;
        height: 440px;
        margin-top: 20px;
        border: 1px solid #000;
        border-radius: 10px; 
        padding: 20px;
        box-sizing: border-box;
        ul {
          li {
            margin-top: 10px;
          }
        }
        .operate {
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
          margin: o auto;
        }
      }

      .icon-arrow {
          position: absolute;
          top: 250px;
          right: 20%;
          // padding: 10px;
          border: 1px solid #222;
          cursor: pointer;
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
