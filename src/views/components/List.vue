<template>
	<div class="container">
		<div class="add-wrapper" v-if="!quList.length">
			<p><el-button  type="warning" plain @click="newItem()">+ 新建问卷</el-button></p>
		</div>
		<div class="list-wrapper" v-else>
		
			<el-row>
				<el-col :span="2"></el-col>
				<el-col :span="12" style="font-size: 25px;font-weight: 600;"><p>问卷标题</p></el-col>
				<el-col :span="2" style="font-size: 25px;font-weight: 600;"><p>状态</p></el-col>
				<el-col :span="8" style="font-size: 25px;font-weight: 600;"><p>操作</p></el-col>
			</el-row>

			<el-row>
				<el-col :span="2"></el-col>
				<el-col :span="12" style="font-size: 25px;font-weight: 600;">
			
				</el-col>
				<el-col :span="2" style="font-size: 25px;font-weight: 600;">
				
				</el-col>
				<el-col :span="8">
					<p>
							<!-- <el-button type="primary">重置查询</el-button>
							<el-button type="primary">查询</el-button>
							<el-button type="primary">新增</el-button> -->
							<el-button  type="warning" plain @click="newItem()">新建问卷</el-button>
			
					</p>
				</el-col>
				
			</el-row>

			<el-row  v-for="(item, index) in quList" :key="item.index">
				<el-col :span="2"><p @click="checkItem(item, index)"><i :class="{'checked': item.checked}"></i></p></el-col>
				<el-col :span="12"><p v-text="item.title"></p></el-col>
				<el-col :span="2"><p v-text="item.status" :class="{'releasing': (item.state === 1)}"></p></el-col>
				<el-col :span="8">
					<p  v-if="item.status == '未发布'">				
						<router-link tag="span" :to="`/fill/${item.questionnaireid}`">问卷预览</router-link>
						<span @click="iterator = editItem(item); iterator.next()">编辑</span>
						<span @click="item.status = changestatus(item, '发布中')">发布</span>
					</p>
					<p  v-if="item.status == '发布中'">				
						<router-link tag="span" :to="`/fill/${item.questionnaireid}`">问卷预览</router-link>
						<router-link tag="span" :to="`/data/${item.questionnaireid}`">查看数据</router-link>
						<span @click="item.status = changestatus(item, '已结束')">终止发布</span>
					</p>
					<p  v-if="item.status == '已结束'">				
						<router-link tag="span" :to="`/fill/${item.questionnaireid}`">问卷预览</router-link>
						<router-link tag="span" :to="`/data/${item.questionnaireid}`">查看数据</router-link>
						<span v-if="item.status == '已结束'" @click="downLoadWord(item)">结果下载</span>	
					</p>
				</el-col>
			</el-row>

			


			<div>
				<p @click="checkAll(isCheckedAll)"><i :class="{'checked': isCheckedAll}"></i></p>
				<p>全选<span @click="iterator = deleteCheckedItems(); iterator.next()">删除</span></p>
			</div>
		</div>
		<div class="overlay" v-show="isShowPrompt">
			<div class="prompt-box">
				<header>
					<span>提示</span>
					<a href="javascript:;" @click="isShowPrompt = false">&times;</a>
				</header>
				<p>{{ promptText }}</p>
				<footer>
					<span @click="iterator.next(); isShowPrompt = false">确定</span>
					<span @click="isShowPrompt = false">取消</span>
				</footer>
			</div>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import Store from '../store.js'
import data from '../data.js'

import { getNaireList, removeNaires, download, updateNaireStatue, getNaireTotalDetail } from '../../api/api';

