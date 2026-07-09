const sectionButtons = document.querySelectorAll("[data-section]");
const actionButtons = document.querySelectorAll("[data-section-target]");
const sections = document.querySelectorAll(".section");

function showSection(id) {
  sections.forEach((section) => {
    section.classList.toggle("active", section.id === id);
  });
  sectionButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.section === id);
  });
}

sectionButtons.forEach((button) => {
  button.addEventListener("click", () => showSection(button.dataset.section));
});

actionButtons.forEach((button) => {
  button.addEventListener("click", () => showSection(button.dataset.sectionTarget));
});

const principleText = document.getElementById("principle-text");
const principleCopy = {
  traceable:
    "Evidence-source tags separate financial facts, management communication, market data, and model output.",
  calibrated:
    "The page uses “Review Trigger: High” instead of “Red Alert” so analysts treat it as a prompt for judgement, not an automated decision.",
  actionable:
    "The prototype ends with concrete next actions: monitoring notes, further financial review, memo update, or watchlist discussion.",
};

document.querySelectorAll(".principle").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".principle").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    principleText.textContent = principleCopy[button.dataset.principle];
  });
});

document.querySelectorAll(".rule").forEach((rule) => {
  rule.addEventListener("click", () => {
    document.querySelectorAll(".rule").forEach((item) => item.classList.remove("active-rule"));
    rule.classList.add("active-rule");
  });
});

const boeingCalls = {
  "2024q1": {
    label: "2024 Q1",
    date: "2024-04-24",
    alert: "Baseline",
    summary:
      "First transcript in the pilot window. Tone is usable, but no rolling expected-tone baseline exists yet. Market risk is shown as a pre-call forecast.",
    bars: [0, 83],
    labels: ["n/a", "83%"],
    metricLabels: ["Tone baseline", "Risk-term intensity"],
  },
  "2024q2": {
    label: "2024 Q2",
    date: "2024-07-31",
    alert: "Monitor",
    summary:
      "Management tone is better than Boeing's prior baseline, while risk-language intensity remains high. The market forecast is an independent context signal.",
    bars: [0, 99],
    labels: ["delight 0.0033", "99%"],
    metricLabels: ["Tone delight", "Risk-term intensity"],
  },
  "2024q3": {
    label: "2024 Q3",
    date: "2024-10-23",
    alert: "High",
    summary:
      "Strongest management-tone disappointment in the pilot. The pre-call market forecast provides a separate risk anchor before the communication evidence is reviewed.",
    bars: [100, 73],
    labels: ["0.0144", "73%"],
    metricLabels: ["Tone disappointment", "Risk-term intensity"],
  },
  "2024q4": {
    label: "2024 Q4",
    date: "2025-01-28",
    alert: "High",
    summary:
      "Management tone is below expected tone, while strike effects, charges, and cash-flow pressure remain credit-relevant. The market forecast is available without using post-call data.",
    bars: [24, 77],
    labels: ["0.0034", "77%"],
    metricLabels: ["Tone disappointment", "Risk-term intensity"],
  },
  "2025q1": {
    label: "2025 Q1",
    date: "2025-04-23",
    alert: "Amber",
    summary:
      "Management tone underperforms the rolling baseline. The unusually wide spread across market models should prompt uncertainty-aware review, not an automated downgrade.",
    bars: [39, 64],
    labels: ["0.0055", "64%"],
    metricLabels: ["Tone disappointment", "Risk-term intensity"],
  },
  "2025q2": {
    label: "2025 Q2",
    date: "2025-07-29",
    alert: "Monitor",
    summary:
      "Management tone is better than expected, so the tone signal is delight rather than disappointment. Market context remains separate from this communication signal.",
    bars: [0, 61],
    labels: ["delight 0.0056", "61%"],
    metricLabels: ["Tone delight", "Risk-term intensity"],
  },
  "2025q3": {
    label: "2025 Q3",
    date: "2025-10-29",
    alert: "High",
    summary:
      "Highest risk-term intensity in both management remarks and Q&A. Tone disappointment is mild, so the design keeps risk-language density, sentiment surprise, and market forecast distinct.",
    bars: [6, 100],
    labels: ["0.0008", "100%"],
    metricLabels: ["Tone disappointment", "Risk-term intensity"],
  },
  "2025q4": {
    label: "2025 Q4",
    date: "2026-01-27",
    alert: "Monitor",
    summary:
      "Management tone is better than expected, so this is tone delight. The market forecast remains an independent monitoring input rather than confirmation of tone.",
    bars: [0, 76],
    labels: ["delight 0.0046", "76%"],
    metricLabels: ["Tone delight", "Risk-term intensity"],
  },
  "2026q1": {
    label: "2026 Q1",
    date: "2026-04-22",
    alert: "Monitor",
    summary:
      "Management tone is better than the rolling baseline, so this is tone delight. The displayed market estimate uses only information available before the call.",
    bars: [0, 85],
    labels: ["delight 0.0078", "85%"],
    metricLabels: ["Tone delight", "Risk-term intensity"],
  },
};

