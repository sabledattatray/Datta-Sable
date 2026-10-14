import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.chart import BarChart, DoughnutChart, Reference, Series
import datetime
import os
import random

def create_rider_ops_template(output_path):
    wb = openpyxl.Workbook()

    # 1. Setup sheets
    ws_dash = wb.active
    ws_dash.title = 'Dashboard'
    ws_raw = wb.create_sheet('Raw_Data')
    ws_mis = wb.create_sheet('MIS_Summary')
    ws_ai = wb.create_sheet('AI_Insights_&_Formulas')

    # Styles
    navy_dark = "0B132B"
    navy_card = "1C2541"
    navy_accent = "3A506B"
    cyan_accent = "00F0FF"
    lime_accent = "C9F31D"
    white = "FFFFFF"
    gray_light = "F4F6F8"
    gray_border = "D0D7DE"
    gray_text = "5A6A85"

    font_title = Font(name="Calibri", size=18, bold=True, color=white)
    font_subtitle = Font(name="Calibri", size=10, italic=True, color="A0AEC0")
    font_kpi_label = Font(name="Calibri", size=10, bold=True, color="CBD5E1")
    font_kpi_val = Font(name="Calibri", size=18, bold=True, color=lime_accent)
    font_tbl_header = Font(name="Calibri", size=10, bold=True, color=white)
    font_bold = Font(name="Calibri", size=10, bold=True)
    font_regular = Font(name="Calibri", size=10)

    fill_title = PatternFill(start_color=navy_dark, end_color=navy_dark, fill_type="solid")
    fill_kpi = PatternFill(start_color=navy_card, end_color=navy_card, fill_type="solid")
    fill_header = PatternFill(start_color=navy_accent, end_color=navy_accent, fill_type="solid")
    fill_zebra = PatternFill(start_color="F8FAFC", end_color="F8FAFC", fill_type="solid")

    thin_border_side = Side(style='thin', color=gray_border)
    box_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)

    # ─────────────────────────────────────────────────────────────────────────────
    # RAW DATA GENERATION
    # ─────────────────────────────────────────────────────────────────────────────
    raw_headers = [
        'Rider_ID', 'Rider_Name', 'Date', 'Trips_Completed', 'Distance_KM',
        'Base_Payout_Per_Trip', 'Bonus_Eligible (Y/N)', 'Deductions',
        'Attendance(Present/Absent)', 'Zone', 'Week'
    ]
    ws_raw.append(raw_headers)

    for col_idx in range(1, len(raw_headers) + 1):
        cell = ws_raw.cell(row=1, column=col_idx)
        cell.font = font_tbl_header
        cell.fill = fill_header
        cell.alignment = Alignment(horizontal='center', vertical='center')

    riders = [
        ('RID101', 'Arjun Sharma', 'Bandra West'),
        ('RID102', 'Pradeep Shinde', 'Andheri East'),
        ('RID103', 'Siddharth Rao', 'Powai Tech-Hub'),
        ('RID104', 'Nikhil Kadam', 'South Mumbai'),
        ('RID105', 'Vikram Patil', 'Bandra West'),
        ('RID106', 'Rohan Mane', 'Andheri East'),
        ('RID107', 'Ganesh Jadhav', 'Powai Tech-Hub'),
        ('RID108', 'Sachin More', 'South Mumbai'),
        ('RID109', 'Aditya Deshmukh', 'Bandra West'),
        ('RID110', 'Rahul Sawant', 'Andheri East'),
        ('RID111', 'Sameer Shaikh', 'Powai Tech-Hub'),
        ('RID112', 'Omkar Bhosale', 'South Mumbai'),
    ]

    base_date = datetime.date(2026, 5, 1)
    random.seed(42)

    raw_row = 2
    for week_num in range(1, 6):
        week_label = f"Week {week_num}"
        for day_offset in range(6):  # 6 days per week
            curr_date = base_date + datetime.timedelta(days=(week_num - 1) * 7 + day_offset)
            for rid, name, zone in riders:
                # 88% attendance rate
                is_present = random.random() < 0.88
                if is_present:
                    attendance = "Present"
                    trips = random.randint(6, 16)
                    dist = round(trips * random.uniform(3.2, 5.5), 1)
                    rate = random.choice([85, 90, 95, 100, 110, 115])
                    bonus = 'Y' if trips >= 11 else 'N'
                    deduction = round(random.uniform(0, 75), 2) if random.random() < 0.25 else 0.00
                else:
                    attendance = "Absent"
                    trips = 0
                    dist = 0.0
                    rate = 0
                    bonus = 'N'
                    deduction = 0.00

                ws_raw.append([
                    rid, name, curr_date, trips, dist, rate, bonus, deduction, attendance, zone, week_label
                ])
                raw_row += 1

    total_raw_rows = raw_row - 1

    # Format Raw_Data columns
    for r in range(2, total_raw_rows + 1):
        ws_raw.cell(row=r, column=3).number_format = 'yyyy-mm-dd'
        ws_raw.cell(row=r, column=4).number_format = '#,##0'
        ws_raw.cell(row=r, column=5).number_format = '#,##0.0'
        ws_raw.cell(row=r, column=6).number_format = '₹#,##0'
        ws_raw.cell(row=r, column=8).number_format = '₹#,##0.00'

    # ─────────────────────────────────────────────────────────────────────────────
    # MIS SUMMARY SHEET (Formula Driven)
    # ─────────────────────────────────────────────────────────────────────────────
    mis_headers = [
        'Rider_ID', 'Rider_Name', 'Primary_Zone', 'Total_Trips', 'Total_Distance_KM',
        'Gross_Earnings', 'Bonus_Count', 'Bonus_Payout', 'Days_Present', 'Days_Logged',
        'Attendance_Rate', 'Deduction_Total', 'Net_Payout', 'Avg_Trips_Per_Day',
        'Max_Trips_Day', 'Bonus_Eligibility_Rate'
    ]
    ws_mis.append(mis_headers)
    for col_idx in range(1, len(mis_headers) + 1):
        cell = ws_mis.cell(row=1, column=col_idx)
        cell.font = font_tbl_header
        cell.fill = fill_header
        cell.alignment = Alignment(horizontal='center', vertical='center')

    for idx, (rid, name, zone) in enumerate(riders, start=2):
        r_str = str(idx)
        # Formulas using standard Excel functions & XLOOKUP
        f_name = f'=_xlfn.XLOOKUP(A{r_str}, Raw_Data!A:A, Raw_Data!B:B)'
        f_zone = f'=_xlfn.XLOOKUP(A{r_str}, Raw_Data!A:A, Raw_Data!J:J)'
        f_trips = f'=SUMIF(Raw_Data!A:A, A{r_str}, Raw_Data!D:D)'
        f_dist = f'=SUMIF(Raw_Data!A:A, A{r_str}, Raw_Data!E:E)'
        f_gross = f'=SUMPRODUCT((Raw_Data!$A$2:$A${total_raw_rows}=A{r_str})*(Raw_Data!$D$2:$D${total_raw_rows})*(Raw_Data!$F$2:$F${total_raw_rows}))'
        f_bonus_cnt = f'=COUNTIFS(Raw_Data!A:A, A{r_str}, Raw_Data!G:G, "Y")'
        f_bonus_pay = f'=G{r_str}*250'  # ₹250 per eligible bonus day
        f_pres = f'=COUNTIFS(Raw_Data!A:A, A{r_str}, Raw_Data!I:I, "Present")'
        f_logged = f'=COUNTIF(Raw_Data!A:A, A{r_str})'
        f_att_rate = f'=I{r_str}/J{r_str}'
        f_ded = f'=SUMIF(Raw_Data!A:A, A{r_str}, Raw_Data!H:H)'
        f_net = f'=F{r_str}+H{r_str}-L{r_str}'
        f_avg_trips = f'=IFERROR(D{r_str}/I{r_str}, 0)'
        f_max_trips = f'=_xlfn.MAXIFS(Raw_Data!D:D, Raw_Data!A:A, A{r_str})'
        f_bonus_rate = f'=G{r_str}/J{r_str}'

        ws_mis.append([
            rid, f_name, f_zone, f_trips, f_dist, f_gross, f_bonus_cnt,
            f_bonus_pay, f_pres, f_logged, f_att_rate, f_ded, f_net,
            f_avg_trips, f_max_trips, f_bonus_rate
        ])

        # Formatting
        ws_mis.cell(row=idx, column=4).number_format = '#,##0'
        ws_mis.cell(row=idx, column=5).number_format = '#,##0.0'
        ws_mis.cell(row=idx, column=6).number_format = '₹#,##0.00'
        ws_mis.cell(row=idx, column=7).number_format = '#,##0'
        ws_mis.cell(row=idx, column=8).number_format = '₹#,##0.00'
        ws_mis.cell(row=idx, column=11).number_format = '0.0%'
        ws_mis.cell(row=idx, column=12).number_format = '₹#,##0.00'
        ws_mis.cell(row=idx, column=13).number_format = '₹#,##0.00'
        ws_mis.cell(row=idx, column=14).number_format = '0.0'
        ws_mis.cell(row=idx, column=15).number_format = '#,##0'
        ws_mis.cell(row=idx, column=16).number_format = '0.0%'

    # Total Row in MIS_Summary
    tot_row = len(riders) + 2
    ws_mis.cell(row=tot_row, column=1, value="GRAND TOTAL").font = font_bold
    ws_mis.cell(row=tot_row, column=4, value=f"=SUM(D2:D{tot_row-1})").number_format = '#,##0'
    ws_mis.cell(row=tot_row, column=5, value=f"=SUM(E2:E{tot_row-1})").number_format = '#,##0.0'
    ws_mis.cell(row=tot_row, column=6, value=f"=SUM(F2:F{tot_row-1})").number_format = '₹#,##0.00'
    ws_mis.cell(row=tot_row, column=7, value=f"=SUM(G2:G{tot_row-1})").number_format = '#,##0'
    ws_mis.cell(row=tot_row, column=8, value=f"=SUM(H2:H{tot_row-1})").number_format = '₹#,##0.00'
    ws_mis.cell(row=tot_row, column=11, value=f"=AVERAGE(K2:K{tot_row-1})").number_format = '0.0%'
    ws_mis.cell(row=tot_row, column=12, value=f"=SUM(L2:L{tot_row-1})").number_format = '₹#,##0.00'
    ws_mis.cell(row=tot_row, column=13, value=f"=SUM(M2:M{tot_row-1})").number_format = '₹#,##0.00'
    ws_mis.cell(row=tot_row, column=14, value=f"=AVERAGE(N2:N{tot_row-1})").number_format = '0.0'

    for col in range(1, len(mis_headers) + 1):
        cell = ws_mis.cell(row=tot_row, column=col)
        cell.font = font_bold
        cell.border = Border(top=Side(style='thin', color='000000'), bottom=Side(style='double', color='000000'))

    # ─────────────────────────────────────────────────────────────────────────────
    # EXECUTIVE DASHBOARD SHEET
    # ─────────────────────────────────────────────────────────────────────────────
    ws_dash.views.sheetView[0].showGridLines = True

    # 1. Main Title Banner (Row 2 to 3)
    ws_dash.merge_cells("B2:P3")
    title_cell = ws_dash["B2"]
    title_cell.value = "METRO HYPERLOCAL EXPRESS — RIDER OPERATIONS MIS COCKPIT\nFleet Productivity, Attendance & Net Payout Reconciliation | Mumbai Operations Hub"
    title_cell.font = Font(name="Calibri", size=14, bold=True, color=white)
    title_cell.fill = fill_title
    title_cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)

    # 2. Executive KPI Cards (Row 5 to 7)
    kpis = [
        ("B", "D", "TOTAL NET PAYOUT", f"=MIS_Summary!M{tot_row}", "₹#,##0"),
        ("E", "G", "TOTAL COMPLETED TRIPS", f"=MIS_Summary!D{tot_row}", "#,##0"),
        ("H", "J", "AVG TRIPS / ACTIVE RIDER", f"=MIS_Summary!N{tot_row}", "0.0"),
        ("K", "M", "TOTAL BONUSES PAID", f"=MIS_Summary!H{tot_row}", "₹#,##0"),
        ("N", "P", "FLEET ATTENDANCE RATE", f"=MIS_Summary!K{tot_row}", "0.0%"),
    ]

    for start_col, end_col, label, formula_val, num_fmt in kpis:
        # Header row 5
        range_hdr = f"{start_col}5:{end_col}5"
        ws_dash.merge_cells(range_hdr)
        hdr_cell = ws_dash[f"{start_col}5"]
        hdr_cell.value = label
        hdr_cell.font = font_kpi_label
        hdr_cell.fill = fill_kpi
        hdr_cell.alignment = Alignment(horizontal="center", vertical="center")

        # Value row 6-7
        range_val = f"{start_col}6:{end_col}7"
        ws_dash.merge_cells(range_val)
        val_cell = ws_dash[f"{start_col}6"]
        val_cell.value = formula_val
        val_cell.font = font_kpi_val
        val_cell.fill = fill_kpi
        val_cell.alignment = Alignment(horizontal="center", vertical="center")
        val_cell.number_format = num_fmt

        # Box border for KPI cards
        for col_letter in [start_col, end_col]:
            for r in [5, 6, 7]:
                ws_dash[f"{col_letter}{r}"].border = box_border

    # 3. Weekly Pivot Table (Columns B to E, Row 9)
    ws_dash.cell(row=9, column=2, value="Weekly Performance Trend").font = font_bold
    ws_dash.cell(row=10, column=2, value="Week").font = font_tbl_header
    ws_dash.cell(row=10, column=2).fill = fill_header
    ws_dash.cell(row=10, column=3, value="Trips Completed").font = font_tbl_header
    ws_dash.cell(row=10, column=3).fill = fill_header
    ws_dash.cell(row=10, column=4, value="Gross Earnings").font = font_tbl_header
    ws_dash.cell(row=10, column=4).fill = fill_header
    ws_dash.cell(row=10, column=5, value="Avg Trips/Day").font = font_tbl_header
    ws_dash.cell(row=10, column=5).fill = fill_header

    for w_idx in range(1, 6):
        r_num = 10 + w_idx
        w_lbl = f"Week {w_idx}"
        ws_dash.cell(row=r_num, column=2, value=w_lbl).font = font_regular
        ws_dash.cell(row=r_num, column=3, value=f'=SUMIF(Raw_Data!$K:$K, "{w_lbl}", Raw_Data!$D:$D)').number_format = '#,##0'
        ws_dash.cell(row=r_num, column=4, value=f'=SUMPRODUCT((Raw_Data!$K$2:$K${total_raw_rows}="{w_lbl}")*(Raw_Data!$D$2:$D${total_raw_rows})*(Raw_Data!$F$2:$F${total_raw_rows}))').number_format = '₹#,##0'
        ws_dash.cell(row=r_num, column=5, value=f'=C{r_num}/(COUNTIFS(Raw_Data!$K:$K, "{w_lbl}", Raw_Data!$I:$I, "Present"))').number_format = '0.0'

    # Weekly Total
    ws_dash.cell(row=16, column=2, value="Total").font = font_bold
    ws_dash.cell(row=16, column=3, value="=SUM(C11:C15)").font = font_bold
    ws_dash.cell(row=16, column=3).number_format = '#,##0'
    ws_dash.cell(row=16, column=4, value="=SUM(D11:D15)").font = font_bold
    ws_dash.cell(row=16, column=4).number_format = '₹#,##0'
    ws_dash.cell(row=16, column=5, value="=AVERAGE(E11:E15)").font = font_bold
    ws_dash.cell(row=16, column=5).number_format = '0.0'

    # 4. Zone Performance Table (Columns G to J, Row 9)
    ws_dash.cell(row=9, column=7, value="Zone Performance Breakdown").font = font_bold
    ws_dash.cell(row=10, column=7, value="Zone Hub").font = font_tbl_header
    ws_dash.cell(row=10, column=7).fill = fill_header
    ws_dash.cell(row=10, column=8, value="Active Riders").font = font_tbl_header
    ws_dash.cell(row=10, column=8).fill = fill_header
    ws_dash.cell(row=10, column=9, value="Total Trips").font = font_tbl_header
    ws_dash.cell(row=10, column=9).fill = fill_header
    ws_dash.cell(row=10, column=10, value="Net Payout").font = font_tbl_header
    ws_dash.cell(row=10, column=10).fill = fill_header

    zones = ['Bandra West', 'Andheri East', 'Powai Tech-Hub', 'South Mumbai']
    for z_idx, z_name in enumerate(zones, start=11):
        ws_dash.cell(row=z_idx, column=7, value=z_name).font = font_regular
        ws_dash.cell(row=z_idx, column=8, value=f'=COUNTIF(MIS_Summary!$C$2:$C$13, "{z_name}")').number_format = '#,##0'
        ws_dash.cell(row=z_idx, column=9, value=f'=SUMIF(MIS_Summary!$C$2:$C$13, "{z_name}", MIS_Summary!$D$2:$D$13)').number_format = '#,##0'
        ws_dash.cell(row=z_idx, column=10, value=f'=SUMIF(MIS_Summary!$C$2:$C$13, "{z_name}", MIS_Summary!$M$2:$M$13)').number_format = '₹#,##0'

    ws_dash.cell(row=15, column=7, value="Total").font = font_bold
    ws_dash.cell(row=15, column=8, value="=SUM(H11:H14)").font = font_bold
    ws_dash.cell(row=15, column=9, value="=SUM(I11:I14)").font = font_bold
    ws_dash.cell(row=15, column=9).number_format = '#,##0'
    ws_dash.cell(row=15, column=10, value="=SUM(J11:J14)").font = font_bold
    ws_dash.cell(row=15, column=10).number_format = '₹#,##0'

    # 5. Top 5 Riders by Net Payout (Columns L to P, Row 9)
    ws_dash.cell(row=9, column=12, value="Top 5 Riders by Payout").font = font_bold
    ws_dash.cell(row=10, column=12, value="Rider ID").font = font_tbl_header
    ws_dash.cell(row=10, column=12).fill = fill_header
    ws_dash.cell(row=10, column=13, value="Rider Name").font = font_tbl_header
    ws_dash.cell(row=10, column=13).fill = fill_header
    ws_dash.cell(row=10, column=14, value="Trips").font = font_tbl_header
    ws_dash.cell(row=10, column=14).fill = fill_header
    ws_dash.cell(row=10, column=15, value="Attendance").font = font_tbl_header
    ws_dash.cell(row=10, column=15).fill = fill_header
    ws_dash.cell(row=10, column=16, value="Net Payout").font = font_tbl_header
    ws_dash.cell(row=10, column=16).fill = fill_header

    # Pre-populate top 5 rider rows referencing MIS_Summary
    for top_idx in range(1, 6):
        r_dash = 10 + top_idx
        r_mis = top_idx + 1
        ws_dash.cell(row=r_dash, column=12, value=f'=MIS_Summary!A{r_mis}').font = font_regular
        ws_dash.cell(row=r_dash, column=13, value=f'=MIS_Summary!B{r_mis}').font = font_regular
        ws_dash.cell(row=r_dash, column=14, value=f'=MIS_Summary!D{r_mis}').number_format = '#,##0'
        ws_dash.cell(row=r_dash, column=15, value=f'=MIS_Summary!K{r_mis}').number_format = '0.0%'
        ws_dash.cell(row=r_dash, column=16, value=f'=MIS_Summary!M{r_mis}').number_format = '₹#,##0'

    # Apply crisp table cell borders to all Dashboard summary tables
    thin_cell_border = Border(
        left=Side(style='thin', color='D9D9D9'),
        right=Side(style='thin', color='D9D9D9'),
        top=Side(style='thin', color='D9D9D9'),
        bottom=Side(style='thin', color='D9D9D9')
    )
    header_cell_border = Border(
        left=Side(style='thin', color='1F4E79'),
        right=Side(style='thin', color='1F4E79'),
        top=Side(style='thin', color='1F4E79'),
        bottom=Side(style='medium', color='1F4E79')
    )
    total_cell_border = Border(
        left=Side(style='thin', color='D9D9D9'),
        right=Side(style='thin', color='D9D9D9'),
        top=Side(style='thin', color='1F4E79'),
        bottom=Side(style='double', color='1F4E79')
    )

    # Table 1: Weekly Trend Borders (B10:E16)
    for c in range(2, 6):
        ws_dash.cell(row=10, column=c).border = header_cell_border
        for r in range(11, 16):
            ws_dash.cell(row=r, column=c).border = thin_cell_border
        ws_dash.cell(row=16, column=c).border = total_cell_border

    # Table 2: Zone Performance Borders (G10:J15)
    for c in range(7, 11):
        ws_dash.cell(row=10, column=c).border = header_cell_border
        for r in range(11, 15):
            ws_dash.cell(row=r, column=c).border = thin_cell_border
        ws_dash.cell(row=15, column=c).border = total_cell_border

    # Table 3: Top 5 Riders Borders (L10:P16)
    for c in range(12, 17):
        ws_dash.cell(row=10, column=c).border = header_cell_border
        for r in range(11, 16):
            ws_dash.cell(row=r, column=c).border = thin_cell_border

    # ─────────────────────────────────────────────────────────────────────────────
    # CHARTS IN DASHBOARD SHEET (Non-overlapping 2-Column Grid + Full Width Macro)
    # Tier 1 (Row 18-33): Chart 1 at B18, Chart 2 at J18 (Col I spacer)
    # Tier 2 (Row 36-51): Chart 3 at B36, Chart 4 at J36 (Col I spacer, Rows 34-35 spacer)
    # Tier 3 (Row 54-69): Chart 5 at B54 (Full Width 35.5cm, Rows 52-53 spacer)
    # ─────────────────────────────────────────────────────────────────────────────

    # Chart 1: Bar Chart of Weekly Trips (Placed at B18, spans B..H, rows 18..33)
    chart1 = BarChart()
    chart1.type = "col"
    chart1.style = 10
    chart1.title = "Weekly Trips Completed"
    chart1.y_axis.title = "Trips"
    chart1.x_axis.title = "Operating Week"
    chart1.height = 8.5
    chart1.width = 17.0

    data1 = Reference(ws_dash, min_col=3, min_row=10, max_row=15)
    cats1 = Reference(ws_dash, min_col=2, min_row=11, max_row=15)
    chart1.add_data(data1, titles_from_data=True)
    chart1.set_categories(cats1)
    ws_dash.add_chart(chart1, "B18")

    # Chart 2: Column Chart of Zone Trips (Placed at J18, spans J..P, rows 18..33)
    chart2 = BarChart()
    chart2.type = "col"
    chart2.style = 11
    chart2.title = "Trip Volume by Zone Hub"
    chart2.y_axis.title = "Trips"
    chart2.x_axis.title = "Zone Hub"
    chart2.height = 8.5
    chart2.width = 17.0

    data2 = Reference(ws_dash, min_col=9, min_row=10, max_row=14)
    cats2 = Reference(ws_dash, min_col=7, min_row=11, max_row=14)
    chart2.add_data(data2, titles_from_data=True)
    chart2.set_categories(cats2)
    ws_dash.add_chart(chart2, "J18")

    # Chart 3: Doughnut Chart of Zone Fleet Distribution (Placed at B36, spans B..H, rows 36..51)
    chart3 = DoughnutChart()
    chart3.title = "Rider Fleet Distribution by Hub"
    chart3.style = 10
    chart3.height = 8.5
    chart3.width = 17.0

    data3 = Reference(ws_dash, min_col=8, min_row=10, max_row=14)
    cats3 = Reference(ws_dash, min_col=7, min_row=11, max_row=14)
    chart3.add_data(data3, titles_from_data=True)
    chart3.set_categories(cats3)
    ws_dash.add_chart(chart3, "B36")

    # Chart 4: Column Chart of Top 5 Riders Net Payout (Placed at J36, spans J..P, rows 36..51)
    chart4 = BarChart()
    chart4.type = "col"
    chart4.style = 13
    chart4.title = "Top 5 Riders by Net Payout (₹)"
    chart4.y_axis.title = "Net Payout (₹)"
    chart4.x_axis.title = "Rider"
    chart4.height = 8.5
    chart4.width = 17.0

    data4 = Reference(ws_dash, min_col=16, min_row=10, max_row=15)
    cats4 = Reference(ws_dash, min_col=13, min_row=11, max_row=15)
    chart4.add_data(data4, titles_from_data=True)
    chart4.set_categories(cats4)
    ws_dash.add_chart(chart4, "J36")

    # Chart 5: Column Chart of Weekly Gross Revenue (Placed at B54, spans B..P, rows 54..69)
    chart5 = BarChart()
    chart5.type = "col"
    chart5.style = 10
    chart5.title = "Weekly Gross Revenue Disbursed (₹)"
    chart5.y_axis.title = "Gross Revenue (₹)"
    chart5.x_axis.title = "Operating Week"
    chart5.height = 8.5
    chart5.width = 35.5

    data5 = Reference(ws_dash, min_col=4, min_row=10, max_row=15)
    cats5 = Reference(ws_dash, min_col=2, min_row=11, max_row=15)
    chart5.add_data(data5, titles_from_data=True)
    chart5.set_categories(cats5)
    ws_dash.add_chart(chart5, "B54")

    # ─────────────────────────────────────────────────────────────────────────────
    # AI INSIGHTS & FORMULA DOCUMENTATION SHEET
    # ─────────────────────────────────────────────────────────────────────────────
    ai_headers = ['Metric / Output', 'Excel Formula Syntax', 'Formula Type', 'Business Purpose & Operational Meaning']
    ws_ai.append(ai_headers)
    for col_idx in range(1, len(ai_headers) + 1):
        cell = ws_ai.cell(row=1, column=col_idx)
        cell.font = font_tbl_header
        cell.fill = fill_header
        cell.alignment = Alignment(horizontal='center', vertical='center')

    formula_docs = [
        (
            'Rider Name & Zone Lookup',
            '=XLOOKUP(A2, Raw_Data!A:A, Raw_Data!B:B)',
            'Dynamic Lookup (XLOOKUP)',
            'Automatically resolves the rider full name from transactional logs without hardcoding. Replaces legacy VLOOKUP with left-lookup capability.'
        ),
        (
            'Total Completed Trips',
            '=SUMIF(Raw_Data!A:A, A2, Raw_Data!D:D)',
            'Conditional Summation (SUMIF)',
            'Aggregates all daily completed trip entries for the specified Rider ID across the entire 5-week reporting period.'
        ),
        (
            'Gross Trip Earnings',
            '=SUMPRODUCT((Raw_Data!A$2:A$100=A2)*(Raw_Data!D$2:D$100)*(Raw_Data!F$2:F$100))',
            'Matrix Multiplication (SUMPRODUCT)',
            'Multiplies daily completed trips by the individual rate per trip for matching rider records and calculates cumulative gross earnings before deductions.'
        ),
        (
            'Performance Bonus Count',
            '=COUNTIFS(Raw_Data!A:A, A2, Raw_Data!G:G, "Y")',
            'Multi-Condition Count (COUNTIFS)',
            'Counts the number of operating shifts where the rider completed threshold trips (11+ orders) to qualify for the ₹250 daily efficiency incentive.'
        ),
        (
            'Attendance Reliability Rate',
            '=COUNTIFS(Raw_Data!A:A, A2, Raw_Data!I:I, "Present") / COUNTIF(Raw_Data!A:A, A2)',
            'Proportional Ratio (COUNTIFS / COUNTIF)',
            'Calculates active shift compliance by dividing days marked Present by total scheduled working days. Critical for identifying fleet absenteeism.'
        ),
        (
            'Net Final Payout',
            '=Gross_Earnings + Bonus_Payout - Deductions',
            'Mathematical Reconciliation',
            'Calculates the net disbursement amount payable to each rider after adjusting for daily performance bonuses and traffic/spillage deductions.'
        ),
        (
            'Max Single-Day Trips',
            '=MAXIFS(Raw_Data!D:D, Raw_Data!A:A, A2)',
            'Conditional Extremum (MAXIFS)',
            'Identifies the single peak operational shift output achieved by the rider during peak weekend or monsoon demand spikes.'
        ),
        (
            'Average Daily Trips',
            '=IFERROR(Total_Trips / Days_Present, 0)',
            'Safe Division (IFERROR)',
            'Measures real shift productivity by dividing total completed orders by active working days only, avoiding skew from approved off-days.'
        ),
    ]

    for item in formula_docs:
        ws_ai.append(item)

    # Style AI_Insights
    for r in range(2, len(formula_docs) + 2):
        ws_ai.cell(row=r, column=1).font = font_bold
        ws_ai.cell(row=r, column=2).font = Font(name="Consolas", size=9, color="00478F")
        ws_ai.cell(row=r, column=3).font = font_regular
        ws_ai.cell(row=r, column=4).font = font_regular

    # Auto-fit column widths across all sheets
    for ws in [ws_raw, ws_mis, ws_dash, ws_ai]:
        for col in ws.columns:
            max_len = 0
            col_letter = get_column_letter(col[0].column)
            for cell in col:
                val = cell.value
                if val:
                    val_str = str(val)
                    if '\n' in val_str:
                        val_str = max(val_str.split('\n'), key=len)
                    max_len = max(max_len, len(val_str))
            ws.column_dimensions[col_letter].width = max(max_len + 3, 12)

    # Specific custom column widths for Dashboard to ensure clean alignment and spacing
    dash_col_widths = {
        'A': 3,
        'B': 13,
        'C': 15,
        'D': 16,
        'E': 14,
        'F': 4,   # Clean margin spacer between Table 1 & Table 2
        'G': 16,
        'H': 14,
        'I': 14,  # Clean margin spacer between Left & Right Charts
        'J': 16,
        'K': 4,   # Clean margin spacer between Table 2 & Table 3
        'L': 12,
        'M': 18,
        'N': 12,
        'O': 14,
        'P': 16,
    }
    for col_letter, width_val in dash_col_widths.items():
        ws_dash.column_dimensions[col_letter].width = width_val

    # Guarantee gridlines are visible across all worksheets (especially Dashboard sheet)
    for ws in [ws_dash, ws_raw, ws_mis, ws_ai]:
        ws.sheet_view.showGridLines = True
        ws.views.sheetView[0].showGridLines = True

    # Save workbook
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    wb.save(output_path)
    print(f"Successfully generated: {output_path}")

if __name__ == '__main__':
    target_web = r"d:\Datta Sable\dattasable\public\templates\Hyperlocal_Fleet_Ops_MIS_Dashboard_Template.xlsx"
    target_dl = r"C:\Users\sable\Downloads\Bank Data\Hyperlocal_Fleet_Ops_MIS_Dashboard_Template.xlsx"
    target_dl_v2 = r"C:\Users\sable\Downloads\Bank Data\Hyperlocal_Fleet_Ops_MIS_Dashboard_v2.xlsx"
    
    # Always update the web template
    create_rider_ops_template(target_web)

    # Save to user's Bank Data directory
    for path in [target_dl, target_dl_v2]:
        try:
            create_rider_ops_template(path)
        except PermissionError:
            print(f"File {path} is currently locked by Excel, skipping.")
