"use client";

import { useMemo, useState } from "react";

type MoneyField = "cash" | "goldSilver" | "investments" | "business" | "receivables" | "other" | "liabilities";
type Values = Record<MoneyField, string>;
type NisabMode = "silver" | "gold" | "custom";

const initialValues: Values = { cash: "", goldSilver: "", investments: "", business: "", receivables: "", other: "", liabilities: "" };

const currencies = [
  ["INR", "₹"], ["USD", "$"], ["GBP", "£"], ["EUR", "€"], ["AED", "د.إ"], ["PKR", "₨"], ["BDT", "৳"],
] as const;

const assetFields: Array<{ key: Exclude<MoneyField, "liabilities">; label: string; help: string }> = [
  { key: "cash", label: "Cash & bank balances", help: "Cash, savings and accessible account balances" },
  { key: "goldSilver", label: "Gold & silver value", help: "Current Zakatable market value, not purchase price" },
  { key: "investments", label: "Investments", help: "Zakatable shares, funds, crypto or similar holdings" },
  { key: "business", label: "Business assets", help: "Cash, saleable stock and trade inventory" },
  { key: "receivables", label: "Money owed to you", help: "Amounts reasonably expected to be repaid" },
  { key: "other", label: "Other Zakatable wealth", help: "Any other qualifying wealth not entered above" },
];

function amount(value: string) {
  const number = Number(value.replaceAll(",", ""));
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function MoneyInput({ label, help, value, symbol, onChange }: { label: string; help: string; value: string; symbol: string; onChange: (value: string) => void }) {
  return (
    <label className="calculator-money-field">
      <span><strong>{label}</strong><small>{help}</small></span>
      <div><b>{symbol}</b><input inputMode="decimal" min="0" type="number" value={value} onChange={(event) => onChange(event.target.value)} placeholder="0" /></div>
    </label>
  );
}

export default function ZakatCalculator() {
  const [values, setValues] = useState<Values>(initialValues);
  const [currency, setCurrency] = useState("INR");
  const [nisabMode, setNisabMode] = useState<NisabMode>("silver");
  const [metalPrice, setMetalPrice] = useState("");
  const [customNisab, setCustomNisab] = useState("");
  const [hawlComplete, setHawlComplete] = useState(true);

  const symbol = currencies.find(([code]) => code === currency)?.[1] ?? currency;
  const result = useMemo(() => {
    const assets = assetFields.reduce((total, field) => total + amount(values[field.key]), 0);
    const liabilities = amount(values.liabilities);
    const net = Math.max(0, assets - liabilities);
    const nisab = nisabMode === "custom" ? amount(customNisab) : amount(metalPrice) * (nisabMode === "silver" ? 612.36 : 87.48);
    const thresholdReady = nisab > 0;
    const meetsNisab = thresholdReady && net >= nisab;
    const due = hawlComplete && meetsNisab ? net * 0.025 : 0;
    return { assets, liabilities, net, nisab, thresholdReady, meetsNisab, due };
  }, [customNisab, hawlComplete, metalPrice, nisabMode, values]);

  const format = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
  const updateValue = (key: MoneyField, value: string) => setValues((current) => ({ ...current, [key]: value }));

  return (
    <section className="working-calculator zakat-working-area">
      <div className="calculator-form-card">
        <div className="calculator-card-head"><div><span>01</span><div><strong>Your Zakatable wealth</strong><small>Enter current values in one currency</small></div></div><select value={currency} onChange={(event) => setCurrency(event.target.value)} aria-label="Currency">{currencies.map(([code, mark]) => <option value={code} key={code}>{code} · {mark}</option>)}</select></div>
        <div className="calculator-field-list">
          {assetFields.map((field) => <MoneyInput key={field.key} {...field} symbol={symbol} value={values[field.key]} onChange={(value) => updateValue(field.key, value)} />)}
          <MoneyInput label="Short-term liabilities" help="Eligible debts or bills due within the coming year" symbol={symbol} value={values.liabilities} onChange={(value) => updateValue("liabilities", value)} />
        </div>

        <div className="calculator-subsection">
          <div className="calculator-card-head"><div><span>02</span><div><strong>Choose your Nisab</strong><small>Use today’s local price per gram</small></div></div></div>
          <div className="nisab-tabs" role="group" aria-label="Nisab method">
            {(["silver", "gold", "custom"] as NisabMode[]).map((mode) => <button className={nisabMode === mode ? "active" : ""} type="button" onClick={() => setNisabMode(mode)} key={mode}>{mode === "silver" ? "Silver · 612.36g" : mode === "gold" ? "Gold · 87.48g" : "Custom threshold"}</button>)}
          </div>
          {nisabMode === "custom"
            ? <MoneyInput label="Custom Nisab amount" help="Use a threshold provided by your trusted scholar or institution" symbol={symbol} value={customNisab} onChange={setCustomNisab} />
            : <MoneyInput label={"Current " + nisabMode + " price per gram"} help={"NOOR multiplies this by " + (nisabMode === "silver" ? "612.36g" : "87.48g")} symbol={symbol} value={metalPrice} onChange={setMetalPrice} />}
          <label className="calculator-check"><input type="checkbox" checked={hawlComplete} onChange={(event) => setHawlComplete(event.target.checked)} /><span><strong>A full lunar year has passed</strong><small>Keep checked only when the Hawl condition applies to this wealth.</small></span></label>
        </div>
      </div>

      <aside className="calculator-result-card">
        <span>ZAKAT ESTIMATE</span>
        <div className="calculator-result-total"><small>Estimated Zakat</small><strong>{format(result.due)}</strong><p>{result.due > 0 ? "2.5% of your net Zakatable wealth" : !result.thresholdReady ? "Enter a Nisab value to finish" : !hawlComplete ? "Hawl not marked complete" : "Net wealth is below the selected Nisab"}</p></div>
        <div className="calculator-result-rows">
          <div><span>Total assets</span><strong>{format(result.assets)}</strong></div>
          <div><span>Less liabilities</span><strong>− {format(result.liabilities)}</strong></div>
          <div><span>Net Zakatable wealth</span><strong>{format(result.net)}</strong></div>
          <div><span>Selected Nisab</span><strong>{result.thresholdReady ? format(result.nisab) : "Not set"}</strong></div>
        </div>
        <div className={"calculator-status " + (result.meetsNisab && hawlComplete ? "due" : "")}><b>{result.meetsNisab && hawlComplete ? "✓" : "i"}</b><span><strong>{result.meetsNisab && hawlComplete ? "Estimate ready" : "Review the conditions"}</strong><small>{result.meetsNisab && hawlComplete ? "Confirm any complex assets or debts before paying." : "Nisab, Hawl and ownership must all be considered."}</small></span></div>
        <button className="calculator-reset" type="button" onClick={() => { setValues(initialValues); setMetalPrice(""); setCustomNisab(""); }}>Clear calculator</button>
        <p className="calculator-privacy">Private calculation · values are not stored or sent to NOOR</p>
      </aside>
    </section>
  );
}
