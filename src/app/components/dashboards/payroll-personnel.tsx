import { useMemo, useState } from "react";
import { DarbcoLayout } from "../darbco-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import {
  LayoutDashboard, Wallet, ClipboardCheck, FileBarChart2, Plus, Eye, Search,
  Printer, Send, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Trash2,
} from "lucide-react";
import { User } from "../types";
import { toast } from "sonner";

interface Props { user: User; onLogout: () => void }

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "beneficiary", label: "Beneficiary Payroll", icon: <Wallet className="h-4 w-4" /> },
  { id: "history", label: "Payroll History", icon: <ClipboardCheck className="h-4 w-4" /> },
  { id: "reports", label: "Reports", icon: <FileBarChart2 className="h-4 w-4" /> },
];

const PRICES = { A: 320, B: 240, special: 480 };

type Status = "Draft" | "Ready for Submission" | "Submitted for Validation" | "Returned for Correction" | "Validated" | "Approved";

interface ProductionRecord {
  id: string;
  beneficiaryId: string;
  beneficiaryName: string;
  harvestDate: string;
  harvester: string;
  payrollPeriod: string;
  classA: number;
  classB: number;
  special: number;
  used: boolean;
}

interface MaterialCredit {
  date: string;
  material: string;
  qty: number;
  unit: string;
  unitPrice: number;
  status: "Unpaid" | "Partially Paid";
}

interface OtherDeduction { type: string; description: string; amount: number; ref: string }

interface PayrollSlip {
  slipNo: string;
  productionRecordId: string;
  beneficiaryId: string;
  beneficiaryName: string;
  payrollPeriod: string;
  harvestDate: string;
  harvester: string;
  classA: number;
  classB: number;
  special: number;
  materialCredits: MaterialCredit[];
  laborDescription: string;
  laborAmount: number;
  prevBalance: number;
  otherDeductions: OtherDeduction[];
  dateCreated: string;
  preparedBy: string;
  status: Status;
  returnReason?: string;
}

const PRODUCTION_RECORDS: ProductionRecord[] = [
  { id: "PR-2026-0531-01", beneficiaryId: "B-001", beneficiaryName: "Roberto Cruz", harvestDate: "2026-05-28", harvester: "Crew A — Mario Lopez", payrollPeriod: "May 16 – May 31, 2026", classA: 60, classB: 20, special: 6, used: false },
  { id: "PR-2026-0531-02", beneficiaryId: "B-004", beneficiaryName: "Helena Pascual", harvestDate: "2026-05-29", harvester: "Crew B — Joel Ramos", payrollPeriod: "May 16 – May 31, 2026", classA: 84, classB: 36, special: 4, used: true },
  { id: "PR-2026-0531-03", beneficiaryId: "B-002", beneficiaryName: "Liza Mariano", harvestDate: "2026-05-27", harvester: "Crew A — Mario Lopez", payrollPeriod: "May 16 – May 31, 2026", classA: 48, classB: 12, special: 8, used: false },
  { id: "PR-2026-0531-04", beneficiaryId: "B-005", beneficiaryName: "Ferdinand Lopez", harvestDate: "2026-05-30", harvester: "Crew C — Tito Reyes", payrollPeriod: "May 16 – May 31, 2026", classA: 72, classB: 22, special: 5, used: false },
];

const CREDITS_BY_BENEFICIARY: Record<string, MaterialCredit[]> = {
  "B-001": [
    { date: "2026-05-15", material: "Complete Fertilizer", qty: 2, unit: "sacks", unitPrice: 1000, status: "Unpaid" },
    { date: "2026-05-18", material: "Fungicide (Mancozeb)", qty: 1, unit: "bottle", unitPrice: 500, status: "Unpaid" },
  ],
  "B-002": [
    { date: "2026-05-12", material: "Insecticide (Cypermethrin)", qty: 1, unit: "L", unitPrice: 720, status: "Unpaid" },
  ],
  "B-004": [
    { date: "2026-05-10", material: "Banana Bags (Blue)", qty: 200, unit: "pcs", unitPrice: 12.5, status: "Partially Paid" },
  ],
  "B-005": [],
};

const PREV_BALANCE: Record<string, number> = { "B-001": 0, "B-002": 0, "B-004": 1200, "B-005": 0 };

