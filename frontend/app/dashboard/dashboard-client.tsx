'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts'
import { RefreshCcw, Edit, Calendar } from 'lucide-react'

export type FunnelItem = { name: string; value: number }
export type PieItem = { name: string; value: number; color?: string }
export type TrendItem = { time: string; leads: number; deals: number; won: number }

export interface DashboardProps {
  metrics: {
    totalLeads: number
    ongoingDeals: number
    wonDeals: number
    avgDealValue?: number | null
    avgLeadCloseTime?: string | null
    avgDealCloseTime?: string | null
  }
  trend: TrendItem[]
  funnel: FunnelItem[]
  leadsByStatus: PieItem[]
  leadsBySource: PieItem[]
  currency?: string
}

export default function DashboardClient({
  metrics,
  trend,
  funnel,
  leadsByStatus,
  leadsBySource,
  currency = 'IDR'
}: DashboardProps) {
  const formatCurrency = (v?: number | null) => {
    if (!v) return `${currency === 'IDR' ? 'Rp' : '$'} 0`
    return new Intl.NumberFormat(currency === 'IDR' ? 'id-ID' : 'en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(v)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-9 gap-2 bg-white">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Last 30 Days</span>
          </Button>
          <Select defaultValue="sales_user">
            <SelectTrigger className="h-9 w-[150px] bg-white">
              <SelectValue placeholder="Select View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales_user">Sales user</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-2 bg-white">
            <RefreshCcw className="h-3.5 w-3.5" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="h-9 gap-2 bg-white">
            <Edit className="h-3.5 w-3.5" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total leads" value={String(metrics.totalLeads)} />
        <KPICard title="Ongoing deals" value={String(metrics.ongoingDeals)} />
        <KPICard title="Won deals" value={String(metrics.wonDeals)} />
        <KPICard title="Avg. deal value" value={formatCurrency(metrics.avgDealValue)} />
        <KPICard title="Avg. time to close a lead" value={metrics.avgLeadCloseTime || '0'} />
        <KPICard title="Avg. time to close a deal" value={metrics.avgDealCloseTime || '0'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Sales trend" description="Daily performance (leads, deals)">
          <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="leads" stroke="#3b82f6" fillOpacity={0.1} fill="#3b82f6" strokeWidth={2} name="Leads" />
                <Area type="monotone" dataKey="deals" stroke="#0ea5e9" fillOpacity={0.1} fill="#0ea5e9" strokeWidth={2} name="Deals" />
                <Legend iconType="circle" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Funnel conversion" description="Lead status distribution">
          <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={funnel} margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Leads by status" description="Current pipeline distribution">
          <div className="h-[250px] w-full mt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} data={leadsByStatus} dataKey="value">
                  {leadsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#0ea5e9'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Leads by source" description="Lead generation channels">
          <div className="h-[250px] w-full mt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} data={leadsBySource} dataKey="value">
                  {leadsBySource.map((entry, index) => (
                    <Cell key={`cell-src-${index}`} fill={entry.color || '#3b82f6'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  )
}

function KPICard({ title, value }: { title: string, value: string }) {
  return (
    <Card className="rounded-lg border shadow-sm bg-white">
      <CardContent className="p-4 flex flex-col gap-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </CardContent>
    </Card>
  )
}

function ChartCard({ title, description, children }: { title: string, description?: string, children: React.ReactNode }) {
  return (
    <Card className="rounded-lg border shadow-sm bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {description && <CardDescription className="text-xs">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}
