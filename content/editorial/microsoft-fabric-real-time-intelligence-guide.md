# Microsoft Fabric Real-Time Intelligence: A Practical Guide

An operations manager opens a dashboard at 10:00. Everything looks healthy. At 10:07, a distribution hub stops reporting package scans. At 10:20, support starts receiving complaints. The dashboard refreshes at 10:30.

The reporting system worked exactly as designed. The business still lost twenty-three minutes in which somebody could have acted.

That is the problem this guide addresses: the gap between an event happening and a person or system doing something useful about it. Microsoft Fabric Real-Time Intelligence can help close that gap, but selecting the tools is only the beginning. You also need reliable event identities, meaningful timestamps, useful queries, controlled alerts and a plan for failure.

This guide walks through a delivery-operations example, from an event contract to a production readiness checklist. It is written for data engineers, Power BI developers and analytics architects who understand reporting and want to build an operational system they can explain and maintain.

**Editorial note:** This is an independently researched implementation guide, reviewed on 20 October 2026. The scenario, sample records, thresholds and workload calculations are illustrative. They are not customer results, measured Fabric benchmarks or service-level guarantees. The KQL examples require validation in your own Fabric workspace before production use.

## The answer in 60 seconds

**Microsoft Fabric Real-Time Intelligence is a set of capabilities for ingesting, analyzing, visualizing and responding to event data.** A common architecture combines Eventstream for event ingestion and routing, Eventhouse for event analytics, Kusto Query Language (KQL) for investigation, a Real-Time Dashboard for operational visibility and Activator for condition-based actions. [Microsoft's overview](https://learn.microsoft.com/en-us/fabric/real-time-intelligence/overview) describes how those capabilities fit together.

Choose this approach when the value of an intervention falls quickly as data gets older: delayed deliveries, machine faults, payment failures, application incidents or unexpected operational behavior. A scheduled reporting pipeline remains a sensible choice when the decision can wait.

The first question is therefore not “How fast can this dashboard refresh?” It is “Which decision becomes materially better when we make it sooner?”

### What you will build

- A small, explicit event contract for package delivery updates.
- A streaming path with a queryable Eventhouse destination.
- KQL queries for recent activity, duplicate detection and current package state.
- A dashboard that makes freshness and exceptions visible.
- An alert design with ownership, recovery behavior and duplicate protection.
- A capacity worksheet and a staged production rollout plan.

## 1. Start with a decision and a latency budget

“Real-time” is not a sufficiently precise requirement. It could mean a human sees a change within a minute, an automated system evaluates a condition within seconds, or a trading service makes a decision within milliseconds. These are different systems with different operational obligations.

Write the requirement as a complete sentence: “If a hub that should be active stops producing scans, notify the duty manager soon enough to investigate before the next dispatch window.” Then identify the owner, the expected response and what happens when the notification is wrong.

For our example, the duty manager investigates an operational exception. The alert does not cancel deliveries, charge customers or modify inventory. That boundary lets the team introduce automation without pretending the first version can make every business decision safely.

### Break the delay into parts

The time between a physical event and a useful response includes source capture, transport, ingestion, query availability, rule evaluation, notification delivery and human acknowledgement. A dashboard refresh setting changes only one piece of that chain.

Use an initial worksheet with columns for stage, target, measurement and owner. Put an actual measurement next to each target during the pilot. A five-second query does not satisfy a freshness objective if the producer buffered events for fifteen minutes before sending them.

Measure both typical and tail behavior. Median delay describes an ordinary experience; a high percentile reveals the experience during bursts, reconnects and competing workloads. Also track silent periods. A stream producing no rows can represent a quiet business, a failed device or a broken connector.

### Establish a baseline before introducing another platform

Record the current refresh delay, incident detection time, manual checks and avoidable response failures. This gives the pilot a comparison that matters to the organization. A technically impressive stream is not automatically an improvement if nobody owns the resulting actions.

For a low-volume daily reconciliation, a scheduled pipeline with a clear failure notification may outperform a continuously running design in simplicity and operating cost. Reserve streaming complexity for decisions that benefit from it.

## 2. Understand the components without mixing their responsibilities

| Component | Main responsibility | Question it answers | Design boundary |
| --- | --- | --- | --- |
| Real-Time hub | Discover and access event-oriented resources | Where is the stream I need? | Discovery is not a replacement for source ownership. |
| Eventstream | Bring events in, transform and route them | How does an event reach its consumers? | Routing is not a business transaction ledger. |
| Eventhouse and KQL database | Store and query event data | What happened, where and when? | Event history is not automatically current business state. |
| KQL Queryset | Develop and organize queries | How can I investigate this behavior? | A saved query still needs performance and correctness review. |
| Real-Time Dashboard | Present operational queries visually | What needs attention now? | Displayed results are only as fresh as the complete data path. |
| Activator | Evaluate conditions and initiate supported actions | When should somebody or something respond? | A triggered action still needs ownership and failure handling. |
| Lakehouse, Warehouse and Power BI | Support broader analytical consumption | How does this relate to historical business performance? | Analytical integration is a separate freshness and security boundary. |

Microsoft documents [Eventstreams](https://learn.microsoft.com/en-us/fabric/real-time-intelligence/event-streams/overview), [Eventhouse](https://learn.microsoft.com/en-us/fabric/real-time-intelligence/eventhouse) and [Activator](https://learn.microsoft.com/en-us/fabric/real-time-intelligence/data-activator/activator-introduction) individually. Use those product definitions to anchor the architecture, then make your own responsibilities explicit.

In this guide, Eventstream transports delivery updates into an Eventhouse-backed KQL database. Queries summarize that history for operators. The alerting path observes defined conditions and sends an actionable notification. Historical reporting is a separate consumer rather than a reason to push every operational event through the same reporting model.

## 3. Choose the right architecture for the workload

A useful reference flow is:

```text
Package scanner or delivery application
              |
      Durable event transport
              |
        Fabric Eventstream
         /             \
Queryable events    Condition evaluation
      |                    |
Eventhouse / KQL        Activator
      |                    |
Dashboard + query     Owned notification
investigation         or controlled action
      |
Optional downstream historical analytics
```

This is a conceptual architecture, not a promise that every source and destination uses the same authentication method or has the same delivery semantics. Verify the specific connector and destination configuration you select.

### Eventhouse versus Lakehouse versus Warehouse

Use the event path for questions such as “Which hubs stopped reporting?”, “What changed during the incident?” and “Which packages have a suspicious sequence of scans?” A Lakehouse remains useful for combining operational history with files, engineering transformations and broader datasets. A Warehouse remains useful where relational modeling and SQL-based analytical consumption are central requirements.

There is no requirement to choose only one analytical store for the entire company. However, each additional copy or serving path creates work: reconciliation, access control, retention rules, refresh behavior and ownership. Add a destination because a consumer needs it, not because a diagram looks more complete with another box.

If the existing reporting platform already answers the required question within an acceptable window, begin with a small streaming exception path. You do not need to rebuild finance reporting to detect an inactive delivery hub.

### When not to choose this design

Do not use an analytical event store as a substitute for a payment authorization service, an order transaction database or a hard real-time device controller. The fact that a platform analyzes events quickly does not make it the correct authority for every immediate action.

Likewise, do not adopt a new streaming layer solely to avoid improving a slow SQL query. Confirm whether the problem is data arrival, query execution, report rendering or an unclear business process. Each problem has a different fix.

## 4. Define the event contract before connecting anything

A streaming project becomes fragile when everyone agrees on the dashboard but nobody agrees on what a row means. Begin with an event contract that a producer and consumer can both test.

The following JSON represents a fictional package-status update:

```json
{
  "EventId": "evt-000101",
  "PackageId": "pkg-1001",
  "HubId": "MUM-01",
  "Status": "InTransit",
  "EventTime": "2026-10-20T04:30:00Z",
  "ProducedAt": "2026-10-20T04:30:02Z",
  "Sequence": 12,
  "SchemaVersion": 1
}
```

Give `EventId` a stable identity. Retrying a delivery of the same event should preserve that identity. Generating a new ID for every retry makes a consumer unable to distinguish a repeated delivery from a new business event.

`PackageId` identifies the entity. `Sequence` represents a producer-defined ordering value for that entity. `EventTime` records when the business event occurred, while `ProducedAt` records when the producer emitted the message. Store timestamps consistently in UTC and convert them for display where necessary.

Neither timestamp is automatically trustworthy. A scanner can have a bad clock, and an offline device can upload old events after reconnecting. Preserve enough information to investigate those cases rather than rewriting every timestamp as arrival time.

### Document the contract as decisions

| Field | Required rule | Failure handling |
| --- | --- | --- |
| EventId | Nonempty and stable across retries | Reject or quarantine; do not silently invent a replacement. |
| PackageId | Stable business identifier | Quarantine records that cannot be assigned to an entity. |
| HubId | Recognized operational location | Preserve unknown values for review; avoid losing the event. |
| Status | Versioned, documented vocabulary | Keep an explicit unknown-status path. |
| EventTime | Valid UTC business timestamp | Flag invalid and implausibly future timestamps. |
| Sequence | Defined ordering contract per package | Define behavior for gaps, resets and equal values. |
| SchemaVersion | Supported contract version | Route unsupported versions for controlled handling. |

Changing the meaning of a field is more dangerous than adding a field. If `Sequence` changes from package-wide ordering to device-local ordering, existing current-state queries can become wrong without producing an error. Review semantic changes with the consumers, and test older messages during a rollout.

Do not include customer names, full addresses or phone numbers just because the application has them. Operational triage often needs a package ID and hub ID. Reducing unnecessary personal data makes access reviews and incident handling easier.

## 5. Build a controlled Fabric pilot

Start in a development workspace backed by a suitable Fabric-enabled capacity. Confirm that you can create the required items, connect the chosen source and read the destination. Product availability, connectors and preview capabilities can differ; check the current tenant and region before promising a production design.

Microsoft's [Real-Time Intelligence tutorial](https://learn.microsoft.com/en-us/fabric/real-time-intelligence/tutorial-introduction) provides a supported walkthrough using sample data. Use it to learn the interface. Then build your own small scenario with explicit expected results rather than presenting tutorial output as a business implementation.

### A practical setup sequence

1. Create a development Eventhouse and identify its KQL database.
2. Create a destination table using the event contract below.
3. Create an Eventstream with a supported source and appropriately scoped credentials.
4. Preview the incoming shape and verify field names, types and timestamp parsing.
5. Add the Eventhouse destination and review any ingestion mapping or transformation settings.
6. Publish the Eventstream configuration.
7. Send a handful of known events and reconcile the source IDs against the destination.
8. Only then introduce repeated records, out-of-order events and higher rates.

The exact portal steps depend on the selected experience. Eventstreams documentation distinguishes the existing experience from a schema-aware preview. Treat preview features as deliberate adoption decisions, and record which experience your team tested.

### Create an illustrative destination table

Run management commands in the intended development KQL database, with the appropriate permissions:

```kusto
.create table DeliveryEvents (
    EventId:string,
    PackageId:string,
    HubId:string,
    Status:string,
    EventTime:datetime,
    ProducedAt:datetime,
    Sequence:long,
    SchemaVersion:int
)
```

Creating a table does not configure the connector or map a JSON payload automatically. Verify those separately. If the incoming JSON nests its payload under another object, a table with matching top-level column names is not sufficient.

Keep a tiny acceptance dataset under version control. Record each input, its intended table values and the query result you expect. This makes a future schema change reviewable and gives the team something more precise than “the dashboard still looks fine.”

## 6. Learn the KQL patterns that answer operational questions

KQL is useful here because an event stream naturally creates questions about time, entities and sequences. Start with a bounded time window and a small projection. Then add aggregation only when you know what the rows represent.

### A self-contained sample you can inspect

The following query declares a fictional in-memory dataset. It does not create a table, ingest events or connect to a live stream:

```kusto
let Sample = datatable(
    EventId:string, PackageId:string, HubId:string,
    Status:string, EventTime:datetime, Sequence:long
)
[
    "e1", "p1", "MUM-01", "Created",   datetime(2026-10-20T04:00:00Z), 1,
    "e2", "p1", "MUM-01", "InTransit", datetime(2026-10-20T04:05:00Z), 2,
    "e2", "p1", "MUM-01", "InTransit", datetime(2026-10-20T04:05:00Z), 2,
    "e3", "p2", "PUN-01", "Exception", datetime(2026-10-20T04:06:00Z), 1,
    "e4", "p1", "MUM-01", "Delivered", datetime(2026-10-20T04:10:00Z), 3
];
Sample
| summarize arg_max(Sequence, *) by PackageId
| project PackageId, HubId, Status, Sequence
```

Under the stated ordering contract, the intended result contains two packages: `p1` at sequence 3 with status `Delivered`, and `p2` at sequence 1 with status `Exception`. The duplicated `e2` is still present in the sample history; selecting one state row does not physically clean that history.

Microsoft documents [arg_max](https://learn.microsoft.com/en-us/kusto/query/arg-max-aggregation-function?view=microsoft-fabric) as returning a row associated with a maximum expression. For a production state view, decide what a tie means. If two conflicting events have the same sequence, the query should not become your conflict-resolution policy by accident.

### Recent event volume by hub

```kusto
DeliveryEvents
| where EventTime >= ago(30m)
| summarize Events = count() by HubId, bin(EventTime, 1m)
| order by EventTime asc
```

This counts events, not distinct packages or completed deliveries. A package that produces five updates contributes five rows. Label the visualization accordingly. If you want packages, explicitly choose a distinct-entity calculation and explain whether it is exact or approximate.

The time filter is also a business choice. This query groups events by business time. An offline scanner that uploads yesterday's records today will not make today's chart look busy, which may be correct for operations but insufficient for diagnosing ingestion activity.

### Find repeated event IDs

```kusto
DeliveryEvents
| where EventTime >= ago(24h)
| summarize Copies = count() by EventId
| where Copies > 1
| order by Copies desc
```

Use this as an investigation query. It is not an exactly-once delivery guarantee. It only sees records within its filter, and its correctness depends on event ID quality. An empty or reused ID can turn unrelated events into a misleading duplicate group.

### Separate history from current state

```kusto
DeliveryEvents
| summarize arg_max(Sequence, *) by PackageId
| where Status == "Exception"
| project PackageId, HubId, Status, EventTime, Sequence
```

Notice the order of operations. Selecting `Status == "Exception"` before finding the latest state would answer “Which packages ever had an exception?” rather than “Which packages are currently in an exception state?” That difference is easy to miss and expensive in an operational queue.

This all-history query is a teaching example. At scale, evaluate a maintained current-state representation or an appropriate materialization strategy. A short time filter reduces query work but can remove the last known state of a quiet package. Choose that tradeoff explicitly.

## 7. Design for event time, arrival time and replay

An event-driven design needs at least two notions of time: when something happened and when the analytical system became aware of it. Confusing the two produces dashboards that are hard to trust.

Suppose a scanner loses connectivity at 09:00 and reconnects at 09:20. Twenty minutes of events arrive together. An arrival-time chart shows a sudden burst. An event-time chart shows historical activity filling in. Neither chart is inherently wrong; they answer different questions.

Keep both perspectives available to operators. Use business time for operational timelines and a separately documented ingestion perspective for pipeline health. Do not silently discard late events simply because they make yesterday's chart change.

### Measure approximate ingestion lag carefully

Where the table's ingestion-time policy was enabled when records arrived, this diagnostic query can summarize approximate lag:

```kusto
DeliveryEvents
| extend IngestedAt = ingestion_time()
| where IngestedAt >= ago(1h)
| where isnotnull(EventTime)
| extend LagSeconds = datetime_diff("second", IngestedAt, EventTime)
| where LagSeconds >= 0
| summarize percentiles(LagSeconds, 50, 95, 99) by HubId
```

The [ingestion_time documentation](https://learn.microsoft.com/en-us/kusto/query/ingestion-time-function?view=microsoft-fabric) describes an approximate ingestion timestamp and its policy dependency. It is not a substitute for a source ordering value. Negative lag is excluded above to keep a diagnostic summary interpretable, but production monitoring should count and investigate those excluded records as potential clock or timestamp problems.

[KQL percentiles](https://learn.microsoft.com/en-us/kusto/query/percentiles-aggregation-function?view=microsoft-fabric) are estimates. Present the resulting numbers as approximate operational signals, and retain sample counts. A percentile from three events does not carry the same meaning as one from a large, representative interval.

### Write the replay policy before the first incident

Replay should restore missing information without producing duplicate external actions. Keep the original event IDs and business timestamps. Tag a replay batch or carry a processing context where the chosen architecture permits it, so operations can distinguish catch-up activity from new business activity.

For notifications, consider whether historical exceptions should notify a human again. Often they should update history without reopening a resolved incident. For downstream actions, use a stable business action key, such as package plus condition plus state version, and record whether that action has already completed.

The analytical query and action receiver both need a story for retries. Assuming the entire path is exactly once because one component supports deduplication leaves gaps at the boundaries.

## 8. Build a dashboard that an operator can use under pressure

An operational dashboard has a different job from an executive presentation. It should help somebody decide whether intervention is needed and what to inspect next. Decorative complexity makes that task harder.

Begin with a small set of clearly named tiles: latest business event time, approximate data freshness, recent event volume, current exception packages and a list of active hubs that appear silent. Provide the time window, relevant filters and the point at which the result was evaluated.

Avoid a green “healthy” tile that only means the last query completed. A successful query over stale data can be the most misleading state on the page. Make “no data,” “stale data,” “query failed” and “no exceptions” visually distinct.

Microsoft's [Real-Time Dashboard creation guide](https://learn.microsoft.com/en-us/fabric/real-time-intelligence/dashboard-real-time-create) explains the product workflow. The layout recommendations here are editorial design choices: put actionable exceptions above exploratory charts, use readable units and let a user move from a summary to the underlying package or hub records.

### A suggested first screen

| Area | Content | Reason |
| --- | --- | --- |
| Header | Environment, operational window and freshness | Prevents confusion between test and production. |
| Status strip | Feed health, active incidents and acknowledgement | Makes uncertainty visible before interpretation. |
| Main table | Current exceptions, hub, age and owner | Gives the operator a work queue. |
| Trend panel | Event volume and exception trend | Provides context without hiding individual incidents. |
| Investigation links | Package history and source diagnostics | Reduces the time spent searching during an incident. |

Do not refresh every tile at the fastest possible rate by default. A detail table, historical trend and freshness indicator can have different needs. Test the actual viewer pattern and query cost. Faster polling that creates more contention can make the overall experience worse.

### Test the empty states

Show the page to a colleague with a deliberately stopped producer. Ask what they think is happening. Then repeat with a healthy producer and no exceptions. If both states look equally green, the design needs another iteration.

Also test narrow screens, large text and long package identifiers. A dashboard used from a phone during an incident should not require an operator to infer a truncated identifier or distinguish two nearly identical colors.

## 9. Turn conditions into owned actions with Activator

The useful outcome of an alert is a response, not a notification count. Before configuring a rule, define the object being monitored, the condition, the time behavior, the recipient and the expected action.

For our delivery example, a reasonable initial rule might identify an active hub that has not produced expected activity for an agreed interval. The team must supply an active-hub roster or operating schedule. A query over event rows alone cannot reliably discover a hub that never produced a row.

Activator provides condition-based actions within Fabric's real-time capabilities. The [official introduction](https://learn.microsoft.com/en-us/fabric/real-time-intelligence/data-activator/activator-introduction) is the reference for supported objects, rules and action paths. Verify which rule behavior and action type your chosen configuration supports rather than assuming every design below is a built-in toggle.

### Write an alert contract

- **Object:** one hub, identified by a stable `HubId`.
- **Eligibility:** the hub is scheduled to operate now.
- **Condition:** its observed activity violates the agreed freshness rule.
- **Persistence:** the condition must last long enough to avoid a transient false alarm.
- **Action:** notify the duty manager with hub, observed time and investigation link.
- **Recovery:** record when activity resumes and close or update the incident.
- **Escalation:** identify the next owner if the first recipient does not respond.

Use thresholds that reflect the business rhythm. A busy urban hub and a small overnight facility may not share the same expected event rate. A single global threshold is easy to configure but may create either noise or blind spots.

### Control repeated notifications

If a condition remains true for an hour, should the same person receive a notification every evaluation? Usually the team wants an initial alert, an acknowledgement state, perhaps a controlled reminder and a recovery message. Model those transitions explicitly.

When a receiver performs an external action, make the receiver idempotent using a stable action identity. Store the action outcome and make retries observable. A timeout after the receiver accepted an action is an ambiguous outcome, not proof that nothing happened.

For high-impact actions, start with human approval. Prove the signal quality, replay behavior and failure handling before allowing the stream to modify operational systems automatically.

## 10. Treat missing events as a first-class failure mode

Many teams monitor bad values while ignoring missing values. That works until the producer stops. An empty query result can then look exactly like a healthy operation with no problems.

Maintain a roster of entities that should be producing data, including operating hours or expected cadence where necessary. Compare that roster against observed activity. The roster is business reference data and needs an owner just like the event source.

Distinguish source silence from downstream delay. If the source is producing but the destination is stale, inspect transport, connector health, destination ingestion and capacity. If the source itself is quiet, the operational response may belong to a device or application team.

Create a synthetic canary only where it is appropriate and clearly identified. A scheduled test event can prove that part of the path is alive, but it does not prove all hubs are reporting. Exclude it from business volume and disclose what it measures.

### Minimum health signals

Track source production, destination arrival, rejected records, query failures, alert evaluations and action outcomes. Correlate them with a time window and environment. A red error count without a source, destination or timestamp forces the person on call to reconstruct the incident before they can resolve it.

Keep the runbook short enough to use: inspect source, inspect transport, inspect Eventstream, inspect table, run a known diagnostic query, inspect action receiver. Include the escalation owner at each step.

## 11. Protect data at every consumption boundary

An operational stream can expose sensitive business behavior even when it contains no obvious personal information. Package routes, device activity and incident patterns may still require restricted access.

Separate development and production access. Give producers only the permissions they require, restrict who can modify routes and destinations, and review who can read the resulting data. Test a viewer account rather than assuming an administrator's successful experience proves the access design.

An embedded report, dashboard share or downstream export introduces another boundary. Confirm the effective permissions for the actual recipient. A consumer who cannot query the Eventhouse directly may still have access through another published artifact or exported dataset.

### Keep secrets out of notebooks and article examples

Use the authentication and secret-management mechanisms supported by the selected connector. Do not put live connection strings, bearer tokens or production endpoints with embedded credentials into a repository, screenshot or shared query note.

For a portfolio project, use synthetic data and document that choice. A technically realistic demo does not require uploading customer addresses or internal incident logs. Readers gain more from a reproducible contract than from a screenshot containing sensitive operational details.

Build on the broader access and governance principles in the existing [Microsoft Fabric security guide](/blog/microsoft-fabric-security-guide-2026) and [Fabric governance and Purview guide](/blog/microsoft-fabric-governance-purview-guide-2026). Review the current product-specific permission documentation for the items you actually deploy.

## 12. Estimate cost from the workload, not the cover page

There is no responsible universal monthly price for this architecture. Cost depends on ingestion pattern, active compute, query behavior, retention, other consumers, region, capacity configuration and the surrounding transport and action services.

Microsoft documents [Eventhouse and KQL database consumption](https://learn.microsoft.com/en-us/fabric/real-time-intelligence/real-time-intelligence-consumption). Use current consumption and billing guidance, then measure the pilot. Do not infer the complete invoice from a single platform SKU or from the size of a sample file.

### Calculate a workload envelope

Assume, purely for illustration, an average of 100 events per second at 1,000 bytes per serialized event:

```text
Events per day = 100 × 86,400 = 8,640,000
Raw decimal GB per day = 8,640,000 × 1,000 / 1,000,000,000
                      = 8.64 GB
Seven days of raw payload = 60.48 GB
```

This is payload arithmetic, not a storage bill. It excludes compression, indexing, metadata, replication, retention implementation, protocol overhead and extra destinations. A sustained average also says nothing about a burst that is twenty times higher for several minutes.

### Count queries as well as events

Suppose ten independent viewer sessions each refresh eight tiles every fifteen seconds. With no shared caching or request coalescing, that represents up to 320 tile-query opportunities per minute, or 460,800 per day if sustained for twenty-four hours. Actual execution depends on the product and cache behavior; measure it rather than treating this arithmetic as a Fabric billing formula.

This thought experiment explains why dashboard design belongs in capacity planning. A quieter source can still have a busy analytical workload if many viewers repeatedly scan large windows.

### Separate retention from cache

[Retention policy](https://learn.microsoft.com/en-us/kusto/management/retention-policy?view=microsoft-fabric) governs how long data remains under the relevant retention rules. [Caching policy](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/management/cachepolicy) governs which data is kept in the faster cache tier. They solve different problems.

Choose retention from business, investigation and legal requirements; have the responsible owner approve it. Choose hot-cache coverage from query access patterns. Keeping every event hot because a dashboard reads the latest thirty minutes is a design choice that needs evidence.

For broader capacity planning, connect this worksheet to the existing [Fabric capacity sizing guide](/blog/microsoft-fabric-capacity-sizing-guide-2026) and [Fabric pricing guide](/blog/microsoft-fabric-pricing-guide-2026). Recheck current rates before making purchasing decisions.

## 13. Troubleshoot from the producer toward the action

Do not start by randomly increasing capacity or changing query syntax. Locate the first point where observed behavior differs from the expected event path.

| Symptom | First checks | Common interpretation mistake |
| --- | --- | --- |
| Source has events, table is empty | Source credentials, route publication, destination mapping, ingestion errors | Assuming a visible Eventstream preview proves destination ingestion. |
| Table has rows, time chart is blank | Time zone, event timestamps, dashboard filters and selected range | Treating old event time as missing ingestion. |
| Package counts look inflated | Repeated IDs, retries, event-versus-entity definition | Counting status updates as unique packages. |
| Old exception remains visible | Ordering contract and state-selection query | Filtering exception history before selecting current state. |
| Hub disappears from the dashboard | Active-hub roster and missing-data logic | Assuming an absent row means a healthy hub. |
| Repeated notifications | Rule state, replay and receiver idempotency | Assuming every repeated alert represents a new incident. |
| Queries slow during busy periods | Time filters, scanned columns, concurrency and competing workloads | Judging production behavior from a single-user demo. |
| Apparent negative lag | Source clocks and timestamp parsing | Hiding bad timestamps without tracking their count. |
| Restart produces unexpected actions | Replay policy, action ledger and stable event IDs | Replaying history directly into irreversible side effects. |

Record the evidence before changing the system. Keep a small set of event IDs, the relevant timestamps, the expected destination values and a query result. This reduces the chance of fixing a display symptom while leaving the data problem intact.

### Make an incident reproducible

A useful incident note contains the contract version, affected producers, first and last observed times, an example record, the query used to diagnose it and the corrective action. Exclude sensitive payload fields where possible.

After the immediate fix, add a regression case to the acceptance dataset. A resolved incident becomes a lasting improvement only when the system can recognize or prevent the same failure next time.

## 14. A production test plan that goes beyond “rows arrived”

The first successful ingestion proves connectivity, not operational reliability. A production candidate should pass tests that deliberately violate the happy path.

### Contract tests

Send a valid event, a missing ID, an invalid timestamp, an unknown status and an unsupported schema version. Confirm that each has a documented outcome. Verify that rejected or quarantined messages remain discoverable without exposing secrets or unnecessary personal data.

### Ordering and duplication tests

Send the same event twice. Send sequence 12 before sequence 11. Send two conflicting records with the same sequence. Reuse an event ID with a changed payload. Confirm that current-state behavior follows the contract and that disputed data is visible for review.

### Failure and recovery tests

Pause the producer, interrupt transport where your test environment permits it, disable the action receiver and replay a known batch. Confirm that the health indicators differentiate those failures. Verify who receives an escalation and how the system recovers without repeatedly performing the same external action.

### Workload tests

Use representative payload sizes, burst patterns, dashboard concurrency and lookback windows. Include at least one cold or previously idle path if relevant to your configuration. Report the environment and methodology with any measured result. Never present a local sample as a universal platform benchmark.

### Acceptance record

For each test, store expected outcome, observed outcome, evidence, owner and unresolved limitation. Require sign-off from the person who will operate the system, not only the engineer who built it. If the operator cannot distinguish stale data from a healthy quiet period, the system is not ready for unattended use.

## 15. A four-week implementation plan

This is an example rollout plan, not a promised delivery estimate. Adjust it for access approvals, source availability, compliance review and the maturity of the existing platform.

**Week one: define and observe.** Choose one decision, one producer and one accountable operational owner. Document the event contract, latency objective, active-entity roster and baseline. Build the smallest path that preserves enough information to investigate its own behavior.

**Week two: make the queries trustworthy.** Implement known-result samples, event history views, duplicate diagnostics and state-selection rules. Test ordering, clock problems and replay. Review each metric name with the operator so the dashboard does not confuse events, entities and outcomes.

**Week three: introduce controlled action.** Build a small dashboard and one low-risk alert. Add acknowledgement and recovery procedures. Test notification failure and receiver idempotency. Keep consequential business changes behind human review until the signal has earned trust.

**Week four: measure and decide.** Run representative load, examine consumption, check viewer permissions and rehearse recovery. Compare the actual intervention time with the original baseline. Decide whether to expand, simplify or stop the pilot based on measured operational benefit.

### Production readiness checklist

- One named owner exists for the source, analytical path and operational response.
- Event identity, ordering and schema evolution are documented.
- Duplicate and late-event behavior has been tested.
- Expected-but-missing producers can be detected.
- The dashboard distinguishes quiet, stale and failed states.
- Rules have documented action, acknowledgement and recovery behavior.
- External actions tolerate retries without unintended duplication.
- Access is tested with real viewer roles, not only administrators.
- Retention, cache and capacity choices have an explicit rationale.
- A runbook explains replay, rollback and escalation.
- Performance statements include a measured environment and method.

## 16. Build a portfolio project that demonstrates engineering judgment

For a data engineer or Power BI developer, this topic can produce a stronger portfolio piece than another screenshot of a generic dashboard. The value comes from showing your reasoning and failure handling, not adding more product logos.

Use a fictional delivery network with a small set of hubs. Publish the event contract, a synthetic sample, a few KQL queries, the architecture and a short runbook. Include a demonstration of an out-of-order event, a repeated message and a missing producer. Explain what the operator sees in each case.

Show a cost worksheet with clearly labeled assumptions and a separate table for measurements from your own test environment. If you have not measured a result, say so. Reviewers can assess a transparent engineering tradeoff more easily than an unsupported “sub-second at any scale” claim.

In an interview, be ready to explain why you chose the alert threshold, what happens during replay, how you avoid duplicate actions and when a scheduled pipeline would have been sufficient. Those answers demonstrate architecture skills across product boundaries.

Readers planning their next learning step can connect the project to the existing [PL-300, DP-600 and DP-700 comparison](/blog/pl-300-vs-dp-600-vs-dp-700-microsoft-certification-guide-2026). Use the project to practice understanding; check the current official exam objectives separately rather than assuming every feature here is examined.

## 17. Frequently asked questions

### What is Microsoft Fabric Real-Time Intelligence used for?

It supports event-oriented analysis and response, including operational monitoring, telemetry and streaming analytics. A practical project combines ingestion, storage, queries, visualization and an owned action. Start with a decision whose value depends on freshness.

### Is Eventstream the same as Eventhouse?

No. Eventstream brings events into Fabric and routes or transforms them for consumers. Eventhouse provides an analytical environment containing KQL databases. A useful mental distinction is event movement versus event investigation.

### Do I need to know KQL if I already know SQL?

For a maintainable Eventhouse project, basic KQL is valuable. Begin with filtering, projection, grouping, time bins and entity-state selection. SQL knowledge helps with analytical reasoning, but it does not remove the need to understand the query language and semantics used by the solution.

### Does Real-Time Intelligence guarantee sub-second dashboards?

Do not assume a universal latency guarantee. The observed delay includes the producer, transport, ingestion, query, visualization and action path. Define a requirement, test representative conditions and consult the relevant service terms for any contractual guarantee.

### Can I use Power BI with this architecture?

Yes, Power BI can be part of the broader analytical design. Choose the supported connection and serving path for the intended use case, then test its freshness, model behavior, permissions and licensing. An operational dashboard and a governed business semantic model can serve different audiences.

### How do I prevent duplicate events from causing duplicate actions?

Use stable event IDs, define ordering and replay behavior, and make the receiving action idempotent with its own durable action identity. A query that selects one row does not by itself guarantee exactly-once execution across the entire system.

### How much does a Fabric real-time solution cost?

There is no single price that fits every implementation. Build a workload estimate, review current capacity and consumption guidance, include surrounding services and measure a realistic pilot. Avoid treating raw event volume as the complete invoice.

### Can I build the example without a production stream?

You can explore the query logic using the self-contained sample and follow Microsoft's sample-data tutorial for the interface. A production ingestion and alerting system still needs an appropriate Fabric environment, permissions, source configuration and operational validation.

## 18. Where to go next

Begin with one question: which operational exception would be less costly if the right person saw it earlier? Define the event that proves the condition, the time within which a response matters and the owner who will respond.

Then build one narrow, observable path. Preserve identity and timestamps, validate the query with known records, show freshness honestly and test the action under failure. Expand only after you can explain what the system does when the data is late, repeated or absent.

That is the foundation of a useful real-time system: evidence that arrives in time to support a decision, and a response path that remains trustworthy when conditions are imperfect.

### Related reading on Datta Sable

- [Microsoft Fabric architecture explained](/blog/microsoft-fabric-architecture-explained-2026) — the broader platform context.
- [OneLake architecture guide](/blog/microsoft-fabric-onelake-architecture-guide) — storage and cross-workload thinking.
- [Fabric capacity sizing guide](/blog/microsoft-fabric-capacity-sizing-guide-2026) — planning the surrounding capacity.
- [Fabric security guide](/blog/microsoft-fabric-security-guide-2026) — access and security considerations.
- [Data quality frameworks](/blog/data-quality-frameworks) — validating the data behind trusted analytics.

### Official references and verification notes

Product descriptions and query semantics were checked against the following primary references. The design recommendations, fictional scenario and rollout plan are independent editorial guidance. Feature availability and preview status should be checked again when implementing.

1. [Microsoft Fabric Real-Time Intelligence overview](https://learn.microsoft.com/en-us/fabric/real-time-intelligence/overview).
2. [Microsoft Fabric Eventstreams overview](https://learn.microsoft.com/en-us/fabric/real-time-intelligence/event-streams/overview).
3. [Eventhouse overview](https://learn.microsoft.com/en-us/fabric/real-time-intelligence/eventhouse).
4. [Real-Time Intelligence tutorial](https://learn.microsoft.com/en-us/fabric/real-time-intelligence/tutorial-introduction).
5. [Create a Real-Time Dashboard](https://learn.microsoft.com/en-us/fabric/real-time-intelligence/dashboard-real-time-create).
6. [Fabric Activator introduction](https://learn.microsoft.com/en-us/fabric/real-time-intelligence/data-activator/activator-introduction).
7. [KQL arg_max aggregation](https://learn.microsoft.com/en-us/kusto/query/arg-max-aggregation-function?view=microsoft-fabric).
8. [KQL ingestion_time](https://learn.microsoft.com/en-us/kusto/query/ingestion-time-function?view=microsoft-fabric).
9. [KQL percentiles](https://learn.microsoft.com/en-us/kusto/query/percentiles-aggregation-function?view=microsoft-fabric).
10. [KQL datetime_diff](https://learn.microsoft.com/en-us/kusto/query/datetime-diff-function?view=microsoft-fabric).
11. [Eventhouse and KQL database consumption](https://learn.microsoft.com/en-us/fabric/real-time-intelligence/real-time-intelligence-consumption).
12. [Kusto retention policy](https://learn.microsoft.com/en-us/kusto/management/retention-policy?view=microsoft-fabric).
13. [Kusto caching policy](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/management/cachepolicy).
