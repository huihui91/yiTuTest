<template>
  <section>
    <section>
      <section class="canvasBox">
        <canvas id="canvas" ref="canvas" ></canvas>
        <canvas id="canvas_bak" ref="canvas_bak"  @mousedown="canvasDown" @mousemove="canvasMove" @mouseup="canvasUp" @mouseout="canvasOut" ></canvas>
      </section>
      <section class="tools">
        <ul>
          <li v-for="item in tools" :key="item.fun" @click="chanGegraphType(item)" :class="{active:item.ischoose}">{{item.name}}</li>
          <li @click="clearContext('all')">清除</li>
          <li @click="getImage">保存上传</li>
        </ul>
      </section>
    </section>
    <section class="imgList">
      <ul>
        <li v-for="(item,index) in imgUrl " :key="index">
          <img :src="item.src" alt="">
        </li>
      </ul>
    </section>
    <Toast msg="保存成功" v-show="toastShow"></Toast>
     <a href="javascript:void(0);" ref="download" download="picture.png" v-show="false"></a>   
  </section>
</template>

<script>
  import Toast from '@/components/Toast.vue'
  export default {
    name: 'draw',
    data() {
      return {
        toastShow: false, //toast显示
        imgUrl: [], //图片地址列表
        startX:0, //默认起始位置X
        startY:0, //默认起始位置Y
        graphType:'pencil',//画笔类型
        canvasSize: {  //canvas尺寸
          width: 600,
          height: 400
        },
        canvas: this.$refs.canvas, //canvas元素
        canvas_bak: this.$refs.canvas_bak, //canvas_bank元素
        canvasTop: 0, //canvasTop
        canvasLeft: 0, //canvasLeft
        context: null, //canvas环境对象
        context_bak: null, //context_bak环境对象
        color: { hex: '#000000'}, //图形颜色
        penSize: 1, //line宽度
        lineType: [0,0], //setLineDash参数/虚线
        canDraw: false, //判断是否需要操作
        tools: [{       //操作工具列表
          name: '铅笔',
          fun: 'pencil',
          ischoose: true,
        }, {
          name: '点',
          fun: 'point',
          ischoose: false
        }, 
         {
          name: '直线',
          fun: 'line',
          ischoose: false
        }, {
          name: '圆形',
          fun: 'circle',
          ischoose: false
        }, {
          name: '矩形',
          fun: 'square',
          ischoose: false
        }]
      }
    },
    components: {
      Toast
    },
    mounted() {
      //获取canvas上下文
      this.initCanvas()
    },
    methods: {
     //初始化上下文
     initCanvas() {
        this.canvas = document.getElementById("canvas")
        this.canvas.width = this.canvasSize.width
        this.canvas.height = this.canvasSize.height
        this.context = this.canvas.getContext('2d')
        this.canvas_bak = document.getElementById("canvas_bak")
        this.canvas_bak.width = this.canvasSize.width
        this.canvas_bak.height = this.canvasSize.height
        this.context_bak = this.canvas_bak.getContext('2d')
      },
      //鼠标点击
      canvasDown(e) {
          this.context.strokeStyle = this.color.hex
          this.context_bak.strokeStyle = this.color.hex
          this.context_bak.lineWidth = this.penSize;
          this.canvasLeft=this.$refs.canvas_bak.parentNode.offsetLeft;
          this.canvasTop=this.$refs.canvas_bak.parentNode.offsetTop;
          e = e || window.event
          this.startX = e.clientX - this.canvasLeft
          this.startY = e.clientY - this.canvasTop
          this.context_bak.moveTo(this.startX, this.startY)
          this.canDraw = true
          if (this.graphType == 'pencil') {
            this.context_bak.beginPath()
          } else if (this.graphType == 'circle') {
            this.context.beginPath()
            this.context.moveTo(this.startX, this.startY)
            this.context.lineTo(this.startX, this.startY)
            this.context.stroke()
          }
      },
      //鼠标移动
      canvasMove(e) {
         e = e || window.event
          let x = e.clientX - this.canvasLeft
          let y = e.clientY - this.canvasTop
          this.context_bak.setLineDash(this.lineType)
          //矩形 即4条直线
          if (this.graphType == 'square') {
            if (this.canDraw) {
              this.context_bak.beginPath()
              this.clearContext()
              this.context_bak.moveTo(this.startX, this.startY)
              this.context_bak.lineTo(x, this.startY)
              this.context_bak.lineTo(x, y)
              this.context_bak.lineTo(this.startX, y)
              this.context_bak.lineTo(this.startX, this.startY)
              this.context_bak.stroke()
            }
            //直线
          } else if (this.graphType == 'line') {
            if (this.canDraw) {
              this.context_bak.beginPath()
              this.clearContext()
              this.context_bak.moveTo(this.startX, this.startY)
              this.context_bak.lineTo(x, y)
              this.context_bak.stroke()
            }
            //画笔
          } else if (this.graphType == 'pencil') {
            if (this.canDraw) {
              this.context_bak.lineTo(e.clientX - this.canvasLeft, e.clientY - this.canvasTop)
              this.context_bak.stroke()
            }
            //圆 未画得时候 出现一个小圆
          } else if (this.graphType == 'circle') {
            this.clearContext()
            if (this.canDraw) {
              this.context_bak.beginPath()
              let radii = Math.sqrt((this.startX - x) * (this.startX - x) + (this.startY - y) * (this.startY - y))
              this.context_bak.arc(this.startX, this.startY, radii, 0, Math.PI * 2, false)
              this.context_bak.stroke()
            } else {
              this.context_bak.beginPath()
              this.context_bak.arc(x, y, 20, 0, Math.PI * 2, false)
              this.context_bak.stroke()
            }
            //点
          } else if (this.graphType == 'point') {
             if (this.canDraw) {
             this.context_bak.beginPath()
             this.context_bak.setLineDash([1, 2])
             this.clearContext()
             this.context_bak.moveTo(this.startX, this.startY)
             this.context_bak.lineTo(x, y)
             this.context_bak.stroke()
             }
          }
      },
      //鼠标松开
      canvasUp(e) {
          e = e || window.event
          this.canDraw = false
          let image = new Image()
            image.src = this.canvas_bak.toDataURL()
            image.onload = () => {
              this.context.drawImage(image, 0, 0, image.width, image.height, 0, 0, this.canvasSize.width, this.canvasSize.height)
              this.clearContext()
            }
            let x = e.clientX - this.canvasLeft
            let y = e.clientY - this.canvasTop
            this.context.beginPath()
            this.context.moveTo(x, y)
            this.context.lineTo(x, y)
            this.context.stroke()
      },
      //离开
      canvasOut(){
           this.clearContext()
      },
      chanGegraphType(item){
        this.tools.forEach(item=>item.ischoose=false)
        this.graphType=item.fun;
        item.ischoose=true;
      },
      // 生成图片
      getImage() {
        const canvas = document.querySelector('#canvas')
        const src = canvas.toDataURL('image/png')
        this.toastChangeShow()
        this.imgUrl.push({src});
        this.$refs.download.href = this.canvas.toDataURL()
        this.$refs.download.click()
      },
      //清除
       clearContext(type) {
        if (!type) {
          this.context_bak.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height)
        } else {
          this.context.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height)
          this.context_bak.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height)
        }
      },
      //toast显示
      toastChangeShow() {
        let timeName;
        this.toastShow = true;
        clearTimeout(timeName)
        timeName = setTimeout(() => {
          this.toastShow = false;
        }, 3000);
      }
    }

  }
</script>

<style scoped lang="scss">
  .canvasBox {
    height: 400px;
    width: 600px;
    position: relative;
    background-color: white;
    border-radius: 5px;
    margin: 0 auto;
    border: 1px solid black;
    canvas {
      position: absolute;
      z-index: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
    
    }
  }
  
  .tools ul {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    li {
      list-style: none;
      height: 50px;
      width: 120px;
      border: 1px solid black;
      margin: 0 20px;
      text-align: center;
      line-height: 50px;
      font-size: 12px;
    }
    .active{
      background: #c7a9d0;
      color:#fff;
    }
  }
  
  .imgList ul {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    border:1px solid black;
    padding:5px 10px;
    min-height: 70px;

    li {
      list-style: none;
      border: 1px solid black;
      margin: 0 10px;
    }
    img {
      width: 60px;
      height: 40px;
    }
  }
</style>

