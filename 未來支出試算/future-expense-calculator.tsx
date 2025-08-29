"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, TrendingUp } from "lucide-react"

interface ExpenseCalculation {
  targetAmount: number
  yearsToTarget: number
  monthlyAmount: number
  totalWithInflation: number
}

export function FutureExpenseCalculator() {
  const [targetAmount, setTargetAmount] = useState<number>(0)
  const [yearsToTarget, setYearsToTarget] = useState<number>(0)
  const [inflationRate, setInflationRate] = useState<number>(2.5)
  const [calculation, setCalculation] = useState<ExpenseCalculation | null>(null)

  const calculateExpense = () => {
    if (targetAmount <= 0 || yearsToTarget <= 0) return

    // 考慮通膨的未來價值
    const futureValue = targetAmount * Math.pow(1 + inflationRate / 100, yearsToTarget)
    
    // 每月需要存的金額（假設年報酬率3%）
    const monthlyRate = 0.03 / 12
    const months = yearsToTarget * 12
    const monthlyAmount = futureValue * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1)

    setCalculation({
      targetAmount,
      yearsToTarget,
      monthlyAmount: monthlyAmount,
      totalWithInflation: futureValue
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            未來支出試算器
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="target-amount">目標金額（元）</Label>
              <Input
                id="target-amount"
                type="number"
                value={targetAmount || ""}
                onChange={(e) => setTargetAmount(Number(e.target.value) || 0)}
                placeholder="例如：1000000"
              />
            </div>
            <div>
              <Label htmlFor="years">距離目標年數</Label>
              <Input
                id="years"
                type="number"
                value={yearsToTarget || ""}
                onChange={(e) => setYearsToTarget(Number(e.target.value) || 0)}
                placeholder="例如：10"
              />
            </div>
            <div>
              <Label htmlFor="inflation">預期通膨率（%）</Label>
              <Input
                id="inflation"
                type="number"
                step="0.1"
                value={inflationRate || ""}
                onChange={(e) => setInflationRate(Number(e.target.value) || 2.5)}
                placeholder="2.5"
              />
            </div>
          </div>
          
          <Button onClick={calculateExpense} className="w-full">
            <TrendingUp className="h-4 w-4 mr-2" />
            開始試算
          </Button>
        </CardContent>
      </Card>

      {calculation && (
        <Card>
          <CardHeader>
            <CardTitle>試算結果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>目標金額：</span>
                  <span className="font-semibold">
                    {calculation.targetAmount.toLocaleString()} 元
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>目標年數：</span>
                  <span className="font-semibold">{calculation.yearsToTarget} 年</span>
                </div>
                <div className="flex justify-between text-orange-600">
                  <span>考慮通膨後金額：</span>
                  <span className="font-semibold">
                    {Math.round(calculation.totalWithInflation).toLocaleString()} 元
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm text-green-700 mb-1">建議每月存款</div>
                    <div className="text-2xl font-bold text-green-800">
                      {Math.round(calculation.monthlyAmount).toLocaleString()} 元
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-600 text-center">
                  * 假設年投資報酬率 3%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
