import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import ScrollReveal from '@/components/ScrollReveal';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';

const blogContent: Record<string, {
  title: string;
  date: string;
  readTime: string;
  tag: string;
  image: string;
  content: string;
}> = {
  'data-driven-ev-battery-degradation': {
    title: 'Data-Driven Models Improve Accuracy in Predicting EV Battery Degradation',
    date: 'Mar 15, 2025',
    readTime: '8 min',
    tag: 'Research',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=500&fit=crop',
    content: `Rising carbon emissions have significantly challenged sustainable development in recent years, prompting global efforts to implement carbon reduction policies and achieve long-term carbon neutrality. A crucial step in this transition involves electric vehicles and the batteries that power them.

## Why Data-Driven Models Matter

Traditional physics-based battery degradation models require deep knowledge of electrochemistry and are often specific to a single battery chemistry or manufacturer. Data-driven approaches, on the other hand, can learn degradation patterns directly from cycling data — making them more generalizable and easier to deploy across diverse fleets.

Recent research from Microsoft and leading universities has demonstrated that machine learning models trained on real-world battery cycling data can predict State of Health (SOH) with remarkable accuracy. These models analyze patterns in voltage curves, temperature profiles, and impedance measurements to forecast future capacity fade.

## Key Findings

**Multi-feature analysis outperforms single-metric approaches.** Models that ingest multiple sensor features simultaneously — voltage, current, temperature, impedance, cycle count, depth of discharge, and C-rate — achieve 3-5% higher accuracy than those relying on a single degradation indicator.

**Transfer learning enables cross-chemistry predictions.** A model trained on NMC battery data can be fine-tuned with a small amount of LFP data to predict LFP degradation accurately, reducing the data requirements for new battery types by up to 80%.

**Early-cycle data is highly predictive.** Remarkably, models trained on just the first 100 cycles of battery data can predict end-of-life capacity with less than 5% error. This means fleet operators can get accurate lifetime predictions within weeks of deploying new batteries.

## Implications for Fleet Operators

For fleet managers running hundreds or thousands of EVs, these advances mean:

- **Accurate replacement planning**: Know which batteries will need replacement 6-12 months in advance
- **Optimized charging strategies**: Identify which charging patterns accelerate or slow degradation
- **Chemistry-agnostic monitoring**: Use a single platform across mixed-chemistry fleets
- **Reduced data requirements**: Get meaningful predictions with limited historical data

## BatteryIQ's Approach

At BatteryIQ, we've implemented these research findings in production. Our 4 ML models — trained on NASA's battery cycling dataset and augmented with real-world fleet data — analyze 17 sensor features to deliver SOH predictions with 97%+ accuracy. The models run in real time, processing telemetry data as it streams from your batteries.

The result: fleet operators can predict battery failures weeks before they happen, optimize charging schedules based on individual battery degradation curves, and make data-driven decisions about battery replacement and second-life applications.`,
  },
  'lfp-vs-nmc-fleet-comparison': {
    title: 'LFP vs NMC: Which Battery Chemistry is Right for Your Fleet?',
    date: 'Feb 28, 2025',
    readTime: '12 min',
    tag: 'Technology',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1200&h=500&fit=crop',
    content: `Choosing the right battery chemistry is one of the most consequential decisions a fleet operator makes. The two dominant chemistries in commercial EVs — Lithium Iron Phosphate (LFP) and Nickel Manganese Cobalt (NMC) — have fundamentally different characteristics that affect total cost of ownership, operational flexibility, and safety.

## LFP (Lithium Iron Phosphate)

**Advantages:**
- **Superior cycle life**: LFP batteries typically last 3,000-5,000 cycles vs 1,000-2,000 for NMC, making them ideal for high-utilization fleets like city buses and delivery vans
- **Thermal stability**: LFP has a much higher thermal runaway temperature (~270°C vs ~210°C for NMC), significantly reducing fire risk
- **Lower cost**: No cobalt or nickel means LFP is 20-30% cheaper per kWh
- **Flat voltage curve**: Makes SOC estimation more challenging but provides consistent power delivery

**Best for**: City buses, last-mile delivery vans, warehouse forklifts, and any application prioritizing longevity and safety over range.

## NMC (Nickel Manganese Cobalt)

**Advantages:**
- **Higher energy density**: 150-220 Wh/kg vs 90-160 Wh/kg for LFP, meaning more range per kilogram
- **Better cold-weather performance**: NMC retains more capacity at low temperatures
- **Mature supply chain**: Wider availability of cells and packs from major manufacturers

**Best for**: Long-haul trucks, intercity buses, and any application where range is the primary constraint.

## How BatteryIQ Handles Both

Our ML models are chemistry-aware. When you input battery data, the system automatically adjusts its degradation predictions based on the chemistry type. LFP batteries degrade more linearly, while NMC batteries show a characteristic "knee" in their capacity fade curve — our models capture both patterns accurately.

We also provide chemistry-specific maintenance recommendations. For example, LFP batteries benefit from occasional full charges (to reset SOC calibration), while NMC batteries last longer when kept between 20-80% SOC.

## The Verdict

There's no universal "best" chemistry. The right choice depends on your fleet's specific use case: daily mileage, operating temperatures, budget constraints, and vehicle weight limits. BatteryIQ's analytics platform helps you monitor both chemistries equally well, and our ROI calculator can model the long-term cost implications of each choice for your specific fleet profile.`,
  },
  'predictive-maintenance-fleet-savings': {
    title: 'How Predictive Maintenance Saved a Fleet $2.4M in One Year',
    date: 'Feb 10, 2025',
    readTime: '6 min',
    tag: 'Case Study',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&h=500&fit=crop',
    content: `A 200-vehicle electric logistics fleet operating in Maharashtra, India, was facing a familiar problem: unpredictable battery failures causing costly unplanned downtime. Each failure meant a vehicle off the road for 3-5 days, emergency battery procurement at premium prices, and missed delivery SLAs.

## The Challenge

Before implementing BatteryIQ, the fleet operated on a time-based maintenance schedule — batteries were inspected every 6 months regardless of condition. This approach had two problems:

1. **Over-maintenance**: Healthy batteries were being pulled for unnecessary inspections, wasting technician time
2. **Under-maintenance**: Degraded batteries were failing between inspection windows, causing surprise breakdowns

The fleet experienced an average of 4-5 unplanned battery failures per month, each costing ₹8-12 lakhs ($10,000-$15,000) in emergency replacement, towing, and lost revenue.

## The Solution

The fleet deployed BatteryIQ across all 200 vehicles over a 3-week rollout:

1. **Sensor Array Kits** were retrofitted to existing battery packs (2-hour installation per vehicle)
2. **Fleet Gateways** were installed at each depot to aggregate telemetry data
3. **BatteryIQ Pro** provided AI-powered monitoring with predictive alerts

## Results After 12 Months

- **Battery replacement costs**: Down 45% (from ₹2.4 Cr to ₹1.32 Cr)
- **Unplanned downtime**: Reduced by 60% (from ~5 incidents/month to ~2)
- **Mean time to repair**: Dropped from 4.2 days to 1.5 days (parts pre-ordered)
- **Total savings**: ₹2 Cr (~$2.4M) including reduced downtime revenue impact

## Key Insight

The biggest cost savings came not from avoiding catastrophic failures, but from **extending battery life**. BatteryIQ identified that 23% of the fleet's batteries were being charged at suboptimal C-rates. By adjusting charging profiles based on AI recommendations, average battery lifespan increased by 28%.

Predictive maintenance isn't just about preventing failures — it's about optimizing the entire battery lifecycle to extract maximum value from every cell.`,
  },
  'understanding-soh-ev-batteries': {
    title: 'Understanding State of Health (SOH) in EV Batteries',
    date: 'Jan 22, 2025',
    readTime: '10 min',
    tag: 'Education',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=500&fit=crop',
    content: `State of Health (SOH) is the single most important metric for understanding a battery's current condition. Yet it's widely misunderstood — often confused with State of Charge (SOC) or equated with remaining range. Let's clarify what SOH really means and why it matters for fleet operations.

## What SOH Measures

SOH represents a battery's current maximum capacity as a percentage of its original rated capacity. A brand-new battery starts at 100% SOH. As it degrades through use, SOH decreases:

- **100% SOH**: Full original capacity
- **80% SOH**: Industry-standard "end of life" for EV applications
- **60-80% SOH**: Suitable for second-life applications (stationary storage)
- **Below 60% SOH**: Typically recycled

## How SOH is Measured

Traditional SOH measurement requires a full charge-discharge cycle under controlled conditions — impractical for vehicles in active service. Modern approaches use indirect measurements:

**Impedance-based**: Internal resistance increases as batteries degrade. By measuring AC impedance at specific frequencies, SOH can be estimated without interrupting operation.

**Voltage curve analysis**: The shape of charging/discharging voltage curves changes subtly as batteries age. ML models can detect these changes and correlate them with capacity loss.

**Incremental capacity analysis (ICA)**: Plotting dQ/dV reveals peaks that shift and diminish as batteries degrade. This technique is especially effective for LFP batteries.

## Why SOH Matters More Than Range

Range is a snapshot — it tells you how far you can go right now. SOH tells you the trajectory: how fast is this battery degrading, and when will it need replacement?

A battery showing 200 km range might have 95% SOH (nearly new) or 82% SOH (approaching end of life). The range is the same today, but the second battery will lose range much faster and need replacement within months.

## BatteryIQ's SOH Approach

Our AI Health Predictor uses a multi-model ensemble approach. Rather than relying on a single method, we combine impedance analysis, voltage curve features, temperature patterns, and cycling history to produce a robust SOH estimate. The 17-feature input captures the full picture of battery condition, delivering 97%+ accuracy validated against laboratory reference measurements.

For fleet operators, this means you can trust the SOH number. When BatteryIQ says a battery is at 85% SOH, you know it — and you can plan accordingly.`,
  },
  'ai-predicts-ev-battery-degradation': {
    title: 'How AI Predicts EV Battery Degradation Before It Happens',
    date: 'Jan 5, 2025',
    readTime: '15 min',
    tag: 'Industry',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=500&fit=crop',
    content: `AI is reshaping how electric vehicle batteries are managed. Instead of reacting to problems after they occur, AI uses real-time data to predict battery wear, recommend better charging habits, and flag maintenance needs early.

## The Old Way vs The AI Way

**Traditional approach**: Wait for symptoms (reduced range, slower charging, error codes), then diagnose and repair. By the time symptoms appear, significant degradation has already occurred.

**AI-powered approach**: Continuously monitor sensor data, detect subtle patterns invisible to human observation, predict future degradation trajectory, and alert operators weeks or months before problems manifest.

## How Machine Learning Models Work

Battery degradation prediction models typically follow this pipeline:

1. **Data ingestion**: Collect voltage, current, temperature, impedance, and cycling data from BMS sensors
2. **Feature engineering**: Extract meaningful features like capacity fade rate, internal resistance growth, temperature variance, and charge/discharge asymmetry
3. **Model training**: Use supervised learning (Random Forest, Gradient Boosting, Neural Networks) on labeled datasets with known degradation outcomes
4. **Prediction**: Feed new sensor data through trained models to predict stress level, health score, remaining useful life, and efficiency

## Key Sensor Features That Predict Degradation

Research has identified several sensor readings that are most predictive of future degradation:

- **Internal resistance trend**: The rate of impedance increase is the strongest single predictor
- **Temperature variance during charging**: Batteries developing internal faults show higher temperature non-uniformity
- **Capacity fade rate**: The slope of capacity loss per cycle accelerates before "knee point" failures
- **Coulombic efficiency**: The ratio of discharge to charge energy reveals parasitic side reactions
- **Rest voltage recovery**: How quickly voltage recovers after load removal indicates electrode health

## Real-World Impact

Fleet operators using AI-powered battery management report:
- **30% longer battery life** through optimized charging profiles
- **60% reduction in unplanned downtime** through early failure detection
- **45% lower replacement costs** by catching problems before cascading failures
- **10x faster diagnostics** compared to manual inspection methods

## The Future: Digital Twins and Federated Learning

The next frontier is **digital twin** technology — creating virtual replicas of each physical battery that simulate degradation in real time. Combined with **federated learning** (training models across multiple fleets without sharing raw data), this will enable unprecedented prediction accuracy while preserving data privacy.

BatteryIQ is already implementing these technologies. Our models learn from every battery we monitor, continuously improving prediction accuracy for all customers.`,
  },
  'nasa-battery-dataset-ml-models': {
    title: 'How NASA Battery Data Powers Next-Gen Fleet Intelligence',
    date: 'Dec 18, 2024',
    readTime: '9 min',
    tag: 'Research',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&h=500&fit=crop',
    content: `NASA's Prognostics Center of Excellence has been studying battery degradation since 2007. Their publicly available battery cycling datasets — covering lithium-ion cells cycled under various conditions until failure — have become the gold standard for training and validating battery health prediction models.

## The NASA Battery Dataset

NASA's dataset includes batteries cycled at different temperatures (24°C, 43°C), discharge rates (1C, 2C, 4C), and charge/discharge profiles. Each battery was cycled hundreds of times, with detailed measurements at every cycle:

- Voltage and current profiles during charge/discharge
- Battery impedance (measured via Electrochemical Impedance Spectroscopy)
- Capacity (measured via controlled discharge)
- Temperature during operation
- Internal resistance

The dataset captures the full lifecycle from brand new to end of life, providing labeled data that's ideal for supervised machine learning.

## Why NASA Data is Ideal for Training ML Models

1. **Complete lifecycle coverage**: Each battery is cycled until failure, providing the complete degradation trajectory needed for remaining useful life (RUL) prediction
2. **Controlled conditions**: Lab conditions eliminate confounding variables, letting models learn true degradation physics
3. **Multiple stress conditions**: Different temperatures and C-rates let models learn how operating conditions affect degradation
4. **High-frequency measurements**: Detailed per-cycle data enables fine-grained feature engineering

## How BatteryIQ Uses This Data

We trained our 4 core ML models on the NASA dataset:

**Stress Model**: Classifies battery stress level (Low/Medium/High) based on operating conditions. Uses features like C-rate, temperature deviation, depth of discharge, and cycle count.

**Health Model**: Predicts State of Health (SOH) score from 0-100. Combines impedance features, capacity fade rate, and voltage curve characteristics.

**RUL Model**: Estimates remaining useful life in cycles. Uses the health trend and degradation acceleration patterns to predict when SOH will drop below 80%.

**Efficiency Model**: Calculates energy efficiency percentage. Compares energy in vs energy out, accounting for temperature-dependent losses.

## From Lab to Fleet

The challenge with NASA data is that it's collected in controlled lab conditions — real fleets operate in chaotic environments with variable loads, temperatures, and charging patterns. We bridge this gap through:

- **Domain adaptation**: Fine-tuning lab-trained models with real-world fleet data
- **Feature robustness**: Using features that are physics-meaningful regardless of operating conditions
- **Continuous learning**: Models improve as they process more fleet data

The result: 97%+ accuracy on real-world fleet data, validated against controlled reference measurements. NASA's research data gave us the foundation; real-world fleet data gave us the precision.`,
  },
};

