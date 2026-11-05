import React, { useState, useMemo } from 'react';
import { 
  FileText, Upload, AlertTriangle, ShieldAlert, CheckCircle2, 
  Clock, Search, Filter, Eye, ArrowRight, RefreshCw, Scale, 
  FolderCheck, Lock, ExternalLink, ChevronRight, Sparkles, Building2
} from 'lucide-react';

const INITIAL_DOCUMENTS = [
  {
    id: 'doc-001',
    name: 'Master_Services_Agreement_V4.pdf',
    type: 'pdf',
    source: 'upload',
    size: '2.4 MB',
    uploadedAt: '2026-10-31 14:22',
    status: 'Action Required',
    category: 'Commercial Contract',
    confidence: 94,
    riskScore: 'High',
    piiDetected: true,
    entities: {
      governingLaw: 'Delaware, USA',
      parties: ['Acme Corp', 'Global Logistics LLC'],
      value: '$1,200,000 / yr',
      effectiveDate: '2026-11-01'
    },
    suggestedAction: 'Route to Partner for Liability & Indemnity Review',
    summary: 'Standard MSA containing non-standard indemnification caps (Section 12.2) and unredacted PII in Exhibit B.'
  },
  {
    id: 'doc-002',
    name: 'Employment_Offer_Letter_Executive.docx',
    type: 'docx',
    source: 'upload',
    size: '410 KB',
    uploadedAt: '2026-10-31 13:45',
    status: 'Automated Processing',
    category: 'HR / Employment',
    confidence: 98,
    riskScore: 'Low',
    piiDetected: true,
    entities: {
      governingLaw: 'New Jersey, USA',
      parties: ['Apex Legal Group', 'Jane Doe'],
      value: '$240,000 base',
      effectiveDate: '2026-12-01'
    },
    suggestedAction: 'Execute PII Scrubbing Pipeline',
    summary: 'Executive employment agreement adhering to standard firm templates. Requires automated PII masking before archiving.'
  },
  {
    id: 'doc-003',
    name: 'https://docs.google.com/document/d/1BxiMVs0XRA5nFMd.../edit',
    type: 'gdoc',
    source: 'gdoc',
    size: 'Cloud Doc',
    uploadedAt: '2026-10-31 11:10',
    status: 'Verified',
    category: 'Regulatory Filing',
    confidence: 99,
    riskScore: 'Medium',
    piiDetected: false,
    entities: {
      governingLaw: 'SEC Compliance (Federal)',
      parties: ['LexiClass Holdings Inc.'],
      value: 'N/A',
      effectiveDate: '2026-10-15'
    },
    suggestedAction: 'Archive to Compliance Repository',
    summary: 'Quarterly compliance disclosure report. Metadata verified and aligned with SEC Form 8-K guidelines.'
  }
];

