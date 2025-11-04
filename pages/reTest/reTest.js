// pages/reTest/reTest.js
Page({
  data: {
    // 系统导航栏信息
    navHeight: 44,
    statusBarHeight: 20,
    
    // 用户输入数据
    articleInput: '',
    currentArticle: '未选择文章',
    currentType: '未选择题型',

    questionTypes: [
        { en: 'NULL', cn: '请选择题目类型' },
        { en: 'fill_blank', cn: '填空题' },
        { en: 'comprehension', cn: '判断题' },
        { en: 'translation', cn: '翻译题' },
        { en: 'choice', cn: '选择题' }
      ],
      typeIndex: 0,
    // 接口返回数据
    questionList: [],
    //存储选择题数据
    choiceContents:[]
  },
  //处理选择题
    // 处理选项点击
    handleOptionTap(e) {
  
        const { qIndex, oIndex } = e.currentTarget.dataset;
               console.log('收到参数:', e.currentTarget.dataset);
        // 创建新数组避免直接修改原数据
        const newChoiceContents = this.data.choiceContents.map((question, qIdx) => {
          if (qIdx === qIndex) {
            return question.map((option, oIdx) => ({
              ...option,
              isChoose: oIdx === oIndex // 只有点击的选项设置为true，其他自动设为false
            }));
          }
          return question;
        });
    
        this.setData({
          choiceContents: newChoiceContents
        }, () => {
          console.log('选择已更新:', this.data.choiceContents[qIndex]);
        });
      },
     // 初始化选项
     initAllChoices() {
        const choiceContents = this.data.questionList.map(question => {
          try {
            const options = JSON.parse(question.options || "[]");
            return options.map((item, idx) => ({
              text: item,
              prefix: String.fromCharCode(65 + idx) + '.', // A. B. C. D.
              isChoose: false
            }));
          } catch (e) {
            console.error('解析选项失败:', e);
            return [];
          }
        });
        this.setData({ choiceContents });
      },

  /**
   * 生命周期函数--监听页面加载
   */
 onLoad(options) {
   // 使用新API获取系统信息
   const windowInfo = wx.getWindowInfo()
   this.setData({
     statusBarHeight: windowInfo.statusBarHeight,
     navHeight: windowInfo.navBarHeight || (windowInfo.platform === 'android' ? 48 : 44)
   })
   if(this.data.currentType==='choice'){
    this.initChoices()
    this.initAllChoices();
   }
  },
    // 处理文章名输入
    handleArticleInput(e) {
        this.setData({ articleInput: e.detail.value })
      },
// JS 获取选中值
bindTypeChange(e) {
    const selected = this.data.questionTypes[e.detail.value];
    this.setData({
      typeIndex: e.detail.value,
      currentType: selected.en // 提交时仍用英文
    });
    this.fetchData()
  },
  //获取数据
  fetchData() {
    if(this.data.questionList&&this.data.questionList.length>0){
        this.setData({
            questionList:[],
            choiceContents:[]
        })
    }

    if (!this.data.articleInput || !this.data.currentType) {
      wx.showToast({ title: '请完整填写', icon: 'none' })
      return
    }
    
    // 更新导航栏显示
    this.setData({
      currentArticle: this.data.articleInput
    })
      // 调用接口
      wx.request({
        url: 'https://zhixunshiyun.yezhiqiu.cn/api/questions/comprehension',
        method: 'GET',
        data: {
          poemName: this.data.articleInput,
          questionType: this.data.currentType
        // poemName:'论语十二章',
        // questionType:'choice'
        },
        success: (res) => {
            console.log("success")
          this.setData({ questionList: [...this.data.questionList,...res.data.data]
          }, () => {
            // 在setData回调中确保数据已更新后再处理
            if(this.data.currentType==='choice'){
                this.initAllChoices();
            }
            complete: () => wx.hideLoading()})
          }, 
      })
    },
    

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
     
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})