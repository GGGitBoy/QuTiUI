<template>
  <div class="survey">
    <el-container>
      <el-main>
        <div class="survey-content">
          <div class="ques-title">{{ques.title}}</div>
          <div class="forward">
            <div class="ques-title-son">{{ques.secondtitle}}</div>
            <div class="ques-title-son-content">{{ques.digest}}</div>
          </div>
          <div class="ques-content">
            <el-table :data="data.quess" style="width: 100%" stripe>
              <el-table-column width="350" align="center" prop="content" label="核心能力"></el-table-column>
              <el-table-column align="center" width="500" :label="content">
                <el-table-column align="center" prop="id">
                  <template slot="header">
                    <div class="box">
                      <span class="to_span">非常关联</span>
                      <div class="to_left"></div>
                      <div class="to_line"></div>
                      <div class="to_right"></div>
                      <span>无关联</span>
                    </div>
                  </template>
                  <template style="width: 100%" slot-scope="scope">
                    <el-radio-group :id="scope.row.quesid" v-model="scope.row.id"
                                    @change="changeRadio($event,scope.row)">
                      <el-tooltip :content="texts[0]" placement="top" effect="light">
                        <el-radio label="5">5</el-radio>
                      </el-tooltip>
                      <el-tooltip :content="texts[1]" placement="top" effect="light">
                        <el-radio label="4">4</el-radio>
                      </el-tooltip>
                      <el-tooltip :content="texts[2]" placement="top" effect="light">
                        <el-radio label="3">3</el-radio>
                      </el-tooltip>
                      <el-tooltip :content="texts[3]" placement="top" effect="light">
                        <el-radio label="2">2</el-radio>
                      </el-tooltip>
                      <el-tooltip :content="texts[4]" placement="top" effect="light">
                        <el-radio label="1">1</el-radio>
                      </el-tooltip>
                    </el-radio-group>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>
          <div class="survey-bottom">
            <div class="survey-bpttom-text">{{bottomTips}}</div>
            <div class="survey-bottom-btn">
              <el-button type="primary" plain icon="el-icon-arrow-left" @click="returnBack">返回</el-button>
              <el-button type="primary" @click="submit">{{btnText}}</el-button>
            </div>
          </div>
        </div>
      </el-main>
		  <!-- <el-button type="primary" plain  @click="fillphone">移动端预览</el-button> -->
    </el-container>
  </div>
</template>


<script>

