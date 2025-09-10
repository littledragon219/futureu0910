'use client'

import { useState } from 'react'
import Link from 'next/link'
import ActionHandbook from './action-handbook'
import GrowthPath from './growth-path'
import FourPillars from './four-pillars'
import { Button } from '@/components/ui/button'

interface LearningReportData {
  sessions: any[]
  totalSessions: number
  diagnosis: any
  actionHandbook: any
  growthData: any[]
  abilities: string[]
}

interface LearningReportClientProps {
  initialData: LearningReportData
}

export default function LearningReportClient({ initialData }: LearningReportClientProps) {
  const [activeModule, setActiveModule] = useState('pillars')

  const latestGrowth = initialData.growthData[initialData.growthData.length - 1] || {};
  const scores = initialData.abilities.map(ability => latestGrowth[ability] || 0);

  const modules = {
    pillars: { title: '四能力详解', component: <FourPillars abilities={initialData.abilities} scores={scores} /> },
    handbook: { title: '今日行动手册', component: <ActionHandbook improvementArea={initialData.actionHandbook.improvementArea} recommendedArticle={initialData.actionHandbook.recommendedArticle} practiceQuestion={initialData.actionHandbook.practiceQuestion} thinkingTool={initialData.actionHandbook.thinkingTool} /> },
    growth: { title: '个人成长路径', component: <GrowthPath data={initialData.growthData} abilities={initialData.abilities} /> }
  }

  return (
    <div className="p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2 sm:gap-0">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">学习报告</h1>
                <span className="text-sm sm:text-base text-gray-600 font-medium">总练习次数: {initialData.totalSessions}</span>
              </div>
              <Link href="/practice-history" prefetch={false} className="text-sm sm:text-base text-blue-600 hover:text-blue-800">
                查看练习历史
              </Link>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-0">
            <div className="w-full lg:w-48 lg:pr-4">
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                {Object.keys(modules).map(key => (
                  <Button
                    key={key}
                    variant={activeModule === key ? 'default' : 'ghost'}
                    className="w-full justify-start mb-0 lg:mb-2 whitespace-nowrap lg:whitespace-normal text-sm sm:text-base"
                    onClick={() => setActiveModule(key)}
                  >
                    {modules[key as keyof typeof modules].title}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex-1">
              {modules[activeModule as keyof typeof modules].component}
            </div>
          </div>
        </div>
      </div>
  )
}