const SEED_SLIPS: PayrollSlip[] = [
  {
    slipNo: "PB-2026-0001",
    productionRecordId: "PR-2026-0531-02",
    beneficiaryId: "B-004",
    beneficiaryName: "Helena Pascual",
    payrollPeriod: "May 16 – May 31, 2026",
    harvestDate: "2026-05-29",
    harvester: "Crew B — Joel Ramos",
    classA: 84, classB: 36, special: 4,
    materialCredits: CREDITS_BY_BENEFICIARY["B-004"],
    laborDescription: "Harvesting and packing labor",
    laborAmount: 3500,
    prevBalance: 1200,
    otherDeductions: [],
    dateCreated: "2026-05-31",
    preparedBy: "Ana Dela Cruz",
    status: "Approved",
  },
];

function computeSlip(s: Pick<PayrollSlip, "classA" | "classB" | "special" | "materialCredits" | "laborAmount" | "prevBalance" | "otherDeductions">) {
  const subA = s.classA * PRICES.A;
  const subB = s.classB * PRICES.B;
  const subSpecial = s.special * PRICES.special;
  const gross = subA + subB + subSpecial;
  const matTotal = s.materialCredits.reduce((sum, d) => sum + d.qty * d.unitPrice, 0);
  const otherTotal = s.otherDeductions.reduce((sum, d) => sum + d.amount, 0);
  const totalDed = matTotal + s.laborAmount + s.prevBalance + otherTotal;
  const net = gross - totalDed;
  return { subA, subB, subSpecial, gross, matTotal, otherTotal, totalDed, net };
}

export function PayrollPersonnelDashboard({ user, onLogout }: Props) {
  const [active, setActive] = useState("dashboard");
  const [slips, setSlips] = useState<PayrollSlip[]>(SEED_SLIPS);

  return (
    <DarbcoLayout user={user} onLogout={onLogout} navItems={NAV} active={active} onChange={setActive}>
      {active === "dashboard" && <Dashboard goTo={setActive} slips={slips} />}
      {active === "beneficiary" && <BeneficiaryPayroll slips={slips} setSlips={setSlips} preparedBy={user.name} />}
      {active === "history" && <PayrollHistory slips={slips} />}
      {active === "reports" && <Reports />}
    </DarbcoLayout>
  );
}

function statusClass(s: Status): string {
  switch (s) {
    case "Draft": return "bg-slate-100 text-slate-700";
    case "Ready for Submission": return "bg-sky-100 text-sky-800";
    case "Submitted for Validation": return "bg-violet-100 text-violet-800";
    case "Returned for Correction": return "bg-red-100 text-red-800";
    case "Validated": return "bg-amber-100 text-amber-800";
    case "Approved": return "bg-emerald-100 text-emerald-800";
  }
}

function StatusBadge({ s }: { s: Status }) {
  return <Badge className={statusClass(s)}>{s}</Badge>;
}

