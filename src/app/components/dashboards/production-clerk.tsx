import React, { useState, useEffect } from "react";
import { DarbcoLayout } from "../darbco-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import {
  LayoutDashboard, Package, Boxes, Users, TrendingUp, Plus, Search,
  CheckCircle2, Edit, Trash2, ChevronLeft, ChevronRight, FileText, Eye, X,
  ChevronDown, Save, FileBarChart2, ClipboardList, ArrowRight,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { User } from "../types";
import { toast } from "sonner";
import {
  createArbLog,
  createDailyBoxes,
  createProductionRecord,
  fetchBeneficiaries,
} from "../../lib/db-helpers";
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area,
  PieChart, Pie, Cell, CartesianGrid,
} from "recharts";

interface Props { user: User; onLogout: () => void }

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "production", label: "Production", icon: <Package className="h-4 w-4" /> },
];

const dailyProduction = [
  { d: "Sep 1", v: 18 }, { d: "Sep 5", v: 22 }, { d: "Sep 10", v: 35 },
  { d: "Sep 15", v: 42 }, { d: "Sep 20", v: 58 }, { d: "Sep 25", v: 73 }, { d: "Sep 30", v: 86 },
];
const monthlyOverview = [
  { m: "Jan", v: 1100 }, { m: "Feb", v: 1320 }, { m: "Mar", v: 980 },
  { m: "Apr", v: 1610 }, { m: "May", v: 1820 }, { m: "Jun", v: 2050 },
  { m: "Jul", v: 2240 }, { m: "Aug", v: 1990 }, { m: "Sep", v: 2410 },
];
const breakdown = [
  { name: "Class A", value: 612, color: "#10b981" },
  { name: "Class B", value: 384, color: "#f59e0b" },
  { name: "Special Product", value: 252, color: "#6366f1" },
];
const daysGroup = [
  { name: "Group A", v: 412, total: 500 },
  { name: "Group B", v: 318, total: 400 },
  { name: "Special Product", v: 96, total: 200 },
];
const harvestBuligs = [
  { age: "11 weeks", v: 1840, pct: 32 },
  { age: "12 weeks", v: 2210, pct: 39 },
  { age: "13 weeks", v: 1180, pct: 21 },
  { age: "14 weeks", v: 460, pct: 8 },
];
const beneficiariesToday = [
  { name: "SALUDEZ LISA", boxes: 86 },
  { name: "Daniel Cruz", boxes: 64 },
  { name: "Marco Castillo", boxes: 58 },
  { name: "Jeanito Reyes", boxes: 47 },
  { name: "Vivian Farms", boxes: 39 },
];
const quality = [
  { age: "11 weeks", defects: 4, rejects: 2 },
  { age: "12 weeks", defects: 6, rejects: 5 },
  { age: "13 weeks", defects: 9, rejects: 7 },
  { age: "14 weeks", defects: 12, rejects: 10 },
];

const recentRecords = [
  { id: "PR-0531-01", date: "May 30, 2026", beneficiary: "SALUDEZ LISA", harvester: "Daniel Cruz", a: 60, b: 22, sp: 4, total: 86, status: "Submitted" },
  { id: "PR-0531-02", date: "May 30, 2026", beneficiary: "Marco Castillo", harvester: "Jeanito Reyes", a: 42, b: 14, sp: 2, total: 58, status: "Submitted" },
  { id: "PR-0531-03", date: "May 30, 2026", beneficiary: "Manny Dela Cruz", harvester: "Vivian Farms", a: 38, b: 18, sp: 0, total: 56, status: "Draft" },
  { id: "PR-0531-04", date: "May 29, 2026", beneficiary: "Benjie Ramos", harvester: "Agri Gold Farm", a: 71, b: 30, sp: 6, total: 107, status: "Submitted" },
];

const abbLogs = [
  { date: "May 30, 2026", beneficiary: "SALUDEZ LISA", harvester: "Daniel Cruz", time: "08:35 AM", w11: 0, w12: 6, w13: 5, w14: 1, total: 12 },
  { date: "May 30, 2026", beneficiary: "Marco Castillo", harvester: "Jeanito Reyes", time: "09:05 AM", w11: 2, w12: 4, w13: 3, w14: 0, total: 9 },
  { date: "May 30, 2026", beneficiary: "Manny Dela Cruz", harvester: "Vivian Farms", time: "07:30 AM", w11: 1, w12: 3, w13: 4, w14: 0, total: 8 },
  { date: "May 30, 2026", beneficiary: "Benjie Ramos", harvester: "Agri Gold Farm", time: "06:10 AM", w11: 3, w12: 5, w13: 2, w14: 1, total: 11 },
];

const harvestParams = [
  { date: "May 30, 2026", cuttingDay: "Group A", crewSize: 12, styleCut: 248, crewRejects: 2, calibration: "Standard", recordedBy: "Production Clerk" },
  { date: "May 30, 2026", cuttingDay: "Group A", crewSize: 14, styleCut: 312, crewRejects: 1, calibration: "Standard", recordedBy: "Production Clerk" },
  { date: "May 30, 2026", cuttingDay: "Group B", crewSize: 10, styleCut: 196, crewRejects: 3, calibration: "Premium", recordedBy: "Production Clerk" },
  { date: "May 27, 2026", cuttingDay: "Group B", crewSize: 11, styleCut: 224, crewRejects: 2, calibration: "Standard", recordedBy: "Production Clerk" },
  { date: "May 26, 2026", cuttingDay: "Group C", crewSize: 9, styleCut: 178, crewRejects: 0, calibration: "Standard", recordedBy: "Production Clerk" },
];

const dailyBoxRecords = [
  { date: "May 30, 2026", firstBoxOut: "06:42 AM", lastBoxOut: "03:50 PM", classA: 2, classB: 1, special: 0, total: 3 },
];