const boeingForecasts = Object.fromEntries(
  (window.BA_VOLATILITY_FORECAST || []).map((row) => [row.earnings_call_date, row]),
);

function percent(value) {
  return value == null ? "Not available" : `${(Number(value) * 100).toFixed(1)}%`;
}

function updateBoeingCall(key) {
  const call = boeingCalls[key];
  document.getElementById("call-label").textContent = call.label;
  document.getElementById("call-alert").textContent = call.alert;
  document.getElementById("call-alert").style.color = call.alert.includes("High")
    ? "var(--red)"
    : call.alert.includes("Amber")
      ? "var(--amber)"
      : "var(--teal)";
  document.getElementById("call-summary").textContent = call.summary;
  const forecast = boeingForecasts[call.date];
  const bars = [...call.bars, forecast ? Math.min(forecast.selected_forecast_60d * 100, 100) : 0];
  const labels = [...call.labels, forecast ? percent(forecast.selected_forecast_60d) : "Not available"];
  const metricLabels = [...call.metricLabels, "60-day market forecast"];
  ["one", "two", "three"].forEach((name, index) => {
    const value = bars[index];
    document.getElementById(`bar-${name}`).style.width = `${value}%`;
    document.getElementById(`bar-${name}-label`).textContent = metricLabels[index];
    document.getElementById(`bar-${name}-text`).textContent = labels[index];
  });
}

document.querySelectorAll(".time-point").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".time-point").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    updateBoeingCall(button.dataset.call);
  });
});

const nvdaCalls = {
  "2024q4": {
    period: "NVDA 2024 Q4",
    trigger: "Watch Trigger: Narrative Review",
    summary:
      "Highest tone disappointment in the NVDA pilot. It is useful for testing whether analysts treat a softer-than-expected AI narrative as a monitoring cue rather than as an automatic downgrade.",
    bars: [100, 69, 51],
    labels: ["0.0062", "11.88", "34.4%"],
    metricLabels: ["Tone disappointment", "Risk intensity", "Historical market context"],
    themes: ["AI demand expectations", "Semiconductor cycle", "Rating headroom"],
  },
  "2025q4": {
    period: "NVDA 2025 Q4",
    trigger: "Watch Trigger: Narrative Context",
    summary:
      "Tone is positive while historical market context is elevated. The case shows why communication, market context, and credit themes should not be collapsed into one score.",
    bars: [80, 67, 84],
    labels: ["delight 0.0056", "11.62", "56.8%"],
    metricLabels: ["Tone delight", "Risk intensity", "Historical market context"],
    themes: ["Valuation sensitivity", "AI capex cycle", "Market volatility"],
  },
  "2026q1": {
    period: "NVDA 2026 Q1",
    trigger: "Watch Trigger: Thematic Review",
    summary:
      "Highest risk intensity in the NVDA pilot, driven by export-control and China-market themes. The design prompts thematic credit review without claiming a forward market forecast.",
    bars: [84, 100, 100],
    labels: ["0.0052", "17.28", "67.3%"],
    metricLabels: ["Tone disappointment", "Risk intensity", "Historical market context"],
    themes: ["Export controls", "China exposure", "Inventory charge"],
  },
  "2026q4": {
    period: "NVDA 2026 Q4",
    trigger: "Watch Trigger: Positive Narrative Check",
    summary:
      "Highest tone delight in the NVDA pilot. The analyst task is to avoid treating a strongly positive AI narrative as automatically low credit risk.",
    bars: [100, 68, 48],
    labels: ["delight 0.0070", "11.82", "32.2%"],
    metricLabels: ["Tone delight", "Risk intensity", "Historical market context"],
    themes: ["Positive AI narrative", "Margin durability", "Customer concentration"],
  },
};

