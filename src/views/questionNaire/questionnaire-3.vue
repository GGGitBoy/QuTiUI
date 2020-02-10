<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-select v-model="value" filterable placeholder="请选择问卷" @change="getDetail()"  style="width: 700px;">
						<el-option
							v-for="item in cities"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							<span style="float: left">{{ item.label }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					填写该问卷人数 <el-input v-model="Naire.click" :disabled="true" style=" width: 100px;"></el-input>
				</el-form-item>
				<el-form-item v-if="chooseNum">
					<el-button  type="info" plain @click="chooseUser()">查看填写人员</el-button>
				</el-form-item>
				<el-form-item v-if="!chooseNum">
					<el-button  type="warning" plain @click="chooseQuestion()">查看问题统计</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<el-col :span="24" class="toolbar">
			<template  v-if="chooseNum">
				<el-tabs v-model="activeName" @tab-click="handleClick"> 
					<el-tab-pane 
						v-for="item in questionGroupList"
						:key="item.questiongroupnumber"
						:label="item.content" 
						:name="item.questiongroupnumber">
						<el-table :data="item.questionList" highlight-current-row v-loading="listLoading" style="width: 100%;" :border="true" @row-click="questionClick">
							<el-table-column type="index" width="60" align="center">
							</el-table-column>
							<el-table-column prop="questionnumber" label="问题号" width="180" align="center">
							</el-table-column>
							<el-table-column prop="content" label="内容" width="360" align="center">
							</el-table-column>
							<el-table-column prop="digest" label="摘要" width="500"  align="center">
							</el-table-column>
							<el-table-column prop="questiontypenumber" label="问题类型" width="180"  align="center">
							</el-table-column>
						</el-table>

						<!--工具条-->
						<el-col :span="24" class="toolbar">
							<el-button type="primary" plain @click="downLoadWord(item.questiongroupnumber)">调查结果下载</el-button>
							<el-button type="success"  plain @click="echartsQuestion(item.questionList)">该问题组填写图表情况分析</el-button>
							<el-button type="danger" plain  @click="handleStatus()">问卷作废</el-button>
						</el-col>
					</el-tab-pane>
				</el-tabs>
			</template>
			<template  v-if="!chooseNum">
				<el-table :data="userList" highlight-current-row v-loading="listLoading" style="width: 100%;" :border="true" v-if="!chooseNum" @row-click="userClick">
					<el-table-column type="index" width="60" align="center">
					</el-table-column>
					<el-table-column prop="username" label="用户名" width="180" align="center">
					</el-table-column>
					<el-table-column prop="major" label="专业" width="360" align="center">
					</el-table-column>
					<el-table-column prop="studentnumber" label="学号" width="500"  align="center">
					</el-table-column>
					<el-table-column prop="name" label="姓名" width="180"  align="center">
					</el-table-column>
					<el-table-column prop="sex" label="性别" width="180"  align="center">
					</el-table-column>
					<el-table-column prop="graduationyear" label="毕业年份" width="180"  align="center">
					</el-table-column>
					<el-table-column prop="usertypenum" label="用户类型" width="180"  align="center">
					</el-table-column>
				</el-table>

				<!--工具条-->
				<el-col :span="24" class="toolbar">
					<el-button type="success"  plain @click="echartsUser()">该问卷填写人员图表分析</el-button>
				</el-col>
			</template>	
		</el-col>


		<el-dialog :visible.sync="echartsVisible" :close-on-click-modal="false">		
			<div id="chartColumn" style="width:100%; height:400px;"></div>
		</el-dialog>

		<el-dialog :visible.sync="echartsAll" :close-on-click-modal="false">		
			<div v-for="item in questionList"
							:key="item.value"
							:value="item.content" 
					:id="item.questionnumber" style="width:100%; height:400px;"></div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	 import echarts from 'echarts'
	import { changeStatus, UpLoadWord, getNaireNum, findQuestionGroupNum, findUserNum, findOptionsID } from '../../api/api';

	export default {
		data() {
			return {
				chartColumn: null,
				activeName: '',
				cities: [],
				value: '', //选择的问卷号
      
				filters: {
					title: '',
					questionnairenumber: '',
					status: 3,
					questiontypenumber: '评分题',
				},
				NaireNum: [],
				Naire: {},
				questionGroupList: [],
				questionList: [],
				userList: [],
				listLoading: false,
				chooseNum: true,

				echartsVisible: false,
				echartsAll: false,

				echartsXAxis: [],
				echartsSeriesData: [60, 20],
				echartsTitle: '',

				tubiaoList: []


			}
		},
		methods: {
			echartsQuestion(questionList) {
				this.echartsAll = true
				this.questionList = questionList
				
				
				for(let element of questionList){
					setTimeout(function() {
						var optionsidList = []
						for(let item of element.optionsList){	
							optionsidList.push(item.optionsid)
						}
						
						findOptionsID({ optionsidList: optionsidList.map(item => item).toString() }).then((res) => {
							var echartsXAxis = []
							for(let item of element.optionsList){	
								echartsXAxis.push(item.optionscontent)
							}
							
							let tubiao = echarts.init(document.getElementById(element.questionnumber));
							tubiao.setOption({
								title: { text: element.content },
								tooltip: {},
								xAxis: {
									data: echartsXAxis
								},
								yAxis: {},
								series: [{
									name: '选择人数',
									type: 'bar',
									data: res.data
								}]
							});
							
						})	
					}, 100);					
				}									
			},
			echartsUser() {
				this.echartsAll = true
			},
			userClick(row, column, event){
				console.log(row, column, event)
			},
			questionClick(row, column, event) {
				this.echarts(row)
			},
			chooseUser() {
				this.chooseNum = false 
			},
			chooseQuestion() {
				this.chooseNum = true 
			},
			 handleClick(tab, event) {
				// console.log(tab, event);
			},
			drawCharts() {
                this.drawColumnChart()
                // this.drawBarChart()
                // this.drawLineChart()
                // this.drawPieChart()
			},
			 drawColumnChart() {
				
                this.chartColumn = echarts.init(document.getElementById('chartColumn'));
                this.chartColumn.setOption({
                  title: { text: this.echartsTitle },
                  tooltip: {},
                  xAxis: {
                      data: this.echartsXAxis
                  },
                  yAxis: {},
                  series: [{
                      name: '选择人数',
                      type: 'bar',
                      data: this.echartsSeriesData
                    }]
                });
            },
			echarts(row) {
				this.echartsTitle = row.content
				this.echartsXAxis = []
				this.echartsSeriesData = []
				var optionsidList = []
				for(let element of row.optionsList){	
					this.echartsXAxis.push(element.optionscontent)
					optionsidList.push(element.optionsid)
				}
				findOptionsID({ optionsidList: optionsidList.map(item => item).toString() }).then((res) => {
					this.echartsSeriesData = res.data
					this.echartsVisible = true
					let _this = this;
					setTimeout(function() {
						_this.drawCharts()
					}, 100);
				})	

				
			},
			getDetail() {
				this.questionGroupList = []
				this.userList = []
				let para = {
					num: this.value,
				};
				for(let Naire of this.NaireNum){
					if(Naire.questionnairenumber == this.value){
						this.Naire = Naire
					}
				}
				findQuestionGroupNum(para).then((res) => {
					for(let element of res.data) {
						let questionGroup = element.questiongroup
						let questionList = element.questionList
						let QuestionList = []
						for(let elementQuestion of questionList){
							let question = elementQuestion.question							
							question.optionsList = elementQuestion.optionsList			
							QuestionList.push(question)
						}
						questionGroup.questionList = QuestionList
						this.questionGroupList.push(questionGroup)
					}
				})	
				findUserNum(para).then((res) => {
					this.userList = res.data
				})	
				
			},	
			downLoadWord(questiongroupnumber) {
				// 		let fname = `我的文档`; //下载文件的名字
				// 		link.setAttribute("download", fname);
				// 	})
				console.log(questiongroupnumber)
				let para = {
					questiongroupnumber: questiongroupnumber,
				};
				UpLoadWord(para).then(msg => {
		                let url = window.URL.createObjectURL(msg.data); //表示一个指定的file对象或Blob对象
		                let link = document.createElement("a"); 
		                document.body.appendChild(link);

		                let fileName = msg.headers["content-disposition"].split(";")[1].split("=")[1];  //filename名称截取
		  				 link.download = fileName; //命名下载名称

		                link.href = url;
		                link.click(); //点击触发下载  
		                window.URL.revokeObjectURL(url);  //下载完成进行释放
		        })
			 },
			handleStatus() {
				this.$confirm('确认作废该问卷吗?', '提示', {}).then(() => {
					let para = this.Naire
					para.status = 4
					console.log(para)
					changeStatus(para).then((res) => {
						this.$message({
							message: '问卷已作废',
							type: 'success'
						});
						this.value = ''
						this.getNaireNum();
						this.getDetail();
					});
				})	
			},
			getNaireNum() {
				this.cities = []
				this.NaireNum = []
				this.Naire = {}
				let para = {
					filtersStatus: this.filters.status,
				};
				getNaireNum(para).then((res) => {
					this.NaireNum = res.data
					for(let element of res.data){
						let item = {}
						item.label = element.title
						item.value = element.questionnairenumber
						this.cities.push(item)
					}
				});
			}
		},
		mounted() {
			this.getNaireNum();
		}
	}

</script>

<style scoped>


</style>