export default function App() {
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState('All');
  const [gdocUrl, setGdocUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  // File Upload Handlers
  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      processNewDocument(files[0].name, files[0].name.endsWith('.pdf') ? 'pdf' : 'docx', 'upload', `${(files[0].size / 1024 / 1024).toFixed(1)} MB`);
    }
  };

  const handleGdocSubmit = (e) => {
    e.preventDefault();
    if (!gdocUrl.trim()) return;
    processNewDocument(gdocUrl, 'gdoc', 'gdoc', 'Cloud Doc');
    setGdocUrl('');
  };

  const processNewDocument = (name, type, source, size) => {
    setIsProcessing(true);
    setProcessingStep(1);

    setTimeout(() => setProcessingStep(2), 1200);
    setTimeout(() => setProcessingStep(3), 2400);

    setTimeout(() => {
      const newDoc = {
        id: `doc-${Date.now()}`,
        name: name,
        type: type,
        source: source,
        size: size,
        uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: 'Action Required',
        category: 'Unclassified Intake',
        confidence: 91,
        riskScore: 'High',
        piiDetected: true,
        entities: {
          governingLaw: 'New York, USA',
          parties: ['Pending Extraction'],
          value: 'Pending Extraction',
          effectiveDate: '2026-11-01'
        },
        suggestedAction: 'Review Auto-Extracted Entities & Clause Risk',
        summary: 'Newly uploaded document ingested. Neural classifier flagged potential jurisdiction conflicts.'
      };

      setDocuments(prev => [newDoc, ...prev]);
      setIsProcessing(false);
      setProcessingStep(0);
      setSelectedDoc(newDoc);
    }, 3500);
  };

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            doc.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRisk = filterRisk === 'All' || doc.riskScore === filterRisk;
      return matchesSearch && matchesRisk;
    });
  }, [documents, searchQuery, filterRisk]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 text-amber-400">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-white flex items-center gap-2">
              LexiClass AI <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">ENT-LEGAL</span>
            </h1>
            <p className="text-xs text-slate-400">Legal Document Intake & Classification Workbench</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-xs text-slate-400 border-r border-slate-800 pr-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Classifier Engine Active</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-slate-300">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>SOC2 Type II / PII Shield</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-xs text-amber-400">
              JD
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        
        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard title="Total Intake Volume" value={documents.length} label="Documents processed" icon={FileText} />
          <MetricCard title="Action Required" value={documents.filter(d => d.status === 'Action Required').length} label="Needs partner triage" icon={AlertTriangle} color="amber" />
          <MetricCard title="High Risk Flags" value={documents.filter(d => d.riskScore === 'High').length} label="Liability or PII alerts" icon={ShieldAlert} color="red" />
          <MetricCard title="Auto-Classified Rate" value="96.4%" label="Confidence threshold >90%" icon={CheckCircle2} color="emerald" />
        </div>

        {/* Upload & Ingestion Section */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-medium text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-400" /> Intake Document Queue
              </h2>
              <p className="text-sm text-slate-400">Upload PDF/DOCX agreements or link cloud Google Docs for automated entity and risk classification.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Local File Dropzone */}
            <label className="border-2 border-dashed border-slate-700 hover:border-amber-500/50 bg-slate-950/50 hover:bg-slate-950 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all group">
              <input type="file" onChange={handleFileUpload} accept=".pdf,.docx" className="hidden" />
              <div className="p-3 rounded-full bg-slate-800 group-hover:bg-amber-500/10 text-slate-400 group-hover:text-amber-400 transition-all mb-2">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-slate-200">Drop PDF or DOCX file here</span>
              <span className="text-xs text-slate-500 mt-1">Supports contract files up to 50MB</span>
            </label>

            {/* Google Doc URL Input */}
            <form onSubmit={handleGdocSubmit} className="border border-slate-800 bg-slate-950/50 rounded-lg p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-200 mb-2">
                  <ExternalLink className="w-4 h-4 text-blue-400" /> Link Google Doc URL
                </div>
                <input 
                  type="url" 
                  value={gdocUrl}
                  onChange={(e) => setGdocUrl(e.target.value)}
                  placeholder="https://docs.google.com/document/d/..." 
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <button 
                type="submit" 
                disabled={!gdocUrl.trim() || isProcessing}
                className="mt-4 w-full bg-slate-800 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider py-2.5 rounded transition-colors flex items-center justify-center gap-2"
              >
                Ingest Cloud Document
              </button>
            </form>
          </div>

          {/* Real-time Ingestion Stepper Modal / Status */}
          {isProcessing && (
            <div className="bg-slate-950 border border-amber-500/30 rounded-lg p-4 space-y-3 animate-pulse">
              <div className="flex items-center justify-between text-xs text-amber-400 font-mono">
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" /> EXECUTING NEURAL CLASSIFIER PIPELINE...
                </span>
                <span>STEP {processingStep} OF 3</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <ProcessingStep title="1. Text Parsing & OCR" active={processingStep >= 1} />
                <ProcessingStep title="2. Entity Extraction" active={processingStep >= 2} />
                <ProcessingStep title="3. Risk Assessment" active={processingStep >= 3} />
              </div>
            </div>
          )}
        </section>

        {/* Audit Queue Table */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          {/* Controls */}
          <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search contracts or categories..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <Filter className="w-4 h-4 text-slate-400" />
              <select 
                value={filterRisk} 
                onChange={(e) => setFilterRisk(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-amber-500"
              >
                <option value="All">All Risk Levels</option>
                <option value="High">High Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="Low">Low Risk</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-xs uppercase font-mono text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3">Document</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Confidence</th>
                  <th className="px-6 py-3">Risk Assessment</th>
                  <th className="px-6 py-3">Suggested Workflow</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-100 max-w-xs truncate">
                      <div className="flex items-center gap-3">
                        <FileIcon type={doc.type} />
                        <div>
                          <div className="truncate font-semibold">{doc.name}</div>
                          <div className="text-xs text-slate-500">{doc.size} • {doc.uploadedAt}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      <span className="text-emerald-400 font-semibold">{doc.confidence}%</span>
                    </td>
                    <td className="px-6 py-4">
                      <RiskBadge level={doc.riskScore} pii={doc.piiDetected} />
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 max-w-xs truncate">
                      {doc.suggestedAction}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedDoc(doc)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-amber-600 text-slate-200 text-xs rounded transition-colors flex items-center gap-1.5 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Document Detail Drawer */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-xl bg-slate-900 h-full border-l border-slate-800 p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <FileIcon type={selectedDoc.type} />
                  <div>
                    <h3 className="font-semibold text-slate-100 text-lg truncate max-w-md">{selectedDoc.name}</h3>
                    <p className="text-xs text-slate-400">ID: {selectedDoc.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedDoc(null)}
                  className="text-slate-400 hover:text-white text-sm px-2 py-1 bg-slate-800 rounded"
                >
                  ✕
                </button>
              </div>

              {/* Classification Overview */}
              <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">CLASSIFICATION ENGINE VERDICT</span>
                  <span className="text-amber-400 font-bold">{selectedDoc.confidence}% Match</span>
                </div>
                <div className="text-xl font-bold text-slate-100">{selectedDoc.category}</div>
                <p className="text-sm text-slate-300 leading-relaxed">{selectedDoc.summary}</p>
              </div>

              {/* Extracted Legal Entities */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-mono text-slate-400">Extracted Legal Entities</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <EntityBox label="Governing Law" value={selectedDoc.entities.governingLaw} />
                  <EntityBox label="Financial Consideration" value={selectedDoc.entities.value} />
                  <EntityBox label="Effective Date" value={selectedDoc.entities.effectiveDate} />
                  <EntityBox label="Parties Involved" value={selectedDoc.entities.parties.join(', ')} />
                </div>
              </div>

              {/* Automated Next Step */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase">
                  <Sparkles className="w-4 h-4" /> Recommended Workflow Action
                </div>
                <p className="text-sm text-slate-200 font-medium">{selectedDoc.suggestedAction}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-slate-800 pt-4 flex gap-3">
              <button className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-medium py-2 rounded text-sm transition-colors">
                Approve & Route
              </button>
              <button 
                onClick={() => setSelectedDoc(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-components
function MetricCard({ title, value, label, icon: Icon, color = 'amber' }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
      <div className="flex items-center justify-between text-slate-400">
        <span className="text-xs font-medium uppercase font-mono">{title}</span>
        <Icon className={`w-5 h-5 text-${color}-400`} />
      </div>
      <div className="text-2xl font-bold text-slate-100">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function RiskBadge({ level, pii }) {
  const isHigh = level === 'High';
  return (
    <div className="flex items-center gap-2">
      <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
        isHigh ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
      }`}>
        {level} Risk
      </span>
      {pii && (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
          PII
        </span>
      )}
    </div>
  );
}

function FileIcon({ type }) {
  if (type === 'pdf') return <FileText className="w-8 h-8 text-red-400" />;
  if (type === 'docx') return <FileText className="w-8 h-8 text-blue-400" />;
  return <ExternalLink className="w-8 h-8 text-emerald-400" />;
}

function ProcessingStep({ title, active }) {
  return (
    <div className={`p-2 rounded border text-center text-xs font-mono transition-all ${
      active ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-600'
    }`}>
      {title}
    </div>
  );
}

function EntityBox({ label, value }) {
  return (
    <div className="bg-slate-950 p-3 rounded border border-slate-800">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-medium text-slate-200 mt-1">{value}</div>
    </div>
  );
}