function updateNvdaCall(key) {
  const call = nvdaCalls[key];
  document.getElementById("nvda-period").textContent = call.period;
  document.getElementById("nvda-trigger").textContent = call.trigger;
  document.getElementById("nvda-summary").textContent = call.summary;
  ["one", "two", "three"].forEach((name, index) => {
    document.getElementById(`nvda-bar-${name}`).style.width = `${call.bars[index]}%`;
    document.getElementById(`nvda-bar-${name}-label`).textContent = call.metricLabels[index];
    document.getElementById(`nvda-bar-${name}-text`).textContent = call.labels[index];
  });
  document.getElementById("nvda-themes").innerHTML = call.themes.map((theme) => `<span>${theme}</span>`).join("");
}

document.querySelectorAll(".nvda-tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".nvda-tab").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    updateNvdaCall(button.dataset.nvdaCall);
  });
});

const prototypeScenarios = {
  "2024q3": {
    event: "The Boeing Company (BA) · 2024 Q3 Earnings Call",
    date: "2024-10-23",
    trigger: "Review Trigger: High",
    toneLabel: "Tone disappointment",
    toneValue: "0.0144",
    toneNote: "Unexpectedly negative",
    riskValue: "8.78",
    positive: ["Backlog and long-term demand remain supportive.", "Recovery narrative is still present."],
    risks: [
      "Management tone is materially worse than its rolling baseline.",
      "Labour disruption and program execution remain credit-relevant.",
    ],
    interpretation:
      "Tone disappointment is the strongest in the pilot. The pre-call market forecast anchors risk expectations, while communication evidence determines what deserves review.",
    themes: ["Labour disruption", "Production recovery", "Cash-flow pressure", "Execution credibility"],
    why: [
      "Tone disappointment is the highest observed in the Boeing pilot.",
      "Labour disruption and execution credibility appear alongside a still-positive recovery narrative.",
      "The trigger asks for human review because communication evidence adds context that a market forecast cannot explain alone.",
    ],
    changed: [
      "Management communication is more negative than the rolling tone baseline.",
      "The call shifts attention from demand strength toward near-term execution and cash-flow credibility.",
      "The analyst task changes from passive monitoring to checking whether assumptions need revision.",
    ],
    unknown: [
      "The pilot does not prove that this tone signal predicts default.",
      "The system does not know internal rating-committee thresholds or private issuer information.",
      "Tone-adjusted sigma is not activated without larger-panel validation.",
    ],
    defaultAction: "review",
  },
  "2024q4": {
    event: "The Boeing Company (BA) · 2024 Q4 Earnings Call",
    date: "2025-01-28",
    trigger: "Review Trigger: High",
    toneLabel: "Tone disappointment",
    toneValue: "0.0034",
    toneNote: "Mildly worse than expected",
    riskValue: "9.27",
    positive: ["Liquidity and backlog support recovery capacity.", "Management still presents a recovery pathway."],
    risks: [
      "The market forecast remains material and should be reviewed with its model range.",
      "Strike effects, charges, and cash-flow pressure require credit review.",
    ],
    interpretation:
      "Tone disappointment is not the largest. The dashboard keeps the pre-call market estimate separate from management communication and operational credit themes.",
    themes: ["Negative free cash flow", "Strike effects", "Program charges", "Liquidity review"],
    why: [
      "The pre-call market forecast provides a transparent quantitative anchor.",
      "Strike effects, charges, and free-cash-flow pressure create a credit-relevant review case.",
      "The trigger is driven by combined market context and credit-relevant operating evidence, not tone alone.",
    ],
    changed: [
      "The case moves from recovery narrative tracking to financial resilience review.",
      "The forecast range makes uncertainty visible while liquidity and cash-flow assumptions are revisited.",
      "The analyst should document how operational disruption affects the credit story.",
    ],
    unknown: [
      "Volatility is an equity-market proxy, not a direct asset-volatility estimate.",
      "The prototype cannot infer management's true intent from tone.",
      "A high trigger does not mean an automatic outlook or rating change.",
    ],
    defaultAction: "memo",
  },
  "2025q3": {
    event: "The Boeing Company (BA) · 2025 Q3 Earnings Call",
    date: "2025-10-29",
    trigger: "Review Trigger: High",
    toneLabel: "Tone disappointment",
    toneValue: "0.0008",
    toneNote: "Small disappointment",
    riskValue: "12.03",
    positive: ["Free cash flow and backlog signals are constructive.", "Demand narrative remains strong."],
    risks: [
      "Risk-term intensity is the highest in the pilot.",
      "Certification, delivery timing, and program charge themes dominate the review case.",
    ],
    interpretation:
      "Risk-language density is high while tone disappointment is mild. This case tests whether analysts can avoid collapsing different evidence types into one sentiment score.",
    themes: ["777X charge", "Certification delay", "Supply chain", "Risk-language density"],
    why: [
      "Risk-term intensity is the highest in the Boeing pilot.",
      "Certification delay, program charge, and supply-chain themes are directly credit-relevant.",
      "The trigger separates risk-language density from simple negative sentiment.",
    ],
    changed: [
      "The call contains more concentrated risk language even though tone disappointment is small.",
      "The review focus shifts toward whether operational issues have become structural rather than temporary.",
      "The analyst should test whether management's recovery narrative is still credible.",
    ],
    unknown: [
      "The trigger does not rank which risk theme will materialise first.",
      "The system cannot determine whether risk terms reflect disclosure discipline or true deterioration.",
      "Single-company evidence is not enough to set universal thresholds.",
    ],
    defaultAction: "watchlist",
  },
  "2026q1": {
    event: "The Boeing Company (BA) · 2026 Q1 Earnings Call",
    date: "2026-04-22",
    trigger: "Review Trigger: Monitor",
    toneLabel: "Tone delight",
    toneValue: "0.0078",
    toneNote: "Better than expected",
    riskValue: "10.17",
    positive: ["Management tone is better than the rolling baseline.", "Production and demand signals look more constructive."],
    risks: [
      "Risk-term intensity remains material.",
      "The market forecast remains a model estimate and should not be treated as a rating decision.",
    ],
    interpretation:
      "Tone delight should reduce alarm, but high risk-language density and the pre-call market forecast keep the case in monitoring rather than closure.",
    themes: ["Tone delight", "Market forecast", "Execution risk", "Monitoring"],
    why: [
      "Tone is better than expected, so this is not a distress-style tone alert.",
      "Risk-term intensity remains material and the forecast is only one input to review.",
      "The trigger keeps the case visible without escalating beyond available evidence.",
    ],
    changed: [
      "The communication signal improves relative to the rolling baseline.",
      "The analyst can reduce immediate alarm but should not close the review because execution risk remains present.",
      "The next action becomes monitoring rather than memo escalation.",
    ],
    unknown: [
      "A market forecast is uncertain and should not be treated as conclusive.",
      "The tool does not know whether private issuer discussions would confirm the improved tone.",
      "Positive tone does not eliminate operational or liquidity risk.",
    ],
    defaultAction: "monitor",
  },
};

