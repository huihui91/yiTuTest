
<template>
  <section class="myAddress">
    <section>
      <section class="cont">
        <section>
          <span>所在地区：{{Province?Province:''}} {{City && City!== '请选择'?City:''}} {{District && District !== '请选择'?District:''}} {{Town && Town !== '请选择'?Town:''}} {{Province||City||District?'':'请选择行政区域'}}</span>
        </section>
        <div style="clear: both"></div>
      </section>
    </section>
    <section class="areaSelect">
      <section class="searchBox">
        <input class="search" v-model="searchArea" type="text" placeholder="搜索行政区划" />
        <button @click="search">搜索</button>
      </section>
      <ul class="selectedInfo">
        <li :class="{bottomLine:tabIndex == 0}" @click="changeTabIndex(0)">省份/直辖市</li>
        <li :class="{bottomLine:tabIndex == 1}" @click="changeTabIndex(1)">城市</li>
        <li :class="{bottomLine:tabIndex == 2}" @click="changeTabIndex(2)">区/县</li>
        <li :class="{bottomLine:tabIndex == 3}" @click="changeTabIndex(3)">街道/乡镇</li>
      </ul>
      <ul class="areaBox" v-show="showProvince">
        <li v-for="item in provinceList" @click="changeProvince(item)" :key="item.code"> {{item.name}}</li>
      </ul>
      <ul class="areaBox"  v-show="showCity">
        <li v-for="item in cityList"  @click="changeCity(item)" :key="item.code"> {{item.name}}</li>
      </ul>
      <ul class="areaBox"  v-show="showDistrict">
        <li v-for="item in districtList"  @click="changeDistrict(item)" :key="item.code"> {{item.name}}</li>
      </ul>
      <ul class="areaBox"  v-show="showTown">
        <li v-for="item in townList"  @click="changeTown(item)" :key="item.code"> {{item.name}}</li>
      </ul>
    </section>
    <Toast msg="请输入准确查询信息" v-show="toastShow"></Toast>
  </section>
</template>

<script>
  import areaData from "./data.js";
  import Toast from "@/components/Toast.vue"
  export default {
    data() {
      return {
        showChose: false, // 是否显示省市区弹框
        showProvince: true, // 显示省份列表
        showCity: false, // 显示城市列表
        showDistrict: false, // 显示区列表
        showTown:false,//显示街道列表
        District: '', // 区名字
        Province: '', // 省名字
        City: '', // 城市名字
        Town:'', // 街道、乡镇名字
        areaProvinceCode: "", // 当前选择的省份code
        areaCityCode: "",// 当前选择的城市code
        areaDistrictCode: "",// 当前选择的区code
        areaTownCode:"",//当前选择的街道code
        tabIndex: 0, // 当前选择的tab下标
        provinceList:[], //省、直辖市列表
        cityList:[], //地级市列表
        districtList:[], //区县列表
        townList:[], //街道、乡镇列表
        searchArea:'', //搜索内容
        searcInfo:null, //搜索结果
        toastShow:false, //toast显示
        test:[]
      };
    },
    created() {
      this.getProvinceList()
    },
    methods: {
      //获取省份列表
      getProvinceList(){
        this.provinceList=areaData;
        //清空上一次选择城市和县区列表；
        this.cityList=[];
        this.districtList=[]
      },

      //选择省份
      changeProvince(item){
        this.areaProvinceCode=item.code;
        this.Province=item.name;
        this.cityList=item.children;
        this.changeTabIndex(1)
      },
      //选择城市
      changeCity(item){
        this.areaCityCode=item.code;
        this.City=item.name;
        this.District='';
        this.districtList=item.children;
        this.changeTabIndex(2)
      },
      //选择县区
      changeDistrict(item){
        this.areaDistrictCode=item.code;
        this.District=item.name;
        this.Town=" ";
        this.townList=item.children;
        this.changeTabIndex(3)
      },
      //选择街道
      changeTown(item){
        this.areaTownCode=item.code;
        this.Town=item.name;
      },
      //更改tab和更改地区选择列表显示
      changeTabIndex(index){
        this.tabIndex=index;
        if(this.tabIndex === 0){
           this.Province='';
            this.City='';
            this.District='';
            this.Town='';
            this.showCity=false;
            this.showProvince=true;
            this.showDistrict=false;
            this.showTown=false;
        }else if(this.tabIndex ===1){
            this.District='';
            this.Town='';
            this.showCity=true;
            this.showProvince=false;
            this.showDistrict=false;
            this.showTown=false;
        }else if(this.tabIndex ===2){
            this.Town='';
            this.showCity=false;
            this.showProvince=false;
            this.showDistrict=true;
            this.showTown=false;
        }else{
            this.showCity=false;
            this.showProvince=false;
            this.showDistrict=false;
            this.showTown=true;
        }
      },
      //搜索
      search(){
        this.searcInfo='';
        let name=this.searchArea.replace(/[^\u4e00-\u9fa5]/g,'');
         name?this.recursiveQuery(name,areaData):this.setToast();
         if(this.searcInfo){
           //清空上次记录信息
           this.changeTabIndex(0)
           let index=this.searcInfo.code.length/2;
           if(index===1){
             this.changeProvince(this.searcInfo)
           }else if(index === 2) {
             this.changeCity(this.searcInfo)
           }else if(index === 3) {
             this.changeDistrict(this.searcInfo)
           }
         }else{
           this.setToast()
         }
      },
      //递归查找信息
      recursiveQuery(name,arr){
        for(let i=0; i<arr.length;i++){
          if(arr[i].name.indexOf(name)!=-1){
          this.searcInfo=arr[i];
           break;
          }else if(arr[i].children){
            this.recursiveQuery(name,arr[i].children);
          }else{
             break;
          }
        }
      },
      //toast显示
      setToast(){
           this.toastShow=true;
           let timeName;
           clearTimeout(timeName)
           timeName=setTimeout(() => {
              this.toastShow=false;
           }, 3000);
      }
    },
    components:{
      Toast
    }
  };
</script>

<style scoped lang='scss' >
  .myAddress {
    width: 100%;
    background-color: white;
    border-top: 4px solid rgba(245, 245, 245, 1);
    color: #333;
  }
  
  .myAddress .cont {
    border-bottom: 1px solid rgba(245, 245, 245, 0.8);
  }
  
  .myAddress .cont span {
    display: inline-block;
    font-size: 0.28rem;
    color: #333;
    line-height: 0.88rem;
    margin-left: 0.32rem;
  }
  
  .myAddress .cont section {
    float: left;
  }
  
  .myAddress .cont img {
    float: right;
    width: 0.14rem;
    height: 0.24rem;
    margin: 0.32rem 0.32rem 0.32rem 0;
  }
  .areaSelect{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    .searchBox{
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      .search{
       width:30%;
       margin-right: 20px;
      }
    }

     .selectedInfo{
       display: flex;
       justify-content: flex-start;
       align-items: center;
       width: 60%;
       li{
        list-style: none;
        width: 20%;
       }
       .bottomLine{
         border-bottom: 2px solid red;
       }
     }
     .areaBox{
       display: flex;
       flex-direction: row;
       justify-content: flex-start;
       align-items: flex-start;
       flex-wrap: wrap;
       li{
         list-style: none;
         min-width: 20%;
         margin: 20px 0;
       }
     }

  }
 
</style>