function Dashboard({ goTo, slips }: { goTo: (id: string) => void; slips: PayrollSlip[] }) {
  const pendingProd = PRODUCTION_RECORDS.filter((p) => !p.used).length;
  const drafts = slips.filter((s) => s.status === "Draft" || s.status === "Ready for Submission").length;
  const submitted = slips.filter((s) => s.status === "Submitted for Validation").length;
  const returned = slips.filter((s) => s.status === "Returned for Correction").length;
  const approved = slips.filter((s) => s.status === "Approved").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2"><LayoutDashboard className="h-6 w-6 text-emerald-700" />Payroll Dashboard</h1>
        <div className="text-muted-foreground">May 31, 2026 • Period: May 16 – May 31, 2026</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Kpi color="amber" label="Pending Payroll Records" value={String(pendingProd)} sub="Production records ready" onClick={() => goTo("beneficiary")} />
        <Kpi color="slate" label="Draft Payroll Slips" value={String(drafts)} sub="Still being completed" onClick={() => goTo("beneficiary")} />
        <Kpi color="violet" label="Submitted for Validation" value={String(submitted)} sub="With Finance Officer" onClick={() => goTo("history")} />
        <Kpi color="red" label="Returned for Correction" value={String(returned)} sub="Needs revision" onClick={() => goTo("history")} />
        <Kpi color="emerald" label="Approved Payrolls" value={String(approved)} sub="Final approval done" onClick={() => goTo("history")} />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Wallet className="h-4 w-4 text-emerald-700" />Recent Payroll Activities</CardTitle>
          <Button variant="link" className="text-emerald-700" onClick={() => goTo("beneficiary")}>Open Beneficiary Payroll →</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payroll Slip No.</TableHead><TableHead>Beneficiary</TableHead>
                <TableHead>Payroll Period</TableHead><TableHead>Gross Income</TableHead>
                <TableHead>Net Income</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slips.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-muted-foreground text-center">No payroll activities yet.</TableCell></TableRow>
              )}
              {slips.map((s) => {
                const c = computeSlip(s);
                return (
                  <TableRow key={s.slipNo}>
                    <TableCell>{s.slipNo}</TableCell>
                    <TableCell>{s.beneficiaryId} — {s.beneficiaryName}</TableCell>
                    <TableCell className="text-xs">{s.payrollPeriod}</TableCell>
                    <TableCell>₱{c.gross.toLocaleString()}</TableCell>
                    <TableCell>₱{c.net.toLocaleString()}</TableCell>
                    <TableCell><StatusBadge s={s.status} /></TableCell>
                    <TableCell>
                      <Button variant="link" className="text-emerald-700 h-auto p-0" onClick={() => goTo("beneficiary")}>
                        {s.status === "Draft" || s.status === "Returned for Correction" ? "Continue Editing" : "View Details"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function Kpi({ color, label, value, sub, onClick }: { color: string; label: string; value: string; sub: string; onClick?: () => void }) {
  const map: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    slate: "bg-slate-100 text-slate-700",
    violet: "bg-violet-100 text-violet-700",
    red: "bg-red-100 text-red-700",
  };
  return (
    <Card onClick={onClick} className={onClick ? "cursor-pointer hover:border-emerald-400 hover:shadow transition" : ""}>
      <CardContent className="p-4">
        <div className={`inline-flex h-9 w-9 rounded-full items-center justify-center ${map[color]}`}><Wallet className="h-4 w-4" /></div>
        <div className="mt-2 text-muted-foreground text-xs">{label}</div>
        <div className="text-xl">{value}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </CardContent>
    </Card>
  );
}

function BeneficiaryPayroll({ slips, setSlips, preparedBy }: {
  slips: PayrollSlip[];
  setSlips: (s: PayrollSlip[]) => void;
  preparedBy: string;
}) {
  const [search, setSearch] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [view, setView] = useState<PayrollSlip | null>(null);

  const filtered = slips.filter((s) => {
    const q = search.toLowerCase();
    return !q || `${s.slipNo} ${s.beneficiaryName} ${s.beneficiaryId}`.toLowerCase().includes(q);
  });

  const submitSlip = (slipNo: string) => {
    setSlips(slips.map((s) => (s.slipNo === slipNo ? { ...s, status: "Submitted for Validation" } : s)));
    toast.success(`${slipNo} submitted to Finance Officer`);
  };

  const saveDraft = (draft: PayrollSlip) => {
    setSlips([draft, ...slips]);
    toast.success(`${draft.slipNo} saved as draft`);
    setOpenCreate(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2"><Wallet className="h-6 w-6 text-emerald-700" />Beneficiary Payroll</h1>
          <p className="text-muted-foreground">Prepare beneficiary payroll slips from completed production records.</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setOpenCreate(true)}>
          <Plus className="h-4 w-4 mr-1" />Create Beneficiary Payroll
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
              <Input placeholder="Search by slip, beneficiary, or ID..." className="pl-8 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-44 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="ready">Ready for Submission</SelectItem>
                <SelectItem value="sub">Submitted for Validation</SelectItem>
                <SelectItem value="ret">Returned for Correction</SelectItem>
                <SelectItem value="val">Validated</SelectItem>
                <SelectItem value="app">Approved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Slip #</TableHead><TableHead>Beneficiary</TableHead>
                <TableHead>Harvest Date</TableHead><TableHead>Boxes (A/B/Sp)</TableHead>
                <TableHead>Gross</TableHead><TableHead>Deductions</TableHead><TableHead>Net</TableHead>
                <TableHead>Status</TableHead><TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={9} className="text-muted-foreground text-center">No payroll slips yet — click "Create Beneficiary Payroll".</TableCell></TableRow>
              )}
              {filtered.map((s) => {
                const c = computeSlip(s);
                return (
                  <TableRow key={s.slipNo}>
                    <TableCell>{s.slipNo}</TableCell>
                    <TableCell>{s.beneficiaryId} — {s.beneficiaryName}</TableCell>
                    <TableCell>{s.harvestDate}</TableCell>
                    <TableCell>{s.classA} / {s.classB} / {s.special}</TableCell>
                    <TableCell>₱{c.gross.toLocaleString()}</TableCell>
                    <TableCell className="text-red-600">−₱{c.totalDed.toLocaleString()}</TableCell>
                    <TableCell><strong>₱{c.net.toLocaleString()}</strong></TableCell>
                    <TableCell><StatusBadge s={s.status} /></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <button className="p-1.5 rounded bg-sky-100 text-sky-700 hover:bg-sky-200" onClick={() => setView(s)} title="View slip">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        {(s.status === "Draft" || s.status === "Ready for Submission") && (
                          <button className="p-1.5 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200" onClick={() => submitSlip(s.slipNo)} title="Submit for Validation">
                            <Send className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-muted-foreground">Showing {filtered.length} of {slips.length} slips</span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0"><ChevronLeft className="h-4 w-4" /></Button>
              <Button size="sm" className="h-8 w-8 p-0 bg-emerald-600 hover:bg-emerald-700">1</Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0"><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <CreatePayrollDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        preparedBy={preparedBy}
        nextSlipNo={`PB-2026-${String(slips.length + 1).padStart(4, "0")}`}
        onSaveDraft={saveDraft}
        onSubmit={(slip) => { setSlips([{ ...slip, status: "Submitted for Validation" }, ...slips]); toast.success(`${slip.slipNo} submitted to Finance Officer`); setOpenCreate(false); }}
      />
      <ViewPayrollDialog slip={view} onClose={() => setView(null)} />
    </div>
  );
}

function CreatePayrollDialog({ open, onClose, preparedBy, nextSlipNo, onSaveDraft, onSubmit }: {
  open: boolean;
  onClose: () => void;
  preparedBy: string;
  nextSlipNo: string;
  onSaveDraft: (s: PayrollSlip) => void;
  onSubmit: (s: PayrollSlip) => void;
}) {
  const [recordId, setRecordId] = useState("");
  const [laborDescription, setLaborDescription] = useState("Harvesting and production labor");
  const [laborAmount, setLaborAmount] = useState<number>(0);
  const [laborRemarks, setLaborRemarks] = useState("");
  const [otherDeductions, setOtherDeductions] = useState<OtherDeduction[]>([]);

  const record = useMemo(() => PRODUCTION_RECORDS.find((p) => p.id === recordId), [recordId]);
  const credits = record ? CREDITS_BY_BENEFICIARY[record.beneficiaryId] || [] : [];
  const prevBalance = record ? PREV_BALANCE[record.beneficiaryId] || 0 : 0;

  const computed = computeSlip({
    classA: record?.classA || 0,
    classB: record?.classB || 0,
    special: record?.special || 0,
    materialCredits: credits,
    laborAmount,
    prevBalance,
    otherDeductions,
  });

  const checklist = useMemo(() => {
    if (!record) return [];
    return [
      { label: "Beneficiary name matches the production record", source: "Production Clerk", ok: !!record.beneficiaryName },
      { label: "Harvest date is correct", source: "Production Clerk", ok: !!record.harvestDate },
      { label: "Class A, Class B, and Special Product boxes are complete", source: "Production Clerk", ok: record.classA + record.classB + record.special > 0 },
      { label: "Price per box classification is available", source: "Payroll Price List", ok: PRICES.A > 0 && PRICES.B > 0 && PRICES.special > 0 },
      { label: "Credited materials belong to the selected beneficiary", source: "Inventory Bookkeeper", ok: true },
      { label: "Unpaid material credits are included as deductions", source: "Inventory Bookkeeper", ok: credits.every((c) => c.status === "Unpaid" || c.status === "Partially Paid") },
      { label: "Labor cost has been entered", source: "Payroll Personnel", ok: laborAmount > 0 && laborDescription.trim().length > 0 },
      { label: "Gross income is computed correctly", source: "System-generated", ok: computed.gross > 0 },
      { label: "Total deductions are computed correctly", source: "System-generated", ok: computed.totalDed >= 0 },
      { label: "Net income is calculated", source: "System-generated", ok: computed.net !== undefined },
    ];
  }, [record, credits, laborAmount, laborDescription, computed]);

  const allOk = checklist.length > 0 && checklist.every((c) => c.ok);

  const buildSlip = (): PayrollSlip => ({
    slipNo: nextSlipNo,
    productionRecordId: record!.id,
    beneficiaryId: record!.beneficiaryId,
    beneficiaryName: record!.beneficiaryName,
    payrollPeriod: record!.payrollPeriod,
    harvestDate: record!.harvestDate,
    harvester: record!.harvester,
    classA: record!.classA,
    classB: record!.classB,
    special: record!.special,
    materialCredits: credits,
    laborDescription,
    laborAmount,
    prevBalance,
    otherDeductions,
    dateCreated: new Date().toISOString().slice(0, 10),
    preparedBy,
    status: allOk ? "Ready for Submission" : "Draft",
  });

  const reset = () => {
    setRecordId(""); setLaborAmount(0); setLaborDescription("Harvesting and production labor");
    setLaborRemarks(""); setOtherDeductions([]);
  };

  const availableRecords = PRODUCTION_RECORDS.filter((p) => !p.used);

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { reset(); onClose(); } }}>
      <DialogContent className="!max-w-[95vw] w-[95vw] sm:!max-w-[1200px] sm:w-[1200px] max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Beneficiary Payroll — {nextSlipNo}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Section A */}
          <SectionCard title="Section A — Select Production Record" tone="emerald">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1 md:col-span-2">
                <Label>Production Record ID <span className="text-red-500">*</span></Label>
                <Select value={recordId} onValueChange={setRecordId}>
                  <SelectTrigger><SelectValue placeholder="Select a completed production record" /></SelectTrigger>
                  <SelectContent>
                    {availableRecords.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.id} — {r.beneficiaryId} {r.beneficiaryName} • Harvest {r.harvestDate}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="text-xs text-muted-foreground">Only completed production records that haven't been used in an approved payroll slip are listed.</div>
              </div>
              <Field label="Beneficiary Name" value={record?.beneficiaryName || "—"} />
              <Field label="Beneficiary ID" value={record?.beneficiaryId || "—"} />
              <Field label="Harvest Date" value={record?.harvestDate || "—"} />
              <Field label="Harvester's Name" value={record?.harvester || "—"} />
              <Field label="Payroll Period" value={record?.payrollPeriod || "—"} />
            </div>
          </SectionCard>

          {/* Section B */}
          <SectionCard title="Section B — Production Basis and Earnings" tone="emerald">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Classification</TableHead>
                  <TableHead className="text-right">Number of Boxes</TableHead>
                  <TableHead className="text-right">Price per Box</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow><TableCell>Class A</TableCell><TableCell className="text-right">{record?.classA ?? 0}</TableCell><TableCell className="text-right">₱{PRICES.A.toLocaleString()}</TableCell><TableCell className="text-right">₱{computed.subA.toLocaleString()}</TableCell></TableRow>
                <TableRow><TableCell>Class B</TableCell><TableCell className="text-right">{record?.classB ?? 0}</TableCell><TableCell className="text-right">₱{PRICES.B.toLocaleString()}</TableCell><TableCell className="text-right">₱{computed.subB.toLocaleString()}</TableCell></TableRow>
                <TableRow><TableCell>Special Product</TableCell><TableCell className="text-right">{record?.special ?? 0}</TableCell><TableCell className="text-right">₱{PRICES.special.toLocaleString()}</TableCell><TableCell className="text-right">₱{computed.subSpecial.toLocaleString()}</TableCell></TableRow>
                <TableRow className="border-t-2">
                  <TableCell colSpan={3}><strong>Gross Income</strong></TableCell>
                  <TableCell className="text-right"><strong className="text-emerald-700">₱{computed.gross.toLocaleString()}</strong></TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="text-xs text-muted-foreground">Box quantities are pulled from the Production Clerk's record and are not editable here. If incorrect, return the record for correction.</div>
          </SectionCard>

          {/* Section C */}
          <SectionCard title="Section C — Material Credit Deductions" tone="amber">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date Released</TableHead><TableHead>Material Name</TableHead>
                  <TableHead className="text-right">Quantity</TableHead><TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead><TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {credits.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-muted-foreground text-center">No unpaid material credits for this beneficiary.</TableCell></TableRow>
                )}
                {credits.map((c, i) => (
                  <TableRow key={i}>
                    <TableCell>{c.date}</TableCell>
                    <TableCell>{c.material}</TableCell>
                    <TableCell className="text-right">{c.qty} {c.unit}</TableCell>
                    <TableCell className="text-right">₱{c.unitPrice.toLocaleString()}</TableCell>
                    <TableCell className="text-right">₱{(c.qty * c.unitPrice).toLocaleString()}</TableCell>
                    <TableCell><Badge className="bg-amber-100 text-amber-800">{c.status}</Badge></TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2">
                  <TableCell colSpan={4}><strong>Material Credit Subtotal</strong></TableCell>
                  <TableCell className="text-right"><strong className="text-red-600">−₱{computed.matTotal.toLocaleString()}</strong></TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
            <div className="text-xs text-muted-foreground">Cash purchases are not shown here — they were already paid during the material transaction.</div>
          </SectionCard>

          {/* Section D */}
          <SectionCard title="Section D — Labor Cost" tone="sky">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Labor Cost Description <span className="text-red-500">*</span></Label>
                <Input value={laborDescription} onChange={(e) => setLaborDescription(e.target.value)} placeholder="e.g. Harvesting and production labor" />
              </div>
              <div className="space-y-1">
                <Label>Labor Cost Amount (₱) <span className="text-red-500">*</span></Label>
                <Input type="number" min={0} value={laborAmount} onChange={(e) => setLaborAmount(Math.max(0, Number(e.target.value) || 0))} />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label>Remarks</Label>
                <Textarea value={laborRemarks} onChange={(e) => setLaborRemarks(e.target.value)} placeholder="Optional supporting details." />
              </div>
              <Field label="Encoded By" value={preparedBy} />
              <Field label="Date Encoded" value={new Date().toISOString().slice(0, 16).replace("T", " ")} />
            </div>
            {laborAmount <= 0 && <div className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5" />Labor cost is required and must be greater than zero.</div>}
          </SectionCard>

          {/* Section E */}
          <SectionCard title="Section E — Other Authorized Deductions" tone="slate">
            <div className="space-y-2">
              {prevBalance > 0 && (
                <div className="p-3 border rounded-md flex justify-between bg-amber-50 border-amber-200">
                  <div>
                    <div>Previous Unpaid Balance</div>
                    <div className="text-xs text-muted-foreground">Carried over from prior payroll period.</div>
                  </div>
                  <div className="text-red-600">−₱{prevBalance.toLocaleString()}</div>
                </div>
              )}
              {otherDeductions.map((d, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2 p-3 border rounded-md">
                  <div className="md:col-span-3 space-y-1"><Label>Deduction Type</Label>
                    <Input value={d.type} onChange={(e) => setOtherDeductions(otherDeductions.map((x, j) => j === i ? { ...x, type: e.target.value } : x))} />
                  </div>
                  <div className="md:col-span-4 space-y-1"><Label>Description</Label>
                    <Input value={d.description} onChange={(e) => setOtherDeductions(otherDeductions.map((x, j) => j === i ? { ...x, description: e.target.value } : x))} />
                  </div>
                  <div className="md:col-span-2 space-y-1"><Label>Amount (₱)</Label>
                    <Input type="number" min={0} value={d.amount} onChange={(e) => setOtherDeductions(otherDeductions.map((x, j) => j === i ? { ...x, amount: Math.max(0, Number(e.target.value) || 0) } : x))} />
                  </div>
                  <div className="md:col-span-2 space-y-1"><Label>Reference</Label>
                    <Input value={d.ref} onChange={(e) => setOtherDeductions(otherDeductions.map((x, j) => j === i ? { ...x, ref: e.target.value } : x))} />
                  </div>
                  <div className="md:col-span-1 flex items-end">
                    <button className="p-2 rounded border border-red-300 text-red-600 hover:bg-red-50" onClick={() => setOtherDeductions(otherDeductions.filter((_, j) => j !== i))}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={() => setOtherDeductions([...otherDeductions, { type: "", description: "", amount: 0, ref: "" }])}>
                <Plus className="h-4 w-4 mr-1" />Add Other Deduction
              </Button>
              <div className="text-xs text-muted-foreground">A reason/description is required before adding any additional deduction.</div>
            </div>
          </SectionCard>

          {/* Section F */}
          <SectionCard title="Section F — Payroll Summary" tone="emerald">
            <Table>
              <TableBody>
                <TableRow><TableCell>Gross Income</TableCell><TableCell className="text-right">₱{computed.gross.toLocaleString()}</TableCell></TableRow>
                <TableRow><TableCell>Material Credit Deductions</TableCell><TableCell className="text-right text-red-600">−₱{computed.matTotal.toLocaleString()}</TableCell></TableRow>
                <TableRow><TableCell>Labor Cost</TableCell><TableCell className="text-right text-red-600">−₱{laborAmount.toLocaleString()}</TableCell></TableRow>
                <TableRow><TableCell>Previous Unpaid Balance</TableCell><TableCell className="text-right text-red-600">−₱{prevBalance.toLocaleString()}</TableCell></TableRow>
                <TableRow><TableCell>Other Authorized Deductions</TableCell><TableCell className="text-right text-red-600">−₱{computed.otherTotal.toLocaleString()}</TableCell></TableRow>
                <TableRow className="border-t-2"><TableCell><strong>Total Deductions</strong></TableCell><TableCell className="text-right"><strong className="text-red-600">−₱{computed.totalDed.toLocaleString()}</strong></TableCell></TableRow>
                <TableRow className="border-t-2 bg-emerald-50"><TableCell><strong>Net Income</strong></TableCell><TableCell className="text-right"><strong className="text-emerald-800">₱{computed.net.toLocaleString()}</strong></TableCell></TableRow>
              </TableBody>
            </Table>
          </SectionCard>

          {/* Record Matching Checklist */}
          <SectionCard title="Record Matching Checklist" tone="violet">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Record Check</TableHead><TableHead>Data Source</TableHead><TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!record && <TableRow><TableCell colSpan={3} className="text-muted-foreground text-center">Select a production record to run the checklist.</TableCell></TableRow>}
                {checklist.map((c, i) => (
                  <TableRow key={i}>
                    <TableCell>{c.label}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{c.source}</TableCell>
                    <TableCell>
                      {c.ok
                        ? <Badge className="bg-emerald-100 text-emerald-800"><CheckCircle2 className="h-3 w-3 mr-1" />Complete</Badge>
                        : <Badge className="bg-amber-100 text-amber-800"><AlertCircle className="h-3 w-3 mr-1" />Needs Review</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SectionCard>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="outline" onClick={() => { reset(); onClose(); }}>Cancel</Button>
            <Button variant="outline" disabled={!record} onClick={() => onSaveDraft(buildSlip())}>Save as Draft</Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
              disabled={!allOk}
              onClick={() => onSubmit(buildSlip())}
            >
              <Send className="h-4 w-4 mr-1" />Submit for Validation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SectionCard({ title, tone, children }: { title: string; tone: "emerald" | "amber" | "sky" | "slate" | "violet"; children: React.ReactNode }) {
  const map = {
    emerald: "border-emerald-200 bg-emerald-50/30",
    amber: "border-amber-200 bg-amber-50/30",
    sky: "border-sky-200 bg-sky-50/30",
    slate: "border-slate-200 bg-slate-50/30",
    violet: "border-violet-200 bg-violet-50/30",
  };
  return (
    <Card className={map[tone]}>
      <CardHeader className="pb-2"><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div>{value}</div>
    </div>
  );
}

function ViewPayrollDialog({ slip, onClose }: { slip: PayrollSlip | null; onClose: () => void }) {
  if (!slip) return null;
  const c = computeSlip(slip);

  return (
    <Dialog open={!!slip} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="!max-w-[95vw] w-[95vw] sm:!max-w-[900px] sm:w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Beneficiary Payroll Slip — {slip.slipNo}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          {slip.status === "Returned for Correction" && slip.returnReason && (
            <div className="p-3 border border-red-200 bg-red-50 rounded-md text-red-800 text-sm">
              <strong>Returned for Correction:</strong> {slip.returnReason}
            </div>
          )}

          <SectionCard title="Beneficiary Information" tone="emerald">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Field label="Beneficiary Name" value={slip.beneficiaryName} />
              <Field label="Beneficiary ID" value={slip.beneficiaryId} />
              <Field label="Payroll Period" value={slip.payrollPeriod} />
              <Field label="Harvest Date" value={slip.harvestDate} />
              <Field label="Harvester" value={slip.harvester} />
              <Field label="Production Record" value={slip.productionRecordId} />
            </div>
          </SectionCard>

          <SectionCard title="Production Basis and Earnings" tone="emerald">
            <Table>
              <TableHeader><TableRow><TableHead>Classification</TableHead><TableHead className="text-right">Boxes</TableHead><TableHead className="text-right">Price/Box</TableHead><TableHead className="text-right">Subtotal</TableHead></TableRow></TableHeader>
              <TableBody>
                <TableRow><TableCell>Class A</TableCell><TableCell className="text-right">{slip.classA}</TableCell><TableCell className="text-right">₱{PRICES.A.toLocaleString()}</TableCell><TableCell className="text-right">₱{c.subA.toLocaleString()}</TableCell></TableRow>
                <TableRow><TableCell>Class B</TableCell><TableCell className="text-right">{slip.classB}</TableCell><TableCell className="text-right">₱{PRICES.B.toLocaleString()}</TableCell><TableCell className="text-right">₱{c.subB.toLocaleString()}</TableCell></TableRow>
                <TableRow><TableCell>Special Product</TableCell><TableCell className="text-right">{slip.special}</TableCell><TableCell className="text-right">₱{PRICES.special.toLocaleString()}</TableCell><TableCell className="text-right">₱{c.subSpecial.toLocaleString()}</TableCell></TableRow>
                <TableRow className="border-t-2"><TableCell colSpan={3}><strong>Gross Income</strong></TableCell><TableCell className="text-right"><strong className="text-emerald-700">₱{c.gross.toLocaleString()}</strong></TableCell></TableRow>
              </TableBody>
            </Table>
          </SectionCard>

          <SectionCard title="Material Credit Deductions" tone="amber">
            <Table>
              <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Material</TableHead><TableHead className="text-right">Qty</TableHead><TableHead className="text-right">Unit Price</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
              <TableBody>
                {slip.materialCredits.length === 0 && <TableRow><TableCell colSpan={5} className="text-muted-foreground text-center">No material credits.</TableCell></TableRow>}
                {slip.materialCredits.map((d, i) => (
                  <TableRow key={i}>
                    <TableCell>{d.date}</TableCell><TableCell>{d.material}</TableCell>
                    <TableCell className="text-right">{d.qty} {d.unit}</TableCell>
                    <TableCell className="text-right">₱{d.unitPrice.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-red-600">−₱{(d.qty * d.unitPrice).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SectionCard>

          <SectionCard title="Labor Cost" tone="sky">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Description" value={slip.laborDescription} />
              <Field label="Amount" value={`₱${slip.laborAmount.toLocaleString()}`} />
            </div>
          </SectionCard>

          <SectionCard title="Payroll Summary" tone="emerald">
            <Table>
              <TableBody>
                <TableRow><TableCell>Gross Income</TableCell><TableCell className="text-right">₱{c.gross.toLocaleString()}</TableCell></TableRow>
                <TableRow><TableCell>Material Credit Deductions</TableCell><TableCell className="text-right text-red-600">−₱{c.matTotal.toLocaleString()}</TableCell></TableRow>
                <TableRow><TableCell>Labor Cost</TableCell><TableCell className="text-right text-red-600">−₱{slip.laborAmount.toLocaleString()}</TableCell></TableRow>
                <TableRow><TableCell>Previous Unpaid Balance</TableCell><TableCell className="text-right text-red-600">−₱{slip.prevBalance.toLocaleString()}</TableCell></TableRow>
                <TableRow><TableCell>Other Authorized Deductions</TableCell><TableCell className="text-right text-red-600">−₱{c.otherTotal.toLocaleString()}</TableCell></TableRow>
                <TableRow className="border-t-2"><TableCell><strong>Total Deductions</strong></TableCell><TableCell className="text-right"><strong className="text-red-600">−₱{c.totalDed.toLocaleString()}</strong></TableCell></TableRow>
                <TableRow className="bg-emerald-50"><TableCell><strong>Net Income</strong></TableCell><TableCell className="text-right"><strong className="text-emerald-800">₱{c.net.toLocaleString()}</strong></TableCell></TableRow>
              </TableBody>
            </Table>
          </SectionCard>

          <SectionCard title="Payroll Tracking" tone="slate">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Field label="Slip No." value={slip.slipNo} />
              <Field label="Date Created" value={slip.dateCreated} />
              <Field label="Prepared By" value={slip.preparedBy} />
              <div className="space-y-1"><div className="text-xs text-muted-foreground">Status</div><StatusBadge s={slip.status} /></div>
            </div>
          </SectionCard>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="outline" onClick={() => toast.success("Slip sent to printer")}><Printer className="h-4 w-4 mr-1" />Print</Button>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PayrollHistory({ slips }: { slips: PayrollSlip[] }) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="flex items-center gap-2"><ClipboardCheck className="h-6 w-6 text-emerald-700" />Payroll History</h1>
        <p className="text-muted-foreground">Submitted, returned, validated, and approved payroll slips.</p>
      </div>
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Slip #</TableHead><TableHead>Beneficiary</TableHead>
                <TableHead>Period</TableHead><TableHead>Net</TableHead><TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slips.length === 0 && <TableRow><TableCell colSpan={5} className="text-muted-foreground text-center">No payroll history yet.</TableCell></TableRow>}
              {slips.map((s) => {
                const c = computeSlip(s);
                return (
                  <TableRow key={s.slipNo}>
                    <TableCell>{s.slipNo}</TableCell>
                    <TableCell>{s.beneficiaryId} — {s.beneficiaryName}</TableCell>
                    <TableCell className="text-xs">{s.payrollPeriod}</TableCell>
                    <TableCell>₱{c.net.toLocaleString()}</TableCell>
                    <TableCell><StatusBadge s={s.status} /></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function Reports() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="flex items-center gap-2"><FileBarChart2 className="h-6 w-6 text-emerald-700" />Payroll Reports</h1>
        <p className="text-muted-foreground">Generate payroll reports based on a payroll period or date range.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { name: "Payroll Summary by Period", desc: "Gross, deductions, and net per beneficiary." },
          { name: "Material Credit Deductions Report", desc: "Credited materials charged in payroll." },
          { name: "Labor Cost Report", desc: "Labor cost entered per beneficiary." },
          { name: "Returned Payroll Slips", desc: "Slips that were returned for correction." },
          { name: "Approved Payroll Register", desc: "Final approved payroll for the period." },
          { name: "Net Payable Summary", desc: "Net income payable per beneficiary." },
        ].map((r) => (
          <Card key={r.name} className="hover:border-emerald-400 transition cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center"><FileBarChart2 className="h-4 w-4" /></div>
                <div>{r.name}</div>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{r.desc}</p>
              <Button variant="outline" size="sm">Generate</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
