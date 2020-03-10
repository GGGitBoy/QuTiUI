<template>
	<div class="container">
		<div class="qu-wrap">
			<header>
				<router-link tag="span" to="/questionNaire">&lt; 返回</router-link>
				<p>{{ quData.title }}</p>
			</header>
			<div style="padding: 2rem;border-top: 2px solid #bbb;height:300px">
					<div class="user-major" style="width:50%;float:left;height:300px"></div>

					<div class="user-sex" style="width:50%;float:right;height:300px"></div>
			</div>
					
			<div class="qu-content">
					<div class="qu-item" v-for="(item, quindex) in quData.questions">
						<section class="qu-data">
							<div style="padding-bottom:100px;">
								<el-button plain style="font-size: 1.4rem;font-weight: 600;float:left;" @click="showQuess(quindex)">
									{{ `Q${quindex + 1}&nbsp;&nbsp;&nbsp;${item.content}`}}
								</el-button> 
								<el-button v-if="quessShow[quindex] == true" plain style="font-size: 1.4rem;font-weight: 600;float:right;" @click="showAllChart(quindex, item)">
									{{ showAllMessage[quindex] }}
								</el-button> 
							</div>
					
							<template v-if="item.type == 'score' && quessShow[quindex] == true">
								<div v-for="(ques, quessindex) in item.quess" style="padding-bottom:50px;" :key=quessindex>
									<div>
										<el-button plain style="font-size: 20px;" @click="showChart(quindex, quessindex, ques)">{{ ques.content }}</el-button>
									</div> 

									<div v-show="chartShow[quindex][quessindex]" :class=" 'lines' + quindex + '' + quessindex" style="padding-top:50px; height:200px"></div>
								</div>
							</template>
							<!-- <p v-else v-for="option in item.options">{{ option }}</p> -->
						</section>
						<!-- <section class="ans-data">
							<h4>填写人数/男女占比</h4>
							<template v-if="item.type === 'radio'">
								<p class="outerBar" v-for="(option, optIndex) in item.options">
									<span class="innerBar" :style="{width: randomScale()}"></span>
									<span class="scaleNum"></span>
								</p>
							</template>
							<p class="outerBar" v-else-if="item.type === 'textarea'">
								<span class="innerBar" :style="{width: randomScale()}"></span>
								<span class="scaleNum"></span>
							</p>
							 <p class="user-sex" v-else></p> 
							<h4>填写人数/专业情况占比</h4>
							 <p class="user-major"></p> 
						</section> -->
					</div>
				</div>
			</div>
		</div>
</template>

<script>
import Store from '../store.js';
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/toolbox'

import { getNaireDetail, getNaireTotalDetail } from '../../api/api';

