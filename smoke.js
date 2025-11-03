(async ()=>{
  const base = 'http://localhost:3000';
  try{
    console.log('PING:');
    let r = await (await fetch(base + '/api/ping')).json();
    console.log(JSON.stringify(r));

    console.log('\nLIST BEFORE:');
    let list = await (await fetch(base + '/api/books')).json();
    console.log(JSON.stringify(list));

    console.log('\nTRY REGISTER:');
    try{
      const regResp = await fetch(base + '/api/auth/register', {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({name:'Demo User', email:'demo@example.com', password:'senha123'})
      });
      const reg = await regResp.json();
      console.log(JSON.stringify(reg));
    }catch(e){ console.log('Register failed', e.message) }

    console.log('\nLOGIN:');
    let loginResp = await fetch(base + '/api/auth/login', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email:'demo@example.com', password:'senha123'})});
    let login = await loginResp.json();
    console.log(JSON.stringify(login));
    const token = login.token;

    console.log('\nCREATE BOOK:');
    if(!token){ console.log('No token, skipping book create'); }
    else{
      let createResp = await fetch(base + '/api/books', {method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+token}, body: JSON.stringify({title:'Livro Demo', author:'Professor', year:2025, genre:'Tecnologia', cover:'', content:'Conteúdo demo.'})});
      let created = await createResp.json();
      console.log(JSON.stringify(created));
    }

    console.log('\nLIST AFTER:');
    let list2 = await (await fetch(base + '/api/books')).json();
    console.log(JSON.stringify(list2));

    console.log('\nGET INDEX LENGTH:');
    let html = await (await fetch(base + '/')).text();
    console.log('index length: ' + html.length);

    console.log('\nGET script.js LENGTH:');
    let js = await (await fetch(base + '/script.js')).text();
    console.log('script.js length: ' + js.length);

  }catch(err){
    console.error('Smoke test error:', err);
    process.exit(1);
  }
})();
