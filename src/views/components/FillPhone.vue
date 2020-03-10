<template>
	<view>
		<view class="example-title">{{form.secondtitle}}</view>
		<view class="example-info"><text>{{form.digest}}</text></view>
		<view class="example-info"><text>请您为以下选项打分，1星为无关联，5星为非常关联</text></view>
		<form @submit="formSubmit($event,form)" @reset="formReset">
			<view class="example-body">
				<view :id="item.questionid" v-for="item in form.questions" :key="item.questionid" class="example-box">
					<uni-card :title="item.content" is-shadow="true" :note="item.note">
						<!-- <view>{{item.content}}</view>					 -->
						<view :id="quess.quesid" class="quess" v-for="quess in item.quess" :key="quess.quesid">
							<view>
								<view class="">{{quess.content}}</view>
								</br>
								<sunui-star :defaultStar="0" isTips="true" :maxStar="5" @changeStar="changeStar($event,quess.quesid)" class='sunui-star'></sunui-star>
							</view>
						</view>
					</uni-card>
				</view>
			</view>
			<view id='btn' class="uni-btn-v">
				<!-- <button type="default" formType="reset">重置</button> -->
				<button formType="submit">提交</button>
			</view>
		</form>
	</view>
</template>

<script>
	import uniCard from './fillphone/uni-card.vue'
	import sunuiStar from './fillphone/sunui-star.vue'

	export default {
		components: {
			uniCard,
			sunuiStar,
		},
		data() {
			return {
				//悬浮按钮
				pattern: {

				},
				//onload
				questionnairenumber: "",
				form: {}, //表单数据
				answer: [], //问卷答案
				hasAns: {}, //暂存问题答案
				a: {} //用完删
			}
		},
		onLoad(e) {
			this.a = JSON.parse(decodeURIComponent(e.questionnaire))
			let quesvalue = JSON.parse(decodeURIComponent(e.questionnaire))
			uni.setNavigationBarTitle({
				title: quesvalue.title
			})
			this.questionnairenumber = quesvalue.questionnairenumber
			// 请求问卷数据
			uni.request({
				url: getApp().globalData.requestUrl + '/questionnaire/getDetail.action?id=' +
					// '1111',
					quesvalue.questionnaireid,
				method: 'GET',
				success: res => {
					this.form = res.data
					if (this.form.questions == null) {
						uni.showModal({
							title: '数据请求异常',
							content: '请检查网络设置，重新打开',
							showCancel: false,
							success: function(res) {
								if (res.confirm) {
									uni.switchTab({
										url: '/pages/message/message'
									});
								}
							}
						});
					}
				},
				fail: () => {
					uni.showModal({
						title: '数据请求异常',
						content: '请检查网络设置，重新打开',
						showCancel: false,
						success: function(res) {
							if (res.confirm) {
								uni.switchTab({
									url: '/pages/message/message'
								});
							}
						}
					});
				},
				complete: () => {}
			});
		},
		methods: {
			//提交问卷
			formSubmit(e, form) {
				var that = this
				let type = this.checkForm();
				if (type) {
					//提交成功，跳转回列表页面
					// uni.switchTab({
					// 	url: '/pages/message/message'
					// });
					///封装答案
					that.answer = []
					for (let prop in this.hasAns) {
						let answer = this.hasAns[prop]
						this.answer.push(answer)
					}
					// 提交答案
					/* uni.request({
						url: getApp().globalData.requestUrl + '/answer/answer.action?answers=' +
							JSON.stringify(that.answer),
						method: 'GET',
						success: res => {
							
						},
						fail: () => {},
						complete: () => {}
					}); */
				}
			},
			//表单数据检验
			checkForm() {
				var that = this
				let questions = that.form.questions
				for (let prop in questions) {
					let quess = questions[prop].quess
					for (let item in quess) {
						let id = quess[item].quesid
						if (that.hasAns[id] == null) {
							that.pageScrollTo(id)
							uni.showToast({
								duration: 1000,
								title: "请填写完整",
								icon: "none"
							})
							return false
						}
					}
				}

				return true
			},
			pageScrollTo(selectId) {
				//滚动到第一个有问题的题目
				const query = uni.createSelectorQuery();
				query.selectAll(".quess").boundingClientRect(data => {
					let dom = data[0]
					let id = dom.id
					if (id === selectId) {
						uni.pageScrollTo({ //uni-app中页面滚动接口
							scrollTop: dom.top+100, //滚动到页面的目标位置（单位px）
							duration: 100 //滚动动画的时长，默认300ms，单位 ms
						})
					}
				}).exec();
			},
			formReset() {
				console.log("formReset")
			},
			changeStar(e, value) {
				let key = value
				let answer = {
					userid: "userid",
					optionsid: "optionsid",
					questionnairenumber: this.questionnairenumber,
					value: e.curStar
				}
				this.hasAns[key] = answer
			},
			btnClick() {
				const query = uni.createSelectorQuery();
				query.select("#btn").boundingClientRect(data => {
					uni.pageScrollTo({ //uni-app中页面滚动接口
						scrollTop: data.top, //滚动到页面的目标位置（单位px）
						duration: 100 //滚动动画的时长，默认300ms，单位 ms
					})
				}).exec();
			}
		}
	}
</script>

<style>
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #efeff4
	}

	view {
		font-size: 28upx;
		line-height: inherit
	}


	.example {
		padding: 0 30upx 30upx
	}

	.example-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 32upx;
		color: #464e52;
		padding: 30upx 30upx 30upx 50upx;
		margin-top: 20upx;
		position: relative;
		background-color: #fdfdfd;
		border-bottom: 1px #f5f5f5 solid
	}

	.example-title__after {
		position: relative;
		color: #031e3c
	}

	.example-title:after {
		content: '';
		position: absolute;
		left: 30upx;
		margin: auto;
		top: 0;
		bottom: 0;
		width: 6upx;
		height: 32upx;
		background-color: #ccc
	}

	.example .example-title {
		margin: 40upx 0
	}

	.example-body {
		padding: 30upx;
		background: #fff
	}

	.example-info {
		padding: 30upx;
		color: #3b4144;
		background: #fff
	}

	.example-body {
		padding: 30upx 0;
	}

	.example-box {
		margin-bottom: 30upx;
	}

	.example-box:last-child {
		margin-bottom: 0;
	}

	.image-box {
		width: 100%;
		height: 350upx;
		overflow: hidden;
	}

	.image-box .image {
		width: 100%;
		height: 100%;
	}

	.content-box {
		padding-top: 20upx;
	}

	.footer-box {
		display: flex;
		justify-content: space-between;
		width: 100%;

	}

	.footer-box__item {
		width: 100%;
		display: flex;
		align-items: center;
	}

	.footer-box__item:nth-child(2) {
		justify-content: center;
	}

	.footer-box__item:last-child {
		justify-content: flex-end;
	}
</style>
