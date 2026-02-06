from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from pathlib import Path
import os
from dotenv import load_dotenv
import gspread
from google.oauth2.service_account import Credentials
import pandas as pd
import json
## Added by KL on 20260302 - Rectify issue where latest Order per outlet is not showing
from datetime import datetime
## Modified by KL on 20260206 - Only for Localhost (Dev) to pass timestamp
from time import time

app = FastAPI()
load_dotenv()

env_var = os.getenv("ENV")
googleprivatekey = os.getenv("google_private_key")
googleprivatekeyid = os.getenv("google_private_key_id")
googleprojectid = os.getenv("google_project_id")
googleclientemail = os.getenv("google_client_email")
googleclientid = os.getenv("google_client_id")
googleclientx509certurl = os.getenv("google_client_x509_cert_url")
googlesheetmr = os.getenv("google_sheet_madroaster")

print(os.getenv("ENV"))
# print("google_client_email: ", googleclientemail)
# print("google_client_email: ", googleclientid)
# print("google_client_x509_cert_url: ", googleclientx509certurl)
# print("google_private_key: ", googleprivatekey)
# print("google_private_key_id: ", googleprivatekeyid)
# print("google_project_id: ", googleprojectid)
# print("google_sheet_madroaster: ", googlesheetmr)







PROJECT_ENV = os.getenv("ENV")
## Default path to Koyeb Environment
PROJECT_DIR = Path(__file__).resolve().parent
if PROJECT_ENV == 'local':
    PROJECT_DIR = Path(__file__).resolve().parent.parent
elif PROJECT_ENV == 'koyeb.production':
    PROJECT_DIR = Path(__file__).resolve().parent
    

# PROJECT_DIR = Path(__file__).resolve().parent.parent if env_var == 'local' else Path(__file__).resolve().parent
# PROJECT_DIR = Path.cwd()
BACKEND_DIR = PROJECT_DIR.parent
FRONTEND_DIR = PROJECT_DIR / "frontend"
INDEX_FILE = FRONTEND_DIR / "index.html"
ORDERSUBMITTED_PAGE = FRONTEND_DIR / "complete.html"
FRONTEND_DIR_ASSETS = FRONTEND_DIR / "assets"
FRONTEND_DIR_JS = FRONTEND_DIR / "js"
FRONTEND_DIR_VAR = FRONTEND_DIR / "var"
FRONTEND_DIR_CUSTOM = FRONTEND_DIR / "Custom"

## Modified by KL on 20260131 - Build ID for using most updated jQuery file
BUILD_ID = os.getenv("BUILD_ID", "dev");

# print("CWD:", Path.cwd())
# print("PROJECT_ROOT:", PROJECT_DIR)
# print("BACKEND_DIR:", BACKEND_DIR)
# print("FRONTEND_DIR:", FRONTEND_DIR)
# print("FRONTEND_DIR exists:", FRONTEND_DIR.exists())
# print("INDEX_FILE:", INDEX_FILE)
# print("INDEX_FILE exists:", INDEX_FILE.exists())
# print("FRONTEND_DIR_ASSETS:", FRONTEND_DIR_ASSETS)
# print("FRONTEND_DIR_ASSETS exists:", FRONTEND_DIR_ASSETS.exists())
# print("FRONTEND_DIR_JS:", FRONTEND_DIR_JS)
# print("FRONTEND_DIR_JS exists:", FRONTEND_DIR_JS.exists())
# print("FRONTEND_DIR_VAR:", FRONTEND_DIR_VAR)
# print("FRONTEND_DIR_VAR exists:", FRONTEND_DIR_VAR.exists())
# print("FRONTEND_DIR_VAR /dist/js exists:", (FRONTEND_DIR_VAR / "dist/js").exists())
# print("FRONTEND_DIR_CUSTOM:", FRONTEND_DIR_CUSTOM)
# print("FRONTEND_DIR_CUSTOM exists:", FRONTEND_DIR_CUSTOM.exists())

# BASE_DIR = Path(__file__).resolve().parent.parent
# FRONTEND_DIR = BASE_DIR / "frontend"

# Serve frontend assets (css, js, images)
if FRONTEND_DIR.exists():
    ## Modified by KL on 20260131 - To remove caching of JS file when deploying on Koyeb
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIR_ASSETS, html=True), name="assets")
    # app.mount("/js", StaticFiles(directory=FRONTEND_DIR_JS), name="js")
    ## Modified by KL on 20260131 - To remove caching of JS file when deploying on Koyeb
    app.mount("/var", StaticFiles(directory=FRONTEND_DIR_VAR, html=True), name="var")
    app.mount("/Custom", StaticFiles(directory=FRONTEND_DIR_CUSTOM, html=True), name="Custom")

