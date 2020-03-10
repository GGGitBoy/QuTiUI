<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-button type="primary" @click="resetSearch">重置查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.major" placeholder="选择专业">
						<el-option
							v-for="item in major"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.graduationyear" placeholder="选择毕业年份">
						<el-option
							v-for="item in graduationyear"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="excelVisible = true;">批量导入</el-button>
				</el-form-item>	
				<el-form-item>
					<el-button type="primary" @click="excelTemplate()">批量导入模板</el-button>
				</el-form-item>	
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" :border="true">
			<el-table-column type="selection" width="55" align="center">
			</el-table-column>
			<el-table-column type="index" width="60" align="center">
			</el-table-column>
			<el-table-column prop="image" label="头像" width="180" align="center">
				<template  slot-scope="scope">            
                    <img :src="scope.row.icon"   width="150" height="100" />
                </template>
			</el-table-column>
			<el-table-column prop="name" label="姓名" width="100" align="center">
			</el-table-column>
			<el-table-column prop="sex" label="性别" width="100" align="center" :formatter="formatSex">
			</el-table-column>
			<el-table-column prop="studentnumber" label="学号" width="150" align="center">
			</el-table-column>
			<el-table-column prop="major" label="专业" min-width="180" align="center">
			</el-table-column>
			<el-table-column prop="username" label="用户名" width="180" align="center">
			</el-table-column>
			<el-table-column prop="nickname" label="昵称" min-width="180" align="center">
			</el-table-column>
            <el-table-column prop="graduationyear" label="毕业年份" min-width="180" align="center">
			</el-table-column>
            <el-table-column prop="correspondenceaddress" label="通讯地址" min-width="500" align="center">
			</el-table-column>
            <el-table-column prop="phone" label="手机号" min-width="180" align="center">
			</el-table-column>
            <el-table-column prop="wechat" label="微信号" min-width="180" align="center">
			</el-table-column>
            <el-table-column prop="qqnumber" label="QQ号" min-width="180" align="center">
			</el-table-column>
            <el-table-column prop="email" label="电子邮箱" min-width="220" align="center">
			</el-table-column>
            <el-table-column prop="graduationplane" label="毕业计划" min-width="100" align="center">
			</el-table-column>
            <el-table-column prop="usertypenum" label="角色类型" min-width="180" align="center">
			</el-table-column>
            <el-table-column prop="canlogin" label="能否登陆" min-width="180" align="center" :formatter="formatLogin">
			</el-table-column>
            <el-table-column prop="remark" label="备注" min-width="180" align="center">
			</el-table-column>
			<el-table-column prop="savetime" label="创建时间" width="160" sortable align="center">
			</el-table-column>
			<el-table-column prop="changetime" label="修改时间" width="160" sortable align="center">
			</el-table-column>
			<el-table-column label="操作" width="180" fixed="right" align="center">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handlePasswordVisible(scope.$index, scope.row)">修改密码</el-button>
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

		<el-dialog
			title="提示"
			:close-on-click-modal="false"
			:visible.sync="passwordVisible"
			width="30%">
			<el-input placeholder="请输入新密码" v-model="editForm.password" show-password></el-input>
			<span slot="footer" class="dialog-footer">
				<el-button @click="passwordVisible = false">取 消</el-button>
				<el-button type="primary" @click="setPassword">确 定</el-button>
			</span>
		</el-dialog>

		<el-dialog
			title="提示"
			:close-on-click-modal="false"
			:visible.sync="excelVisible"
			width="21%">
			<el-upload
				ref="upload"
						action="/api/myproject-questionnaire/Upload/excel.action"	
						drag		
						name="excel"
						:on-success="cessUpload"
						multiple>
				<i class="el-icon-upload"></i>
				<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
				<div class="el-upload__tip" slot="tip">只能上传excel文件，且不超过500kb</div>
			</el-upload>
		</el-dialog>


		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" style=" width: 150px;"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="true">男</el-radio>
						<el-radio class="radio" :label="false">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="学号">
					<el-input v-model="editForm.studentnumber" style=" width: 200px;"></el-input>
				</el-form-item>
				<el-form-item label="专业">
					<el-input v-model="editForm.major" style=" width: 200px;"></el-input>
				</el-form-item>
                <el-form-item label="毕业年份">
					<el-date-picker
						v-model="editForm.graduationyear"
						type="year"
						placeholder="选择年份">
					</el-date-picker>
				</el-form-item>
				 <el-form-item label="用户名">
					<el-input v-model="editForm.username" style=" width: 200px;"></el-input>
				</el-form-item>
                <el-form-item label="昵称">
					<el-input v-model="editForm.nickname" style=" width: 200px;"></el-input>
				</el-form-item>
                <el-form-item label="头像">

					<el-upload
						ref="upload"
						action="api/myproject-questionnaire/Upload/image.action"			
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
					<el-dialog :visible.sync="dialogVisible">
						<img  width="100%" height="100%" :src="dialogImageUrl" alt="">
					</el-dialog>

				</el-form-item>
                <el-form-item label="通讯地址">
					<el-input v-model="editForm.correspondenceaddress"></el-input>
				</el-form-item>
                <el-form-item label="手机号">
					<el-input v-model="editForm.phone" style=" width: 200px;"></el-input>
				</el-form-item>
                <el-form-item label="微信号">
					<el-input v-model="editForm.wechat" style=" width: 200px;"></el-input>
				</el-form-item>
                <el-form-item label="QQ号">
					<el-input v-model="editForm.qqnumber" style=" width: 200px;"></el-input>
				</el-form-item>
                <el-form-item label="电子邮箱">
					<el-input v-model="editForm.email" style=" width: 200px;"></el-input>
				</el-form-item>
                <el-form-item label="毕业计划">
					<el-col :span="12">
						<el-radio-group v-model="editForm.graduationplane" @change="graduationplaneChange">
							<el-radio class="radio" label="求职">求职</el-radio>
							<el-radio class="radio" label="考研">考研</el-radio>
							<el-radio class="radio" label="出国">出国</el-radio>
							<el-radio class="radio" label="">其他</el-radio>						
						</el-radio-group>
					</el-col>
					<el-col :span="12">
						<el-input v-model="editForm.graduationplane" placeholder="其他（请说明，如创业中）" v-if="inputShow"></el-input>
					</el-col>		
				</el-form-item>
                <el-form-item>				
						<el-row  v-if="!inputShow">
							<label >{{planeLable}}</label>
						</el-row>
						<el-row  v-if="!inputShow">
							<el-radio-group  v-model="editForm.graduationplanesituation.detail" >
								<el-radio class="radio" label="进行中">进行中</el-radio>
								<el-radio class="radio" label="已被录用">已被录用</el-radio>
							</el-radio-group>
						</el-row>
						<el-row v-if="editForm.graduationplanesituation.detail == '已被录用'  &&  editForm.graduationplane == '求职'">
							<el-col :span="3"><label>单位名称</label></el-col>
							<el-col :span="9"><el-input v-model="editForm.graduationplanesituation.detailOne" placeholder="请输入单位名称"></el-input></el-col>
							<el-col :span="3" style="text-align:center"><label>岗位名称</label></el-col>
							<el-col :span="9"><el-input v-model="editForm.graduationplanesituation.detailSecond" placeholder="请输入岗位名称"></el-input></el-col>		
						</el-row>
						<el-row v-else-if="editForm.graduationplanesituation.detail == '已被录用' ? editForm.graduationplane == '考研' | editForm.graduationplane == '出国' : false ">
							<el-col :span="3"><label>学校名称</label></el-col>
							<el-col :span="9"><el-input v-model="editForm.graduationplanesituation.detailOne" placeholder="请输入学校名称"></el-input></el-col>
							<el-col :span="3" style="text-align:center"><label>院系所</label></el-col>
							<el-col :span="9"><el-input v-model="editForm.graduationplanesituation.detailSecond" placeholder="请输入院系所"></el-input></el-col>		
						</el-row>		
				</el-form-item>
				
				<el-form-item label="角色类型">
					 <el-select v-model="editForm.usertypenum" placeholder="请选择">
						<el-option
							v-for="item in usertype"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="能否登陆">
					<el-radio-group v-model="editForm.canlogin">
						<el-radio class="radio" :label="true">正常</el-radio>
						<el-radio class="radio" :label="false">锁定</el-radio>
					</el-radio-group>
				</el-form-item>
                 <el-form-item label="备注">
					<el-input v-model="editForm.remark"></el-input>
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
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser, changePassword } from '../../api/api';

	export default {
		data() {
			return {
				major: [  
					{ value: '物联网工程',label: '物联网工程' },
					{ value: '网络工程',label: '网络工程' },
					{ value: '软件工程',label: '软件工程' },
					{ value: '计算机科学与技术',label: '计算机科学与技术' },
				],
				graduationyear: [  
					{ value: '2016',label: '2016' },
					{ value: '2015',label: '2015' },
					{ value: '2014',label: '2014' },
				],
				usertype:[
					{	value: '管理员',label: '管理员'  }, 
					{	value: '普通用户',label: '普通用户'  }, 
					{	value: '发布者',label: '发布者'  }, 
				],	
				filters: {
					name: '',
					major: '',
					graduationyear: ''
				},
				myFileList:[],
				hasUpload: false,
				dialogImageUrl: '',
				passwordVisible: false,
				excelVisible: false,
      			dialogVisible: false,
				users: [],
				total: 0,
				rows: 20,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},

				
				inputShow: false,
				planeLable: '目前的求职情形为',
				//编辑界面数据
				editForm: {
					userid: null,
					username: '',
					password: '',
					nickname: '',
					studentnumber: '',
					major: '',
					name: '',
					sex: true,
					graduationyear: '',
					correspondenceaddress: '',
					wechat: '',
					phone: '',
					email: '',
					qqnumber: '',
					graduationplane: "求职",
					graduationplanesituation: {
						detail: '进行中',
						detailOne: '',
						detailSecond: ''
					},
					canlogin: true,
					usertypenum: "管理员",
					remark: ''
				},

			}
		},
		methods: {
			excelTemplate(){
				var yuming = "http://waixingren.online/resource/wordresource/template.xlsx"
        
				// 不是pdf格式
				window.open(
					"https://view.officeapps.live.com/op/view.aspx?src=" + yuming,
					"_blank"
				);

			},
			cessUpload(response, file, fileList){
				this.excelVisible = false
				this.getUsers();
			},
			graduationplaneChange(val){
				if(val == "求职"  ||  val == "考研"  ||  val == "出国"){
					this.inputShow = false
					this.planeLable = "目前的"+val+"情形为"
				}else{
					this.inputShow = true
					this.editForm.graduationplane = '',
					this.editForm.graduationplanesituation = {
						detail: '进行中',
						detailOne: '',
						detailSecond: ''
					}		
				}
			},
			handleExceed(files, fileList) {
				this.$message.warning("要重新上传，请先删除原有图片")
			},
			successUpload(response, file, fileList){
				this.editForm.icon = response
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
			handlePasswordVisible(index, row){
				this.passwordVisible = true;
				this.editForm = Object.assign({}, row);
				this.editForm.password = null
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			formatYear(row, column){
				var date=new Date(row.graduationyear);
 				var year=date.getFullYear(row.graduationyear); 
				return year;
			},
			formatLogin(row, column){
				return row.canlogin == 1 ? '能' : row.canlogin == 0 ? '否' : '未知';
			},
			formatSex(row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			handleSizeChange(val) {
				this.rows = val;
				this.getUsers();
     		},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			resetSearch(){
				this.filters.name = '';
				this.filters.major = '';
				this.filters.graduationyear = '';
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				let para = {
					filtersName: this.filters.name,
					filtersMajor: this.filters.major,
					filtersGraduationyear: this.filters.graduationyear,
					page: this.page,
					rows: this.rows,	
				};
				this.listLoading = true;
				getUserListPage(para).then((res) => {
					this.total = res.data.total;
					this.users = res.data.rows;
					// this.users = JSON.parse(this.users)
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
				console.log(this.editForm)
				this.myFileList = [{
					name: this.editForm.nickname,
					url:  this.editForm.icon
				}];
				if(this.editForm.graduationplane == "求职"  ||  this.editForm.graduationplane == "考研"  ||  this.editForm.graduationplane == "出国"){
					this.inputShow = false
					this.planeLable = "目前的"+this.editForm.graduationplane+"情形为"
					this.editForm.graduationplanesituation = JSON.parse(this.editForm.graduationplanesituation)
				}else{
					this.editForm.graduationplanesituation = {
						detail: '进行中',
						detailOne: '',
						detailSecond: ''
					}
					this.inputShow = true	
				}
			},
			//显示新增界面
			handleAdd: function () {
				this.editFormVisible = true;
				this.myFileList = [];
				this.editForm = {
					userid: null,
					username: '',
					password: '',
					nickname: '',
					studentnumber: '',
					major: '',
					name: '',
					sex: true,
					graduationyear: '',
					correspondenceaddress: '',
					wechat: '',
					phone: '',
					email: '',
					qqnumber: '',
					graduationplane: "求职",
					graduationplanesituation: {
						detail: '进行中',
						detailOne: '',
						detailSecond: ''
					},
					canlogin: true,
					usertypenum: "管理员",
					remark: ''
				};
				this.inputShow = false
				this.planeLable = '目前的求职情形为'
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.graduationyear = (!para.graduationyear || para.graduationyear == '') ? '' : util.formatDate.format(new Date(para.graduationyear), 'yyyy');
							if(para.userid!=null){//如果有ID
								editUser(para).then((res) => {
								this.editLoading = false;
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
								// serviceObject=usertextService.update( $scope.entity ); //修改  
							}else{
								addUser(para).then((res) => {
								this.editLoading = false;
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
								
							}	
						});
					}
				});
			},
			setPassword: function() {
				let para = Object.assign({}, this.editForm);
				if(para.password == null){
					this.$message({
							message: '密码不能为空',
							type: 'error'
						});
				}else{
					changePassword(para).then((res) => {
						this.$message({
							message: '提交成功',
							type: 'success'
						});
					this.getUsers();
					this.passwordVisible = false
					})
				}				
			},			
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.userid).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			}
		},
		excel() {
			
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>