'use client'

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import type { CompetencyScores } from '../types/evaluation'

/**
 * 核心能力雷达图组件
 * 用于可视化展示用户在五个维度的能力评分
 */
interface CompetencyRadarProps {
  /** 能力评分数据 */
  competencyScores?: CompetencyScores
  /** 图表高度，默认 300px */
  height?: number
  /** 是否显示网格，默认 true */
  showGrid?: boolean
}

export function CompetencyRadar({ 
  competencyScores, 
  height = 300, 
  showGrid = true 
}: CompetencyRadarProps) {
  // 提供默认值以防止undefined错误
  const safeScores = {
    内容质量: competencyScores?.内容质量 || 0,
    逻辑思维: competencyScores?.逻辑思维 || 0,
    表达能力: competencyScores?.表达能力 || 0,
    创新思维: competencyScores?.创新思维 || 0,
    问题分析: competencyScores?.问题分析 || 0
  }

  // 将评分数据转换为雷达图所需的格式
  const radarData = [
    {
      competency: '内容质量',
      score: safeScores.内容质量,
      fullMark: 5
    },
    {
      competency: '逻辑思维',
      score: safeScores.逻辑思维,
      fullMark: 5
    },
    {
      competency: '表达能力',
      score: safeScores.表达能力,
      fullMark: 5
    },
    {
      competency: '创新思维',
      score: safeScores.创新思维,
      fullMark: 5
    },
    {
      competency: '问题分析',
      score: safeScores.问题分析,
      fullMark: 5
    }
  ]

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          {showGrid && (
            <PolarGrid 
              stroke="#e2e8f0" 
              strokeWidth={1}
              className="opacity-60"
            />
          )}
          
          <PolarAngleAxis 
            dataKey="competency" 
            tick={{ 
              fontSize: 12, 
              fill: '#64748b',
              fontWeight: 500
            }}
            className="text-slate-600"
          />
          
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 5]} 
            tick={{ 
              fontSize: 10, 
              fill: '#94a3b8'
            }}
            tickCount={6}
            className="text-slate-400"
          />
          
          <Radar
            name="能力评分"
            dataKey="score"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.15}
            strokeWidth={2}
            dot={{ 
              fill: '#3b82f6', 
              strokeWidth: 2, 
              r: 4 
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
      
      {/* 评分说明 */}
      <div className="mt-4 text-center">
        <p className="text-sm text-slate-500">
          评分范围：1-5分 | 当前平均分：{(Object.values(safeScores).reduce((a, b) => a + b, 0) / 5).toFixed(1)}分
        </p>
      </div>
    </div>
  )
}

/**
 * 简化版雷达图组件（用于较小的展示空间）
 */
export function CompetencyRadarMini({ competencyScores }: { competencyScores?: CompetencyScores }) {
  return (
    <CompetencyRadar 
      competencyScores={competencyScores} 
      height={200} 
      showGrid={false}
    />
  )
}

/**
 * 默认导出主组件
 */
export default CompetencyRadar