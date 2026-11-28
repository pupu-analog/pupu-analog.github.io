// 首页数独游戏：{% sudoku %}
// 纯前端生成题目（回溯算法 + 随机挖空 + 唯一解校验），每次刷新随机一个难度，题目近乎无限。
// 只保留「新题」「检查」两个功能按钮；占用空间约 7 KB，无外部依赖。
hexo.extend.tag.register('sudoku', function () {
  return `
<style>
.sudoku-app { max-width: 460px; margin: 40px auto 8px; font-family: var(--font-serif, Georgia, "Times New Roman", serif); color: var(--color-text-primary, #24313d); }
.sudoku-head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px; }
.sudoku-head h2 { font-size: 20px; font-weight: 500; margin: 0; border-bottom: 2px solid #2c4d70; padding-bottom: 6px; }
.sudoku-level { font-size: 13px; color: var(--color-text-secondary, #53606d); }
.sudoku-grid { display: grid; grid-template-columns: repeat(9, 1fr); width: 100%; aspect-ratio: 1 / 1; border: 2px solid #2c4d70; background: var(--color-background-primary, #fff); }
.sudoku-cell { display: flex; align-items: center; justify-content: center; font-size: clamp(15px, 4vw, 21px); border-right: 1px solid #cfd8e0; border-bottom: 1px solid #cfd8e0; cursor: pointer; user-select: none; }
.sudoku-cell:nth-child(9n) { border-right: none; }
.sudoku-cell:nth-child(n+73) { border-bottom: none; }
.sudoku-cell.sudoku-rborder { border-right: 2px solid #2c4d70; }
.sudoku-cell.sudoku-bborder { border-bottom: 2px solid #2c4d70; }
.sudoku-cell.sudoku-given { color: var(--color-text-primary, #24313d); font-weight: 600; }
.sudoku-cell.sudoku-user { color: var(--color-link, #1b5e9c); }
.sudoku-cell.sudoku-selected { background: #dceaf7; }
.sudoku-cell.sudoku-wrong { color: #c0392b; background: #fbe6e3; }
.sudoku-pad { display: grid; grid-template-columns: repeat(10, 1fr); gap: 4px; margin: 12px 0; }
.sudoku-pad button { padding: 6px 0; font-size: 15px; cursor: pointer; border: 1px solid #b9c6d2; border-radius: 4px; background: var(--color-background-primary, #fff); color: var(--color-text-primary, #24313d); }
.sudoku-pad button:hover { background: #eef4fa; }
.sudoku-actions { display: flex; gap: 10px; }
.sudoku-actions button { flex: 1; padding: 8px 0; font-size: 14px; cursor: pointer; border: 1px solid #2c4d70; border-radius: 4px; background: #2c4d70; color: #fff; }
.sudoku-actions button:hover { opacity: .88; }
.sudoku-msg { min-height: 20px; margin-top: 8px; font-size: 13px; text-align: center; color: var(--color-text-secondary, #53606d); }
</style>
<div class="sudoku-app">
  <div class="sudoku-head"><h2>数独</h2><span class="sudoku-level"></span></div>
  <div class="sudoku-grid"></div>
  <div class="sudoku-pad"></div>
  <div class="sudoku-actions">
    <button type="button" class="sudoku-new">新题</button>
    <button type="button" class="sudoku-check">检查</button>
  </div>
  <div class="sudoku-msg"></div>
</div>
<script>
(function () {
  var app = document.querySelector('.sudoku-app');
  if (!app) return;
  var gridEl = app.querySelector('.sudoku-grid');
  var padEl = app.querySelector('.sudoku-pad');
  var newBtn = app.querySelector('.sudoku-new');
  var checkBtn = app.querySelector('.sudoku-check');
  var levelEl = app.querySelector('.sudoku-level');
  var msgEl = app.querySelector('.sudoku-msg');

  var LEVELS = [
    { name: '简单', holes: 40 },
    { name: '中等', holes: 48 },
    { name: '困难', holes: 54 },
    { name: '专家', holes: 60 }
  ];
  var FULL = 0x3FE;
  var puzzle = [], solution = [], given = [], level = null, selected = -1, wrongCells = [];

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // 统计解的个数，最多 limit 个即返回
  function countSolutions(board, limit) {
    var rows = new Array(9).fill(0), cols = new Array(9).fill(0), boxes = new Array(9).fill(0);
    var i, r, c, b, v, bit;
    for (i = 0; i < 81; i++) {
      v = board[i]; if (!v) continue;
      r = (i / 9) | 0; c = i % 9; b = ((r / 3) | 0) * 3 + ((c / 3) | 0);
      bit = 1 << v;
      if ((rows[r] & bit) || (cols[c] & bit) || (boxes[b] & bit)) return 0;
      rows[r] |= bit; cols[c] |= bit; boxes[b] |= bit;
    }
    var found = 0;
    (function dfs() {
      if (found >= limit) return;
      var best = -1, bestMask = 0, bestCount = 10;
      for (var i = 0; i < 81; i++) {
        if (board[i]) continue;
        var r = (i / 9) | 0, c = i % 9, b = ((r / 3) | 0) * 3 + ((c / 3) | 0);
        var mask = ~(rows[r] | cols[c] | boxes[b]) & FULL;
        var cnt = 0, m = mask;
        while (m) { m &= m - 1; cnt++; }
        if (cnt === 0) return;
        if (cnt < bestCount) { bestCount = cnt; best = i; bestMask = mask; if (cnt === 1) break; }
      }
      if (best < 0) { found++; return; }
      var br = (best / 9) | 0, bc = best % 9, bb = ((br / 3) | 0) * 3 + ((bc / 3) | 0);
      var mm = bestMask;
      while (mm) {
        var bit = mm & -mm; mm -= bit;
        board[best] = Math.log2(bit);
        rows[br] |= bit; cols[bc] |= bit; boxes[bb] |= bit;
        dfs();
        rows[br] &= ~bit; cols[bc] &= ~bit; boxes[bb] &= ~bit;
        board[best] = 0;
        if (found >= limit) return;
      }
    })();
    return found;
  }

  // 随机填充一个完整解
  function fillBoard(board) {
    var rows = new Array(9).fill(0), cols = new Array(9).fill(0), boxes = new Array(9).fill(0);
    (function dfs(pos) {
      if (pos === 81) return true;
      var r = (pos / 9) | 0, c = pos % 9, b = ((r / 3) | 0) * 3 + ((c / 3) | 0);
      var nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      for (var k = 0; k < 9; k++) {
        var v = nums[k], bit = 1 << v;
        if ((rows[r] & bit) || (cols[c] & bit) || (boxes[b] & bit)) continue;
        board[pos] = v;
        rows[r] |= bit; cols[c] |= bit; boxes[b] |= bit;
        if (dfs(pos + 1)) return true;
        rows[r] &= ~bit; cols[c] &= ~bit; boxes[b] &= ~bit;
        board[pos] = 0;
      }
      return false;
    })(0);
  }

  function makePuzzle(lv) {
    var board = new Array(81).fill(0);
    fillBoard(board);
    var sol = board.slice();
    var order = shuffle(Array.apply(null, { length: 81 }).map(function (_, i) { return i; }));
    var holes = lv.holes;
    for (var i = 0; i < 81 && holes > 0; i++) {
      var idx = order[i], v = board[idx];
      board[idx] = 0;
      if (countSolutions(board.slice(), 2) !== 1) board[idx] = v;
      else holes--;
    }
    return { puzzle: board, solution: sol };
  }

  function newPuzzle(pickLevel) {
    if (pickLevel || !level) level = LEVELS[Math.floor(Math.random() * LEVELS.length)];
    var p = makePuzzle(level);
    puzzle = p.puzzle; solution = p.solution;
    given = puzzle.map(function (v) { return v !== 0; });
    selected = -1; wrongCells = [];
    levelEl.textContent = '难度：' + level.name;
    msgEl.textContent = '生成中…';
    render();
    msgEl.textContent = '';
  }

  function render() {
    var html = '';
    for (var i = 0; i < 81; i++) {
      var v = puzzle[i];
      var cls = 'sudoku-cell';
      if (given[i]) cls += ' sudoku-given';
      else if (v) cls += (wrongCells.indexOf(i) >= 0 ? ' sudoku-wrong' : ' sudoku-user');
      if (i === selected) cls += ' sudoku-selected';
      if (i % 9 !== 8 && i % 3 === 2) cls += ' sudoku-rborder';
      if (i < 72 && ((i / 9) | 0) % 3 === 2) cls += ' sudoku-bborder';
      html += '<div class="' + cls + '" data-i="' + i + '">' + (v || '') + '</div>';
    }
    gridEl.innerHTML = html;
  }

  function setValue(v) {
    if (selected < 0 || given[selected]) return;
    puzzle[selected] = v;
    var pos = wrongCells.indexOf(selected);
    if (pos >= 0) wrongCells.splice(pos, 1);
    render();
  }

  gridEl.addEventListener('click', function (e) {
    var cell = e.target.closest('.sudoku-cell');
    if (!cell) return;
    selected = Number(cell.getAttribute('data-i'));
    render();
  });

  var padHtml = '';
  for (var n = 1; n <= 9; n++) padHtml += '<button type="button" data-n="' + n + '">' + n + '</button>';
  padHtml += '<button type="button" data-n="0">清</button>';
  padEl.innerHTML = padHtml;
  padEl.addEventListener('click', function (e) {
    var btn = e.target.closest('button');
    if (btn) setValue(Number(btn.getAttribute('data-n')));
  });

  document.addEventListener('keydown', function (e) {
    if (selected < 0) return;
    if (e.key >= '1' && e.key <= '9') setValue(Number(e.key));
    else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') setValue(0);
  });

  newBtn.addEventListener('click', function () { newPuzzle(false); });
  checkBtn.addEventListener('click', function () {
    wrongCells = [];
    var filled = 0;
    for (var i = 0; i < 81; i++) {
      if (!given[i] && puzzle[i]) filled++;
      if (puzzle[i] && puzzle[i] !== solution[i]) wrongCells.push(i);
    }
    render();
    if (wrongCells.length) msgEl.textContent = '有 ' + wrongCells.length + ' 处错误，请检查标红格子';
    else if (filled < 81 - given.filter(Boolean).length) msgEl.textContent = '目前填写正确，继续加油';
    else msgEl.textContent = '全部正确，恭喜完成！';
  });

  newPuzzle(true);
})();
</script>
`;
}, { ends: false });
