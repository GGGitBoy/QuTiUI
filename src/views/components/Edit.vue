<template>
	<div class="container">
		<div class="qu-wrap">
			<header>
				<router-link tag="span" to="/questionNaire">&lt; 返回</router-link>
							<p v-show="!titleEditing" @click="titleEditing = true">{{ tempTitle }}</p>
							<input type="text"
							v-focus
							v-model="title"
							:class="{inlineShow: titleEditing}"
							@focus="_title = title"
							@blur="titleEditing = false">
			
					<!-- <el-row class="qu-wrap-header">
						<el-col :span="2">
							<label>作者:</label>
                        </el-col>
						<el-col :span="6">
							<p v-show="!authorEditing" @click="authorEditing = true">{{ tempAuthor }}</p>
							<input type="text"
							v-focus
							v-model="author"
							:class="{inlineShow: authorEditing}"
							@focus="_author = author"
							@blur="authorEditing = false">
                        </el-col>
						<el-col :span="2">
							<label>问卷号:</label>
                        </el-col>
						<el-col :span="6">
							<p v-show="!questionnairenumberEditing" @click="questionnairenumberEditing = true">{{ tempQuesNum }}</p>
							<input type="text"
							v-focus
							v-model="questionnairenumber"
							:class="{inlineShow: questionnairenumberEditing}"
							@focus="_questionnairenumber = questionnairenumber"
							@blur="questionnairenumberEditing = false">
                        </el-col>
						<el-col :span="2">
							<label>导航图:</label>
                        </el-col>
						<el-col :span="6">
							<p></p>
							<input type="text"
							v-focus
							v-model="image">
                        </el-col>
					</el-row> -->
			</header>

			<div class="qu-content">
				<section class="qu-item"
				v-for="(item, index) in questions"
				:class="{nowEditing: curIndex === index && topicEditing, optEditing: curIndex === index}" :key="index">
					<h3 @click="curIndex = index; curOptIndex=''; topicEditing = true">
						<span class="qu-num">{{`Q${index + 1}`}}</span>
						<span class="qu-topic">{{ item.content }}</span>
						<input type="text"
						v-focus
						v-model="item.content"
						@blur="doneTopicEdit(index)">
						<span v-if="item.isMandatory"> *</span>
					</h3>
					<template v-if="item.type === 'textarea'">
						<textarea rows="8" cols="80"></textarea>
						<label id="require-check">
							<input type="checkbox"
							v-model:checked="item.isMandatory">
							此题是否必填
						</label>
					</template>
                    <template v-if="item.type === 'score'">
						<label id="require-check">
							<input type="checkbox"
							v-model:checked="item.isMandatory">
							此题是否必填
						</label>
						<el-row v-for="(question, quesIndex) in item.quess" :key="quesIndex">
							<el-col :span="10">
								<textarea rows="3" cols="80" v-model="question.content"></textarea>
                        	</el-col>
							<el-col :span="14">
								<el-rate 
									style="text-align: center;padding-top: 45px;"
                               		id = "el-rate"
									show-text
									:colors="['#99A9BF', '#F7BA2A', '#FF9900']">
								</el-rate>
							</el-col>
						</el-row>
					</template>
					<ul v-else class="options-list" >
						<li v-for="(option, optIndex) in item.options"
							:class="{optionEditing: curOptIndex === optIndex}" :key="optIndex">
							<span class="optionText"
								  @click="curIndex=index; curOptIndex=optIndex; topicEditing = false">{{ option }}</span>
							<input type="text"
							v-focus
							v-model="optionText"
							@focus="_optionText = optionText"
							@blur="curIndex=''; optionText=''"
							@keyup.esc="cancelOptionEdit()"
							@keyup.enter="doneOptionEdit(index, optIndex)">

							<ul class="opt-ctrl">
								<li v-if="optIndex !== 0"
								@click="moveUp(optIndex, item.options)">上移</li>
								<li v-if="optIndex !== item.options.length - 1"
								@click="moveDown(optIndex, item.options)">下移</li>
								<li v-else @click="addOption(item.options)">添加</li>
								<li @click="delOption(optIndex, item.options)">删除</li>
							</ul>
						</li>
					</ul>
					<ul class="operat-list">
						<li v-if="index !== 0" @click="moveUp(index)">上移</li>
						<li v-if="index !== questions.length - 1" @click="moveDown(index)">下移</li>
						<li @click="reuse(index)">复用</li>
						<li @click="delQuestion(index)">删除</li>
						<li v-if="item.type === 'score'" @click="addQuestion(item, index)">添加</li>
					</ul>
	
				</section>
				<div class="add-box">
					<p class="qu-type" :class="{expand: isAdding}">
						<span @click="addType('radio')">单选题</span>
						<span @click="addType('checkbox')">多选题</span>
						<span @click="addType('textarea')">文本题</span>
                        <span @click="addType('score')">评分题</span>
					</p>
					<p class="add-btn" @click="isAdding = !isAdding;">
						<span>+ 添加问题</span>
					</p>
				</div>
			</div>
			<footer>
				<el-button  size="small" @click="timeSet()" >{{setTimeValue}}</el-button>
				<div class="date-part" v-if="setTime">
				

    			<span class="demonstration">定时</span>
					<el-date-picker
						v-model="datetime"
						type="date"
						placeholder="选择日期">
					</el-date-picker>
					<el-time-picker
						is-range
						v-model="time"
						range-separator="至"
						start-placeholder="发布时间"
						end-placeholder="截至时间"
						placeholder="选择时间范围">
					</el-time-picker>
				</div>
				<div class="ctrl-part">
					<span @click="iterator = saveBtn(); iterator.next()">保存问卷</span>
					<span @click="iterator = releaseBtn(); iterator.next()">发布问卷</span>
				</div>
			</footer>
	</div>
	<div class="overlay" v-show="isShowPrompt">
		<div class="prompt-box">
			<header>
				<span>提示</span>
				<a href="javascript:;" @click="isShowPrompt = false">&times;</a>
			</header>
			<p>{{ promptText }}</p>
			<footer>
				<span @click="isShowPrompt = false; iterator && iterator.next()">确定</span>
				<span @click="isShowPrompt = false">取消</span>
			</footer>
		</div>
	</div>