# Root → index.html
@app.get("/")
def read_index():
    if not INDEX_FILE.exists():
        return HTMLResponse("Frontend not found", status_code=404)

    ## Modified by KL on 20260131 - To pass build_id over
    ## Modified by KL on 20260206 - Only for Localhost (Dev) to pass timestamp
    build_id = BUILD_ID
    if build_id == 'dev':
        build_id = str(int(time()))
    print(build_id)
    html = INDEX_FILE.read_text(encoding="utf-8")
    html = html.replace("__BUILD_ID__", build_id)
    
    return HTMLResponse(content=html)
    
    # return FileResponse(INDEX_FILE)

    # return FileResponse(FRONTEND_DIR / "index.html")

@app.get("/sheet")
def get_sheet_data():
    gcred_json = {
        "type": "service_account",
        "project_id": googleprivatekeyid,
        "private_key_id": googleprivatekeyid,
        "private_key": googleprivatekey,
        "client_email": googleclientemail,
        "client_id": googleclientid,
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": googleclientx509certurl,
        "universe_domain": "googleapis.com"
    }
    
    gcred_json["private_key"] = gcred_json["private_key"].replace("\\n", "\n")
    
    # Scope for Google Sheets
    # SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]
    SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
    
    # Open sheet by name or URL
    # sheet = google_client.open("Your Google Sheet Name").sheet1
    # OR: client.open_by_url("https://docs.google.com/...")
    google_creds = Credentials.from_service_account_info(
        gcred_json,
        scopes=SCOPES
    )
    
    google_client = gspread.authorize(google_creds)
    
    sheet = google_client.open_by_url(googlesheetmr)
    worksheet = sheet.worksheet("Order Database")
    rows = worksheet.get_all_values()
    raw_headers = rows[0]
    headers = make_headers_unique(raw_headers)
    
    ## Formatting data in array of dictionary
    sheet_data = [
        dict(zip(headers, row))
        for row in rows[1:]
    ]
    
    sheet_data_transformed = {}
    
    for record in sheet_data:
        orderDate = record["OrderDate"]
        outlet = record["Which outlet are you from?"]
        uniqueIdentifer = record["Unique Identifier"]
        ## Added by KL on 20260302 - Rectify issue where latest Order per outlet is not showing
        timestamp = record["Timestamp"]
        timestamp_dt_obj = datetime.strptime(timestamp.strip(), "%m/%d/%Y %H:%M:%S");
        
        if orderDate not in sheet_data_transformed:
            sheet_data_transformed[orderDate] = {}
            
        if outlet not in sheet_data_transformed[orderDate]:
            sheet_data_transformed[orderDate][outlet] = record
        else:
            ## Modified by KL on 20260302 - Rectify issue where latest Order per outlet is not showing
            sheet_timestamp_dt_obj = datetime.strptime(sheet_data_transformed[orderDate][outlet]["Timestamp"].strip(), "%m/%d/%Y %H:%M:%S");
            if outlet == sheet_data_transformed[orderDate][outlet]['Which outlet are you from?'] and timestamp_dt_obj > sheet_timestamp_dt_obj:
                sheet_data_transformed[orderDate][outlet] = record
                
    flatteneddata = []
    for order_date, outlets in sheet_data_transformed.items():
      for outlet, record in outlets.items():
        flatteneddata.append(record)
        
    cleaned_rows = [remove_empty_keys(row) for row in flatteneddata]

    return cleaned_rows
    # print(flatteneddata)

    
    # print(worksheet.cell(2, 2).value)
    
    # df = pd.DataFrame(rows[1:], columns=headers)
    
    # df["Timestamp"] = pd.to_datetime(
    #     df["Timestamp"],
    #     format="%d/%m/%Y %H:%M:%S",
    #     errors="coerce"
    # )
    
    # print (df.to_dict(orient="records"))


    # rows = worksheet.get_all_records(default_blank="")  # List[Dict]
    
    # print(data)
    # print('hi')
    
    # data = sheet.get_all_records()  # List[Dict]

    # return {
    #     "rows": data,
    #     "count": len(data)
    # }
    
@app.get("/ordersubmitted")
def ordersubmitted_page():
    if not ORDERSUBMITTED_PAGE.exists():
        return HTMLResponse("Frontend not found", status_code=404)

    return FileResponse(ORDERSUBMITTED_PAGE)

@app.get("/health")
def health():
    return {"status": "ok"}

## Added by KL on 20260131 - To remove caching of JS file when deploying on Koyeb
@app.middleware("http")
async def no_cache_static(request, call_next):
    response = await call_next(request)
    if request.url.path.endswith(".js"):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    return response

def make_headers_unique(headers):
    seen = {}
    new_headers = []
    for h in headers:
        if h in seen:
            seen[h] += 1
            new_headers.append(f"{h}_{seen[h]}")
        else:
            seen[h] = 1
            new_headers.append(h)
    return new_headers

def remove_empty_keys(row: dict) -> dict:
    return {
        k: v
        for k, v in row.items()
        if v is not None and (not isinstance(v, str) or v.strip() != "")
    }