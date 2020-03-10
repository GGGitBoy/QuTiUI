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
					<el-button type="primary" @click="newItem()">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="naires" highlight-current-row v-loading="listLoading"  @selection-change="selsChange" style="width: 100%;" :border="true">
			<el-table-column type="selection" width="55" align="center">
			</el-table-column>
			<el-table-column type="index" width="60" align="center">
			</el-table-column>
            <el-table-column prop="questionnairenumber" label="问卷号" width="180" align="center">
			</el-table-column>
            <el-table-column prop="title" label="标题" width="220" align="center">
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
             <el-table-column prop="status" label="状态" width="160"  align="center">
				<template scope="scope">
                        <span v-if="scope.row.status == '未发布'">{{scope.row.status}}</span>
                        <span v-else style="color: red">{{scope.row.status}}</span>
               </template>
			</el-table-column>
			<el-table-column prop="savetime" label="创建时间" width="160" sortable align="center">
			</el-table-column>
			<el-table-column prop="changetime" label="修改时间" width="160" sortable align="center">
			</el-table-column>
			<el-table-column label="操作" width="480" fixed="right" align="center">
				<template scope="scope">
					<el-button v-if="scope.row.status == '发布中' || scope.row.status == '已结束'" 
					size="small" @click="dataItem(scope.row.questionnaireid)">查看数据</el-button>

					<el-button size="small" @click="previewItem(scope.row.questionnaireid)">问卷预览</el-button>

					<el-button v-if="scope.row.status == '未发布'" size="small" @click="editItem(scope.row)">编辑</el-button>
					<el-button v-if="scope.row.status == '未发布'" size="small" @click="changestatus(scope.row, '发布中')">发布</el-button>

					<el-button v-if="scope.row.status == '发布中'" size="small" @click="changestatus(scope.row, '未发布')">终止发布</el-button>
					<el-button v-if="scope.row.status == '发布中'" size="small" @click="changestatus(scope.row, '已结束')">结束调查</el-button>

					<el-button v-if="scope.row.status == '已结束'" size="small" @click="downLoadWord(scope.row)">结果下载</el-button>
					<el-button v-if="scope.row.status == '已结束'" size="small" @click="onlinePrint()">在线打印</el-button>
					<el-button v-if="scope.row.status == '已结束'" size="small" @click="changestatus(scope.row, '发布中')">重新发布</el-button>

				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination  layout="total, sizes, prev, pager, next" 
							@size-change="handleSizeChange"
							@current-change="handleCurrentChange"
							:page-size="2" 
							:page-sizes="[10, 20, 50]" 
							:total="total" 
							style="float:right;">
			</el-pagination>
		</el-col>


	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { batchRemoveNaire, getNaireListPage, changeStatus, updateNaireStatue, download, getNaireTotalDetail    } from '../../api/api';

	export default {
		data() {
			return {
				sels: [],//列表选中列

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
					status: "",
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
					status: ""
				},
			}
		},
		methods: {
			onlinePrint() {
			var yuming = "http://waixingren.online/resource/wordresource/template.doc"			
				// 不是pdf格式
				window.open(
					"https://view.officeapps.live.com/op/view.aspx?src=" + yuming,
					"_blank"
				);
			},
			dataItem(id) {
				this.$router.push({name: 'Data', params: {id: id}});
			},
			previewItem(id) {
				this.$router.push({name: 'Fill', params: {id: id}});
			},
			editItem(item) {
				this.$router.push({name: 'Edit', params: {id: item.questionnaireid}});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.questionnaireid).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { ids: ids };
					batchRemoveNaire(para).then((res) => {
						this.listLoading = false;
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			newItem() {
				this.$router.push({name: 'Edit', params: {id: 0}})
			},
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
					console.log(res.data.rows)
					this.listLoading = false;
				});
			},
			changestatus(item, status) {	
				let para = {
					id: item.questionnaireid,
					status: status,
				};	
				updateNaireStatue(para).then((res) => {
					this.getNaire();
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
			toPercent(num, total) { 
				return (Math.round(num / total * 10000) / 100.00 + "%");// 小数点后两位百分比
			},
		},
		mounted() {
			let curTime = Date.now();
			this.getNaire();
		},
	}

</script>

<style scoped>
	.el-table tr td.developing{
      background: #FFE4B5;
      opacity:0.9;
    }
    .el-table tr td.testing{
      background: #FFA500;
      opacity:0.9;
    }
    .el-table tr td.publishing{
      background: #87CEFA;
      opacity:0.9;
    }
    .el-table tr td.published{
      background: #9ACD32;
      opacity:0.9;
    }

</style>