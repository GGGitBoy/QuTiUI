<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-button type="primary" @click="resetSearch">重置查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.questionnairenumber" placeholder="问卷号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.title" placeholder="标题"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getNaire">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="naires" highlight-current-row v-loading="listLoading" style="width: 100%;" :border="true">
			<el-table-column type="index" width="60" align="center">
			</el-table-column>
            <el-table-column prop="questionnairenumber" label="问卷号" width="180" align="center">
			</el-table-column>
            <el-table-column prop="title" label="标题" width="220" align="center">
			</el-table-column>
			<el-table-column prop="secondtitle" label="第二标题" width="220"  align="center">
			</el-table-column>
			<el-table-column prop="image" label="导航图" width="180"  align="center">
				<template  slot-scope="scope">            
					<img :src="scope.row.image"   width="150" height="100" />
				</template>
			</el-table-column>
            <el-table-column prop="author" label="作者" width="160"  align="center">
			</el-table-column>
            <el-table-column prop="click" label="填写数" width="160"  align="center">
			</el-table-column>
            <el-table-column prop="digest" label="摘要" width="500"  align="center">
			</el-table-column>
             <el-table-column prop="status" label="状态" width="160"  align="center">
			</el-table-column>
			<el-table-column prop="savetime" label="创建时间" width="160" sortable align="center">
			</el-table-column>
			<el-table-column prop="changetime" label="修改时间" width="160" sortable align="center">
			</el-table-column>
			<el-table-column label="操作" width="240" fixed="right" align="center">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button size="small">预览</el-button>
					<el-button type="danger" size="small" @click="handleStatus(scope.$index, scope.row)">发布</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination  layout="total, sizes, prev, pager, next" 
							@size-change="handleSizeChange"
							@current-change="handleCurrentChange"
							:page-size="2" 
							:page-sizes="[10, 20, 50]" 
							:total="total" 
							style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">

				<el-form-item>
					<label style="font-size: 22px; font-weight: 1000;">问卷基本信息</label>
				</el-form-item>
				<el-form-item label="问卷号" prop="questionnairenumber">
					<el-input v-model="editForm.questionnairenumber" :disabled="true" style=" width: 200px;"></el-input>
				</el-form-item>
				<el-form-item label="导航图" prop="image">
					<el-upload
						ref="upload"
						action="./Upload/image.action"			
						name="picture"
						list-type="picture"
						:disabled="hasUpload"
						:limit="1"
						:file-list="myFileList"
						:before-upload="beforeUpload"
						:on-exceed="handleExceed"
						:on-success="successUpload"
						:on-preview="handlePictureCardPreview">
						<el-button slot="trigger" type="primary">选取文件</el-button>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible" append-to-body>
						<img  width="100%" height="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
				</el-form-item>
				<el-form-item label="发布者" prop="author">
					<el-input v-model="editForm.author" style=" width: 200px;"></el-input>
				</el-form-item>
				<el-form-item label="填写数" prop="click">
					<el-input v-model="editForm.click" :disabled="true" style=" width: 100px;"></el-input>
				</el-form-item>


				<el-form-item>
					<label  style="font-size: 22px; font-weight: 1000;">问卷详情</label>
				</el-form-item>	
				<el-form-item label="标题" prop="title">
					<el-input v-model="editForm.title"></el-input>
				</el-form-item>
				<el-form-item label="副标题" prop="secondtitle">
					<el-input v-model="editForm.secondtitle"></el-input>
				</el-form-item>	
				<el-form-item label="摘要" prop="digest">
					<el-input type="textarea" v-model="editForm.digest"></el-input>
				</el-form-item>

				<el-form-item
					v-for="(item, index) in questionGroupList"
					:label="'问题组' + (index + 1)"
					:key="index">
					<el-form-item>
						<el-col :span="4"><el-button @click.prevent="DeleteQuestionGroup(item)" type="danger">删除该问题组</el-button></el-col>	
						<el-col :span="20"><el-input v-model="item.content" placeholder="请输入问题组标题"></el-input></el-col>	
					</el-form-item>

					<el-form-item
						style="padding-top: 20px;"
						v-for="(i, indexQ) in questionGroupList[index].questionList"
						:label="'问题' + (indexQ + 1)"
						:key="indexQ">
						<el-row :span="11">
							<el-col :span="20"><el-input  v-model="i.content"></el-input></el-col>
							<el-col :span="2" style="text-align: center">-</el-col>
							<el-col :span="2"><el-button @click.prevent="DeleteQuestion(i, questionGroupList[index].questionList)" type="danger">删除</el-button></el-col>
						</el-row>

						<el-row v-if="i.questiontypenumber == '评分题'" :span="11" style=" padding: 20px;">
							<el-col :span="4" style="text-align: center;"><el-button type="info" plain @click.prevent="i.optionsList = DeleteOptions(i.optionsList)">减少</el-button></el-col>
							<el-col :span="10" style="text-align: center; padding-top: 10px;">
								<el-rate
									v-model="i.key"
									show-text
									:max="i.optionsList.length"
									:texts="rate.texts"
									:colors="['#99A9BF', '#F7BA2A', '#FF9900']">
								</el-rate>
							</el-col>
							<el-col :span="4" style="text-align: center;"><el-button type="primary" plain @click.prevent="i.optionsList = AddOptions(i.optionsList, i.questionnumber,  i.questiontypenumber)">增加</el-button></el-col>
						</el-row>	

						<el-row v-if="i.questiontypenumber == '单选题'" :span="11" style=" padding: 20px;">
							<el-col :span="4" style="text-align: center;"><el-button type="info" plain @click.prevent="i.optionsList = DeleteOptions(i.optionsList)">减少</el-button></el-col>
							<el-col :span="10" style="text-align: center; padding-top: 10px;">
								<el-radio-group  v-for="(i, index) in i.optionsList" :key='index'>
									<el-radio :label="index" style="padding-right: 20px;">{{i.optionscontent}}</el-radio>
								</el-radio-group>
							</el-col>
							<el-col :span="4" style="text-align: center;"><el-button type="primary" plain @click.prevent="i.optionsList = AddOptions(i.optionsList, i.questionnumber, i.questiontypenumber)">增加</el-button></el-col>
						</el-row>	

						<el-row v-if="i.questiontypenumber == '多选题'" :span="11" style=" padding: 20px;">
							<el-col :span="4" style="text-align: center;"><el-button type="info" plain @click.prevent="i.optionsList = DeleteOptions(i.optionsList)">减少</el-button></el-col>
							<el-col :span="10" style="text-align: center; padding-top: 10px;">
								<el-checkbox-group v-model="checkList">
									<el-checkbox  v-for="(i, index) in i.optionsList" :key='index' :label="i.optionscontent"></el-checkbox>
								</el-checkbox-group>
							</el-col>
							<el-col :span="4" style="text-align: center;"><el-button type="primary" plain @click.prevent="i.optionsList = AddOptions(i.optionsList, i.questionnumber, i.questiontypenumber)">增加</el-button></el-col>
						</el-row>

						<el-row v-if="i.questiontypenumber == '填空题'" :span="24">
							<el-col :span="20">
								<template v-for="(i, index) in i.optionsList">
									<el-input :key='index' :disabled="true" v-model="i.optionscontent" style="padding-top: 10px;"></el-input>
									<el-input type="textarea" :key='"textarea"+index'></el-input>						
								</template>						
							</el-col>

						</el-row>

						<el-row  style="text-align: center;">
							<el-col :span="18">
								<template v-for="(item, index) in i.optionsList">
									<el-input :key="index" style=" width: 100px; padding: 10px;" v-model="item.optionscontent" :placeholder="'选项' + (index + 1)"></el-input>
								</template>
							</el-col>
						</el-row>			
					</el-form-item>

					<el-form-item style="padding: 20px;">
						<el-col :span="4" style="text-align: center;"><el-button type="success" plain  @click.native="item.questionList = AddQuestion(item.questionList, item.questiongroupnumber)">添加问题</el-button></el-col>
						<el-col :span="6" style="text-align: center;">
							<el-select v-model="filters.questiontypenumber" placeholder="选择问题类型">
								<el-option
									v-for="item in questiontypenumber"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-col>	
					</el-form-item>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" plain style="width: 30%;" @click.native="AddQuestionGroup">添加问题组</el-button>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getNaireListPage, changeStatus, editNaire, addNaire, editQuestion, addQuestion, findQuestionGroupNum, removeQuestion, addOptions, editOptions, removeOptions, addQuestionGroup, editQuestionGroup, removeQuestionGroupdelete } from '../../api/api';

	export default {
		data() {
			return {
				checkList: [],
				questiontypenumber: [  
					{ value: '评分题',label: '评分题' },
					{ value: '单选题',label: '单选题' },
					{ value: '多选题',label: '多选题' },
					{ value: '填空题',label: '填空题' },
				],
				rate: {
					texts: ['无关联', '失望', '一般', '满意', '非常关联'],
				},
				questionGroupList: [],
				filters: {
					title: '',
					questionnairenumber: '',
					status: 1,
					questiontypenumber: '评分题',
				},
				myFileList:[],
				hasUpload: false,
				dialogImageUrl: '',
      			dialogVisible: false,
				naires: [],
				total: 0,
				rows: 20,
				page: 1,
				listLoading: false,

				Optionsdelete: [],
				Questiondelete: [],
				QuestionGroupdelete: [],

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					title: [
						{ required: true, message: '请输入标题', trigger: 'blur' }
					]
				},

				//编辑界面数据
				editForm: {
					questionnaireid: null,
					questionnairenumber: '',
					title: '',
					secondtitle: '',
					image: '',
					author: '',
					click: '',
					digest: '',
					status: 1
				},
			}
		},
		methods: {
			DeleteQuestionGroup(item) {
				var index = this.questionGroupList.indexOf(item)
				if (index !== -1) {
					if(item.questiongroupid != null){
						this.QuestionGroupdelete.push(item.questiongroupid)
					}	
					this.questionGroupList.splice(index, 1)
				}
			},
			AddQuestionGroup() {
				let date = new Date();		
				let questiongroupnumber = ''  + date.getMinutes() + date.getSeconds() + date.getFullYear() + ( date .getMonth() + 1 ) + date.getDate() + date.getHours()
				this.questionGroupList.push(
					{
						questiongroupid: null,
						questiongroupnumber: questiongroupnumber,
						questionnairenumber: this.editForm.questionnairenumber,
						content: '',
						orderNum: this.questionGroupList.length,
						questiongrouptype: '',
						questionList: [],
					}
				)
			},
			AddOptions(optionsList, number, typenumber) {
				if( optionsList.length < 10){
					optionsList.push(
						{
							optionsid: null,
							optionscontent: '',
							questionnumber: number,
							optionstypenumber: typenumber,
							orderNum: optionsList.length,
						}
					)
				}else{
					this.$message.error('选项个数为 10 之内');
				}		
				return optionsList

			},
			DeleteOptions(optionsList) {
				if (optionsList.length > 0) {
					const sliceArr = optionsList.slice((optionsList.length - 1), optionsList.length)
					if(sliceArr[0].optionsid != null){
						this.Optionsdelete.push(sliceArr[0].optionsid)
					}
					optionsList.splice((optionsList.length - 1), 1)
				}else{
					this.$message.error('选项个数应大于 0 ');
				}		
				return optionsList
					
			},
			DeleteQuestion(item, questionList) {
				var index = questionList.indexOf(item)
				if (index !== -1) {
					if(item.questionid != null){
						this.Questiondelete.push(item.questionid)
					}	
					questionList.splice(index, 1)
				}
			},
			AddQuestion(questionList, questiongroup) {
				let date = new Date();		
				let questionnumber = '' + date.getSeconds() + date.getFullYear() + ( date .getMonth() + 1 ) + date.getDate() + date.getHours() + date.getMinutes()
				let optionsList = []
				if(this.filters.questiontypenumber == "填空题"){
					optionsList = [{
						optionsid: null,
						optionscontent: '',
						questionnumber: questionnumber,
						optionstypenumber: this.filters.questiontypenumber,
						orderNum: 0,
					}]
				}
				questionList.push(
					{
						questionid: null,
						questionnumber: questionnumber,
						content: '',
						digest: '',
						questiongroup: questiongroup,
						questiontypenumber: this.filters.questiontypenumber,
						orderNum: questionList.length,
						optionsList: optionsList,
					}
				)
				
				return questionList
			},
			handleStatus(index, row) {
				this.$confirm('确认发布吗?', '提示', {}).then(() => {
					let para = Object.assign({}, row)
					para.status = 2
					
					changeStatus(para).then((res) => {
						this.$message({
							message: '问卷发布成功',
							type: 'success'
						});
						this.getNaire();
					});
				})	
			},
			handleExceed(files, fileList) {
				this.$message.warning("要重新上传，请先删除原有图片")
			},
			successUpload(response, file, fileList){
				this.editForm.image = response
			},
			beforeUpload(file){
				const isJPG = (file.type === 'image/jpeg') || (file.type === 'image/png');
      			const isLt5M = file.size / 1024 / 1024 < 5;

				if (!isJPG) {
					this.$message.error('上传头像图片只能是 JPG,PNG 格式!');
				}
				if (!isLt5M) {
					this.$message.error('上传头像图片大小不能超过 5MB!');
				}
				return isJPG && isLt5M;
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			handleSizeChange(val) {
				this.rows = val;
				this.getNaire();
     		},
			handleCurrentChange(val) {
				this.page = val;
				this.getNaire();
			},
			resetSearch(){
				this.filters.title = ''
				this.filters.questionnairenumber = ''
				this.getNaire()
			},
			//获取用户列表
			getNaire() {
				let para = {
					filtersStatus: this.filters.status,
					filtersQuestionnairenumber: this.filters.questionnairenumber,
					filtersTitle: this.filters.title,
					page: this.page,
					rows: this.rows,	
				};
				this.listLoading = true;
				getNaireListPage(para).then((res) => {
					this.total = res.data.total;
					this.naires = res.data.rows;
					this.listLoading = false;
				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.Questiondelete = [],
				this.Optionsdelete = [],
				this.QuestionGroupdelete = [],
				this.editFormVisible = true;
				this.questionGroupList = []
				this.editForm = Object.assign({}, row);		
				this.myFileList = [{
					name: this.editForm.title,
					url:  this.editForm.image
				}];
				let para = {
					num: this.editForm.questionnairenumber,
				};
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
			},
			//显示新增界面
			handleAdd: function () {
				this.editFormVisible = true;
				this.myFileList = [];
				this.questionGroupList = []

				let date = new Date();		
				let questionnairenumber = '' + date.getFullYear() + ( date .getMonth() + 1 ) + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds()

				this.editForm = {
					questionnaireid: null,
					questionnairenumber: questionnairenumber,
					title: '',
					secondtitle: '',
					image: '',
					author: '',
					click: '',
					digest: '',
					status: 1
				};
			},
		
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let para = Object.assign({}, this.editForm);
							if(para.questionnaireid!=null){//如果有ID
								editNaire(para).then((res) => {
									editQuestionGroup(this.questionGroupList).then((res) => {
										for(let i=0; i < this.questionGroupList.length; i++){	
											editQuestion(this.questionGroupList[i].questionList).then((res) => {
												for(let j=0; j < this.questionGroupList[i].questionList.length; j++){	
													editOptions(this.questionGroupList[i].questionList[j].optionsList)
												}	
											})	
										}	
										if(this.Optionsdelete != ''){
											removeOptions({ ids: this.Optionsdelete.map(item => item).toString() })
										}
										if(this.Questiondelete != ''){	
											removeQuestion({ ids: this.Questiondelete.map(item => item).toString() })
										}
										if(this.QuestionGroupdelete != ''){
											removeQuestionGroupdelete({ ids: this.QuestionGroupdelete.map(item => item).toString() })	
										}
										this.editLoading = false;
										this.$message({
											message: '提交成功',
											type: 'success'
										});
										this.$refs['editForm'].resetFields();
										this.editFormVisible = false;
										this.getNaire();
									})							
								});
							}else{
								addNaire(para).then((res) => {
									addQuestionGroup(this.questionGroupList).then((res) => {
										for(let i=0; i < this.questionGroupList.length; i++){	
											addQuestion(this.questionGroupList[i].questionList).then((res) => {
												for(let j=0; j < this.questionGroupList[i].questionList.length; j++){	
													addOptions(this.questionGroupList[i].questionList[j].optionsList)
												}	
											})	
										}	
										this.editLoading = false;
										this.$message({
											message: '提交成功',
											type: 'success'
										});
										this.$refs['editForm'].resetFields();
										this.editFormVisible = false;
										this.getNaire();		
									})		
								});	
							}	
						});
					}
				});
			},
		},
		mounted() {
			this.getNaire();
		}
	}

</script>

<style scoped>

</style>