const dailyPerBene = [
  { packingDate: "May 29, 2026", totalBeneficiaries: 3, dateRecorded: "May 29, 2026 07:23 PM" },
  { packingDate: "May 29, 2026", totalBeneficiaries: 2, dateRecorded: "May 29, 2026 10:04 PM" },
  { packingDate: "May 30, 2026", totalBeneficiaries: 4, dateRecorded: "May 29, 2026 06:13 PM" },
  { packingDate: "May 31, 2026", totalBeneficiaries: 3, dateRecorded: "May 29, 2026 04:36 AM" },
];

export function ProductionClerkDashboard({ user, onLogout }: Props) {
  const [active, setActive] = useState("dashboard");
  const [prodTab, setProdTab] = useState("arb");

  const goToTab = (tab: string) => {
    setProdTab(tab);
    setActive("production");
  };

  return (
    <DarbcoLayout user={user} onLogout={onLogout} navItems={NAV} active={active} onChange={setActive}>
      {active === "dashboard" && <Dashboard goToTab={goToTab} />}
      {active === "production" && <ProductionRecords tab={prodTab} setTab={setProdTab} user={user} />}
    </DarbcoLayout>
  );
}

function Dashboard({ goToTab }: { goToTab: (tab: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2"><LayoutDashboard className="h-6 w-6 text-emerald-700" />Production Clerk Dashboard</h1>
        </div>
        <div className="text-muted-foreground">May 30, 2026</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard icon={<Package />} color="emerald" label="Boxes Today" value="1,248" delta="+8.2% vs yesterday" onClick={() => goToTab("boxes")} />
        <KpiCard icon={<Users />} color="sky" label="Total Beneficiaries" value="42" delta="active today" onClick={() => goToTab("group")} />
        <KpiCard icon={<Boxes />} color="amber" label="Total Boxes This Month" value="25,624" delta="+12.4% vs last month" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2 flex-row items-center justify-between">
            <CardTitle className="text-base">Daily Production (Boxes)</CardTitle>
            <Select defaultValue="7d"><SelectTrigger className="w-28 h-8"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="7d">Last 7 days</SelectItem><SelectItem value="30d">Last 30 days</SelectItem></SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer><AreaChart data={dailyProduction}>
              <defs><linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="d" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip />
              <Area type="monotone" dataKey="v" stroke="#059669" fill="url(#g1)" strokeWidth={2} />
            </AreaChart></ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Monthly Overview (Boxes)</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer><LineChart data={monthlyOverview}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="m" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip />
              <Line type="monotone" dataKey="v" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart></ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Daily Breakdown (Boxes)</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ResponsiveContainer width="60%" height={200}>
                <PieChart>
                  <Pie data={breakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={2}>
                    {breakdown.map((b) => <Cell key={`cell-${b.name}`} fill={b.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                <div className="text-2xl">1,248</div>
                <div className="text-muted-foreground text-xs">Total today</div>
                {breakdown.map((b) => (
                  <div key={b.name} className="flex items-center gap-2 text-xs">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: b.color }} />
                    <span className="flex-1">{b.name}</span>
                    <span>{b.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Daily Boxes Per Group</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: "Class A", v: 612, total: 800, color: "bg-emerald-500" },
            { name: "Class B", v: 384, total: 600, color: "bg-amber-500" },
            { name: "Special Product", v: 252, total: 400, color: "bg-violet-500" },
          ].map((g) => (
            <div key={g.name}>
              <div className="flex justify-between text-sm mb-1">
                <span>{g.name}</span><span>{g.v} / {g.total} boxes</span>
              </div>
              <div className="h-2.5 rounded bg-slate-100 overflow-hidden">
                <div className={`h-full ${g.color}`} style={{ width: `${(g.v / g.total) * 100}%` }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ShortcutCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="Individual ARB Logs"
            description="Log harvest deliveries"
            onClick={() => goToTab("arb")}
          />
          <ShortcutCard
            icon={<Boxes className="h-5 w-5" />}
            label="Daily Boxes Per Group"
            description="Track box class output"
            onClick={() => goToTab("boxes")}
          />
          <ShortcutCard
            icon={<ClipboardList className="h-5 w-5" />}
            label="Harvest Parameters"
            description="Stem, calibration, defects"
            onClick={() => goToTab("params")}
          />
          <ShortcutCard
            icon={<Users className="h-5 w-5" />}
            label="Daily Production per Beneficiary"
            description="View beneficiaries by date"
            onClick={() => goToTab("group")}
          />
        </div>
      </div>
    </div>
  );
}

function ShortcutCard({ icon, label, description, onClick }: { icon: React.ReactNode; label: string; description: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-left p-4 rounded-lg border bg-white hover:border-emerald-400 hover:shadow transition group"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
          {icon}
        </div>
        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
      </div>
      <div>{label}</div>
      <div className="text-xs text-muted-foreground">{description}</div>
    </button>
  );
}

function KpiCard({ icon, color, label, value, delta, onClick }: { icon: React.ReactNode; color: string; label: string; value: string; delta: string; onClick?: () => void }) {
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-700",
    sky: "bg-sky-100 text-sky-700",
    amber: "bg-amber-100 text-amber-700",
    violet: "bg-violet-100 text-violet-700",
  };
  return (
    <Card
      onClick={onClick}
      className={onClick ? "cursor-pointer hover:border-emerald-400 hover:shadow transition" : ""}
    >
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${colorMap[color]}`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="text-muted-foreground text-xs">{label}</div>
          <div className="text-2xl">{value}</div>
          <div className="text-emerald-600 text-xs flex items-center gap-1"><TrendingUp className="h-3 w-3" />{delta}</div>
        </div>
        {onClick && <ArrowRight className="h-4 w-4 text-slate-400" />}
      </CardContent>
    </Card>
  );
}

function ProductionRecords({ tab, setTab, user }: { tab: string; setTab: (t: string) => void; user: User }) {
  const [openArb, setOpenArb] = useState(false);
  const [openBoxes, setOpenBoxes] = useState(false);
  const [openParams, setOpenParams] = useState(false);
  const [openBene, setOpenBene] = useState(false);

  const buttonLabel =
    tab === "arb" ? "New ARB Log"
    : tab === "boxes" ? "New Daily Boxes"
    : tab === "params" ? "New Harvest Parameter"
    : "New Record";

  const onNew = () => {
    if (tab === "arb") setOpenArb(true);
    else if (tab === "boxes") setOpenBoxes(true);
    else if (tab === "params") setOpenParams(true);
    else if (tab === "group") setOpenBene(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2"><Package className="h-6 w-6 text-emerald-700" />Production Records</h1>
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={onNew}>
          <Plus className="h-4 w-4 mr-1" />{buttonLabel}
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-white border w-full justify-start h-auto flex-wrap p-1">
          <TabsTrigger value="arb" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"><CheckCircle2 className="h-4 w-4 mr-1" />Individual ARB Logs</TabsTrigger>
          <TabsTrigger value="boxes" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">Daily Boxes Per Group</TabsTrigger>
          <TabsTrigger value="params" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">Harvest Parameters</TabsTrigger>
          <TabsTrigger value="group" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">Daily Production per Beneficiary</TabsTrigger>
        </TabsList>

        <TabsContent value="arb"><AbbLogsPanel /></TabsContent>
        <TabsContent value="boxes"><GroupBoxesPanel /></TabsContent>
        <TabsContent value="params"><HarvestParamsPanel /></TabsContent>
        <TabsContent value="group"><PerGroupPanel /></TabsContent>
      </Tabs>

      <NewArbLogDialog open={openArb} onOpenChange={setOpenArb} user={user} />
      <NewDailyBoxesDialog open={openBoxes} onOpenChange={setOpenBoxes} user={user} />
      <NewHarvestParameterDialog open={openParams} onOpenChange={setOpenParams} />
      <NewDailyPerBeneficiaryDialog open={openBene} onOpenChange={setOpenBene} user={user} />
    </div>
  );
}

function PanelHeader({ title }: { title: string }) {
  return (
    <CardHeader className="flex-row items-center justify-between">
      <CardTitle className="text-base flex items-center gap-2 text-emerald-700">
        <FileText className="h-4 w-4" />{title}
      </CardTitle>
    </CardHeader>
  );
}

function TableToolbar() {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2 text-sm">
        Show
        <Select defaultValue="10"><SelectTrigger className="w-20 h-8"><SelectValue /></SelectTrigger>
          <SelectContent>{["10", "25", "50"].map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
        </Select>
        entries
      </div>
      <div className="relative">
        <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
        <Input placeholder="Search records..." className="pl-8 w-64 h-9" />
      </div>
    </div>
  );
}

function Pager() {
  return (
    <div className="flex items-center justify-between mt-3">
      <span className="text-muted-foreground text-sm">Showing 1 to 5 of 5 entries</span>
      <div className="flex gap-1">
        <Button variant="outline" size="sm" className="h-8 w-8 p-0"><ChevronLeft className="h-4 w-4" /></Button>
        <Button size="sm" className="h-8 w-8 p-0 bg-emerald-600 hover:bg-emerald-700">1</Button>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0"><ChevronRight className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}

function ActionCell() {
  return (
    <div className="flex gap-1">
      <button className="p-1.5 rounded bg-sky-100 text-sky-700 hover:bg-sky-200"><Edit className="h-3.5 w-3.5" /></button>
      <button className="p-1.5 rounded bg-red-100 text-red-700 hover:bg-red-200"><Trash2 className="h-3.5 w-3.5" /></button>
    </div>
  );
}

function AbbLogsPanel() {
  return (
    <Card className="mt-3">
      <PanelHeader title="Daily Harvest Log" />
      <CardContent>
        <TableToolbar />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead><TableHead>Beneficiary</TableHead><TableHead>Name Carrero / Harvester</TableHead>
              <TableHead>Time Arrival</TableHead>
              <TableHead className="text-center">11</TableHead><TableHead className="text-center">12</TableHead>
              <TableHead className="text-center">13</TableHead><TableHead className="text-center">14</TableHead>
              <TableHead className="text-center">Total</TableHead>
              <TableHead className="text-center">Running TTL</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {abbLogs.map((r, i) => {
              let running = 0;
              for (let j = 0; j <= i; j++) running += abbLogs[j].total;
              return (
                <TableRow key={i}>
                  <TableCell>{r.date}</TableCell><TableCell>{r.beneficiary}</TableCell>
                  <TableCell>{r.harvester}</TableCell><TableCell>{r.time}</TableCell>
                  <TableCell className="text-center">{r.w11}</TableCell><TableCell className="text-center">{r.w12}</TableCell>
                  <TableCell className="text-center">{r.w13}</TableCell><TableCell className="text-center">{r.w14}</TableCell>
                  <TableCell className="text-center"><strong>{r.total}</strong></TableCell>
                  <TableCell className="text-center">{running}</TableCell>
                  <TableCell><ActionCell /></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Pager />
      </CardContent>
    </Card>
  );
}

function HarvestParamsPanel() {
  return (
    <Card className="mt-3">
      <PanelHeader title="Harvest Parameters List" />
      <CardContent>
        <TableToolbar />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead><TableHead>Date</TableHead><TableHead>Cutting GRP</TableHead>
              <TableHead>Crew Size</TableHead><TableHead>Stem Cut</TableHead>
              <TableHead>Farm Rejects</TableHead><TableHead>Calibration</TableHead>
              <TableHead>Recorded By</TableHead><TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {harvestParams.map((r, i) => (
              <TableRow key={i}>
                <TableCell>{i + 1}</TableCell><TableCell>{r.date}</TableCell><TableCell>{r.cuttingDay}</TableCell>
                <TableCell>{r.crewSize}</TableCell><TableCell>{r.styleCut}</TableCell>
                <TableCell>{r.crewRejects}</TableCell><TableCell>{r.calibration}</TableCell>
                <TableCell>{r.recordedBy}</TableCell>
                <TableCell><ActionCell /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pager />
      </CardContent>
    </Card>
  );
}

function GroupBoxesPanel() {
  return (
    <div className="space-y-4 mt-3">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <SmallStat label="Total Boxes Today" value="2" subtext="100.0% of all boxes" />
        <SmallStat label="Class A Boxes" value="1" subtext="50.0% of total" />
        <SmallStat label="Class B Boxes" value="1" subtext="50.0% of total" />
        <SmallStat label="Special Product Boxes" value="0" subtext="0% of total" />
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">📅</div>
            <div>
              <div className="text-muted-foreground text-xs">Date</div>
              <div className="text-emerald-700">May 30, 2026</div>
              <div className="text-xs text-muted-foreground">Today</div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <PanelHeader title="Daily Boxes Records" />
        <CardContent>
          <TableToolbar />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead><TableHead>First Box Out</TableHead><TableHead>Last Box Out</TableHead>
                <TableHead>Total Class A</TableHead><TableHead>Total Class B</TableHead>
                <TableHead>Total Special Product</TableHead><TableHead>Total Boxes</TableHead><TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dailyBoxRecords.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>{r.date}</TableCell><TableCell>{r.firstBoxOut}</TableCell><TableCell>{r.lastBoxOut}</TableCell>
                  <TableCell>{r.classA}</TableCell><TableCell>{r.classB}</TableCell>
                  <TableCell>{r.special}</TableCell><TableCell><strong>{r.total}</strong></TableCell>
                  <TableCell>
                    <button className="p-1.5 rounded bg-sky-100 text-sky-700 hover:bg-sky-200" title="View">
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pager />
        </CardContent>
      </Card>
    </div>
  );
}

function SmallStat({ label, value, subtext }: { label: string; value: string; subtext: string }) {
  return (
    <Card>
      <CardContent className="p-5 flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
          <Boxes className="h-5 w-5" />
        </div>
        <div>
          <div className="text-muted-foreground text-xs">{label}</div>
          <div className="text-2xl">{value}</div>
          <div className="text-xs text-muted-foreground">{subtext}</div>
        </div>
      </CardContent>
    </Card>
  );
}

interface PerBeneRow {
  subCode: string; name: string; stemsCut: number;
  hands: number; sh: number; blank1: number | string; fp: number | string; blank2: number | string; blank3: number | string; clb: number;
  h: number; iD: number;
}
const beneficiariesByDate: Record<string, PerBeneRow[]> = {
  "May 29, 2026": [
    { subCode: "042", name: "Bandivas", stemsCut: 23, hands: 4, sh: 6, blank1: "", fp: "", blank2: "", blank3: "", clb: 1, h: 2, iD: 2 },
    { subCode: "181", name: "Montes, L", stemsCut: 51, hands: 12, sh: 18, blank1: "", fp: "", blank2: "", blank3: "", clb: 3, h: 6, iD: 11 },
    { subCode: "094", name: "Dalumpines", stemsCut: 29, hands: 4, sh: 10, blank1: "", fp: "", blank2: "", blank3: "", clb: 1, h: 7, iD: 4 },
  ],
  "May 30, 2026": [
    { subCode: "012", name: "Saludez, L", stemsCut: 38, hands: 8, sh: 12, blank1: "", fp: "", blank2: "", blank3: "", clb: 2, h: 4, iD: 6 },
    { subCode: "065", name: "Castillo, M", stemsCut: 27, hands: 5, sh: 9, blank1: "", fp: "", blank2: "", blank3: "", clb: 1, h: 3, iD: 4 },
    { subCode: "138", name: "Vivian Farms", stemsCut: 19, hands: 3, sh: 7, blank1: "", fp: "", blank2: "", blank3: "", clb: 1, h: 2, iD: 3 },
    { subCode: "204", name: "Cruz, D", stemsCut: 32, hands: 6, sh: 11, blank1: "", fp: "", blank2: "", blank3: "", clb: 2, h: 5, iD: 5 },
  ],
  "May 31, 2026": [
    { subCode: "076", name: "Reyes, J", stemsCut: 22, hands: 4, sh: 8, blank1: "", fp: "", blank2: "", blank3: "", clb: 1, h: 3, iD: 3 },
    { subCode: "112", name: "Aurora Tan", stemsCut: 18, hands: 3, sh: 6, blank1: "", fp: "", blank2: "", blank3: "", clb: 1, h: 2, iD: 2 },
    { subCode: "159", name: "Magolenio L.", stemsCut: 26, hands: 4, sh: 9, blank1: "", fp: "", blank2: "", blank3: "", clb: 2, h: 4, iD: 5 },
  ],
};

function PerGroupPanel() {
  const [viewing, setViewing] = useState<string | null>(null);
  const list = viewing ? beneficiariesByDate[viewing] || [] : [];

  return (
    <>
      <Card className="mt-3">
        <PanelHeader title="Daily Production per Beneficiary Records" />
        <CardContent>
          <TableToolbar />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Packing Date</TableHead><TableHead className="text-center">Total Beneficiaries</TableHead>
                <TableHead>Date Recorded</TableHead><TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dailyPerBene.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>{r.packingDate}</TableCell>
                  <TableCell className="text-center"><Badge className="bg-sky-100 text-sky-800">{r.totalBeneficiaries}</Badge></TableCell>
                  <TableCell>{r.dateRecorded}</TableCell>
                  <TableCell>
                    <button
                      className="p-1.5 rounded bg-sky-100 text-sky-700 hover:bg-sky-200"
                      title="View beneficiaries"
                      onClick={() => setViewing(r.packingDate)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pager />
        </CardContent>
      </Card>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="!max-w-[95vw] w-[95vw] sm:!max-w-[1300px] sm:w-[1300px] max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-800">
              <Eye className="h-5 w-5 text-emerald-700" />View Daily Production Per Beneficiary
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div><strong>Packing Date:</strong> {viewing}</div>
            {list.length === 0 ? (
              <p className="text-muted-foreground">No records.</p>
            ) : (
              <div className="border rounded-md overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600">
                      <th className="border p-2" rowSpan={2}>SUB CODE</th>
                      <th className="border p-2" rowSpan={2}>ARB'S NAME</th>
                      <th className="border p-2" rowSpan={2}>STEMS CUT</th>
                      <th className="border p-2 text-emerald-700" colSpan={7}>CLASS A</th>
                      <th className="border p-2 text-emerald-700" colSpan={2}>CLASS B</th>
                    </tr>
                    <tr className="bg-slate-50 text-slate-600">
                      <th className="border p-1">HANDS</th>
                      <th className="border p-1">SH</th>
                      <th className="border p-1">(BLANK)</th>
                      <th className="border p-1">F.P</th>
                      <th className="border p-1">(BLANK)</th>
                      <th className="border p-1">(BLANK)</th>
                      <th className="border p-1">CL-B</th>
                      <th className="border p-1">H</th>
                      <th className="border p-1">I/D</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((b) => (
                      <tr key={b.subCode} className="text-center">
                        <td className="border p-2">{b.subCode}</td>
                        <td className="border p-2 text-left">{b.name}</td>
                        <td className="border p-2">{b.stemsCut}</td>
                        <td className="border p-2">{b.hands}</td>
                        <td className="border p-2">{b.sh}</td>
                        <td className="border p-2 text-emerald-700">{b.blank1}</td>
                        <td className="border p-2 text-emerald-700">{b.fp}</td>
                        <td className="border p-2 text-emerald-700">{b.blank2}</td>
                        <td className="border p-2 text-emerald-700">{b.blank3}</td>
                        <td className="border p-2 text-emerald-700">{b.clb}</td>
                        <td className="border p-2">{b.h}</td>
                        <td className="border p-2">{b.iD}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={() => setViewing(null)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface CarreroEntry { name: string; time: string; w11: string; w12: string; w13: string; w14: string }
interface ArbRow { beneficiary: string; blk: string; carreros: CarreroEntry[] }

const emptyCarrero = (): CarreroEntry => ({ name: "", time: "", w11: "", w12: "", w13: "", w14: "" });

function NewArbLogDialog({ open, onOpenChange, user }: { open: boolean; onOpenChange: (o: boolean) => void; user: User }) {
  const today = new Date().toISOString().slice(0, 10);
  const [packingDate, setPackingDate] = useState(today);
  const empty: ArbRow = { beneficiary: "", blk: "", carreros: [emptyCarrero()] };
  const [rows, setRows] = useState<ArbRow[]>([{ ...empty, carreros: [emptyCarrero()] }]);

  const carreroSum = (c: CarreroEntry) => (Number(c.w11) || 0) + (Number(c.w12) || 0) + (Number(c.w13) || 0) + (Number(c.w14) || 0);
  const rowTotal = (r: ArbRow) => r.carreros.reduce((acc, c) => acc + carreroSum(c), 0);
  let running = 0;

  const update = (i: number, k: keyof ArbRow, v: string) => {
    setRows(rows.map((r, idx) => (idx === i ? { ...r, [k]: v } : r)));
  };

  const updateCarrero = (i: number, ci: number, k: keyof CarreroEntry, v: string) => {
    setRows(rows.map((r, idx) => idx === i ? { ...r, carreros: r.carreros.map((c, j) => j === ci ? { ...c, [k]: v } : c) } : r));
  };
  const addCarrero = (i: number) => {
    setRows(rows.map((r, idx) => idx === i ? { ...r, carreros: [...r.carreros, emptyCarrero()] } : r));
  };
  const removeCarrero = (i: number, ci: number) => {
    setRows(rows.map((r, idx) => idx === i ? { ...r, carreros: r.carreros.filter((_, j) => j !== ci) } : r));
  };

  const handleSave = async () => {
    if (!packingDate) {
      toast.error("Packing date is required");
      return;
    }
    if (rows.some(r => !r.beneficiary)) {
      toast.error("Beneficiary is required for each row");
      return;
    }

    try {
      const beneficiaries = await fetchBeneficiaries();

      for (const row of rows) {
        const beneficiary = beneficiaries.find(
          b => b.full_name.toLowerCase().includes(row.beneficiary.toLowerCase())
        );

        if (!beneficiary) {
          toast.error(`Beneficiary not found: ${row.beneficiary}`);
          continue;
        }

        await createArbLog({
          packing_date: packingDate,
          beneficiary_id: beneficiary.id,
          block_no: row.blk || undefined,
          recorded_by: parseInt(user.id),
          carreros: row.carreros.map(c => ({
            carrero_name: c.name,
            time_arrival: c.time || undefined,
            w11: parseInt(c.w11) || 0,
            w12: parseInt(c.w12) || 0,
            w13: parseInt(c.w13) || 0,
            w14: parseInt(c.w14) || 0,
          })),
        });
      }
      toast.success("ARB logs saved!");
      onOpenChange(false);
      setRows([{ ...empty, carreros: [emptyCarrero()] }]);
      setPackingDate(new Date().toISOString().slice(0, 10));
    } catch (error) {
      toast.error("Failed to save ARB logs");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[95vw] w-[95vw] sm:!max-w-[1200px] sm:w-[1200px] max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-emerald-700">
            <Plus className="h-5 w-5" />New Production Record
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Packing Date <span className="text-red-500">*</span></Label>
              <Input type="date" value={packingDate} onChange={(e) => setPackingDate(e.target.value)} className="w-56" />
            </div>
            <Button variant="outline" onClick={() => setRows([...rows, { beneficiary: "", blk: "", carreros: [emptyCarrero()] }])}>
              <Plus className="h-4 w-4 mr-1" />Add Row
            </Button>
          </div>
          <div className="overflow-x-auto border rounded-md">
            <table className="w-full text-xs">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  {["BENEFICIARY", "BLK NO.", "NAME CARRERO", "TIME ARRIVAL", "11", "12", "13", "14", "TOTAL", "RUNNING TT1", ""].map((h) => (
                    <th key={h} className="px-2 py-2 text-left font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const t = rowTotal(r);
                  running += t;
                  return (
                    <React.Fragment key={i}>
                      {r.carreros.map((c, ci) => (
                        <tr key={ci} className={ci === 0 ? "border-t" : ""}>
                          {ci === 0 && (
                            <>
                              <td className="p-1 align-top" rowSpan={r.carreros.length}>
                                <Input className="h-8" placeholder="Enter Beneficiary" value={r.beneficiary} onChange={(e) => update(i, "beneficiary", e.target.value)} />
                              </td>
                              <td className="p-1 align-top" rowSpan={r.carreros.length}>
                                <Input className="h-8" value={r.blk} onChange={(e) => update(i, "blk", e.target.value)} />
                              </td>
                            </>
                          )}
                          <td className="p-1">
                            <div className="flex items-center gap-1">
                              <Input className="h-8" placeholder={ci === 0 ? "Carrero name" : "Additional carrero"} value={c.name} onChange={(e) => updateCarrero(i, ci, "name", e.target.value)} />
                              {r.carreros.length > 1 && (
                                <button
                                  type="button"
                                  className="p-1 rounded border border-red-300 text-red-600 hover:bg-red-50"
                                  onClick={() => removeCarrero(i, ci)}
                                  title="Remove carrero"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                            {ci === r.carreros.length - 1 && (
                              <button
                                type="button"
                                className="text-emerald-700 hover:text-emerald-800 text-xs flex items-center gap-1 mt-1"
                                onClick={() => addCarrero(i)}
                              >
                                <Plus className="h-3 w-3" />Add Carrero
                              </button>
                            )}
                          </td>
                          <td className="p-1"><Input className="h-8" type="time" value={c.time} onChange={(e) => updateCarrero(i, ci, "time", e.target.value)} /></td>
                          <td className="p-1"><Input className="h-8 w-16" type="number" value={c.w11} onChange={(e) => updateCarrero(i, ci, "w11", e.target.value)} /></td>
                          <td className="p-1"><Input className="h-8 w-16" type="number" value={c.w12} onChange={(e) => updateCarrero(i, ci, "w12", e.target.value)} /></td>
                          <td className="p-1"><Input className="h-8 w-16" type="number" value={c.w13} onChange={(e) => updateCarrero(i, ci, "w13", e.target.value)} /></td>
                          <td className="p-1"><Input className="h-8 w-16" type="number" value={c.w14} onChange={(e) => updateCarrero(i, ci, "w14", e.target.value)} /></td>
                          {ci === 0 && (
                            <>
                              <td className="p-1 text-center bg-slate-50 align-middle" rowSpan={r.carreros.length}>{t}</td>
                              <td className="p-1 text-center bg-slate-50 align-middle" rowSpan={r.carreros.length}>{running}</td>
                              <td className="p-1 align-middle" rowSpan={r.carreros.length}>
                                <button
                                  className="p-1.5 rounded border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-40"
                                  onClick={() => setRows(rows.filter((_, idx) => idx !== i))}
                                  disabled={rows.length === 1}
                                  title="Delete row"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />Save Record
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function NewDailyBoxesDialog({ open, onOpenChange, user }: { open: boolean; onOpenChange: (o: boolean) => void; user: User }) {
  const today = new Date().toISOString().slice(0, 10);
  const [packingDate, setPackingDate] = useState(today);
  const [firstBox, setFirstBox] = useState("");
  const [lastBox, setLastBox] = useState("");
  const [classATotal, setClassATotal] = useState("");
  const [classBTotal, setClassBTotal] = useState("");
  const [specialTotal, setSpecialTotal] = useState("");

  const classARows = ["4/5/6 Hands", "7/8/9 Hands", "4.7 k", "7.2 k", "BCP", "BCP", "BCP", "BCP"];
  const classBRows = ["4/5/6 Hands", "Sml H / Clusters", "F. P"];

  const handleSave = async () => {
    try {
      await createDailyBoxes({
        packing_date: packingDate,
        first_box_at: firstBox || undefined,
        last_box_at: lastBox || undefined,
        class_a_total: parseInt(classATotal) || 0,
        class_b_total: parseInt(classBTotal) || 0,
        special_total: parseInt(specialTotal) || 0,
        recorded_by: parseInt(user.id),
      });
      toast.success("Daily boxes saved!");
      onOpenChange(false);
      // Reset form
      setPackingDate(today);
      setFirstBox("");
      setLastBox("");
      setClassATotal("");
      setClassBTotal("");
      setSpecialTotal("");
    } catch (error) {
      toast.error("Failed to save daily boxes");
      console.error(error);
    }
  };

  const Cell = () => <td className="border p-0"><Input className="h-8 border-0 rounded-none text-center" /></td>;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[95vw] w-[95vw] sm:!max-w-[1200px] sm:w-[1200px] max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="tracking-wide">DAILY BOXES PER GROUP</div>
            <div className="text-sm text-muted-foreground font-normal">DARBCO-IFS (Main PP)</div>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2"><Label>DATE:</Label><Input type="date" value={packingDate} onChange={(e) => setPackingDate(e.target.value)} className="w-44" /></div>
            <div className="flex items-center gap-2"><Label>First box out Time:</Label><Input type="time" value={firstBox} onChange={(e) => setFirstBox(e.target.value)} className="w-36" /></div>
            <div className="flex items-center gap-2"><Label>Last box out Time:</Label><Input type="time" value={lastBox} onChange={(e) => setLastBox(e.target.value)} className="w-36" /></div>
          </div>
          <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-md">
            <div className="space-y-1">
              <Label>Class A Total Boxes</Label>
              <Input type="number" value={classATotal} onChange={(e) => setClassATotal(e.target.value)} placeholder="0" />
            </div>
            <div className="space-y-1">
              <Label>Class B Total Boxes</Label>
              <Input type="number" value={classBTotal} onChange={(e) => setClassBTotal(e.target.value)} placeholder="0" />
            </div>
            <div className="space-y-1">
              <Label>Special Product Total</Label>
              <Input type="number" value={specialTotal} onChange={(e) => setSpecialTotal(e.target.value)} placeholder="0" />
            </div>
          </div>

          <div className="overflow-x-auto border rounded-md">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border p-2 text-left">CLASS - A BOXES</th>
                  <th className="border p-2" colSpan={3}>GROUP 1</th>
                  <th className="border p-2" colSpan={3}>GROUP 3</th>
                  <th className="border p-2">TOTAL BOXES PRODUCED</th>
                </tr>
                <tr className="bg-slate-50 text-slate-600">
                  <th className="border p-1"></th>
                  <th className="border p-1">TALLY</th><th className="border p-1">ADJ.</th><th className="border p-1">SHOULD BE</th>
                  <th className="border p-1">TALLY</th><th className="border p-1">ADJ.</th><th className="border p-1">SHOULD BE</th>
                  <th className="border p-1"></th>
                </tr>
              </thead>
              <tbody>
                {classARows.map((label, i) => (
                  <tr key={`a-${i}`}>
                    <td className="border p-2">{label}</td>
                    <Cell /><Cell /><Cell /><Cell /><Cell /><Cell />
                    <td className="border p-0 bg-slate-50"><Input className="h-8 border-0 rounded-none text-center" /></td>
                  </tr>
                ))}
                <tr className="bg-slate-100">
                  <td className="border p-2">TOTAL</td>
                  <Cell /><Cell /><Cell /><Cell /><Cell /><Cell />
                  <td className="border p-0 bg-slate-50"><Input className="h-8 border-0 rounded-none text-center" /></td>
                </tr>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="border p-2 text-left">CLASS- B Boxes</th>
                  <th className="border p-1">TALLY</th><th className="border p-1">ADJ.</th><th className="border p-1">SHOULD BE</th>
                  <th className="border p-1">TALLY</th><th className="border p-1">ADJ.</th><th className="border p-1">SHOULD BE</th>
                  <th className="border p-1">TOTAL BOXES</th>
                </tr>
                {classBRows.map((label, i) => (
                  <tr key={`b-${i}`}>
                    <td className="border p-2">{label}</td>
                    <Cell /><Cell /><Cell /><Cell /><Cell /><Cell />
                    <td className="border p-0 bg-slate-50"><Input className="h-8 border-0 rounded-none text-center" /></td>
                  </tr>
                ))}
                <tr className="bg-slate-100">
                  <td className="border p-2">TOTAL</td>
                  <Cell /><Cell /><Cell /><Cell /><Cell /><Cell />
                  <td className="border p-0 bg-slate-50"><Input className="h-8 border-0 rounded-none text-center" /></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />Save Daily Boxes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function NewDailyPerBeneficiaryDialog({ open, onOpenChange, user }: { open: boolean; onOpenChange: (o: boolean) => void; user: User }) {
  const today = new Date().toISOString().slice(0, 10);
  const emptyRow = () => ({
    sub: "", name: "", stems: "",
    hands: "", sh: "", a1: "", fp: "", a2: "", a3: "",
    clb: "", h: "", id: "",
  });
  const [packingDate, setPackingDate] = useState(today);
  const [rows, setRows] = useState(() => Array.from({ length: 5 }, emptyRow));
  const update = (i: number, key: string, val: string) => {
    setRows((cur) => cur.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)));
  };
  const removeRow = (i: number) => setRows((cur) => cur.filter((_, idx) => idx !== i));
  const addRow = () => setRows((cur) => [...cur, emptyRow()]);

  const handleSave = async () => {
    const filledRows = rows.filter(r => r.name.trim());
    if (filledRows.length === 0) {
      toast.error("At least one beneficiary is required");
      return;
    }

    try {
      const beneficiaries = await fetchBeneficiaries();

      for (const row of filledRows) {
        const beneficiary = beneficiaries.find(
          b => b.full_name.toLowerCase().includes(row.name.toLowerCase())
        );

        if (!beneficiary) {
          toast.error(`Beneficiary not found: ${row.name}`);
          continue;
        }

        await createProductionRecord({
          packing_date: packingDate,
          beneficiary_id: beneficiary.id,
          sub_code: row.sub || undefined,
          stems_cut: parseInt(row.stems) || 0,
          class_a_hands: parseInt(row.hands) || 0,
          class_a_sh: parseInt(row.sh) || 0,
          class_a_fp: parseInt(row.fp) || 0,
          class_b_clb: parseInt(row.clb) || 0,
          class_b_h: parseInt(row.h) || 0,
          class_b_i: parseInt(row.id) || 0,
          class_b_d: 0,
          recorded_by: parseInt(user.id),
        });
      }
      toast.success("Production records saved!");
      onOpenChange(false);
      setRows(Array.from({ length: 5 }, emptyRow));
      setPackingDate(today);
    } catch (error) {
      toast.error("Failed to save production records");
      console.error(error);
    }
  };

  const blankCellClass = "border p-0 bg-slate-50";
  const cellInput = "h-9 border-0 rounded-none text-center bg-transparent focus-visible:ring-1 focus-visible:ring-emerald-500";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[95vw] w-[95vw] sm:!max-w-[1400px] sm:w-[1400px] max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-emerald-700" />
            New Daily Production Per Beneficiary
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1">
            <Label>Packing Date <span className="text-red-500">*</span></Label>
            <Input type="date" value={packingDate} onChange={(e) => setPackingDate(e.target.value)} className="w-full sm:w-72" />
          </div>

          <div className="overflow-x-auto border rounded-md">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="border p-2" rowSpan={2}>SUB CODE</th>
                  <th className="border p-2" rowSpan={2}>ARB'S NAME</th>
                  <th className="border p-2" rowSpan={2}>STEMS CUT</th>
                  <th className="border p-2 text-emerald-700" colSpan={6}>CLASS A</th>
                  <th className="border p-2" colSpan={3}>CLASS B</th>
                  <th className="border p-2" rowSpan={2}></th>
                </tr>
                <tr className="bg-slate-50 text-slate-600">
                  <th className="border p-1">HANDS</th>
                  <th className="border p-1">SH</th>
                  <th className="border p-1">(BLANK)</th>
                  <th className="border p-1">F.P</th>
                  <th className="border p-1">(BLANK)</th>
                  <th className="border p-1">(BLANK)</th>
                  <th className="border p-1">CL-B</th>
                  <th className="border p-1">H</th>
                  <th className="border p-1">I/D</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td className="border p-0"><Input className={cellInput} value={r.sub} onChange={(e) => update(i, "sub", e.target.value)} /></td>
                    <td className="border p-0"><Input className={cellInput} value={r.name} onChange={(e) => update(i, "name", e.target.value)} /></td>
                    <td className="border p-0"><Input className={cellInput} value={r.stems} onChange={(e) => update(i, "stems", e.target.value)} /></td>
                    <td className="border p-0"><Input className={cellInput} value={r.hands} onChange={(e) => update(i, "hands", e.target.value)} /></td>
                    <td className="border p-0"><Input className={cellInput} value={r.sh} onChange={(e) => update(i, "sh", e.target.value)} /></td>
                    <td className={blankCellClass}><Input className={cellInput} value={r.a1} onChange={(e) => update(i, "a1", e.target.value)} /></td>
                    <td className="border p-0"><Input className={cellInput} value={r.fp} onChange={(e) => update(i, "fp", e.target.value)} /></td>
                    <td className={blankCellClass}><Input className={cellInput} value={r.a2} onChange={(e) => update(i, "a2", e.target.value)} /></td>
                    <td className={blankCellClass}><Input className={cellInput} value={r.a3} onChange={(e) => update(i, "a3", e.target.value)} /></td>
                    <td className="border p-0"><Input className={cellInput} value={r.clb} onChange={(e) => update(i, "clb", e.target.value)} /></td>
                    <td className="border p-0"><Input className={cellInput} value={r.h} onChange={(e) => update(i, "h", e.target.value)} /></td>
                    <td className="border p-0"><Input className={cellInput} value={r.id} onChange={(e) => update(i, "id", e.target.value)} /></td>
                    <td className="border p-1 text-center w-10">
                      <button
                        type="button"
                        onClick={() => removeRow(i)}
                        className="p-1.5 rounded border border-red-300 text-red-600 hover:bg-red-50"
                        aria-label="Remove row"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <Button variant="outline" size="sm" onClick={addRow}>
              <Plus className="h-4 w-4 mr-1" />Add Row
            </Button>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />Save Record
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function NewHarvestParameterDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const matrixRows = [
    "CUTTING GRP.", "CREW SIZE", "MANHOURS", "STEM CUT", "FARM REJECTS",
    "AVE. FINGERLENGTH", "AVE. HANDCLASS", "AVE. STEM WEIGHT", "% AREA COVERED",
    "AVE. CALIBRATION", "CALIBRATION BY WEEK",
    "11 WOF", "12 WOF", "13 WOF", "14 WOF",
    "COLOR CODE",
    "11 WOF", "12 WOF", "13 WOF", "14 WOF",
  ];
  const ageHeaders = [
    { age: "11", code: "YW" },
    { age: "12", code: "DG" },
    { age: "13", code: "BLL" },
    { age: "14", code: "DB" },
  ];
  const defects = ["Aurora", "Tutor", "Casa", "Tagotongan", "Magolenio", "Garado M", "Casulad"];
  const defectAges = [
    { age: "8 WKS", code: "YW" },
    { age: "9 WKS", code: "DG" },
    { age: "10 WKS", code: "BLL" },
    { age: "11 WKS", code: "DB" },
  ];

  const Cell = () => <td className="border p-0"><Input className="h-8 border-0 rounded-none" /></td>;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-800">
            <Plus className="h-5 w-5" />New Harvest Parameter Form
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-end items-center gap-2">
            <Label className="text-sky-700">Date:</Label>
            <Input type="date" defaultValue={today} className="w-44" />
          </div>

          <div className="border rounded-md">
            <div className="bg-slate-50 px-4 py-2 flex items-center justify-between border-b">
              <div className="flex items-center gap-2 text-slate-700">
                <Boxes className="h-4 w-4 text-sky-600" />Harvest Parameter Matrix
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 text-left bg-white"></th>
                    <th className="border p-2 bg-slate-700 text-white" colSpan={ageHeaders.length + 1}>FARM REJECTS (BY AGE)</th>
                  </tr>
                  <tr className="bg-slate-50 text-slate-600">
                    <th className="border p-2"></th>
                    <th className="border p-1">CODE</th>
                    {ageHeaders.map((h) => <th key={h.age} className="border p-1">{h.age}</th>)}
                    <th className="border p-1">TOTAL</th>
                  </tr>
                  <tr className="bg-slate-50 text-slate-500">
                    <th className="border p-1"></th>
                    <th className="border p-1"></th>
                    {ageHeaders.map((h) => <th key={`c-${h.age}`} className="border p-1">{h.code}</th>)}
                    <th className="border p-1"></th>
                  </tr>
                </thead>
                <tbody>
                  {matrixRows.map((label, i) => (
                    <tr key={i}>
                      <td className="border p-2 whitespace-nowrap">{label}</td>
                      <Cell />
                      {ageHeaders.map((h) => <Cell key={`m-${i}-${h.age}`} />)}
                      <td className="border p-0 bg-slate-50"><Input className="h-8 border-0 rounded-none" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border rounded-md">
            <div className="bg-slate-50 px-4 py-2 flex items-center justify-between border-b">
              <div className="flex items-center gap-2 text-slate-700">
                <Boxes className="h-4 w-4 text-sky-600" />Defects Matrix
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sky-700">Defects Entry</span>
                <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-1" />Add Row</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600">
                      <th className="border p-2 text-left">DEFECTS</th>
                      {defectAges.map((h) => <th key={h.age} className="border p-1">{h.age}</th>)}
                      <th className="border p-1">TOTAL</th>
                      <th className="border p-1 w-10"></th>
                    </tr>
                    <tr className="bg-slate-50 text-slate-500">
                      <th className="border p-1"></th>
                      {defectAges.map((h) => <th key={`dc-${h.age}`} className="border p-1">{h.code}</th>)}
                      <th className="border p-1"></th>
                      <th className="border p-1"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {defects.map((d) => (
                      <tr key={d}>
                        <td className="border p-2">{d}</td>
                        {defectAges.map((h) => <Cell key={`d-${d}-${h.age}`} />)}
                        <td className="border p-0 bg-slate-50"><Input className="h-8 border-0 rounded-none" /></td>
                        <td className="border p-1 text-center">
                          <button className="p-1 rounded border border-red-300 text-red-600 hover:bg-red-50">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => onOpenChange(false)}>
              <Save className="h-4 w-4 mr-1" />Save Record
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

