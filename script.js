// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Constants and state
  const API_BASE = '/api';
  let CURRENT_USER = null;
  
  // Cache DOM elements
  const elements = {
    booksGrid: document.getElementById('booksGrid'),
    filterSelect: document.getElementById('filterSelect'),
    searchInput: document.getElementById('searchInput'),
    modalReader: document.getElementById('modalReader'),
    readerContent: document.getElementById('readerContent'),
    toggleTheme: document.getElementById('toggleTheme'),
    modalLogin: document.getElementById('modalLogin'),
    modalRegister: document.getElementById('modalRegister'),
    modalNewBook: document.getElementById('modalNewBook'),
    closeReader: document.getElementById('closeReader'),
    openLogin: document.getElementById('openLogin'),
    loginCancel: document.getElementById('loginCancel'),
    openRegister: document.getElementById('openRegister'),
    registerCancel: document.getElementById('registerCancel'),
    openNewBook: document.getElementById('openNewBook'),
    newBookCancel: document.getElementById('newBookCancel'),
    registerSubmit: document.getElementById('registerSubmit'),
    loginSubmit: document.getElementById('loginSubmit'),
    newBookSubmit: document.getElementById('newBookSubmit'),
    userContainer: document.getElementById('userContainer')
  };
  
  // State is already defined at the top
  const {
    booksGrid, filterSelect, searchInput, modalReader, readerContent,
    toggleTheme, modalLogin, modalRegister, modalNewBook, closeReader,
    openLogin, loginCancel, openRegister, registerCancel, openNewBook,
    newBookCancel, registerSubmit, loginSubmit, newBookSubmit, userContainer
  } = elements;

  // UI Helpers
  function showNotification(message, type = 'success') {
    const notif = document.getElementById('notification');
    if (!notif) return;
    notif.textContent = message;
    notif.className = 'notification ' + type + ' show';
    setTimeout(() => notif.classList.remove('show'), 3000);
  }

  function updateUserUI() {
    const container = userContainer;
    const loginBtn = openLogin;
    const newBookBtn = openNewBook;
    if (!container || !loginBtn || !newBookBtn) return;
    
    if (CURRENT_USER) {
      container.innerHTML = `
        <div class="user-info">
          <img src="https://www.gravatar.com/avatar/${md5(CURRENT_USER.email)}?d=mp" alt="Avatar">
          <span>${CURRENT_USER.name}</span>
          <button id="logoutBtn" style="border:none;background:none;color:inherit;cursor:pointer;padding:4px 8px">
            <span style="margin-right:4px">Sair</span>
            <span style="font-size:14px">↪</span>
          </button>
        </div>
      `;
      loginBtn.style.display = 'none';
      newBookBtn.style.display = '';
      
      // Add logout handler
      document.getElementById('logoutBtn').onclick = () => {
        localStorage.removeItem('token');
        CURRENT_USER = null;
        showNotification('Desconectado com sucesso');
        updateUserUI();
        // Reload books to reflect potentially different permissions
        fetchAndRender();
      };
    } else {
      container.innerHTML = '';
      loginBtn.style.display = '';
      newBookBtn.style.display = 'none';
    }
  }

  // MD5 function for Gravatar
  function md5(str) {
    var xl;
    var rotateLeft = function(lValue, iShiftBits) {
      return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    };
    var addUnsigned = function(lX, lY) {
      var lX8 = (lX & 0x80000000);
      var lY8 = (lY & 0x80000000);
      var lX4 = (lX & 0x40000000);
      var lY4 = (lY & 0x40000000);
      var lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
      if (lX4 & lY4) {
        return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
      }
      if (lX4 | lY4) {
        if (lResult & 0x40000000) {
          return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
        } else {
          return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
        }
      } else {
        return (lResult ^ lX8 ^ lY8);
      }
    };
    var _F = function(x, y, z) {
      return (x & y) | ((~x) & z);
    };
    var _G = function(x, y, z) {
      return (x & z) | (y & (~z));
    };
    var _H = function(x, y, z) {
      return (x ^ y ^ z);
    };
    var _I = function(x, y, z) {
      return (y ^ (x | (~z)));
    };
    var _FF = function(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };
    var _GG = function(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };
    var _HH = function(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };
    var _II = function(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };
    var convertToWordArray = function(str) {
      var lWordCount;
      var lMessageLength = str.length;
      var lNumberOfWords_temp1 = lMessageLength + 8;
      var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
      var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
      var lWordArray = new Array(lNumberOfWords - 1);
      var lBytePosition = 0;
      var lByteCount = 0;
      while (lByteCount < lMessageLength) {
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
        lByteCount++;
      }
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
      lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
      lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
      return lWordArray;
    };
    var wordToHex = function(lValue) {
      var wordToHexValue = "",
        wordToHexValue_temp = "",
        lByte, lCount;
      for (lCount = 0; lCount <= 3; lCount++) {
        lByte = (lValue >>> (lCount * 8)) & 255;
        wordToHexValue_temp = "0" + lByte.toString(16);
        wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
      }
      return wordToHexValue;
    };
    var x = [],
      k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
      S12 = 12,
      S13 = 17,
      S14 = 22,
      S21 = 5,
      S22 = 9,
      S23 = 14,
      S24 = 20,
      S31 = 4,
      S32 = 11,
      S33 = 16,
      S34 = 23,
      S41 = 6,
      S42 = 10,
      S43 = 15,
      S44 = 21;
    x = convertToWordArray(str);
    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;
    xl = x.length;
    for (k = 0; k < xl; k += 16) {
      AA = a;
      BB = b;
      CC = c;
      DD = d;
      a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
      d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
      c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
      b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
      a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
      d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
      c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
      b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
      a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
      d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
      c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
      b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
      a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
      d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
      c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
      b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
      a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
      d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
      c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
      b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
      a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
      d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
      c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
      b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
      a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
      d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
      c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
      b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
      a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
      d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
      c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
      b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
      a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
      d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
      c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
      b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
      a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
      d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
      c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
      b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
      a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
      d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
      c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
      b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
      a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
      d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
      c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
      b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
      a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
      d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
      c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
      b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
      a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
      d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
      c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
      b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
      a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
      d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
      c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
      b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
      a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
      d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
      c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
      b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
      a = addUnsigned(a, AA);
      b = addUnsigned(b, BB);
      c = addUnsigned(c, CC);
      d = addUnsigned(d, DD);
    }
    var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
    return temp.toLowerCase();
  }
  
  async function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await api('/auth/me');
        CURRENT_USER = res.user;
        updateUserUI();
      } catch (err) {
        localStorage.removeItem('token');
      }
    }
  }

  async function api(path, opts = {}) {
    const headers = opts.headers || {};
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = 'Bearer ' + token;
    opts.headers = Object.assign({ 'Content-Type': 'application/json' }, headers);
    if (opts.body && typeof opts.body !== 'string') opts.body = JSON.stringify(opts.body);
    const res = await fetch(API_BASE + path, opts);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw data;
    return data;
  }

  function renderBooks(list) {
    if (!booksGrid) return;
    booksGrid.innerHTML = '';
    if (!list || list.length === 0) {
      booksGrid.innerHTML = "<p style='color:#aaa'>Nenhum livro encontrado.</p>";
      return;
    }
    list.forEach(book => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${book.cover || 'https://via.placeholder.com/300x420?text=Sem+Capa'}" alt="${book.title}">
        <div class="meta">
          <h4>${book.title}</h4>
          <p>${book.author || '—'} • ${book.year || '—'} • ${book.genre || '—'}</p>
        </div>
        <div class="actions">
          <button data-id="${book.id}">Ler</button>
        </div>
      `;
      booksGrid.appendChild(card);
    });
  }

  async function loadFilters() {
    if (!filterSelect) return;
    try {
      const books = await api('/books');
      const genres = Array.from(new Set(books.map(b => b.genre).filter(Boolean)));
      filterSelect.innerHTML = '<option value="all">Todos</option>' + genres.map(g => `<option value="${g}">${g}</option>`).join('');
    } catch (err) {
      console.warn('Failed to load filters', err);
    }
  }

  async function fetchAndRender() {
    if (!searchInput || !filterSelect) return;
    try {
      const q = searchInput.value.trim();
      const genre = filterSelect.value;
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (genre && genre !== 'all') params.set('genre', genre);
      const list = await api('/books?' + params.toString());
      renderBooks(list);
    } catch (err) {
      console.error(err);
      if (booksGrid) booksGrid.innerHTML = "<p style='color:#faa'>Erro ao carregar livros.</p>";
    }
  }

  if (searchInput) searchInput.addEventListener('input', fetchAndRender);
  if (filterSelect) filterSelect.addEventListener('change', fetchAndRender);

  if (booksGrid) {
    booksGrid.addEventListener('click', async e => {
      if (e.target && e.target.tagName === 'BUTTON') {
        const id = e.target.dataset.id;
        try {
          const book = await api('/books/' + id);
          if (readerContent) readerContent.innerHTML = `<h2>${book.title}</h2><p><em>${book.author || ''} — ${book.year || ''}</em></p><div style="white-space:pre-wrap;margin-top:12px">${book.content || ''}</div>`;
          if (modalReader) modalReader.classList.add('open');
        } catch (err) {
          console.error(err);
          showNotification('Erro ao abrir livro', 'error');
        }
      }
    });
  }

  if (closeReader && modalReader) closeReader.addEventListener('click', () => modalReader.classList.remove('open'));

  if (toggleTheme) toggleTheme.addEventListener('click', () => document.body.classList.toggle('light-mode'));

  // Login / Register UI wiring
  if (openLogin && modalLogin) openLogin.onclick = () => modalLogin.classList.add('open');
  if (loginCancel && modalLogin) loginCancel.onclick = () => modalLogin.classList.remove('open');

  if (openRegister && modalLogin && modalRegister) openRegister.onclick = (e) => { e.preventDefault(); modalLogin.classList.remove('open'); modalRegister.classList.add('open'); };
  if (registerCancel && modalRegister) registerCancel.onclick = () => modalRegister.classList.remove('open');

  if (openNewBook && modalNewBook) openNewBook.onclick = () => {
    const token = localStorage.getItem('token');
      if (!CURRENT_USER) {
      showNotification('Você precisa estar logado para criar um livro.', 'error');
      modalLogin.classList.add('open');
      return;
    }
    modalNewBook.classList.add('open');
  };
  if (newBookCancel && modalNewBook) newBookCancel.onclick = () => modalNewBook.classList.remove('open');

  if (registerSubmit && modalRegister) registerSubmit.onclick = async () => {
    const name = (document.getElementById('registerName') || {}).value || '';
    const email = (document.getElementById('registerEmail') || {}).value || '';
    const password = (document.getElementById('registerPassword') || {}).value || '';
    try {
      const res = await api('/auth/register', { method: 'POST', body: { name: name.trim(), email: email.trim(), password } });
      localStorage.setItem('token', res.token);
      CURRENT_USER = res.user;
      modalRegister.classList.remove('open');
      updateUserUI();
      showNotification('Registrado com sucesso');
      await loadFilters();
      await fetchAndRender();
    } catch (err) {
      showNotification(err.error || 'Falha ao registrar', 'error');
    }
  };

  if (loginSubmit && modalLogin) loginSubmit.onclick = async () => {
    const email = (document.getElementById('loginEmail') || {}).value || '';
    const password = (document.getElementById('loginPassword') || {}).value || '';
    try {
      const res = await api('/auth/login', { method: 'POST', body: { email: email.trim(), password } });
      localStorage.setItem('token', res.token);
      CURRENT_USER = res.user;
      modalLogin.classList.remove('open');
      updateUserUI();
      showNotification(`Bem-vindo(a), ${res.user.name}!`);
    } catch (err) {
      showNotification(err.error || 'Falha ao logar', 'error');
    }
  };

  if (newBookSubmit && modalNewBook) newBookSubmit.onclick = async () => {
    const title = (document.getElementById('newTitle') || {}).value || '';
    const author = (document.getElementById('newAuthor') || {}).value || '';
    const year = parseInt((document.getElementById('newYear') || {}).value || '') || null;
    const genre = (document.getElementById('newGenre') || {}).value || '';
    const cover = (document.getElementById('newCover') || {}).value || '';
    const content = (document.getElementById('newContent') || {}).value || '';
    try {
      const book = await api('/books', { method: 'POST', body: { title: title.trim(), author: author.trim(), year, genre: genre.trim(), cover: cover.trim(), content } });
      modalNewBook.classList.remove('open');
      showNotification('Livro criado');
      await loadFilters();
      await fetchAndRender();
    } catch (err) {
      showNotification(err.error || 'Falha ao criar livro', 'error');
    }
  };

  // Clear form fields after close
  modalLogin.addEventListener('click', (e) => {
    if (e.target === modalLogin) {
      modalLogin.classList.remove('open');
      document.getElementById('loginEmail').value = '';
      document.getElementById('loginPassword').value = '';
    }
  });

  modalRegister.addEventListener('click', (e) => {
    if (e.target === modalRegister) {
      modalRegister.classList.remove('open');
      document.getElementById('registerName').value = '';
      document.getElementById('registerEmail').value = '';
      document.getElementById('registerPassword').value = '';
    }
  });

  modalNewBook.addEventListener('click', (e) => {
    if (e.target === modalNewBook) {
      modalNewBook.classList.remove('open');
      document.getElementById('newTitle').value = '';
      document.getElementById('newAuthor').value = '';
      document.getElementById('newYear').value = '';
      document.getElementById('newGenre').value = '';
      document.getElementById('newCover').value = '';
      document.getElementById('newContent').value = '';
    }
  });

  // Init
  Promise.all([
    checkAuthStatus(),
    loadFilters().then(fetchAndRender)
  ]).catch(err => {
    console.error(err);
    showNotification('Erro ao carregar a aplicação', 'error');
  });
});


