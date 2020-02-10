<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.rounterChart" clearable placeholder="轮播图名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getRounterChartList">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="rounterCharts" highlight-current-row v-loading="listLoading" style="width: 100%;" :border="true">
			<el-table-column type="index" width="60" align="center">
			</el-table-column>
			<el-table-column prop="image" label="图片" width="180" align="center">
				<template  slot-scope="scope">            
                    <img :src="scope.row.image"   width="150" height="100" />
                </template>
			</el-table-column>
			<el-table-column prop="rounterchart" label="轮播图名称" width="120" align="center">
			</el-table-column>
			<el-table-column prop="introduce" label="介绍" width="350" align="center">
			</el-table-column>
			<el-table-column prop="url" label="导航链接" width="180" align="center">
			</el-table-column>
			<el-table-column prop="width" label="宽度" width="100" sortable align="center">
			</el-table-column>
			<el-table-column prop="height" label="高度" width="120" sortable align="center"> 
			</el-table-column>
			<el-table-column prop="isshow" label="是否显示" width="100" align="center" :formatter="formatIsshow">
			</el-table-column>
			<el-table-column prop="savetime" label="创建时间" width="160" sortable align="center">
			</el-table-column>
			<el-table-column prop="changetime" label="修改时间" width="160" sortable align="center">
			</el-table-column>
			<el-table-column label="操作" width="150" align="center" fixed="right">
				<template scope="scope" >
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
		
				<el-form-item label="轮播图名称" prop="rounterchart">
					<el-input v-model="editForm.rounterchart"></el-input>
				</el-form-item>

				<el-form-item label="选择图片">
					<el-upload
						ref="upload"
						action="./Upload/image.action"			
						name="picture"
						list-type="picture"
						:disabled="hasUpload"
						:limit="1"
						:file-list="myFileList"
						:on-change="handleChange"
						:before-upload="beforeUpload"
						:on-exceed="handleExceed"
						:on-success="successUpload"
						:on-preview="handlePictureCardPreview"
						:on-remove="handleRemove">
						<el-button slot="trigger" type="primary">选取文件</el-button>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible" append-to-body>
						<img  width="100%" height="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
				</el-form-item>

				<el-form-item label="介绍">
					<el-input type="textarea"  :rows="8" v-model="editForm.introduce"></el-input>
				</el-form-item>
				<el-form-item label="导航链接">
					<el-input v-model="editForm.url"></el-input>
				</el-form-item>
				<el-form-item label="宽" >
					<el-input-number v-model="editForm.width" controls-position="right"  :min="1" :max="100"></el-input-number>
				</el-form-item>
				<el-form-item label="高" >
					<el-input-number v-model="editForm.height" controls-position="right"  :min="1" :max="100"></el-input-number>
				</el-form-item>
				<el-form-item label="是否显示">
					<el-radio-group v-model="editForm.isshow">
						<el-radio class="radio" :label="true">是</el-radio>
						<el-radio class="radio" :label="false">否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" v-model="editForm.remark"></el-input>
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
	import { getRounterChartAll, UpLoadImage ,addRounterChart, editRounterChart, removeRounterChart} from '../../api/api';

	export default {
		data() {
			return {
				myFileList:[],
				hasUpload: false,
				file: '',
				dialogImageUrl: '',
      			dialogVisible: false,
				filters: {
					rounterChart: '',
				},
				rounterCharts: [],
				listLoading: false,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					rounterchart: [
						{ required: true, message: '请输入轮播图名称', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					rounterchartid: null,
					rounterchart: '',
					image: '',
					width: 1,
					height: 1,
					introduce: '',
					url: '',
					isshow: true,
					remark: ''
				},

			}
		},
		methods: {
			formatIsshow: function (row, column) {
				return row.isshow == 1 ? '是' : row.isshow == 0 ? '否' : '未知';
			},
			handleChange(file, fileList){
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
			 handleRemove(file, fileList) {
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			handleSizeChange(val) {
				this.rows = val;
				this.getRounterChartList();
     		},
			handleCurrentChange(val) {
				this.page = val;
				this.getRounterChartList();
			},
			resetSearch(){
				this.filters.name = '';
				this.filters.addr = '';
				this.getRounterChartList();
			},
			//获取用户列表
			getRounterChartList() {
				let para = {
					rounterChart: this.filters.rounterChart,
				};
				this.listLoading = true;
				getRounterChartAll(para).then((res) => {
					this.rounterCharts = res.data;
					this.listLoading = false;

				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: row.rounterchartid };
					removeRounterChart(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getRounterChartList();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {		
				this.editForm = Object.assign({}, row);
				this.myFileList = [{
					name: this.editForm.rounterchart,
					url:  this.editForm.image
				}];
				this.editFormVisible = true;
			},
			//显示新增界面
			handleAdd: function () {
				this.myFileList = [];
				this.editFormVisible = true;
				this.editForm = {
					rounterchartid: null,
					rounterchart: '',
					image: '',
					width: 1,
					height: 1,
					introduce: '',
					url: '',
					isshow: true,
					remark: ''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let para = Object.assign({}, this.editForm);
							if(para.rounterchartid!=null){//如果有ID
								editRounterChart(para).then((res) => {
									this.editLoading = false;
									this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.$refs['editForm'].resetFields();
									this.editFormVisible = false;
									this.getRounterChartList();
								});
							}else{
								addRounterChart(para).then((res) => {
									this.editLoading = false;
									this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.$refs['editForm'].resetFields();
									this.editFormVisible = false;
									this.getRounterChartList();
								});	
							}	
						});
					}
				});
			},
		},
		mounted() {
			this.getRounterChartList();
		}
	}
</script>

<style scoped>
</style>