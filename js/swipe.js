import { auth, db } from './firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { doc, getDoc, setDoc, collection, addDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
const sample=[{uid:'u2',name:'Stella',age:21,bio:'Travel, jazz, vintage cafes',photo:'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop'}];
const swipeCard=document.getElementById('swipeCard'); const likesList=document.getElementById('likesList');
function renderCard(p){ if(!swipeCard) return; swipeCard.innerHTML=`<div><h3>${p.name}, ${p.age}</h3><p>${p.bio}</p></div>`; swipeCard.style.backgroundImage=`linear-gradient(180deg,transparent,#000),url(${p.photo})`; swipeCard.style.backgroundSize='cover';}
onAuthStateChanged(auth, async(user)=>{ if(!user) return; const me=(await getDoc(doc(db,'users',user.uid))).data(); if(!me.manualOverride && (!me.paid || me.verificationStatus!=='active_member')) return location.href='payment.html'; renderCard(sample[0]);
  document.querySelectorAll('[data-action]').forEach(btn=>btn.onclick=async()=>{const action=btn.dataset.action; if(action==='like'||action==='super'){await setDoc(doc(db,'likes',`${user.uid}_${sample[0].uid}`),{from:user.uid,to:sample[0].uid,superLike:action==='super',at:Date.now()});} if(action==='nope'){await addDoc(collection(db,'passes'),{from:user.uid,to:sample[0].uid,at:Date.now()});}});
  if(likesList) likesList.innerHTML=`<article class='user-card'><h4>${sample[0].name}</h4><p>Recently Active</p></article>`;
});