export default function BlogDetail() {
  const { blogId } = useParams();
  const blog = blogId ? blogContent[blogId] : null;

  if (!blog) {
    return (
      <Layout>
        <section className="pt-32 pb-24 text-center">
          <h1 className="text-3xl font-bold text-foreground">Blog post not found</h1>
          <Link to="/blogs" className="text-primary mt-4 inline-block">← Back to Blog</Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="pt-28 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/blogs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          <ScrollReveal>
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">{blog.tag}</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-2 leading-tight">{blog.title}</h1>
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{blog.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{blog.readTime}</span>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="mt-8 rounded-2xl overflow-hidden glass cyber-border">
              <img src={blog.image} alt={blog.title} className="w-full h-64 sm:h-80 object-cover" />
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="mt-10 prose prose-invert prose-lg max-w-none">
              {blog.content.split('\n\n').map((paragraph, i) => {
                if (paragraph.startsWith('## ')) {
                  return <h2 key={i} className="text-2xl font-bold text-foreground mt-10 mb-4">{paragraph.replace('## ', '')}</h2>;
                }
                if (paragraph.startsWith('**') && paragraph.includes(':**')) {
                  const parts = paragraph.split('\n');
                  return (
                    <div key={i} className="my-4">
                      {parts.map((line, j) => {
                        if (line.startsWith('- **')) {
                          const boldEnd = line.indexOf('**', 4);
                          const bold = line.slice(4, boldEnd);
                          const rest = line.slice(boldEnd + 2);
                          return (
                            <div key={j} className="flex gap-2 ml-4 mb-2">
                              <span className="text-primary mt-1">•</span>
                              <p className="text-muted-foreground"><strong className="text-foreground">{bold}</strong>{rest}</p>
                            </div>
                          );
                        }
                        if (line.startsWith('**')) {
                          return <p key={j} className="font-semibold text-foreground mt-4">{line.replace(/\*\*/g, '')}</p>;
                        }
                        return <p key={j} className="text-muted-foreground">{line}</p>;
                      })}
                    </div>
                  );
                }
                if (paragraph.startsWith('- ')) {
                  const items = paragraph.split('\n');
                  return (
                    <ul key={i} className="space-y-2 my-4">
                      {items.map((item, j) => (
                        <li key={j} className="flex gap-2 ml-4">
                          <span className="text-primary mt-1">•</span>
                          <span className="text-muted-foreground">{item.replace(/^- /, '').replace(/\*\*/g, '')}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (paragraph.startsWith('1. ') || paragraph.startsWith('2. ')) {
                  const items = paragraph.split('\n');
                  return (
                    <ol key={i} className="space-y-2 my-4 list-decimal list-inside">
                      {items.map((item, j) => (
                        <li key={j} className="text-muted-foreground">{item.replace(/^\d+\.\s/, '').replace(/\*\*/g, '')}</li>
                      ))}
                    </ol>
                  );
                }
                return <p key={i} className="text-muted-foreground leading-relaxed mb-4">{paragraph}</p>;
              })}
            </div>
          </ScrollReveal>
        </div>
      </article>
    </Layout>
  );
}
