# Opportunity Discovery Test Data

Use these synthetic examples to demonstrate the Opportunity Discovery form. The positive case represents a bounded AI-assisted workflow; the negative case illustrates a high-impact decision that is not ready for autonomous automation.

## Positive test: Invoice exception triage

| Field | Sample data |
|---|---|
| Business objective | Reduce invoice exception resolution time from 2 days to under 4 hours |
| Process bottleneck | Finance staff manually compare invoices, purchase orders, and receipts |
| Manual effort / cost | 1,200 staff hours per month; about $48,000 monthly loaded labor cost |
| Customer impact | Suppliers wait for payment updates and contact AP repeatedly |
| Data sources & quality | Invoices, purchase orders, and receipts are digital and available in ERP and document storage |
| Applications / integration | Read-only ERP access; create a draft exception case for staff review |
| Regulatory constraints | Retain invoice records; follow finance approval and audit policies |
| Success KPI | Cut median triage time by 50%; keep incorrect routing below 2% |

**Expected review:** Good candidate for AI-assisted document extraction and exception routing, with deterministic validation rules and staff approval before financial action.

## Negative test: Autonomous loan approval

| Field | Sample data |
|---|---|
| Business objective | Automatically approve or reject all loan applications |
| Process bottleneck | Review steps and decision criteria vary by team and are not documented |
| Manual effort / cost | Unknown; no baseline or process-volume data collected |
| Customer impact | Applicants receive inconsistent decisions and cannot easily appeal |
| Data sources & quality | Credit and income records are incomplete, inconsistent, and difficult to access |
| Applications / integration | No approved integration; request is for direct write access to the lending system |
| Regulatory constraints | Credit decisions require documented reasoning, review, and an accountable human owner |
| Success KPI | “Make decisions faster”; no accuracy, fairness, or error thresholds defined |

**Expected review:** Do not automate final approve/deny decisions. First establish a baseline, data access, measurable criteria, and human accountability; consider a limited assistant that summarizes evidence for a qualified reviewer.

## Test notes

- Clear the form between examples so each scenario is evaluated independently.
- These values are synthetic and intended only for demonstration.
- Expected reviews are guidance; the form may capture inputs without automatically classifying them as positive or negative.
