/**
 * Supabase数据导出到Excel脚本
 * 自动执行SQL查询并生成Excel文件
 */

const { createClient } = require('@supabase/supabase-js');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 从环境变量获取Supabase配置
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('错误: 请确保在.env.local文件中配置了NEXT_PUBLIC_SUPABASE_URL和SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// 创建Supabase客户端（使用服务角色密钥以获得完整访问权限）
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * 直接使用Supabase客户端查询数据
 */
async function fetchData() {
  const results = {};
  
  try {
    // 1. 获取用户档案数据
    console.log('正在获取用户档案数据...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (profilesError) {
      console.error('获取用户档案数据失败:', profilesError);
    } else {
      results.profiles = profiles.map(profile => ({
        '用户ID': profile.id,
        '邮箱': profile.email,
        '姓名': profile.full_name,
        '用户名': profile.username,
        '会员状态': profile.membership_status,
        '当前阶段': profile.current_stage,
        '工作经验年限': profile.years_of_experience,
        'LinkedIn链接': profile.linkedin_url,
        '作品集链接': profile.portfolio_url,
        '简历链接': profile.resume_url,
        '创建时间': profile.created_at,
        '更新时间': profile.updated_at
      }));
      console.log(`获取到 ${profiles.length} 条用户档案记录`);
    }

    // 2. 获取面试题目数据
    console.log('正在获取面试题目数据...');
    const { data: questions, error: questionsError } = await supabase
      .from('interview_questions')
      .select('*')
      .order('category_id', { ascending: true });
    
    if (questionsError) {
      console.error('获取面试题目数据失败:', questionsError);
    } else {
      results.questions = questions.map(question => ({
        '题目ID': question.id,
        '题目内容': question.question_text,
        '分类ID': question.category_id,
        '阶段ID': question.stage_id,
        '难度等级': question.difficulty_level,
        '期望答案': question.expected_answer,
        '答案建议': question.answer_suggestion,
        '关键词': Array.isArray(question.keywords) ? question.keywords.join(', ') : question.keywords,
        '时间限制(秒)': question.time_limit,
        '创建时间': question.created_at,
        '更新时间': question.updated_at
      }));
      console.log(`获取到 ${questions.length} 条面试题目记录`);
    }

    // 3. 获取练习会话数据（包含关联信息）
    console.log('正在获取练习会话数据...');
    const { data: sessions, error: sessionsError } = await supabase
      .from('practice_sessions')
      .select(`
        *,
        profiles:user_id(email, full_name),
        interview_questions:question_id(question_text)
      `)
      .order('created_at', { ascending: false });
    
    if (sessionsError) {
      console.error('获取练习会话数据失败:', sessionsError);
    } else {
      results.sessions = sessions.map(session => ({
        '会话ID': session.id,
        '用户ID': session.user_id,
        '用户邮箱': session.profiles?.email,
        '用户姓名': session.profiles?.full_name,
        '题目ID': session.question_id,
        '题目内容': session.interview_questions?.question_text,
        '阶段ID': session.stage_id,
        '分类ID': session.category_id,
        '用户答案': session.user_answer,
        '音频链接': session.audio_url,
        '总体得分': session.overall_score,
        '内容得分': session.content_score,
        '逻辑得分': session.logic_score,
        '表达得分': session.expression_score,
        'AI反馈': session.ai_feedback,
        '练习时长(秒)': session.practice_duration,
        '练习会话ID': session.session_id,
        '会话总结': session.session_summary,
        '创建时间': session.created_at,
        '更新时间': session.updated_at
      }));
      console.log(`获取到 ${sessions.length} 条练习会话记录`);
    }

    return results;
  } catch (error) {
    console.error('获取数据时发生错误:', error);
    return {};
  }
}

/**
 * 生成Excel文件
 */
async function generateExcel() {
  console.log('开始导出Supabase用户数据到Excel...');
  
  const data = await fetchData();
  
  if (Object.keys(data).length === 0) {
    console.error('没有获取到任何数据，退出程序');
    return;
  }
  
  // 创建工作簿
  const workbook = XLSX.utils.book_new();
  
  // 添加工作表
  if (data.profiles) {
    const profilesSheet = XLSX.utils.json_to_sheet(data.profiles);
    XLSX.utils.book_append_sheet(workbook, profilesSheet, '用户档案');
  }
  
  if (data.questions) {
    const questionsSheet = XLSX.utils.json_to_sheet(data.questions);
    XLSX.utils.book_append_sheet(workbook, questionsSheet, '面试题目');
  }
  
  if (data.sessions) {
    const sessionsSheet = XLSX.utils.json_to_sheet(data.sessions);
    XLSX.utils.book_append_sheet(workbook, sessionsSheet, '练习会话');
  }
  
  // 添加统计信息
  const stats = [
    { '统计项目': '用户总数', '数量': data.profiles?.length || 0 },
    { '统计项目': '题目总数', '数量': data.questions?.length || 0 },
    { '统计项目': '练习会话总数', '数量': data.sessions?.length || 0 }
  ];
  const statsSheet = XLSX.utils.json_to_sheet(stats);
  XLSX.utils.book_append_sheet(workbook, statsSheet, '数据统计');
  
  // 生成文件名（包含时间戳）
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = `supabase_user_data_${timestamp}.xlsx`;
  const filepath = path.join(__dirname, filename);
  
  // 写入文件
  XLSX.writeFile(workbook, filepath);
  
  console.log(`\n✅ Excel文件已生成: ${filepath}`);
  console.log(`\n📊 数据统计:`);
  console.log(`   - 用户档案: ${data.profiles?.length || 0} 条记录`);
  console.log(`   - 面试题目: ${data.questions?.length || 0} 条记录`);
  console.log(`   - 练习会话: ${data.sessions?.length || 0} 条记录`);
}

// 执行导出
if (require.main === module) {
  generateExcel().catch(console.error);
}

module.exports = { generateExcel };