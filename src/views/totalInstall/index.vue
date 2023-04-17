<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="totalInstall-content">
    <h1 class="title" v-if="!isShowList">美好的一天开始了~</h1>
    <ul class="list-wrapper">
      <li class="item-list" v-for="(item, index) in initData" :key="item.NodeID">
        <div class="show-content" v-show="isShowList" v-loading="loading" element-loading-text="初始化数据中" element-loading-spinner="el-icon-loading">
          <div class="matterName">物料名称：{{item.matterType}}</div>
          <div class="inforArea">
            <div class="image">
              <el-skeleton style="width: 100px">
                <template slot="template">
                  <el-skeleton-item variant="image" style="width: 100px; height: 100px;" />
                </template>
              </el-skeleton>
            </div>
            <div class="information">
              <div class="status">物料状态:{{item.status === 0 ? '空料' : item.status === 1 ? '空物料架' : '满料'}}</div>
              <div class="status">配送状态:{{item.status === 0 ? '物料配送中~' : item.status === 1 ? '物料架退回中~' : '配送完成'}}</div>
              <!-- <div v-else class="status">满料</div> -->
              
            </div>
          </div>
          <el-button :disabled='!item.status' size="medium" @click="changeStatus(item, index)">转换</el-button>
        </div>
        <div class="nodeName">{{item.toNode}}</div>
      </li>
    </ul>
    <div class="operate">
      <el-button v-if="!isShowList" @click="startWork">开工</el-button>
      <el-button v-if="isShowList" @click="stopWork">停工</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return{
      initData: [ // matterType: 物料种类；matterID: 物料ID；toNode:站点名称;NodeID:站点ID;status:状态;trayType: 托盘类型
        // {matterType: '万向轮', matterID: 1, toNode: 'S1', NodeID: 1, status: 0, trayType: 'A'},
        // {matterType: '舵轮', matterID: 2, toNode: 'S2', NodeID: 2, status: 2, trayType: 'B'},
        // {matterType: '配电盘', matterID: 3, toNode: 'S3', NodeID: 3, status: 2, trayType: 'C'},
        // {matterType: '读卡器', matterID: 4, toNode: 'S4', NodeID: 4, status: 0, trayType: 'D'},
      ],
      isShowList: false, // 是否展示站点当前状态
      loading: true
    }
  },
  methods: {
    startWork() {
      this.isShowList = true
      // this.loading = false
      const initData = localStorage.getItem('initData')
      if (initData) {
        this.initData = JSON.parse(initData)
        setTimeout(() => {
          this.loading = false
        }, 1000)
      }
      else {
        // 掉接口获取初始化数据 
      }

    },
    stopWork() {
      this.$confirm(`确定停工吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.setItem('initData', JSON.stringify(this.initData))
        this.$message({
          type: 'info',
          message: '祝您生活愉快~'
        }); 
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
      localStorage.setItem('initData', JSON.stringify(this.initData))
    },
    // 物料转换
    changeStatus(data, index) {
      this.$confirm(`请确保当前${data.toNode}站点物料托盘为空`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          setTimeout(()=> {
            this.$set(this.initData[index], 'status', 1)
            console.log(this.initData)
             setTimeout(() => {
              this.$set(this.initData[index], 'status', 0)
              console.log(this.initData)
              setTimeout(() => {
                this.$set(this.initData[index], 'status', 2)
                console.log(this.initData)
              }, 3000)
            }, 3000)
          }, 3000)
         
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '状态设置已取消'
          });          
        });
    }
  }
}
</script>

<style lang="less" scoped>
  .totalInstall-content {
    height: 100%;
    width: 100%;
    .title {
      // margin: 50% auto;
    }
    .list-wrapper {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      width: 100%;
      .item-list {
        position: relative;
        width: 45%;
        height: 200px;
        margin-top: 50px;
        border: 1px solid rgb(155, 142, 142);
        .show-content {
          width: 100%;
          height: 100%;
          .inforArea {
            display: flex;
            justify-content: space-around;
            align-items: center;
            height: 65%;
            .information {
              .status{
                text-align: left;
                margin-bottom: 10px;
              }
            }
          }
          .matterName {
            padding: 5px 0;
            border-bottom: 1px solid rgb(111, 103, 103);
          }
        }
        .nodeName {
          position: absolute;
          bottom: -30px;
          left: 0;
          right: 0;
          margin: 0 auto;
        }
      }
    }
    .operate {
      margin-top: 30px;
    }
  }
</style>
