/**
 * 发布检查清单
 * 每次发布前逐项确认
 */

// ==================== 发布检查清单 ====================
// 复制此清单，发布后逐项打勾确认

const RELEASE_CHECKLIST = {
    version: '2.0.0',
    date: null, // 发布时填写
    checker: null, // 检查人

    sections: [
        {
            title: '功能测试',
            items: [
                { id: 'f1', text: '诗词闯关：可选择年级、答题、显示结果、计分正确', checked: false },
                { id: 'f2', text: '每日挑战：生成10题、计时、记录最佳成绩', checked: false },
                { id: 'f3', text: '飞花令：进入后加载数据、答题、验证答案、显示提示', checked: false },
                { id: 'f4', text: '诗词消消乐：九宫格、十二宫格、点字成诗三种模式', checked: false },
                { id: 'f5', text: '诗词词典：搜索、显示结果、分页、诗词详情', checked: false },
                { id: 'f6', text: '错题本：显示错题、知识点统计、针对性训练、标记掌握', checked: false },
                { id: 'f7', text: '排行榜：总积分、正确率、完成关卡三个维度', checked: false },
                { id: 'f8', text: '成就系统：触发条件正确、徽章动画正常', checked: false },
                { id: 'f9', text: '用户系统：登录/游客、切换用户、删除用户、数据导出/导入', checked: false }
            ]
        },
        {
            title: '数据验证',
            items: [
                { id: 'd1', text: '题目答案抽查：随机抽10道题，答案正确', checked: false },
                { id: 'd2', text: '诗词数据完整性：标题、作者、内容不缺失', checked: false },
                { id: 'd3', text: 'poemId 关联率：> 90% 的题目有关联诗词', checked: false },
                { id: 'd4', text: '飞花令数据：keywords 不为空，totalPoems > 0', checked: false }
            ]
        },
        {
            title: '性能检查',
            items: [
                { id: 'p1', text: '首屏加载时间 < 3 秒（清空缓存后）', checked: false },
                { id: 'p2', text: '飞花令首次进入 < 5 秒（需下载扩展数据）', checked: false },
                { id: 'p3', text: '答题交互无卡顿（切换题目 < 200ms）', checked: false },
                { id: 'p4', text: 'IndexedDB 缓存生效（二次刷新不重新 fetch）', checked: false }
            ]
        },
        {
            title: '兼容性',
            items: [
                { id: 'c1', text: 'Chrome 最新版', checked: false },
                { id: 'c2', text: 'Safari 最新版（Mac & iOS）', checked: false },
                { id: 'c3', text: 'Firefox 最新版', checked: false },
                { id: 'c4', text: '微信内置浏览器', checked: false },
                { id: 'c5', text: '移动端响应式布局正常', checked: false }
            ]
        },
        {
            title: '数据持久化',
            items: [
                { id: 's1', text: 'LocalStorage 数据损坏时自动重置并提示', checked: false },
                { id: 's2', text: '存储满时提示导出数据', checked: false },
                { id: 's3', text: '数据导出/导入功能正常', checked: false },
                { id: 's4', text: '版本升级时数据自动迁移', checked: false },
                { id: 's5', text: '旧版本数据兼容性（模拟 v0 数据测试）', checked: false }
            ]
        },
        {
            title: '自动化测试',
            items: [
                { id: 't1', text: 'npm test 全部通过', checked: false },
                { id: 't2', text: 'npm run ci-check 全部通过', checked: false },
                { id: 't3', text: '浏览器冒烟测试通过', checked: false }
            ]
        }
    ]
};

// 导出检查清单（用于程序化访问）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RELEASE_CHECKLIST;
}
