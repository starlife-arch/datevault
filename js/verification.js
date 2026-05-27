import { auth, db } from './firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { doc, updateDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
const verificationForm=document.getElementById('verificationForm'); const msg=document.getElementById('verificationMessage'); const inviteForm=document.getElementById('inviteForm');
onAuthStateChanged(auth,(user)=>{ if(!user) location.href='login.html';
if(verificationForm) verificationForm.onsubmit=async(e)=>{e.preventDefault(); const payload=Object.fromEntries(new FormData(verificationForm)); if(Number(payload.age)<18) return alert('Must be 18+'); await updateDoc(doc(db,'users',user.uid),{...payload,verificationStatus:'pending_admin_review'}); msg.textContent='Your verification is under review. You will receive access once approved.';};
if(inviteForm) inviteForm.onsubmit=async(e)=>{e.preventDefault(); const {inviteCode}=Object.fromEntries(new FormData(inviteForm)); const snap=await getDoc(doc(db,'users',user.uid)); const u=snap.data(); if(u.inviteCode===inviteCode && !u.inviteUsed){ await updateDoc(doc(db,'users',user.uid),{inviteUsed:true}); location.href='payment.html';} else {document.getElementById('inviteMessage').textContent='Invalid or used invite code.';}};
});
