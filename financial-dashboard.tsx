"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  DollarSign,
  PiggyBank,
  CreditCard,
  PieChart,
  Activity,
  ArrowLeft,
  Edit3,
} from "lucide-react"

import { IndicatorDetailDialog } from "./components/indicator-detail-dialog"

// 修改模擬數據 - 符合用戶要求的案例
const mockFinancialData = {
  monthlyIncome: 65000, // 月收入
  monthlyExpense: 58000, // 月支出 (月收支平衡)
  yearlyIncome: 780000, // 年收入
  yearlyExpense: 850000, // 年支出 (年收入<年支出，因為有年終獎金等不規律收入)
  assets: 2200000, // 資產
  liabilities: 1800000, // 負債 (資產>負債)
  passiveIncome: 8000, // 勞保退休金等持續性非工資收入
  emergencyFund: 120000, // 準備3-6個月支出總金額做為緊急預備金 (約2個月支出，不足)
  insurance: true, // 有保險
  creditScore: 620, // 信用分數偏低
  hasFuturePlanning: false, // 沒有有因應未來財務風險的準備
}

// 指標詳細說明數據
const indicatorExplanations = {
  monthlyBalance: {
    status: mockFinancialData.monthlyIncome > mockFinancialData.monthlyExpense ? "達成標準" : "未達標準",
    reason:
      mockFinancialData.monthlyIncome > mockFinancialData.monthlyExpense
        ? "您的月收入65,000元大於月支出58,000元，每月有7,000元的盈餘，顯示基本的收支管理良好。"
        : "您的月支出超過月收入，每月出現赤字，需要立即調整支出結構。",
    impact:
      mockFinancialData.monthlyIncome > mockFinancialData.monthlyExpense
        ? "正向影響：每月盈餘可用於儲蓄、投資或償還債務，有助於改善整體財務狀況。"
        : "負面影響：月度赤字會消耗存款，增加債務負擔，長期將導致財務惡化。",
    suggestion:
      mockFinancialData.monthlyIncome > mockFinancialData.monthlyExpense
        ? "建議將月盈餘的50%用於準備3-6個月支出總金額做為緊急預備金，30%用於投資，20%用於償還高利率債務。"
        : "立即檢視支出項目，削減非必要開支，或尋找增加收入的機會。",
    calculation: "月收支平衡 = 月收入 - 月支出 = 65,000 - 58,000 = +7,000元",
  },
  yearlyBalance: {
    status: mockFinancialData.yearlyIncome > mockFinancialData.yearlyExpense ? "達成標準" : "未達標準",
    reason:
      mockFinancialData.yearlyIncome < mockFinancialData.yearlyExpense
        ? "雖然月收支平衡，但年支出85萬元超過年收入78萬元，主要因為年度特殊支出（如旅遊、家電更換、醫療費用等）較高。"
        : "年收入大於年支出，整體財務狀況穩定。",
    impact:
      mockFinancialData.yearlyIncome < mockFinancialData.yearlyExpense
        ? "負面影響：年度赤字7萬元需要動用存款或增加借貸，長期會侵蝕資產基礎。"
        : "正向影響：年度盈餘有助於資產累積和長期財務目標達成。",
    suggestion:
      mockFinancialData.yearlyIncome < mockFinancialData.yearlyExpense
        ? "建議設立年度支出預算，將大額支出分散到每月預算中，或尋找增加年收入的機會（如年終獎金、兼職收入）。"
        : "繼續保持良好的年度收支管理，並將盈餘用於長期投資。",
    calculation: "年收支平衡 = 年收入 - 年支出 = 780,000 - 850,000 = -70,000元",
  },
  assetLiability: {
    status: mockFinancialData.assets > mockFinancialData.liabilities ? "達成標準" : "未達標準",
    reason:
      mockFinancialData.assets > mockFinancialData.liabilities
        ? "您的總資產220萬元大於總負債180萬元，淨資產為40萬元，顯示整體財務結構健康。"
        : "您的負債超過資產，淨資產為負值，財務結構需要緊急調整。",
    impact:
      mockFinancialData.assets > mockFinancialData.liabilities
        ? "正向影響：正淨資產提供財務安全緩衝，有助於應對突發狀況和未來投資。"
        : "負面影響：負淨資產表示財務脆弱，任何收入中斷都可能導致財務危機。",
    suggestion:
      mockFinancialData.assets > mockFinancialData.liabilities
        ? "建議優化資產配置，增加投資性資產比例，同時加速償還高利率債務。"
        : "優先償還債務，特別是高利率債務，同時避免新增不必要的負債。",
    calculation: "淨資產 = 總資產 - 總負債 = 2,200,000 - 1,800,000 = 400,000元",
  },
  passiveIncome: {
    status: mockFinancialData.passiveIncome > 0 ? "達成標準" : "未達標準",
    reason:
      mockFinancialData.passiveIncome > 0
        ? "您有每月8,000元的勞保退休金等持續性收入，這為未來退休生活提供了基礎保障。"
        : "您目前沒有有增加持續性累積非工資收入的能力來源，完全依賴工作收入，退休後可能面臨收入中斷的風險。",
    impact:
      mockFinancialData.passiveIncome > 0
        ? "正向影響：持續性收入提供財務穩定性，減少對工作收入的依賴，有助於退休規劃。"
        : "負面影響：缺乏有增加持續性累積非工資收入的能力增加財務風險，退休後可能面臨生活品質下降。",
    suggestion:
      mockFinancialData.passiveIncome > 0
        ? "建議繼續增加有增加持續性累積非工資收入的能力來源，如投資股息、租金收入等，目標為月收入的60%。"
        : "立即開始建立有增加持續性累積非工資收入的能力來源，可考慮定期定額投資、購買收租房產等方式，目標為月收入的60%。",
    calculation: "有增加持續性累積非工資收入的能力覆蓋率 = 有增加持續性累積非工資收入的能力 ÷ 月收入 = 8,000 ÷ 65,000 = 12.3%",
  },
  emergencyFund: {
    status: mockFinancialData.emergencyFund / mockFinancialData.monthlyExpense >= 3 ? "達成標準" : "未達標準",
    reason:
      mockFinancialData.emergencyFund / mockFinancialData.monthlyExpense < 3
        ? `您的準備3-6個月支出總金額做為緊急預備金12萬元僅能支撐${Math.round((mockFinancialData.emergencyFund / mockFinancialData.monthlyExpense) * 10) / 10}個月的支出，低於建議的3-6個月標準。`
        : "您的準備3-6個月支出總金額做為緊急預備金充足，能夠應對突發的財務需求。",
    impact:
      mockFinancialData.emergencyFund / mockFinancialData.monthlyExpense < 3
        ? "負面影響：準備3-6個月支出總金額做為緊急預備金不足可能導致突發狀況時需要借貸或變賣資產，增加財務壓力。"
        : "正向影響：充足的準備3-6個月支出總金額做為緊急預備金提供財務安全網，讓您能從容應對突發狀況。",
    suggestion:
      mockFinancialData.emergencyFund / mockFinancialData.monthlyExpense < 3
        ? `建議立即增加準備3-6個月支出總金額做為緊急預備金至${(mockFinancialData.monthlyExpense * 3).toLocaleString()}元（3個月支出），可將月盈餘優先用於此目標。`
        : "維持目前的準備3-6個月支出總金額做為緊急預備金水準，並定期檢視是否需要調整金額。",
    calculation: `準備3-6個月支出總金額做為緊急預備金月數 = 預備金 ÷ 月支出 = 120,000 ÷ 58,000 = ${Math.round((mockFinancialData.emergencyFund / mockFinancialData.monthlyExpense) * 10) / 10}個月`,
  },
  insurance: {
    status: mockFinancialData.insurance ? "達成標準" : "未達標準",
    reason: mockFinancialData.insurance
      ? "您已購買基本的醫療險和意外險，為健康和意外風險提供了保障。"
      : "您目前沒有任何有基本避險工具，面臨健康和意外風險時可能造成重大財務損失。",
    impact: mockFinancialData.insurance
      ? "正向影響：有基本避險工具降低了重大疾病或意外事故對財務的衝擊，保護家庭經濟穩定。"
      : "負面影響：缺乏有基本避險工具可能導致一次重大疾病或意外就摧毀多年的財務積累。",
    suggestion: mockFinancialData.insurance
      ? "建議檢視有基本避險工具是否充足，考慮增加壽險、失能險等，確保保障額度符合家庭需求。"
      : "立即購買基本的醫療險和意外險，保障額度建議為年收入的5-10倍。",
    calculation: mockFinancialData.insurance ? "已有基本有基本避險工具" : "無有基本避險工具",
  },
  futurePlanning: {
    status: mockFinancialData.hasFuturePlanning ? "達成標準" : "未達標準",
    reason:
      !mockFinancialData.hasFuturePlanning
        ? "您目前沒有明確的未來財務規劃，缺乏對重大支出的預先準備。"
        : "您已制定未來財務規劃，對重大支出有預先準備。",
    impact:
      !mockFinancialData.hasFuturePlanning
        ? "負面影響：缺乏規劃可能導致面臨重大支出時措手不及，需要緊急借貸或變賣資產。"
        : "正向影響：有計劃的財務規劃有助於提前準備，避免財務壓力。",
    suggestion:
      !mockFinancialData.hasFuturePlanning
        ? "建議立即制定未來5-10年的財務規劃，包括子女教育、購房、退休等重大目標。可使用專門的『未來支出試算』工具進行詳細規劃。"
        : "定期檢視和調整財務規劃，確保目標可達成。",
    calculation: mockFinancialData.hasFuturePlanning ? "已有基本規劃準備" : "尚未建立規劃",
  },
  creditScore: {
    status: mockFinancialData.creditScore >= 700 ? "達成標準" : "未達標準",
    reason:
      mockFinancialData.creditScore < 700
        ? `您的信用分數${mockFinancialData.creditScore}分低於良好標準（700分），可能影響貸款申請和利率。`
        : "您的信用分數良好，有助於獲得較佳的貸款條件。",
    impact:
      mockFinancialData.creditScore < 700
        ? "負面影響：信用分數偏低可能導致貸款被拒絕或需要支付較高利率，增加借貸成本。"
        : "正向影響：良好的信用分數有助於獲得較低利率的貸款，節省利息支出。",
    suggestion:
      mockFinancialData.creditScore < 700
        ? "建議按時還款、降低信用卡使用率至30%以下、避免頻繁申請信用卡，並定期檢查信用報告。"
        : "繼續保持良好的信用習慣，定期監控信用狀況。",
    calculation: `目前信用分數：${mockFinancialData.creditScore}分（標準：700分以上為良好）`,
  },
}

