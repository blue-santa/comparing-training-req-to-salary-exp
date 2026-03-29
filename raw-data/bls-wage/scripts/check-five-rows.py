import pandas as pd
df = pd.read_excel('national_M2024_dl.xlsx', nrows=5)
print(df.columns.tolist())
print(df.head())
