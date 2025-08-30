import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, deleteDoc, collection, addDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyC4Q3JNkzU0tH0-pRYQr85ufBTotw63imo",
  authDomain: "firstfish-e78c0.firebaseapp.com",
  projectId: "firstfish-e78c0",
  storageBucket: "firstfish-e78c0.firebasestorage.app",
  messagingSenderId: "348899039694",
  appId: "1:348899039694:web:171d8cee5a4b0de7d7b39f"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const q = (id) => document.getElementById(id);
const setStatus = (el, msg, t=2500) => { if (!el) return; el.textContent = msg; if (t) setTimeout(()=> el.textContent='', t); };

async function ensureAdmin(user) {
  if (!user) return false;
  const a = await getDoc(doc(db, 'admins', user.uid));
  return a.exists();
}

q('loginBtn').addEventListener('click', async () => {
  try {
    const email = q('email').value.trim();
    const password = q('password').value.trim();
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    setStatus(q('authStatus'), 'Ошибка входа: ' + e.message, 4000);
  }
});

q('logoutBtn').addEventListener('click', async () => { await signOut(auth); });

onAuthStateChanged(auth, async (user) => {
  const ok = await ensureAdmin(user);
  setStatus(q('authStatus'), user ? (ok ? 'Вход (admin)' : 'Вход (нет прав admin)') : 'Не авторизован');
  document.querySelectorAll('.admin-card:not(#auth)').forEach(s => s.style.display = ok ? '' : 'none');
});

async function upsert(collectionName, id, data) {
  if (id) { await setDoc(doc(db, collectionName, id), data, { merge: true }); return id; }
  const res = await addDoc(collection(db, collectionName), data); return res.id;
}

async function del(collectionName, id) {
  if (id) await deleteDoc(doc(db, collectionName, id));
}

// NEWS
q('newsSave').addEventListener('click', async () => {
  const id = await upsert('news', q('newsId').value.trim() || null, {
    title: q('newsTitle').value.trim(),
    text: q('newsText').value.trim(),
    dateLabel: q('newsDate').value.trim(),
    published: q('newsPublished').value === 'true'
  });
  q('newsId').value = id; setStatus(q('newsStatus'), 'Сохранено: ' + id);
});
q('newsDelete').addEventListener('click', async () => {
  await del('news', q('newsId').value.trim()); setStatus(q('newsStatus'), 'Удалено');
});

// PROMOTIONS
q('promoSave').addEventListener('click', async () => {
  const id = await upsert('promotions', q('promoId').value.trim() || null, {
    title: q('promoTitle').value.trim(),
    description: q('promoDesc').value.trim(),
    badge: q('promoBadge').value.trim(),
    dateLabel: q('promoDate').value.trim(),
    published: q('promoPublished').value === 'true'
  });
  q('promoId').value = id; setStatus(q('promoStatus'), 'Сохранено: ' + id);
});
q('promoDelete').addEventListener('click', async () => {
  await del('promotions', q('promoId').value.trim()); setStatus(q('promoStatus'), 'Удалено');
});

// BEERS
q('beerSave').addEventListener('click', async () => {
  const id = await upsert('beers', q('beerId').value.trim() || null, {
    title: q('beerTitle').value.trim(),
    description: q('beerDesc').value.trim(),
    price: q('beerPrice').value.trim(),
    category: (q('beerCategory').value.trim() || 'all').toLowerCase(),
    imageUrl: q('beerImage').value.trim(),
    published: q('beerPublished').value === 'true'
  });
  q('beerId').value = id; setStatus(q('beerStatus'), 'Сохранено: ' + id);
});
q('beerDelete').addEventListener('click', async () => {
  await del('beers', q('beerId').value.trim()); setStatus(q('beerStatus'), 'Удалено');
});

// VACANCIES
q('vacSave').addEventListener('click', async () => {
  const id = await upsert('vacancies', q('vacId').value.trim() || null, {
    title: q('vacTitle').value.trim(),
    salary: q('vacSalary').value.trim(),
    employment: q('vacEmployment').value.trim(),
    schedule: q('vacSchedule').value.trim(),
    experience: q('vacExperience').value.trim(),
    published: q('vacPublished').value === 'true'
  });
  q('vacId').value = id; setStatus(q('vacStatus'), 'Сохранено: ' + id);
});
q('vacDelete').addEventListener('click', async () => {
  await del('vacancies', q('vacId').value.trim()); setStatus(q('vacStatus'), 'Удалено');
});

// STORES
q('storeSave').addEventListener('click', async () => {
  const id = await upsert('stores', q('storeId').value.trim() || null, {
    title: q('storeTitle').value.trim(),
    address: q('storeAddress').value.trim(),
    phone: q('storePhone').value.trim(),
    hours: q('storeHours').value.trim(),
    published: q('storePublished').value === 'true'
  });
  q('storeId').value = id; setStatus(q('storeStatus'), 'Сохранено: ' + id);
});
q('storeDelete').addEventListener('click', async () => {
  await del('stores', q('storeId').value.trim()); setStatus(q('storeStatus'), 'Удалено');
});

// SOCIAL
q('socialSave').addEventListener('click', async () => {
  await setDoc(doc(db, 'config', 'social'), {
    vk: q('vkLink').value.trim(),
    telegram: q('tgLink').value.trim(),
    instagram: q('igLink').value.trim()
  }, { merge: true });
  setStatus(q('socialStatus'), 'Сохранено');
});