export default {
	name: 'Data',
	data() {
		return {
			chartShow: {},
			quessShow: [],
			showAllMessage: [],
			quData: {},
			scale: '',
			option: true,
		}
	},

	beforeRouterEnter(to, from, next) {
		let id = to.params.id;
		let item = {};
		if (id !== 0) {
			let length = Store.fetch().length;
			if (id < 0 || id > length) {
				alert('非法路由');
				next('');
			}
			else {
				item = Store.fetch()[id - 1];
			}

			if (item.state === 0) {
				next();
			}
			else {
				alert('非法路由');
				next('/');
			}
		}
		else {
			next();
		}
	},

	created() {
		this.getData();
		var arr=new Array();             //声明一维数组       
		var i = 20 
		for(var x=0;x<i;x++) {
			this.showAllMessage[x] = "展示统计情况"
			arr[x] = new Array();        //声明二维数组
			
			for(var y=0;y<i;y++) {
				arr[x][y] = false;          //数组初始化为0
			}
			this.chartShow = arr
		}
	},

	methods: {
		showAllChart(quindex, question){	

			if(this.showAllMessage[quindex] === '展示统计情况'){
				var i = 20
				for(var y=0;y<i;y++) {
					this.chartShow[quindex][y] = true;          //数组初始化为0
				}
				this.$forceUpdate()

				let _this = this;
			    let lines = document.querySelectorAll('div[class^="lines'+ quindex +'"]');
				setTimeout(function() {
					[].forEach.call(lines, (item, i) => {
						_this.drawLine(item, question.quess[i]);
					});
				}, 1000);
				this.showAllMessage[quindex] = '收起统计显示'
			}else {
				var i = 20
				for(var y=0;y<i;y++) {
					this.chartShow[quindex][y] = false;          //数组初始化为0
				}
				this.$forceUpdate()

				let _this = this;
			    let lines = document.querySelectorAll('div[class^="lines'+ quindex +'"]');
				setTimeout(function() {
					[].forEach.call(lines, (item) => {
						_this.clearLine(item)
					});
				}, 1000);
				this.showAllMessage[quindex] = '展示统计情况'
			}

			

		},
		showQuess(quindex){
			this.quessShow[quindex] = !this.quessShow[quindex]
			this.$forceUpdate()

			if(this.quessShow[quindex] === false){
				var i = 20
				for(var y=0;y<i;y++) {
					this.chartShow[quindex][y] = false;          //数组初始化为0
				}
			}

			
		},
		showChart(quindex, quessindex, ques) {
			this.chartShow[quindex][quessindex] = !this.chartShow[quindex][quessindex]
			this.$forceUpdate()

			let _this = this;
			let line = document.querySelector('.lines' + quindex + "" + quessindex);

			if(this.chartShow[quindex][quessindex] === true){
				setTimeout(function() {
					_this.drawLine(line, ques);	
				}, 500);
			}else{
				_this.clearLine(line)
			}	
		},
		getData() {
			let id = this.$route.params.id;
			let para = {
					id: id,
			};
			getNaireTotalDetail(para).then((res) => {
				this.quData = res.data;				
			})
		},

		randomScale() {
			return Math.random().toFixed(2) * 100 + '%';
		},

		clearLine(element){
			let myChart = echarts.init(element);
			myChart.clear()
		},

		drawLine(element, ques){
			console.log(ques)

			const arrData = []
			for (var i = 0; i < ques.options.length; i++) { 
				arrData.push(ques.options[i].answers.length)
			}

			console.log(arrData)
			
			// 基于准备好的dom，初始化echarts实例
			let myChart = echarts.init(element);
			// 绘制图表
			myChart.setOption({
				 title: {
					text: '关联程度',
					subtext: '假数据'
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow'
					}
				},
				// legend: {
				// 	data: ['2011年']
				// },
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: {
					type: 'value',
					boundaryGap: [0, 1]
				},
				yAxis: {
					type: 'category',
					data: ['一星', '二星', '三星', '四星', '五星']
				},
				series: [
					{
						name: '数量',
						type: 'bar',
						data: arrData
					},
	
				]
			});
		},

		drawPie(element) {
			let myChart = echarts.init(element);
			let option = {
				tooltip : {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				series : [
					{
						name: '选择人数',
						type: 'pie',
						radius : '60%',
						center: ['30%', '50%'],
						data:[
							{value:20, name:'男'},
							{value:30, name:'女'},
						],
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}
				]
			};
			myChart.setOption(option);
		},

		renderEchart(element) {
			let myChart = echarts.init(element);
			let option = {
				tooltip : {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				series : [
				{
					name: '选择人数',
					type: 'pie',
					radius : '60%',
					center: ['30%', '50%'],
					data:[
					{value:20, name:'物联网工程'},
					{value:30, name:'计算机科学与技术'},
					{value:40, name:'软件工程'},
					{value:50, name:'网路工程'}
					],
					itemStyle: {
						emphasis: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
				}
				]
			};
			myChart.setOption(option);
		},	
	},

	mounted() {
		let _this = this;
		setTimeout(function() {
			let user_major = document.querySelector('.user-major');
			let user_sex = document.querySelector('.user-sex');	

			_this.drawPie(user_major);
			_this.renderEchart(user_sex);
		}, 1000);
	},

	watch: {
		//观察option的变化
		option: {
			handler(newVal, oldVal) {
				if (this.chart) {
					if (newVal) {
						this.chart.setOption(newVal);
					} else {
						this.chart.setOption(oldVal);
					}
				} else {
					this.init();
				}
			},
			deep: true //对象内部属性的监听，关键。
		}
	}
}

</script>

<style scoped lang="scss">
@import '../style/_Data.scss';
</style>
