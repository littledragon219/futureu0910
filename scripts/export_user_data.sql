-- Supabase用户数据导出SQL脚本
-- 用于提取interview_questions, profiles, practice_sessions三个表的数据
-- 生成Excel友好的格式

-- 1. 导出用户档案数据 (profiles表)
SELECT 
    id as "用户ID",
    email as "邮箱",
    full_name as "姓名",
    username as "用户名",
    membership_status as "会员状态",
    current_stage as "当前阶段",
    years_of_experience as "工作经验年限",
    linkedin_url as "LinkedIn链接",
    portfolio_url as "作品集链接",
    resume_url as "简历链接",
    created_at as "创建时间",
    updated_at as "更新时间"
FROM profiles
ORDER BY created_at DESC;

-- 2. 导出面试题目数据 (interview_questions表)
SELECT 
    id as "题目ID",
    question_text as "题目内容",
    category_id as "分类ID",
    stage_id as "阶段ID",
    difficulty_level as "难度等级",
    expected_answer as "期望答案",
    answer_suggestion as "答案建议",
    array_to_string(keywords, ', ') as "关键词",
    time_limit as "时间限制(秒)",
    created_at as "创建时间",
    updated_at as "更新时间"
FROM interview_questions
ORDER BY category_id, difficulty_level;

-- 3. 导出练习会话数据 (practice_sessions表)
SELECT 
    ps.id as "会话ID",
    ps.user_id as "用户ID",
    p.email as "用户邮箱",
    p.full_name as "用户姓名",
    ps.question_id as "题目ID",
    iq.question_text as "题目内容",
    ps.stage_id as "阶段ID",
    ps.category_id as "分类ID",
    ps.user_answer as "用户答案",
    ps.audio_url as "音频链接",
    ps.overall_score as "总体得分",
    ps.content_score as "内容得分",
    ps.logic_score as "逻辑得分",
    ps.expression_score as "表达得分",
    ps.ai_feedback as "AI反馈",
    ps.practice_duration as "练习时长(秒)",
    ps.session_id as "练习会话ID",
    ps.session_summary as "会话总结",
    ps.created_at as "创建时间",
    ps.updated_at as "更新时间"
FROM practice_sessions ps
LEFT JOIN profiles p ON ps.user_id = p.id
LEFT JOIN interview_questions iq ON ps.question_id = iq.id
ORDER BY ps.created_at DESC;

-- 4. 综合统计数据
SELECT 
    '用户总数' as "统计项目",
    COUNT(*) as "数量"
FROM profiles
UNION ALL
SELECT 
    '题目总数' as "统计项目",
    COUNT(*) as "数量"
FROM interview_questions
UNION ALL
SELECT 
    '练习会话总数' as "统计项目",
    COUNT(*) as "数量"
FROM practice_sessions;

-- 5. 用户活跃度统计
SELECT 
    p.email as "用户邮箱",
    p.full_name as "用户姓名",
    p.membership_status as "会员状态",
    COUNT(ps.id) as "练习次数",
    AVG(ps.overall_score) as "平均得分",
    MAX(ps.created_at) as "最后练习时间",
    MIN(ps.created_at) as "首次练习时间"
FROM profiles p
LEFT JOIN practice_sessions ps ON p.id = ps.user_id
GROUP BY p.id, p.email, p.full_name, p.membership_status
ORDER BY COUNT(ps.id) DESC;

-- 使用说明：
-- 1. 在Supabase SQL编辑器中分别执行上述查询
-- 2. 将查询结果导出为CSV格式
-- 3. 使用Excel打开CSV文件或导入到Excel中
-- 4. 每个查询对应一个Excel工作表