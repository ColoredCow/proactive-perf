# Proactive Performance

> From reactive fixes to proactive insight.

---

### 🌱 Background

The idea of proactive performance began when we asked ourselves why we only notice performance when things break. We’d fix issues, move on, and they’d return. It wasn’t that the fixes were wrong, it was that we were always catching up.

We realized we needed to stay ahead—to see performance all the time, not only in crisis. That’s when we built a small internal tool, first for an eCommerce platform, and soon saw that the idea could work anywhere.

Read more about this journey: [Fixing Performance vs Improving Performance →](https://coloredcow.com/fixing-performance-vs-improving-performance/)

---

### 🧩 Foundation

We started applying our proactive performance philosophy to an eCommerce platform. The question we began with was simple: how was the platform’s performance today, yesterday, or this week? Was it stable, improving, or declining?

The first step was visibility. We needed to see how the site was performing, not just when users complained. Why do we only run GTMetrix tests when customers are already noticing issues?

So we built the first version of a tool that could show us the daily performance health of key pages. It gave us a clear picture of how the platform behaved over time and when something started to drift.

**Snapshots from the first version**

| Daily health of the most critical page in the user’s journey | Detailed scores for each page when we needed to dig deeper |
|:--:|:--:|
| <img src="https://github.com/user-attachments/assets/e25b2466-bcee-4f6c-8e4f-a1f8a6f823fb" width="600"> | <img src="https://github.com/user-attachments/assets/db679b52-5031-4e21-ac6b-2695bd63614f" width="600"> |

The platform keeps evolving every day, but from here, we always have visibility on its performance.

---

### ⚙️ Implementation Overview

To build the foundation, we started with simple but reliable components working together.

We used the **GTMetrix API** to run daily tests on key pages. A small **Node.js script** makes API calls for each page, starts the GTMetrix tests, waits for them to complete, and then stores the results in **Google BigQuery**.

The tests are triggered automatically through **GitHub Actions**, scheduled to run at multiple times every day. Once complete, the GTMetrix results are saved into the BigQuery table as structured records.

Finally, **Looker Studio** connects to BigQuery as the data source to create visual dashboards and reports. This gives a live, evolving view of how the platform performs over time — one that updates itself every day.

---

### 🚀 Product Vision

The current implementation works well for a single use case, but to turn it into a product, we need to generalize it and define some core concepts.

1. The system should start with **business context**. Users begin by defining their **business KPIs**.
2. Once those are defined, the product can show how each business KPI depends on **performance KPIs**.
3. Then, the system begins to **measure** these performance KPIs.
4. Measurement will require different tools — for example, **GTMetrix** or **PageSpeed** for front-end performance.
5. It might also need tools like **New Relic** to capture backend performance.
6. Instead of relying on one specific tool, we can introduce **adapters** for each — making GTMetrix, Pingdom, and New Relic optional integrations.
7. These tools become **sensors**, each measuring a specific type of metric: page speed, backend speed, uptime, and more.
8. Users can choose which sensors they want to enable, based on their setup or subscription.
9. Once the sensors are configured, **real-time values of performance KPIs** start reflecting in the system.
10. As users adjust their **business KPIs**, the dependent performance KPIs will also evolve — helping teams see how performance aligns with business goals.

---

#### 📘 Example: An eCommerce Platform

Let’s say an eCommerce platform defines one of its **business KPIs** as
> “Increase checkout conversion rate by 10%.”

To achieve this, the system identifies dependent **performance KPIs** like:

| Business KPI | Dependent Performance KPIs | Sensors/Tools Used |
|---------------|-----------------------------|--------------------|
| Increase checkout conversion by 10% | Checkout page load time < 2s | GTMetrix / PageSpeed |
|  | API response time for cart & payment endpoints < 500ms | New Relic |
|  | Server uptime above 99.9% | Pingdom |

The product now continuously measures these metrics through the connected sensors.
If the checkout page starts loading slower than 2 seconds, the dashboard shows that the **performance KPI** is slipping — which directly threatens the **business KPI**.

This creates a feedback loop where business health and technical performance are visible together.

In short, the product connects *business intent* with *technical visibility*.
It helps teams not just fix performance issues, but understand **why** they matter.

---

### 🧑‍💻 Crafted by

[ColoredCow](https://coloredcow.com)

---

> “We can afford to pause features, but we can’t afford to pause performance.”
