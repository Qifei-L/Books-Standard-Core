import { Link } from 'react-router-dom'
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Landmark,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import {
  bankAccounts,
  cashFlowData,
  dashboardStats,
  dashboardTasks,
} from '@/data/mock'
import { formatMoney } from '@/lib/utils'

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Business overview and tasks</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              本期收入
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MoneyDisplay amount={dashboardStats.revenue} className="text-2xl" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              本期费用
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MoneyDisplay amount={dashboardStats.expenses} className="text-2xl" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              净利润
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MoneyDisplay
              amount={dashboardStats.netProfit}
              className="text-2xl text-green-600"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              应收账款
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MoneyDisplay amount={dashboardStats.receivables} className="text-2xl" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">待办任务</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboardTasks.map((task) => (
              <Link
                key={task.id}
                to={task.link}
                className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                {task.type === 'reconcile' ? (
                  <Landmark className="mt-0.5 size-4 text-primary" />
                ) : task.type === 'invoice' ? (
                  <ArrowDownLeft className="mt-0.5 size-4 text-amber-500" />
                ) : (
                  <ArrowUpRight className="mt-0.5 size-4 text-red-500" />
                )}
                <span className="text-sm">{task.title}</span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">现金流（近 6 个月）</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(v) => formatMoney(Number(v))} />
                <Legend />
                <Bar dataKey="cashIn" name="流入" fill="#13b5ea" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cashOut" name="流出" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">应收账龄</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">未到期</div>
              <MoneyDisplay amount={dashboardStats.receivablesAging.current} />
            </div>
            <div>
              <div className="text-muted-foreground">逾期 90+ 天</div>
              <MoneyDisplay amount={dashboardStats.receivablesAging.days90} negative="red" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">银行账户</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {bankAccounts.map((ba) => {
              const mismatch = ba.balance !== ba.feedBalance
              return (
                <div key={ba.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {mismatch ? (
                      <AlertCircle className="size-4 text-amber-500" />
                    ) : (
                      <CheckCircle2 className="size-4 text-green-500" />
                    )}
                    <span>{ba.name}</span>
                  </div>
                  <MoneyDisplay amount={ba.balance} />
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
