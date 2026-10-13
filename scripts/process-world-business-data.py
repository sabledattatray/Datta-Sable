import duckdb
import json
import time
import os

def process_data():
    csv_path = 'C:/Users/sable/world_business_data_3m.csv'
    output_path = 'd:/Datta Sable/dattasable/public/data/world_business_3m.json'

    print(f"Connecting to DuckDB and loading {csv_path}...")
    t_start = time.time()
    con = duckdb.connect()

    # 1. Global KPIs
    print("Computing Global KPIs...")
    kpis = con.execute(f"""
        SELECT 
            count(*) as total_orders,
            round(sum(revenue), 2) as total_revenue,
            round(sum(profit), 2) as total_profit,
            round(sum(cost), 2) as total_cost,
            round(sum(profit) / sum(revenue) * 100, 2) as profit_margin_pct,
            round(avg(revenue), 2) as avg_order_value,
            round(avg(customer_satisfaction), 2) as avg_csat,
            round(sum(CASE WHEN is_repeat_customer THEN 1 ELSE 0 END) * 100.0 / count(*), 1) as repeat_customer_pct,
            round(sum(CASE WHEN payment_status = 'Failed' THEN 1 ELSE 0 END) * 100.0 / count(*), 2) as payment_failure_pct,
            count(distinct country) as unique_countries,
            count(distinct customer_id) as unique_customers,
            cast(sum(quantity) as BIGINT) as total_quantity
        FROM read_csv_auto('{csv_path}')
    """).df().to_dict(orient='records')[0]

    # 2. Performance by Year
    print("Computing yearly trends...")
    by_year = con.execute(f"""
        SELECT 
            extract(year from cast(order_date as DATE)) as year,
            count(*) as orders,
            round(sum(revenue), 2) as revenue,
            round(sum(profit), 2) as profit,
            round(sum(cost), 2) as cost,
            round(sum(profit) / sum(revenue) * 100, 2) as profit_margin_pct,
            round(avg(revenue), 2) as avg_order_value,
            cast(sum(quantity) as BIGINT) as total_quantity
        FROM read_csv_auto('{csv_path}')
        GROUP BY 1
        ORDER BY 1 ASC
    """).df().to_dict(orient='records')

    # 3. Monthly Trends (60 months)
    print("Computing monthly timeline...")
    monthly_trend = con.execute(f"""
        SELECT 
            strftime(cast(order_date as DATE), '%Y-%m') as month,
            extract(year from cast(order_date as DATE)) as year,
            strftime(cast(order_date as DATE), '%b %Y') as label,
            count(*) as orders,
            round(sum(revenue), 2) as revenue,
            round(sum(profit), 2) as profit,
            round(sum(cost), 2) as cost,
            round(sum(profit) / sum(revenue) * 100, 2) as margin_pct
        FROM read_csv_auto('{csv_path}')
        GROUP BY 1, 2, 3
        ORDER BY 1 ASC
    """).df().to_dict(orient='records')

    # 4. By Continent
    print("Computing continent metrics...")
    by_continent = con.execute(f"""
        SELECT 
            continent,
            count(*) as orders,
            round(sum(revenue), 2) as revenue,
            round(sum(profit), 2) as profit,
            round(sum(profit) / sum(revenue) * 100, 2) as profit_margin_pct,
            round(avg(revenue), 2) as avg_order_value,
            count(distinct country) as country_count,
            round(sum(revenue) * 100.0 / (SELECT sum(revenue) FROM read_csv_auto('{csv_path}')), 2) as share_pct
        FROM read_csv_auto('{csv_path}')
        GROUP BY 1
        ORDER BY revenue DESC
    """).df().to_dict(orient='records')

    # 5. By Country (Top 30)
    print("Computing top countries...")
    by_country = con.execute(f"""
        SELECT 
            country,
            continent,
            count(*) as orders,
            round(sum(revenue), 2) as revenue,
            round(sum(profit), 2) as profit,
            round(sum(profit) / sum(revenue) * 100, 2) as profit_margin_pct,
            round(avg(revenue), 2) as avg_order_value,
            round(avg(customer_satisfaction), 2) as avg_csat
        FROM read_csv_auto('{csv_path}')
        GROUP BY 1, 2
        ORDER BY revenue DESC
        LIMIT 30
    """).df().to_dict(orient='records')

    # 6. By Product Category
    print("Computing product categories...")
    by_category = con.execute(f"""
        SELECT 
            product_category,
            count(*) as orders,
            round(sum(revenue), 2) as revenue,
            round(sum(profit), 2) as profit,
            round(sum(profit) / sum(revenue) * 100, 2) as profit_margin_pct,
            cast(sum(quantity) as BIGINT) as total_quantity,
            round(avg(unit_price), 2) as avg_unit_price,
            round(sum(revenue) * 100.0 / (SELECT sum(revenue) FROM read_csv_auto('{csv_path}')), 2) as share_pct
        FROM read_csv_auto('{csv_path}')
        GROUP BY 1
        ORDER BY revenue DESC
    """).df().to_dict(orient='records')

    # 7. Top Products
    print("Computing top products...")
    by_top_products = con.execute(f"""
        SELECT 
            product_name,
            product_category,
            brand,
            count(*) as orders,
            round(sum(revenue), 2) as revenue,
            round(sum(profit), 2) as profit,
            round(sum(profit) / sum(revenue) * 100, 2) as margin_pct,
            cast(sum(quantity) as BIGINT) as total_quantity,
            round(avg(unit_price), 2) as avg_unit_price
        FROM read_csv_auto('{csv_path}')
        GROUP BY 1, 2, 3
        ORDER BY revenue DESC
        LIMIT 20
    """).df().to_dict(orient='records')

    # 8. By Industry
    print("Computing industry performance...")
    by_industry = con.execute(f"""
        SELECT 
            industry,
            count(*) as orders,
            round(sum(revenue), 2) as revenue,
            round(sum(profit), 2) as profit,
            round(sum(profit) / sum(revenue) * 100, 2) as profit_margin_pct,
            round(avg(revenue), 2) as avg_order_value,
            round(sum(revenue) * 100.0 / (SELECT sum(revenue) FROM read_csv_auto('{csv_path}')), 2) as share_pct
        FROM read_csv_auto('{csv_path}')
        GROUP BY 1
        ORDER BY revenue DESC
    """).df().to_dict(orient='records')

    # 9. By Sales Channel
    print("Computing sales channels...")
    by_channel = con.execute(f"""
        SELECT 
            sales_channel,
            count(*) as orders,
            round(sum(revenue), 2) as revenue,
            round(sum(profit), 2) as profit,
            round(sum(profit) / sum(revenue) * 100, 2) as profit_margin_pct,
            round(avg(revenue), 2) as avg_order_value,
            round(sum(revenue) * 100.0 / (SELECT sum(revenue) FROM read_csv_auto('{csv_path}')), 2) as share_pct
        FROM read_csv_auto('{csv_path}')
        GROUP BY 1
        ORDER BY revenue DESC
    """).df().to_dict(orient='records')

    # 10. By Marketing Source & Campaign
    print("Computing marketing sources & campaigns...")
    by_marketing_source = con.execute(f"""
        SELECT 
            marketing_source,
            count(*) as orders,
            round(sum(revenue), 2) as revenue,
            round(sum(profit), 2) as profit,
            round(avg(customer_satisfaction), 2) as avg_csat
        FROM read_csv_auto('{csv_path}')
        GROUP BY 1
        ORDER BY revenue DESC
    """).df().to_dict(orient='records')

    by_campaign = con.execute(f"""
        SELECT 
            campaign,
            count(*) as orders,
            round(sum(revenue), 2) as revenue,
            round(sum(profit), 2) as profit,
            round(sum(profit) / sum(revenue) * 100, 2) as margin_pct,
            round(sum(CASE WHEN is_repeat_customer THEN 1 ELSE 0 END) * 100.0 / count(*), 1) as repeat_pct
        FROM read_csv_auto('{csv_path}')
        GROUP BY 1
        ORDER BY revenue DESC
    """).df().to_dict(orient='records')

    # 11. Customer Loyalty Tier
    print("Computing loyalty tiers...")
    by_loyalty = con.execute(f"""
        SELECT 
            loyalty_tier,
            count(*) as orders,
            round(sum(revenue), 2) as revenue,
            round(sum(profit), 2) as profit,
            round(avg(revenue), 2) as avg_order_value,
            round(avg(customer_satisfaction), 2) as avg_csat,
            round(sum(CASE WHEN is_repeat_customer THEN 1 ELSE 0 END) * 100.0 / count(*), 1) as repeat_pct
        FROM read_csv_auto('{csv_path}')
        GROUP BY 1
        ORDER BY revenue DESC
    """).df().to_dict(orient='records')

    # 12. Payment Methods & Status
    print("Computing payment stats...")
    by_payment_method = con.execute(f"""
        SELECT 
            payment_method,
            count(*) as orders,
            round(sum(revenue), 2) as revenue,
            round(sum(profit), 2) as profit,
            round(sum(CASE WHEN payment_status = 'Failed' THEN 1 ELSE 0 END) * 100.0 / count(*), 2) as failure_rate_pct
        FROM read_csv_auto('{csv_path}')
        GROUP BY 1
        ORDER BY revenue DESC
    """).df().to_dict(orient='records')

    by_payment_status = con.execute(f"""
        SELECT 
            payment_status,
            count(*) as orders,
            round(sum(revenue), 2) as revenue,
            round(sum(revenue) * 100.0 / (SELECT sum(revenue) FROM read_csv_auto('{csv_path}')), 2) as share_pct
        FROM read_csv_auto('{csv_path}')
        GROUP BY 1
        ORDER BY orders DESC
    """).df().to_dict(orient='records')

    # 13. Fulfillment & Shipping
    print("Computing fulfillment metrics...")
    by_shipping = con.execute(f"""
        SELECT 
            shipping_method,
            count(*) as orders,
            round(sum(revenue), 2) as revenue,
            round(avg(datediff('day', cast(order_date as DATE), cast(delivery_date as DATE))), 1) as avg_delivery_days
        FROM read_csv_auto('{csv_path}')
        GROUP BY 1
        ORDER BY orders DESC
    """).df().to_dict(orient='records')

    by_warehouse = con.execute(f"""
        SELECT 
            warehouse_id,
            count(*) as orders,
            round(sum(revenue), 2) as revenue,
            round(sum(profit), 2) as profit
        FROM read_csv_auto('{csv_path}')
        GROUP BY 1
        ORDER BY warehouse_id ASC
    """).df().to_dict(orient='records')

    # 14. Customer Demographics
    print("Computing customer demographics...")
    demographics_age = con.execute(f"""
        SELECT 
            CASE 
                WHEN age < 25 THEN 'Under 25'
                WHEN age BETWEEN 25 AND 34 THEN '25 - 34'
                WHEN age BETWEEN 35 AND 49 THEN '35 - 49'
                WHEN age BETWEEN 50 AND 64 THEN '50 - 64'
                ELSE '65+'
            END as age_group,
            count(*) as orders,
            round(sum(revenue), 2) as revenue,
            round(sum(profit), 2) as profit,
            round(avg(customer_satisfaction), 2) as avg_csat
        FROM read_csv_auto('{csv_path}')
        GROUP BY 1
        ORDER BY 1 ASC
    """).df().to_dict(orient='records')

    demographics_device = con.execute(f"""
        SELECT 
            device,
            count(*) as orders,
            round(sum(revenue), 2) as revenue,
            round(sum(revenue) * 100.0 / (SELECT sum(revenue) FROM read_csv_auto('{csv_path}')), 2) as share_pct
        FROM read_csv_auto('{csv_path}')
        GROUP BY 1
        ORDER BY orders DESC
    """).df().to_dict(orient='records')

    # 15. Cross-Filters Matrix: Continent x Year
    print("Computing Continent x Year cross matrix...")
    continent_year = con.execute(f"""
        SELECT 
            continent,
            extract(year from cast(order_date as DATE)) as year,
            count(*) as orders,
            round(sum(revenue), 2) as revenue,
            round(sum(profit), 2) as profit,
            round(sum(profit) / sum(revenue) * 100, 2) as margin_pct
        FROM read_csv_auto('{csv_path}')
        GROUP BY 1, 2
        ORDER BY 1, 2 ASC
    """).df().to_dict(orient='records')

    # 16. Cross-Filters Matrix: Category x Year
    print("Computing Category x Year cross matrix...")
    category_year = con.execute(f"""
        SELECT 
            product_category,
            extract(year from cast(order_date as DATE)) as year,
            count(*) as orders,
            round(sum(revenue), 2) as revenue,
            round(sum(profit), 2) as profit
        FROM read_csv_auto('{csv_path}')
        GROUP BY 1, 2
        ORDER BY 1, 2 ASC
    """).df().to_dict(orient='records')

    # 17. Sample High-Precision Transactions (1,000 diverse records)
    print("Extracting 1,000 real sample transactions for live table...")
    sample_transactions = con.execute(f"""
        SELECT 
            record_id,
            order_id,
            customer_id,
            first_name || ' ' || last_name as customer_name,
            company_name,
            industry,
            country,
            continent,
            product_name,
            product_category,
            brand,
            cast(order_date as VARCHAR) as order_date,
            quantity,
            round(unit_price, 2) as unit_price,
            discount_pct,
            round(revenue, 2) as revenue,
            round(profit, 2) as profit,
            payment_method,
            payment_status,
            shipping_method,
            order_status,
            sales_channel,
            customer_satisfaction as csat
        FROM read_csv_auto('{csv_path}')
        WHERE record_id % 3000 = 1
        ORDER BY record_id ASC
        LIMIT 1000
    """).df().to_dict(orient='records')

    payload = {
        "metadata": {
            "dataset_name": "World Business Intelligence Enterprise Dataset",
            "source_records": kpis["total_orders"],
            "currency": "USD ($)",
            "date_range": "2022-01-01 to 2026-12-31",
            "generated_at": time.strftime("%Y-%m-%d %H:%M:%S")
        },
        "kpis": kpis,
        "by_year": by_year,
        "monthly_trend": monthly_trend,
        "by_continent": by_continent,
        "by_country": by_country,
        "by_category": by_category,
        "by_top_products": by_top_products,
        "by_industry": by_industry,
        "by_channel": by_channel,
        "by_marketing_source": by_marketing_source,
        "by_campaign": by_campaign,
        "by_loyalty": by_loyalty,
        "by_payment_method": by_payment_method,
        "by_payment_status": by_payment_status,
        "by_shipping": by_shipping,
        "by_warehouse": by_warehouse,
        "demographics_age": demographics_age,
        "demographics_device": demographics_device,
        "continent_year": continent_year,
        "category_year": category_year,
        "sample_transactions": sample_transactions
    }

    print(f"Writing aggregated payload to {output_path}...")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(payload, f, separators=(',', ':'))

    size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"DONE in {time.time()-t_start:.2f}s! File size: {size_mb:.2f} MB")

if __name__ == '__main__':
    process_data()
