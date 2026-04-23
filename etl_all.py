import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq
import boto3
import psycopg2
import io

BUCKET = 'chinook-analytics-app'
DB_HOST = 'chinook-db.cc9uttu2shgi.us-east-1.rds.amazonaws.com'
DB_NAME = 'chinook'
DB_USER = 'postgres'
DB_PASS = 'chinook1234'

def get_conn():
    return psycopg2.connect(host=DB_HOST, dbname=DB_NAME, user=DB_USER, password=DB_PASS)

def upload_parquet(df, key):
    table = pa.Table.from_pandas(df)
    buffer = io.BytesIO()
    pq.write_table(table, buffer)
    buffer.seek(0)
    s3 = boto3.client('s3')
    s3.put_object(Bucket=BUCKET, Key=key, Body=buffer.getvalue())
    print(f"✅ Subido: s3://{BUCKET}/{key} ({len(df)} registros)")

# ETL DimCustomer
conn = get_conn()
df = pd.read_sql("""
    SELECT "CustomerId" as CustomerKey, "FirstName", "LastName", 
           "Company", "Country", "City", "State", "Email"
    FROM "Customer"
""", conn)
conn.close()
upload_parquet(df, 'dim-customer/dim_customer.parquet')

# ETL DimTrack
conn = get_conn()
df = pd.read_sql("""
    SELECT t."TrackId" as TrackKey, t."Name", al."Title" as Album,
           ar."Name" as Artist, g."Name" as Genre, 
           m."Name" as MediaType, t."Composer", t."Milliseconds"
    FROM "Track" t
    JOIN "Album" al ON al."AlbumId" = t."AlbumId"
    JOIN "Artist" ar ON ar."ArtistId" = al."ArtistId"
    JOIN "Genre" g ON g."GenreId" = t."GenreId"
    JOIN "MediaType" m ON m."MediaTypeId" = t."MediaTypeId"
""", conn)
conn.close()
upload_parquet(df, 'dim-track/dim_track.parquet')

# ETL FactSales
conn = get_conn()
df = pd.read_sql("""
    SELECT 
        i."CustomerId" as CustomerKey,
        il."TrackId" as TrackKey,
        CAST(TO_CHAR(i."InvoiceDate", 'YYYYMMDD') AS INT) as InvoiceDateKey,
        COALESCE(c."SupportRepId", 0) as EmployeeKey,
        il."Quantity",
        il."UnitPrice",
        il."Quantity" * il."UnitPrice" as TotalAmount,
        EXTRACT(YEAR FROM i."InvoiceDate")::INT as year,
        EXTRACT(MONTH FROM i."InvoiceDate")::INT as month,
        EXTRACT(DAY FROM i."InvoiceDate")::INT as day
    FROM "Invoice" i
    JOIN "InvoiceLine" il ON il."InvoiceId" = i."InvoiceId"
    JOIN "Customer" c ON c."CustomerId" = i."CustomerId"
""", conn)
conn.close()

# Particionar por year/month/day
for (year, month, day), group in df.groupby(['year', 'month', 'day']):
    group_clean = group.drop(columns=['year', 'month', 'day'])
    key = f'fact-sales/year={year}/month={month}/day={day}/fact_sales.parquet'
    upload_parquet(group_clean, key)

print("✅ Todos los ETLs completados!")
