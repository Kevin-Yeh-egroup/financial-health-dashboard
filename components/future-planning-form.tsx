"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, Users, Calendar, User } from "lucide-react"

interface FamilyMember {
  id: string
  name: string
  currentAge: number
}

interface FutureExpense {
  id: string
  item: string
  targetAge: number
  amount: number
  description: string
  familyMemberId: string // 新增：關聯的家庭成員ID
}

export function FuturePlanningForm() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: "1", name: "我", currentAge: 45 },
    { id: "2", name: "配偶", currentAge: 42 },
    { id: "3", name: "長子", currentAge: 15 },
    { id: "4", name: "次女", currentAge: 12 },
  ])

  const [futureExpenses, setFutureExpenses] = useState<FutureExpense[]>([])

  const addFamilyMember = () => {
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: "",
      currentAge: 0,
    }
    setFamilyMembers([...familyMembers, newMember])
  }

  const removeFamilyMember = (id: string) => {
    // 移除家庭成員時，也要移除相關的支出項目
    setFutureExpenses(futureExpenses.filter((expense) => expense.familyMemberId !== id))
    setFamilyMembers(familyMembers.filter((member) => member.id !== id))
  }

  const updateFamilyMember = (id: string, field: keyof FamilyMember, value: string | number) => {
    setFamilyMembers(familyMembers.map((member) => (member.id === id ? { ...member, [field]: value } : member)))
  }

  const addFutureExpense = () => {
    const newExpense: FutureExpense = {
      id: Date.now().toString(),
      item: "",
      targetAge: 0,
      amount: 0,
      description: "",
      familyMemberId: familyMembers[0]?.id || "",
    }
    setFutureExpenses([...futureExpenses, newExpense])
  }

  const removeFutureExpense = (id: string) => {
    setFutureExpenses(futureExpenses.filter((expense) => expense.id !== id))
  }

  const updateFutureExpense = (id: string, field: keyof FutureExpense, value: string | number) => {
    setFutureExpenses(futureExpenses.map((expense) => (expense.id === id ? { ...expense, [field]: value } : expense)))
  }

  const calculateYearsFromNow = (targetAge: number, memberAge: number) => {
    return Math.max(0, targetAge - memberAge)
  }

  const calculateTotalExpenses = () => {
    return futureExpenses.reduce((total, expense) => total + expense.amount, 0)
  }

  const getFamilyMemberById = (id: string) => {
    return familyMembers.find((member) => member.id === id)
  }

  // 按家庭成員分組支出
  const getExpensesByMember = () => {
    const grouped: { [key: string]: FutureExpense[] } = {}
    futureExpenses.forEach((expense) => {
      if (!grouped[expense.familyMemberId]) {
        grouped[expense.familyMemberId] = []
      }
      grouped[expense.familyMemberId].push(expense)
    })
    return grouped
  }

  return (
    <div className="space-y-6">
      {/* 家庭成員設定 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            家庭成員設定
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {familyMembers.map((member, index) => (
              <div key={member.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`name-${member.id}`}>姓名/關係</Label>
                    <Input
                      id={`name-${member.id}`}
                      value={member.name}
                      onChange={(e) => updateFamilyMember(member.id, "name", e.target.value)}
                      placeholder="例如：我、配偶、長子"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`age-${member.id}`}>目前年齡</Label>
                    <Input
                      id={`age-${member.id}`}
                      type="number"
                      value={member.currentAge || ""}
                      onChange={(e) =>
                        updateFamilyMember(member.id, "currentAge", Number.parseInt(e.target.value) || 0)
                      }
                      placeholder="歲"
                    />
                  </div>
                </div>
                {index > 0 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeFamilyMember(member.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button onClick={addFamilyMember} variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              新增家庭成員
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 未來支出規劃 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            未來家庭支出盤點
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {futureExpenses.map((expense) => {
              const relatedMember = getFamilyMemberById(expense.familyMemberId)
              return (
                <div key={expense.id} className="p-4 border rounded-lg space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor={`member-${expense.id}`}>相關成員</Label>
                      <Select
                        value={expense.familyMemberId}
                        onValueChange={(value) => updateFutureExpense(expense.id, "familyMemberId", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="選擇家庭成員" />
                        </SelectTrigger>
                        <SelectContent>
                          {familyMembers.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {member.name} ({member.currentAge}歲)
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`item-${expense.id}`}>支出項目</Label>
                      <Input
                        id={`item-${expense.id}`}
                        value={expense.item}
                        onChange={(e) => updateFutureExpense(expense.id, "item", e.target.value)}
                        placeholder="例如：大學學費、結婚費用"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`target-age-${expense.id}`}>
                        目標年齡 {relatedMember && `(${relatedMember.name})`}
                      </Label>
                      <Input
                        id={`target-age-${expense.id}`}
                        type="number"
                        value={expense.targetAge || ""}
                        onChange={(e) =>
                          updateFutureExpense(expense.id, "targetAge", Number.parseInt(e.target.value) || 0)
                        }
                        placeholder="歲"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`amount-${expense.id}`}>預估金額</Label>
                      <Input
                        id={`amount-${expense.id}`}
                        type="number"
                        value={expense.amount || ""}
                        onChange={(e) =>
                          updateFutureExpense(expense.id, "amount", Number.parseInt(e.target.value) || 0)
                        }
                        placeholder="元"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`description-${expense.id}`}>詳細說明</Label>
                    <Input
                      id={`description-${expense.id}`}
                      value={expense.description}
                      onChange={(e) => updateFutureExpense(expense.id, "description", e.target.value)}
                      placeholder="詳細描述這筆支出的用途和重要性"
                    />
                  </div>
                  {relatedMember && expense.targetAge > 0 && (
                    <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{relatedMember.name}的規劃</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <span>
                          距離目標時間：{calculateYearsFromNow(expense.targetAge, relatedMember.currentAge)}年
                        </span>
                        {expense.amount > 0 && (
                          <span>
                            建議月存：
                            {Math.round(
                              expense.amount /
                                (calculateYearsFromNow(expense.targetAge, relatedMember.currentAge) * 12 || 1),
                            ).toLocaleString()}
                            元
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFutureExpense(expense.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    刪除此項目
                  </Button>
                </div>
              )
            })}

            <Button onClick={addFutureExpense} variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              新增未來支出項目
            </Button>

            {/* 按成員分組顯示 */}
            {futureExpenses.length > 0 && (
              <div className="mt-6 space-y-4">
                <h4 className="font-semibold text-lg">支出規劃總覽</h4>

                {/* 總計 */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">全家支出總計</h4>
                  <div className="text-2xl font-bold text-blue-600">{calculateTotalExpenses().toLocaleString()}元</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    建議總月存金額：
                    {Math.round(
                      calculateTotalExpenses() /
                        (familyMembers[0]?.currentAge ? (65 - familyMembers[0].currentAge) * 12 : 1),
                    ).toLocaleString()}
                    元
                  </p>
                </div>

                {/* 按成員分組 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(getExpensesByMember()).map(([memberId, expenses]) => {
                    const member = getFamilyMemberById(memberId)
                    if (!member) return null

                    const memberTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0)

                    return (
                      <div key={memberId} className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <User className="h-5 w-5 text-blue-600" />
                          <h5 className="font-semibold">
                            {member.name} ({member.currentAge}歲)
                          </h5>
                        </div>
                        <div className="space-y-2">
                          {expenses.map((expense) => (
                            <div key={expense.id} className="flex justify-between text-sm">
                              <span>{expense.item}</span>
                              <span className="font-medium">{expense.amount.toLocaleString()}元</span>
                            </div>
                          ))}
                          <div className="border-t pt-2 flex justify-between font-semibold">
                            <span>小計</span>
                            <span className="text-blue-600">{memberTotal.toLocaleString()}元</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
