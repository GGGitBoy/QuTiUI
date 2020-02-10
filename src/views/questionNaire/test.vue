<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-button type="primary" @click="gotolink">重置查询</el-button>
					<el-button type="primary" @click="excel">导入excel表格</el-button>
				</el-form-item>
			</el-form>
		</el-col>
    </section>

</template>

<script>
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
            gotolink(){
 
            //点击跳转至上次浏览页面
            // this.$router.go(-1)
            //指定跳转地址
                this.$router.replace('/testlogin')
			},			
			excel() {
				
			}
		},
	}

</script>

<style scoped>

</style>