import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq
import boto3
import holidays
from datetime import date, timedelta
import io

# Configuracion
BUCKET = 'chinook-analytics-app'
S3_KEY = 'dim-date/dim_date.parquet'
START_DATE = date(2000, 1, 1)
END_DATE = date(2030, 12, 31)

# Generar fechas
us_holidays = holidays.US()
rows = []
current = START_DATE

while current <= END_DATE:
    date_key = int(current.strftime('%Y%m%d'))
    is_holiday = current in us_holidays
    rows.append({
        'DateKey': date_key,
        'FullDate': current.strftime('%Y-%m-%d'),
        'Year': current.year,
        'Quarter': (current.month - 1) // 3 + 1,
        'Month': current.month,
        'Day': current.day,
        'DayOfWeek': current.isoweekday(),
        'IsHoliday': is_holiday
    })
    current += timedelta(days=1)

df = pd.DataFrame(rows)

# Convertir a parquet
table = pa.Table.from_pandas(df)
buffer = io.BytesIO()
pq.write_table(table, buffer)
buffer.seek(0)

# Subir a S3
s3 = boto3.client('s3')
s3.put_object(Bucket=BUCKET, Key=S3_KEY, Body=buffer.getvalue())
print(f"DimDate generada con {len(rows)} registros y subida a s3://{BUCKET}/{S3_KEY}")