export default {
	name: 'List',
	data() {
		return {
			quList: [],
			iterator: {},
			isShowPrompt: false,
			promptText: '',
			sels: []
		}
	},

	created() {
		let curTime = Date.now();
		this.getItems()
	},

	methods: {
		changestatus(item, status) {	
			let para = {
				id: item.questionnaireid,
				status: status,
			};	
			updateNaireStatue(para).then((res) => {
			})	
			return status
		},
		toPercent(num, total) { 
			return (Math.round(num / total * 10000) / 100.00 + "%");// 小数点后两位百分比
		},
		downLoadWord(item) {

			let paraID = {
					id: item.questionnaireid,
			};
			getNaireTotalDetail(paraID).then((res) => {

				var post ={}
				post.title = res.data.title
				
				var Postquestions = []
				
				var questions = res.data.questions
				questions.forEach( (itemQT, index) => {
					var Pquestions = {}

					var Postrowlist = []

					var quess = itemQT.quess
					quess.forEach( (itemQS, index) => {
						var Prowlist = {}

						var Postproportions = []
						var Postavg

						var options = itemQS.options
						var ASsum = 0            //答案数
						var PRsum = 0			 //总分
						options.forEach( (itemOT, index) => {
						
							var answers= itemOT.answers	
							var answersLE = answers.length
							var answersPR = answersLE * (index + 1)
							PRsum = PRsum + answersPR
							ASsum = ASsum + answersLE
						});	
						Postavg	= PRsum/ASsum

						options.forEach( (itemOT, index) => {
							var Pproportions = {}

							var answers= itemOT.answers	
							var answersLE = answers.length
							Pproportions = this.toPercent(answersLE, ASsum)		
							Postproportions.unshift(Pproportions)		
						});	

						Prowlist.content = itemQS.content
						Prowlist.avg = Postavg		
						Prowlist.proportions = Postproportions	

						Postrowlist.push(Prowlist)

					
					});	

					Pquestions.degest = itemQT.digest
					Pquestions.end = "this end"
					Pquestions.rowlist = Postrowlist

					Postquestions.push(Pquestions)
					


				});	
				post.questions = Postquestions

				console.log(post)

				download(post).then(res => {
					var blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8'}); //application/vnd.openxmlformats-officedocument.wordprocessingml.document这里表示doc类型
					var downloadElement = document.createElement('a');
					var href = window.URL.createObjectURL(blob); //创建下载的链接
					downloadElement.href = href;
					downloadElement.download ='调查问卷结果.doc'; //下载后文件名
					// document.body.appendChild(downloadElement);
					downloadElement.click(); //点击下载
					window.URL.revokeObjectURL(href); //释放掉blob对象
		        })
			
			});

		},
		newItem() {
			this.$router.push({name: 'Edit', params: {id: 0}})
		},
		checkItem(item, index) {
			if (typeof item.checked === 'undefined') {
				Vue.set(item, 'checked', true);
				this.sels[index] = item.questionnaireid
			}else {
				if (item.checked === false) {
					item.checked = !item.checked;
					this.sels[index] = item.questionnaireid
				}
				else {
					item.checked = !item.checked;
					this.sels[index] = ''
				}
			}	
		},
		checkAll(flag) {						
				this.quList.forEach( (item, index) => {
					if (typeof item.checked === 'undefined') {
						Vue.set(item, 'checked', true);
					}
					item.checked = flag
					this.checkItem(item, index)
				});	
		},
		showPrompt(text) {
			this.promptText = text;
			this.isShowPrompt = true;
		},
		getItems() {
			getNaireList().then((res) => {
				this.quList = res.data;
			})
		},
		*deleteCheckedItems() {
			yield this.showPrompt('确认要删除所选问卷？');
			var ids = this.sels.toString();
			let para = { ids: ids };
			removeNaires(para).then((res) => {
				this.getItems()
			});	
		},
		*editItem(item) {
			yield this.$router.push({name: 'Edit', params: {id: item.questionnaireid}});
		}
	},

	computed: {
		isCheckedAll() {
			return this.quList.every( item => item.checked);
		}
	},
}
</script>

<style scoped lang="scss">
@import '../style/_List.scss';
@import '../style/_Edit';
</style>
