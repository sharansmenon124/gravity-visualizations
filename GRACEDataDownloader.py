import os
import requests
from netrc import netrc

# Define the GRACE data URL (replace with the correct URL for the data you want)
data_url = 'https://archive.podaac.earthdata.nasa.gov/podaac-ops-cumulus-protected/TELLUS_GRAC-GRFO_MASCON_CRI_GRID_RL06.1_V3/GRCTellus.JPL.200204_202402.GLO.RL06.1M.MSCNv03CRI.nc'  # Replace with the actual URL

# Create the directory for downloaded data
os.makedirs('grace_data', exist_ok=True)

# Extract credentials from the .netrc file
netrc_path = os.path.expanduser("~/.netrc")
credentials = netrc().authenticators("urs.earthdata.nasa.gov")
username, _, password = credentials

# Download the GRACE data
response = requests.get(data_url, auth=(username, password))

# Check if the request was successful
if response.status_code == 200:
    # Save the data
    file_name = data_url.split('/')[-1]
    with open(f'grace_data/{file_name}', 'wb') as file:
        file.write(response.content)
    print(f"Data downloaded successfully: {file_name}")
else:
    print(f"Failed to download data. HTTP status code: {response.status_code}")