const actionCopy = {
  monitor: {
    title: "Add to monitoring notes",
    rationale: "Record the signal and revisit after additional market data or the next earnings update.",
  },
  review: {
    title: "Request financial review",
    rationale: "Check whether operational disruption, free-cash-flow guidance, and liquidity assumptions need to be revised.",
  },
  memo: {
    title: "Update credit memo",
    rationale: "Document the mixed evidence and update the analyst's risk narrative with tone, risk-language, and volatility context.",
  },
  watchlist: {
    title: "Escalate to watchlist",
    rationale: "Move the case into a higher-priority discussion when risk-language density and credit themes justify senior review.",
  },
};

function setList(id, items) {
  const list = document.getElementById(id);
  list.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

function setAction(actionKey) {
  const action = actionCopy[actionKey];
  document.querySelectorAll(".action-choice").forEach((button) => {
    button.classList.toggle("active", button.dataset.action === actionKey);
  });
  document.getElementById("proto-action-title").textContent = action.title;
  document.getElementById("proto-action-rationale").textContent = action.rationale;
  document.getElementById("proto-module-action-title").textContent = action.title;
  document.getElementById("proto-module-action-rationale").textContent = action.rationale;
}

function updatePrototype(key) {
  const scenario = prototypeScenarios[key];
  const forecast = boeingForecasts[scenario.date];
  document.getElementById("proto-event-label").textContent = scenario.event;
  document.getElementById("proto-trigger-title").textContent = scenario.trigger;
  document.getElementById("proto-tone-label").textContent = scenario.toneLabel;
  document.getElementById("proto-tone-value").textContent = scenario.toneValue;
  document.getElementById("proto-tone-note").textContent = scenario.toneNote;
  document.getElementById("proto-risk-value").textContent = scenario.riskValue;
  document.getElementById("proto-market-forecast").textContent = percent(forecast?.selected_forecast_60d);
  document.getElementById("proto-market-range").textContent = forecast
    ? `${percent(forecast.model_range_low)}-${percent(forecast.model_range_high)}`
    : "Not available";
  document.getElementById("proto-hist-sigma").textContent = percent(forecast?.historical_sigma_60d);
  document.getElementById("proto-model-name").textContent = forecast?.selected_model || "Not available";
  document.getElementById("proto-naive").textContent = percent(forecast?.forecast_naive_60d);
  document.getElementById("proto-ewma").textContent = percent(forecast?.forecast_ewma_60d);
  document.getElementById("proto-garch").textContent = percent(forecast?.forecast_garch_60d);
  document.getElementById("proto-cutoff").textContent = forecast
    ? `Information cutoff: ${forecast.information_cutoff}`
    : "Information cutoff unavailable";
  document.getElementById("proto-interpretation").textContent = scenario.interpretation;
  document.getElementById("proto-themes").innerHTML = scenario.themes.map((theme) => `<span>${theme}</span>`).join("");
  setList("proto-positive-list", scenario.positive);
  setList("proto-risk-list", scenario.risks);
  setList("proto-why-list", scenario.why);
  setList("proto-changed-list", scenario.changed);
  setList("proto-unknown-list", scenario.unknown);
  setAction(scenario.defaultAction);
}

document.querySelectorAll(".prototype-tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".prototype-tab").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    updatePrototype(button.dataset.prototypeCall);
  });
});

document.querySelectorAll(".action-choice").forEach((button) => {
  button.addEventListener("click", () => setAction(button.dataset.action));
});

updateBoeingCall("2024q3");
updateNvdaCall("2024q4");
updatePrototype("2024q3");
