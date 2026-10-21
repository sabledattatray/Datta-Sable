For dattasable.com, I would position the page as a professional Careers / Join Our Team portal rather than a simple hiring form. The goal is:

Professional employer branding
Applicant tracking
Resume upload
Excel export
Email notifications
Admin dashboard
Mobile-friendly
ATS-style filtering
SEO optimized

Use the following master prompt in Cursor, Lovable, Bolt, V0, Claude Code, Gemini, or ChatGPT:

MASTER PROMPT

Build a modern, production-ready Careers / Hiring Page for DattaSable.com.

Project Overview

Create a professional recruitment portal for Datta Sable's company and future ventures.

The page should look premium, trustworthy, and modern.

Design inspiration:

Stripe Careers
Notion Careers
Microsoft Careers
Linear Careers
Vercel Careers

Theme:

Clean white background
Professional typography
Blue accent colors
Glassmorphism cards
Responsive design
Fast loading
SEO friendly
PAGE URL

/careers

HERO SECTION

Headline:

Join Our Team

Subheadline:

Build the future with us. We are always looking for talented professionals in Data Analytics, Business Intelligence, Software Development, AI, SaaS, Marketing, and Operations.

Buttons:

View Open Positions
Apply Now

Add:

Team illustration
Company statistics

Example:

10+ Years Industry Experience
100+ Projects Delivered
Remote Opportunities
Career Growth Focused
WHY JOIN US

Create cards:

Career Growth

Continuous learning and mentorship.

Flexible Work

Remote and hybrid opportunities.

Innovation

Work with cutting-edge technologies.

Impact

Build products used by real businesses.

OPEN POSITIONS SECTION

Create dynamic job cards.

Fields:

Job Title
Department
Experience
Location
Employment Type
Salary Range

Example positions:

Senior Power BI Developer
Data Analyst
SQL Developer
Full Stack Developer
React Developer
Next.js Developer
AI Engineer
MIS Executive
Collection Team Leader
Business Development Executive

Each card should have:

View Details
Apply Now
JOB DETAILS MODAL

When user clicks View Details:

Show:

Job Description
Responsibilities
Requirements
Skills Required
Benefits
Salary Range
Experience

Apply button inside modal.

APPLICATION FORM

Create a detailed ATS-style application form.

Fields:

Personal Details
Full Name *
Email *
Mobile Number *
Alternate Number
Current Location *
Preferred Location
Professional Details
Current Company
Current Designation
Total Experience *
Relevant Experience *
Current Salary
Expected Salary *
Notice Period *
Available From
Skills

Multi-select searchable tags

Examples:

Power BI
SQL
Python
Excel
React
Next.js
Node.js
Azure
AWS
AI
Machine Learning

Allow custom skills.

Education
Highest Qualification
University
Passing Year
Percentage / CGPA
Social Profiles
LinkedIn
Portfolio Website
GitHub
Kaggle
Additional Questions

Why do you want to join us?

Textarea

Describe your strongest achievement.

Textarea

Resume Upload

Accept:

PDF
DOC
DOCX

Maximum:

10MB

Store securely.

Portfolio Upload

Optional

PDF
ZIP
Declaration

Checkbox:

I certify that the information provided is accurate.

FORM VALIDATION

Implement:

Real-time validation
Email validation
Phone validation
Required field validation
Resume file validation

Show success and error messages.

APPLICATION SUCCESS PAGE

Show:

Application Submitted Successfully

Thank you for applying.

Our recruitment team will review your profile and contact you if shortlisted.

Application ID:
AUTO GENERATED

Example:

DS-2026-0001

BACKEND REQUIREMENTS

Use:

Next.js 15
TypeScript
Tailwind CSS
Shadcn UI
Prisma ORM

Database:

PostgreSQL

Tables:

Jobs

id
title
department
location
salary
experience
description
status
created_at

Applicants

id
application_id
job_id
full_name
email
mobile
experience
skills
current_company
current_salary
expected_salary
notice_period
resume_url
linkedin
github
portfolio
status
created_at

ADMIN PANEL

Route:

/admin/careers

Protected login.

Features:

Dashboard

Show:

Total Applications
Applications Today
Open Positions
Shortlisted
Rejected

Charts:

Applications by Month
Applications by Position
APPLICATION MANAGEMENT

Table View

Columns:

Application ID
Candidate Name
Position
Email
Experience
Expected Salary
Status
Date Applied

Filters:

Job Position
Experience
Skills
Status
Date Range

Search:

Name
Email
Mobile
APPLICATION STATUS

Options:

New
Under Review
Shortlisted
Interview Scheduled
Selected
Rejected

Color coded badges.

RESUME VIEWER

Preview uploaded resumes directly.

Download option.

EXPORT TO EXCEL

Critical Requirement

Create Export Button.

Export:

All Applications
Filtered Applications
Selected Applications

Excel Columns:

Application ID
Name
Email
Phone
Position
Experience
Skills
Current Salary
Expected Salary
Notice Period
Status
Date Applied

Generate:

.xlsx file

Compatible with:

Microsoft Excel
Google Sheets
EMAIL AUTOMATION

When candidate applies:

Send auto email.

Subject:

Application Received

Content:

Thank you for applying to Datta Sable Careers.

We have received your application.

Application ID: {{application_id}}

Admin Notification:

Send email to:

careers@dattasable.com

Include:

Candidate Name
Position
Experience
Resume Link
ADVANCED FEATURES

Implement:

Resume Parser

Extract:

Skills
Experience
Education

Auto-fill candidate profile.

AI Candidate Match Score

Generate score:

0-100

Based on:

Skills Match
Experience Match
Education Match

Show in admin dashboard.

Duplicate Detection

Prevent duplicate applications.

Check:

Email + Mobile

Application Tracking

Candidate can check status using:

Application ID
Email

SEO

Meta Title:

Careers | Datta Sable

Meta Description:

Explore exciting career opportunities in Data Analytics, Power BI, SQL, AI, Software Development, and Business Intelligence.

Schema:

JobPosting
Organization

PERFORMANCE

Lighthouse Score Target:

95+

Requirements:

Lazy loading
Optimized images
Server-side rendering
Mobile first
DELIVERABLE

Generate:

Complete Next.js page
Database schema
Prisma models
API routes
Admin dashboard
Excel export functionality
Resume upload system
Email automation
AI candidate scoring
Production-ready code structure

The final result should feel like a premium ATS (Applicant Tracking System) similar to Lever, Greenhouse, or Workable, fully integrated into DattaSable.com and ready for deployment on Vercel with PostgreSQL.

This approach will make your careers page look like a real recruitment platform rather than a basic contact form, while giving you a complete applicant database and one-click Excel export for hiring management.