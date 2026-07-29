function kdNN(fpoints, fpoint) {
  const k = fpoint.length;

  const indexedPoints = fpoints.map((p, i) => ({ point: p, index: i }));

  function buildTree(points, depth) {
    if (points.length === 0) return null;
    const axis = depth % k;
    points.sort((a, b) => a.point[axis] - b.point[axis]);
    const mid = Math.floor(points.length / 2);
    return {
      point: points[mid].point,
      index: points[mid].index,
      left: buildTree(points.slice(0, mid), depth + 1),
      right: buildTree(points.slice(mid + 1), depth + 1),
      axis: axis
    };
  }

  function distSq(a, b) {
    let s = 0;
    for (let i = 0; i < k; i++) {
      const d = a[i] - b[i];
      s += d * d;
    }
    return s;
  }

  function search(node, target, best, bestDist, bestIndex) {
    if (node === null) return { best, bestDist, bestIndex };
    const d = distSq(node.point, target);
    if (d < bestDist || (d === bestDist && node.index < bestIndex)) {
      best = node.point;
      bestDist = d;
      bestIndex = node.index;
    }
    const axis = node.axis;
    const diff = target[axis] - node.point[axis];
    const first = diff < 0 ? node.left : node.right;
    const second = diff < 0 ? node.right : node.left;
    const res1 = search(first, target, best, bestDist, bestIndex);
    best = res1.best;
    bestDist = res1.bestDist;
    bestIndex = res1.bestIndex;
    if (diff * diff <= bestDist) {
      const res2 = search(second, target, best, bestDist, bestIndex);
      best = res2.best;
      bestDist = res2.bestDist;
      bestIndex = res2.bestIndex;
    }
    return { best, bestDist, bestIndex };
  }

  const tree = buildTree(indexedPoints.slice(), 0);
  const result = search(tree, fpoint, null, Infinity, Infinity);
  return result.best;
}