</div>
</template>

<script>
import Data from '../data.js';
import Store from '../store.js';
import Datepicker from './Datepicker.vue';
import util from '../../common/js/util'

import { getNaire, saveNaire, updateNaire } from '../../api/api';

export default {
	name: 'Edit',
	components: {
		'date-components': Datepicker
	},
	data() {
		return {
			index: '',
			quData: {},
			questions: [],
			questionTemplate:{},
			title: '',
			_title: '',
			digest: '',
			_digest: '',
			questionnairenumber: '',
			questionnairenumber: '',
			author: '',
			_author: '',
			image: '',
			image: '',
			content: '',
			_topic: '',
			optionText: '',
			_optionText: '',
			curIndex: '',
			curOptIndex: '',
			promptText: '',
			iterator: {},
			isAdding: false,
			titleEditing: false,
			digestEditing: false,
			authorEditing: false,
			questionnairenumberEditing: false,
			topicEditing: false,
			isShowPrompt: false,
			isShowDatepicker: false,

			datetime: '',
			time: '',
			setTime: false,
			setTimeValue: "设置定时时间",
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
	},

	computed: {
		tempTitle() {
			return this.title || this.quData.title;
		},
		tempAuthor() {
			return this.author || this.quData.author;
		},
		tempQuesNum() {
			return this.questionnairenumber || this.quData.questionnairenumber;
		}
	},

	methods: {
		timeSet() {
			var set = this.setTime
			if(set) {
				this.setTimeValue = "设置定时时间"
				this.setTime = !set
				this.datetime = ''
				this.time =''
			} else {
				this.setTimeValue = "取消定时"
				this.setTime = !set
			}
		},
		getData() {
			let id = this.$route.params.id;
			if (id === 0) {
				let item = {};
				item.title = `请输入问卷标题`;
				item.author = 'admin';
				item.questionnairenumber = '20190707543';
				item.state = 0;
				item.status = '未发布';
				item.questions = [];
				this.quData = item;

				this.author = this.quData.author;
				this.questionnairenumber = this.quData.questionnairenumber;
				this.index = this.quData.id - 1;
				this.questionTemplate = Data.template;

			} else {
				let para = {
					id: id,
				};
				getNaire(para).then((res) => {
					this.quData = res.data;		
					this.questions = this.quData.questions;		

					this.title = this.quData.title;
					this.author = this.quData.author;
					this.questionnairenumber = this.quData.questionnairenumber;
					this.index = this.quData.id - 1;
					this.questionTemplate = Data.template;

					if(this.quData.starttime != null){
						this.setTimeValue = "取消定时"
						this.setTime = !this.setTime

						this.datetime =  util.formatDate.format(new Date(this.quData.starttime), 'yyyy-MM-dd')

						var timeSet = []
						timeSet.push(util.stringToDate(this.quData.starttime))
						timeSet.push(util.stringToDate(this.quData.endtime))
						this.time =  timeSet
					}
				})
			}
		},


		cancelTitleEdit() {
			this.titleEditing = false;
			this.authorEditing = false;
			this.questionnairenumberEditing = false;
			this.title = this._title;
			this.author = this._author;
			this.questionnairenumber = this._questionnairenumber;
		},

		cancelOptionEdit() {
			this.curOptIndex = '';
			this.optionText = this._optionText;
		},

		doneTopicEdit(index) {
			this.topicEditing = false;
		},

		doneOptionEdit(index, optIndex) {
			this.curOptIndex = '';
			this.questions[index].options[optIndex] = this.optionText;
		},

		switchItem(index, array) {
			this.optIndex = '';
			this.curIndex = '';

			let arr = array.splice(index, 2);
			array.splice(index , 0, ...arr.reverse());
		},

		moveUp(index, array) {
			this.switchItem(index - 1, array);
		},

		moveDown(index, array) {
			this.switchItem(index, array);
		},

		addQuestion(item, index) {
			var Quess = item.quess 
			var site = Quess.length + 1
			Quess.push({ "type": "notscore", 
						 "site": site,
									"options": [
										{
											"type": "notscore", 
											"optionscontent": "选项一",
											"site": 1
										},
										{
											"type": "notscore", 
											"optionscontent": "选项二",
											"site": 2
										},
										{
											"type": "notscore", 
											"optionscontent": "选项三",
											"site": 3
										},
										{
											"type": "notscore", 
											"optionscontent": "选项四",
											"site": 4
										},
										{
											"type": "notscore", 
											"optionscontent": "选项五",
											"site": 5
										},

									] 
								})
					
		},

		errorPrompt(text) {
			this.iterator = null;
			this.showPrompt(text);
		},

		reuse(index) {
			if (this.questions.length === 10) {
				this.errorPrompt(`每份问卷至多10个问题！`);
				return;
			}
			let oldQuestion = this.questions[index];
			let newQuestion = JSON.parse(JSON.stringify(oldQuestion));
			this.questions.splice(index, 0, newQuestion);
		},

		delQuestion(index) {
			if (this.questions.length <= 1) {
				this.errorPrompt(`每份问卷至少一个问题！`);
				return;
			}
			this.questions.splice(index, 1);
		},

		delOption(index, options) {
			if (options.length <= 2) {
				this.errorPrompt(`每个问题至少两个选项`);
				return;
			}
			options.splice(index, 1)
		},

		addOption(options) {
			if (options.length === 4) {
				this.errorPrompt(`每个问题至多四个选项`);
				return;
			}
			options.push(`请编辑选项内容`)
		},

		showPrompt(text) {
			this.promptText = text;
			this.isShowPrompt = true;
		},

		addType(type) {
			switch(type){
				case "radio":
					this.questions.push({	"type": "radio",  "content": "单选题",   "options": ["选项1","选项2","选项3","选项4"]	});
					break;
				case "checkbox":
					this.questions.push({	"type": "checkbox",  "content": "多选题",   "options": ["选项1","选项2","选项3","选项4"]	});
					break;
				case "textarea":
					this.questions.push({	"type": "textarea",  "content": "文本题",  "isMandatory": false		});
					break;
				case "score":
					var site = this.questions.length + 1
					this.questions.push({	
						"type": "score",  
						"content": "输入题目",  
						"isMandatory": false, 		
						"site": site,
						"quess": [
								{ 	"type": "notscore", 
									"site": 1,
									"options": [
										{
											"type": "notscore", 
											"optionscontent": "选项一",
											"site": 1
										},
										{
											"type": "notscore", 
											"optionscontent": "选项二",
											"site": 2
										},
										{
											"type": "notscore", 
											"optionscontent": "选项三",
											"site": 3
										},
										{
											"type": "notscore", 
											"optionscontent": "选项四",
											"site": 4
										},
										{
											"type": "notscore", 
											"optionscontent": "选项五",
											"site": 5
										},

									] 
								}
							]	
						});
					break;	
			}	
		},

		saveData() {		
			var date = util.formatDate.format(new Date(this.datetime), 'yyyy-MM-dd')
			var start = util.formatDate.format(new Date(this.time[0]), 'hh:mm:ss')
			var end = util.formatDate.format(new Date(this.time[1]), 'hh:mm:ss')
			var startTime = date + " " + start
			var endTime = date + " " + end

			if(this.setTime){
				if((this.datetime = "" ) || (this.time == "") || (this.datetime == null ) || (this.time == null)){	

					this.$alert('设置的时间不能为空', '保存错误', {
						confirmButtonText: '确定',
					});
					return
				}	

				if(this.quData.status = '发布中'){
					let nowTime = new Date()	
					let starttime = new Date(this.quData.starttime)
					let endtime = new Date(this.quData.endtime)

					console.log(starttime.getTime() - nowTime.getTime())
					console.log(endtime.getTime() - nowTime.getTime())
					
					if ((starttime.getTime() - nowTime.getTime())>0 && (endtime.getTime() - nowTime.getTime())>0){
						this.quData.status = '定时发布';
					} else {
						this.$alert('时间设置错误', '发布错误', {
							confirmButtonText: '确定',
						});
						return
					}	
				}			
			}

			this.quData.starttime = util.stringToDate(startTime)
			this.quData.endtime = util.stringToDate(endTime)

			if (this.questions.length < 1) {
				this.$alert('每份问卷至少一个问题', '保存错误', {
					confirmButtonText: '确定',
				});
				return
			}

			if (this.title == '') {
				this.$alert('标题不能为空', '保存错误', {
					confirmButtonText: '确定',
				});
				return
			}

			this.quData.title = this.title;
			this.quData.author = this.author;
			this.quData.questions =  [...this.questions]

	
			if(this.quData.questionnaireid == null){
				 saveNaire(this.quData).then((res) => {
					this.$router.push({path: '/questionNaire'});
				})
			} else {
				 updateNaire(this.quData).then((res) => {
					this.$router.push({path: '/questionNaire'});
				})
			}

           
		},

		*backBtn() {
			yield this.$router.push({path: '/questionNaire'});
		},

		*saveBtn() {
			yield this.showPrompt(`确认要保存问卷？`);
			yield this.saveData();
		},

		*releaseBtn() {
			yield this.showPrompt(`确认要保存并发布问卷？`);
			yield (() => {
				this.quData.status = '发布中';
				this.saveData();	
			})();
			yield this.$router.push({path: '/questionNaire'});
		}
	},

	directives: {
		focus: {
			update: el => el.focus(),
		}
	},

	watch: {
	}
}

</script>

<style scoped lang="scss">
@import '../style/_Edit';
</style>
