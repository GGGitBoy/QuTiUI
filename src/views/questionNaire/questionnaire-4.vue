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
			<el-table-column label="操作" width="360" fixed="right" align="center">
				<template scope="scope">
					<el-button size="small" @click="handleStatus(scope.$index, scope.row)">放回草稿箱</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">永久删除</el-button>
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
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getNaireListPage, changeStatus, removeNaire } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					title: '',
					questionnairenumber: '',
					status: 4,
					questiontypenumber: '评分题',
				},
				naires: [],
				total: 0,
				rows: 20,
				page: 1,
				listLoading: false,
			}
		},
		methods: {
			handleStatus(index, row) {
				this.$confirm('确认发布吗?', '提示', {}).then(() => {
					let para = Object.assign({}, row)
					para.status = 4
					
					changeStatus(para).then((res) => {
						this.$message({
							message: '问卷发布成功',
							type: 'success'
						});
						this.getNaire();
					});
				})	
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
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认永久删除该问卷吗吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { ids: row.questionnaireid };
					removeNaire(para).then((res) => {
						this.listLoading = false;
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getNaire();
					});
				}).catch(() => {

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