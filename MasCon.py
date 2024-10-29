import netCDF4 as nc
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import random

random.seed(5)
# Get data from downloaded file
file_path = '/Users/kevinfranzblau/Documents/MLDSResearch/grace_data/GRCTellus.JPL.200204_202402.GLO.RL06.1M.MSCNv03CRI.nc'
dataset = nc.Dataset(file_path, mode='r')
lwe_thickness = dataset.variables['lwe_thickness'][:]
lon = dataset.variables['lon'][:]
lat = dataset.variables['lat'][:] 
lwe = lwe_thickness[0, :, :]  # 0 is arbitrary time used

lon = np.linspace(0,360,40)
lat = np.linspace(-90,90,20)


lon_rad = np.radians(lon)
lat_rad = np.radians(lat)


# Need mesh grid for dimensions to work out for 3d plot
lon_grid, lat_grid = np.meshgrid(lon_rad, lat_rad)

radius = 6371

# Spherical coordinates to cartesian
x = radius * np.cos(lat_grid) * np.cos(lon_grid)
y = radius * np.cos(lat_grid) * np.sin(lon_grid)
z = radius * np.sin(lat_grid)

def dgravity(x, y, z, lon, lat, lwe):
    r = 6371 

    lon_rad = np.arctan2(y, x)
    lat_rad = np.arcsin(z / r)

    lon_deg = np.degrees(lon_rad)
    lat_deg = np.degrees(lat_rad)

    lon_deg = (lon_deg + 180) % 360 - 180 # Change longitude from [0, 360] to [-180, 180]

    # np.abs(lon - lon_deg) produces array of differences between longitude based on x,y, and z and known longitudes corresponding to lwe values from dataset
    # argmin finds the position of minimum of this array used as one of the indexes in the corresponding lwe matrix
    lon_index = (np.abs(lon - lon_deg)).argmin()
    lat_index = (np.abs(lat - lat_deg)).argmin()

    lwe_value = lwe[lat_index, lon_index]
    return lwe_value

def mascon(lat_rad,lon_rad,x,y,z):
    radius = 6371
    Fx = 0
    Fy = 0
    Fz = 0
    for i in lon_rad:
        for j in lat_rad:
            gravity_local = (0.5 + random.random())*1000
            xcon = radius*np.cos(j)*np.cos(i)
            ycon = radius*np.cos(j)*np.sin(i)
            zcon = radius*np.sin(j)
            rx = x-xcon
            ry = y-ycon
            rz = z-zcon
            r = (rx**2+ry**2+rz**2)**0.5
            if r != 0:
                Fx = Fx + gravity_local*rx/r**3
                Fy = Fy + gravity_local*ry/r**3
                Fz = Fz + gravity_local*rz/r**3

    F = (Fx**2+Fy**2+Fz**2)**0.5
    print(F)
    return F







density = np.zeros((x.shape[0], x.shape[1]))
count = 0
for i in range(x.shape[0]):
    for j in range(x.shape[1]):
        # density[i, j] = dgravity(x[i, j], y[i, j], z[i, j], lon, lat, lwe)
        count = count + 1
        # print(count)
        density[i, j] = mascon(lon_rad, lat_rad, x[i, j], y[i, j], z[i, j])

density_normalized = (density - np.min(density)) / (np.max(density) - np.min(density))

# For making sphere
fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')
colors = plt.cm.plasma(density_normalized)

#surface plot of sphere from x, y, and z coordinates
surf = ax.plot_surface(x, y, z, facecolors=colors, rstride=1, cstride=1, antialiased=False, shade=False)

# Color bar with lwe values from NASA data
mappable = plt.cm.ScalarMappable(cmap=plt.cm.plasma)
mappable.set_array(density) 
fig.colorbar(mappable, ax=ax, shrink=0.5, aspect=5, label='Gravity')

ax.set_xlabel('X')
ax.set_ylabel('Y')
ax.set_zlabel('Z')
ax.set_title('Mascon Gravity Model')

plt.show()