export default function FinancialDashboard() {
  const [inputText, setInputText] =
    useState(`我今年45歲，在科技公司擔任主管，每月薪水65,000元。每月固定支出包括房貸25,000元、生活費20,000元、保險費3,000元、其他支出10,000元，總計約58,000元。

去年因為家庭旅遊、家電更換和醫療費用等額外支出，總年支出達到85萬元，超過年收入78萬元。

目前有房產價值180萬、投資帳戶40萬、存款12萬，總資產約220萬。負債方面有房貸餘額150萬、信用卡債30萬，總負債180萬。

我有勞保退休金，預估退休後每月可領8,000元。目前有醫療險和意外險保障。

最近因為信用卡使用率較高，信用分數降到620分。對於未來的財務規劃還沒有具體計畫。`)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [currentPage, setCurrentPage] = useState<'input' | 'results'>('input')

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setShowResults(false)
    setTimeout(() => {
      setIsAnalyzing(false)
      setShowResults(true)
      setCurrentPage('results')
    }, 10000)
  }

  const handleBackToInput = () => {
    setCurrentPage('input')
    setShowResults(false)
  }

  // 計算財務健康分數
  const calculateHealthScore = () => {
    let score = 0
    if (mockFinancialData.monthlyIncome > mockFinancialData.monthlyExpense) score += 25
    if (mockFinancialData.yearlyIncome > mockFinancialData.yearlyExpense) score += 25
    if (mockFinancialData.assets > mockFinancialData.liabilities) score += 25
    if (mockFinancialData.passiveIncome > 0) score += 25
    return score
  }

  // 計算財務安全分數
  const calculateSafetyScore = () => {
    let score = 0
    const monthlyBuffer = mockFinancialData.emergencyFund / mockFinancialData.monthlyExpense
    if (monthlyBuffer >= 3) score += 25
    if (mockFinancialData.insurance) score += 25
    if (mockFinancialData.hasFuturePlanning) score += 25
    if (mockFinancialData.creditScore >= 700) score += 25
    return score
  }

  const healthScore = calculateHealthScore()
  const safetyScore = calculateSafetyScore()

  // 渲染輸入頁面
  const renderInputPage = () => (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 標題區域 */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">財務健康與安全儀表板</h1>
        <p className="text-lg text-gray-600">透過AI分析您的財務狀況，提供個人化建議</p>
      </div>

      {/* AI文字分析輸入區 */}
      <Card className="border-2 border-dashed border-blue-300 mx-auto max-w-4xl">
        <CardHeader className="text-center pb-6">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl">
            <Activity className="h-7 w-7" />
            AI財務資訊分析
          </CardTitle>
          <CardDescription className="text-lg mt-3">
            請詳細輸入您的財務相關資訊，AI將自動識別並分析您的財務狀況
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-8">
          <Textarea
            placeholder="請詳細描述您的財務狀況，例如：

我今年45歲，在科技公司擔任主管，每月薪水65,000元。每月固定支出包括房貸25,000元、生活費20,000元、保險費3,000元、其他支出10,000元，總計約58,000元。

去年因為家庭旅遊、家電更換和醫療費用等額外支出，總年支出達到85萬元，超過年收入78萬元。

目前有房產價值180萬、投資帳戶40萬、存款12萬，總資產約220萬。負債方面有房貸餘額150萬、信用卡債30萬，總負債180萬。

我有勞保退休金，預估退休後每月可領8,000元。目前有醫療險和意外險保障。

最近因為信用卡使用率較高，信用分數降到620分。對於未來的財務規劃還沒有具體計畫。"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[300px] text-base leading-relaxed"
          />
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing} 
            className="w-full h-12 text-lg font-semibold"
          >
            {isAnalyzing ? "AI分析中..." : "開始AI分析"}
          </Button>
        </CardContent>
      </Card>

      {/* 讀取動畫 */}
      {isAnalyzing && (
        <Card className="border-2 border-blue-300 mx-auto max-w-4xl">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Activity className="h-6 w-6 text-blue-600 animate-pulse" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">AI 正在分析您的財務狀況</h3>
                <p className="text-gray-600">請稍候，系統正在處理您的資料...</p>
              </div>
              
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 text-blue-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm">正在識別收入與支出模式</span>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 text-green-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <span className="text-sm">正在評估資產負債狀況</span>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 text-purple-700">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                    <span className="text-sm">正在計算財務健康指標</span>
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 text-orange-700">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
                    <span className="text-sm">正在生成個人化建議</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  // 渲染結果頁面
  const renderResultsPage = () => (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 頁面標題與返回按鈕 */}
      <div className="flex items-center justify-between">
        <Button 
          onClick={handleBackToInput}
          variant="outline" 
          className="flex items-center gap-2 hover:bg-blue-50"
        >
          <ArrowLeft className="h-4 w-4" />
          返回修改資料
        </Button>
        
        <div className="text-center flex-1">
          <h1 className="text-3xl font-bold text-gray-900">財務分析結果</h1>
          <p className="text-gray-600 mt-1">基於您提供的資訊進行AI智能分析</p>
        </div>
        
        <Button 
          onClick={handleBackToInput}
          variant="ghost" 
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <Edit3 className="h-4 w-4" />
          編輯資料
        </Button>
      </div>

      {showResults && (
          <>
            {/* 總覽卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 財務健康 */}
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      財務健康
                    </span>
                    <Badge variant={healthScore >= 75 ? "default" : healthScore >= 50 ? "secondary" : "destructive"}>
                      {healthScore >= 75 ? "優秀" : healthScore >= 50 ? "良好" : "需改善"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{healthScore}分</div>
                      <Progress value={healthScore} className="mt-2" />
                    </div>
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {mockFinancialData.monthlyIncome > mockFinancialData.monthlyExpense ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          月收支平衡
                        </div>
                        <IndicatorDetailDialog
                          title="月收支平衡"
                          isAchieved={mockFinancialData.monthlyIncome > mockFinancialData.monthlyExpense}
                          currentValue={mockFinancialData.monthlyIncome - mockFinancialData.monthlyExpense}
                          targetValue={0}
                          unit="元"
                          explanation={indicatorExplanations.monthlyBalance}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {mockFinancialData.yearlyIncome > mockFinancialData.yearlyExpense ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          年收支平衡
                        </div>
                        <IndicatorDetailDialog
                          title="年收支平衡"
                          isAchieved={mockFinancialData.yearlyIncome > mockFinancialData.yearlyExpense}
                          currentValue={mockFinancialData.yearlyIncome - mockFinancialData.yearlyExpense}
                          targetValue={0}
                          unit="元"
                          explanation={indicatorExplanations.yearlyBalance}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {mockFinancialData.assets > mockFinancialData.liabilities ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          資產{">"} 負債
                        </div>
                        <IndicatorDetailDialog
                          title="資產負債比"
                          isAchieved={mockFinancialData.assets > mockFinancialData.liabilities}
                          currentValue={mockFinancialData.assets - mockFinancialData.liabilities}
                          targetValue={0}
                          unit="元"
                          explanation={indicatorExplanations.assetLiability}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {mockFinancialData.passiveIncome > 0 ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          有增加持續性累積非工資收入的能力
                        </div>
                        <IndicatorDetailDialog
                          title="有增加持續性累積非工資收入的能力"
                          isAchieved={mockFinancialData.passiveIncome > 0}
                          currentValue={mockFinancialData.passiveIncome}
                          targetValue={mockFinancialData.monthlyIncome * 0.6}
                          unit="元/月"
                          explanation={indicatorExplanations.passiveIncome}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 財務安全 */}
              <Card className="border-l-4 border-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      財務安全
                    </span>
                    <Badge variant={safetyScore >= 75 ? "default" : safetyScore >= 50 ? "secondary" : "destructive"}>
                      {safetyScore >= 75 ? "安全" : safetyScore >= 50 ? "普通" : "風險"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{safetyScore}分</div>
                      <Progress value={safetyScore} className="mt-2" />
                    </div>
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {mockFinancialData.emergencyFund / mockFinancialData.monthlyExpense >= 3 ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          準備3-6個月支出總金額做為緊急預備金
                        </div>
                        <IndicatorDetailDialog
                          title="準備3-6個月支出總金額做為緊急預備金"
                          isAchieved={mockFinancialData.emergencyFund / mockFinancialData.monthlyExpense >= 3}
                          currentValue={mockFinancialData.emergencyFund / mockFinancialData.monthlyExpense}
                          targetValue={3}
                          unit="個月"
                          explanation={indicatorExplanations.emergencyFund}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {mockFinancialData.insurance ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          有基本避險工具
                        </div>
                        <IndicatorDetailDialog
                          title="有基本避險工具"
                          isAchieved={mockFinancialData.insurance}
                          currentValue={mockFinancialData.insurance ? 1 : 0}
                          targetValue={1}
                          unit=""
                          explanation={indicatorExplanations.insurance}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {mockFinancialData.hasFuturePlanning ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          有因應未來財務風險的準備
                        </div>
                        <IndicatorDetailDialog
                          title="未來財務規劃"
                          isAchieved={mockFinancialData.hasFuturePlanning}
                          currentValue={mockFinancialData.hasFuturePlanning ? 1 : 0}
                          targetValue={1}
                          unit="項"
                          explanation={indicatorExplanations.futurePlanning}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {mockFinancialData.creditScore >= 700 ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          有家庭支持系統、信用與社會資源
                        </div>
                        <IndicatorDetailDialog
                          title="信用評分"
                          isAchieved={mockFinancialData.creditScore >= 700}
                          currentValue={mockFinancialData.creditScore}
                          targetValue={700}
                          unit="分"
                          explanation={indicatorExplanations.creditScore}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 詳細分析標籤頁 */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">總覽</TabsTrigger>
                <TabsTrigger value="income-expense">收支分析</TabsTrigger>
                <TabsTrigger value="assets">資產負債</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        月收支狀況
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        +{(mockFinancialData.monthlyIncome - mockFinancialData.monthlyExpense).toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        收入 {mockFinancialData.monthlyIncome.toLocaleString()} - 支出{" "}
                        {mockFinancialData.monthlyExpense.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <PiggyBank className="h-4 w-4" />
                        淨資產
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        {(mockFinancialData.assets - mockFinancialData.liabilities).toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        資產 {mockFinancialData.assets.toLocaleString()} - 負債{" "}
                        {mockFinancialData.liabilities.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        準備3-6個月支出總金額做為緊急預備金
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round((mockFinancialData.emergencyFund / mockFinancialData.monthlyExpense) * 10) / 10}個月
                      </div>
                      <p className="text-xs text-muted-foreground">
                        預備金 {mockFinancialData.emergencyFund.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="income-expense" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        收入結構
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>主要工作收入</span>
                          <span className="font-semibold">
                            {(mockFinancialData.monthlyIncome - mockFinancialData.passiveIncome).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>有增加持續性累積非工資收入的能力</span>
                          <span className="font-semibold text-green-600">
                            {mockFinancialData.passiveIncome.toLocaleString()}
                          </span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between items-center font-bold">
                            <span>總收入</span>
                            <span>{mockFinancialData.monthlyIncome.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingDown className="h-5 w-5 text-red-600" />
                        支出結構
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>固定支出</span>
                          <span className="font-semibold">
                            {Math.round(mockFinancialData.monthlyExpense * 0.6).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>變動支出</span>
                          <span className="font-semibold">
                            {Math.round(mockFinancialData.monthlyExpense * 0.4).toLocaleString()}
                          </span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between items-center font-bold">
                            <span>總支出</span>
                            <span>{mockFinancialData.monthlyExpense.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="assets" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-green-600" />
                        資產配置
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>房產</span>
                          <span className="font-semibold">1,800,000</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>投資資產</span>
                          <span className="font-semibold">400,000</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>現金存款</span>
                          <span className="font-semibold">120,000</span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between items-center font-bold text-green-600">
                            <span>總資產</span>
                            <span>{mockFinancialData.assets.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-red-600" />
                        負債狀況
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>房屋貸款</span>
                          <span className="font-semibold">1,500,000</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>信用卡債</span>
                          <span className="font-semibold">300,000</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>其他負債</span>
                          <span className="font-semibold">0</span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between items-center font-bold text-red-600">
                            <span>總負債</span>
                            <span>{mockFinancialData.liabilities.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>


            </Tabs>

            {/* AI分析結果展示 */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  AI分析結果 - 資訊分類
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">✅ 收入資訊</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• 月薪：65,000元</li>
                        <li>• 勞保退休金：8,000元/月</li>
                        <li>• 年收入：780,000元</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-2">💸 支出資訊</h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• 房貸：25,000元/月</li>
                        <li>• 生活費：20,000元/月</li>
                        <li>• 保險費：3,000元/月</li>
                        <li>• 年度額外支出：70,000元</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">🏠 資產負債</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• 房產：1,800,000元</li>
                        <li>• 投資：400,000元</li>
                        <li>• 房貸：1,500,000元</li>
                        <li>• 信用卡債：300,000元</li>
                      </ul>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 mb-2">⚠️ 風險因子</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• 準備3-6個月支出總金額做為緊急預備金不足</li>
                        <li>• 信用分數偏低（620分）</li>
                        <li>• 缺乏未來財務規劃</li>
                        <li>• 年支出超過年收入</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 建議區域 */}
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  AI智能建議 - 混合型財務狀況
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-600">優勢項目</h4>
                    <ul className="text-sm space-y-1">
                      <li>• 月收支有盈餘，基本財務管理良好</li>
                      <li>• 擁有勞保退休金等持續性收入</li>
                      <li>• 淨資產為正，整體財務結構健康</li>
                      <li>• 已有基本有基本避險工具</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-red-600">改善重點</h4>
                    <ul className="text-sm space-y-1">
                      <li>• 控制年度額外支出，建立年度預算</li>
                      <li>• 增加準備3-6個月支出總金額做為緊急預備金至3個月支出</li>
                      <li>• 改善信用分數，降低信用卡使用率</li>
                      <li>• 制定未來5-10年財務規劃</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {currentPage === 'input' ? renderInputPage() : renderResultsPage()}
    </div>
  )
}