import { getNaireDetail } from '../../api/api';

    export default {
        filters: {},
        data() {
            return {
                a: {},//测完删
                /*forewordTitle: '专业核心能力及学习成效满意度',
                foreword:
                    '请问您就读本专业时，本专业课程的设计与教师教学是否提供您具备下列各项核心能力？',
                question1: '您认为此项核心能力对于您毕业后就业的重要性',
                question2: '您认为您在学习本专业时是否已教授您获得此项核心能力',*/
                ques: {},//上个页面传的参数
                content: '',
                btnText: '下一页',
                page: 0,
                data: [],//当前页面的问题
                form: {
                    questionnaireid: 0,
                    questions: []
                },
                hasAns: {},//暂存答案
                answer: [],//答案
                list: [
                    [
                        {
                            id: 0,
                            id1: '',
                            title:
                                '1.人文社会科学素养、良好职业规范：\n具有人文社会科学素养，社会责任感强，能够在计算机应用工程实践中理解并遵守工程职业道德和规范，履行责任。',
                            content:
                                '具有人文社会科学素养，社会责任感强，能够在计算机应用工程实践中理解并遵守工程职业道德和规范，履行责任。',
                            shadow: true,
                            note: 'Tips',
                            extra: '额外信息',
                            thumbnail: 'https://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png'
                        },
                        {
                            id: 1,
                            id1: '',
                            title:
                                '1.人文社会科学素养、良好职业规范：\n具有人文社会科学素养，社会责任感强，能够在计算机应用工程实践中理解并遵守工程职业道德和规范，履行责任。',
                            content:
                                '具有人文社会科学素养，社会责任感强，能够在计算机应用工程实践中理解并遵守工程职业道德和规范，履行责任。',
                            shadow: true,
                            note: 'Tips',
                            extra: '额外信息',
                            thumbnail: 'https://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png'
                        }
                    ],
                    [
                        {
                            id: 2,
                            id1: '',
                            title:
                                '1.人文社会科学素养、良好职业规范：\n具有人文社会科学素养，社会责任感强，能够在计算机应用工程实践中理解并遵守工程职业道德和规范，履行责任。',
                            content:
                                '具有人文社会科学素养，社会责任感强，能够在计算机应用工程实践中理解并遵守工程职业道德和规范，履行责任。',
                            shadow: true,
                            note: 'Tips',
                            extra: '额外信息',
                            thumbnail: 'https://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png'
                        },
                        {
                            id: 3,
                            id1:
                                '',
                            title:
                                '1.人文社会科学素养、良好职业规范：\n具有人文社会科学素养，社会责任感强，能够在计算机应用工程实践中理解并遵守工程职业道德和规范，履行责任。',
                            content:
                                '具有人文社会科学素养，社会责任感强，能够在计算机应用工程实践中理解并遵守工程职业道德和规范，履行责任。',
                            shadow:
                                true,
                            note:
                                'Tips',
                            extra:
                                '额外信息',
                            thumbnail:
                                'https://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png'
                        }
                        ,
                        {
                            id: 4,
                            id1:
                                '',
                            title:
                                '1.人文社会科学素养、良好职业规范：\n具有人文社会科学素养，社会责任感强，能够在计算机应用工程实践中理解并遵守工程职业道德和规范，履行责任。',
                            content:
                                '具有人文社会科学素养，社会责任感强，能够在计算机应用工程实践中理解并遵守工程职业道德和规范，履行责任。',
                            shadow:
                                true,
                            note:
                                'Tips',
                            extra:
                                '额外信息',
                            thumbnail:
                                'https://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png'
                        }
                        ,
                        {
                            id: 5,
                            id1:
                                '',
                            title:
                                '1.人文社会科学素养、良好职业规范：\n具有人文社会科学素养，社会责任感强，能够在计算机应用工程实践中理解并遵守工程职业道德和规范，履行责任。',
                            content:
                                '具有人文社会科学素养，社会责任感强，能够在计算机应用工程实践中理解并遵守工程职业道德和规范，履行责任。',
                            shadow:
                                true,
                            note:
                                'Tips',
                            extra:
                                '额外信息',
                            thumbnail:
                                'https://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png'
                        }
                        ,
                        {
                            id: 6,
                            id1:
                                '',
                            title:
                                '1.人文社会科学素养、良好职业规范：\n具有人文社会科学素养，社会责任感强，能够在计算机应用工程实践中理解并遵守工程职业道德和规范，履行责任。',
                            content:
                                '具有人文社会科学素养，社会责任感强，能够在计算机应用工程实践中理解并遵守工程职业道德和规范，履行责任。',
                            shadow:
                                true,
                            note:
                                'Tips',
                            extra:
                                '额外信息',
                            thumbnail:
                                'https://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png'
                        }
                    ]
                ],
                texts:
                    ['非常关联', '关联很大', '一般关联', '关联很小', '无关联'],
                bottomTips:
                    '注：请选择上述关联性，5分为非常关联，1分为无关联'
            }
        },
        created() {
            // this.getRouterData()
            this.getQuestionDetailData()
        },
        methods: {
			fillphone() {
				this.$router.push({name: 'FillPhone'})
			},
            /**
             * 获取问卷内容
             */
            getQuestionDetailData() {

			let id = this.$route.params.id;
			let that = this
			let para = {
				id: id,
			};
			getNaireDetail(para).then((res) => {
				that.form = res.data
				that.data = that.form.questions[0]	
				that.content = that.data.content		
			})
		


                // let that = this
                // that.$http.get('/questionnaire/getDetail.action', {
                //     params: {
                //         id: that.ques.questionnaireid
                //     }
                // }).then(function (res) {
                //     console.log(res.status)
                //     console.log(res.data)
                //     that.form = res.data
                //     that.data = that.form.questions[0]
                //     that.content = that.data.content
                // })
            },
            /**
             * 获取上个页面传的参数
             */
            getRouterData() {
                this.ques = this.$route.params.ques
            },
            returnBack() {
                this.$router.push('/questionNaire')
            },
            /**
             * 提交问卷（下一页按钮）
             */
            submit() {
                let that = this
  
                    //最后一页，提交问卷
                    if ((that.page + 1) === that.form.questions.length) {
						 that.$message({
                            message: '预览模拟提交, 数据不会真实提交',
                            type: 'warning',
                            showClose: true
                        });
                        // that.$alert('您确定提交问卷吗？', '提交', {
                        //     confirmButtonText: '确定',
                        //     callback: action => {
                        //         that.commitQuestionNaire()
                        //         that.$router.push('/newQuestionNaire')
                        //     }
                        // })
                    }
                    //中间页，切换到下一页
                    if (that.page < that.form.questions.length - 1) {
                        //修改最后一页的按钮名称
                        if (that.page === (that.form.questions.length - 2)) {
                            that.btnText = '提交'
                        }
                        that.page = that.page + 1
                        that.data = that.form.questions[that.page]
                        that.content = that.data.content
                    }
          
            },
            commitQuestionNaire() {
                let that = this
                that.answer = []
                for (let prop in that.hasAns) {
                    let answer = that.hasAns[prop]
                    that.answer.push(answer)
                }
                this.$http.post('/answer/addList.action',
                    {answers: that.answer}).then(e => {

                })
            },
            /**
             * 评分点击时间
             */
            changeRadio(e, row) {
              console.log(row)
                console.log("e=" + e)
                this.a = row
                let key = row.quesid
                let answer = {
                    userid: "1246494ff265415998a6320117b3b810",
                    optionsid: "optionsid",
                    questionnairenumber: this.form.questionnairenumber,
                    value: e
                }
                this.hasAns[key] = answer
            }
        }
    }
