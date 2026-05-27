import { auth, db } from './firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { collection, addDoc, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
const list=document.getElementById('chatList'); const form=document.getElementById('chatForm');
onAuthStateChanged(auth, async(user)=>{ if(!user) return location.href='login.html';
  form.onsubmit=async(e)=>{e.preventDefault(); const {toUid,message}=Object.fromEntries(new FormData(form)); await addDoc(collection(db,'messages'),{from:user.uid,to:toUid,message,createdAt:Date.now()});};
  const q=query(collection(db,'messages'),where('from','==',user.uid)); const snaps=await getDocs(q); list.innerHTML=''; snaps.forEach(s=>{const m=s.data(); list.innerHTML += `<article class='user-card'><strong>${m.to}</strong><p>${m.message}</p></article>`;});
});
