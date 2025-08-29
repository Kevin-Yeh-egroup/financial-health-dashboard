"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Info, CheckCircle, XCircle, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"

interface IndicatorDetailProps {
  title: string
  isAchieved: boolean
  currentValue: number
  targetValue: number
  unit: string
  explanation: {
    status: string
    reason: string
    impact: string
    suggestion: string
    calculation?: string
  }
}

export function IndicatorDetailDialog({
  title,
  isAchieved,
  currentValue,
  targetValue,
  unit,
  explanation,
}: IndicatorDetailProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isAchieved ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            {title}
          </DialogTitle>
          <DialogDescription>
            <Badge variant={isAchieved ? "default" : "destructive"} className="mb-4">
              {explanation.status}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 數據對比 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">數據對比</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>目前狀況：</span>
                <span className="font-semibold">
                  {currentValue.toLocaleString()} {unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span>建議標準：</span>
                <span className="font-semibold">
                  {targetValue.toLocaleString()} {unit}
                </span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span>差距：</span>
                <span
                  className={`font-semibold flex items-center gap-1 ${isAchieved ? "text-green-600" : "text-red-600"}`}
                >
                  {isAchieved ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {Math.abs(currentValue - targetValue).toLocaleString()} {unit}
                </span>
              </div>
            </div>
          </div>

          {/* 計算說明 */}
          {explanation.calculation && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" />
                計算方式
              </h4>
              <p className="text-sm text-gray-700">{explanation.calculation}</p>
            </div>
          )}

          {/* 原因分析 */}
          <div>
            <h4 className="font-semibold mb-2">原因分析</h4>
            <p className="text-sm text-gray-700">{explanation.reason}</p>
          </div>

          {/* 影響說明 */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              財務影響
            </h4>
            <p className="text-sm text-gray-700">{explanation.impact}</p>
          </div>

          {/* 改善建議 */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-green-800">改善建議</h4>
            <p className="text-sm text-green-700">{explanation.suggestion}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