</script>

<style lang="less" scoped>
  .survey {
    width: 100%;
    height: 100%;
  }

  .el-container {
    background-color: #dcdfe6;
  }

  .el-main {
    display: flex;
    justify-content: center;
  }

  .survey-content {
    width: 100%;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .back {
    width: 98%;
    margin: 10px;
  }

  .ques-title {
    width: 80%;
    margin-top: 60px;
    font-size: 40px;
    margin-left: 300px;
    margin-right: 300px;
    text-align: center;
    letter-spacing: 2px;
  }

  .forward {
    margin-top: 60px;
    width: 80%;
  }

  .ques-title-son {
    font-size: 25px;
    text-align: left;
    margin-left: 20px;
  }

  .ques-title-son-content {
    margin-top: 10px;
    margin-left: 20px;
  }

  .ques-content {
    width: 80%;
    background-color: #dcdfe6;
    margin-top: 10px;
    margin-left: 60px;
    margin-right: 60px;
  }

  .survey-bottom {
    width: 80%;
    margin-top: 20px;
    margin-bottom: 120px;
  }

  .survey-bottom-text {
    width: 100%;
    text-align: left;
  }

  .survey-bottom-btn {
    margin-top: 60px;
    display: flex;
    justify-content: center;
  }

  .image {
    width: 230px;
    height: 100%;
  }

  .el-radio {
    width: 20px;
  }

  .box {
    display: flex;
    justify-content: center;
    width: 100%;
    text-align: center;
  }

  .box p {
    background: pink;
  }

  /* 向左箭头 */
  .to_left {
    width: 0;
    height: 0;
    border-right: 12px solid #666666;
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
  }

  /* 向右箭头 */
  .to_right {
    width: 0;
    height: 0;
    border-left: 12px solid #666666;
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    margin-right: 10px;
  }

  .to_line {
    width: 430px;
    height: 3px;
    margin-top: 10px;
    background: #666666;
  }

  .to_span {
    margin-right: 10px;
    margin-left: 10px;
  }

  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
