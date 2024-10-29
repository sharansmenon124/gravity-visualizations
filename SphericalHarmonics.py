import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import csv

# Gravity function to generate force magnitude from given cartesian coordinate
def gravity(x,y,z):
    r = np.sqrt(x**2 + y**2 + z**2)
    J2 = 1.75553 * 10**10
    J3 = -2.61913 * 10**11
    mu = 398600.440
    Fx = J2*(x/r**7)*(6*z**2 - 1.5*(x**2 + y**2)) + mu*x/r**3
    Fy = J2*(y/r**7)*(6*z**2 - 1.5*(x**2 + y**2)) + mu*y/r**3
    Fz = J2*(z/r**7)*(3*z**2 - 4.5*(x**2 + y**2)) + mu*z/r**3
    Fx = Fx + J3*(x*z/r**9)*(10*z**2 - 7.5*(x**2 + y**2))
    Fy = Fy + J3*(y*z/r**9)*(10*z**2 - 7.5*(x**2 + y**2))
    Fz = Fz + J3*(1/r**9)*(4*z**2*(z**2 - 3*(x**2 + y**2)) + 1.5*(x**2 + y**2)**2)
    F = np.sqrt(Fx**2+Fy**2+Fz**2)*1000
    return F

radius = 6371
# Spherical coordinates (latitude and longitude) used to bound what values will be on the plot (will be the surface of Earth)
u = np.linspace(0, 2 * np.pi, 100)
v = np.linspace(0, np.pi, 100)

# Convert from spherical coordinates to cartesian
x = radius * np.outer(np.cos(u), np.sin(v))
y = radius * np.outer(np.sin(u), np.sin(v))
z = radius * np.outer(np.ones(np.size(u)), np.cos(v))

# Density function to apply onto sphere
density = gravity(x, y, z)

density_normalized = (density - np.min(density)) / (np.max(density) - np.min(density))

fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')

colors = plt.cm.plasma(density_normalized)

surf = ax.plot_surface(x, y, z, facecolors=colors, rstride=1, cstride=1, antialiased=False, shade=False)

mappable = plt.cm.ScalarMappable(cmap=plt.cm.plasma)
mappable.set_array(density) 
fig.colorbar(mappable, ax=ax, shrink=0.5, aspect=5, label='Gravity (m/s^2)')

# ax.set_xlabel('X')
# ax.set_ylabel('Y')
# ax.set_zlabel('Z')
# ax.set_title('Gravity Model up to J3')

# plt.show()

position = []
with open('sphere-positions.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = 0
    for row in csv_reader:
        if line_count == 0:
            line_count += 1
        else:
            position.append([row[0], row[1], row[2]])
            line_count += 1
    print(f'Processed {line_count} lines.')

F = []
data = []
for pos in position:
    data.append({'x': pos[0], 'y': pos[1], 'z': pos[2], 'F': gravity(float(pos[0]),float(pos[1]),float(pos[2]))})
    F.append(gravity(float(pos[0]),float(pos[1]),float(pos[2])))

import csv



with open('sphere-positions&force.csv', 'w', newline='') as csvfile:
    fieldnames = ['x', 'y', 'z', 'F']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(data)
