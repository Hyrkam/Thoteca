// Simple test script to validate API endpoints
(async () => {
  const base = 'http://localhost:3000/api';
  try {
    console.log('PING:');
    let res = await (await fetch(base + '/ping')).json();
    console.log(res);

    console.log('\nTRY REGISTER:');
    try {
      res = await (await fetch(base + '/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Aluno', email: 'aluno@example.com', password: 'senha123' })
      })).json();
      console.log(res);
    } catch (e) {
      console.log('Register failed:', e.message || e);
    }

    console.log('\nLOGIN:');
    res = await (await fetch(base + '/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'aluno@example.com', password: 'senha123' })
    })).json();
    console.log(res);
    const token = res.token;

    console.log('\nCREATE BOOK:');
    try {
      res = await (await fetch(base + '/books', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ title: 'Livro Demo', author: 'Professor', year: 2025, genre: 'Tecnologia', cover: '', content: 'Conteúdo demo.' })
      })).json();
      console.log(res);
    } catch (e) {
      console.log('Create failed:', e.message || e);
    }

    console.log('\nLIST:');
    res = await (await fetch(base + '/books')).json();
    console.log(res);

  } catch (err) {
    console.error('Test script error:', err.message || err);
    process.exit(1);
  }
})();
