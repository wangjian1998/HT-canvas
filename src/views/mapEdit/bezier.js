/* eslint-disable complexity */
// 关于点是否在贝塞尔曲线上的判断
/**
 * 已知四个控制点，及曲线中的某一个点的 x/y，反推求 t
 * @param {number} x1 起点 x/y
 * @param {number} x2 控制点1 x/y
 * @param {number} x3 控制点2 x/y
 * @param {number} x4 终点 x/y
 * @param {number} X 曲线中的某个点 x/y
 * @returns {number[]} t[]
 */
export const getBezierT = (x1, x2, x3, x4, X) => {
  const a = -x1 + 3 * x2 - 3 * x3 + x4
  const b = 3 * x1 - 6 * x2 + 3 * x3
  const c = -3 * x1 + 3 * x2
  const d = x1 - X

  // 盛金公式, 预先需满足, a !== 0
  // 判别式
  const A = Math.pow(b, 2) - 3 * a * c
  const B = b * c - 9 * a * d
  const C = Math.pow(c, 2) - 3 * b * d
  const delta = Math.pow(B, 2) - 4 * A * C

  let t1 = -100, t2 = -100, t3 = -100

  // 3个相同实数根
  if (A === B && A === 0) {
    t1 = -b / (3 * a)
    t2 = -c / b
    t3 = -3 * d / c
    return [t1, t2, t3]
  }

  // 1个实数根和1对共轭复数根
  if (delta > 0) {
    const v = Math.pow(B, 2) - 4 * A * C
    const xsv = v < 0 ? -1 : 1

    const m1 = A * b + 3 * a * (-B + (v * xsv) ** (1 / 2) * xsv) / 2
    const m2 = A * b + 3 * a * (-B - (v * xsv) ** (1 / 2) * xsv) / 2

    const xs1 = m1 < 0 ? -1 : 1
    const xs2 = m2 < 0 ? -1 : 1

    t1 = (-b - (m1 * xs1) ** (1 / 3) * xs1 - (m2 * xs2) ** (1 / 3) * xs2) / (3 * a)
    // 涉及虚数，可不考虑。i ** 2 = -1
  }

  // 3个实数根
  if (delta === 0) {
    const K = B / A
    t1 = -b / a + K
    t2 = t3 = -K / 2
  }

  // 3个不相等实数根
  if (delta < 0) {
    const xsA = A < 0 ? -1 : 1
    const T = (2 * A * b - 3 * a * B) / (2 * (A * xsA) ** (3 / 2) * xsA)
    const theta = Math.acos(T)

    if (A > 0 && T < 1 && T > -1) {
      t1 = (-b - 2 * A ** (1 / 2) * Math.cos(theta / 3)) / (3 * a)
      t2 = (-b + A ** (1 / 2) * (Math.cos(theta / 3) + 3 ** (1 / 2) * Math.sin(theta / 3))) / (3 * a)
      t3 = (-b + A ** (1 / 2) * (Math.cos(theta / 3) - 3 ** (1 / 2) * Math.sin(theta / 3))) / (3 * a)
    }
  }
  // console.log([t1, t2, t3])
  return [t1, t2, t3]
}


/**
 * @desc 获取三阶贝塞尔曲线的线上坐标
 * B(t) = P0 * (1-t)^3 + 3 * P1 * t * (1-t)^2 + 3 * P2 * t^2 * (1-t) + P3 * t^3, t ∈ [0,1]
 * @param {number} t 当前百分比
 * @param {Array} p1 起点坐标
 * @param {Array} p2 终点坐标
 * @param {Array} cp1 控制点1
 * @param {Array} cp2 控制点2
 */
export const getThreeBezierPoint = (t, p1, cp1, cp2, p2) => {

  const {x1, y1} = p1
  const {x2, y2} = p2
  const {cx1, cy1} = cp1
  const {cx2, cy2} = cp2
  
  const x =
    x1 * (1 - t) * (1 - t) * (1 - t) +
    3 * cx1 * t * (1 - t) * (1 - t) +
    3 * cx2 * t * t * (1 - t) +
    x2 * t * t * t
  const y =
    y1 * (1 - t) * (1 - t) * (1 - t) +
    3 * cy1 * t * (1 - t) * (1 - t) +
    3 * cy2 * t * t * (1 - t) +
    y2 * t * t * t
  return [x, y]
}

// export const isAboveLine = (offsetX, offsetY, points) => {
//   // 用 x 求出对应的 t，用 t 求相应位置的 y，再比较得出的 y 与 offsetY 之间的差值
//   const tsx = getBezierT(innerPonints[0][0], innerPonints[1][0], innerPonints[2][0],     innerPonints[3][0], offsetX)
//   for (let x = 0; x < 3; x++) {
//     if (tsx[x] <= 1 && tsx[x] >= 0) {
//       const ny = getThreeBezierPoint(tsx[x], innerPonints[0], innerPonints[1], innerPonints[2], innerPonints[3])
//       if (Math.abs(ny[1] - offsetY) < 8) {
//         return points[i]
//       }
//     }
//   }
//   // 如果上述没有结果，则用 y 求出对应的 t，再用 t 求出对应的 x，与 offsetX 进行匹配
//   const tsy = getBezierT(innerPonints[0][1], innerPonints[1][1], innerPonints[2][1], innerPonints[3][1], offsetY)
//   for (let y = 0; y < 3; y++) {
//     if (tsy[y] <= 1 && tsy[y] >= 0) {
//       const nx = getThreeBezierPoint(tsy[y], innerPonints[0], innerPonints[1], innerPonints[2], innerPonints[3])
//       if (Math.abs(nx[0] - offsetX) < 8) {
//         return points[i]
//       }
//     }
//   }
// }

