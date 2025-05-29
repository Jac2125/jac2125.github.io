function parseArray(id) {
  return document.getElementById(id).value
    .split(',')
    .map(x => parseInt(x.trim(), 10))
    .filter(x => !isNaN(x));
}

createModule().then(Module => {
  const runExact = Module.cwrap(
    'exactKnapsack2D_c', null,
    ['number','number','number','number','number','number','number']
  );
  const runApprox = Module.cwrap(
    'approxKnapsackFPTAS_c', null,
    ['number','number','number','number','number','number','number','number']
  );

  document.getElementById('runExact').onclick = () => {
    const wt = parseArray('weights');
    const val = parseArray('values');
    const n  = wt.length;
    const W  = parseInt(document.getElementById('capacity').value, 10);

    // 메모리 할당
    const wtPtr   = Module._malloc(n * 4);
    Module.HEAP32.set(wt, wtPtr >> 2);
    const valPtr  = Module._malloc(n * 4);
    Module.HEAP32.set(val, valPtr >> 2);
    const resPtr  = Module._malloc(4);
    const selPtr  = Module._malloc(n * 4);
    const timePtr = Module._malloc(4);

    // 호출
    runExact(wtPtr, valPtr, n, W, resPtr, selPtr, timePtr);

    // 결과 읽기
    const result    = Module.HEAP32[resPtr   >> 2];
    const timeUs    = Module.HEAP32[timePtr  >> 2];
    const sel       = [];
    for (let i = 0; i < n; i++) {
      const idx = Module.HEAP32[(selPtr >> 2) + i];
      if (idx >= 0 && idx < n) sel.push(idx);
    }
    const weightSum = sel.reduce((s, i) => s + wt[i], 0);

    // 메모리 해제
    Module._free(wtPtr);
    Module._free(valPtr);
    Module._free(resPtr);
    Module._free(selPtr);
    Module._free(timePtr);

    document.getElementById('output').textContent =
      `=== Exact DP ===\n` +
      `Total Value  = ${result}\n` +
      `Total Weight = ${weightSum}\n` +
      `Time         = ${timeUs} μs\n` +
      `Items        = [${sel.join(', ')}]`;
  };

  document.getElementById('runApprox').onclick = () => {
    const wt = parseArray('weights');
    const val = parseArray('values');
    const n   = wt.length;
    const W   = parseInt(document.getElementById('capacity').value, 10);
    const eps = parseFloat(document.getElementById('epsilon').value);

    const wtPtr   = Module._malloc(n * 4);
    Module.HEAP32.set(wt, wtPtr >> 2);
    const valPtr  = Module._malloc(n * 4);
    Module.HEAP32.set(val, valPtr >> 2);
    const resPtr  = Module._malloc(4);
    const selPtr  = Module._malloc(n * 4);
    const timePtr = Module._malloc(4);

    runApprox(wtPtr, valPtr, n, W, eps, resPtr, selPtr, timePtr);

    const result    = Module.HEAP32[resPtr   >> 2];
    const timeUs    = Module.HEAP32[timePtr  >> 2];
    const sel       = [];
    for (let i = 0; i < n; i++) {
      const idx = Module.HEAP32[(selPtr >> 2) + i];
      if (idx >= 0 && idx < n) sel.push(idx);
    }
    const weightSum = sel.reduce((s, i) => s + wt[i], 0);

    Module._free(wtPtr);
    Module._free(valPtr);
    Module._free(resPtr);
    Module._free(selPtr);
    Module._free(timePtr);

    document.getElementById('output').textContent =
      `=== FPTAS (ε=${eps}) ===\n` +
      `Total Value  = ${result}\n` +
      `Total Weight = ${weightSum}\n` +
      `Time         = ${timeUs} μs\n` +
      `Items        = [${sel.join(', ')}]`;
  };
});
