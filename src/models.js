export function gravity(x, y, z) {
  const r = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
  const J2 = 1.75553 * Math.pow(10, 10);
  const J3 = -2.61913 * Math.pow(10, 11);
  const mu = 398600.44;

  // Calculate Fx, Fy, and Fz
  let Fx =
    J2 *
      (x / Math.pow(r, 7)) *
      (6 * Math.pow(z, 2) - 1.5 * (Math.pow(x, 2) + Math.pow(y, 2))) +
    (mu * x) / Math.pow(r, 3);
  let Fy =
    J2 *
      (y / Math.pow(r, 7)) *
      (6 * Math.pow(z, 2) - 1.5 * (Math.pow(x, 2) + Math.pow(y, 2))) +
    (mu * y) / Math.pow(r, 3);
  let Fz =
    J2 *
      (z / Math.pow(r, 7)) *
      (3 * Math.pow(z, 2) - 4.5 * (Math.pow(x, 2) + Math.pow(y, 2))) +
    (mu * z) / Math.pow(r, 3);

  // Add the J3 terms
  Fx =
    Fx +
    J3 *
      ((x * z) / Math.pow(r, 9)) *
      (10 * Math.pow(z, 2) - 7.5 * (Math.pow(x, 2) + Math.pow(y, 2)));
  Fy =
    Fy +
    J3 *
      ((y * z) / Math.pow(r, 9)) *
      (10 * Math.pow(z, 2) - 7.5 * (Math.pow(x, 2) + Math.pow(y, 2)));
  Fz =
    Fz +
    J3 *
      (1 / Math.pow(r, 9)) *
      (4 *
        Math.pow(z, 2) *
        (Math.pow(z, 2) - 3 * (Math.pow(x, 2) + Math.pow(y, 2))) +
        1.5 * Math.pow(Math.pow(x, 2) + Math.pow(y, 2), 2));

  // Total gravitational force magnitude
  const F = Math.sqrt(Fx ** 2 + Fy ** 2 + Fz ** 2) * 1000;
  return F;
}
