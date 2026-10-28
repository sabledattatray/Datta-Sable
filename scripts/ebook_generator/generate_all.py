import os
import json
import hashlib
from playwright.sync_api import sync_playwright
from pypdf import PdfReader

from template import render_book_html
from book1_databricks import BOOK_DATABRICKS
from book2_datamodeling import BOOK_DATAMODELING
from book3_postgres import BOOK_POSTGRES
from book4_dbt import BOOK_DBT
from book5_snowflake import BOOK_SNOWFLAKE
from book6_genai import BOOK_GENAI
from book7_exec_bi import BOOK_EXEC_BI
from book8_security import BOOK_SECURITY
from book9_devops import BOOK_DEVOPS
from book10_governance import BOOK_GOVERNANCE

ALL_BOOKS = [
    BOOK_DATABRICKS,
    BOOK_DATAMODELING,
    BOOK_POSTGRES,
    BOOK_DBT,
    BOOK_SNOWFLAKE,
    BOOK_GENAI,
    BOOK_EXEC_BI,
    BOOK_SECURITY,
    BOOK_DEVOPS,
    BOOK_GOVERNANCE
]

STORAGE_DIR = os.path.abspath("storage/ebooks/imports")
COVERS_DIR = os.path.abspath("public/images/ebooks")

os.makedirs(STORAGE_DIR, exist_ok=True)
os.makedirs(COVERS_DIR, exist_ok=True)

def generate_ebooks():
    catalog_entries = []
    
    with sync_playwright() as p:
        print("Launching Microsoft Edge browser...")
        browser = p.chromium.launch(channel="msedge", headless=True)
        page = browser.new_page()

        for idx, book in enumerate(ALL_BOOKS, start=1):
            slug = book["slug"]
            title = book["title"]
            pdf_filename = f"{slug}.pdf"
            pdf_path = os.path.join(STORAGE_DIR, pdf_filename)
            cover_path = os.path.join(COVERS_DIR, f"{slug}.png")
            temp_html_path = os.path.join(STORAGE_DIR, f"temp_{slug}.html")

            print(f"\n[{idx}/10] Generating eBook: {title} ({slug})...")
            
            # 1. Render HTML
            html_content = render_book_html(book)
            with open(temp_html_path, "w", encoding="utf-8") as f:
                f.write(html_content)

            # 2. Load into Edge
            page.goto(f"file:///{temp_html_path.replace(os.sep, '/')}")
            page.wait_for_load_state("networkidle")

            # 3. Export PDF
            page.pdf(
                path=pdf_path,
                format="A4",
                print_background=True,
                margin={"top": "0", "bottom": "0", "left": "0", "right": "0"}
            )

            # 4. Export Cover Screenshot
            cover_elem = page.locator("#cover")
            cover_elem.screenshot(path=cover_path)

            # 5. Clean up temp HTML
            if os.path.exists(temp_html_path):
                os.remove(temp_html_path)

            # 6. Verify Page Count with pypdf
            reader = PdfReader(pdf_path)
            num_pages = len(reader.pages)
            file_bytes = open(pdf_path, "rb").read()
            byte_size = len(file_bytes)
            sha256 = hashlib.sha256(file_bytes).hexdigest()

            print(f"  -> Verified PDF: {num_pages} pages | {byte_size} bytes | SHA256: {sha256[:12]}...")
            print(f"  -> Verified Cover: {cover_path} ({os.path.getsize(cover_path)} bytes)")

            assert num_pages >= 20, f"Error: Book {slug} has {num_pages} pages (< 20 required!)"

            # 7. Formulate Catalog Record
            record = {
                "product": {
                    "slug": slug,
                    "title": title,
                    "excerpt": book["subtitle"],
                    "description": f"A 22-page practical production handbook by Datta Sable covering {title}. Complete architecture blueprints, code walkthroughs, and checklists. PDF handbook only; no companion source code archive supplied.",
                    "category": book["category_name"],
                    "image": f"/images/ebooks/{slug}.png",
                    "priceMinor": 9900,
                    "currency": "INR",
                    "status": "DRAFT",
                    "salesEnabled": False,
                    "deliveryReady": False,
                    "features": book["features"],
                    "includedResources": book["included_resources"],
                    "deliveryMethod": "ACCOUNT_DOWNLOAD",
                    "seoTitle": book["seo_title"],
                    "seoDescription": book["seo_desc"]
                },
                "profile": {
                    "sku": book["sku"],
                    "author": "Datta Sable",
                    "edition": "2026 Edition",
                    "pageCount": num_pages,
                    "language": "English",
                    "version": "1.0",
                    "featured": True,
                    "approved": False,
                    "contents": [page["h1"] for page in book["pages"][:10]],
                    "outcomes": [
                        f"Master end-to-end architecture for {title}",
                        "Apply production-grade code, schemas, and configurations",
                        "Review enterprise checklists and troubleshooting runbooks"
                    ],
                    "audience": [
                        "Data Architects",
                        "Analytics Engineers",
                        "Senior Database Engineers",
                        "Technical Leaders"
                    ],
                    "prerequisites": [
                        "Basic familiarity with modern data architectures",
                        "Familiarity with SQL and analytical databases"
                    ],
                    "notIncluded": [
                        "Downloadable companion ZIP source code",
                        "Live cloud environment subscription credentials"
                    ],
                    "license": "Personal learning use only. Redistribution, resale, and public upload are strictly prohibited.",
                    "updatePolicy": "Access includes the purchased PDF version. Future editions are not included unless explicitly stated."
                },
                "categorySlugs": book["all_category_slugs"],
                "asset": {
                    "filename": pdf_filename,
                    "sha256": sha256,
                    "byteSize": byte_size,
                    "mimeType": "application/pdf"
                },
                "reviewNotes": []
            }
            catalog_entries.append(record)

        browser.close()

    # Save output catalog entries to json
    output_path = os.path.abspath("scripts/ebook_generator/generated_catalog_entries.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(catalog_entries, f, indent=2)
    print(f"\nAll 10 eBooks generated successfully! Catalog entries saved to {output_path}")

if __name__ == "__main__":
    generate_ebooks()
