<template>
  <div id="app">
    <div class="c-res-info">
      <Header :title="'作业系统'"></Header>
      <div class="g-container">
        <div class="c-analy-loadbox" v-if="!taskData.type">
          <div class="loadEffect">
            <div><span></span></div>
            <div><span></span></div>
            <div><span></span></div>
            <div><span></span></div>
          </div>
        </div>
        <div v-if="taskData.type">
          <div class="c-analy-heaher">
            <i class="c-analy-heaher__icon" :class="taskClassName"></i>
            <div class="c-analy-heaher__operation" v-if="taskData.watchCnt >= 1">
              <div class="c-analy-heaher__lookdetail">
                <p class="c-analy-heaher__lookdetail--num font-color--green">

                <span v-if="taskData.usedTime >= 3600">
                  {{parseInt(taskData.usedTime/3600)}}<span class="font-size24">:</span>{{parseInt((taskData.usedTime%3600)/60)}}<span
                  class="font-size24">:</span>{{((taskData.usedTime%3600)%60).toFixed(0)}}
                </span>
                  <span v-else>
                    {{parseInt(taskData.usedTime/60)}}<sup>'</sup>{{(taskData.usedTime%60).toFixed(0)}}<sup>''</sup>
                </span>
                </p>
                <p class="c-analy-heaher__lookdetail--tips">
                  观看时长
                </p>
              </div>
              <div class="c-analy-heaher__lookdetail">
                <p class="c-analy-heaher__lookdetail--num font-color--orange">{{taskData.watchCnt}}<span
                  class="font-size16">次</span>
                </p>
                <p class="c-analy-heaher__lookdetail--tips">
                  观看次数
                </p>
              </div>
            </div>
            <div class="c-analy-heaher__main">
              <h3 class="c-analy-tit" title="taskData.title">
                {{taskData.title}}
              </h3>
              <p class="c-analy-tit--secon" title="taskData.resName">
                {{taskData.resName}}
              </p>
              <p class="c-analy-tips">
          <span class="c-analy-tip">
              布置班级：{{taskData.className}}
              <span v-if="taskData.groupName"><span v-if="taskData.groupName.length > 0"> - {{taskData.groupName.join('、')}}</span></span>
          </span>
                <span class="c-analy-tip">
              截止时间：{{taskData.finalOn}}
          </span>
              </p>
            </div>
          </div>
          <div class="c-res-info__content f-clearfix" v-if="renderData.content">
            <div class="c-res-info__detail">
              <!--<div class="c-res-info__detail__intro f-clearfix">
                <div class="c-res-info__detail__text f-clearfix">
                  <h2 class="c-res-info__detail__text__title">{{renderData.content.name}}</h2>
                  <div class="c-res-info__detail__text__detail">
                    <div class="c-res-info__detail__text__time">更新时间: {{renderData.content.modifiedOn}}</div>
                    <div class="c-res-info__detail__text__name">贡献者: {{renderData.content.authorName}}</div>
                    <div class="c-res-info__detail__text__size">大小: {{renderData.content.size}}</div>
                  </div>
                </div>
              </div>-->
              <!-- 资源内容组件 -->
              <viewer :fileId="fileId" :position="position" v-if="fileId" @closeSet="closeSet"></viewer>
            </div>
            <div class="c-res-info__side">
              <div class="c-res-info__profile">
                <h3 class="m-res-info__subtitle">资源概况</h3>
                <div class="c-res-info__profile__line">
                  <span>学段：</span>{{stgName}}
                </div>
                <div class="c-res-info__profile__line">
                  <span>学科：</span>{{sbjName}}
                </div>
                <div class="c-res-info__profile__line" v-if="renderData.content.tbkNodes">
                  <span>教材章节：</span>
                  <span class="c-res-info__profile__line-detail" v-for="(item,index) in renderData.content.tbkNodes[0].path"><span v-if="index">/</span>{{item.name}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
import viewer from './components/viewer'
import {Header} from 'ygui'
import $ from 'jquery'

export default {
  name: 'App',
  data () {
    return {
      renderData: {}, // 页面dom数据
      size: 0,
      taskClassName: '',
      workId: '', // 作业id
      taskId: '', // 任务id用于老师
      resType: '', // 资源类型微课课件
      fileId: '', // fileId
      position: 0, // 浏览记录位置
      sbjName: '', // 学科名称
      stgName: '', // 学段name
      taskData: {}, // taskdetail
      setOption: {
        'duration': 0, // 观看时长
        'position': 0, // 最后位置
        'tail': true, // 是否看过尾部
        'timestamp': 0 // 开始时间
      }
    }
  },
  created () {
    let _this = this
    _this.workId = _this.GetRequest().workId
    _this.userId = _this.GetRequest().userId
    _this.taskId = _this.GetRequest().taskId
    _this.resType = _this.GetRequest().resType
    if (_this.workId || _this.taskId) {
      _this.getWorkDetail()
    }
  },
  mounted () {
    let _this = this
    let status = 0
    /* 只有学生打开才保存记录 */
    if (_this.resType === undefined) {
      /* /!*兼容ie9*!/
         if(typeof (history.pushState) === 'function'){
           window.addEventListener('load', function() {
               let path = location.href.replace(/#.*$/, '') + '#!';
             // 将追加了hash的链接推入history中
             history.pushState({path: path},path);
             status = 1;
           });
           window.addEventListener('popstate', function(ev){
             if (status == 1) {
               status = 0;
               _this.setWorkDetail();
             }
           });
         } */
      window.onbeforeunload = function (e) {
        _this.setWorkDetail()
        e = e || window.event
        e.returnValue = false
        return false
      }
      /* window.onunload = function(e){
           _this.setWorkDetail();
           e = e || window.event;
           e.returnValue = false;
           return false;
         } */
    } else {
      document.title = '查看作业'
    }
  },
  methods: {
    // 进入页面拉去数据
    getWorkDetail: function () {
      let _this = this
      axios.interceptors.request.use(config => {
        let token = window.localStorage['access_token']
        if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
          config.headers.Authorization = token
        }
        return config
      }, error => {
        return Promise.reject(error)
      })
      if (_this.taskId) {
        axios.get(`https://api.yunguxt.com/work/home/tasks/${_this.taskId}/watch`).then(res => {
          if (res) {
            _this.taskData = res.data
            /* 遍历学生名单拿到对应信息 */
            if (_this.userId) {
              _this.taskData.users.map((item) => {
                if (item.userId == _this.userId) {
                  _this.taskData.watchCnt = item.watchCnt
                  _this.taskData.usedTime = item.usedTime
                }
              })
            }
            _this.taskData.groupName = []
            if (_this.taskData.groups) {
              _this.taskData.groups.map((item) => {
                _this.taskData.groupName.push(item.groupName)
              })
            }
            /* 转换任务类型 */
            switch (this.taskData.type) {
              case 1:
                _this.taskClassName = 'c-analy-heaher__icon--pre'
                break
              case 2:
                _this.taskClassName = 'c-analy-heaher__icon--oncourse'
                break
              case 3:
                _this.taskClassName = 'c-analy-heaher__icon--after'
                break
              case 4:
                _this.taskClassName = 'c-analy-heaher__icon--test'
                break
            }
            _this.taskData.pubOn = this.setTime(_this.taskData.pubOn)
            _this.taskData.finalOn = this.setTime(_this.taskData.finalOn)
            _this.taskData.resType = _this.resType
            _this.getResource(_this.taskData)
          }
        })
      } else {
        axios.get(`https://api.yunguxt.com/work/home/watch/${_this.workId}/starting`).then(res => {
          if (res) {
            let data = res.data
            _this.position = data.position
            _this.setOption.timestamp = data.timestamp
            _this.getTaskDetail(data)
            _this.taskData.groupName = []
            if (data.groups) {
              data.groups.map((item) => {
                _this.taskData.groupName.push(item.groupName)
              })
            }
            switch (data.resType) {
              case 3: // 課件
                this.getResource(data)
                break
              case 4: // 微课
                this.getResource(data)
            }
          }
        })
      }
    },
    /* 获取任务详情 */
    getTaskDetail: function (data) {
      axios.get(`https://api.yunguxt.com/work/home/works?scope=all&pageSize=100000`).then(res => {
        if (res) {
          res.data.items.map((item) => {
            if (item.taskId === data.taskId) {
              this.taskData = item
              this.taskData.watchCnt = data.watchCnt
              this.taskData.usedTime = data.usedTime
              if (this.taskData.watchCnt >= 1) {
                document.title = '作业报告'
              }
            }
          })
          /* 转换任务类型 */
          switch (this.taskData.type) {
            case 1:
              this.taskClassName = 'c-analy-heaher__icon--pre'
              break
            case 2:
              this.taskClassName = 'c-analy-heaher__icon--oncourse'
              break
            case 3:
              this.taskClassName = 'c-analy-heaher__icon--after'
              break
            case 4:
              this.taskClassName = 'c-analy-heaher__icon--test'
              break
          }
          this.taskData.pubOn = this.setTime(this.taskData.pubOn)
          this.taskData.finalOn = this.setTime(this.taskData.finalOn)
        }
      })
    },
    // 根据资源id获取资源详情
    getResource: function (data) {
      let _url = data.resType == 3 ? `${data.resId}/courseware/${data.refId}` : `${data.resId}/microcourse/${data.refId}`
      axios.get(`https://api.yunguxt.com/repository/resource/${_url}`).then(res => {
        if (res) {
          this.renderData = res.data
          this.getStgSubData()
        }
      })
    },
    // 查询学段学科名称
    getStgSubData: function () {
      this.setData()
      var _this = this
      axios.get(`https://api.yunguxt.com/category/subject`).then(res => {
        res.data.map(function (item) {
          if (_this.renderData.content.sbjId === item.sbjId) {
            _this.sbjName = item.sbjName
          }
        })
      })
      axios.get(`https://api.yunguxt.com/category/stage`).then(res => {
        res.data.map(function (item) {
          if (_this.renderData.content.stgId === item.stgId) {
            _this.stgName = item.stgName
          }
        })
      })
    },
    // 关闭页面保存记录
    setWorkDetail: function () {
      if (document.getElementById('firamebox')) {
        var _iframe = document.getElementById('firamebox').contentWindow
        var _div = _iframe.document.getElementById('PageIndex')
        this.setOption.position = _div.innerHTML
      }
      let token = window.localStorage['access_token']
      $.ajax({
        async: false,
        type: 'post',
        url: `https://api.yunguxt.com/work/home/watch/${this.workId}/stopped`,
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Authorization': token
        },
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(this.setOption),
        datatype: 'json',
        success: () => {
          window.history.go(-1)
        }
      })
      /* axios.post(`https://api.yunguxt.com/work/home/watch/${this.workId}/stopped`, this.setOption).then(res => {
           if(num === 10){
           }
           window.history.go(-1);
         }) */
      return '44'
    },
    setData: function () {
      this.fileId = this.renderData.content.fileId
      // 时间转换
      if (this.renderData.content.modifiedOn) {
        this.renderData.content.modifiedOn = moment(this.renderData.content.modifiedOn).format('YYYY-MM-DD HH:mm:ss')
      }
      // 文件大小转换

      if (this.renderData.content.size < 1024) {
        this.renderData.content.size = `${this.renderData.content.size.toFixed(2)}B`
      } else if (this.renderData.content.size >= 1024 && this.renderData.content.size < 1048576) {
        this.renderData.content.size = `${(this.renderData.content.size / 1024).toFixed(2)}KB`
      } else if (this.renderData.content.size >= 1048576 && this.renderData.content.size < 1073741824) {
        this.renderData.content.size = `${(this.renderData.content.size / 1048576).toFixed(2)}M`
      } else {
        this.renderData.content.size = `${(this.renderData.content.size / 1073741824).toFixed(2)}GB`
      }
    },
    // 预览插件记录浏览数据
    closeSet: function (value) {
      this.setOption.duration = value.duration || ''
      this.setOption.position = value.position || 0
      this.setOption.tail = value.tail
    },
    // 获取workid
    GetRequest: function () {
      var url = location.search // 获取url中"?"符后的字串
      var theRequest = new Object()
      if (url.indexOf('?') != -1) {
        var str = url.substr(1),
          strs = str.split('&')
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
        }
      }
      return theRequest
    },
    /* 时间转换 */
    setTime: function (data) {
      return moment(data).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  components: {
    viewer: viewer,
    Header: Header
  }
}
</script>
<style>
  @import "assets/work-detail.css";
  @import "assets/viewer.css";
  .c-analy-loadbox {
    width: 100%;
    height: 600px;
    margin: 10px auto;
    background: #fff;
    border: 1px solid #eee;
  }

  .loadEffect {
    width: 100px;
    height: 100px;
    margin: 0 auto;
    margin-top: 200px;
    position: relative;
  }

  .loadEffect div {
    width: 100%;
    height: 100%;
    position: absolute;
    -webkit-animation: load 2.08s linear infinite;
  }

  .loadEffect div span {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: lightgreen;
    position: absolute;
    left: 50%;
    margin-top: -10px;
    margin-left: -10px;
  }

  @-webkit-keyframes load {
    0% {
      -webkit-transform: rotate(0deg);
    }
    10% {
      -webkit-transform: rotate(45deg);
    }
    50% {
      opacity: 1;
      -webkit-transform: rotate(160deg);
    }
    62% {
      opacity: 0;
    }
    65% {
      opacity: 0;
      -webkit-transform: rotate(200deg);
    }
    90% {
      -webkit-transform: rotate(340deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }

  }

  .loadEffect div:nth-child(1) {
    -webkit-animation-delay: 0.2s;
  }

  .loadEffect div:nth-child(2) {
    -webkit-animation-delay: 0.4s;
  }

  .loadEffect div:nth-child(3) {
    -webkit-animation-delay: 0.6s;
  }

  .loadEffect div:nth-child(4) {
    -webkit-animation-delay: 0.8s;
  }
</style>
